import React, { useEffect, useState, useRef } from "react";

import { Box } from "@material-ui/core";

import { useTypedSelector } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Modal, StyledDivider, FontSize, Avatar, Color } from "shared/ui-kit";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import {
  voteAirdropProposal,
  voteAllocateTokenProposal,
  getProposal,
  getCommunity,
} from "shared/services/API";
import {
  ProgressAcceptIcon,
  ProgressDeclineIcon,
  ProgressPendingIcon,
  Text,
  TitleGrandLight,
  useStyles,
} from "../../../index.styles";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

export default function ReviewCommunityAirdropProposalModal({ open, handleClose, proposalId }) {
  //REDUX
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  //HOOKS
  const classes = useStyles();

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const [proposal, setProposal] = useState<any>({});
  const [totalAirdropAmount, setTotalAirdropAmount] = useState<any>(0);
  const [community, setCommunity] = useState<any>({});
  const [foundersVotingTime, setFoundersVotingTime] = useState<string>("");

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const [creator, setCreator] = useState<any>({});

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

  const handleOpenSignatureModal = (vote: boolean) => {
    if (proposal?.ProposalId && proposal?.CommunityId) {
      const payload: any = {
        ProposalId: proposal.ProposalId,
        CommunityId: proposal.CommunityId,
        Decision: vote,
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    } else {
      setErrorMsg("Proposal or Community Id not found");
      handleClickError();
    }
  };

  const handleVote = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        let resp;
        if (proposal?.ProposalType == "CommunityAirdrop") {
          resp = await voteAirdropProposal(payload, {});
        } else if (proposal?.ProposalType == "CommunityAllocation") {
          resp = await voteAllocateTokenProposal(payload, {});
        }
        if (resp && resp.success) {
          setSuccessMsg("Vote submited");
          handleClickSuccess();
          setTimeout(() => {
            handleClose();
          }, 1000);
        } else {
          setErrorMsg("Vote submission failed");
          handleClickError();
        }
      }
    } catch (e) {
      setErrorMsg("Unexpected error: " + e);
      handleClickError();
    }
  };

  useEffect(() => {
    if (proposalId && open) {
      getProposal(proposalId)
        .then(resp => {
          if (resp.success) {
            let proposalData = { ...resp.data };
            if (proposalData.CommunityId) {
              getCommunity(proposalData.CommunityId).then(resp => {
                if (resp.success) {
                  const communityData = resp.data;
                  const approvals = proposalData?.Approvals ?? {};
                  let founders = [] as any[];
                  let key: string = "";
                  let value: any = null;
                  for ([key, value] of Object.entries(approvals)) {
                    founders.push({
                      Address: key,
                      Ownership: communityData?.Proposal?.FounderMap[key]?.Share ?? 0,
                      Status: value,
                    });
                  }
                  proposalData.FoundersData = founders;
                  setCommunity(communityData);
                }
              });
            }

            // calculate total amount
            const addresses = proposalData?.Proposal?.Addresses ?? proposalData?.Addresses;
            if (addresses) {
              let total = 0;
              Object.values(addresses).forEach((amount: any) => (total += amount));
              setTotalAirdropAmount(total);
            }

            // set the creator
            const proposalCreator = proposalData?.ProposalCreator;
            if (proposalCreator) {
              const foundUser = users.find(u => u.address == proposalCreator);
              if (foundUser) setCreator(foundUser);
            }

            if (proposalData?.ProposalEndingTime) {
              let vTime = proposalData.ProposalEndingTime;
              let today = Math.floor(new Date().getTime());

              let difference = Math.floor((vTime - today) / 1000);
              // calculate (and subtract) whole days
              let days = Math.floor(difference / (3600 * 24));
              difference -= days * (3600 * 24);

              // calculate (and subtract) whole hours
              let hours = Math.floor(difference / 3600) % 24;
              difference -= hours * 3600;

              // calculate (and subtract) whole minutes
              let minutes = Math.floor(difference / 60) % 60;
              difference -= minutes * 60;

              setFoundersVotingTime(`${days && days > 0 && `${days} days`}${days && days > 0 && `, `}${
                hours && hours > 0 && `${hours} hrs`
              }${hours && hours > 0 && `, `}
              ${minutes && minutes > 0 && `${minutes} mins`}`);
            }
            setProposal(proposalData);
          } else {
            setErrorMsg("Error loading proposal; not found");
            handleClickError();
          }
        })
        .catch(e => {
          console.log(e);
          setErrorMsg("Error loading proposal");
          handleClickError();
        });
    }
  }, [proposalId, open]);

  if (proposal && open)
    return (
      <Modal size="small" isOpen={open} onClose={handleClose} showCloseIcon theme="dark">
        <LoadingWrapper loading={!Object.keys(proposal).length} theme="dark">
          <Box color="white" fontSize="18px">
            <SignatureRequestModal
              theme="dark"
              open={openSignRequestModal}
              address={user.address}
              transactionFee="0.0000"
              detail={signRequestModalDetail}
              handleOk={handleVote}
              handleClose={() => setOpenSignRequestModal(false)}
            />
            <TitleGrandLight fontSize="30px" disableUppercase>
              Token {proposal?.ProposalType == "CommunityAirdrop" ? "Airdrop" : "Allocation"} Proposal
            </TitleGrandLight>
            <StyledDivider type="solid" mt={1} mb={2} />
            <Text bold mb={2}>
              Proposal Details
            </Text>
            <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
              <Avatar
                noBorder
                size="medium"
                url={
                  creator.imageUrl
                    ? `${creator.imageUrl}`
                    : require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")
                }
              />
              <Box fontFamily="Agrandir GrandLight">{creator.name}</Box>
            </Box>
            <Text bold mb={2}>
              Has made a proposal of
            </Text>
            <Text className={classes.receiver}>
              {totalAirdropAmount} {community?.TokenSymbol}
            </Text>
            <StyledDivider type="solid" margin={2} />
            <Text bold>Proposal Acceptation</Text>
            {proposal.FoundersData && (
              <Box maxHeight={300} overflow="scroll" mt={4} mb={3}>
                {proposal.FoundersData.map((founder, index) => {
                  const thisUser = users.find(u => u.address === founder.Address);
                  return (
                    <Box
                      key={`cofounder-${index}`}
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={1}
                    >
                      <Box display="flex" alignItems="center">
                        <Avatar noBorder size="small" url={thisUser?.imageUrl ? thisUser.imageUrl : ""} />
                        <Text size={FontSize.M}>{thisUser ? thisUser.name : "User name"} (Proposer)</Text>
                      </Box>
                      {founder?.Status && founder?.Status?.isVoted ? (
                        founder?.Status?.vote ? (
                          <ProgressAcceptIcon />
                        ) : (
                          <ProgressDeclineIcon />
                        )
                      ) : (
                        <ProgressPendingIcon />
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
            <StyledDivider type="solid" color={Color.White} margin={2} />
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box display="flex" flexDirection="column">
                <Text bold>Voting time</Text>
                <Text>{foundersVotingTime ?? "unknown"}</Text>
              </Box>
              <Box display="flex" flexDirection="column" ml={3}>
                <Text bold>Consensus</Text>
                <Text>
                  {community?.FoundersConsensus ? (Number(community.FoundersConsensus) * 100).toFixed(0) : 0}%
                </Text>
              </Box>
            </Box>
            <StyledDivider type="solid" margin={2} />
            <Box display="flex" flexDirection="row" justifyContent="space-between" mt={4}>
              <DAOButton onClick={() => handleOpenSignatureModal(false)}>Decline</DAOButton>
              <DAOButton onClick={() => handleOpenSignatureModal(true)}>{`Accept & Sign`}</DAOButton>
            </Box>
          </Box>

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
        </LoadingWrapper>
      </Modal>
    );
  else return null;
}
