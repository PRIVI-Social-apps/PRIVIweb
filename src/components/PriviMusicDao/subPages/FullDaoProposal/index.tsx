import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Axios from "axios";
import Moment from "react-moment";

import { Hidden } from '@material-ui/core'

import { Avatar, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import { ReactComponent as UploadIcon } from "assets/icons/upload_arrow.svg";
import { GreenLinearProgress, RedLinearProgress } from "components/PriviMusicDao/components/LinearProgress";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { useTypedSelector } from "store/reducers/Reducer";
import { getUser, getUsersInfoList } from "store/selectors";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import CustomPopup from "../../components/CustomPopup";
import { ArrowIcon, DiscussionOneIcon } from "../../components/Icons/SvgIcons";
import { fullProposalPageStyles } from "./index.styles";

const filterOptions = ["Yes", "No"];

const resImages = [
  "BAL",
  "BAT",
  "BC",
  "BNB",
  "BTC",
  "CMP",
  "COMP",
  "Bnb_Icon",
  "DAI",
  "DATAp",
  "DC",
  "default",
  "DOT",
  "EOS",
  "ETH",
  "fDAI",
  "HUSD",
  "JUNGLE",
  "KAVA",
  "KTO",
  "LINK",
  "LNK",
  "MKR",
  "OCEAN",
  "PC",
  "pDATA",
  "PI",
  "pINS",
  "PRIVI",
  "pUSD",
  "RSR",
  "SAFT",
  "SAFT2",
  "SAFT3",
  "SAFT4",
  "SAFT5",
  "SAFT6",
  "SAFT7",
  "SUBSTRATE",
  "TST6",
  "UNI",
  "USDT",
  "WAX",
  "WBTC",
  "WETH",
  "XPR",
  "YFI",
];

export default function FullDaoProposal() {
  const classes = fullProposalPageStyles();
  const params: any = useParams();
  const [proposal, setProposal] = useState<any>();
  const [loadingProposals, setLoadingProposals] = useState<boolean>(false);

  const users = useTypedSelector(getUsersInfoList);
  const user = useTypedSelector(getUser);

  const [filterOptionsSelection, setFilterOptionsSelection] = useState<string>(filterOptions[0]);
  const [amount, setAmount] = useState<number>(1);

  const [balance, setBalance] = useState<number>(1234);
  const [comment, setComment] = useState<string>("");

  const history = useHistory();

  useEffect(() => {
    if (params?.id) {
      setLoadingProposals(true);

      Axios.get(`${URL()}/musicDao/governance/proposals/getDetails/${params.id}`)
        .then(res => {
          const data = res.data;
          if (data.success) {
            setProposal(data.data);
            setLoadingProposals(false);
          }
        })
        .catch(e => console.log(e))
        .finally(() => setLoadingProposals(false));
    }
  }, [params?.id]);

  const getMyAnswer = () => {
    return proposal?.votes?.find(vote => vote.userAddress === user.id);
  };

  const voteProposal = () => {
    const body = {
      proposalId: params?.id,
      answer: filterOptionsSelection === filterOptions[0],
      token: proposal.votingToken,
      amount: amount,
      userAddress: user.id,
    };
    Axios.post(`${URL()}/musicDao/governance/proposals/vote`, body)
      .then(res => {
        const data = res.data;
        if (data.success) {
          setProposal(prev => ({
            ...prev,
            votes: [
              ...(prev.votes || []),
              { userAddress: user.id, answer: body.answer, amount: amount, token: proposal.votingToken },
            ],
          }));
        }
      })
      .catch(e => console.log(e));
  };

  const replyProposal = () => {
    if (comment) {
      const body = {
        proposalId: params?.id,
        text: comment,
        userAddress: user.id,
      };
      Axios.post(`${URL()}/musicDao/governance/proposals/reply`, body)
        .then(res => {
          const data = res.data;
          if (data.success) {
            setProposal(prev => ({
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
      <div className={classes.headerImage}>
        <img src={require("assets/musicDAOImages/background.png")} width='100%' height='100%' className={classes.gradient} />
      </div>
      <LoadingWrapper loading={loadingProposals}>
        {proposal && (
          <>
            <Box className={classes.headerTitle} style={{ zIndex: 1 }}>
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
              <Box className={classes.flexBox}>
                <Box className={classes.headerTitle} mr={1} color={"white !important"}>
                  Balance:&nbsp;
                  <span style={{ fontWeight: 700 }}>
                    {balance} {proposal.votingToken}
                  </span>
                </Box>
                <img
                  src={require(`assets/tokenImages/${
                    resImages.findIndex(image => image === proposal.votingToken) > 0
                      ? proposal.votingToken
                      : "SAFT"
                  }.png`)}
                  width="36px"
                />
              </Box>
              <UploadIcon style={{ color: "white" }} />
            </Box>
            <Box mt={5} className={classes.proposalDetailBox} zIndex={1}>
              <Box className={classes.detailHeaderBox}>
                <Box className={classes.headerTitle}>{proposal.title}</Box>
                <Box className={classes.header2} mt={1}>
                  {proposal.shortPreviewText}
                </Box>
                <Box className={classes.flexBox} mt={2}>
                  <Avatar
                    size="small"
                    url={
                      users.find(u => u.id === proposal.userAddress)?.imageURL ??
                      require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")
                    }
                  />
                  <Box className={classes.header3} color="#54658F" ml={2}>
                    {users.find(u => u.id === proposal.userAddress)?.name ||
                      users.find(u => u.id === proposal.userAddress)?.urlSlug}
                  </Box>
                </Box>
              </Box>
              <Box p={5} borderBottom="1px solid #35385622">
                <Box className={classes.flexBox} justifyContent="center">
                  <Box className={classes.flexBox} justifyContent="center" flexDirection="column">
                    <Box className={classes.header4}>Total Votes</Box>
                    <Box className={classes.header1}>{proposal.totalVotes || 0}</Box>
                  </Box>
                  <Box className={classes.flexBox} justifyContent="center" flexDirection="column" mx={8}>
                    <Box className={classes.header4}>Quorum Required</Box>
                    <Box className={classes.header1}>{proposal.quorumRequired || 0} PC</Box>
                  </Box>
                  <Box className={classes.flexBox} justifyContent="center" flexDirection="column">
                    <Box className={classes.header4}>Quorum Reached</Box>
                    <Box className={classes.header1}>
                      {Math.round(
                        ((proposal.votes?.reduce((pre, cur) => pre + cur.amount, 0) || 0) /
                          proposal.quorumRequired) *
                          10000
                      ) / 100}
                      %
                    </Box>
                  </Box>
                </Box>
                <Box mt={3} className={classes.flexBox} width={1}>
                  <Box width={1} position="relative">
                    <GreenLinearProgress
                      variant="determinate"
                      value={
                        Math.round(
                          ((proposal.votes?.filter(vote => vote.answer).length || 0) / proposal.totalVotes) *
                            100 *
                            100
                        ) / 100
                      }
                      style={{ width: "100%" }}
                    />
                    <Box color="white" className={classes.answerBox}>
                      Yes
                    </Box>
                  </Box>
                  <Box className={classes.header2} ml={1} minWidth="50px">
                    {Math.round(
                      ((proposal.votes?.filter(vote => vote.answer).length || 0) / proposal.totalVotes) *
                        100 *
                        100
                    ) / 100}
                    %
                  </Box>
                </Box>
                <Box mt={3} className={classes.flexBox} width={1}>
                  <Box width={1} position="relative">
                    <RedLinearProgress
                      variant="determinate"
                      value={
                        Math.round(
                          ((proposal.votes?.filter(vote => !vote.answer).length || 0) / proposal.totalVotes) *
                            100 *
                            100
                        ) / 100
                      }
                      style={{ width: "100%" }}
                    />
                    <Box color="white" className={classes.answerBox}>
                      No
                    </Box>
                  </Box>
                  <Box className={classes.header2} ml={1} minWidth="50px">
                    {Math.round(
                      ((proposal.votes?.filter(vote => !vote.answer).length || 0) / proposal.totalVotes) *
                        100 *
                        100
                    ) / 100}
                    %
                  </Box>
                </Box>
                <Box className={classes.flexBox} mt={6} height="45px">
                  <Box className={`${classes.blackBox} ${classes.flexBox}`} width={1} height={1}>
                    <img
                      src={require(`assets/tokenImages/${
                        resImages.findIndex(image => image === proposal.votingToken) > 0
                          ? proposal.votingToken
                          : "SAFT"
                      }.png`)}
                      width="32px"
                    />
                    <InputWithLabelAndTooltip
                      type="number"
                      inputValue={amount}
                      onInputValueChange={e => setAmount(e.target.value)}
                      overriedClasses=""
                      style={{
                        marginTop: 0,
                        marginBottom: 0,
                        border: "none",
                        background: "none",
                        width: "auto",
                      }}
                    />
                    <Box className={classes.header3} color={"#2D3047 !important"} ml={1}>
                      {proposal.votingToken}
                    </Box>
                  </Box>
                  <Box className={`${classes.greyBox} ${classes.flexBox}`} ml={2} height={1}>
                    <CustomPopup
                      items={filterOptions}
                      value={filterOptionsSelection}
                      onSelect={value => setFilterOptionsSelection(value)}
                      theme="dark"
                    />
                  </Box>
                  <Hidden only='xs'>
                    <Box ml={4} width={1} height={1}>
                      <PrimaryButton
                        size="small"
                        onClick={voteProposal}
                        style={{ background: "#65CB63", width: "100%", height: "100%" }}
                        isRounded
                        disabled={proposal.endDate < new Date().getTime() || getMyAnswer()}
                      >
                        Vote
                      </PrimaryButton>
                    </Box>
                  </Hidden>
                </Box>
                <Hidden smUp>
                  <Box className={classes.flexBox} mt={6} height="45px">
                    <PrimaryButton
                      size="small"
                      onClick={voteProposal}
                      style={{ background: "#65CB63", width: "100%", height: "100%" }}
                      isRounded
                      disabled={proposal.endDate < new Date().getTime() || getMyAnswer()}
                    >
                      Vote
                    </PrimaryButton>
                  </Box>
                </Hidden>
              </Box>
              <Box p={5}>
                <Box className={classes.headerTitle}>Proposal Description</Box>
                <Box
                  className={classes.header2}
                  color={"#2D3047 !important"}
                  mt={2}
                  dangerouslySetInnerHTML={{ __html: proposal.fullText }}
                />
              </Box>
              <Box p={5}>
                <Box className={classes.flexBox} alignItems="flex-start !important">
                  <DiscussionOneIcon />
                  <Box className={classes.header3} ml={2}>
                    {proposal.replies?.length || 0} replies
                  </Box>
                </Box>
                <Box mt={2}>
                  {proposal.replies?.map(item => (
                    <Box className={classes.messageBox} mb={2}>
                      <Box className={classes.flexBox} justifyContent="space-between">
                        <Box className={classes.flexBox}>
                          <Avatar
                            size="small"
                            url={
                              users.find(u => u.id === item.userAddress)?.imageURL ??
                              require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")
                            }
                          />
                          <Box ml={2} className={classes.header3}>
                            {users.find(u => u.id === item.userAddress)?.urlSlug || ""}
                          </Box>
                        </Box>
                        <Moment format="ddd DD MMM, YYYY" className={classes.dateBox}>
                          {item.created}
                        </Moment>
                      </Box>
                      <Box className={classes.header5} mt={2}>
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
                  <Hidden only='xs'>
                    <PrimaryButton
                      size="medium"
                      onClick={replyProposal}
                      isRounded
                      style={{ marginLeft: "32px" }}
                    >
                      Send
                    </PrimaryButton>
                  </Hidden>
                </Box>
                <Hidden smUp>
                  <Box className={classes.flexBox} mt={1}>
                    <PrimaryButton
                      size="medium"
                      onClick={replyProposal}
                      isRounded
                      style={{ width: "100%" }}
                    >
                      Send
                    </PrimaryButton>
                  </Box>
                </Hidden>
              </Box>
            </Box>
          </>
        )}
      </LoadingWrapper>
    </Box>
  );
}
