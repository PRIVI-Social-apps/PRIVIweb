import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core";
import { Gradient } from "shared/ui-kit";
import { useHistory } from "react-router-dom";
import { BookmarkLikeShare } from "shared/ui-kit/BookmarkLikeShare";

const useStyles = makeStyles(() =>
  createStyles({
    songCard: {
      backgroundColor: "white",
      borderRadius: "20px",
      boxShadow: "2px 2px 12px rgba(0, 0, 0, 0.1)",
      cursor: "pointer",
    },
    cardHeader: {
      padding: 0,
      borderTopLeftRadius: "20px",
      borderTopRightRadius: "20px",
      height: "fitContent",
      maxHeight: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "72px",
      border: 0,
      background: "#949bab",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      marginLeft: 0,
      marginRight: 0,
      width: "100%",
      "& img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      },
    },
    topTags: {
      marginBottom: "-46px",
      marginTop: "16px",
      marginRight: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      width: "100%",
      height: "30px",
      zIndex: 2,
      alignSelf: "flex-end",
      "& div": {
        borderRadius: "36px",
        color: "white",
        fontWeight: 400,
        fontSize: "14.5px",
        padding: "6px 12px",
        background: Gradient.Magenta,
      },
    },
    aspectRatioWrapper: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
    },
    wrapper: {
      position: "relative",
      width: "100%",
      height: "200px",
    },
    playButton: {
      width: "80px",
      height: "80px",
      minHeight: "80px",
      zIndex: 3,
      opacity: 0.8,
      marginLeft: "calc(50% - 40px)",
    },
    content: {
      padding: "0 16px 16px 16px",
    },
    artistRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "-18px",
      marginBottom: "15px",
      zIndex: 1,
    },
    artists: { zIndex: 1, display: "flex", width: "100%", alignItems: "center", height: "fit-content" },
    avatar: {
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      border: "2px solid white",
      backgroundColor: "white",
      filter: "dropShadow(0px 2px 8px rgba(0, 0, 0, 0.12))",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
      marginRight: "-8px",
      cursor: "pointer",
    },
    title: {
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "18px",
      lineHeight: "104.5%",
      margin: "18px 0px 16px 0px",
      padding: 0,
      alignSelf: "flex-start",
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
      width: "100%",
      cursor: "pointer",
    },
    tags: {
      display: "flex",
      alignItems: "center",
      borderTop: "1px solid hsla(0, 0%, 0%, 0.05)",
      borderBottom: "1px solid hsla(0, 0%, 0%, 0.05)",
      margin: "0 -16px",
      padding: "12px 15px",
      "& img": {
        width: "15px",
        height: "15px",
        marginRight: "6px",
      },
    },

    chainTag: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "4px 11px 4px 11px",
      border: "1px solid #99a1b3",
      borderRadius: "14px",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "11px",
      color: "#99a1b3",
      marginRight: "5px",
      height: "30px",
    },
    priviZoneTag: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "4px 11px 4px 11px",
      background: Gradient.Mint,
      borderRadius: "14px",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "11px",
      color: "white",
      marginRight: "5px",
      height: "30px",
    },
    footer: {
      marginTop: "16px",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
    },
    price: {
      display: "flex",
      width: "100%",
      paddingBottom: "16px",
    },
    col: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      "& span": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "11px",
        lineHeight: "104.5%",
        color: "#707582",
      },
      "& p": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "21px",
        lineHeight: "104.5%",
        color: "#181818",
        margin: "5.75px 0px 1.30px",
      },
      "&:last-child": {
        flexGrow: 1,
        marginLeft: "20px",
      },
    },
  })
);

export default function SongCard({ media }) {
  const history = useHistory();
  const classes = useStyles();

  const [song, setSong] = useState<any>({});

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  const displayMediaInfo = () => {
    if (media.MediaSymbol) history.push(`/media/${media.MediaSymbol}`);
  };

  useEffect(() => {
    if (media) {
      setSong(media);
    }
  }, [media]);

  if (song && Object.values(song).length > 0)
    return (
      <div className={classes.songCard}>
        <div
          className={classes.cardHeader}
          onClick={displayMediaInfo}
          style={
            media.dimensions && media.dimensions.height
              ? {
                  height: 0,
                  paddingBottom: `${(media.dimensions.height / media.dimensions.width) * 100}%`,
                }
              : {
                  height: 200,
                }
          }
        >
          <div className={classes.topTags}>
            {song.claimed && (
              <div>
                <span>claimed</span>
              </div>
            )}
          </div>
          <div className={media.dimensions ? classes.aspectRatioWrapper : classes.wrapper}>
            {song.imageURL && song.imageURL !== "" && <img src={song.imageURL} alt={song.MediaSymbol} />}
            <div
              className={classes.playButton}
              style={{
                backgroundImage: `url(${require("assets/icons/playlist_play.png")})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                marginTop: media.dimensions
                  ? `calc( -${((media.dimensions.height / media.dimensions.width) * 100) / 2}% - 40px)`
                  : "-140px",
              }}
            />
          </div>
        </div>

        {/*------------- CREATORS DATA -------------*/}
        <div className={classes.content}>
          <div className={classes.artistRow}>
            <div className={classes.artists}>
              <div
                className={classes.avatar}
                style={{
                  backgroundImage:
                    song.artistImageURL && song.artistImageURL !== ""
                      ? `url(${song.artistImageURL})`
                      : "none",
                  backgroundRepeat: "noRepeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
            {/*--------------- SOCIAL ACTIONS ----------------*/}
            {isSignedIn() && (
              <BookmarkLikeShare setSelectedMedia={setSong} selectedMedia={song} bookmarkType="playlist" />
            )}
          </div>
          {/*------- MEDIA TITLE --------*/}
          <div className={classes.title} onClick={displayMediaInfo}>
            {song.common && song.common.title ? song.common.title : "Song title"}
          </div>
          {/*------- TAGS: TYPE AND CHAIN --------*/}
          <div className={classes.tags} onClick={displayMediaInfo}>
            <div className={classes.chainTag}>
              <img src={require(`assets/tokenImages/PRIVI.png`)} alt={"PRIVI"} />
              {"PRIVI CHAIN"}
            </div>
            {song.free && <div className={classes.priviZoneTag}>🔥 Privi Free Zone</div>}
            {song.free && <img src={require("assets/icons/info_gray.png")} alt="info" />}
          </div>
          {/*------- FOOTER: AUCTION PRICE --------*/}
          <div className={classes.footer} onClick={displayMediaInfo}>
            <div className={classes.price}>
              <div className={classes.col}>
                <span>Bitrate</span>
                <p>{song.format && song.format.bitrate ? song.format.bitrate / 1000 : 256}</p>
                <span>Kbps</span>
              </div>
              <div className={classes.col}>
                <span>Price</span>
                <p>
                  {song.priceToken ?? song.token ?? "ETH"} {song.price ? song.price.toFixed(4) : "N/A"}
                </p>
                <span>
                  (
                  {song.price && song.format && song.format.duration
                    ? (song.price / song.format.duration).toFixed(6)
                    : "N/A"}
                  )/per second
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  else return null;
}
