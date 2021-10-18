import React, { useEffect, useState } from "react";
import {
  SmileIcon,
  Text,
  useStyles,
  ProgressBar,
  FlagIcon,
  ProgressAcceptIcon,
  ProgressDeclineIcon,
  ProgressPendingIcon,
} from "../AcquisitionsStyle";
import { Avatar, FontSize, Header6, StyledDivider } from "shared/ui-kit";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import Box from "shared/ui-kit/Box";
import TimeTrack from "../../Treasury/components/TimeTrack";
import { useTypedSelector } from "store/reducers/Reducer";
import { voteMediaAcquisitionProposal, getMedia } from "shared/services/API";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { handleSetStatus } from "shared/functions/commonFunctions";

const AcquisitionProposal = ({ proposal, handleRefresh }) => {
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);
  const classes = useStyles();

  const [creator, setCreator] = useState<any>({});
  const [media, setMedia] = useState<any>({});

  const [status, setStatus] = React.useState<any>("");

  const handleMemberVote = vote => {
    try {
      const body = {
        ProposalId: proposal.ProposalId,
        Member: user.address,
        Vote: vote,
      };
      voteMediaAcquisitionProposal(body).then(resp => {
        if (resp?.success) {
          handleSetStatus("Vote submitted", "success", setStatus);
          handleRefresh();
        } else handleSetStatus("Vote submition failed", "error", setStatus);
      });
    } catch (e) {
      handleSetStatus("Vote submition failed: " + e, "error", setStatus);
    }
  };

  useEffect(() => {
    if (proposal.ProposalCreator && users) {
      const foundUser = users.find(u => u.address === proposal.ProposalCreator);
      if (foundUser) setCreator(foundUser);
    }
  }, [proposal.ProposalCreator, users]);

  useEffect(() => {
    if (proposal?.Proposal?.MediaSymbol) {
      getMedia(proposal?.Proposal?.MediaSymbol, "privi").then(resp => {
        if (resp.success) setMedia(resp.data);
      });
    }
  }, [proposal?.Proposal?.MediaSymbol]);

  return (
    <Box>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text size={FontSize.L} bold>
          Proposed by
        </Text>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Avatar
            size="medium"
            url={
              creator.imageUrl
                ? `${creator.imageUrl}`
                : require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")
            }
            alt=""
          />
          <Text size={FontSize.M} className={classes.userMagenta}>
            @{creator?.name}
          </Text>
        </Box>
      </Box>
      <StyledDivider type="dashed" margin={2} />
      <Box display="flex" flexDirection="row" alignItems="center">
        <img src={require("assets/creatorImages/CreatorCardBack-4.png")} width={74} height={74} />
        <Text size={FontSize.L} bold ml={2}>
          {proposal?.Proposal?.MediaSymbol}
        </Text>
      </Box>
      {/* Acquisition Info */}
      <StyledDivider type="dashed" margin={2} />
      <Box display="flex" flexDirection="row" alignItems="center">
        {proposal?.ProposalType ? (
          <AuctionInfo
            token={proposal?.Proposal?.TokenSymbol ?? "PRIVI"}
            lastPrice={media?.Auctions?.Gathered ?? 0}
            memberBid={proposal?.Proposal?.Amount ?? 0}
          />
        ) : (
          <ExchangeInfo
            token={proposal?.Proposal?.TokenSymbol ?? "PRIVI"}
            currentPrice={media?.ExchangeData?.Price ?? 0}
            memberOffer={proposal?.Proposal?.Amount ?? 0}
          />
        )}
      </Box>
      {/* Voting Progress */}
      <StyledDivider type="dashed" margin={2} />
      {(proposal?.ProposalType ?? "").includes("Member") && proposal?.Result === "declined" && (
        <MemberVoteInfoDeclined
          acceptedVotes={proposal.AcceptedVotes}
          declinedVotes={proposal.DeclinedVotes}
        />
      )}
      {(proposal?.ProposalType ?? "").includes("Member") && proposal?.Result === "pending" && (
        <MemberVoteInfoOngoing
          handleMemberVote={handleMemberVote}
          isVoted={
            proposal?.MemberApprovals != undefined && proposal.MemberApprovals[user.address] != undefined
          }
          vote={proposal?.MemberApprovals != undefined && proposal.MemberApprovals[user.address]}
        />
      )}
      {!(proposal?.ProposalType ?? "").includes("Member") && (
        <FounderVoteInfo
          acceptedVotes={
            proposal?.Approvals
              ? Object.values(proposal.Approvals).filter((v: any) => v.isVotes && v.vote).length
              : proposal.AcceptedVotes
          }
          declinedVotes={
            proposal?.Approvals
              ? Object.values(proposal.Approvals).filter((v: any) => v.isVotes && !v.vote).length
              : proposal.AcceptedVotes
          }
          totalVotes={proposal?.Approvals ? Object.keys(proposal.Approvals).length : proposal.TotalVotes}
        />
      )}
      {/* Remaining Time */}
      {proposal?.Result == "pending" && (
        <TimeTrack
          endTime={proposal?.ProposalEndingTime ? new Date(proposal?.ProposalEndingTime * 1000) : new Date()}
        />
      )}
      <StyledDivider type="solid" margin={2} />
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Box>
  );
};

export default AcquisitionProposal;

const AuctionInfo = ({ token, lastPrice, memberBid }) => {
  return (
    <>
      <Box display="flex" flexDirection="column" mr={1.5}>
        <Text size={FontSize.S} mb={2}>
          Last Price
        </Text>
        <Text size={FontSize.H4}>
          {lastPrice} {token}
        </Text>
      </Box>
      <Box display="flex" flexDirection="column" mr={1.5}>
        <Text size={FontSize.S} mb={2}>
          Member Bid
        </Text>
        <Text size={FontSize.H4}>
          {memberBid} {token}
        </Text>
      </Box>
      <Box display="flex" flexDirection="column">
        <Text size={FontSize.S} mb={2}>
          Bid Token
        </Text>
        <Box display="flex" flexDirection="row" alignItems="center">
          <img src={require(`assets/tokenImages/${token}.png`)} width={20} height={20} />
          <Text size={FontSize.H4} ml={1}>
            {token}
          </Text>
        </Box>
      </Box>
    </>
  );
};

const ExchangeInfo = ({ token, currentPrice, memberOffer }) => {
  return (
    <>
      <Box display="flex" flexDirection="column" mr={1.5}>
        <Text size={FontSize.S} mb={2}>
          Current Price
        </Text>
        <Text size={FontSize.H4}>
          {currentPrice} {token}
        </Text>
      </Box>
      <Box display="flex" flexDirection="column" mr={1.5}>
        <Text size={FontSize.S} mb={2}>
          Member Offer
        </Text>
        <Text size={FontSize.H4}>
          {memberOffer} {token}
        </Text>
      </Box>
    </>
  );
};

const MemberVoteInfoDeclined = ({ acceptedVotes, declinedVotes }) => {
  const classes = useStyles();
  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box className={classes.progressTitle} mr={0.5}>
          Yes
        </Box>
        <Box flex={1} position="relative">
          <ProgressBar value={(acceptedVotes / (acceptedVotes + declinedVotes)) * 100} />
        </Box>
        <Box className={classes.progressPercentage} ml={0.5}>
          {(acceptedVotes / (acceptedVotes + declinedVotes)) * 100}%
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" position="relative">
        <Box className={classes.progressTitle} mr={0.5}>
          No
        </Box>
        <Box flex={1} position="relative">
          <ProgressBar value={(declinedVotes / (acceptedVotes + declinedVotes)) * 100} />
        </Box>
        <Box className={classes.progressPercentage} ml={0.5}>
          {(declinedVotes / (acceptedVotes + declinedVotes)) * 100}%
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" mt={1.5}>
        <FlagIcon />
        <Box ml={2}>
          <Header6 noMargin className={classes.darkColor}>
            {acceptedVotes + declinedVotes} votes
          </Header6>
        </Box>
      </Box>
    </>
  );
};

const MemberVoteInfoOngoing = ({ handleMemberVote, vote, isVoted }) => {
  const classes = useStyles();
  return (
    <>
      <Box mb={2} className={isVoted ? classes.opacity : ""}>
        <Box display="flex" flexDirection="row" mb={2}>
          <StyledCheckbox
            checked={isVoted && vote}
            disabled={isVoted}
            onClick={() => handleMemberVote(true)}
          />
          <Box ml={2}>
            <span>Agree with acquisition</span>
          </Box>
        </Box>
        <Box display="flex" flexDirection="row">
          <StyledCheckbox
            checked={isVoted && !vote}
            disabled={isVoted}
            onClick={() => handleMemberVote(false)}
          />
          <Box ml={2}>
            <span>Disagree with acquisition</span>
          </Box>
        </Box>
      </Box>
      {isVoted && (
        <>
          <StyledDivider type="dashed" margin={1} />
          <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
            <SmileIcon />
            <Box ml={2}>
              <Header6 noMargin className={classes.darkColor}>
                You’ve already sent your answer
              </Header6>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

const FounderVoteInfo = ({ acceptedVotes, declinedVotes, totalVotes }) => {
  const classes = useStyles();
  return (
    <>
      <Text size={FontSize.M} className={classes.darkColor} bold mb={1}>
        Acceptance Progress ({acceptedVotes + declinedVotes} of {totalVotes})
      </Text>
      <Box className={classes.progress} display="flex" flexDirection="row" alignItems="center" mb={2}>
        <span>{acceptedVotes}</span>
        <ProgressAcceptIcon />
        <span>{declinedVotes}</span>
        <ProgressDeclineIcon />
        <span>{totalVotes - acceptedVotes - declinedVotes}</span>
        <ProgressPendingIcon />
      </Box>
    </>
  );
};
