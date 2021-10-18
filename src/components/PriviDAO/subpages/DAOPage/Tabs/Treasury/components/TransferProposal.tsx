import React, { useState, useRef } from "react";

import { Box } from "@material-ui/core";

import {
  TitleGrandLight,
  useStyles,
  ProgressAcceptIcon,
  ProgressDeclineIcon,
  ProgressPendingIcon,
  SmileIcon,
  Text,
} from "../../../index.styles";
import { useTypedSelector } from "store/reducers/Reducer";
import { Color, StyledDivider } from "shared/ui-kit";
import { buildJsxFromObject, formatNumber } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { voteTransferProposal, IVoteProposal } from "shared/services/API";
import TimeTrack from "shared/ui-kit/TimeTrack";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
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

  const handleOpenSignatureModal = vote => {
    if (proposal?.ProposalId && proposal?.CommunityId) {
      const payload: IVoteProposal = {
        ProposalId: proposal.ProposalId,
        CommunityId: proposal.CommunityId,
        Decision: vote,
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  };

  const handleVote = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        const resp = await voteTransferProposal(payload, {});
        if (resp && resp.success) {
          setSuccessMsg("Transfer submited");
          handleClickSuccess();
          handleRefresh();
        } else {
          setErrorMsg("Transfer submission failed");
          handleClickError();
        }
      }
    } catch (e) {
      setErrorMsg("Unexpected error: " + e);
      handleClickError();
    }
  };

  return (
    <Box color="white" fontSize="16px">
      <SignatureRequestModal
        theme="dark"
        open={openSignRequestModal}
        address={user.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleVote}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <Box display="flex" justifyContent="center">
        <TitleGrandLight disableUppercase fontSize="30px">
          Transfer Proposal
        </TitleGrandLight>
      </Box>
      <StyledDivider type="solid" color={Color.White} margin={2} />
      <TitleGrandLight disableUppercase fontSize="30px">
        Proposal Details
      </TitleGrandLight>
      <StyledDivider type="solid" color={Color.White} margin={2} />
      <Text bold>Amount</Text>
      <Box display="flex" flexDirection="row" alignItems="center" mt={2} mb={2}>
        <img
          src={
            proposal?.Proposal?.Token
              ? require(`assets/tokenImages/${proposal?.Proposal?.Token}.png`)
              : require(`assets/tokenImages/PRIVI.png`)
          }
          width={24}
          height={24}
        />
        <Box ml={1}>
          <Box fontFamily="Agrandir GrandLight">
            {formatNumber(proposal?.Amount ?? 0, proposal?.Proposal?.Token ?? "PRIVI", 4)}
          </Box>
        </Box>
      </Box>
      <Text bold>Receiver</Text>
      <Box mt={2} className={classes.receiver}>
        {proposal?.To}
      </Box>
      <StyledDivider type="solid" color={Color.White} margin={2} />
      <Text bold mb={2}>
        Acceptance progress (<b>{proposal?.AcceptedVotes}</b> of <b>{proposal?.TotalVotes}</b>)
      </Text>
      <Box className={classes.progress} display="flex" flexDirection="row" alignItems="center">
        <span>{proposal?.AcceptedVotes}</span>
        <ProgressAcceptIcon />
        <span>{proposal?.DeclinedVotes}</span>
        <ProgressDeclineIcon />
        <span>{proposal?.TotalVotes - (proposal?.AcceptedVotes + proposal?.DeclinedVotes)}</span>
        <ProgressPendingIcon />
      </Box>
      <StyledDivider type="solid" color={Color.White} margin={2} />
      <Text bold mb={2}>
        Concept
      </Text>
      <Box mb={2}>{proposal?.AdditionalData?.Concept}</Box>
      <TimeTrack
        theme="dark"
        mb={2}
        endTime={proposal?.ProposalEndingTime ? new Date(proposal?.ProposalEndingTime) : new Date()}
      />
      {proposal?.Approvals[user.address] &&
        (proposal?.Approvals[user.address]?.isVoted ? (
          <Box display="flex" flexDirection="row" alignItems="center">
            <SmileIcon />
            <Box ml={1}>You’ve already sent your answer</Box>
          </Box>
        ) : (
          <Box display="flex" flexDirection="row" justifyContent="space-between">
            <DAOButton onClick={() => handleOpenSignatureModal(false)}>Decline</DAOButton>
            <DAOButton onClick={() => handleOpenSignatureModal(true)}>{`Accept & Sign`}</DAOButton>
          </Box>
        ))}

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
    </Box>
  );
};

export default TreasuryProposal;
