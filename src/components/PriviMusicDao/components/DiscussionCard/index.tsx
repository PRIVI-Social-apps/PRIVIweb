import React from "react";
import Moment from "react-moment";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core";

import Avatar from "shared/ui-kit/Avatar";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { Color, FontSize, PrimaryButton } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';
import { useTypedSelector } from "store/reducers/Reducer";
import { getUsersInfoList } from "store/selectors";
import { Text } from "../ui-kit";

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    background: Color.White,
    boxShadow: "0px 25px 36px -11px rgba(0, 0, 0, 0.02)",
    borderRadius: 20,
    padding: "32px 40px",
    cursor: "pointer",
    "& + &": {
      marginTop: 20,
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'column',
    },
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    [theme.breakpoints.down("xs")]: {
      marginBottom: 16,
    },
  },
  replyButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D6F0D5 !important",
    fontSize: "12px !important",
    color: `${Color.MusicDAODark} !important`,
    "& svg": {
      marginLeft: 8,
    },
  },
  avatarName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2D3047'
  },
  avatarDate: {
    fontSize: 12,
    fontWeight: 500,
    color: '#2D3047',
    opacity: 0.8
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2D3047',
    opacity: 0.9,
    marginBottom: 12
  },
  description: {
    fontSize: 13,
    fontWeight: 500,
    color: '#2D3047',
    opacity: 0.8,
  },
  replyComments: {
    fontSize: 12,
    fontWeight: 500,
    color: '#2D3047',
    opacity: 0.7,
    marginLeft: 8
  }
}));

export default function DiscussionCard({ discussion }) {
  const classes = useStyles();
  const users = useTypedSelector(getUsersInfoList);

  const history = useHistory();

  return (
    <div
      className={classes.container}
      onClick={() => history.push(`/privi-music-dao/governance/discussion_detail/${discussion.id}`)}
    >
      <div className={classes.avatarSection}>
        <Avatar
          size={40}
          image={
            users.find(u => u.id === discussion.creatorAddress)?.imageURL ??
            getRandomAvatarForUserIdWithMemoization(discussion.creatorAddress)
          }
          rounded
        />
        <Box display="flex" flexDirection="column" ml={2}>
          <div className={classes.avatarName}>{discussion.author}</div>
          <div className={classes.avatarDate}>
            <Moment format="ddd, DD MMM YYYY">{discussion.schedulePost}</Moment>
          </div>
        </Box>
      </div>
      <Box display="flex" flexDirection="column" flex={5}>
        <div className={classes.title}>
          {discussion.title}
        </div>
        <div className={classes.description}>{discussion.shortPreviewText}</div>
        <Box display="flex" flexDirection="row" justifyContent="space-between" mt={3}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <MessageIcon />
            <div className={classes.replyComments}>{discussion.numReplies || 0} Replies</div>
          </Box>
          <PrimaryButton size="small" className={classes.replyButton}>
            Reply
            <ReturnIcon />
          </PrimaryButton>
        </Box>
      </Box>
    </div>
  );
}

const MessageIcon = () => (
  <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
    <path
      opacity="0.7"
      d="M10.6246 0.374786H1.87507C0.812132 0.374786 0 1.18692 0 2.24986V7.25046C0 8.2501 0.812132 9.12554 1.87507 9.12554H8.12492L10.6246 11.6252V9.12554C11.6876 9.12554 12.4997 8.2501 12.4997 7.25046V2.24986C12.4997 1.18809 11.6876 0.374786 10.6246 0.374786Z"
      fill="#65CB63"
    />
  </svg>
);

const ReturnIcon = () => (
  <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
    <path
      d="M9.97988 0.140015L15.3799 4.64001L9.97988 9.14001V6.80001C9.67332 6.78595 4.33166 6.61368 0.619883 9.86001C2.10558 5.28333 6.77084 3.29217 9.97988 2.48001V0.140015Z"
      fill="#2D3047"
    />
  </svg>
);
