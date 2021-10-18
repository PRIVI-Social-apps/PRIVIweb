import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Axios from "axios";
import Moment from "react-moment";

import { Grid, Hidden } from "@material-ui/core";

import { Avatar, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import { ReactComponent as UploadIcon } from "assets/icons/upload_arrow.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { useTypedSelector } from "store/reducers/Reducer";
import { getUser, getUsersInfoList } from "store/selectors";
import {
  ArrowIcon,
  DiscussionOneIcon,
  RectangleCheckedIcon,
  RectangleUncheckedStrokeIcon,
} from "../../components/Icons/SvgIcons";
import { fullVotePageStyles } from "./index.styles";

export default function FullVote() {
  const params: any = useParams();
  const classes = fullVotePageStyles();
  const [vote, setVote] = useState<any>();
  const [loadingVote, setLoadingVote] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  const user = useTypedSelector(getUser);
  const users = useTypedSelector(getUsersInfoList);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const history = useHistory();

  useEffect(() => {
    if (params?.id) {
      setLoadingVote(true);

      Axios.get(`${URL()}/musicDao/governance/polls/getDetails/${params.id}`)
        .then(res => {
          const data = res.data;
          if (data.success) {
            setVote(data.data);
            setLoadingVote(false);
          }
        })
        .catch(e => console.log(e))
        .finally(() => setLoadingVote(false));
    }
  }, [params?.id]);

  const votePoll = () => {
    const body = {
      pollId: params?.id,
      answer: vote?.possibleAnswers[selectedIndex],
      userAddress: user.id,
    };
    Axios.post(`${URL()}/musicDao/governance/polls/vote`, body)
      .then(res => {
        const data = res.data;
        if (data.success) {
          setVote(prev => ({
            ...prev,
            votes: [...(prev.votes || []), { userAddress: user.id, answer: body.answer }],
          }));
        }
      })
      .catch(e => console.log(e));
  };

  const getMyAnswer = () => {
    return vote.votes?.find(v => v.userAddress === user.id)?.answer;
  };

  const replyPoll = () => {
    if (comment) {
      const body = {
        pollId: params?.id,
        text: comment,
        userAddress: user.id,
      };
      Axios.post(`${URL()}/musicDao/governance/polls/reply`, body)
        .then(res => {
          const data = res.data;
          if (data.success) {
            setVote(prev => ({
              ...prev,
              replies: [{ userAddress: user.id, text: comment, created: Date.now() }, ...prev.replies],
            }));
            setComment("");
          }
        })
        .catch(e => console.log(e));
    }
  };

  return (
    <Box className={classes.content}>
      <img
        src={require("assets/musicDAOImages/background.png")}
        width="100%"
        height="100%"
        className={classes.gradient}
      />
      <Box className={classes.flexBox} justifyContent="space-between" style={{ zIndex: 1 }}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          style={{ cursor: "pointer" }}
          onClick={() => history.goBack()}
        >
          <Box color="#FFFFFF">
            <ArrowIcon />
          </Box>
          <Box color="#FFFFFF" fontSize={14} fontWeight={700} fontFamily="Agrandir" ml="5px" mb="4px">
            BACK
          </Box>
        </Box>
        <UploadIcon style={{ color: "white" }} />
      </Box>
      <LoadingWrapper loading={loadingVote}>
        {vote && (
          <Box mt={5} className={classes.proposalDetailBox} zIndex={1}>
            <Box className={classes.detailHeaderBox}>
              <Box className={classes.headerTitle}>{vote.question}</Box>
              <Box className={classes.header2} mt={1} style={{ opacity: 0.8 }}>
                {vote.description}
              </Box>
              <Box className={classes.flexBox} mt={2}>
                <Avatar
                  size="small"
                  url={
                    users.find(u => u.id === user.id)?.imageURL ??
                    require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")
                  }
                />
                <Box className={classes.header3} ml={2}>
                  {users.find(user => user.id === vote.creatorAddress)?.urlSlug}
                </Box>
              </Box>
            </Box>
            <Box p={5} borderBottom="1px solid #35385622" borderTop="1px solid #35385622">
              <Box className={classes.header4} color={"#65CB63 !important"}>
                Voting Question
              </Box>
              <Grid container style={{ marginTop: "16px" }}>
                <Grid item xs={12} sm={5}>
                  <Box className={classes.header1}>{vote.question}</Box>
                </Grid>
                <Grid item xs={12} sm={7}>
                  {vote.possibleAnswers.map((answer, index) => (
                    <Box className={classes.greenBox} key={index} mt={index !== 0 ? 2 : 0}>
                      <Box
                        className={classes.flexBox}
                        onClick={() => {
                          if (!getMyAnswer()) setSelectedIndex(index);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <Box style={{ marginRight: 15 }} className={classes.flexBox}>
                          {selectedIndex === index ? (
                            <RectangleCheckedIcon />
                          ) : (
                            <RectangleUncheckedStrokeIcon />
                          )}
                        </Box>
                        <Box>
                          <span className={classes.header3}>{answer}</span>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                  {!getMyAnswer() && (
                    <Box mt={4} width={1}>
                      <PrimaryButton
                        size="small"
                        onClick={votePoll}
                        style={{
                          background: "#65CB63",
                          width: "100%",
                          height: "100%",
                          paddingTop: "4px",
                          paddingBottom: "4px",
                        }}
                        isRounded
                      >
                        Vote
                      </PrimaryButton>
                    </Box>
                  )}
                  <Box className={classes.flexBox} justifyContent="center" width={1} mt={2}>
                    <Box className={classes.header2}>{vote.votes?.length || 0} votes</Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box p={5}>
              <Box className={classes.flexBox} alignItems="flex-start !important">
                <DiscussionOneIcon />
                <Box className={classes.header3} ml={2}>
                  {vote.replies?.length || 0} replies
                </Box>
              </Box>
              <Box mt={2}>
                {vote.replies?.map(item => (
                  <Box className={classes.blackBox} mb={2}>
                    <Box className={classes.flexBox} justifyContent="space-between">
                      <Box className={classes.flexBox}>
                        <Avatar
                          size="small"
                          url={
                            users.find(u => u.id === item.userAddress)?.imageURL ??
                            require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")
                          }
                        />
                        <Box ml={2} className={classes.headerTitle}>
                          {users.find(u => u.id === item.userAddress)?.urlSlug || ""}
                        </Box>
                      </Box>
                      <Moment format="ddd DD MMM, YYYY" className={classes.dateBox}>
                        {item.created}
                      </Moment>
                    </Box>
                    <Box className={classes.header2} mt={2}>
                      {item.text}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box p={5} mt={5}>
              <Box className={classes.header3}>Respond to vote</Box>
              <Box className={classes.flexBox} mt={1}>
                <InputWithLabelAndTooltip
                  placeHolder="Type your response here..."
                  type="text"
                  inputValue={comment}
                  onInputValueChange={e => setComment(e.target.value)}
                  style={{
                    background: "rgba(218, 230, 229, 0.4)",
                    borderRadius: "32px",
                    marginBottom: 0,
                    marginTop: 0,
                  }}
                />
                <Hidden only="xs">
                  <PrimaryButton size="medium" onClick={replyPoll} isRounded style={{ marginLeft: "32px" }}>
                    Send
                  </PrimaryButton>
                </Hidden>
              </Box>
              <Hidden smUp>
                <Box className={classes.flexBox} mt={1}>
                  <PrimaryButton size="medium" onClick={replyPoll} isRounded style={{ width: "100%" }}>
                    Send
                  </PrimaryButton>
                </Box>
              </Hidden>
            </Box>
          </Box>
        )}
      </LoadingWrapper>
    </Box>
  );
}
