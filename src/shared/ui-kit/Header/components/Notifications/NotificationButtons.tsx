import React, { useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { Notification } from "shared/services/API/NotificationsAPI";
import { signTransaction } from "shared/functions/signTransaction";
import URL from "shared/functions/getURL";
import { getUser } from "store/selectors/user";
import EditCommunityWIPModal from "components/legacy/Profile/modals/Edit-WIPs/EditCommunityWIPModal";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { setUpdateAllProfileInfo } from "store/actions/UpdateAllProfileInfo";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { useStreaming } from "shared/contexts/StreamingContext";
import ReviewCommunityAirdropProposalModal from "components/legacy/Communities/modals/ReviewCommunityAirdropProposal";
import ReviewCommunityMemberProposalModal from "components/legacy/Communities/modals/ReviewCommunityMemberProposal";
import ReviewCommunityMediaAcquisitionProposalModal from "components/legacy/Communities/modals/ReviewCommunityMediaAcquisitionProposal";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import {
  joiningRequest,
  voteMediaAcquisitionProposal,
  IVoteMediaAcquisitionProposal,
  placeBidProposal,
  placeBuyingOrderProposal,
  buyingProposal,
  getMedia,
} from "shared/services/API";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { handleSetStatus } from "shared/functions/commonFunctions";
import ReviewDAOTokenProposalModal from "components/PriviDAO/subpages/DAOPage/modals/ReviewDAOTokenProposal";
import ReviewDAOProposalModal from "components/PriviDAO/modals/ReviewDAOProposal";
import RequestedJoinDAOModal from "components/PriviDAO/modals/RequestedJoinDAO";
import { notificationButtonStyles } from './NotificationButtons.styles';

type NotificationButtonsProps = {
  notification: Notification;
  onDismissNotification: () => void;
  refreshAllProfile: (userId: string) => void;
  viewMore?: (value: any) => void;
  setSelectedNotification: (value: Notification) => void;
  handleShowContributionModal: () => void;
  handleClosePopper: () => void;
  handleHidePopper: () => void;
  theme?: "dark" | "light";
};

const ButtonContainer = styled.div`
  button {
    margin-bottom: 0 !important;
  }
`;

const LinkButton = styled.div`
  background: -webkit-linear-gradient(#23d0c6 100%, #00cc8f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 14px;
  cursor: pointer;
`;

export const NotificationButtons: React.FunctionComponent<NotificationButtonsProps> = ({
  notification,
  onDismissNotification: dismissNotification,
  refreshAllProfile,
  viewMore = null,
  setSelectedNotification,
  handleShowContributionModal,
  handleClosePopper,
  handleHidePopper,
  theme = "light",
}) => {
  const classes = notificationButtonStyles();

  const dispatch = useDispatch();
  const history = useHistory();
  const streaming = useStreaming();

  let userSelector = useSelector(getUser);

  const [wallPost, setWallPost] = useState<any>({});
  const [wallPostType, setWallPostType] = useState<string>("");

  const [userSearcher, setUserSearcher] = useState<string>("");
  const [usersSearched, setUsersSearched] = useState<any[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);

  const [community, setCommunity] = useState<any>({});

  const inputRef = useRef<HTMLInputElement>(null);

  const [openModalWallPost, setOpenModalWallPost] = useState<boolean>(false);

  const [openModalEditCommunityWIP, setOpenModalEditCommunityWIP] = useState<boolean>(false);
  const [openModalAcceptJoiningRequest, setOpenModalAcceptJoiningRequest] = useState<boolean>(false);

  const [openReviewCommunityProposal, setOpenReviewCommunityProposal] = useState<boolean>(false);
  const [proposalType, setProposalType] = useState<string>("");

  const [status, setStatus] = React.useState<any>("");
  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const handleOpenModalWallPost = () => {
    setOpenModalWallPost(true);
  };
  const handleCloseModalWallPost = () => {
    setOpenModalWallPost(false);
  };

  const handleOpenModalEditCommunityWIP = () => {
    setOpenModalEditCommunityWIP(true);
  };

  const handleCloseModalEditCommunityWIP = () => {
    setOpenModalEditCommunityWIP(false);
  };

  const handleCloseReviewCommunityProposal = () => {
    setOpenReviewCommunityProposal(false);
    setProposalType("");
    handleClosePopper();
  };

  const handleCloseSignatureModal = () => {
    setOpenSignRequestModal(false);
    setProposalType("");
    handleClosePopper();
  };

  const handleOpenReviewCommunityProposal = async () => {
    setProposalType("creation");
    setOpenReviewCommunityProposal(true);
    handleHidePopper();
  };
  const handleOpenReviewCommunityTokenProposal = () => {
    setProposalType("token");
    setOpenReviewCommunityProposal(true);
    handleHidePopper();
  };
  const handleOpenReviewCommunityAirdropProposal = async () => {
    setProposalType("airdrop");
    setOpenReviewCommunityProposal(true);
    handleHidePopper();
  };
  const handleOpenReviewCommunityAllocationProposal = async () => {
    setProposalType("allocation");
    setOpenReviewCommunityProposal(true);
    handleHidePopper();
  };
  const handleOpenReviewCommunityTransferProposal = async () => {
    setProposalType("transfer");
    setOpenReviewCommunityProposal(true);
    handleHidePopper();
  };
  const handleOpenReviewCommunityAddTreasurerProposal = async () => {
    setProposalType("addTreasurer");
    setOpenReviewCommunityProposal(true);
    handleHidePopper();
  };
  const handleOpenReviewCommunityEjectTreasurerProposal = async () => {
    setProposalType("ejectTreasurer");
    setOpenReviewCommunityProposal(true);
    handleHidePopper();
  };

  const handleOpenReviewCommunityEjectMemberProposal = async () => {
    setProposalType("ejectMember");
    setOpenReviewCommunityProposal(true);
    handleHidePopper();
  };

  const handleOpenResolveCommunityJoinRequestProposal = async () => {
    setProposalType("addMember");
    setOpenReviewCommunityProposal(true);
    handleHidePopper();
  };

  const handleOpenReviewMediaAcquisitionProposal = async () => {
    setProposalType("mediaAcquisition");
    setOpenReviewCommunityProposal(true);
    handleHidePopper();
  };

  const handleOpenSignatureModal = async () => {
    let payload;
    switch (notification.type) {
      case 194:
        payload = {
          CommunityId: notification.itemId,
        };
        break;
      case 200:
        payload = {
          CommunityId: notification.comment,
          MediaSymbol: notification.otherItemId,
          TokenSymbol: notification.token,
          Amount: notification.amount,
        };
        break;
      case 202:
        var mediaResp = await getMedia(notification.otherItemId, "privi");
        if (mediaResp?.success) {
          const exchangeId = mediaResp.data?.ExchangeData?.Id;
          payload = {
            CommunityId: notification.comment,
            ExchangeId: exchangeId,
            OfferToken: notification.token,
            Amount: 1, // fixed to one for media nft
            Price: notification.amount,
          };
        }
        break;
      case 204:
        var mediaResp = await getMedia(notification.otherItemId, "privi");
        if (mediaResp?.success) {
          const exchangeId = mediaResp.data?.ExchangeData?.Id;
          payload = {
            CommunityId: notification.comment,
            ExchangeId: exchangeId,
            OfferId: exchangeId,
            Amount: "1.0",
          };
        }
        break;
    }
    if (payload) {
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
      handleHidePopper();
    }
  };

  const handleAccept = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        switch (notification.type) {
          case 194:
            joiningRequest(payload, {}).then(resp => {
              if (resp.success) {
                handleHidePopper();
                handleSetStatus("Accepted", "success", setStatus);
              } else handleSetStatus("Failed to accept", "error", setStatus);
            });
            break;
          case 200:
            placeBidProposal(payload, { ProposalId: notification.itemId }).then(resp => {
              if (resp.success) {
                handleHidePopper();
                handleSetStatus("Proposal Created", "success", setStatus);
              } else handleSetStatus("Failed to create proposal", "error", setStatus);
            });
            break;
          case 202:
            placeBuyingOrderProposal(payload, { ProposalId: notification.itemId }).then(resp => {
              if (resp.success) {
                handleHidePopper();
                handleSetStatus("Proposal Created", "success", setStatus);
              } else handleSetStatus("Failed to create proposal", "error", setStatus);
            });
            break;
          case 204:
            buyingProposal(payload, { ProposalId: notification.itemId }).then(resp => {
              if (resp.success) {
                handleHidePopper();
                handleSetStatus("Proposal Created", "success", setStatus);
              } else handleSetStatus("Failed to create proposal", "error", setStatus);
            });
            break;
        }
      }
    } catch (e) {
      handleSetStatus("Failed to Accept " + e, "error", setStatus);
    }
  };

  const handleMemberVoting = vote => {
    try {
      const body: IVoteMediaAcquisitionProposal = {
        ProposalId: notification.itemId,
        Member: userSelector.address,
        Vote: vote,
      };
      voteMediaAcquisitionProposal(body).then(resp => {
        if (resp.success) {
          handleHidePopper();
          handleSetStatus("Vote Submitted", "success", setStatus);
        } else handleSetStatus("Voting failed", "error", setStatus);
      });
    } catch (e) {
      handleSetStatus("Voting failed: " + e, "error", setStatus);
    }
  };

  const searchUser = search => {
    setIsSearchLoading(true);
    axios
      .post(`${URL()}/user/searchUsers`, {
        userId: userSelector.id,
        userSearch: search,
      })
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setUsersSearched(resp.data);
        } else {
          console.log({
            msg: resp.error,
          });
        }
        setIsSearchLoading(false);
      })
      .catch(err => {
        setIsSearchLoading(false);
        console.log({
          msg: err.error,
        });
      });
  };

  // Functions Notifications

  const acceptDeclineFollowing = (user, boolUpdateFollowing, idNotification) => {
    console.log(user, boolUpdateFollowing);
    if (boolUpdateFollowing) {
      // accept
      axios
        .post(`${URL()}/user/connections/acceptFollowUser`, {
          userToAcceptFollow: {
            id: user.id,
          },
          user: {
            id: userSelector.id,
          },
          idNotification: idNotification,
        })
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            dismissNotification();
            setStatus({
              msg: "Accepted following request",
              key: Math.random(),
              variant: "success",
            });
          } else {
            console.log(resp.error);
            setStatus({
              msg: "Error accept request",
              key: Math.random(),
              variant: "error",
            });
          }
        });
    } else {
      // decline
      axios
        .post(`${URL()}/user/connections/declineFollowUser`, {
          userToDeclineFollow: {
            id: user.id,
          },
          user: {
            id: userSelector.id,
          },
          idNotification: idNotification,
        })
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            dismissNotification();
            setStatus({
              msg: "Declined request",
              key: Math.random(),
              variant: "success",
            });
          } else {
            console.log(resp.error);
            setStatus({
              msg: "Error decline request",
              key: Math.random(),
              variant: "error",
            });
          }
        });
    }
  };

  const getPostById = (id, itemUrl) => {
    return new Promise((resolve, reject) => {
      let itemUrlUpperCase = itemUrl[0].toUpperCase() + itemUrl.substr(1);
      axios
        .get(`${URL()}/${itemUrl}/wall/get${itemUrlUpperCase}Post/${id}`)
        .then(res => {
          let data = res.data;
          if (data.success) {
            setWallPost(data.data);
            setWallPostType(`${itemUrlUpperCase}Post`);
            resolve(true);
          } else {
            console.log(data.error);
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  };

  const removeNotification = () => {
    axios
      .post(`${URL()}/user/removeNotification`, {
        userId: userSelector.id,
        notificationId: notification.id,
      })
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          dismissNotification();
        } else {
          console.log(resp.error);
          setStatus({
            msg: "Error removing notification",
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(err => {
        console.log(err);
        setStatus({
          msg: "Error removing notification",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  const sendInviteNotifications = (user: any) => {
    console.log(notification);
    axios
      .post(`${URL()}/user/inviteUserToPod`, {
        userId: user.id,
        podName: notification.pod,
        podId: notification.itemId,
        creatorId: notification.follower,
      })
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: resp.data,
            key: Math.random(),
            variant: "success",
          });
        } else {
          console.log(resp.error);
          setStatus({
            msg: "Error sending notification",
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(err => {
        console.log(err);
        setStatus({
          msg: "Error sending notification",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  const acceptInvitation = () => {
    axios
      .post(`${URL()}/community/acceptRoleInvitation`, {
        userId: userSelector.id,
        communityId: notification.otherItemId,
        role: notification.comment,
      })
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          dismissNotification();
          setStatus({
            msg: resp.data,
            key: Math.random(),
            variant: "success",
          });
        } else {
          console.log(resp.error);
          setStatus({
            msg: "Error accepting invitation",
            key: Math.random(),
            variant: "error",
          });
        }
      });
  };

  const declineInvitation = () => {
    axios
      .post(`${URL()}/community/declineRoleInvitation`, {
        userId: userSelector.id,
        communityId: notification.otherItemId,
        role: notification.comment,
      })
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          dismissNotification();
          setStatus({
            msg: resp.data,
            key: Math.random(),
            variant: "success",
          });
        } else {
          console.log(resp.error);
          setStatus({
            msg: "Error decline invitation",
            key: Math.random(),
            variant: "error",
          });
        }
      });
  };

  const changeOffer = (status: any) => {
    axios
      .post(`${URL()}/community/changeOffer`, {
        userId: userSelector.id,
        communityId: notification.otherItemId,
        status: status,
        token: notification.token,
        amount: notification.amount,
        notificationId: notification.id,
      })
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          dismissNotification();
          setStatus({
            msg: "Action done success",
            key: Math.random(),
            variant: "success",
          });
          dispatch(setUpdateAllProfileInfo(true));
        } else {
          console.log(resp.error);
          setStatus({
            msg: "Error changing offer",
            key: Math.random(),
            variant: "error",
          });
        }
      });
  };

  const getWIPCommunity = (communityId: string, notificationId: any) => {
    if (communityId) {
      axios
        .get(`${URL()}/community/getWIP/${communityId}/${userSelector.id}/${notificationId}`)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            let data = { ...resp.data };
            setCommunity(data);
          } else {
            setStatus({
              msg: "Error getting Community",
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(e => {
          console.log(e);
          setStatus({
            msg: "Error getting Community",
            key: Math.random(),
            variant: "error",
          });
        });
    } else {
      setStatus({
        msg: "Error getting Community",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const signTxStreamingAcceptOffer = async () => {
    let diffDate = Math.floor(notification.date / 1000) - (Math.floor(Date.now() / 1000) + 10);
    const body: any = {
      sender: userSelector.id,
      receiver: notification.pod,
      amountPeriod: notification.amount / diffDate,
      token: notification.token,
      startDate: Math.floor(Date.now() / 1000) + 10,
      endDate: Math.floor(notification.date / 1000),
    };
    const [hash, signature] = await signTransaction(userSelector.mnemonic, body);
    body.userId = userSelector.id;
    body.communityId = notification.otherItemId;
    body.Hash = hash;
    body.Signature = signature;

    axios.post(`${URL()}/community/signTransactionAcceptOffer`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        dismissNotification();
        setStatus({
          msg: "Signed Transaction",
          key: Math.random(),
          variant: "success",
        });
      } else {
        console.log(resp.error);
        setStatus({
          msg: "Error signing transaction",
          key: Math.random(),
          variant: "error",
        });
      }
    });
  };

  const refuseCollabRequest = (wall: any) => {
    let body: any = {
      userId: userSelector.id,
      creator: wall.itemId,
      notificationId: wall.id,
    };
    axios.post(`${URL()}/media/refuseCollab/${wall.pod}/${wall.token}`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        dismissNotification();
        setStatus({
          msg: "Collab Refused",
          key: Math.random(),
          variant: "success",
        });
      } else {
        console.log(resp.error);
        setStatus({
          msg: "Error refusing collab",
          key: Math.random(),
          variant: "error",
        });
      }
    });
  };

  const acceptCollabRequest = (wall: any) => {
    let body: any = {
      userId: userSelector.id,
      creator: wall.itemId,
      notificationId: wall.id,
    };
    axios.post(`${URL()}/media/acceptCollab/${wall.pod}/${wall.token}`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        dismissNotification();
        setStatus({
          msg: "Collab Accepted",
          key: Math.random(),
          variant: "success",
        });
      } else {
        console.log(resp.error);
        setStatus({
          msg: "Error accepting collab",
          key: Math.random(),
          variant: "error",
        });
      }
    });
  };

  const signTxAcceptCollab = async (wall: any) => {
    let collabs: any = {};

    if (wall.comment && wall.comment.length > 0) {
      let sumShare: number = 0;

      for (let savedCollab of wall.comment) {
        if (savedCollab.status === "Accepted") {
          collabs[savedCollab.id] = savedCollab.share / 100;
        }
        if (savedCollab.id !== userSelector.id) {
          sumShare += savedCollab.share;
        }
      }
      if (sumShare < 100) {
        collabs[userSelector.address] = (100 - sumShare) / 100;
      }
    }

    const body: any = {
      PodAddress: wall.pod,
      MediaSymbol: wall.token,
      Collabs: collabs,
    };
    const [hash, signature] = await signTransaction(userSelector.mnemonic, body);
    body.userId = wall.itemId;
    body.creator = userSelector.id;
    body.notificationId = wall.id;
    body.Hash = hash;
    body.Signature = signature;

    axios.post(`${URL()}/media/signTransactionAcceptCollab/${wall.pod}/${wall.token}`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        dismissNotification();
        setStatus({
          msg: "Collabs modified",
          key: Math.random(),
          variant: "success",
        });
      } else {
        console.log(resp.error);
        setStatus({
          msg: "Error signing transaction",
          key: Math.random(),
          variant: "error",
        });
      }
    });
  };

  return (
    <>
      <ButtonContainer>
        {notification.type === 1 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => acceptDeclineFollowing({ id: notification.itemId }, true, notification.id)}
            >
              Accept
            </PrimaryButton>
            <SecondaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => acceptDeclineFollowing({ id: notification.itemId }, false, notification.id)}
            >
              Decline
            </SecondaryButton>
          </>
        ) : null}
        {notification.type === 10 ? (
          <div className="marginLeftOptionWall">
            <input
              className="textFieldSidebarProfile no-margin-bottom"
              style={{
                width: "calc(100% - 24px)",
                height: "35px",
                marginTop: "10px",
                marginBottom: "10px",
              }}
              type="text"
              name="userSearch"
              value={userSearcher}
              ref={inputRef}
              onChange={elem => {
                let value = elem.target.value;
                setUserSearcher(value);
                if (value.length >= 3) {
                  searchUser(value);
                } else {
                  setUsersSearched([]);
                }
              }}
              placeholder="Search user by name"
            />
            {userSearcher && userSearcher.length >= 3 ? (
              <LoadingWrapper loading={isSearchLoading}>
                {usersSearched && usersSearched.length !== 0 ? (
                  usersSearched.map((user, i) => {
                    return (
                      <div className="userSearchedItem">
                        <div
                          className="photoUserSearchedItem"
                          style={{
                            backgroundImage: `url(${user.url}?${Date.now()})`,
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                          }}
                        ></div>
                        <div className="nameUserSearchedItem">{user.firstName}</div>
                        <div className="followingUserSearchedItem">
                          <button
                            className="followingButtonSidebarProfile"
                            onClick={() => sendInviteNotifications(user)}
                          >
                            Invite
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="noItemsWallLabel" style={{ marginTop: "0" }}>
                    No users found
                  </div>
                )}
              </LoadingWrapper>
            ) : (
              <div className="noItemsWallLabel" style={{ marginTop: "0" }}>
                Write 3 letters min.
              </div>
            )}
          </div>
        ) : null}
        {notification.type === 30 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {
                history.push(`/privi-pods/FT/${notification.pod}`);
              }}
            >
              Open Pod
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 31 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={async () => {
                await getPostById(notification.otherItemId, "pod");
                handleOpenModalWallPost();
              }}
            >
              View post
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 41 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {
                history.push(`/lendings/credit-pools/${notification.otherItemId}`);
              }}
            >
              Open Credit
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 42 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={async () => {
                await getPostById(notification.otherItemId, "priviCredit");
                handleOpenModalWallPost();
              }}
            >
              View post
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 45 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {}}
            >
              Send remainder
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 46 ? <div></div> : null}
        {notification.type === 76 ? (
          <div>
            <div className={classes.commentInNotification}>{notification.comment}</div>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={async () => {
                await getPostById(notification.otherItemId, notification.typeItemId);
                handleOpenModalWallPost();
              }}
            >
              View post
            </PrimaryButton>
          </div>
        ) : null}
        {notification.type === 77 ? (
          <div>
            {notification.comment && notification.comment !== "" ? (
              <div className={classes.commentInNotification}>{notification.comment}</div>
            ) : null}
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={async () => {
                await getPostById(notification.otherItemId, notification.typeItemId);
                handleOpenModalWallPost();
              }}
            >
              View post
            </PrimaryButton>
          </div>
        ) : null}
        {notification.type === 78 ? (
          <div>
            {notification.comment && notification.comment !== "" ? (
              <div className={classes.commentInNotification}>{notification.comment}</div>
            ) : null}
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={async () => {
                await getPostById(notification.otherItemId, notification.typeItemId);
                handleOpenModalWallPost();
              }}
            >
              View post
            </PrimaryButton>
          </div>
        ) : null}
        {notification.type === 79 ? (
          <PrimaryButton
            className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
            size="small"
            onClick={async () => {}}
          >
            View comment
          </PrimaryButton>
        ) : null}
        {notification.type === 80 ? (
          <PrimaryButton
            className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
            size="small"
            onClick={async () => {}}
          >
            View comment
          </PrimaryButton>
        ) : null}
        {notification.type === 81 ? (
          <PrimaryButton
            className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
            size="small"
            onClick={async () => {}}
          >
            View comment
          </PrimaryButton>
        ) : null}
        {notification.type === 82 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={async () => {
                await getPostById(notification.otherItemId, "community");
                handleOpenModalWallPost();
              }}
            >
              View post
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 85 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {
                history.push(`/privi-pods/FT/${notification.otherItemId}`);
              }}
            >
              Open Pod
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 86 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => acceptInvitation()}
            >
              Accept
            </PrimaryButton>
            <SecondaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => declineInvitation()}
            >
              Decline
            </SecondaryButton>
          </>
        ) : null}
        {notification.type === 94 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => changeOffer("negotiating")}
            >
              Negotiate
            </PrimaryButton>
            <SecondaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => changeOffer("declined")}
            >
              Decline
            </SecondaryButton>
          </>
        ) : null}
        {notification.type === 95 || notification.type === 97 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {
                /*getWIPCommunity(wall.otherItemId, wall.id);
                    handleOpenModalEditCommunityWIP();
                    refreshNotifications();*/
              }}
            >
              View
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 98 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {
                signTxStreamingAcceptOffer();
              }}
            >
              Sign Transaction
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 99 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => changeOffer("negotiating")}
            >
              Negotiate
            </PrimaryButton>
            <SecondaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => changeOffer("declined")}
            >
              Decline
            </SecondaryButton>
          </>
        ) : null}
        {notification.type === 100 || notification.type === 102 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {
                /*getWIPCommunity(wall.otherItemId, wall.id);
            handleOpenModalEditCommunityWIP();
            refreshNotifications();*/
              }}
            >
              View
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 103 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {
                signTxStreamingAcceptOffer();
              }}
            >
              Sign Transaction
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 104 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => acceptCollabRequest(notification)}
            >
              Accept
            </PrimaryButton>
            <SecondaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => refuseCollabRequest(notification)}
            >
              Decline
            </SecondaryButton>
          </>
        ) : null}
        {notification.type === 106 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => signTxAcceptCollab(notification)}
            >
              Sign Transaction
            </PrimaryButton>
          </>
        ) : null}

        {notification.type === 112 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {}}
            >
              View Offer
            </PrimaryButton>
          </>
        ) : null}

        {notification.type === 113 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {
                setSelectedNotification(notification);
                viewMore && viewMore(notification);
              }}
            >
              Media Selling Offer
            </PrimaryButton>
          </>
        ) : null}

        {notification.type === 114 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {
                setSelectedNotification(notification);
                handleShowContributionModal();
              }}
            >
              View Contribution
            </PrimaryButton>
          </>
        ) : null}

        {notification.type === 115 ? (
          <>
            <LinkButton
              onClick={() => {
                setSelectedNotification(notification);
                viewMore && viewMore(notification);
              }}
            >
              Visit Community
            </LinkButton>
          </>
        ) : null}

        {notification.type === 118 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={handleOpenReviewCommunityProposal}
            >
              Review Proposal
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 119 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {}}
            >
              View Proposal Details
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 120 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {}}
            >
              Review Proposal
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 121 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {}}
            >
              Create New Proposal
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 122 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {
                history.push(`/privi-dao/${notification.itemId}`);
              }}
            >
              Go to DAO
            </PrimaryButton>
          </>
        ) : null}

        {notification.type === 123 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={handleOpenReviewCommunityTokenProposal}
            >
              Review Proposal
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 124 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {}}
            >
              View Proposal Details
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 125 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {}}
            >
              Review Proposal
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 126 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {}}
            >
              Create New Proposal
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 127 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {
                history.push(`/privi-dao/${notification.itemId}`);
              }}
            >
              Go to DAO
            </PrimaryButton>
          </>
        ) : notification.type === 128 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {
                setOpenModalAcceptJoiningRequest(true);
              }}
            >
              Review Details
            </PrimaryButton>
          </>
        ) : notification.type === 129 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {
                history.push(`/profile/${notification.itemId}`);
              }}
            >
              View User Profile
            </PrimaryButton>
          </>
        ) : notification.type === 130 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => {
                history.push(`/privi-dao/${notification.otherItemId}`);
              }}
            >
              Go to DAO
            </PrimaryButton>
          </>
        ) : notification.type === 134 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={handleOpenReviewCommunityAddTreasurerProposal}
            >
              View Treasurer Proposal
            </PrimaryButton>
          </>
        ) : notification.type === 139 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={handleOpenReviewCommunityAirdropProposal}
            >
              View Airdrop Proposal
            </PrimaryButton>
          </>
        ) : notification.type === 144 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={handleOpenReviewCommunityAllocationProposal}
            >
              View Allocation Proposal
            </PrimaryButton>
          </>
        ) : notification.type === 149 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={handleOpenReviewCommunityTransferProposal}
            >
              View Transfer Proposal
            </PrimaryButton>
          </>
        ) : notification.type === 154 || notification.type === 159 || notification.type === 164 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={handleOpenReviewMediaAcquisitionProposal}
            >
              View Place Bid Proposal
            </PrimaryButton>
          </>
        ) : notification.type === 169 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={handleOpenReviewCommunityEjectMemberProposal}
            >
              View Eject Member Proposal
            </PrimaryButton>
          </>
        ) : notification.type === 179 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={handleOpenResolveCommunityJoinRequestProposal}
            >
              Resolve Join Request
            </PrimaryButton>
          </>
        ) : notification.type === 184 ? (
          <>
            <PrimaryButton className={theme === "dark" ? classes.darkButton : classes.emptyStyle} size="small">
              View Proposal
            </PrimaryButton>
          </>
        ) : notification.type === 189 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={handleOpenReviewCommunityEjectTreasurerProposal}
            >
              View Eject Treasurer Proposal
            </PrimaryButton>
          </>
        ) : notification.type === 194 ||
          notification.type === 200 ||
          notification.type === 202 ||
          notification.type === 204 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={handleOpenSignatureModal}
            >
              Accept
            </PrimaryButton>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={removeNotification}
            >
              Ignore
            </PrimaryButton>
          </>
        ) : notification.type === 199 || notification.type === 201 || notification.type === 203 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => handleMemberVoting(true)}
            >
              Accept
            </PrimaryButton>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => handleMemberVoting(false)}
            >
              Decline
            </PrimaryButton>
          </>
        ) : notification.type === 200 ? (
          <>
            <PrimaryButton
              className={theme === "dark" ? classes.darkButton : classes.emptyStyle}
              size="small"
              onClick={() => handleOpenSignatureModal()}
            >
              Create Proposal
            </PrimaryButton>
          </>
        ) : null}
      </ButtonContainer>
      {openModalAcceptJoiningRequest && (
        <RequestedJoinDAOModal
          open={openModalAcceptJoiningRequest}
          userId={notification.itemId}
          CommunityAddress={notification.pod}
          onCloseDialog={setOpenModalAcceptJoiningRequest(false)}
        />
      )}

      <SignatureRequestModal
        theme={theme}
        open={openSignRequestModal}
        address={userSelector.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleAccept}
        handleClose={handleCloseSignatureModal}
      />
      <EditCommunityWIPModal
        community={community}
        open={openModalEditCommunityWIP}
        handleClose={handleCloseModalEditCommunityWIP}
        isCreator={community.Creator === userSelector.id}
        refreshCommunity={() => getWIPCommunity(community.id, null)}
        refreshAllProfile={() => refreshAllProfile(userSelector.id)}
      />
      {notification.type === 118 && (
        <ReviewDAOProposalModal
          open={openReviewCommunityProposal}
          handleClose={handleCloseReviewCommunityProposal}
          proposalId={notification.itemId}
        />
      )}
      {notification.type === 123 && (
        <ReviewDAOTokenProposalModal
          open={openReviewCommunityProposal}
          handleClose={handleCloseReviewCommunityProposal}
          proposalId={notification.itemId}
        />
      )}
      {(proposalType == "airdrop" || proposalType == "allocation") && (
        <ReviewCommunityAirdropProposalModal
          open={openReviewCommunityProposal}
          handleClose={handleCloseReviewCommunityProposal}
          proposalId={notification.itemId}
        />
      )}
      {(proposalType == "addTreasurer" ||
        proposalType == "ejectTreasurer" ||
        proposalType == "addMember" ||
        proposalType == "ejectMember") && (
        <ReviewCommunityMemberProposalModal
          open={openReviewCommunityProposal}
          handleClose={handleCloseReviewCommunityProposal}
          proposalId={notification.itemId}
          proposalType={proposalType}
        />
      )}
      {proposalType == "mediaAcquisition" && (
        <ReviewCommunityMediaAcquisitionProposalModal
          open={openReviewCommunityProposal}
          handleClose={handleCloseReviewCommunityProposal}
          proposalId={notification.itemId}
        />
      )}
      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus("")}
        />
      )}
    </>
  );
};
