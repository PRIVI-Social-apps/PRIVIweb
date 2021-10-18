import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTypedSelector } from "store/reducers/Reducer";
import PriviShareModal from "../../../modals/SharePlaylistToPriviModal";
import cls from "classnames";
import URL from "shared/functions/getURL";
import axios from "axios";

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
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import styles from "./index.module.scss";
import { useAuth } from "shared/contexts/AuthContext";
import { RANDOM_MOCK_PLAYLISTS_LENGTH } from "shared/constants/constants";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { parsePrice } from "shared/helpers/utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    paper: {
      width: 267,
      marginTop: 85,
      marginRight: -267,
      marginLeft: -230,
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
  },
})(MenuItem);

const PlaylistCard = (props: any) => {
  //store
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  //hooks
  const history = useHistory();
  const { convertTokenToUSD } = useTokenConversion();

  const [playlist, setPlaylist] = useState<any>({});
  const [liked, setLiked] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  const [thumbnails, setThumbnails] = useState<Array<string>>([]);

  const getRandomThumbnails = () => {
    const count = Math.max(1, Math.floor(Math.random() * 4));
    const thumbnails: Array<string> = [];

    for (let i = 0; i < count; i++) {
      thumbnails.push(Math.floor(Math.random() * RANDOM_MOCK_PLAYLISTS_LENGTH).toString());
    }
    return [...new Set(thumbnails)];
  };

  useEffect(() => {
    if (props.playlist && Object.keys(props.playlist).length > 0 && users.length > 0) {
      const p = { ...props.playlist };
      if (p.Creator && p.Creator !== "") {
        const creatorUser = users.find(u => u.id === p.Creator);
        if (creatorUser) {
          p.Artist = { ...creatorUser };
        }
      }

      setThumbnails(p.Thumbnails?.length > 0 ? p.Thumbnails : getRandomThumbnails());
      setPlaylist(p);
    }
  }, [props.playlist, users]);

  useEffect(() => {
    if (props.playlist && Object.keys(props.playlist).length > 0 && user?.id) {
      const p = { ...props.playlist };
      if (p.Likes) {
        setLiked(p.Likes.some(like => like === user.id));
      }
      if (!p.NumLikes) {
        p.NumLikes = 0;
      }

      if (p.Bookmarks) {
        setBookmarked(p.Bookmarks.some(bookmark => bookmark === user.id));
      }
    }
  }, [props.playlist, user?.id]);

  const goToPlaylist = () => {
    if (playlist.Slug) {
      history.push({
        pathname: `/media/playlist/${playlist.Slug}`,
        state: { slug: playlist.Slug },
      });
    }
  };

  return (
    <div className={styles.playlistCard} onClick={goToPlaylist}>
      <div className={styles.topTags}>{playlist.Private ? <div>Private</div> : null}</div>
      <Header thumbnails={thumbnails} />
      <Artists
        artist={playlist.Artist}
        playlist={playlist}
        setPlaylist={setPlaylist}
        liked={liked}
        bookmarked={bookmarked}
        setLiked={setLiked}
        setBookmarked={setBookmarked}
      />
      <div className={styles.title}>{playlist.Title}</div>
      <div className={styles.tags}>
        <div className={styles.tag}>
          <img alt="" src={require(`assets/mediaIcons/small/playlist.png`)}></img>
          Playlist
        </div>
        {playlist.tag ? (
          <div className={styles.tag}>
            <img
              src={require(`assets/tokenImages/${
                !playlist.eth ? "PRIVI" : playlist.tag === "WAX" ? "WAX" : "ETH"
              }.png`)}
              alt={!playlist.eth ? "PRIVI" : playlist.tag === "WAX" ? "WAX" : "ETH"}
            />
            {!playlist.eth ? "PRIVI" : playlist.tag === "WAX" ? "WAX" : `Ethereum : ${playlist.tag}`}
          </div>
        ) : null}
        <div className={styles.priceBox}>
          <div className={styles.price}>
            👓 Views
            <div>{playlist.TotalViews || 0}</div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.rewardsContainer}>
          {playlist.Badges && (
            <div className={styles.rewards}>
              <div className={styles.reward}>
                <div className={styles.rewardImageContainer}>
                  <div
                    className={styles.rewardImage}
                    style={{
                      backgroundImage:
                        playlist.Badges && playlist.Badges > 0
                          ? `url(${require(`assets/priviIcons/badges.png`)})`
                          : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
                <span>{playlist.Badges ?? 0}</span>
              </div>
            </div>
          )}
          {playlist.Rewards && (
            <div className={styles.rewards}>
              <div className={styles.reward}>
                <div className={styles.rewardImageContainer}>
                  <div
                    className={styles.rewardImage}
                    style={{
                      backgroundImage:
                        playlist.Rewards && playlist.Rewards > 0
                          ? `url(${require(`assets/priviIcons/rewards.png`)})`
                          : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
                <span>{playlist.Rewards ?? 0}</span>
              </div>
            </div>
          )}
        </div>
        <div className={styles.price}>
          {`${playlist.Token && playlist.Price !== 0 ? "ETH" : ""} ${
            playlist.Price && playlist.Price !== 0 ? parsePrice(playlist.Price.toString()) : ""
          }`}
          {convertTokenToUSD(playlist.Token, playlist.Price) && (
            <span>{`$(${convertTokenToUSD(playlist.Token, playlist.Price)})`}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const Header = ({ thumbnails }) => {
  return (
    <div className={styles.header}>
      <div className={styles.gradient} />
      <div className={styles.thumbnails}>
        {thumbnails ? (
          thumbnails.map((thumbnail, index) =>
            thumbnails.length === 1 ||
            (thumbnails.length > 1 && thumbnails.length <= 3 && index < 2) ||
            (thumbnails.length > 3 && index < 4) ? (
              <div
                key={index}
                className={cls(
                  { [styles.only]: thumbnails.length === 1 },
                  {
                    [styles.two]: thumbnails.length > 1 && thumbnails.length <= 3 && index < 2,
                  },
                  {
                    [styles.four]: thumbnails.length > 3 && index < 4,
                  }
                )}
                style={{
                  backgroundImage:
                    thumbnail && thumbnail !== ""
                      ? thumbnail.includes("media/getMediaMainPhoto")
                        ? `url(${URL()}/${thumbnail})`
                        : `url(${require(`assets/mediaIcons/mockup/playlist_mock_up_${
                            parseInt(thumbnail, 10) + 1
                          }.png`)})` //`url(${thumbnail})`
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
        }}
      />
    </div>
  );
};

const Artists = ({ artist, playlist, setPlaylist, bookmarked, liked, setLiked, setBookmarked }) => {
  const { isSignedin } = useAuth();

  return (
    <div className={styles.artistsRow}>
      <div
        className={styles.artists}
        style={{
          justifyContent: "flex-start",
          flexDirection: "row",
        }}
      >
        <div
          className={styles.userImage}
          style={{
            backgroundImage:
              artist && artist.imageURL && artist.imageURL !== "" ? `url(${artist.imageURL})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {isSignedin && (
        <Likes
          playlist={playlist}
          setPlaylist={setPlaylist}
          bookmarked={bookmarked}
          liked={liked}
          setLiked={setLiked}
          setBookmarked={setBookmarked}
        />
      )}
    </div>
  );
};

const Likes = ({ playlist, setPlaylist, liked, bookmarked, setLiked, setBookmarked }) => {
  const { isSignedin } = useAuth();
  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();

  const classes = useStyles();
  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);

  const handleOpenShareModal = e => {
    e.preventDefault();
    e.stopPropagation();
    shareMediaToSocial(playlist.id, "Media");
  };

  const [openPriviShareModal, setOpenPriviShareModal] = useState<boolean>(false);
  const handleOpenPriviShareModal = e => {
    e.preventDefault();
    e.stopPropagation();
    setOpenPriviShareModal(true);
  };

  const handleClosePriviShareModal = () => {
    setOpenPriviShareModal(false);
  };

  const handleLike = e => {
    e.stopPropagation();
    e.preventDefault();
    if (isSignedin) {
      const playlistCopy = { ...playlist };
      //to update frontend
      if (liked) {
        playlistCopy.NumLikes--;
      } else {
        playlistCopy.NumLikes++;
      }

      if (liked) {
        axios
          .post(`${URL()}/media/removeLikePlaylist/${playlistCopy.id}`, {})
          .then(response => {
            if (response.data.success) {
              let data = response.data.data;
              playlistCopy.Likes = data.Likes;
              playlistCopy.NumLikes = data.NumLikes;
              setPlaylist(playlistCopy);
              setLiked(false);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        axios
          .post(`${URL()}/media/likePlaylist/${playlistCopy.id}`, {})
          .then(response => {
            if (response.data.success) {
              let data = response.data.data;
              playlistCopy.Likes = data.Likes;
              playlistCopy.NumLikes = data.NumLikes;
              setPlaylist(playlistCopy);
              setLiked(true);
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

    if (isSignedin) {
      const playlistCopy = { ...playlist };
      //to update frontend
      if (bookmarked) {
        playlistCopy.BookmarksNum--;
      } else {
        playlistCopy.BookmarksNum++;
      }

      if (bookmarked) {
        axios
          .post(`${URL()}/media/removeBookmarkPlaylist/${playlistCopy.id}`, {})
          .then(response => {
            if (response.data.success) {
              let data = response.data.data;
              playlistCopy.Bookmarks = data.Bookmarks;
              playlistCopy.BookmarksNum = data.BookmarksNum;
              setPlaylist(playlistCopy);
              setBookmarked(false);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        axios
          .post(`${URL()}/media/bookmarkPlaylist/${playlistCopy.id}`, {})
          .then(response => {
            if (response.data.success) {
              let data = response.data.data;
              playlistCopy.Bookmarks = data.Bookmarks;
              playlistCopy.BookmarksNum = data.BookmarksNum;
              setPlaylist(playlistCopy);
              setBookmarked(true);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };

  const handleToggleShareMenu = e => {
    e.stopPropagation();
    e.preventDefault();
    if (isSignedin) setOpenShareMenu(prevShareMenuOpen => !prevShareMenuOpen);
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

  const handleOpenQRCodeModal = () => {
    shareMediaWithQrCode(playlist?.Slug, `media/playlist/${playlist.Slug}`);
  };

  return (
    <div className={styles.likes}>
      <button onClick={handleBookmark}>
        <img
          src={require(bookmarked
            ? "assets/priviIcons/bookmark-filled.svg"
            : "assets/priviIcons/bookmark.svg")}
          alt={"list"}
        />
      </button>
      <button onClick={handleToggleShareMenu} ref={anchorShareMenuRef}>
        <img
          src={require(`assets/priviIcons/${openShareMenu ? "share-filled" : "share"}.svg`)}
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
                  <CustomMenuItem onClick={handleOpenPriviShareModal}>
                    <img
                      src={require("assets/icons/spaceship.png")}
                      alt={"spaceship"}
                      style={{ width: 20, height: 20, marginRight: 5 }}
                    />
                    <b style={{ marginRight: 5 }}>{"Share & Earn"}</b> to Privi
                  </CustomMenuItem>
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
      <button onClick={handleLike}>
        <img
          src={require(liked ? "assets/priviIcons/like-filled.svg" : "assets/priviIcons/like.svg")}
          alt={"heart"}
        />
      </button>

      {isSignedin ? (
        <PriviShareModal
          id={playlist.id}
          open={openPriviShareModal}
          handleClose={handleClosePriviShareModal}
        />
      ) : null}
    </div>
  );
};

export default PlaylistCard;
