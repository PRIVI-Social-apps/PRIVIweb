import React from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import Moment from "react-moment";

import { postCommentModalStyles } from "./index.styles";
import { Modal } from "shared/ui-kit";
import Avatar from "shared/ui-kit/Avatar";
import { useTypedSelector } from "store/reducers/Reducer";
import { getUser, getUsersInfoList } from "store/selectors";
import URL from "shared/functions/getURL";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import { MessageIcon } from "components/PriviDAO/subpages/DAOPage/index.styles";
import Box from "shared/ui-kit/Box";

const verified = require("assets/icons/verified.png");
const infoIcon = require("assets/icons/info_white.png");

const PostCommentModal = (props: any) => {
  const classes = postCommentModalStyles();
  const user = useTypedSelector(getUser);
  const usersInfoList = useTypedSelector(getUsersInfoList);
  const history = useHistory();
  const [comment, setComment] = React.useState<string>("");

  const isMembers = () => {
    if (user.id === props.community?.Creator) {
      return true;
    }
    if (props.community.Members) {
      return props.community.Members.find(member => member.id === user.id);
    }

    return false;
  };

  const postComment = () => {
    if (comment) {
      const body = {
        communityAddress: props.community.CommunityAddress,
        userId: user.id,
        userName: user.urlSlug ?? `${user.firstName} ${user.lastName}`,
        message: comment,
        contributeDate: props.contribution.date,
      };

      let contributions = props.community.Contributions;
      const commentObj: any = {
        userId: body.userId,
        userName: body.userName,
        message: body.message,
        date: new Date().getTime(),
      };

      contributions = contributions.map(contribution => {
        if (contribution.date === props.contribution.date) {
          return {
            ...contribution,
            comments: [...(contribution.comments || []), commentObj],
          };
        }
        return contribution;
      });

      Axios.post(`${URL()}/community/commentOnContribution`, body)
        .then(res => {
          if (res.data.success) {
            props.updateCommunity({ ...props.community, Contributions: contributions });
            setComment("");
          } else {
            console.error("handleConnect commentOnContribution failed");
          }
        })
        .catch(e => {
          console.error("handleConnect commentOnContribution failed", e);
        });
    }
  };

  return (
    <Modal isOpen={props.open} onClose={props.onClose} size="medium" showCloseIcon theme="dark">
      <div className={classes.modalContant}>
        <Box display="flex" flexDirection="row">
          <Box width={0.5} className={classes.header} pr={2}>
            <div
              className={classes.podImage}
              style={{
                backgroundImage: `url(${props.backgroundImage})`,
              }}
            />
          </Box>
          <Box
            width={0.5}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            className={classes.header}
            pl={2}
          >
            <div>
              <div>Contributor</div>
              <Box display="flex" flexDirection="row" alignItems="center" mt={2}>
                <Avatar image={props.user.imageURL} size={72} rounded bordered />
                <Box ml={3}>
                  <Box fontFamily="Agrandir GrandLight">{props.user.name}</Box>
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Box fontSize="14px" className={classes.gradient}>
                      @{props.user.urlSlug || props.user.id}
                    </Box>
                    <img className={classes.verified} src={verified} alt={"info"} />
                    <span className={classes.level}>{`level ${props.user.level || 1}`}</span>
                  </Box>
                </Box>
              </Box>
            </div>
            <Box display="flex" flexDirection="row" justifyContent="space-between">
              <Box display="flex" flexDirection="row">
                <Box mr={2}>
                  <MessageIcon />
                </Box>
                <Box fontSize="14px">{props.contribution?.comments?.length || 0} Responses</Box>
              </Box>
              <div
                className={classes.gradientGreen}
                onClick={() => {
                  history.push(`/profile/${props.contribution?.fromUserId}`);
                }}
              >
                Visit contributor’s page
              </div>
            </Box>
          </Box>
        </Box>
        {props.contribution.comments && (
          <div className={classes.messageBox}>
            {props.contribution.comments.map((comment, index) => {
              return (
                <div className={classes.messageItem} key={`comment_${index}`}>
                  <div
                    className={classes.avatar}
                    style={{
                      backgroundImage: usersInfoList.find(u => u.id === comment.userId)?.imageURL
                        ? `url(${usersInfoList.find(u => u.id === comment.userId)?.imageURL})`
                        : getRandomAvatar(),
                    }}
                  />
                  <Box className="bubble" ml={2}>
                    <div className={classes.name}>{comment.userName}</div>
                    <div className={classes.message}>{comment.message}</div>
                    <Moment format={"hh:mm a, DD MMM YYYY"} className={classes.message}>
                      {comment.date}
                    </Moment>
                  </Box>
                </div>
              );
            })}
          </div>
        )}
        {isMembers() && (
          <Box display="flex" flexDirection="row" mt={4} className={classes.label}>
            <Box>Add a Comment</Box>
            <img src={infoIcon} />
          </Box>
        )}
        {isMembers() && (
          <textarea
            className={classes.input}
            placeholder="Write your Comment here"
            rows={7}
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        )}
        {isMembers() && (
          <Box display="flex" flexDirection="row" justifyContent="flex-end" mt={6}>
            <DAOButton onClick={postComment}>Post your Comment</DAOButton>
          </Box>
        )}
      </div>
    </Modal>
  );
};

export default PostCommentModal;
