import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import URL from "shared/functions/getURL";
import { useSelector } from "react-redux";
import equal from "deep-equal";
import { getUser } from "store/selectors";

import styles from "./ProfilePlaylistCard.module.css";

import { useHistory } from "react-router-dom";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import {
  MenuItem,
  withStyles,
  Paper,
  ClickAwayListener,
  makeStyles,
  Theme,
  createStyles,
  Popper,
  Grow,
  MenuList,
  Dialog,
  DialogContent,
  DialogActions,
  Box,
} from "@material-ui/core";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { RANDOM_MOCK_PLAYLISTS_LENGTH } from "shared/constants/constants";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ArrowForwardIcon } from "assets/icons/long-arrow-alt-right-solid.svg"

const arePropsEqual = (prevProps, currProps) => {
  return equal(prevProps.playlist, currProps.playlist);
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      minWidth: 148,
      marginLeft: -140,
      marginTop: 30,
      borderRadius: 10,
      boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
      position: "inherit",
    },
  })
);

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
    color: "#F43E5F",
    display: "flex",
    justifyContent: "space-between",
  },
})(MenuItem);

const ProfilePlaylistCard = React.memo((props: any) => {
  const user = useSelector(getUser);

  const history = useHistory();
  const { convertTokenToUSD } = useTokenConversion();

  const [playlist, setPlaylist] = useState<any>({});
  const [liked, setLiked] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);
  const [thumbnailsHeight, setThumbnailsHeight] = useState<number>(0);

  const [openMenu, setOpenMenu] = React.useState(false);
  const anchorMenuRef = React.useRef<HTMLDivElement>(null);

  const classes = useStyles();

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  useEffect(() => {
    if (playlist?.Likes && playlist.Likes.includes(user.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }

    if (ref.current) {
      setThumbnailsHeight(ref.current.offsetWidth);
    }
  }, [playlist?.Likes, user.id]);

  const getRandomThumbnails = () => {
    const count = Math.max(1, Math.floor(Math.random() * 4));
    const thumbnails: Array<string> = [];

    for (let i = 0; i < count; i++) {
      thumbnails.push(Math.floor(Math.random() * RANDOM_MOCK_PLAYLISTS_LENGTH).toString());
    }

    return [...new Set(thumbnails)];
  };

  useEffect(() => {
    if (playlist?.Thumbnails && playlist.Thumbnails.length > 0 && ref.current) {
      setThumbnailsHeight(ref.current.offsetWidth);
    }
  }, [playlist?.Thumbnails]);

  useEffect(() => {
    if (props.playlist) {
      let i = {
        ...props.playlist,
        chain: "PRIVI",
        owned: false,
        dailyChanges: props.playlist.dailyChanges ?? 0,
        NumViews: props.playlist.NumViews ?? 0,
        NumShares: props.playlist.NumShares ?? 0,
        TotalSupply: props.playlist.TotalSupply ?? 0,
        Thumbnails: props.playlist.Thumbnails?.length > 0 ? props.playlist.Thumbnails : getRandomThumbnails(),
      };

      setPlaylist(i);
    }

    if (ref.current) {
      setThumbnailsHeight(ref.current.offsetWidth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.playlist]);

  //resize thumbnails
  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setThumbnailsHeight(ref.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  const goToPlaylist = () => {
    if (playlist.Slug) {
      history.push({
        pathname: `/media/playlist/${playlist.Slug}`,
        state: { slug: playlist.Slug },
      });
    }
  };

  const handleLikeCard = () => {
    if (isSignedIn()) {
      setLiked(!liked);

      const playlistCopy = { ...playlist };

      if (playlistCopy.Likes && playlistCopy.Likes.some(like => like === user.id)) {
        axios
          .post(`${URL()}/media/removeLikePlaylist/${playlistCopy.id}`, {
            userId: user.id,
          })
          .then(response => {
            if (response.data.success) {
              let data = response.data.data;
              playlistCopy.Likes = data.Likes;
              playlistCopy.NumLikes = data.NumLikes;
              setPlaylist(playlistCopy);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        axios
          .post(`${URL()}/media/likePlaylist/${playlistCopy.id}`, {
            userId: user.id,
          })
          .then(response => {
            if (response.data.success) {
              let data = response.data.data;
              playlistCopy.Likes = data.Likes;
              playlistCopy.NumLikes = data.NumLikes;
              setPlaylist(playlistCopy);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };

  const handleSave = () => { };

  const handleShare = () => { };

  const handleDeletePlaylist = () => {
    const body = {
      userId: user.id,
      playlistId: playlist.id,
    };

    axios
      .post(`${URL()}/media/deletePlaylist`, body)
      .then(response => {
        if (response.data.success && props.refreshAllProfile) {
          setTimeout(() => {
            handleCloseDialog();
            props.refreshAllProfile(user.id);
          }, 1000);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleToggleMenu = e => {
    e.stopPropagation();
    e.preventDefault();
    if (isSignedIn()) setOpenMenu(prevMenuOpen => !prevMenuOpen);
  };

  const handleCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorMenuRef.current && anchorMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenMenu(false);
  };

  function handleListKeyDownMenu(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpenMenu(false);
    }
  }

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (playlist && Object.keys(playlist).length !== 0)
    return (
      <div className={styles.playlistCard}>
        <div className={styles.playlistImage} ref={ref}>
          <div
            onClick={goToPlaylist}
            className={styles.thumbnails}
            style={{ height: thumbnailsHeight > 0 ? thumbnailsHeight - 30 : 200 }}
          >
            {playlist.Thumbnails ? (
              playlist.Thumbnails.map((thumbnail, index) =>
                playlist.Thumbnails.length === 1 ||
                  (playlist.Thumbnails.length > 1 && playlist.Thumbnails.length <= 3 && index < 2) ||
                  (playlist.Thumbnails.length > 3 && index < 4) ? (
                  <div
                    key={index}
                    className={
                      playlist.Thumbnails.length === 1
                        ? styles.only
                        : playlist.Thumbnails.length > 1 && playlist.Thumbnails.length <= 3 && index < 2
                          ? styles.two
                          : playlist.Thumbnails.length > 3 && index < 4
                            ? styles.four
                            : undefined
                    }
                    style={{
                      backgroundImage:
                        thumbnail && thumbnail !== ""
                          ? thumbnail.includes("media/getMediaMainPhoto")
                            ? `url(${URL()}/${thumbnail})`
                            : `url(${require(`assets/mediaIcons/mockup/playlist_mock_up_${parseInt(thumbnail, 10) + 1
                              }.png`)})`
                          : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ) : null
              )
            ) : (
              <div className={styles.only} />
            )}
          </div>
          <div
            className={styles.playButton}
            style={{
              backgroundImage: `url(${require("assets/icons/playlist_play.png")})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              marginTop: thumbnailsHeight > 0 ? -(thumbnailsHeight - 30) / 2 - 40 : -100 - 40,
              marginLeft: thumbnailsHeight > 0 ? thumbnailsHeight / 2 - 40 : 100 - 40,
            }}
          />
        </div>
        {user.id === playlist.Creator && (
          <div
            className={styles.menu}
            style={{
              marginLeft: thumbnailsHeight > 0 ? thumbnailsHeight - 6 - 20 - 15 : 200 - 6 - 20,
            }}
            onClick={handleToggleMenu}
            ref={anchorMenuRef}
          >
            <img src={require("assets/icons/three_dots_white.png")} alt="options" />
          </div>
        )}
        {user.id === playlist.Creator && (
          <Popper
            open={openMenu}
            anchorEl={anchorMenuRef.current}
            transition
            disablePortal
            style={{ position: "inherit", zIndex: 3 }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                  position: "inherit",
                }}
              >
                <Paper className={classes.paper}>
                  <ClickAwayListener onClickAway={handleCloseMenu}>
                    <MenuList autoFocusItem={openMenu} id="menu-list-grow" onKeyDown={handleListKeyDownMenu}>
                      <CustomMenuItem onClick={handleClickOpenDialog}>
                        Delete
                        <img
                          src={require("assets/icons/warning.png")}
                          alt={"warning"}
                          style={{ width: 18, height: 18 }}
                        />
                      </CustomMenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        )}
        <div className={styles.artistsRow}>
          <div
            className={styles.artists}
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            {playlist.ArtistsInfo && playlist.ArtistsInfo.length > 0
              ? playlist.ArtistsInfo.map((artist, index) =>
                index < 3 ? (
                  <div
                    className={styles.userImage}
                    style={{
                      backgroundImage:
                        artist.imageURL && artist.imageURL !== "" ? `url(${artist.imageURL})` : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() => {
                      if (artist.id && artist.id !== "") {
                        history.push(`/profile/${artist.id}`);
                      }
                    }}
                  />
                ) : null
              )
              : null}
            {playlist.Artists && playlist.Artists.length > 3 ? (
              <div className={styles.userCounter}>+{playlist.Artists.length - 2}</div>
            ) : null}
          </div>
          {isSignedIn() && (
            <div className={styles.actions}>
              <span onClick={handleSave}>
                <img src={require("assets/priviIcons/list.png")} alt={"list"} />
              </span>
              <span onClick={handleShare}>
                <img src={require("assets/priviIcons/share.png")} alt={"share"} />
              </span>
              <span onClick={handleLikeCard}>
                <img
                  src={require(liked ? "assets/priviIcons/heart_filled.png" : "assets/priviIcons/heart.png")}
                  alt={"heart"}
                />
              </span>
            </div>
          )}
        </div>
        <div className={styles.body}>
          <div className={styles.playlistTitle}>
            <span>{playlist.Title ?? "Playlist Title"}</span>
          </div>
          <div className={styles.cardStats}>
            <div>
              <div className={styles.title}>💜 Likes</div>
              <div className={styles.content}>{playlist.Likes ? playlist.Likes.length : 0}</div>
            </div>
            <div>
              <div className={styles.title}>🚀 Shares</div>
              <div className={styles.content}>{playlist.Shares ? playlist.Shares.length : 0}</div>
            </div>
            <div>
              <div className={styles.title}>👓 Views</div>
              <div className={styles.content}>{playlist.TotalViews || 0}</div>
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.main}>
              <span>24h change</span>
              <span className={styles.change}>
                {playlist.dailyChanges > 0 ? (
                  <div style={{ transform: 'rotate(-45deg)' }}><ArrowForwardIcon /></div>
                ) : playlist.dailyChanges < 0 ? (
                  <div style={{ transform: 'rotate(45deg)' }}><ArrowForwardIcon /></div>
                ) : (
                  ""
                )}
                {playlist.dailyChanges > 0 ? ` +` : ` `}
                {playlist.dailyChanges
                  ? playlist.dailyChanges.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                  : 0}
                {"%"}
              </span>
            </div>
            <div className={styles.price}>
              <span>Price</span>
              <span className={styles.value}>
                {playlist.Token ?? ""} {playlist.Price ?? "N/A"}
              </span>
              {convertTokenToUSD(playlist.Token, playlist.Price) && (
                <span>{`$(${convertTokenToUSD(playlist.Token, playlist.Price)})`}</span>
              )}
            </div>
          </div>
        </div>
        {isSignedIn() && playlist.Creator === user.id && (
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <Box>Are you sure you want to delete this playlist?</Box>
            </DialogContent>
            <DialogActions>
              <PrimaryButton size="medium" onClick={handleDeletePlaylist} style={{ marginBottom: 0 }}>
                Yes
              </PrimaryButton>
              <SecondaryButton size="medium" onClick={handleCloseDialog} autoFocus>
                No
              </SecondaryButton>
            </DialogActions>
          </Dialog>
        )}
      </div>
    );
  else return null;
}, arePropsEqual);

export default ProfilePlaylistCard;
