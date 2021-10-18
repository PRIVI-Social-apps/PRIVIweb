import React, { useEffect, useState, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import axios from "axios";
import {
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  Popper,
  makeStyles,
  MenuItem,
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  createStyles,
  Theme,
  TableContainer,
  Modal,
  Slider,
} from "@material-ui/core";

import Box from 'shared/ui-kit/Box';
import { useTypedSelector } from "store/reducers/Reducer";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import AddToPlaylistModal from "components/legacy/Media/modals/AddToPlaylistModal";

import URL from "shared/functions/getURL";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { sumTotalViews } from "shared/functions/totalViews";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    maxHeight: "calc(100vh - 82px)",
    height: "calc(100vh - 82px)",
    overflowY: "auto",
  },
  header: {
    minHeight: 296,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    background: "linear-gradient(90deg, rgba(0, 0, 70, 1) 0%, rgba(28, 181, 224, 1) 100%)",
    padding: "60px 120px 44px 120px",
    color: "#FFFFFF",

    "& div": {
      color: "#FFFFFF",
    },
    "& span": {
      color: "#FFFFFF",
    },
  },
  audioHeader: {
    background: "linear-gradient(97.4deg, #FF8CD8 14.43%, #DB00FF 79.45%)",
  },
  videoHeader: {
    background: "linear-gradient(97.4deg, #23D0C6 14.43%, #00CC8F 85.96%)",
  },
  thumbnails: {
    width: 191,
    height: 191,
    minWidth: 191,
    borderRadius: 10,
    backgroundColor: "#F2F2F2",
    marginRight: 32,
    display: "flex",
    flexWrap: "wrap",
    "& div": {
      background: "#707582",
    },
  },
  only: {
    borderRadius: 10,
    height: "100%",
    width: "100%",
  },
  two: {
    width: "50%",
    height: "100%",

    "&:first-child": {
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
    },
    "&:last-child": {
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
    },
  },
  four: {
    width: "50%",
    height: "50%",

    "&:first-child": {
      borderTopLeftRadius: 10,
    },
    "&:nth-child(2)": {
      borderTopRightRadius: 10,
    },
    "&:nth-child(3)": {
      borderBottomLeftRadius: 10,
    },
    "&:last-child": {
      borderBottomRightRadius: 10,
    },
  },
  back: {
    color: "#707582",
    "& span": {
      fontSize: 10,
    },
    marginBottom: 4,
    cursor: "pointer",
  },
  avatarImg: {
    width: 21,
    height: 21,
    borderRadius: 15,
    marginRight: 6,
    WebkitBackgroundClip: "initial !important",
  },
  actionButton: {
    marginBottom: "0 !important",
  },
  paper: {
    minWidth: 200,
    marginLeft: -65,
    marginTop: -105,
    borderRadius: 10,
    boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
  },
  bookmarkShareBtn: {
    backgroundColor: "white",
    padding: 0,
    height: 0,
  },
  content: {
    flexGrow: 1,
    overflowY: "auto",
    height: "calc(100vh - 82px - 296px)",
  },
  tableContainer: {
    maxHeight: "calc(100vh - 82px - 296px - 115px)",
    margin: "0px 120px",
    width: "calc(100% - 120px * 2)",
  },
  table: {
    borderSpacing: "0px 8px",
    borderCollapse: "inherit",
  },
  selectedRow: {
    borderColor: "#23D0C6 !important",
    "& .MuiTableCell-body": {
      borderColor: "#23D0C6 !important",
    },
    "& div": {
      background: "linear-gradient(97.4deg, #29e8dc 14.43%, #03eaa5 79.45%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    "& span": {
      background: "linear-gradient(97.4deg, #29e8dc 14.43%, #03eaa5 79.45%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
  },
  mediaImage: {
    borderRadius: 10,
    width: 95,
    height: 95,
    minWidth: 95,
    backgroundColor: "#707582",
    WebkitBackgroundClip: "initial !important",
  },
  priceRow: {
    paddingLeft: 12,
    borderLeft: "1px solid #ABB3C4",
  },
  player: {
    background: "linear-gradient(360deg, #F4F6FA 36.25%, rgba(247, 249, 252, 0) 100%)",
    padding: "30px 120px",
  },
  mediaPreview: {
    minHeight: 38,
    maxWidth: 170,
    marginRight: 40,
  },
  selectMedia: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 18,
    background: "linear-gradient(97.4deg, #29e8dc 14.43%, #03eaa5 79.45%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  mediaImageSmall: {
    borderRadius: 10,
    width: 32,
    height: 30,
    minWidth: 32,
    marginRight: 10,
    backgroundColor: "#707582",
  },
  controls: {
    width: "100%",
    "& button": {
      backgroundColor: "transparent",
      padding: 0,
      height: "auto",
      borderRadius: 0,
      margin: "0px 10px",

      "&:nth-child(3)": {
        "& img": {
          height: 32,
        },
      },

      "&:nth-child(4)": {
        "& img": {
          transform: "rotate(180deg)",
        },
      },
    },
  },
  tracking: {
    width: "100%",
    "& div": {
      margin: "0px 5px",
    },
  },
  track: {
    width: "100%",
    flexGrow: 1,
  },
}));

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
    color: "black",
  },
})(MenuItem);

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      fontFamily: "Agrandir",
      fontSize: "14px",
      color: "#707582",
      border: "none",
      padding: 12,
      "&:first-child": {
        borderBottomLeftRadius: 10,
      },
      "&:last-child": {
        borderBottomRightRadius: 10,
      },
    },
    body: {
      background: "#EFF2F8",
      fontSize: "14px",
      fontFamily: "Agrandir",
      color: "#707582",
      padding: 12,
      borderTop: "1px solid transparent",
      borderBottom: "1px solid transparent",
      borderLeft: "none",
      borderRight: "none",
      "&:first-child": {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderTop: "1px solid transparent",
        borderBottom: "1px solid transparent",
        borderRight: "none",
        borderLeft: "1px solid transparent",
      },
      "&:last-child": {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderTop: "1px solid transparent",
        borderBottom: "1px solid transparent",
        borderRight: "1px solid transparent",
        borderLeft: "none",
      },
    },
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    head: {
      background: "linear-gradient(180deg, #FFFFFF 0%, #EFF2F8 100%)",
    },
    root: {
      border: "1px solid transparent",
    },
  })
)(TableRow);

const isSignedIn = () => {
  return !!sessionStorage.getItem("token");
};

const PlaylistPage = () => {
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const location: any = useLocation();

  const classes = useStyles();

  const [playlist, setPlaylist] = useState<any>({});
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const [totalTime, setTotalTime] = useState<string>("0 hs 0 min 0 seg");

  const [media, setMedia] = useState<any>({});

  const [liked, setLiked] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openError, setOpenError] = useState(false);

  // initialise
  useEffect(() => {
    const idUrl = location.pathname.split("/")[3];
    if (idUrl && users && users.length > 0) {
      loadData();
    }
  }, [location, users]);

  useEffect(() => {
    if (playlist?.Likes && playlist.Likes.includes(user.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [playlist?.Likes, user.id]);

  useEffect(() => {
    //load duration after loading medias
    if (playlist.medias && playlist.medias.length > 0) {
      const playlistData = { ...playlist };
      let totalSeconds = 0;

      const getDurations = async () => {
        for (const media of playlist.medias) {
          const index = playlist.medias.findIndex(m => m === media);

          if (media.Type === MediaType.Audio) {
            let mediaUrl = `${media.Url}?${Date.now}`;

            let duration = await loadAudioData(mediaUrl);
            playlistData.medias[index].Duration = duration;
            totalSeconds = duration + totalSeconds;
          } else if (media.Type === MediaType.Video) {
            let mediaUrl = `${media.Url}?${Date.now}`;

            let duration = await loadVideoData(mediaUrl);
            playlistData.medias[index].Duration = duration;
            totalSeconds = duration + totalSeconds;
          }
        }

        if (totalSeconds > 0) {
          let hrs = Math.floor(totalSeconds / 3600);
          let min = Math.floor((totalSeconds % 3600) / 60);
          let seg = Math.floor(totalSeconds % 60);

          let totalDurationMinutes = `${hrs ?? 0} hs ${min ?? 0} min ${seg ? seg.toFixed(0) : 0} seg`;

          setTotalTime(totalDurationMinutes);
        }
      };

      getDurations();

      setPlaylist(playlistData);
    }
  }, [playlist?.medias]);

  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 4000);
  };

  const loadAudioData = mediaUrl => {
    return new Promise<number>(res => {
      let audio = document.createElement("audio");
      audio.preload = "metadata";

      audio.onloadedmetadata = function () {
        res(audio.duration);
      };

      audio.src = mediaUrl;
    });
  };

  const loadVideoData = mediaUrl => {
    return new Promise<number>(res => {
      let video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = function () {
        res(video.duration);
      };

      video.src = mediaUrl;
    });
  };

  const loadData = async () => {
    const slug = location.state ? location.state.slug : location.pathname.split("/")[3];

    axios
      .get(`${URL()}/media/getPlaylist/${slug}`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          let playlistData = resp.data ?? {};

          let mediasUrls = [] as any;

          if (playlistData && Object.keys(playlistData).length > 0) {
            playlistData.medias.forEach((media, index) => {
              if (media.Type === MediaType.Audio) {
                let mediaUrl = `${media.Url}?${Date.now()}`;
                playlistData.medias[index].MediaUrl = mediaUrl;
                mediasUrls.push(mediaUrl);
              } else if (media.Type === MediaType.Video) {
                let mediaUrl = `${media.Url}?${Date.now()}`;
                playlistData.medias[index].MediaUrl = mediaUrl;
                mediasUrls.push(mediaUrl);
              }

              playlistData.medias[index].ImageUrl = media.HasPhoto
                ? `${URL()}/media/getMediaMainPhoto/${media.MediaSymbol.replace(/\s/g, "")}`
                : undefined;

              const artistUser = users.find(
                user =>
                  (media.Creator && media.Creator !== "" && user.id === media.Creator) ||
                  (media.CreatorId && media.CreatorId !== "" && user.id === media.CreatorId) ||
                  (media.Requester && media.Requester !== "" && user.id === media.Requester)
              );

              if (artistUser) {
                playlistData.medias[index].Artist = {
                  name: artistUser.name ?? "",
                  imageURL: artistUser.imageURL ?? "",
                  urlSlug: artistUser.urlSlug ?? "",
                  id: artistUser.id ?? "",
                };
              } else if (media.creator) {
                playlistData.medias[index].randomAvatar = getRandomAvatarForUserIdWithMemoization(
                  media.creator
                );
              } else {
                playlistData.medias[index].Artist = undefined;
              }
            });
          }

          if (playlistData.NumAudios > 0 && playlistData.NumVideos === 0) {
            playlistData.mediaType = MediaType.Audio;
          } else if (playlistData.NumAudios === 0 && playlistData.NumVideos > 0) {
            playlistData.mediaType = MediaType.Video;
          }

          playlistData.type = "playList";
          sumTotalViews(playlistData);
          setMediaUrls(mediasUrls);
          setPlaylist(playlistData);
        } else {
          setErrorMsg("Error getting Playlist");
          handleClickError();
        }
      })
      .catch(e => {
        console.log(e);
        setErrorMsg("Error loading Playlist");
        handleClickError();
      });
  };

  return (
    <div className={classes.root}>
      <Header
        playlist={playlist}
        setPlaylist={setPlaylist}
        liked={liked}
        setLiked={setLiked}
        totalTime={totalTime}
      />
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        justifyContent="space-between"
        className={classes.content}
      >
        <PlaylistContent playlist={playlist.medias} setMedia={setMedia} media={media} />
        <Player media={media} setMedia={setMedia} playlist={playlist.medias} mediaUrls={mediaUrls} />
      </Box>
      {openError && <AlertMessage key={Math.random()} message={errorMsg} variant={"error"} />}
    </div>
  );
};

export default PlaylistPage;

const Header = ({ playlist, setPlaylist, liked, setLiked, totalTime }) => {
  const user = useTypedSelector(state => state.user);

  const classes = useStyles();
  const history = useHistory();

  const { shareMediaToSocial, shareMediaToPrivi } = useShareMedia();
  const { convertTokenToUSD } = useTokenConversion();

  const [openShareMenu, setOpenShareMenu] = useState(false);
  const anchorShareMenuRef = useRef<HTMLButtonElement>(null);

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenShareMenu(false);
  };

  const handleListKeyDownShareMenu = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpenShareMenu(false);
    }
  };

  const handleToggleShareMenu = e => {
    e.stopPropagation();
    e.preventDefault();
    if (isSignedIn()) setOpenShareMenu(prevShareMenuOpen => !prevShareMenuOpen);
  };

  const handleLike = () => {
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

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems={"flex-end"}
      className={`${classes.header} ${
        playlist.mediaType === MediaType.Audio
          ? classes.audioHeader
          : playlist.mediaType === MediaType.Video
          ? classes.videoHeader
          : ""
      }`}
    >
      <div className={classes.thumbnails}>
        {playlist.Thumbnails ? (
          playlist.Thumbnails.map((thumbnail, index) =>
            playlist.Thumbnails.length === 1 ||
            (playlist.Thumbnails.length > 1 && playlist.Thumbnails.length <= 3 && index < 2) ||
            (playlist.Thumbnails.length > 3 && index < 4) ? (
              <div
                key={index}
                className={
                  playlist.Thumbnails.length === 1
                    ? classes.only
                    : playlist.Thumbnails.length > 1 && playlist.Thumbnails.length <= 3 && index < 2
                    ? classes.two
                    : playlist.Thumbnails.length > 3 && index < 4
                    ? classes.four
                    : undefined
                }
                style={{
                  backgroundImage:
                    thumbnail && thumbnail !== ""
                      ? thumbnail.includes("media/getMediaMainPhoto")
                        ? `url(${URL()}/${thumbnail})`
                        : `url(${require(`assets/mediaIcons/mockup/playlist_mock_up_${
                            parseInt(thumbnail, 10) + 1
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
          <div className={classes.only} />
        )}
      </div>
      <Box width={"100%"} flexGrow={1} display="flex" flexDirection="column" justifyContent="flex-end">
        <Box display="flex" flexDirection="row" className={classes.back} onClick={() => history.goBack()}>
          <span>{`< Back`}</span>
        </Box>
        <Box fontWeight={"bold"} fontSize={14}>
          PLAYLIST
        </Box>
        <Box fontWeight={"bold"} fontSize={50} margin={"6px 0px 8px"}>
          {playlist.Title ?? "Playlist Title"}
        </Box>
        <Box fontSize={14} marginBottom={"14px"}>
          {playlist.Description ?? "Playlist Description"}
        </Box>
        <Box display="flex" flexDirection="row" fontSize={11} marginBottom={"12px"}>
          <Box fontWeight={"bold"} marginRight={"10px"}>
            {playlist.Collection ?? "Playlist Collection"}
          </Box>

          <Box fontWeight={400} marginRight={14}>
            {`${playlist.NumLikes ?? 0} Likes - ${playlist.NumAudios ?? 0} Audios - ${
              playlist.NumVideos ?? 0
            } Videos / ${totalTime && `${totalTime}`}`}
          </Box>
        </Box>
        {isSignedIn() && (
          <Box display="flex" flexDirection="row">
            <Box style={{ marginRight: 12, cursor: "pointer" }} onClick={handleLike}>
              <img
                src={require(liked ? "assets/priviIcons/heart_filled.png" : "assets/priviIcons/heart.png")}
                alt={"heart"}
              />
            </Box>
            <button
              onClick={handleToggleShareMenu}
              ref={anchorShareMenuRef}
              className={classes.bookmarkShareBtn}
            >
              <img
                src={require(openShareMenu
                  ? "assets/priviIcons/share_filled.png"
                  : "assets/priviIcons/share.png")}
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
                        <CustomMenuItem onClick={() => shareMediaToPrivi(playlist)}>
                          <img
                            src={require("assets/icons/spaceship.png")}
                            alt={"spaceship"}
                            style={{ width: 20, height: 20, marginRight: 5 }}
                          />
                          <b style={{ marginRight: 5 }}>{"Share & Earn"}</b> to Privi
                        </CustomMenuItem>

                        <CustomMenuItem onClick={() => shareMediaToSocial(playlist.id, "Media")}>
                          <img
                            src={require("assets/icons/butterfly.png")}
                            alt={"spaceship"}
                            style={{ width: 20, height: 20, marginRight: 5 }}
                          />
                          Share on social media
                        </CustomMenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>
        )}
      </Box>
      <Box
        flexGrow={1}
        maxWidth={270}
        width={270}
        alignItems={"flex-end"}
        justifyContent={"flex-end"}
        display="flex"
        flexDirection="column"
      >
        <Box fontWeight={"bold"} fontSize={14}>
          <img src={require("assets/mediaIcons/small/sale.png")} alt="price" /> Price
        </Box>
        <Box fontSize={30} margin={"8px 0px 11px"} display="flex" alignItems="flex-end">
          <Box marginRight="10px" marginBottom={"10px"} fontSize={14}>
            {convertTokenToUSD(playlist.Token, playlist.Price) && (
              <span>{`$(${convertTokenToUSD(playlist.Token, playlist.Price)})`}</span>
            )}
          </Box>
          {`${playlist.Token ?? "ETH"} ${playlist.Price ?? "N/A"}`}
        </Box>
        <Box fontWeight={"bold"} fontSize={14}>
          Raised
        </Box>
        <Box fontWeight={"bold"} fontSize={22} margin={"8px 0px 11px"}>
          {`${playlist.Token ?? "ETH"} ${playlist.Raised ?? "N/A"}`}
        </Box>
        {/*<PrimaryButton
          size="medium"
          style={{
            flexGrow: 1,
            maxWidth: 270,
          }}
          className={classes.actionButton}
        >
          Buy
        </PrimaryButton>*/}
      </Box>
    </Box>
  );
};

const PlaylistContent = ({ playlist, setMedia, media }) => {
  const classes = useStyles();

  const [openAddToPlaylistModal, setOpenAddToPlaylistModal] = useState<boolean>(false);

  const handleOpenAddToPlaylistModal = () => {
    setOpenAddToPlaylistModal(true);
  };
  const handleCloseAddToPlaylistModal = () => {
    setOpenAddToPlaylistModal(false);
  };

  return (
    <TableContainer className={classes.tableContainer}>
      <Table stickyHeader aria-label="customized table" className={classes.table}>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell># Name</StyledTableCell>
            <StyledTableCell>Kind</StyledTableCell>
            <StyledTableCell>Duration</StyledTableCell>
            <StyledTableCell>Creator</StyledTableCell>
            <StyledTableCell>Collection</StyledTableCell>
            <StyledTableCell>{`Actions & Price`}</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {playlist &&
            playlist.map((row, index) => (
              <StyledTableRow
                key={"media" + index}
                onClick={() => setMedia(row)}
                className={media && row.MediaSymbol === media.MediaSymbol ? classes.selectedRow : undefined}
              >
                <StyledTableCell>
                  <Box display="flex" flexDirection="row">
                    <div
                      className={classes.mediaImage}
                      style={{
                        backgroundImage:
                          row.ImageUrl && row.ImageUrl !== "" ? `url(${row.ImageUrl})` : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      fontSize={11}
                      marginLeft={"22px"}
                    >
                      <span>{index + 1}</span>

                      <Box fontWeight={"bold"} fontSize={14}>
                        {row.MediaName ?? "Media name"}
                      </Box>
                    </Box>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box>{row.Type && Object.keys(MediaType).find(key => MediaType[key] === row.Type)}</Box>
                </StyledTableCell>

                <StyledTableCell>
                  <Box>
                    {row.Duration
                      ? `${Math.floor((row.Duration % 3600) / 60)}:${
                          Math.floor(row.Duration % 60) < 10 ? "0" : ""
                        }${Math.floor(row.Duration % 60).toFixed(0)} min`
                      : "0:00 min"}
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box display="flex" flexDirection="row" alignItems={"center"} fontSize={14}>
                    <div
                      className={classes.avatarImg}
                      style={{
                        backgroundImage: row.Artist
                          ? row.Artist.imageURL !== ""
                            ? `url(${row.Artist.imageURL})`
                            : "none"
                          : row.randomAvatar
                          ? `url(${row.randomAvatar})`
                          : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    @
                    {row.Artist
                      ? row.Artist.urlSlug ?? row.Artist.name ?? "Username"
                      : row.creator !== "Not Available" && row.creator !== "Error" && row.creator !== ""
                      ? row.creator
                      : "Unclaimed profile"}
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box>{row.Collection ?? "Name of Collection"}</Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box display="flex" flexDirection="row" alignItems="center" className={classes.priceRow}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      fontWeight={"bold"}
                      fontSize={22}
                      marginRight={"24px"}
                    >
                      <Box fontWeight={400} fontSize={11} marginBottom={"10"}>
                        <img src={require("assets/mediaIcons/small/sale.png")} alt="price" /> Price
                      </Box>
                      {row.MediaSymbol
                        ? `${
                            row.Token ?? row.FundingToken ?? row.ViewConditions
                              ? row.ViewConditions.ViewingToken
                              : "ETH"
                          }
                     ${
                       row.Price ?? row.PricePerSecond ?? row.ViewConditions
                         ? row.ViewConditions.Price ?? row.ViewConditions.PricePerSecond
                         : "N/A"
                     }`
                        : row.price ?? "Media price"}
                    </Box>
                    {isSignedIn() && (
                      <Box
                        fontWeight={"bold"}
                        fontSize={14}
                        style={{ cursor: "pointer" }}
                        marginRight={"24px"}
                        onClick={handleOpenAddToPlaylistModal}
                      >
                        Add To Playlist
                      </Box>
                    )}
                    {/*<Box fontWeight={"bold"} fontSize={14} style={{ cursor: "pointer" }}>
                      Buy
                    </Box>*/}
                    {isSignedIn() && (
                      <AddToPlaylistModal
                        mediaId={row?.MediaSymbol ?? row?.id}
                        mediaType={row?.Type}
                        open={openAddToPlaylistModal}
                        handleClose={handleCloseAddToPlaylistModal}
                        mediaImage={
                          row?.HasPhoto
                            ? `media/getMediaMainPhoto/${row?.MediaSymbol.replace(/\s/g, "")}`
                            : row?.mediaUrl ?? ""
                        }
                        chainType={row?.eth === false ? "PRIVI" : row?.tag}
                      />
                    )}
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const PlayerSlider = withStyles({
  root: {
    color: "#727F9A",
    height: 4,
    borderRadius: 2,
    padding: 0,
  },
  thumb: {
    height: 4,
    width: 4,
    background: "linear-gradient(97.4deg, #29E8DC 14.43%, #03EAA5 79.45%)",
    border: "none",
    margin: 0,
  },
  track: {
    background: "linear-gradient(97.4deg, #29E8DC 14.43%, #03EAA5 79.45%)",
    height: 4,
    borderRadius: 3,
  },
  rail: {
    background: "#727F9A",
    height: 4,
    borderRadius: 3,
  },
})(Slider);

const Player = ({ media, setMedia, playlist, mediaUrls }) => {
  const classes = useStyles();

  let playerAudio: any = useRef();

  const [playerState, setPlayerState] = useState({
    url: null,
    pip: false,
    playing: false,
    controls: false,
    light: false,
    volume: 100,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    volumeOpen: false,
    dropdownOpen: false,
    fullscreen: false,
    seeking: false,
    playedSeconds: 0,
  });

  const [finishTrigger, setFinishTrigger] = useState<any>(new Date().getTime());
  const [shuffled, setShuffled] = useState<boolean>(false);
  const [repeated, setRepeated] = useState<boolean>(false);
  const [newMediaUrls, setNewMediaUrls] = useState<string[]>([]);

  const [openVideoFullScreen, setOpenVideoFullScreen] = useState<boolean>(false);

  useEffect(() => {
    if (mediaUrls) {
      setNewMediaUrls(mediaUrls);
    }
  }, [mediaUrls]);

  useEffect(() => {
    if (media && media.MediaUrl) {
      const thisMediaIndex = newMediaUrls.findIndex(m => m === media.MediaUrl);
      let nextUrlIndex = thisMediaIndex + 1;
      let nextMedia = playlist.find(m => m.MediaUrl === newMediaUrls[nextUrlIndex]);
      if (nextUrlIndex <= newMediaUrls.length - 1 || repeated) {
        if (repeated && nextUrlIndex > newMediaUrls.length - 1) {
          nextMedia = playlist.find(m => m.MediaUrl === newMediaUrls[0]);
        }
        setMedia(nextMedia);
        setPlayerState({ ...playerState, playing: true });
        if (nextMedia.Type === MediaType.Audio) {
          handleCloseVideoFullScreen();
        } else if (nextMedia.Type === MediaType.Video) {
          handleOpenVideoFullScreen();
        }
      } else setPlayerState({ ...playerState, playing: false });
    }
  }, [finishTrigger]);

  const handleOpenVideoFullScreen = () => {
    setOpenVideoFullScreen(true);
  };

  const handleCloseVideoFullScreen = () => {
    setOpenVideoFullScreen(false);
  };

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const handleShuffle = shuffledValue => {
    let urls = [...mediaUrls];
    if (!shuffledValue) {
      urls = shuffle(urls);
    }

    setShuffled(!shuffledValue);

    setNewMediaUrls(urls);
  };

  const handleSkip = () => {
    if (media && media.MediaUrl) {
      const thisMediaIndex = newMediaUrls.findIndex(m => m === media.MediaUrl);
      let nextUrlIndex = thisMediaIndex + 1;
      if (nextUrlIndex <= newMediaUrls.length - 1) {
        let nextMedia = playlist.find(m => m.MediaUrl === newMediaUrls[nextUrlIndex]);
        setMedia(nextMedia);
      } else if (repeated) {
        let nextMedia = playlist.find(m => m.MediaUrl === newMediaUrls[0]);
        setMedia(nextMedia);
      }
    }
  };
  const handlePlay = () => {
    if (media && media.MediaUrl) {
      setPlayerState({ ...playerState, playing: !playerState.playing });
      if (media.Type === MediaType.Video && !openVideoFullScreen) {
        handleOpenVideoFullScreen();
      }
    }
  };
  const handlePrev = () => {
    if (media) {
      const thisMediaIndex = newMediaUrls.findIndex(m => m === media.MediaUrl);
      let prevUrlIndex = thisMediaIndex - 1;
      if (prevUrlIndex >= 0) {
        let prevMedia = playlist.find(m => m.MediaUrl === newMediaUrls[prevUrlIndex]);
        setMedia(prevMedia);
      } else if (repeated) {
        let nextMedia = playlist.find(m => m.MediaUrl === newMediaUrls[newMediaUrls.length - 1]);
        setMedia(nextMedia);
      }
    }
  };

  const handleRepeat = () => {
    setRepeated(!repeated);
  };

  const handleSeekChange = (e, v) => {
    setPlayerState({ ...playerState, seeking: true, played: Number(v) });
  };

  const handleSeekMouseUp = (e, v) => {
    setPlayerState({ ...playerState, seeking: false });

    if (playerAudio?.current) {
      playerAudio.current.seekTo(parseFloat(v));
    }
  };

  const handleProgress = stateIn => {
    if (!playerState.seeking) {
      setPlayerState({ ...playerState, ...stateIn });
    }
  };

  return (
    <Box className={classes.player} display="flex" flexDirection="row" alignItems="flex-end">
      <Box display="flex" flexDirection="row" alignItems="center" className={classes.mediaPreview}>
        {media && Object.keys(media).length > 0 ? (
          <Box display="flex" flexDirection="row">
            <div
              className={classes.mediaImageSmall}
              style={{
                backgroundImage: media.ImageUrl && media.ImageUrl !== "" ? `url(${media.ImageUrl})` : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Box fontSize={14} color={"#707582"}>
              {media.MediaName ?? "Media name"}
            </Box>
          </Box>
        ) : (
          <Box className={classes.selectMedia}>Choose a Media to Play Now!</Box>
        )}
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" width={"100%"}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          className={classes.controls}
        >
          <button
            onClick={() => {
              handleShuffle(shuffled);
            }}
          >
            <img
              src={require(shuffled ? "assets/icons/shuffle_mint.png" : "assets/icons/shuffle.png")}
              alt="shuffle"
            />
          </button>
          <button onClick={handlePrev}>
            <img src={require("assets/icons/next.png")} alt="next" />
          </button>
          <button onClick={handlePlay}>
            <img
              src={require(playerState.playing ? "assets/icons/pause.svg" : "assets/icons/play.png")}
              alt="play"
            />
          </button>
          <button onClick={handleSkip}>
            <img src={require("assets/icons/next.png")} alt="previous" />
          </button>
          <button onClick={handleRepeat}>
            <img
              src={repeated ? require("assets/icons/repeat_mint.png") : require("assets/icons/repeat.png")}
              alt="repeat"
            />
          </button>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center" className={classes.tracking}>
          <Box fontSize={11} color={"#727F9A"}>
            {playerState.playedSeconds
              ? `${Math.floor((playerState.playedSeconds % 3600) / 60)}:${
                  Math.floor(playerState.playedSeconds % 60) < 10 ? "0" : ""
                }${Math.floor(playerState.playedSeconds % 60).toFixed(0)}`
              : "0:00"}
          </Box>

          {media && (
            <ReactPlayer
              height={0}
              width={0}
              config={{ file: { forceAudio: true, attributes: { controlsList: "nodownload" } } }}
              onContextMenu={e => e.preventDefault()}
              url={media.MediaUrl}
              className="react-player"
              ref={playerAudio}
              playing={playerState.playing && media.Type === MediaType.Audio}
              onEnded={() => {
                setFinishTrigger(new Date().getTime());
              }}
              onPause={() => setPlayerState({ ...playerState, playing: false })}
              onPlay={() => setPlayerState({ ...playerState, playing: true })}
              onProgress={handleProgress}
            />
          )}

          <PlayerSlider
            className={classes.track}
            defaultValue={0}
            min={0}
            max={0.999999}
            step={0.0000001}
            value={playerState.played}
            onChange={handleSeekChange}
            onChangeCommitted={handleSeekMouseUp}
          />
          <Box fontSize={11} color={"#727F9A"}>
            {media && media.Duration
              ? `${Math.floor((media.Duration % 3600) / 60)}:${
                  Math.floor(media.Duration % 60) < 10 ? "0" : ""
                }${Math.floor(media.Duration % 60).toFixed(0)}`
              : "0:00"}
          </Box>
        </Box>
      </Box>
      {media && (
        <VideoFullScreen
          mediaUrl={media.MediaUrl}
          open={openVideoFullScreen}
          handleClose={handleCloseVideoFullScreen}
          setFinishTrigger={setFinishTrigger}
          playing={playerState.playing && media.Type === MediaType.Video}
          setPlaying={v => {
            let playerStateCopy = { ...playerState };
            playerStateCopy.playing = v;

            setPlayerState(playerStateCopy);
          }}
        />
      )}
    </Box>
  );
};

const VideoFullScreen = ({ mediaUrl, open, handleClose, setFinishTrigger, playing, setPlaying }) => {
  let playerVideo: any = useRef();

  return (
    <Modal className="modal" open={open} onClose={handleClose}>
      <div className="modalDiscordFullScreen">
        <div className="exit" onClick={handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <ReactPlayer
          config={{ file: { attributes: { controlsList: "nodownload" } } }}
          onContextMenu={e => e.preventDefault()}
          url={mediaUrl}
          className="react-player"
          ref={playerVideo}
          width="100%"
          playing={playing}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          onEnded={() => {
            setFinishTrigger(new Date().getTime());
          }}
          controls
        />
      </div>
    </Modal>
  );
};
