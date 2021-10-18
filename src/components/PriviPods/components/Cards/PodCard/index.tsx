import React, { useEffect, useState } from "react";
import classnames from 'classnames';
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";

import {
  ClickAwayListener,
  Grow,
  MenuList,
  Paper,
  Popper,
  withStyles,
  MenuItem,
} from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";

import { setSelectedUser } from "store/actions/SelectedUser";
import { useTypedSelector } from "store/reducers/Reducer";
import ClaimPodModal from "components/PriviPods/modals/claimable/ClaimPod";
import { Variant } from "shared/constants/const";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { podCardStyles } from './index.styles';

import { ReactComponent as UserSolid } from "assets/icons/user-solid.svg";
import { ReactComponent as UserGroup } from "assets/icons/user-group.svg";
import { ReactComponent as PlaySolid } from "assets/icons/play-solid.svg";
import { ReactComponent as PriviChainIcon } from "assets/icons/priviChainIcon.svg";

const videoIcon = require("assets/mediaIcons/small/video.png");
const audioIcon = require("assets/mediaIcons/small/audio.png");
const blogSnapIcon = require("assets/mediaIcons/small/blog_snap.png");

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

export default function PodCard({ variant = Variant.Primary, ...props }) {
  const history = useHistory();
  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();
  const user = useTypedSelector(state => state.user);

  const dispatch = useDispatch();
  const styles = podCardStyles();

  const [pod, setPod] = useState<any>({});
  const [openClaimModal, setOpenClaimModal] = useState<boolean>(false);
  const [triggerClose, setTriggerClose] = useState<boolean>(false);

  const parentNode = React.useRef<any>();

  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setPod(props.pod);
  }, [props.pod]);

  const handleOpenClaimModal = () => {
    setOpenClaimModal(true);
  };

  const handleCloseClaimModal = e => {
    e.preventDefault();
    e.stopPropagation();
    setOpenClaimModal(false);
    setTriggerClose(!triggerClose);
  };

  const isLike = () => {
    if (pod.Likes) {
      if (pod.Likes.some(like => like.userId === user.id)) {
        return true;
      }
    }

    return false;
  };

  const isBookmarked = () => {
    if (pod.Bookmarks) {
      if (pod.Bookmarks.some(bookmark => bookmark.userId === user.id)) {
        return true;
      }
    }

    return false;
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

  const handleOpenShareModal = () => {
    shareMediaToSocial(pod.id || pod.urlSlug, 'Pod', props.type);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const handleLikeCard = e => {
    e.stopPropagation();
    e.preventDefault();

    const itemCopy = { ...pod };
    itemCopy.userAddress = user.id;
    itemCopy.liked = !isLike();

    let path = "/pod/like";
    if (props.type === "Digital-NFT") {
      path = "/mediaPod/like";
    }
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

          setPod(itemCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleFruit = type => {
    const body = {
      userId: user.id,
      podAddress: pod.PodAddress,
      fruitId: type,
      isDigtal: props.type === "Digital-NFT"
    };
    axios
      .post(`${URL()}/pod/fruit`, body).then(res => {
        if (res.data?.success) {
          const itemCopy = { ...pod };
          itemCopy.fruits = [
            ...(itemCopy.fruits || []),
            { userId: user.id, fruitId: type, date: new Date().getTime() },
          ];
        }
      });
  };

  const handleBookmark = e => {
    e.stopPropagation();
    e.preventDefault();

    const itemCopy = { ...pod };
    itemCopy.userAddress = user.id;
    itemCopy.bookmarked = !isBookmarked();

    let path = "/pod/bookmark";
    if (props.type === "Digital-NFT") {
      path = "/mediaPod/bookmark";
    }
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

          setPod(itemCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleOpenQRCodeModal = () => {
    const link = props.type?.includes("NFT")
      ? `new-privi-pods/MediaNFT/${pod.PodAddress}`
      : `new-privi-pods/FT/${pod.PodAddress}`;
    shareMediaWithQrCode(pod.id || pod.urlSlug, link);
  };

  return (
    <Box className={styles.podCard}>
      <Box
        className={styles.podImageContent}
      >
        <div
          className={styles.podImage}
          style={{
            backgroundImage:
              props.type === "claim-music" || props.type === "claim-video" || props.type === "claim-music-dao"
                ? pod.album_image
                  ? `url(${pod.album_image})`
                  : `url(${getRandomImageUrl()})`
                : pod.HasPhoto && pod.HasPhoto === true && pod.Url && pod.Url !== ""
                  ? `url(${pod.Url})`
                  : `url(${getRandomImageUrl()})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          ref={parentNode}
        >
          {props.type === "claim-video" && (
            <Box className={styles.playButtonBox}>
              <PlaySolid style={{ color: "white", width: "16px" }} />
            </Box>
          )}
        </div>
        {pod.CreatorImageURL ? (
          <Box
            className={styles.avatar}
            style={{
              backgroundImage: pod.CreatorImageURL ? `url(${pod.CreatorImageURL})` : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: 'pointer'
            }}
            onClick={() => {
              if (pod.Creator) {
                history.push(`/profile/${pod.Creator}`);
                dispatch(setSelectedUser(pod.Creator));
              }
            }}
          />
        ) : (
          <Box
            className={styles.avatar}
            onClick={() => {
              if (pod.Creator) {
                history.push(`/profile/${pod.Creator}`);
                dispatch(setSelectedUser(pod.Creator));
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <SvgIcon>
              <UserSolid />
            </SvgIcon>
          </Box>
        )}
        {props.type !== "claim-music-dao" && <Box className={styles.socialButtons}>
          <span className={styles.clickable} onClick={handleBookmark}>
            <img
              src={require(isBookmarked()
                ? "assets/priviIcons/bookmark-filled.svg"
                : "assets/priviIcons/bookmark.svg")}
              alt="bookmark"
            />
          </span>
          <span className={styles.clickable} onClick={handleToggleShareMenu} ref={anchorShareMenuRef}>
            <img src={require("assets/icons/share.svg")} alt="share" />
          </span>
          <span onClick={handleLikeCard} className={styles.clickable}>
            <img
              src={require(isLike() ? "assets/priviIcons/heart_filled.png" : "assets/priviIcons/heart.png")}
              alt={"heart"}
            />
          </span>
        </Box>}
        {variant === Variant.Primary && (
          <Box className={`${styles.podStatus} ${styles.topRightBox}`}>{pod.Status}</Box>
        )}
        {variant !== Variant.Primary && !props.isFractionalized && (
          <Box className={`${styles.userGroup} ${styles.topRightBox}`}>
            <UserGroup />
          </Box>
        )}
        {props.isFractionalized && (
          <Box className={`${styles.flexBox} ${styles.topRightBox}`}>
            <Box className={styles.fractionBox}>Fractionalised 50%</Box>
          </Box>
        )}
      </Box>
      <Box className={styles.podInfo}>
        <Box className={styles.flexBox} width={1} px={2}>
          <Box style={{ maxWidth: "calc(100% - 80px)" }}>
            <Box className={styles.podInfoName} onClick={() => {
              if (!props.disableClick) {
                if (props.isFractionalised) {
                  history.push(`/new-privi-pods/fractions/${pod.PodAddress}`);
                } else if (props.type === "claim-music" || props.type === "claim-video") {
                  history.push(`/new-privi-pods/claim-music/${pod.id}`);
                } else if (props.type === "claim-music-dao") {
                  history.push(`/privi-music-dao/claimable-music/${pod.id}`);
                } else if (props.type === "Digital-NFT") {
                  history.push(`/new-privi-pods/MediaNFT/${pod.PodAddress}`);
                } else {
                  if (props.type.includes("NFT")) {
                    history.push(`/new-privi-pods/MediaNFT/${pod.PodAddress}`);
                  } else {
                    history.push(`/new-privi-pods/FT/${pod.PodAddress}`);
                  }
                }
              }
            }}>{pod.Name ?? pod.TokenName ?? pod.MediaName ?? ""}</Box>
            {variant === Variant.Tertiary && (
              <Box className={styles.flexBox} mt={1} ml={2} justifyContent="flex-start !important">
                <Box>
                  <img src={videoIcon} alt="" width="20px" />
                </Box>
                <Box ml={1}>
                  <img src={audioIcon} alt="" width="20px" />
                </Box>
                <Box ml={1}>
                  <img src={blogSnapIcon} alt="" width="20px" />
                </Box>
              </Box>
            )}
          </Box>
          <FruitSelect fruitObject={pod} parentNode={parentNode.current} onGiveFruit={handleFruit} />
        </Box>
        {props.type === "claim-music-dao" && <Box className={classnames(styles.divider, "secondary")} />}
        <Box className={styles.podMainInfo}>
          {variant !== Variant.Tertiary && (
            <Box className={styles.podMainInfoContent}>
              <span>Reproductions: 34,589</span>
            </Box>
          )}
          <Box className={styles.divider} />
          {variant === Variant.Primary && (
            <Box className={styles.podMainInfoContent}>
              <Box>
                <span>Price</span>
                <p>${pod.MaxPrice || 0}</p>
              </Box>
              <Box>
                <span>Investors share</span>
                <p>{pod.InvestorDividend ? `${pod.InvestorDividend * 100}%` : "0%"}</p>
              </Box>
            </Box>
          )}
          {variant === Variant.Tertiary && (
            <>
              <Box className={styles.podMainInfoContent}>
                <Box>
                  <p>${pod.MaxPrice || 0}</p>
                  <span>Price</span>
                </Box>
                <Box>
                  <p>{pod.InvestorDividend ? `${pod.InvestorDividend * 100}%` : "0%"}</p>
                  <span>Investors share</span>
                </Box>
              </Box>
              {!props.isFractionalized && (
                <Box className={styles.claimButton} mt={2}>
                  <span>Claim</span>
                </Box>
              )}
            </>
          )}
          {variant === Variant.Secondary && (
            <Box className={styles.claimPodContent}>
              <Box className={styles.fundInfo}>
                <Box className={classnames(styles.fundValue, props.type === "claim-music-dao" && "secondary")}>
                  <span>🤑 Funds Raised</span>
                  <p>pUSD 190.321</p>
                </Box>
                {props.type === "claim-music-dao" ? (
                  <Box className={styles.fundTypeSecondary}>
                    <PriviChainIcon />
                    <p>Privi Chain</p>
                  </Box>
                ) : (
                  <Box className={styles.fundType}>
                    <Box className={styles.fundMark} />
                    <p>Privi Chain</p>
                  </Box>
                )}
              </Box>
              <Box
                className={styles.claimButton}
                onClick={handleOpenClaimModal}
              >
                <span>Claim</span>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <ClaimPodModal
        open={openClaimModal}
        handleClose={handleCloseClaimModal}
        triggerClose={triggerClose}
        artists={[{ imageURL: pod.album_image, name: 'mock' }] || []}
        selectedSong={pod}
      />
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
              <Paper className={styles.paper}>
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
    </Box>
  );
}

const getRandomImageUrl = () => {
  return require(`assets/podImages/${Math.floor(Math.random() * 15 + 1)}.png`);
};
