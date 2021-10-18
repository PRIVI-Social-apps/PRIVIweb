import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  ClickAwayListener,
  Grow,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  withStyles,
} from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

import MainPageContext from "components/legacy/Media/context";
import SongCard from "../components/Cards/SongCard";
import PrintArtistPageChart from "./Chart/ArtistPageChart";
import ArtistPageChartConfig from "./Chart/ArtistPageChartConfig";
import { RootState } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";
import { Gradient, Header3, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const isSignedIn = () => {
  return !!sessionStorage.getItem("token");
};

const useStyles = makeStyles(() =>
  createStyles({
    artistPage: {
      overflowY: "auto",
      height: "calc(100vh - 84px)",
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    back: {
      color: "white",
      fontSize: "14px",
      cursor: "pointer",
      marginBottom: "18px",
    },
    artistPageHeader: {
      background: "linear-gradient(90deg, rgba(0, 0, 70, 1) 0%, rgba(28, 181, 224, 1) 100%)",
      padding: "28px 120px 32px 120px",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "350px",
      "& nav": {
        marginTop: "24px",
        fontFamily: "Agrandir",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "25px",
        lineHeight: "32px",
        color: "white",

        "& span": {
          background: Gradient.Mint,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
      },
      "& p": {
        color: "white",
        marginTop: "22px",
        marginBottom: 0,
      },
    },
    freeTag: {},
    chainTag: {},
    name: {
      display: "flex",
      alignItems: "flex-start",
      marginBottom: "7px",
      "& h1": {
        fontFamily: "Agrandir GrandLight",
        color: "white",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "72px",
        lineHeight: "64px",
        margin: "5px 0px",
      },
      "& img": {
        marginLeft: "15px",
        width: "32px",
      },
    },
    genre: {
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "18px",
      color: "white",
    },
    overflowHeader: {
      padding: "0px 120px",
      display: "flex",
      marginTop: "-70px",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "80px",
    },
    mainData: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    row: {
      display: "flex",
      width: "100%",
      "&:first-child": {
        justifyContent: "space-between",
      },
      "& > button": {
        "& img": {
          height: "10px",
          marginRight: "12px",
        },
      },
    },
    column: {
      display: "flex",
      flexDirection: "column",
      "& span": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "104.5%",
        color: "#707582",
      },
      "& h3": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "30px",
        marginTop: "7px",
      },
    },
    artistImageContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      marginLeft: "100px",
    },
    artistImage: {
      width: "calc((100vw - 80px - 120px - 120px) / 2 - 100px)",
      height: "367px",
      borderRadius: "20px",
      background: "#949bab",
    },
    actions: {
      display: "flex",
      alignItems: "center",
      marginTop: "26px",

      "& > button": {
        height: "auto",
        margin: 0,
        marginLeft: "8px",
        background: "transparent",
        border: "none",
        padding: 0,
        "& img": {
          height: "18px",
        },
      },
    },
    playButton: {
      alignSelf: "center",
      width: "80px",
      height: "80px",
      minHeight: "80px",
      zIndex: 3,
      opacity: 0.8,
      backgroundImage: `url(${require("assets/icons/playlist_play.png")})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      marginTop: "-223px",
      marginBottom: "133px",
    },
    graphs: {
      display: "flex",
      width: "100%",
      padding: "0px 120px",
      marginBottom: "90px",
      "& > div": {
        width: "50%",
        "&:first-child": {
          marginRight: "40px",
        },
      },
    },

    songsList: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      padding: "0px 120px",
    },
    header: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 18,
      borderBottom: "1px solid #181818",
      "& h3": {
        fontWeigth: 700,
      },
      "& span": {
        fontStyle: "normal",
        fontWeight: "normal",
        background: Gradient.Mint,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontSize: 14,
        marginLeft: 20,
        cursor: "pointer",
      },
    },
    title: {
      display: "flex",
      alignItems: "center",
    },
    listContainer: {
      flexDirection: "column",
      display: "flex",
      width: "100%",

      marginBottom: 20,
      "& > div": {
        marginTop: "65px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
    paper: {
      minWidth: 200,
      marginRight: -267,
      marginLeft: -65,
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

export default function ArtistPage() {
  let users = useSelector((state: RootState) => state.usersInfoList);

  const history = useHistory();
  const classes = useStyles();
  const { setMediaFullScreen } = useContext(MainPageContext);

  const [artist, setArtist] = useState<any>([]);
  const [songs, setSongs] = useState<any>([]);

  const [reproductions, setReproductions] = useState<number>(0);
  const [likes, setLikes] = useState<number>(0);
  const [bitrate, setBitrate] = useState<number>(0);

  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);

  const [reproductionsData, setReproductionsData] = useState<any>(ArtistPageChartConfig(undefined));
  const [fundsRaised, setFundsRaised] = useState<number>(0);
  const [fundsRaisedData, setFundsRaisedData] = useState<any>(ArtistPageChartConfig("pUSD"));

  let pathName = window.location.href; // If routing changes, change to pathname
  let idUrl = pathName.split("/")[6];

  useEffect(() => {
    if (idUrl && users && users.length > 0) {
      //load real info
      const thisUser = users.find(u => u.urlSlug === idUrl || u.id === idUrl);
      if (thisUser) {
        setArtist(thisUser);
      }
    }
  }, [idUrl, users]);

  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);
  const [openShareMenu, setOpenShareMenu] = React.useState(false);

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

  function handleListKeyDownShareMenu(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };
  const handleLike = () => {
    setLiked(!liked);
  };
  const handleOpenPriviShareModal = () => {};
  const handleOpenShareModal = () => {};

  return (
    <div className={classes.artistPage}>
      <div className={classes.artistPageHeader}>
        <span
          className={classes.back}
          onClick={() => {
            history.push({
              pathname: `/media`,
              state: { tab: 3 },
            });
          }}
        >
          {`< Back`}
        </span>
        {(artist.free || artist.chain) && (
          <Box display="flex">
            {artist.free && <div className={classes.freeTag}>🔥 Privi Free Zone</div>}
            {artist.chain && artist.chain === "PRIVI" && (
              <div className={classes.chainTag}>
                <img src={require(`assets/tokenImages/PRIVI.png`)} alt={"PRIVI"} />
                {"PRIVI CHAIN"}
              </div>
            )}
          </Box>
        )}
        <nav>
          <span>Claimable songs</span> / Aritst
        </nav>
        <div className={classes.name}>
          <h1>{artist.name ?? "Artist"}</h1>
          {artist.verified && <img src={require("assets/icons/verified.png")} alt={`tick`} />}
        </div>
        <div className={classes.genre}>
          <b>Genre: </b> {artist.genre ?? "Unknown"}
        </div>
        <p>{artist.bio ?? ""}</p>
      </div>
      <div className={classes.overflowHeader}>
        <div className={classes.mainData}>
          <div className={classes.row}>
            <div className={classes.column}>
              <span>🎧 Reproductions</span>
              <h3>{reproductions}</h3>
            </div>
            <div className={classes.column}>
              <span>💜 Likes</span>
              <h3>{likes}</h3>
            </div>
            <div className={classes.column}>
              <span>🎶 Bitrate</span>
              <h3>{bitrate} Kbps</h3>
            </div>
          </div>
          <div className={classes.row}>
            <PrimaryButton size={"medium"}>
              <img src={require("assets/icons/play_white.png")} alt="play" />
              Play
            </PrimaryButton>
            <SecondaryButton size={"medium"}>Stake Privi Tokens</SecondaryButton>
          </div>
        </div>
        <div className={classes.artistImageContainer}>
          <div
            className={classes.artistImage}
            style={{
              backgroundImage:
                artist.hasPhoto && artist.imageURL.length > 0 ? `url(${artist.imageURL})` : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className={classes.playButton} />
          <div className={classes.actions}>
            <button onClick={handleBookmark}>
              <img
                src={require(`assets/priviIcons/${
                  bookmarked ? "bookmark-filled-gray" : "bookmark-gray"
                }.svg`)}
                alt={"list"}
              />
            </button>
            <button onClick={handleToggleShareMenu} ref={anchorShareMenuRef}>
              <img
                src={require(`assets/priviIcons/${openShareMenu ? "share-filled-gray" : "share-gray"}.svg`)}
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
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            <button onClick={handleLike}>
              <img
                src={require(`assets/priviIcons/${liked ? "like-filled-gray" : "like-gray"}.svg`)}
                alt={"heart"}
              />
            </button>
          </div>
        </div>
      </div>
      <div className={classes.graphs}>
        {PrintArtistPageChart(reproductionsData, reproductions, undefined, "Reproductions")}
        {PrintArtistPageChart(fundsRaisedData, fundsRaised, "pUSD", "Funds Raised")}
      </div>
      {songs && songs.length > 0 && (
        <div className={classes.songsList}>
          <div className={classes.header}>
            <div className={classes.title}>
              <Header3 noMargin={true}>Songs</Header3>
              <span onClick={() => {}}>See all</span>
            </div>{" "}
          </div>
          <div className={classes.listContainer}>
            <LoadingWrapper loading={!songs}>
              {songs.length > 0 && (
                <MasonryGrid
                  data={songs}
                  renderItem={(item, index) => <SongCard media={item} key={`song-${index}`} />}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                  gutter={GUTTER}
                />
              )}
            </LoadingWrapper>
          </div>
        </div>
      )}
    </div>
  );
}

const COLUMNS_COUNT_BREAK_POINTS = {
  767: 2,
  900: 3,
  1200: 4,
  1510: 5,
};
const GUTTER = "36px";
