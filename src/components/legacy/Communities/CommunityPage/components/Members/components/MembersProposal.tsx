import React, {useState, useRef, useEffect} from "react";

import MuiAlert from "@material-ui/lab/Alert";

import {
  Header6,
  HeaderBold5,
  HeaderBold6,
  PrimaryButton,
  SecondaryButton,
  StyledDivider,
  Avatar
} from "shared/ui-kit";
import {
  useStyles,
  ProgressAcceptIcon,
  ProgressDeclineIcon,
  ProgressPendingIcon,
  SmileIcon,
} from "../../Treasury/TreasuryStyle";
import TimeTrack from "../../Treasury/components/TimeTrack";
import { useTypedSelector } from "store/reducers/Reducer";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { voteTreasurerProposal, voteEjectMemberProposal, IVoteProposal } from "shared/services/API";
import Box from "shared/ui-kit/Box";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const MembersProposal = ({proposal, handleRefresh}) => {
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);
  const classes = useStyles();

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);
  const [firstUser, setFirstUser] = useState<any>(null);


  const handleClickSuccess = () => {
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
    }, 3000);
  };
  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 3000);
  };
  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  const handleOpenSignatureModal = (vote) => {
    if (proposal?.ProposalId && proposal?.CommunityId) {
      const payload: IVoteProposal = {
          "ProposalId": proposal.ProposalId,
          "CommunityId": proposal.CommunityId,
          "Decision": vote
        }
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  }

  const handleVote = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        let resp;
        if (proposal.ProposalType == 'CommunityTreasurer' || proposal.ProposalType == 'CommunityEjectTreasurer') resp = await voteTreasurerProposal(payload, {});
        else resp = await voteEjectMemberProposal(payload, {});
        if (resp && resp.success) {
          setSuccessMsg("Vote submited");
          handleClickSuccess();
          handleRefresh();
        }
        else {
          setErrorMsg("Vote submission failed");
          handleClickError();
        }
      }
    }
    catch (e) {
      setErrorMsg("Unexpected error: " + e);
      handleClickError();
    }
  };

  useEffect(() => {
    if (proposal?.Addresses) {
      if (proposal?.Addresses.length) {
        const firstAddress = proposal?.Addresses[0];
        const foundUser = users.find(u => u.address == firstAddress);
        if (foundUser) setFirstUser(foundUser);
      }
    }
    else if (proposal.MemberAddresses) {
      const foundUser = users.find(u => u.address == proposal.MemberAddresses);
      if (foundUser) setFirstUser(foundUser);
    }
  }, [proposal.Addresses, proposal.MemberAddresses])

  return (
    <>
      <SignatureRequestModal
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleVote}
          handleClose={() => setOpenSignRequestModal(false)}
      />
      <HeaderBold5>Details</HeaderBold5>
      <StyledDivider type="dashed" margin={1.5} />
      <HeaderBold6 className={classes.darkColor}>User</HeaderBold6>
      <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
        <Avatar size="small" url={firstUser?.imageUrl ?? require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")} />
        <Box ml={1} fontSize={14} fontWeight={400} color="#707582">
          @{firstUser?.name} {proposal?.Addresses && proposal.Addresses.length > 1? `and ${proposal.Addresses.length-1} more`:''}
        </Box>
      </Box>
      <HeaderBold6 className={classes.darkColor}>{proposal?.Addresses && proposal.Addresses.length > 1? 'Have':'Has'} been proposed for</HeaderBold6>
      <span className={proposal?.ProposalType.toLowerCase().includes('eject')? classes.sender : classes.receiver}>be {proposal?.ProposalType.toLowerCase().includes('eject')? 'removed':'added'} as Community {proposal?.ProposalType.toLowerCase().includes('treasurer')? 'Tresurer':'Member'}.</span>
      <StyledDivider type="dashed" margin={1.5} />
      <HeaderBold6 className={classes.darkColor}>Acceptance Progress ({proposal?.AcceptedVotes ?? 0} of {proposal?.TotalVotes ?? 0})</HeaderBold6>
      <Box className={classes.progress} display="flex" flexDirection="row" alignItems="center">
        <span>{proposal?.AcceptedVotes ?? 0}</span>
        <ProgressAcceptIcon />
        <span>{proposal?.DeclinedVotes ?? 0}</span>
        <ProgressDeclineIcon />
        <span>{proposal?.TotalVotes ?? 0 - (proposal?.AcceptedVotes ?? 0 + proposal?.DeclinedVotes ?? 0)}</span>
        <ProgressPendingIcon />
      </Box>
      <StyledDivider type="dashed" margin={1.5} />
      <HeaderBold6 className={classes.darkColor}>Concept</HeaderBold6>
      <Header6 className={classes.darkColor}>{proposal?.ProposalType.toLowerCase().includes('treasurer')? 'Treasurer':'Member'} {proposal?.ProposalType.toLowerCase().includes('eject')? 'removement':'invitation'}</Header6>
      <TimeTrack endTime={proposal?.ProposalEndingTime ? new Date(proposal?.ProposalEndingTime): new Date()}/>
      {proposal?.Approvals && user.address && proposal.Approvals[user.address]?
        (
          proposal.Approvals[user.address]?.isVoted ? (
            <Box display="flex" flexDirection="row" alignItems="center">
              <SmileIcon />
              <Box ml={2}>
                <Header6 noMargin className={classes.darkColor}>
                  You’ve already sent your answer
                </Header6>
              </Box>
            </Box>
          ) : (
            <Box display="flex" flexDirection="row" justifyContent="space-between">
              <SecondaryButton size="medium" onClick={() => handleOpenSignatureModal(false)}>Decline</SecondaryButton>
              <PrimaryButton size="medium" onClick={() => handleOpenSignatureModal(true)}>Accept & Sign</PrimaryButton>
            </Box>
          )
        ): null
      }

      {openSuccess && (
        <AlertMessage
          key={Math.random()}
          message={successMsg}
          variant="success"
          onClose={handleCloseSuccess}
        />
      )}
      {openError && (
        <AlertMessage
          key={Math.random()}
          message={errorMsg}
          variant="error"
          onClose={handleCloseError}
        />
      )}
    </>
  );
};

export default MembersProposal;
