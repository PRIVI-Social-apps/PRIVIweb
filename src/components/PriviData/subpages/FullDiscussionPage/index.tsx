import React, { useState } from "react";
import Box from "shared/ui-kit/Box";
import Moment from "react-moment";
import Axios from "axios";
import { useHistory, useParams } from "react-router-dom";

import { ReactComponent as DiscussionIcon } from "assets/icons/discussion.svg";
import { ReactComponent as HeartIcon } from "assets/icons/heart-regular.svg";
import { ReactComponent as UploadIcon } from "assets/icons/upload_arrow.svg";

import { useTypedSelector } from "store/reducers/Reducer";
import CreateNewDiscussionModal from "components/PriviData/modals/CreateNewDiscussionModal";

import { fullDiscussionsPageStyles } from "./index.styles";
import { ArrowIcon } from "../../components/Icons/SvgIcons";
import { Avatar } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

export default function FullDiscussionPage() {
  const classes = fullDiscussionsPageStyles();
  const history = useHistory();
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);
  const params = useParams() as any;

  const [discussion, setDiscussion] = React.useState<any>();
  const [showAllMessage, setShowAllMessage] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [openCreateNewDiscussionModal, setOpenCreateNewDiscussionModal] = useState<boolean>(false);

  React.useEffect(() => {
    Axios.get(`${URL()}/privi-data/getDiscussionById/${params.id}`).then(res => {
      const resp = res.data;
      if (resp.success) {
        setDiscussion(resp.data);
      }
    });
  }, []);

  const addComment = () => {
    const body = {
      userId: user.id,
      comment: comment,
    };
    Axios.post(`${URL()}/privi-data/createComment/${params.id}`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        setComment("");
        setDiscussion(prev => ({
          ...prev,
          replies: [{ ...body, date: new Date().getTime() }, ...prev.replies],
        }));
      }
    });
  };

  return (
    <Box className={classes.content}>
      <LoadingWrapper loading={!Boolean(discussion)}>
        {discussion && (
          <Box className={classes.subContent}>
            <Box className={classes.gradient}></Box>
            <Box className={classes.flexBox} mt={3} justifyContent="space-between">
              <Box
                className={classes.flexBox}
                style={{ color: "white", cursor: "pointer " }}
                onClick={() => {
                  history.goBack();
                }}
              >
                <Box color="#AFACD7">
                  <ArrowIcon />
                </Box>
                <Box color="#AFACD7" fontSize={14} fontWeight={700} fontFamily="Agrandir" ml="5px" mb="4px">
                  BACK
                </Box>
              </Box>
              <Box
                className={classes.selectedButtonBox}
                ml={4}
                onClick={() => setOpenCreateNewDiscussionModal(true)}
              >
                <Box className={classes.header2} mr={1}>
                  New discussion
                </Box>
                <DiscussionIcon />
              </Box>
            </Box>
            <Box className={classes.discussionDetailBox} mt={3}>
              <Box className={classes.title}>{discussion.title}</Box>
              <Box
                className={classes.flexBox}
                mt={3}
                justifyContent="space-between"
                pb={2}
                style={{ borderBottom: "2px solid #61658A" }}
              >
                <Box className={classes.flexBox}>
                  <Box className={classes.avatarBox}>
                    <Avatar
                      size="small"
                      url={
                        users.find(user => user.id === discussion.creatorId)?.imageUrl ??
                        require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")
                      }
                    />
                    <Box className={classes.online} />
                  </Box>
                  <Box ml={2}>
                    <Box className={classes.header2}>
                      {users.find(user => user.id === discussion.creatorId)?.urlSlug}
                    </Box>
                    <Moment format="ddd DD MMM, YYYY" className={classes.header2}>
                      {new Date(Number(discussion.created))}
                    </Moment>
                  </Box>
                </Box>
                <Box className={classes.flexBox}>
                  {discussion?.tags.map((item, index) => (
                    <Box key={index} className={classes.tagBox} mr={1}>
                      <Box className={classes.header2}>{item}</Box>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box className={classes.header2} mt={3}>
                {discussion.shortDescription}
              </Box>
              <Box className={classes.imgBox} mt={3} height="450px">
                <img src={discussion.photoUrl} width="100%" height="100%" style={{ objectFit: "cover" }} />
              </Box>
              <Box className={classes.header2} mt={3}>
                {discussion.description}
              </Box>
              <Box mt={3} className={classes.flexBox}>
                <Box className={classes.iconBox}>
                  <HeartIcon style={{ color: "white" }} />
                </Box>
                <Box className={classes.iconBox} ml={2}>
                  <UploadIcon style={{ color: "white" }} />
                </Box>
              </Box>
            </Box>
            <Box className={classes.header1} mt={3}>
              User replies
            </Box>
            <Box mt={2} width={1} py={2} px={3} className={classes.blackBox}>
              <InputWithLabelAndTooltip
                placeHolder="Type your response here..."
                type="text"
                inputValue={comment}
                onInputValueChange={e => setComment(e.target.value)}
                theme="dark"
                style={{ background: "rgba(38, 37, 75, 0.7)", borderRadius: "6px" }}
              />
              <Box className={classes.flexBox} justifyContent="flex-end" mt={1}>
                <Box className={classes.selectedButtonBox} mr={1} onClick={addComment}>
                  <Box className={classes.header2}>Add Comment</Box>
                </Box>
              </Box>
            </Box>
            <Box mt={3}>
              {discussion.replies
                .filter((_, index) => showAllMessage || index < 4)
                .map((message, index) => (
                  <Box className={classes.flexBox} key={index} mb={1}>
                    <Box className={classes.flexBox} width={"30%"}>
                      <Box className={classes.avatarBox}>
                        <Avatar
                          size="small"
                          url={require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")}
                        />
                        <Box className={classes.online} />
                      </Box>
                      <Box ml={2}>
                        <Box className={classes.header2}>
                          {users.find(user => user.id === message.userId)?.name}
                        </Box>
                        <Moment format="ddd DD MMM, YYYY" className={classes.header2}>
                          {new Date(Number(message.date))}
                        </Moment>
                      </Box>
                    </Box>
                    <Box width={"70%"} ml={2} p={2} className={`${classes.blackBox} ${classes.header2}`}>
                      {message.comment}
                    </Box>
                  </Box>
                ))}
            </Box>
            {!showAllMessage && discussion.replies.length > 4 && (
              <Box className={classes.flexBox} justifyContent="center" mt={2}>
                <Box className={classes.secondButtonBox} onClick={() => setShowAllMessage(true)}>
                  <Box className={classes.header2}>Show All Comments</Box>
                  <img src={require("assets/icons/arrow_right_white.png")} />
                </Box>
              </Box>
            )}
          </Box>
        )}
      </LoadingWrapper>
      {openCreateNewDiscussionModal && (
        <CreateNewDiscussionModal
          open={openCreateNewDiscussionModal}
          handleClose={() => setOpenCreateNewDiscussionModal(false)}
        />
      )}
    </Box>
  );
}
