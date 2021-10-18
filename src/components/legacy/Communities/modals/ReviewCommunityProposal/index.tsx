import React, { useEffect, useState, useRef } from "react";
import Axios from "axios";

import { createStyles, makeStyles } from "@material-ui/core";

import { Modal, PrimaryButton, Gradient, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { IVoteCreationProposal, voteCreationProposal } from "shared/services/API";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "auto !important",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "663px",
      minWidth: "663px",
    },
    content: {
      width: "600px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      "& > img": {
        height: "50px",
        width: "50px",
        margin: "30px 0px 32px",
      },
      "& h3": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "30px",
        margin: "0px 0px 44px",
      },
      "& label": {
        width: "100%",

        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        color: "#181818",
        padding: "16px 0px 13px",
      },
    },
    label: {
      padding: "15px 0px 10px !important",
      borderTop: "1px dashed #1717174d",
      borderBottom: "1px solid #1717174d",
      marginBottom: "20px",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      "& span": {
        color: "#707582",
        fontSize: "14px",
        fontWeight: "bold",
        "&:first-child": {
          width: "50%",
        },
      },
    },
    members: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    memberTile: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      padding: "8px 0px",
      justifyContent: "space-between",
      color: "#707582",
      fontSize: "18px",
      textAlign: "left",
      "& > div": {
        width: "50%",
      },
      "& img": {
        marginRight: "30px",
        width: "20px",
        height: "20px",
      },
      "& span": {
        marginRight: "10%",
      },
    },
    avatar: {
      border: "2px solid #FFFFFF",
      height: "48px",
      width: "48px",
      minWidth: "48px",
      filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
      marginRight: "10px",
      borderRadius: "24px",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    userName: {
      color: "#181818",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "14px",
      margin: "0px 0px 2px",
    },
    userSlug: {
      display: "flex",
      color: "transparent",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      background: Gradient.Magenta,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    details: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      padding: "20px 0px 15px",
      borderTop: "1px dashed #1717174d",
      borderBottom: "1px solid #1717174d",
      "& img": {
        width: "36px",
        height: "36px",
        minWidth: "36px",
        marginRight: "14px",
      },
      "& > div": {
        width: "50%",
        display: "flex",
        flexDirection: "column",
        "& h5": {
          margin: "0px 0px 8px",
          color: "#707582",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "14px",
          "& span": {
            color: "#707582",
            fontSize: "18px",
          },
        },
      },
    },
    buttons: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginTop: "28px",
      "& button": {
        fontSize: "16px",
        "& img": {
          width: "12px",
        },
      },
    },
  })
);

export default function ReviewCommunityProposalModal({ open, handleClose, proposalId }) {

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
  const [foundersVotingTime, setFoundersVotingTime] = useState<string>("");
  const [treasuryVotingTime, setTreasuryVotingTime] = useState<string>("");

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


  const handleOpenSignatureModal = (vote: boolean) => {
    if (proposal?.ProposalId) {
      const payload: IVoteCreationProposal = {
        ProposalId: proposal.ProposalId,
        Decision: vote,
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
    else {

    }
  }

  const handleVote = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        const createCommunityRes = await voteCreationProposal(payload, {});
        if (createCommunityRes.success) {
          setSuccessMsg("Vote submited");
          handleClickSuccess();
          setTimeout(() => {
            handleClose();
          }, 1000);
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
    if (proposalId && open) {
      Axios.get(`${URL()}/community/getProposal/${proposalId}`)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            let data = { ...resp.data };

            const approvals = data?.Approvals ?? {};
            let founders = [] as any[];
            Object.entries(data?.Proposal?.Founders ?? {}).forEach(([key, value]) => {
              founders.push({ Address: key, Ownership: value, Status: approvals[key]});
            });
            data.FoundersData = founders;

            if (data?.Proposal?.FoundersVotingTime) {
              let vTime = data.Proposal.FoundersVotingTime;
              let today = Math.floor(new Date().getTime()/1000);

              let difference = vTime - today;
              // calculate (and subtract) whole days
              let days = Math.floor(difference / (3600*24));
              difference -= days * (3600*24);

              // calculate (and subtract) whole hours
              let hours = Math.floor(difference / 3600) % 24;
              difference -= hours * 3600;

              // calculate (and subtract) whole minutes
              let minutes = Math.floor(difference / 60) % 60;
              difference -= minutes * 60;

              setFoundersVotingTime(`${days && days > 0 && `${days} days`}${days && days > 0 && `, `}${hours && hours > 0 && `${hours} hrs`}${hours && hours > 0 && `, `}
              ${minutes && minutes > 0 && `${minutes} mins`}`);
            }

            if (data?.Proposal?.TreasuryVotingTime) {
              let vTime =  data.Proposal.TreasuryVotingTime;
              let today =  Math.floor(new Date().getTime()/1000);

              let difference = vTime - today;
              // calculate (and subtract) whole days
              let days = Math.floor(difference / (3600*24));
              difference -= days * (3600*24);

              // calculate (and subtract) whole hours
              let hours = Math.floor(difference / 3600) % 24;
              difference -= hours * 3600;

              // calculate (and subtract) whole minutes
              let minutes = Math.floor(difference / 60) % 60;
              difference -= minutes * 60;
              setTreasuryVotingTime(`${days && days > 0 && `${days} days`}${days && days > 0 && `, `}${hours && hours > 0 && `${hours} hrs`}${hours && hours > 0 && `, `}
              ${minutes && minutes > 0 && `${minutes} mins`}`);
            }
            setProposal(data);
          } else {
            setErrorMsg("Error loading proposal; not found");
            handleClickError();
            setTimeout(() => {
              handleClose();
            }, 1000);
          }
        })
        .catch(e => {
          console.log(e);
          setErrorMsg("Error loading proposal");
          handleClickError();
          setTimeout(() => {
            handleClose();
          }, 1000);
        });
    }
  }, [proposalId, open]);

  if (proposal && open)
    return (
      <Modal className={classes.root} size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
        <LoadingWrapper loading={!proposal.Proposal}>
          <div className={classes.content}>
            <SignatureRequestModal
              open={openSignRequestModal}
              address={user.address}
              transactionFee="0.0000"
              detail={signRequestModalDetail}
              handleOk={handleVote}
              handleClose={() => setOpenSignRequestModal(false)}
            />
            <img src={require("assets/emojiIcons/handshake.png")} alt="handshake" />
            <h3>Co-Funded Commnuity Proposal</h3>

            <label className={classes.label}>Founder Terms</label>
            <div className={classes.header}>
              <span>Members</span>
              <span>Ownership</span>
              <span>Acceptation</span>
            </div>
            <div className={classes.members}>
              {proposal.FoundersData &&
                proposal.FoundersData.map(founder => {
                  const thisUser = users.find(u => u.address === founder.Address);

                  return (
                    <div className={classes.memberTile}>
                      <Box display="flex" alignItems="center">
                        <div
                          className={classes.avatar}
                          style={{
                            backgroundImage:
                              thisUser && thisUser.imageUrl && thisUser.imageUrl !== ""
                                ? `url(${thisUser.imageUrl})`
                                : "none",
                          }}
                        />
                        <Box display="flex" flexDirection="column">
                          <div className={classes.userName}>{thisUser ? thisUser.name : "User name"}</div>
                          <div className={classes.userSlug}>
                            @{thisUser ? thisUser.urlSlug ?? thisUser.name : "User name"}
                          </div>
                        </Box>
                      </Box>
                      <span>{founder.Ownership ? (Number(founder.Ownership) * 100).toFixed(0) : 0}%</span>
                      <img
                        src={require(`assets/icons/${founder?.Status && founder?.Status?.isVoted ? (founder?.Status?.vote ? "verified_green" : "red_cross_outline") : "clock_gray"}.png`)}
                        alt={founder.Status}
                      />
                    </div>
                  );
                })}
            </div>
            <div className={classes.details}>
              <img src={require("assets/emojiIcons/urn.png")} alt="urn" />
              <div>
                <h5>Voting time</h5>
                <span>{foundersVotingTime ?? "unknown"}</span>
              </div>
              <div>
                <h5>Consensus</h5>
                <span>
                  {proposal?.Proposal?.FoundersConsensus ? (Number(proposal.Proposal.FoundersConsensus) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
            <label>Treasury Terms</label>
            <div className={classes.details}>
              <img src={require("assets/emojiIcons/lock_key.png")} alt="lock key" />
              <div>
                <h5>Voting time</h5>
                <span>{treasuryVotingTime ?? "unknown"}</span>
              </div>
              <div>
                <h5>Consensus</h5>
                <span>
                  {proposal?.Proposal?.TreasuryConsensus ? (Number(proposal.Proposal.TreasuryConsensus) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>

            <div className={classes.buttons}>
              <SecondaryButton onClick={() => handleOpenSignatureModal(false)} size="medium">
                Decline
              </SecondaryButton>
              <PrimaryButton onClick={() => handleOpenSignatureModal(true)} size="medium">
                {`Accept & Sign`}
              </PrimaryButton>
            </div>
          </div>

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
