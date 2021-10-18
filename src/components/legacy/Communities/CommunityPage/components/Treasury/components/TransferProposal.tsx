import React, { useState, useRef } from "react";

import TimeTrack from "./TimeTrack";
import { useTypedSelector } from "store/reducers/Reducer";
import { Header5, Header6, HeaderBold5, HeaderBold6, PrimaryButton, SecondaryButton, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { useStyles, ProgressAcceptIcon, ProgressDeclineIcon, ProgressPendingIcon, SmileIcon } from "../TreasuryStyle";
import { buildJsxFromObject, formatNumber } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { voteTransferProposal, IVoteProposal } from "shared/services/API";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const TreasuryProposal = ({ proposal, handleRefresh }) => {
  const user = useTypedSelector(state => state.user);
  const classes = useStyles();

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

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
        const resp = await voteTransferProposal(payload, {});
        if (resp && resp.success) {
          setSuccessMsg("Transfer submited");
          handleClickSuccess();
          handleRefresh();
        }
        else {
          setErrorMsg("Transfer submission failed");
          handleClickError();
        }
      }
    }
    catch (e) {
      setErrorMsg("Unexpected error: " + e);
      handleClickError();
    }
  };


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
      <HeaderBold6 className={classes.darkColor}>Amount</HeaderBold6>
      <Box display="flex" flexDirection="row" alignItems="center">
        <img src={proposal?.Proposal?.Token ? require(`assets/tokenImages/${proposal?.Proposal?.Token}.png`) : require(`assets/tokenImages/PRIVI.png`)} width={24} height={24} />
        <Box ml={2}><Header5 noMargin>{formatNumber(proposal?.Amount ?? 0, proposal?.Proposal?.Token ?? "PRIVI", 4)}</Header5></Box>
      </Box>
      <StyledDivider type="dashed" margin={1.5} />
      <HeaderBold6 className={classes.darkColor}>Receiver</HeaderBold6>
      <span className={classes.receiver}>{proposal?.To}</span>
      <StyledDivider type="dashed" margin={1.5} />
      <HeaderBold6 className={classes.darkColor}>Acceptance Progress ({proposal?.AcceptedVotes} of {proposal?.TotalVotes})</HeaderBold6>
      <Box className={classes.progress} display="flex" flexDirection="row" alignItems="center">
        <span>{proposal?.AcceptedVotes}</span>
        <ProgressAcceptIcon />
        <span>{proposal?.DeclinedVotes}</span>
        <ProgressDeclineIcon />
        <span>{proposal?.TotalVotes - (proposal?.AcceptedVotes + proposal?.DeclinedVotes)}</span>
        <ProgressPendingIcon />
      </Box>
      <StyledDivider type="dashed" margin={1.5} />
      <HeaderBold6 className={classes.darkColor}>Concept</HeaderBold6>
      <Header6 className={classes.darkColor}>{proposal?.AdditionalData?.Concept}</Header6>
      <TimeTrack endTime={proposal?.ProposalEndingTime ? new Date(proposal?.ProposalEndingTime) : new Date()} />
      {proposal?.Approvals[user.address] && (
        proposal?.Approvals[user.address]?.isVoted ?
          <Box display="flex" flexDirection="row" alignItems="center">
            <SmileIcon />
            <Box ml={2}>
              <Header6 noMargin className={classes.darkColor}>You’ve already sent your answer</Header6>
            </Box>
          </Box>
          :
          <Box display="flex" flexDirection="row" justifyContent="space-between">
            <SecondaryButton size="medium" onClick={() => handleOpenSignatureModal(false)}>Decline</SecondaryButton>
            <PrimaryButton size="medium" onClick={() => handleOpenSignatureModal(true)}>Accept & Sign</PrimaryButton>
          </Box>
      )}

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
  )
};

export default TreasuryProposal;
