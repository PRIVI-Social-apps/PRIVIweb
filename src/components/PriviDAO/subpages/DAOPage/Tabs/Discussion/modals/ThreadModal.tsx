import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { MessageIcon } from "../../../index.styles";
import { threadModalStyles } from "./ThreadModal.styles";
import { RootState } from "store/reducers/Reducer";
import { setSelectedUser } from "store/actions/SelectedUser";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Color, Modal, StyledDivider } from "shared/ui-kit";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Box from "shared/ui-kit/Box";

type CreatorInfo = {
  name?: string;
  level?: string;
  url?: string;
};

export default function ThreadModal(props) {
  const classes = threadModalStyles();
  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [thread, setThread] = useState<any>(props.thread ?? {});

  const [response, setResponse] = useState("");
  const [responses, setResponses] = useState<any[]>(props.thread?.responses || []);
  const [responseLoader, setResponseLoader] = useState(false);
  const [status, setStatus] = useState<any>("");

  const [creator, setCreator] = useState<CreatorInfo>({
    name: "",
    url: "",
  });

  useEffect(() => {
    if (users && users.length > 0 && props.thread) {
      let t = { ...props.thread };
      if (t.comments && t.comments.length > 0) {
        t.comments.forEach((comment, index) => {
          if (users.some(user => user.id === comment.user.id)) {
            const thisUser = users[users.findIndex(user => user.id === comment.user.id)];
            t.comments[index].user = {
              ...comment.user,
              imageURL: thisUser.imageURL,
              name: thisUser.name,
            };
          }
        });
      }

      setThread(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  useEffect(() => {
    let user: any = users.find(usr => usr.id === props.thread.createdBy);
    setCreator({
      name: user.name,
      level: `level ${user.level}`,
      url: user.url,
    });
  }, [props.thread]);

  const makeResponse = () => {
    setResponseLoader(true);
    if (response) {
      let body = {
        discussionId: props.thread.id,
        userId: userSelector.id,
        userName: userSelector.firstName,
        response: response,
      };
      axios
        .post(`${URL()}/community/discussions/makeResponse`, body)
        .then(response => {
          if (response.data.success) {
            let responses: any[] = [...response.data.data];
            setResponses(responses);
            if (props.postResponsed) {
              props.postResponsed(responses.length);
            }
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
      setResponse("");
    }
  };

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      makeResponse();
    }
  };

  return thread && Object.keys(thread).length !== 0 && thread.constructor === Object ? (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.onClose}
      className={classes.root}
      showCloseIcon
      theme="dark"
    >
      <Box fontSize="30px" mb={3}>
        {thread.name}
      </Box>
      <Box fontWeight={800} mb={3}>
        {thread.textShort}
      </Box>

      <Box width="100%">
        <StyledDivider color={Color.White} type="solid" />
      </Box>

      <Box display="flex" alignItems="center" mt={3} mb={3}>
        <div
          className={classes.avatar}
          style={{
            backgroundImage: `url(${creator.url})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box marginLeft={1} fontFamily="Agrandir GrandLight">
          {creator.name}
        </Box>
      </Box>

      {thread.url && (
        <Box display="flex" flexDirection="column" mb={3}>
          <img src={thread.url} alt={thread.name} className={classes.postImage} />{" "}
        </Box>
      )}

      <Box display="flex" mb={3}>
        <div dangerouslySetInnerHTML={{ __html: props.thread.descriptionArray }} />
      </Box>

      <Box display="flex" alignItems="center" mb={3}>
        {thread.hashtags && thread.hashtags.length > 0 && (
          <Box display="flex" alignItems="center" mr={3}>
            {thread.hashtags.map((hashtag, i) => (
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
          responses.reverse().map((item, i) => <Response key={i} index={i} response={item} />)}
      </Box>

      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Modal>
  ) : null;
}

const Response = (props: any) => {
  const classes = threadModalStyles();
  const users = useSelector((state: RootState) => state.usersInfoList);

  const dispatch = useDispatch();
  const history = useHistory();

  const [responseContent, setResponseContent] = useState<any>({});

  useEffect(() => {
    if (users && users.length > 0 && props.response) {
      let response = { ...props.response };
      const usr = users[users.findIndex(user => user.id === response.userId)];
      response.url = usr.url;
      if (response.replies && response.replies.length > 0) {
        response.replies.forEach((comment, index) => {
          if (users.some(user => user.id === comment.user.id)) {
            const thisUser = users[users.findIndex(user => user.id === comment.user.id)];
            response.replies[index].user = {
              ...comment.user,
              imageURL: thisUser.imageURL,
              name: thisUser.name,
              level: thisUser.level,
              cred: thisUser.creds,
            };
          }
        });
      }

      setResponseContent(response);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  if (responseContent && Object.keys(responseContent).length !== 0 && responseContent.constructor === Object)
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
  else return null;
};
