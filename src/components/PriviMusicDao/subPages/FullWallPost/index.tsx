import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import axios from "axios";

import { Box, makeStyles } from "@material-ui/core";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { Color, FontSize, PrimaryButton, SecondaryButton, StyledDivider } from "shared/ui-kit";
import {
  ArrowLeftIcon,
  BackIcon,
  DiscussionIcon,
  LikeIcon,
  SaveIcon,
  useGovernanceStyles,
} from "../GovernancePage/styles";
import Avatar from "shared/ui-kit/Avatar";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";
import Moment from "react-moment";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useTypedSelector } from "store/reducers/Reducer";

const useStyles = makeStyles({
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
});

export default function FullWallPost() {
  const commonClasses = useGovernanceStyles();
  const classes = useStyles();

  const history = useHistory();
  const { podAddress: discussionId, wallPostId: wallPostId } =
    useParams<{ podAddress: string; wallPostId: string }>();

  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const [discussion, setDiscussion] = React.useState<any>({
    title: "The Supercycle: How Crypto Could Shape the Decade Ahead",
    imageURL: getRandomAvatar(),
    author: "Kilian Schönberger",
    schedulePost: new Date(),
    hashtags: ["memes", "defi", "bitcoin supercycle", "btc"],
    shortPreviewText:
      "Bitcoin traded lower as investors unpacked Wednesday’s announcement from the U.S. Federal Reserve that it could raise interest rates by late 2023. Assets deemed to be risky like stocks and crypto also appear to be weighed down by lingering concerns that the Fed may wind down its bond-buying program sooner than expected.",
  });
  const [comment, setComment] = React.useState<string>("");
  const [comments, setComments] = useState([
    {
      userAddress: "Px0",
      userName: "Kilian Schönberger",
      text: "The supercycle thesis is the bold but vague idea that crypto is on the verge of mass adoption. Here's how it works and what it means.",
      created: Date.now(),
    },
    {
      userAddress: "Px0",
      userName: "Kilian Schönberger",
      text: "The supercycle thesis is the bold but vague idea that crypto is on the verge of mass adoption. Here's how it works and what it means.",
      created: Date.now(),
    },
    {
      userAddress: "Px0",
      userName: "Kilian Schönberger",
      text: "The supercycle thesis is the bold but vague idea that crypto is on the verge of mass adoption. Here's how it works and what it means.",
      created: Date.now(),
    },
  ]);
  const [like, setLike] = React.useState<boolean>(false);

  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [successMsg, setSuccessMsg] = React.useState<string>("");

  React.useEffect(() => {
    if (discussionId) {
      //   trackPromise(
      //     axios
      //       .get(`${URL()}/musicDao/governance/discussions/getDetails/${discussionId}`)
      //       .then(response => {
      //         if (response.data.success) {
      //           const creator = users.find(user => user.id === response.data.data.creatorAddress);
      //           setDiscussion({
      //             ...response.data.data,
      //             imageURL: creator?.imageURL || getRandomAvatar(),
      //           });
      //         } else {
      //           setDiscussion(null);
      //           setErrorMsg("Error when making the request");
      //         }
      //       })
      //       .catch(err => {
      //         setErrorMsg("Error when making the request");
      //         console.log("==================", err);
      //       })
      //   );
    }
  }, [discussionId]);

  const addComment = () => {
    // axios
    //   .post(`${URL()}/musicDao/governance/discussions/reply`, {
    //     discussionId: discussion.id,
    //     text: comment,
    //     userAddress: user.id,
    //   })
    //   .then(res => {
    //     if (res.data.success) {
    //       setComment("");
    //       setSuccessMsg("Reply done");
    //       setTimeout(() => setSuccessMsg(""), 2000);
    //     }
    //   })
    //   .catch(err => {
    //     setErrorMsg("Error making reply");
    //   });
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
      <img src={require("assets/musicDAOImages/background.png")} width="100%" />
      {discussion ? (
        <Box
          position="absolute"
          top={0}
          left={0}
          px={21}
          mt={8}
          display="flex"
          flexDirection="column"
          width={"100%"}
          pb={5}
        >
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
          </Box>
          <Box className={classes.card} pl={11} pr={8} py={8} mt={5} mb={5}>
            <h2 className={classes.title}>{discussion.title}</h2>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mt={6}>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Avatar size={40} image={discussion.imageURL} rounded />
                <Box display="flex" flexDirection="column" ml={2}>
                  <Text bold>{discussion.author}</Text>
                  <Text size={FontSize.S}>
                    <Moment format="ddd, DD MMM YYYY">{discussion.schedulePost}</Moment>
                  </Text>
                </Box>
              </Box>
              <Box display="flex" flexDirection="row" alignItems="center">
                {discussion.hashtags && discussion.hashtags.length > 0 ? (
                  <>
                    {discussion.hashtags.map((tag, index) => (
                      <Box key={`discussion-tag-${index}`} className={classes.tag}>
                        {tag}
                      </Box>
                    ))}
                  </>
                ) : null}
              </Box>
            </Box>
            <StyledDivider type="solid" mt={2} mb={5} />
            <Box display="flex" flexDirection="column">
              <Text mb={3}>{discussion.shortPreviewText}</Text>
              <img
                className={classes.image}
                src={
                  "https://previews.123rf.com/images/irochka/irochka1802/irochka180200267/96705328-abstract-numbers-random-motion-in-the-form-of-coins-bitcoin-3d-animation-3d.jpg"
                }
              />
              <Text mt={5}>
                Some analysts, however, expect bitcoin to remain resilient if inflation continues to rise,
                which could lead to outperformance versus traditional markets. In a newsletter published on
                Wednesday, EQUOS, a digital asset financial services company, described the initial down move
                across risk assets as a “knee-jerk reaction.” “Bitcoin and stocks will likely correlate
                through the turbulence, before reality hits: Inflation is likely to see bitcoin outperform
                stocks,” EQUOS wrote.
              </Text>
              <Text mt={6}>
                Some analysts, however, expect bitcoin to remain resilient if inflation continues to rise,
                which could lead to outperformance versus traditional markets. In a newsletter published on
                Wednesday, EQUOS, a digital asset financial services company, described the initial down move
                across risk assets as a “knee-jerk reaction.” “Bitcoin and stocks will likely correlate
                through the turbulence, before reality hits: Inflation is likely to see bitcoin outperform
                stocks,” EQUOS wrote.
              </Text>
              <Text size={FontSize.XXL} bold mt={5}>
                Bitcoin negative funding rate
              </Text>
              <Text mt={4}>
                Since May, the cost to fund long positions in the market for bitcoin perpetual swaps, a type
                of derivative in the cryptocurrency markets similar to futures contracts in traditional
                markets, has been in negative territory. Such a scenario sometimes precedes spot price
                recoveries.
              </Text>
              <Text mt={3}>
                Iron Titanium token (TITAN), the share token of a decentralized finance (DeFi) protocol, has
                fallen to near zero from $60 in one day, bringing the worth of the protocol down from $2
                billion at one point to near zero.
              </Text>
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
          </Box>
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
              <PrimaryButton
                size="medium"
                onClick={() => addComment()}
                className={commonClasses.iconButton}
                isRounded
              >
                Add Comment
              </PrimaryButton>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" mt={4}>
            {comments.map((comment, index) => (
              <Box key={`discussion-comment-${index}`} display="flex" flexDirection="row" mb={2}>
                <Box display="flex" flexDirection="row" alignItems="center" width="25%" mr={2}>
                  <Avatar size={40} image={getRandomAvatar()} rounded />
                  <Box display="flex" flexDirection="column" ml={2}>
                    <Text bold>{comment.userName}</Text>
                    <Text size={FontSize.S}>
                      <Moment format="ddd, DD MMM YYYY">{comment.created}</Moment>
                    </Text>
                  </Box>
                </Box>
                <Box bgcolor={Color.White} borderRadius={12} px={9} py={2.5} width="75%">
                  <Text>{comment.text}</Text>
                </Box>
              </Box>
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
        </Box>
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
