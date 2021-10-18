import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import axios from "axios";
import Moment from "react-moment";

import { makeStyles } from "@material-ui/core";

import { Text } from "components/PriviMusicDao/components/ui-kit";
import { Color, FontSize, PrimaryButton, SecondaryButton, StyledDivider } from "shared/ui-kit";
import Avatar from "shared/ui-kit/Avatar";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useTypedSelector } from "store/reducers/Reducer";
import Box from 'shared/ui-kit/Box';
import { ArrowLeftIcon, BackIcon, DiscussionIcon, LikeIcon, SaveIcon, useGovernanceStyles } from "./styles";

const useStyles = makeStyles(theme => ({
  mainContent: {
    background: Color.White,
    boxShadow: "0px 30px 35px -12px rgba(29, 103, 84, 0.03)",
    borderRadius: 12,
    padding: 64,
    marginTop: 40,
    marginBottom: 40,
    [theme.breakpoints.down("xs")]: {
      padding: '64px 16px',
    },
  },
  card: {
    background: Color.White,
    boxShadow: "0px 30px 35px -12px rgba(29, 103, 84, 0.03)",
    borderRadius: 12,
  },
  title: {
    fontSize: 42,
    lineLeight: "150%",
    color: Color.MusicDAODark,
    marginBlock: 0,
    [theme.breakpoints.down("xs")]: {
      fontSize: 26,
      fontWeight: 600
    },
  },
  creatorSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 48,
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  creatorItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [theme.breakpoints.down("xs")]: {
      marginTop: 16
    },
  },
  tag: {
    color: Color.MusicDAODark,
    background: Color.MusicDAOLightGreen,
    borderRadius: 5,
    padding: "5px 10px",
    fontSize: 10,
    "& + &": {
      marginLeft: 8,
    },
  },
  image: {
    width: "100%",
    borderRadius: 29,
  },
  iconContainer: {
    "& svg": {
      marginRight: 16,
    },
  },
  commentInput: {
    width: "100%",
    height: 53,
    marginBottom: 16,
    background: "rgba(218, 230, 229, 0.6)",
    border: "1px solid #65CB63",
    boxSizing: "border-box",
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 16,
    fontSize: 14,
    color: Color.MusicDAODark,
  },
  pointer: {
    cursor: "pointer",
  },
  replyContent: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 16,
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'column',
    },
  },
  replyAvatarSection: {
    display: "flex",
    flexDirectio: "row",
    alignItems: "center",
    width: "25%",
    marginRight: 16,
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  replyMainSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: '27px 20px',
    width:  "75%",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: 8
    },
  }
}));

export default function DiscussionDetail() {
  const commonClasses = useGovernanceStyles();
  const classes = useStyles();

  const history = useHistory();
  const { id: discussionId } = useParams<{ id: string }>();

  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const [discussion, setDiscussion] = React.useState<any>(null);
  const [comment, setComment] = React.useState<string>("");
  const [like, setLike] = React.useState<boolean>(false);

  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [successMsg, setSuccessMsg] = React.useState<string>("");

  React.useEffect(() => {
    if (discussionId) {
      trackPromise(
        axios
          .get(`${URL()}/musicDao/governance/discussions/getDetails/${discussionId}`)
          .then(response => {
            if (response.data.success) {
              setDiscussion({
                ...response.data.data,
              });
            } else {
              setDiscussion(null);
              setErrorMsg("Error when making the request");
            }
          })
          .catch(err => {
            setErrorMsg("Error when making the request");
            console.log("==================", err);
          })
      );
    }
  }, [discussionId]);

  const addComment = () => {
    axios
      .post(`${URL()}/musicDao/governance/discussions/reply`, {
        discussionId: discussion.id,
        text: comment,
        userAddress: user.id,
      })
      .then(res => {
        if (res.data.success) {
          setComment("");
          setSuccessMsg("Reply done");
          setDiscussion(prev => ({
            ...prev,
            replies: [
              { created: new Date().getTime(), text: comment, userId: user.id },
              ...(prev.replies || []),
            ],
          }));
          setTimeout(() => setSuccessMsg(""), 2000);
        }
      })
      .catch(err => {
        setErrorMsg("Error making reply");
      });
  };

  const handleChangeComment = e => {
    setComment(e.target.value);
  };

  const handleLike = () => {
    if (!like) {
      axios
        .post(`${URL()}/musicDao/governance/discussions/like`, {
          discussionId: discussion.id,
          userId: user.id,
        })
        .then(res => {
          if (res.data.success) {
            setLike(true);
          } else {
            setErrorMsg("Error like");
          }
        })
        .catch(err => {
          setErrorMsg("Error like");
          console.log(err);
        });
    } else {
      axios
        .post(`${URL()}/musicDao/governance/discussions/dislike`, {
          discussionId: discussion.id,
          userId: user.id,
        })
        .then(res => {
          if (res.data.success) {
            setLike(false);
          } else {
            setErrorMsg("Error dislike");
          }
        })
        .catch(err => {
          setErrorMsg("Error dislike");
          console.log(err);
        });
    }
  };

  return (
    <Box position="relative">
      <div className={commonClasses.headerImage}>
        <img src={require("assets/musicDAOImages/background.png")} width="100%" height="100%" />
      </div>
      {discussion ? (
        <div className={commonClasses.content}>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box
              display="flex"
              flexDirection="row"
              className={commonClasses.back}
              onClick={() => history.goBack()}
            >
              <BackIcon />
              <Text ml={1} color={Color.White} bold>
                BACK
              </Text>
            </Box>
            <PrimaryButton size="medium" className={commonClasses.iconButton}>
              New discussion
              <DiscussionIcon />
            </PrimaryButton>
          </Box>
          <div className={classes.mainContent}>
            <h2 className={classes.title}>{discussion.title}</h2>
            <div className={classes.creatorSection}>
              <div className={classes.creatorItem}>
                <Avatar size={40} image={discussion.imageURL} rounded />
                <Box display="flex" flexDirection="column" ml={2}>
                  <Text bold>{discussion.author}</Text>
                  <Text size={FontSize.S}>
                    <Moment format="ddd, DD MMM YYYY">{discussion.schedulePost}</Moment>
                  </Text>
                </Box>
              </div>
              <div className={classes.creatorItem}>
                {discussion.hashtags && discussion.hashtags.length > 0 ? (
                  <>
                    {discussion.hashtags.map((tag, index) => (
                      <Box key={`discussion-tag-${index}`} className={classes.tag}>
                        {tag}
                      </Box>
                    ))}
                  </>
                ) : null}
              </div>
            </div>
            <StyledDivider type="solid" mt={2} mb={5} />
            <Box display="flex" flexDirection="column">
              <Text mb={3}>{discussion.shortPreviewText}</Text>
              <img
                className={classes.image}
                src={
                  "https://previews.123rf.com/images/irochka/irochka1802/irochka180200267/96705328-abstract-numbers-random-motion-in-the-form-of-coins-bitcoin-3d-animation-3d.jpg"
                }
              />
              <Box mt={5} dangerouslySetInnerHTML={{ __html: discussion.fullText }} />
            </Box>
            <StyledDivider type="solid" mt={5} mb={2} />
            <Box display="flex" flexDirection="row" alignItems="center" className={classes.iconContainer}>
              <Box className={classes.pointer} onClick={handleLike}>
                <LikeIcon color={like ? Color.MusicDAOGreen : Color.MusicDAODark} />
              </Box>
              <Box className={classes.pointer}>
                <SaveIcon />
              </Box>
            </Box>
          </div>
          <Text size={FontSize.XXL} bold>
            User replies
          </Text>
          <Box className={classes.card} px={5} py={4} mt={2.5}>
            <input
              placeholder="Type your response here"
              className={classes.commentInput}
              value={comment}
              onChange={handleChangeComment}
            />
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <PrimaryButton size="medium" onClick={() => addComment()} className={commonClasses.iconButton}>
                Add Comment
              </PrimaryButton>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" mt={4}>
            {discussion.replies?.map((comment, index) => (
              <div key={`discussion-comment-${index}`} className={classes.replyContent}>
                <div className={classes.replyAvatarSection}>
                  <Avatar
                    size={40}
                    image={
                      users.find(u => u.id === comment.userId)?.imageURL ??
                      getRandomAvatarForUserIdWithMemoization(comment.userId)
                    }
                    rounded
                  />
                  <Box display="flex" flexDirection="column" ml={2}>
                    <Text bold>
                      {users.find(u => u.id === comment.userId)?.name ||
                        users.find(u => u.id === comment.userId)?.urlSlug}
                    </Text>
                    <Text size={FontSize.S}>
                      <Moment format="ddd, DD MMM YYYY">{comment.created}</Moment>
                    </Text>
                  </Box>
                </div>
                <div className={classes.replyMainSection}>
                  <Text>{comment.text}</Text>
                </div>
              </div>
            ))}
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="center" mt={4}>
            <SecondaryButton className={commonClasses.showAll} size="medium" radius={29}>
              Show All
              <Box position="absolute" flexDirection="row" top={0} right={0} pr={2}>
                <ArrowLeftIcon />
              </Box>
            </SecondaryButton>
          </Box>
        </div>
      ) : (
        <></>
      )}
      {errorMsg && (
        <AlertMessage
          key={Math.random()}
          message={errorMsg}
          variant="error"
          onClose={() => setErrorMsg("")}
        />
      )}
      {successMsg && (
        <AlertMessage
          key={Math.random()}
          message={successMsg}
          variant="success"
          onClose={() => setSuccessMsg("")}
        />
      )}
    </Box>
  );
}
