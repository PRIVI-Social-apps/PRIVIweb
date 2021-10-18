import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Moment from "react-moment";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactPlayer from "react-player";

import { Box } from "@material-ui/core";

import { blogPostModalStyles } from "./BlogPostModal.styles";
import { setSelectedUser } from "store/actions/SelectedUser";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import DiscordVideoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordVideoFullScreen/DiscordVideoFullScreen";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Color, Modal, StyledDivider } from "shared/ui-kit";
import { MessageIcon } from "components/PriviDAO/subpages/DAOPage/index.styles";

type CreatorInfo = {
  name?: string;
  url?: string;
};

const BlogPostModal = React.memo(
  ({ open, onClose, post }: { open: boolean; onClose: () => void | any; post: any }) => {
    const users = useSelector((state: RootState) => state.usersInfoList);
    const classes = blogPostModalStyles();

    const [responses, setResponses] = useState<any[]>([]);

    const [urlMainPhoto, setUrlMainPhoto] = useState<string>("");

    const [videoUrl, setVideoUrl] = useState<string>("");

    const [creator, setCreator] = useState<CreatorInfo>({
      name: "",
      url: "",
    });

    useEffect(() => {
      if (post.responses) setResponses(post.responses);

      setUrlMainPhoto(post.id ? `${URL()}/community/blog/getPostPhoto/${post.id}` : post.url ?? "");
      post.id && post.videos;
      post.videos[0] && setVideoUrl(post.videos[0]?.url);

      let user: any = users.find(usr => usr.id === post.createdBy);
      if (user)
        setCreator({
          name: user.name,
          url: user.url,
        });

      //eslint-disable react-hooks/exhaustive-deps
    }, [post]);

    return (
      <Modal
        size="medium"
        isOpen={open}
        onClose={onClose}
        className={classes.root}
        showCloseIcon
        theme="dark"
      >
        <BlogPostModalContent
          creator={creator}
          post={post}
          urlMainPhoto={urlMainPhoto}
          videoUrl={videoUrl}
          responses={responses}
          setResponses={setResponses}
        />
      </Modal>
    );
  }
);

export const BlogPostModalContent = ({
  post,
  creator,
  urlMainPhoto,
  videoUrl,
  responses = [],
  setResponses,
  onlyPreview,
}: {
  post: any;
  creator: any;
  urlMainPhoto?: any;
  videoUrl?: any;
  responses?: any[];
  setResponses?: Dispatch<SetStateAction<any[]>>;
  onlyPreview?: boolean;
}) => {
  const userSelector = useSelector((state: RootState) => state.user);

  const classes = blogPostModalStyles();

  const pRef = React.useRef<HTMLParagraphElement>(null);

  const [response, setResponse] = useState("");
  const [responseLoader, setResponseLoader] = useState(false);

  const [status, setStatus] = useState<any>("");

  const makeResponse = () => {
    setResponseLoader(true);
    if (response && setResponses) {
      let body = {
        blogPostId: post.id,
        userId: userSelector.id,
        userName: userSelector.firstName,
        response: response,
      };
      axios
        .post(`${URL()}/community/blog/makeResponse`, body)
        .then(response => {
          if (response.data.success) {
            let responses: any[] = [...response.data.data];
            setResponses(responses);
            setResponse("");
            setResponseLoader(false);
          } else {
            console.log(response.data.error);
            setResponseLoader(false);
            setStatus({
              msg: "Error making request",
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(error => {
          console.log(error);
          setResponseLoader(false);
          setStatus({
            msg: "Error making request",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  };

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      makeResponse();
    }
  };

  const [openModalDiscordVideoFullScreen, setOpenModalDiscordVideoFullScreen] = useState<boolean>(false);
  const handleOpenModalDiscordVideoFullScreen = () => {
    setOpenModalDiscordVideoFullScreen(true);
  };
  const handleCloseModalDiscordVideoFullScreen = () => {
    setOpenModalDiscordVideoFullScreen(false);
  };

  useEffect(() => {
    if (pRef.current) {
      pRef.current.innerHTML = post.descriptionArray;
    }
  }, [pRef.current, post.descriptionArray]);

  return (
    <>
      <Box fontSize="30px" mb={3}>
        {post.name}
      </Box>
      <Box fontWeight={800} mb={3}>
        {post.textShort}
      </Box>

      <Box width="100%">
        <StyledDivider color={Color.White} type="solid" />
      </Box>

      <Box display="flex" alignItems="center" mt={3} mb={3}>
        <div
          className={classes.avatar}
          style={{
            backgroundImage: creator?.url && creator?.url.length > 0 ? `url(${creator?.url})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box marginLeft={1} fontFamily="Agrandir GrandLight">
          {creator?.name || ""}
        </Box>
      </Box>

      {post.hasPhoto && post.id && (
        <Box display="flex" flexDirection="column" mb={3}>
          <img src={urlMainPhoto} alt={post.name} className={classes.postImage} />{" "}
        </Box>
      )}
      {videoUrl ? (
        <Box mb={3} width="100%">
          <ReactPlayer
            onClick={() => {
              handleOpenModalDiscordVideoFullScreen();
            }}
            url={videoUrl}
            className={classes.reactPlayer}
            progressInterval={200}
          />
          <Modal
            size="medium"
            className={classes.reactPlayerModal}
            isOpen={openModalDiscordVideoFullScreen}
            onClose={handleCloseModalDiscordVideoFullScreen}
            showCloseIcon
            theme="dark"
          >
            <DiscordVideoFullScreen onCloseModal={handleCloseModalDiscordVideoFullScreen} url={videoUrl} />
          </Modal>
        </Box>
      ) : null}

      {post.descriptionArray && (
        <Box display="flex" mb={3}>
          <p ref={pRef} />
        </Box>
      )}

      <Box display="flex" alignItems="center" mb={3}>
        {post.hashtags && post.hashtags.length > 0 && (
          <Box display="flex" alignItems="center" mr={3}>
            {post.hashtags.map((hashtag, i) => (
              <Box key={i} color="#A306BA" mr={3}>
                {hashtag}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box width="100%">
        <StyledDivider color={Color.White} type="solid" />
      </Box>

      <Box mb={1} mt={3}>
        Leave a Comment
      </Box>
      <Box className={classes.commentButtonWrapper}>
        <LoadingWrapper theme="dark" loading={responseLoader}>
          <input
            type="text"
            placeholder="Comment..."
            value={response}
            onChange={e => {
              let res = e.target.value;
              setResponse(res);
            }}
            onKeyDown={handleKeyDown}
            disabled={onlyPreview}
          />
          <button onClick={makeResponse}>
            <img src={require("assets/icons/send_white_2.png")} alt="send" />
          </button>
        </LoadingWrapper>
      </Box>
      <Box display="flex" alignItems="center" fontSize="14px" mt={3} mb={3}>
        <MessageIcon />
        <Box ml={"12px"}>
          {responses && responses.length
            ? `${responses.length} Comment${responses.length > 1 ? "s" : ""}`
            : "0 Comments"}
        </Box>
      </Box>
      <Box width="100%">
        {responses &&
          responses.length > 0 &&
          responses.map((item, i) => <ResponseWallPost key={i} response={item} />)}
      </Box>

      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </>
  );
};

export default BlogPostModal;

const ResponseWallPost = ({ response }) => {
  const classes = blogPostModalStyles();
  const users = useSelector((state: RootState) => state.usersInfoList);

  const dispatch = useDispatch();
  const history = useHistory();

  const [responseContent, setResponseContent] = useState<any>({});

  useEffect(() => {
    if (users && users.length > 0 && response) {
      let r = { ...response };
      const usr = users[users.findIndex(user => user.id === r.userId)];
      r.url = usr.url;

      setResponseContent(r);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  return (
    <Box width="100%" mb={3}>
      <Box display="flex" alignItems="center" mb={1}>
        <div
          onClick={() => {
            history.push(`/profile/${responseContent.user.id}`);
            dispatch(setSelectedUser(responseContent.user.id));
          }}
          className={classes.avatar}
          style={{
            backgroundImage: `url(${responseContent.url})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box marginLeft={1} fontFamily="Agrandir GrandLight">
          {responseContent.userName}
        </Box>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between" fontSize="16px">
        <Box>{responseContent.response}</Box>
        <Box color="#707582">
          <Moment format="DD/MM/YYYY">{responseContent.date}</Moment>
        </Box>
      </Box>
    </Box>
  );
};
