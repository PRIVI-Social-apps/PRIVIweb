import React, { useEffect, useRef, useState } from "react";
import "./Item-my-wall.css";
import URL from "shared/functions/getURL";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { setSelectedUser } from "store/actions/SelectedUser";
import EditCommunityWIPModal from "../../modals/Edit-WIPs/EditCommunityWIPModal";
import { signTransaction } from "shared/functions/signTransaction";
import { getUser, getUsersInfoList } from "store/selectors/user";
import WallContent from "./content/WallContent";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const ItemMyWall = (props: any) => {
  const dispatch = useDispatch();
  const history = useHistory();

  let userSelector = useSelector(getUser);
  let users = useSelector(getUsersInfoList);
  const [wall, setWall] = useState<any>({});
  const [status, setStatus] = useState<any>("");

  const [wallPost, setWallPost] = useState<any>({});
  const [wallPostType, setWallPostType] = useState<string>("");

  const [userSearcher, setUserSearcher] = useState<string>("");
  const [usersSearched, setUsersSearched] = useState<any[]>([]);

  const [community, setCommunity] = useState<any>({});
  const [isUserSearching, setIsUserSearching] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const [openModalWallPost, setOpenModalWallPost] = useState<boolean>(false);
  const handleOpenModalWallPost = () => {
    setOpenModalWallPost(true);
  };
  const handleCloseModalWallPost = () => {
    setOpenModalWallPost(false);
  };

  const [openModalEditCommunityWIP, setOpenModalEditCommunityWIP] = useState<boolean>(false);
  const handleOpenModalEditCommunityWIP = () => {
    setOpenModalEditCommunityWIP(true);
  };

  const handleCloseModalEditCommunityWIP = () => {
    setOpenModalEditCommunityWIP(false);
  };

  const searchUser = search => {
    setIsUserSearching(true);
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
        setIsUserSearching(false);
      })
      .catch(err => {
        console.log({
          msg: err.error,
        });
        setIsUserSearching(false);
      });
  };

  const PhotoMyWall = (props: any) => {
    const [photoURL, setPhotoURL] = useState<string>("");

    useEffect(() => {
      if (props.itemId && props.type) {
        if (props.type === "user") {
          //set user image
          let img: any = "";
          if (users && users.length > 0) {
            users.forEach(user => {
              if (user.id === props.itemId) {
                img = user.url;
              }
            });
          }
          setPhotoURL(img);
        } else if (props.type === "NFTPod") {
          setPhotoURL(`${URL()}/pod/NFT/getPhoto/${props.itemId}`);
        } else if (props.type === "FTPod") {
          setPhotoURL(`${URL()}/pod/FT/getPhoto/${props.itemId}`);
        }
      }
    }, [props.imageURL, props.itemId, props.type]);

    if (photoURL.length > 0) {
      if (props.itemId === userSelector.id) {
        return (
          <div
            className="myWallPhoto"
            style={{
              backgroundImage: `url(${photoURL})`,
            }}
          />
        );
      } else {
        return (
          <div
            className="myWallPhoto"
            onClick={() => {
              history.push(`/profile/${props.itemId}`);
              dispatch(setSelectedUser(props.itemId));
            }}
            style={{
              backgroundImage: `url(${photoURL})`,
              cursor: "pointer",
            }}
          />
        );
      }
    } else return <div className="myWallPhoto"></div>;
  };

  useEffect(() => {
    //console.log(props.wall);
    setWall(props.wall);
  }, [props.wall]);

  const likePost = (wall: any) => {
    axios
      .post(`${URL()}/user/wall/likePost`, {
        wallPostId: wall.id,
        userId: userSelector.id,
      })
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;

          let wallCopy = { ...wall };
          wallCopy.likes = data.likes;
          wallCopy.dislikes = data.dislikes;
          wallCopy.numLikes = data.numLikes;
          wallCopy.numDislikes = data.numDislikes;
          setWall(wallCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const dislikePost = (wall: any) => {
    axios
      .post(`${URL()}/user/wall/dislikePost`, {
        wallPostId: wall.id,
        userId: userSelector.id,
      })
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;

          let wallCopy = { ...wall };
          wallCopy.likes = data.likes;
          wallCopy.dislikes = data.dislikes;
          wallCopy.numLikes = data.numLikes;
          wallCopy.numDislikes = data.numDislikes;
          setWall(wallCopy);
        }
      })
      .catch(error => {
        console.log(error);
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
            props.refreshNotifications();
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
            props.refreshNotifications();
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
      setIsDataLoading(true);
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
          setIsDataLoading(false);
        })
        .catch(err => {
          setIsDataLoading(false);
          console.log(err);
          reject(err);
        });
    });
  };

  const removeNotification = () => {
    console.log("remove notification", wall);
    axios
      .post(`${URL()}/user/removeNotification`, {
        userId: userSelector.id,
        notificationId: wall.id,
      })
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          props.refreshNotifications();
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
    console.log(wall);
    axios
      .post(`${URL()}/user/inviteUserToPod`, {
        userId: user.id,
        podName: wall.pod,
        podId: wall.itemId,
        creatorId: wall.follower,
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
        communityId: wall.otherItemId,
        role: wall.comment,
      })
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          props.refreshNotifications();
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
        communityId: wall.otherItemId,
        role: wall.comment,
      })
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          props.refreshNotifications();
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
        communityId: wall.otherItemId,
        status: status,
        token: wall.token,
        amount: wall.amount,
        notificationId: wall.id,
      })
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          props.refreshNotifications();
          props.refreshAllProfile();
          setStatus({
            msg: "Action done success",
            key: Math.random(),
            variant: "success",
          });
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
      setIsDataLoading(true);
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
          setIsDataLoading(false);
        })
        .catch(e => {
          console.log(e);
          setStatus({
            msg: "Error getting Community",
            key: Math.random(),
            variant: "error",
          });
          setIsDataLoading(false);
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
    let diffDate = Math.floor(wall.comment / 1000) - (Math.floor(Date.now() / 1000) + 10);
    const body: any = {
      sender: userSelector.id,
      receiver: wall.pod,
      amountPeriod: wall.amount / diffDate,
      token: wall.token,
      startDate: Math.floor(Date.now() / 1000) + 10,
      endDate: Math.floor(wall.comment / 1000),
    };
    const [hash, signature] = await signTransaction(userSelector.mnemonic, body);
    body.userId = userSelector.id;
    body.communityId = wall.otherItemId;
    body.Hash = hash;
    body.Signature = signature;

    axios.post(`${URL()}/community/signTransactionAcceptOffer`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        props.refreshNotifications();
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
        props.refreshNotifications();
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
        props.refreshNotifications();
        props.refreshAllProfile();
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
        collabs[userSelector.id] = (100 - sumShare) / 100;
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
        props.refreshNotifications();
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

  const ButtonsNotification = (propsFunction: any) => {
    return (
      <div>
        {wall.type === 1 ? (
          <div className="flexMyWallRow">
            <button
              onClick={() => acceptDeclineFollowing({ id: wall.itemId }, true, wall.id)}
              className="greenMyWallButton acceptMyWallButton flexDisplayCenter"
            >
              Accept
            </button>
            <button
              onClick={() => acceptDeclineFollowing({ id: wall.itemId }, false, wall.id)}
              className="greenMyWallButton declineMyWallButton flexDisplayCenter"
            >
              Decline
            </button>
          </div>
        ) : null}
        {wall.type === 10 ? (
          <div className="marginLeftOptionWall">
            <InputWithLabelAndTooltip
              overriedClasses="textFieldSidebarProfile no-margin-bottom"
              style={{
                width: "calc(100% - 24px)",
                height: "35px",
                marginTop: "10px",
                marginBottom: "10px",
              }}
              type="text"
              inputValue={userSearcher}
              reference={inputRef}
              onInputValueChange={elem => {
                let value = elem.target.value;
                setUserSearcher(value);
                if (value.length >= 3) {
                  searchUser(value);
                } else {
                  setUsersSearched([]);
                }
              }}
              placeHolder="Search user by name"
            />
            {userSearcher && userSearcher.length >= 3 ? (
              <LoadingWrapper loading={isUserSearching}>
                <>
                  {usersSearched && usersSearched.length !== 0 ? (
                    usersSearched.map((user, i) => {
                      return (
                        <div className="userSearchedItem">
                          <div
                            className="photoUserSearchedItem"
                            style={{
                              backgroundImage: user.url ? `url(${user.url}?${Date.now()})` : "none",
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
                </>
              </LoadingWrapper>
            ) : (
              <div className="noItemsWallLabel" style={{ marginTop: "0" }}>
                Write 3 letters min.
              </div>
            )}
          </div>
        ) : null}
        {wall.type === 30 ? (
          <div className="flexMyWallRow">
            <button
              onClick={() => {
                history.push(`/privi-pods/FT/${wall.pod}`);
              }}
              className="greenMyWallButton infoMyWallButton flexDisplayCenter"
            >
              Open Pod
            </button>
          </div>
        ) : null}
        {wall.type === 31 ? (
          <div className="flexMyWallRow">
            <button
              onClick={async () => {
                await getPostById(wall.otherItemId, "pod");
                handleOpenModalWallPost();
              }}
              className="greenMyWallButton infoMyWallButton flexDisplayCenter"
            >
              View post
            </button>
          </div>
        ) : null}
        {wall.type === 41 ? (
          <div className="flexMyWallRow">
            <button
              onClick={() => {
                history.push(`/lendings/credit-pools/${wall.otherItemId}`);
              }}
              className="greenMyWallButton infoMyWallButton flexDisplayCenter"
            >
              Open Credit
            </button>
          </div>
        ) : null}
        {wall.type === 42 ? (
          <div className="flexMyWallRow">
            <button
              onClick={async () => {
                await getPostById(wall.otherItemId, "priviCredit");
                handleOpenModalWallPost();
              }}
              className="greenMyWallButton infoMyWallButton flexDisplayCenter"
            >
              View post
            </button>
          </div>
        ) : null}
        {wall.type === 45 ? (
          <div className="flexMyWallRow">
            <button onClick={() => { }} className="greenMyWallButton infoMyWallButton flexDisplayCenter">
              Send remainder
            </button>
          </div>
        ) : null}
        {wall.type === 46 ? <div></div> : null}
        {wall.type === 76 ? (
          <div>
            <div className="commentInNotification">{wall.comment}</div>
            <button
              onClick={async () => {
                await getPostById(wall.otherItemId, wall.typeItemId);
                handleOpenModalWallPost();
              }}
              className="greenMyWallButton infoMyWallButton flexDisplayCenter"
            >
              View post
            </button>
          </div>
        ) : null}
        {wall.type === 77 ? (
          <div>
            {wall.comment && wall.comment !== "" ? (
              <div className="commentInNotification">{wall.comment}</div>
            ) : null}
            <button
              onClick={async () => {
                await getPostById(wall.otherItemId, wall.typeItemId);
                handleOpenModalWallPost();
              }}
              className="greenMyWallButton infoMyWallButton flexDisplayCenter"
            >
              View post
            </button>
          </div>
        ) : null}
        {wall.type === 78 ? (
          <div>
            {wall.comment && wall.comment !== "" ? (
              <div className="commentInNotification">{wall.comment}</div>
            ) : null}
            <button
              onClick={async () => {
                await getPostById(wall.otherItemId, wall.typeItemId);
                handleOpenModalWallPost();
              }}
              className="greenMyWallButton infoMyWallButton flexDisplayCenter"
            >
              View post
            </button>
          </div>
        ) : null}
        {wall.type === 79 ? (
          <div className="flexMyWallRow newRow">
            <button onClick={async () => { }} className="greenMyWallButton infoMyWallButton flexDisplayCenter">
              View comment
            </button>
          </div>
        ) : null}
        {wall.type === 80 ? (
          <div className="flexMyWallRow newRow">
            <button onClick={async () => { }} className="greenMyWallButton infoMyWallButton flexDisplayCenter">
              View comment
            </button>
          </div>
        ) : null}
        {wall.type === 81 ? (
          <div className="flexMyWallRow">
            <button onClick={async () => { }} className="greenMyWallButton infoMyWallButton flexDisplayCenter">
              View comment
            </button>
          </div>
        ) : null}
        {wall.type === 82 ? (
          <div className="flexMyWallRow">
            <button
              onClick={async () => {
                await getPostById(wall.otherItemId, "community");
                handleOpenModalWallPost();
              }}
              className="greenMyWallButton infoMyWallButton flexDisplayCenter"
            >
              View post
            </button>
          </div>
        ) : null}
        {wall.type === 85 ? (
          <div className="flexMyWallRow">
            <button
              onClick={() => {
                history.push(`/privi-pods/FT/${wall.otherItemId}`);
              }}
              className="greenMyWallButton infoMyWallButton flexDisplayCenter"
            >
              Open Pod
            </button>
          </div>
        ) : null}
        {wall.type === 86 ? (
          <div className="flexMyWallRow">
            <button
              onClick={() => acceptInvitation()}
              className="greenMyWallButton acceptMyWallButton flexDisplayCenter"
            >
              Accept
            </button>
            <button
              onClick={() => declineInvitation()}
              className="greenMyWallButton declineMyWallButton flexDisplayCenter"
            >
              Decline
            </button>
          </div>
        ) : null}
        {wall.type === 94 ? (
          <div className="flexMyWallRow">
            <button
              onClick={() => changeOffer("negotiating")}
              className="greenMyWallButton acceptMyWallButton flexDisplayCenter"
            >
              Negotiate
            </button>
            <button
              onClick={() => changeOffer("declined")}
              className="greenMyWallButton declineMyWallButton flexDisplayCenter"
            >
              Decline
            </button>
          </div>
        ) : null}
        {wall.type === 95 || wall.type === 97 ? (
          <div className="flexMyWallRow">
            <button
              onClick={() => {
                /*getWIPCommunity(wall.otherItemId, wall.id);
                      handleOpenModalEditCommunityWIP();
                      props.refreshNotifications();*/
              }}
              className="greenMyWallButton acceptMyWallButton flexDisplayCenter"
            >
              View
            </button>
          </div>
        ) : null}
        {wall.type === 98 ? (
          <div className="flexMyWallRow">
            <button
              onClick={() => {
                signTxStreamingAcceptOffer();
              }}
              className="greenMyWallButton acceptMyWallButton flexDisplayCenter"
            >
              Sign Transaction
            </button>
          </div>
        ) : null}
        {wall.type === 99 ? (
          <div className="flexMyWallRow">
            <button
              onClick={() => changeOffer("negotiating")}
              className="greenMyWallButton acceptMyWallButton flexDisplayCenter"
            >
              Negotiate
            </button>
            <button
              onClick={() => changeOffer("declined")}
              className="greenMyWallButton declineMyWallButton flexDisplayCenter"
            >
              Decline
            </button>
          </div>
        ) : null}
        {wall.type === 100 || wall.type === 102 ? (
          <div className="flexMyWallRow">
            <button
              onClick={() => {
                /*getWIPCommunity(wall.otherItemId, wall.id);
              handleOpenModalEditCommunityWIP();
              props.refreshNotifications();*/
              }}
              className="greenMyWallButton acceptMyWallButton flexDisplayCenter"
            >
              View
            </button>
          </div>
        ) : null}
        {wall.type === 103 ? (
          <div className="flexMyWallRow">
            <button
              onClick={() => {
                signTxStreamingAcceptOffer();
              }}
              className="greenMyWallButton acceptMyWallButton flexDisplayCenter"
            >
              Sign Transaction
            </button>
          </div>
        ) : null}
        {wall.type === 104 ? (
          <div className="flexMyWallRow">
            <button
              onClick={() => acceptCollabRequest(wall)}
              className="greenMyWallButton acceptMyWallButton flexDisplayCenter"
            >
              Accept
            </button>
            <button
              onClick={() => refuseCollabRequest(wall)}
              className="greenMyWallButton declineMyWallButton flexDisplayCenter"
            >
              Decline
            </button>
          </div>
        ) : null}
        {wall.type === 106 ? (
          <div className="flexMyWallRow">
            <button
              onClick={() => signTxAcceptCollab(wall)}
              className="greenMyWallButton acceptMyWallButton flexDisplayCenter"
            >
              Sign Transaction
            </button>
          </div>
        ) : null}
        <EditCommunityWIPModal
          community={community}
          open={openModalEditCommunityWIP}
          handleClose={handleCloseModalEditCommunityWIP}
          isCreator={community.Creator === userSelector.id}
          refreshCommunity={() => getWIPCommunity(community.id, null)}
          refreshAllProfile={() => props.refreshAllProfile(userSelector.id)}
        />
      </div>
    );
  };
  return (
    <LoadingWrapper loading={isDataLoading}>
      <WallContent
        {...props}
        wall={wall}
        status={status}
        likePost={likePost}
        dislikePost={dislikePost}
        removeNotification={removeNotification}
        openModalWallPost={openModalWallPost}
        handleCloseModalWallPost={handleCloseModalWallPost}
        wallPost={wallPost}
        wallPostType={wallPostType}
        ButtonsNotification={ButtonsNotification}
        PhotoMyWall={PhotoMyWall}
      />
    </LoadingWrapper>
  );
};

export default ItemMyWall;
