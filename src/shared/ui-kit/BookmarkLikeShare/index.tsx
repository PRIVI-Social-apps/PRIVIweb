import {
  ClickAwayListener,
  createStyles,
  Grow,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Theme,
  withStyles,
} from "@material-ui/core";
import Axios from "axios";
import AddToPlaylistModal from "components/legacy/Media/modals/AddToPlaylistModal";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import React, { useEffect, useState } from "react";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import "./index.css";
import cn from "classnames";

type BookmarkLikeShareProps = {
  selectedMedia: any | null;
  setSelectedMedia: (state: any | null) => void;
  bookmarkType?: string;
  triggerPlaylists?: boolean;
  hideBookmark?: boolean;
  hideLike?: boolean;
  hideShare?: boolean;
  style?: any;
};

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      zIndex: 10,
    },
    paper: {
      minWidth: 200,
      marginRight: -267,
      marginLeft: -65,
      borderRadius: 10,
      boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
      position: "inherit",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    vertical: {
      display: "block",
      width: "100%",
    },
    likes: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-evenly",
      background: "#181818",
      border: "2px solid #ffffff",
      borderRadius: "18px",
      height: "32px",
      padding: "0px 15px",
      position: "relative",
      "& button": {
        color: "white",
        marginRight: "5px",
        display: "flex",
        alignItems: "center",
        outline: "none",
        position: "inherit !important",
        background: "transparent",
        padding: "0",
        border: "none",
        borderRadius: "0",
      },

      "& button:last-child": {
        marginRight: "0",
      },

      "& img": {
        height: "16.5px",
      },
    },

    white: {
      border: "none",
      background: "transparent",
      borderRadius: "0",
      padding: "0",
    },
  })
);

export const BookmarkLikeShare: React.FunctionComponent<BookmarkLikeShareProps> = ({
  selectedMedia,
  setSelectedMedia,
  bookmarkType = "bookmark",
  hideBookmark = false,
  hideLike = false,
  hideShare = false,
  triggerPlaylists = false,
  style = null,
}) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const [openAddToPlaylistModal, setOpenAddToPlaylistModal] = useState<boolean>(false);
  const user = useTypedSelector(state => state.user);
  const classes = useStyles();
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);
  const { shareMediaToSocial, shareMediaToPrivi, shareMediaWithQrCode } = useShareMedia();

  const hideShareOnPrivi = selectedMedia?.eth ?? false;

  useEffect(() => {
    if (selectedMedia?.Likes && selectedMedia.Likes.includes(user.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [selectedMedia?.Likes, user.id]);

  useEffect(() => {
    if (selectedMedia?.Bookmarks && selectedMedia.Bookmarks.includes(user.id)) {
      setBookmarked(true);
    } else {
      setBookmarked(false);
    }
  }, [selectedMedia?.Bookmarks, user.id]);

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  const handleToggleShareMenu = e => {
    e.stopPropagation();
    e.preventDefault();
    if (isSignedIn()) setOpenShareMenu(prevShareMenuOpen => !prevShareMenuOpen);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenShareMenu(false);
  };

  const handleOpenPriviShareModal = () => {
    shareMediaToPrivi(selectedMedia);
  };

  function handleListKeyDownShareMenu(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const handleOpenShareModal = () => {
    shareMediaToSocial(selectedMedia?.id, "Media", selectedMedia.Type);
  };

  const handleOpenQRCodeModal = () => {
    shareMediaWithQrCode(selectedMedia?.id, `media/${selectedMedia?.id}`, selectedMedia?.Type);
  };

  const handleLike = e => {
    e.stopPropagation();
    e.preventDefault();
    if (isSignedIn()) {
      setLiked(!liked);

      const mediaCopy = { ...selectedMedia };
      //to update frontend
      if (liked) {
        mediaCopy.NumLikes--;
      } else {
        mediaCopy.NumLikes++;
      }

      console.log("=====================", mediaCopy);
      if (mediaCopy.Likes && mediaCopy.Likes.some(like => like === user.id)) {
        Axios.post(`${URL()}/media/removeLikeMedia/${mediaCopy.id}`, {
          userId: user.id,
          tag: mediaCopy.tag,
          mediaType: mediaCopy.Type,
        })
          .then(response => {
            if (response.data.success) {
              let data = response.data.data;
              mediaCopy.Likes = data.Likes;
              mediaCopy.NumLikes = data.NumLikes;
              setSelectedMedia(mediaCopy);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        Axios.post(`${URL()}/media/likeMedia/${mediaCopy.id}`, {
          userId: user.id,
          tag: mediaCopy.tag,
          mediaType: mediaCopy.Type,
        })
          .then(response => {
            if (response.data.success) {
              let data = response.data.data;
              mediaCopy.Likes = data.Likes;
              mediaCopy.NumLikes = data.NumLikes;
              setSelectedMedia(mediaCopy);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };

  const handleBookmark = e => {
    e.stopPropagation();
    e.preventDefault();
    if (isSignedIn()) {
      setBookmarked(!bookmarked);

      const mediaCopy = { ...selectedMedia };
      //to update frontend
      if (bookmarked) {
        mediaCopy.BookmarksNum--;
      } else {
        mediaCopy.BookmarksNum++;
      }

      if (mediaCopy.Bookmarks && mediaCopy.Bookmarks.some(like => like === user.id)) {
        Axios.post(`${URL()}/media/removeBookmarkMedia/${mediaCopy.id}`, {
          userId: user.id,
          mediaType: mediaCopy.Type,
        })
          .then(response => {
            if (response.data.success) {
              let data = response.data.data;
              mediaCopy.Bookmarks = data.Bookmarks;
              mediaCopy.BookmarksNum = data.BookmarksNum;
              setSelectedMedia(mediaCopy);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        Axios.post(`${URL()}/media/bookmarkMedia/${mediaCopy.id}`, {
          userId: user.id,
          mediaType: mediaCopy.Type,
        })
          .then(response => {
            if (response.data.success) {
              let data = response.data.data;
              mediaCopy.Bookmarks = data.Bookmarks;
              mediaCopy.BookmarksNum = data.BookmarksNum;
              setSelectedMedia(mediaCopy);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };

  const handleOpenAddToPlaylistModal = e => {
    e.preventDefault();
    e.stopPropagation();
    setOpenAddToPlaylistModal(true);
  };
  const handleCloseAddToPlaylistModal = () => {
    setOpenAddToPlaylistModal(false);
  };

  return (
    <div className={"bookmark-share-like"} style={style && style !== "white" ? style : {}}>
      <div className={style && style === "white" ? cn(classes.likes, classes.white) : classes.likes}>
        {!hideBookmark && (
          <button
            onClick={e => (bookmarkType === "bookmark" ? handleBookmark(e) : handleOpenAddToPlaylistModal(e))}
          >
            <img
              src={require(`assets/priviIcons/${
                style && style === "white"
                  ? bookmarked
                    ? "bookmark-filled-gray"
                    : "bookmark-gray"
                  : bookmarked
                  ? "bookmark-filled"
                  : "bookmark"
              }.svg`)}
              alt={"list"}
            />
          </button>
        )}
        {!hideShare && (
          <>
            <button onClick={handleToggleShareMenu} ref={anchorShareMenuRef}>
              <img
                src={require(`assets/priviIcons/${
                  style && style === "white"
                    ? openShareMenu
                      ? "share-filled-gray"
                      : "share-gray"
                    : openShareMenu
                    ? "share-filled"
                    : "share"
                }.svg`)}
                alt={"share"}
              />
            </button>
            <Popper
              open={openShareMenu}
              anchorEl={anchorShareMenuRef.current}
              transition
              disablePortal
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
                  <Paper className={classes.paper}>
                    <ClickAwayListener onClickAway={handleCloseShareMenu}>
                      <MenuList
                        autoFocusItem={openShareMenu}
                        id="menu-list-grow"
                        onKeyDown={handleListKeyDownShareMenu}
                      >
                        {!hideShareOnPrivi && (
                          <CustomMenuItem onClick={handleOpenPriviShareModal}>
                            <img
                              src={require("assets/icons/spaceship.png")}
                              alt={"spaceship"}
                              style={{ width: 20, height: 20, marginRight: 5 }}
                            />
                            <b style={{ marginRight: 5 }}>{"Share & Earn"}</b> to Privi
                          </CustomMenuItem>
                        )}
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
          </>
        )}
        {!hideLike && (
          <button onClick={handleLike}>
            <img
              src={require(`assets/priviIcons/${
                style && style === "white"
                  ? liked
                    ? "like-filled-gray"
                    : "like-gray"
                  : liked
                  ? "like-filled"
                  : "like"
              }.svg`)}
              alt={"heart"}
            />
          </button>
        )}
      </div>
      {isSignedIn() ? (
        <AddToPlaylistModal
          mediaId={selectedMedia?.MediaSymbol ?? selectedMedia?.id}
          mediaType={selectedMedia?.Type}
          open={openAddToPlaylistModal}
          handleClose={handleCloseAddToPlaylistModal}
          mediaImage={
            selectedMedia?.HasPhoto
              ? `media/getMediaMainPhoto/${selectedMedia?.MediaSymbol.replace(/\s/g, "")}`
              : selectedMedia?.mediaUrl ?? ""
          }
          chainType={selectedMedia?.eth === false ? "PRIVI" : selectedMedia?.tag}
          update={triggerPlaylists}
        />
      ) : null}
    </div>
  );
};
