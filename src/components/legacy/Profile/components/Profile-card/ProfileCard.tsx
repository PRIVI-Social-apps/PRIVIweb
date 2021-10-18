import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { withStyles, MenuItem, Popper, Grow, Paper, ClickAwayListener, MenuList } from "@material-ui/core";
import { useSelector } from "react-redux";
import IndividualBadgeModal from "../Badge-hexagon/IndividualBadgeModal";
import SocialTokenModal from "../Profile-Modals/Social-Token-Modal/SocialTokenModal";
import CommunityModal from "../Profile-Modals/Community-Modal/CommunityModal";
import PodModal from "../Pod-Modal/PodModal";
import EditCommunityWIPModal from "../../modals/Edit-WIPs/EditCommunityWIPModal";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import EditNFTMediaWIPModal from "../../modals/Edit-WIPs/EditNFTMediaWIPModal";
import URL from "shared/functions/getURL";
import equal from "deep-equal";
import { getUser, getUsersInfoList } from "store/selectors";

import { ReactComponent as ArrowForwardIcon } from "assets/icons/long-arrow-alt-right-solid.svg";

import "./ProfileCard.css";

const arePropsEqual = (prevProps, currProps) => {
  return equal(prevProps.item, currProps.item);
};

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

const ProfileCard = React.memo((props: any) => {
  const user = useSelector(getUser);
  const userList = useSelector(getUsersInfoList);
  const history = useHistory();

  const [openShareMenu, setOpenShareMenu] = useState(false);
  const anchorShareMenuRef = useRef<HTMLButtonElement>(null);
  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();

  const [item, setItem] = useState<any>({});
  const [status, setStatus] = useState<any>("");

  const [creator, setCreator] = useState<any>(null);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    if (props.type === "Social Token") {
      history.push(`/profile/${window.location.href.split("/")[5]}/socialToken/${item.TokenSymbol}`);
      return;
    }
    if (item.id) getWIPNFTMedia(item.id);
    setOpenModal(true);
  };

  useEffect(() => {
    if (props.item && userList) {
      const foundUser = userList.find(
        user =>
          user.id === props.item.Creator ||
          user.id === props.item.CreatorId ||
          user.address === props.item.Creator ||
          user.address === props.item.CreatorId
      );
      setCreator(foundUser);
    }
  }, [props.item.Creator, props.item.CreatorId, userList]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenShareModal = e => {
    e.stopPropagation();
    e.preventDefault();

    shareMediaToSocial(props.item.id, "Community");
  };

  const handleOpenQRCodeModal = () => {
    shareMediaWithQrCode(props.item?.Name, `communities/${props.item?.Name.replace(/\s/g, "")}`);
  };

  const handleToggleShareMenu = e => {
    e.stopPropagation();
    e.preventDefault();

    setOpenShareMenu(prevShareMenuOpen => !prevShareMenuOpen);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenShareMenu(false);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  const handleLikeCard = () => {
    const itemCopy = { ...item };
    itemCopy.userAddress = user.id;
    let path = "";

    if (props.type.includes("NFT")) {
      path = `/pods/like`;
    } else if (props.type === "FT") {
      path = `/pods/like`;
    } else if (props.type === "Credit") {
      path = `/priviCredit/like`;
    } else if (props.type === "Community") {
      path = `/community/like`;
    } else if (props.type === "Social Token") {
      path = `/social/like`;
    }

    itemCopy.liked = !item.liked;
    axios
      .post(`${URL()}` + path, itemCopy)
      .then(response => {
        if (response.data.success) {
          if (itemCopy.liked) {
            if (itemCopy.Likes) {
              if (!itemCopy.Likes.some(like => like.userId === user.id)) {
                itemCopy.Likes.push({ userId: user.id, date: new Date() });
              }
            } else itemCopy.Likes = [{ userId: user.id, date: new Date() }];
          } else {
            if (itemCopy.Likes) {
              itemCopy.Likes = itemCopy.Likes.filter(item => item.userId !== user.id);
            }
          }

          setItem(itemCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleWIPItem = React.useCallback(
    newItem => {
      let i = {
        ...newItem,
        name: "",
        imageURL: "",
        inverted: 0,
        dailyChanges: 0,
        ownedBy: 0,
        userName: "",
        userImage: "",
        chain: "PRIVI",
        owned: false,
        hidden: newItem.hidden ?? false,
        liked: newItem.Likes && newItem.Likes.find(likeObj => likeObj.userId === user.id) ? true : false,
        TotalSupply: newItem.TotalSupply,
      };
      i.imageURL = `${newItem.Url}?${Date.now()}`;
      if (props.type === "Social Token") {
        i.name = newItem.TokenName ?? "";
      } else if (props.type === "Community" || newItem.CommunityAddress) {
        i.name = newItem.Name ?? "";
      } else if (props.type === "FT" || (newItem.PodAddress && newItem.AMM)) {
        i.name = newItem.Name ?? "";
      } else if (props.type === "NFT" || (newItem.PodAddress && !newItem.AMM)) {
        i.name = newItem.Name ?? "";
      } else if (props.type === "Credit" || newItem.CreditAddress) {
        i.name = newItem.CreditName ?? "";
      } else if (props.type === "Badge") {
        i.name = newItem.Name ?? "";
      } else if (props.type === "WIP") {
        i.name = newItem.Name ?? "";
      }

      if (i.tokenData) {
        i.ownedBy = i.tokenData.Holders ? i.tokenData.Holders.length : 0;
        i.dailyChanges = i.tokenData.pctChange ?? 0;
        i.inverted = i.tokenData.price ? i.tokenData.price.toFixed(4) : 0;
      }
      if (i.tokenData && i.tokenData.Holders) {
        i.owned = i.tokenData.Holders.findIndex(holder => holder === user.id) > 0 ? true : false;
      } else if (i.Members) {
        i.owned = i.Members.findIndex(member => member.id === user.id) > 0 ? true : false;
      }
      setItem(i);
    },
    [setItem, props.type]
  );

  useEffect(() => {
    if (props.item && props.type) {
      handleWIPItem(props.item);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.item]);

  const getWIPCommunity = (communityId: string) => {
    if (communityId) {
      axios
        .get(`${URL()}/community/getWIP/${communityId}/${user.id}/null`)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            handleWIPItem({ ...resp.data });
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

  const getWIPNFTMedia = (NFTMediaId: string) => {
    if (NFTMediaId) {
      axios
        .get(`${URL()}/pod/NFT/getWIP/${NFTMediaId}/${user.id}/null`)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            handleWIPItem({ ...resp.data, id: NFTMediaId });
          } else {
            setStatus({
              msg: "Error getting NFTMedia",
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(e => {
          console.log(e);
          setStatus({
            msg: "Error getting NFTMedia",
            key: Math.random(),
            variant: "error",
          });
        });
    } else {
      setStatus({
        msg: "Error getting NFTMedia",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const handleChangePrivacy = () => {
    const body: any = {};
    switch (props.type) {
      case "Social Token":
        body.ItemId = item.PoolAddress;
        break;
      case "Community":
        body.ItemId = item.CommunityAddress;
        break;
      case "Credit":
        body.ItemId = item.CreditAddress;
        break;
      case "NFT":
        body.ItemId = item.PodAddress;
        break;
      case "Digital NFT":
        body.ItemId = item.PodAddress;
        break;
      case "FT":
        body.ItemId = item.PodAddress;
        break;
      case "Media":
        body.ItemId = item.MediaSymbol;
        break;
      case "WIP":
        body.ItemId = item.id;
        break;
    }
    body.UserId = user.id;

    axios
      .post(`${URL()}/user/toggleHideItem`, body)
      .then(response => {
        if (response.data.success) {
          setItem({
            ...item,
            hidden: !item.hidden,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const isBookmarked = () => {
    if (item.Bookmarks) {
      if (item.Bookmarks.some(bookmark => bookmark.userId === user.id)) {
        return true;
      }
    }

    return false;
  };

  const handleSave = e => {
    e.stopPropagation();
    e.preventDefault();

    const itemCopy = { ...item };
    itemCopy.userAddress = user.id;
    itemCopy.bookmarked = !isBookmarked();

    let path = `/community/bookmark`;
    axios
      .post(`${URL()}` + path, itemCopy)
      .then(response => {
        if (response.data.success) {
          if (itemCopy.bookmarked) {
            if (itemCopy.Bookmarks) {
              if (!itemCopy.Bookmarks.some(bookmark => bookmark.userId === user.id)) {
                itemCopy.Bookmarks.push({ userId: user.id, date: new Date() });
              }
            } else itemCopy.Bookmarks = [{ userId: user.id, date: new Date() }];
          } else {
            if (itemCopy.Bookmarks) {
              itemCopy.Bookmarks = itemCopy.Bookmarks.filter(item => item.userId !== user.id);
            }
          }

          setItem(itemCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  if (
    item &&
    Object.keys(item).length !== 0 &&
    item.constructor === Object &&
    (props.userProfile.id !== user.id ? !item.hidden : true)
  )
    return (
      <div className="profile-card">
        <div
          className="profile-image"
          style={
            props.type !== "Social Token" && props.type !== "Badge"
              ? item.dimensions
                ? {
                  height: 0,
                  paddingBottom: `${(item.dimensions.height / item.dimensions.width) * 100}%`,
                }
                : {
                  height: "inhertit",
                }
              : {
                height: 200,
              }
          }
        >
          <div
            className={
              props.type !== "Social Token" && props.type !== "Badge" && item.dimensions
                ? "aspect-ratio-wrapper"
                : "non-aspect-ratio-wrapper"
            }
          >
            {props.type !== "Social Token" &&
              props.type !== "Badge" &&
              item.imageURL &&
              item.imageURL.length > 0 ? (
              <div
                className="card-image"
                style={{
                  cursor: "pointer",
                }}
                onClick={handleOpenModal}
              >
                <img className="card-img" src={item.imageURL} alt={"card"} />
              </div>
            ) : (
              <div
                className="card-image with-image"
                style={{
                  cursor: "pointer",
                }}
                onClick={handleOpenModal}
              >
                {props.type === "Social Token" ? (
                  <div
                    className={"token-image"}
                    style={{
                      backgroundImage: item.imageURL?.length > 0 ? `url(${item.imageURL})` : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ) : props.type === "Badge" ? (
                  <div className="hex">
                    <img
                      className="token-image"
                      src={item.imageURL.length > 0 ? item.imageURL : ""}
                      alt="hexagon"
                    />
                  </div>
                ) : null}
                {props.type !== "Badge" ? (
                  ""
                ) : (
                  <div className="isLocked">
                    {item.hidden ? (
                      <svg
                        width="16"
                        height="20"
                        viewBox="0 0 16 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 9V8.25C0.585786 8.25 0.25 8.58579 0.25 9H1ZM15 9H15.75C15.75 8.58579 15.4142 8.25 15 8.25V9ZM15 19V19.75C15.4142 19.75 15.75 19.4142 15.75 19H15ZM1 19H0.25C0.25 19.4142 0.585786 19.75 1 19.75L1 19ZM1 9.75H15V8.25H1V9.75ZM14.25 9V19H15.75V9H14.25ZM15 18.25H1V19.75H15V18.25ZM1.75 19V9H0.25V19H1.75ZM4.75 5C4.75 3.20507 6.20507 1.75 8 1.75V0.25C5.37665 0.25 3.25 2.37665 3.25 5H4.75ZM8 1.75C9.79493 1.75 11.25 3.20507 11.25 5H12.75C12.75 2.37665 10.6234 0.25 8 0.25V1.75ZM3.25 5V9H4.75V5H3.25ZM11.25 5V9H12.75V5H11.25Z"
                          fill="black"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="20"
                        viewBox="0 0 16 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 9V8.25C0.585786 8.25 0.25 8.58579 0.25 9H1ZM15 9H15.75C15.75 8.58579 15.4142 8.25 15 8.25V9ZM15 19V19.75C15.4142 19.75 15.75 19.4142 15.75 19H15ZM1 19H0.25C0.25 19.4142 0.585786 19.75 1 19.75L1 19ZM11.25 5C11.25 5.41421 11.5858 5.75 12 5.75C12.4142 5.75 12.75 5.41421 12.75 5H11.25ZM3.25 9C3.25 9.41421 3.58579 9.75 4 9.75C4.41421 9.75 4.75 9.41421 4.75 9H3.25ZM1 9.75H15V8.25H1V9.75ZM14.25 9V19H15.75V9H14.25ZM15 18.25H1V19.75H15V18.25ZM1.75 19V9H0.25V19H1.75ZM4.75 5C4.75 3.20507 6.20507 1.75 8 1.75V0.25C5.37665 0.25 3.25 2.37665 3.25 5H4.75ZM8 1.75C9.79493 1.75 11.25 3.20507 11.25 5H12.75C12.75 2.37665 10.6234 0.25 8 0.25V1.75ZM3.25 5V9H4.75V5H3.25Z"
                          fill="black"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {props.type === "Community" ? (
            <div className="profile-community-card-members">
              {props.item.Members?.slice(0, 3).map((member, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      backgroundImage: userList.find(user => user.id === member.id)?.imageURL
                        ? `url(${userList.find(user => user.id === member.id)?.imageURL})`
                        : `url(${require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className="member-image"
                  />
                );
              })}
              {item.Members?.length > 3 && (
                <span className="community-card-member-numbers">+{item.Members?.length - 3}</span>
              )}
            </div>
          ) : (
            <div
              className="avatar"
              style={{
                backgroundImage:
                  creator && creator.imageUrl
                    ? `url(${creator.imageUrl})`
                    : `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => {
                history.push(`/profile/${creator.id}`);
              }}
            />
          )}
          {isSignedIn() && (
            <div className="actions">
              {props.type !== "Social Token" && (
                <span onClick={handleSave}>
                  <img src={require("assets/priviIcons/list.png")} alt={"list"} />
                </span>
              )}
              {props.type !== "Social Token" && (
                <span onClick={handleToggleShareMenu} ref={anchorShareMenuRef}>
                  <img src={require("assets/priviIcons/share.png")} alt={"share"} />
                </span>
              )}
              {openShareMenu && (
                <Popper
                  open={openShareMenu}
                  anchorEl={anchorShareMenuRef.current}
                  transition
                  disablePortal={false}
                  style={{ position: "inherit" }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                        position: "inherit",
                      }}
                    >
                      <Paper className="popoverPaper">
                        <ClickAwayListener onClickAway={handleCloseShareMenu}>
                          <MenuList
                            autoFocusItem={openShareMenu}
                            id="menu-list-grow"
                            onKeyDown={handleListKeyDownShareMenu}
                          >
                            <CustomMenuItem onClick={handleOpenShareModal}>
                              <img
                                src={require("assets/icons/butterfly.png")}
                                alt={"spaceship"}
                                style={{ width: 20, height: 20, marginRight: 5 }}
                              />
                              Share on social media
                            </CustomMenuItem>

                            <CustomMenuItem onClick={handleOpenQRCodeModal}>
                              <img
                                src={require("assets/icons/qrcode_small.png")}
                                alt={"spaceship"}
                                style={{ width: 20, height: 20, marginRight: 5 }}
                              />
                              Share With QR Code
                            </CustomMenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              )}
              <span onClick={handleLikeCard}>
                <img
                  src={require(item.liked
                    ? "assets/priviIcons/heart_filled.png"
                    : "assets/priviIcons/heart.png")}
                  alt={"heart"}
                />
              </span>
            </div>
          )}
          <div className="badge">{`Chain: ${item.chain}`}</div>
        </div>
        <div className="profile-card__body">
          <div className="profile-title" onClick={handleOpenModal}>
            <span>{item.name}</span>
            {/* {
              item.Privacy === 'Public'
                ? <img src={require('assets/icons/lockOn.svg')} alt='lockOn' />
                : <img src={require('assets/icons/lockOff.svg')} alt='lockOff' />
            } */}
          </div>
          <div className="card-stats">
            <div>
              <div className="title">💜 Likes</div>
              <div className="content">{item.Likes ? item.Likes.length : 0}</div>
            </div>
            <div>
              <div className="title">🚀 Shares</div>
              <div className="content">{item.Shares ? item.Shares.length : 0}</div>
            </div>
            <div>
              <div className="title">👓 Views</div>
              <div className="content">{item.TotalViews || 0}</div>
            </div>
          </div>
          {props.type === "Badge" ? (
            <div className="info">
              <div className="avatar-container">
                <div
                  className="avatar"
                  style={{
                    backgroundImage: user
                      ? !user.anon
                        ? user.hasPhoto && user.url
                          ? `url(${user.url}?${Date.now()})`
                          : "none"
                        : user.anonAvatar && user.anonAvatar.length > 0
                          ? `url(${require(`assets/anonAvatars/${user.anonAvatar}`)})`
                          : `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`
                      : `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
              <div className="totalSupply">{`Total Supply: ${item.TotalSupply || 0}`}</div>
            </div>
          ) : (
            <div className="info" onClick={handleOpenModal}>
              <div className="main">
                <span>24h change</span>
                <span className="change">
                  {item.dailyChanges > 0 ? (
                    <div style={{ transform: "rotate(-45deg)" }}>
                      <ArrowForwardIcon />
                    </div>
                  ) : item.dailyChanges < 0 ? (
                    <div style={{ transform: "rotate(45deg)" }}>
                      <ArrowForwardIcon />
                    </div>
                  ) : (
                    ""
                  )}
                  {item.dailyChanges > 0 ? ` +` : ` `}
                  {item.dailyChanges
                    ? item.dailyChanges.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })
                    : 0}
                  {"%"}
                </span>
              </div>
              {props.type !== "Community" && (
                <div className="price">
                  <span>Price</span>
                  <span className="value">ETH {item.InitialSupply}</span>
                  {props.type !== "Social Token" && (
                    <span>
                      (
                      {props.userProfile.currency === "EUR"
                        ? "€"
                        : props.userProfile.currency === "USD"
                          ? "$"
                          : "£"}
                      {` ${item.inverted}`})
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
          {props.type === "Badge" && openModal ? (
            <IndividualBadgeModal badge={item} open={openModal} handleClose={handleCloseModal} />
          ) : props.type === "Community" && openModal ? (
            <CommunityModal community={item} open={openModal} handleClose={handleCloseModal} />
          ) : props.type === "FT" || props.type === "NFT" ? (
            <PodModal pod={item} open={openModal} handleClose={handleCloseModal} />
          ) : props.type === "Social Token" ? (
            <SocialTokenModal
              className="socialTokenModal"
              socialToken={item}
              chain={item.chain}
              open={openModal}
              handleClose={handleCloseModal}
            />
          ) : props.type === "WIP" && item.CommunityAddress && openModal ? (
            <EditCommunityWIPModal
              community={item}
              open={openModal}
              handleClose={handleCloseModal}
              isCreator={item.Creator === user.id}
              refreshCommunity={() => getWIPCommunity(item.id)}
              refreshAllProfile={() => props.refreshAllProfile(user.id)}
            />
          ) : props.type === "WIP" && item.WIPType === "NFTMedia" && openModal ? (
            <EditNFTMediaWIPModal
              NFTMedia={item}
              open={openModal}
              handleClose={handleCloseModal}
              isCreator={item.Creator === user.id}
              refreshNFTMedia={() => getWIPNFTMedia(item.id)}
              refreshAllProfile={() => props.refreshAllProfile(user.id)}
            />
          ) : null}
          {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : null}
        </div>
      </div>
    );
  else return null;
}, arePropsEqual);

export default ProfileCard;
