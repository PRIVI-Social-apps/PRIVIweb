import React, { useEffect, useState, useRef } from "react";
import Axios from "axios";

import { createStyles, makeStyles } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton, Gradient, SecondaryButton } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { IVoteProposal, voteCommunityTokenProposal } from "shared/services/API";
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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "600px",
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
      "& img": {
        marginRight: "30px",
        width: "20px",
        height: "20px",
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
      flexDirection: "column",
      width: "100%",
      padding: "5px 0px 5px",
      borderTop: "1px dashed #1717174d",
      borderBottom: "1px solid #1717174d",
      "& img": {
        width: "36px",
        height: "36px",
        minWidth: "36px",
        margin: "0px 25%",
      },
      "& > div": {
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        display: "flex",
        padding: "20px 0px 15px",
        "&:first-child": {
          borderBottom: "1px solid #1717174d",
        },
        "& > div": {
          display: "flex",
          flexDirection: "column",
          width: "25%",
          "& h5": {
            margin: "0px 0px 8px",
            color: "#707582",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "14px",
          },
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

export default function ReviewCommunityTokenProposalModal({ open, handleClose, proposalId }) {
  //REDUX
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  //HOOKS
  const classes = useStyles();

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const [community, setCommunity] = useState<any>({});
  const [proposal, setProposal] = useState<any>({});
  const [vestingTime, setVestingTime] = useState<string>("");

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);


  const handleOpenSignatureModal = (vote: boolean) => {
    if (proposal?.ProposalId) {
      const payload: IVoteProposal = {
        ProposalId: proposal.ProposalId,
        CommunityId: proposal.CommunityId,
        Decision: vote,
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
    else {
      setErrorMsg("Proposal Id missing");
      handleClickError();
    }
  }

  const handleVote = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        const createCommunityRes = await voteCommunityTokenProposal(payload, {});
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
            let proposalData = { ...resp.data };

            if (proposalData.CommunityId) {
              Axios.get(`${URL()}/community/getCommunity/${proposalData.CommunityId}`)
              .then(res => {
                const resp = res.data;
                if (resp.success) {
                  const communityData = resp.data;
                  const approvals = proposalData?.Approvals ?? {};
                  let founders = [] as any[];
                  let key:string = '';
                  let value: any = null;
                  for ([key, value] of Object.entries(approvals)) {
                    founders.push({ Address: key, Ownership: communityData?.Proposal?.FounderMap[key]?.Share ?? 0, Status: value});
                  }
                  proposalData.FoundersData = founders;
                  setCommunity(communityData);
                }
              });
            }

            if (proposalData?.Proposal?.VestingTime) {
              let vTime = proposalData.Proposal.VestingTime;
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

              setVestingTime(`${days && days > 0 && `${days} days`}${days && days > 0 && `, `}${hours ? `${hours} hrs` : ""}${hours && hours > 0 ? `, ` : ""}
                ${minutes && minutes > 0 ? `${minutes} mins` : ""}`);
            }

            setProposal(proposalData);
          } else {
            setErrorMsg("Error loading proposal token; not found");
            handleClickError();
            setTimeout(() => {
              handleClose();
            }, 1000);
          }
        })
        .catch(e => {
          console.log(e);
          setErrorMsg("Error loading proposal token");
          handleClickError();
          setTimeout(() => {
            handleClose();
          }, 1000);
        });
    }
  }, [proposalId, open]);


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

    return (
      <Modal className={classes.root} size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
        <LoadingWrapper loading={!proposal.ProposalId}>
          <div className={classes.content}>
            <SignatureRequestModal
                open={openSignRequestModal}
                address={user.address}
                transactionFee="0.0000"
                detail={signRequestModalDetail}
                handleOk={handleVote}
                handleClose={() => setOpenSignRequestModal(false)}
              />

            <img src={require("assets/emojiIcons/money_face.png")} alt="money face" />
            <h3>Co-Funded Commnuity Token Proposal</h3>

            <label className={classes.label}>Acceptance</label>
            <div className={classes.header}>
              <span>Members</span>
              <span>Signatures (3 of 4 needed)</span>
            </div>
            <div className={classes.members}>
              {proposal?.FoundersData &&
                proposal?.FoundersData.map(founder => {
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

                      <img
                        src={require(`assets/icons/${founder?.Status && founder?.Status?.isVoted ? (founder?.Status?.vote ? "verified_green" : "red_cross_outline") : "clock_gray"}.png`)}
                        alt={founder.Status}
                      />
                    </div>
                  );
                })}
            </div>
            <label>Token Terms</label>
            <div className={classes.details}>
              <div>
                <div>
                  <img src={require("assets/emojiIcons/bank.png")} alt="bank" />
                </div>
                <div>
                  <h5>Symbol</h5>
                  <span>{proposal?.Proposal?.TokenSymbol ?? ""}</span>
                </div>
                <div>
                  <h5>Funding Token</h5>
                  <span>{proposal?.Proposal?.FundingToken ?? "N/A"}</span>
                </div>
                <div>
                  <h5>AMM Type</h5>
                  <span>{proposal?.Proposal?.AMM ?? "Linear"}</span>
                </div>
              </div>
              <div>
                <div>
                  <h5>Initial Supply</h5>
                  <span>{proposal?.Proposal?.InitialSupply ?? "N/A"}</span>
                </div>
                <div>
                  <h5>Initial Price</h5>
                  <span> 0 </span>
                </div>
                <div>
                  <h5>Target Supply</h5>
                  <span>{proposal?.Proposal?.TargetSupply ?? "N/A"}</span>
                </div>
                <div>
                  <h5>Target Price</h5>
                  <span>{proposal?.Proposal?.TargetPrice ?? "N/A"}</span>
                </div>
              </div>
              <div>
                <div>
                  <h5>Immediate Allocation </h5>
                  <span>
                    {proposal?.Proposal?.ImmediateAllocationPct
                      ? (proposal.Proposal.ImmediateAllocationPct * 100).toFixed(0)
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <h5>Vested Allocation</h5>
                  <span>
                    {proposal?.Proposal?.VestedAllocationPct ? (proposal.Proposal.VestedAllocationPct * 100).toFixed(0) : "N/A"}%
                  </span>
                </div>
                <div>
                  <h5>Taxation</h5>
                  <span>{proposal?.Proposal?.TaxationPct ? (proposal.Proposal.TaxationPct * 100).toFixed(0) : "N/A"}%</span>
                </div>
                <div>
                  <h5>Vesting Time</h5>
                  <span>{vestingTime}</span>
                </div>
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
}
