import React from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import Moment from "react-moment";

import { postCommentModalStyles } from "./PostCommentModal.styles";
import { Modal, Header4, Header5, Header6, HeaderBold4, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import Avatar from "shared/ui-kit/Avatar";
import { useTypedSelector } from "store/reducers/Reducer";
import { getUser } from "store/selectors";
import URL from "shared/functions/getURL";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";

const verifiedMint = require("assets/icons/verified_mint.png");
const infoIcon = require("assets/icons/info.svg");

const MessageIcon = () => (
  <svg width="22" height="23" viewBox="0 0 22 23" fill="none">
    <path
      d="M21.2335 1.01587H1.04663V16.0635H4.83168V22.3333L11.1401 16.0635H21.2335V1.01587Z"
      stroke="#727F9A"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const PostCommentModal = (props: any) => {
  const classes = postCommentModalStyles();
  const user = useTypedSelector(getUser);
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
    <Modal isOpen={props.open} onClose={props.onClose} size="medium" showCloseIcon>
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
            <Box>
              <Header4>Contributor</Header4>
              <Box display="flex" flexDirection="row" alignItems="center" mt={2}>
                <Avatar image={`${props.user.url}?${Date.now()}`} size={72} rounded bordered />
                <Box ml={3}>
                  <HeaderBold4>{props.user.name}</HeaderBold4>
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <div className={classes.gradient}>@{props.user.urlSlug || props.user.id}</div>
                    <img className={classes.verified} src={verifiedMint} alt={"info"} />
                    <span className={classes.level}>{`level ${props.user.level || 1}`}</span>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="space-between">
              <Box display="flex" flexDirection="row">
                <Box mr={2}>
                  <MessageIcon />
                </Box>
                <Header6 noMargin>{props.contribution?.comments?.length || 0} Responses</Header6>
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
                <Box className={classes.messageItem} key={`comment_${index}`}>
                  <Box
                    className={classes.avatar}
                    style={{
                      backgroundImage: comment.url ? `${comment.url}?${Date.now()}` : getRandomAvatar(),
                    }}
                  />
                  <Box className="bubble" ml={2}>
                    <Box className={classes.name}>{comment.userName}</Box>
                    <Box className={classes.message}>{comment.message}</Box>
                    <Moment format={"hh:mm a, DD MMM YYYY"} className={classes.message}>
                      {comment.date}
                    </Moment>
                  </Box>
                </Box>
              );
            })}
          </div>
        )}
        {isMembers() && (
          <Box display="flex" flexDirection="row" mt={4} className={classes.label}>
            <Header5 noMargin>Add a Comment</Header5>
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
          <Box display="flex" flexDirection="row" justifyContent="flex-end" mt={5}>
            <PrimaryButton size="medium" onClick={postComment}>
              Post your Comment
            </PrimaryButton>
          </Box>
        )}
      </div>
    </Modal>
  );
};

export default PostCommentModal;
