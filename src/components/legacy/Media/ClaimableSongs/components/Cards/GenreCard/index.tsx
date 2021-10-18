import { makeStyles } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";
import MainPageContext from "components/legacy/Media/context";
import React, { useContext } from "react";
import { Gradient } from "shared/ui-kit";

const useStyles = makeStyles(() =>
  createStyles({
    genreCard: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      height: "332px",
      width: "370px",
      minWidth: "370px",
      marginRight: "42px",
      borderRadius: "20px",
      background: "linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%)",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.3)",
      padding: "24px",
      cursor: "pointer",
    },
    followedButton: {
      background: Gradient.Mint,
      color: "white",
    },
    whiteButton: {
      background: "white",
      color: "black",
    },
    row: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      color: "white",
      zIndex: 1,
      "& button": {
        padding: "8px 16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "6px",
        height: "36px",
        width: "119px",
      },
      "&:first-child": {
        marginBottom: "12px",
      },
      "& div": {
        width: "35%",
        margin: "0px 15px 0px 0px !important",
        "&:last-child": {
          margin: 0,
          width: "65%",
          minWidth: "190px",
        },
      },
      "& h2": {
        color: "white",
        fontSize: 40,
        fontWeight: 700,
        margin: 0,
      },
      "& span": {
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
    gradient: {
      marginLeft: "-24px",
      width: "calc(100% + 2 * 24px)",
      height: "120px",
      zIndex: 0,
      marginBottom: "-24px",
      marginTop: "-96px",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      background: "linear-gradient(180deg, rgba(21, 21, 21, 0) -0%, rgba(14, 14, 14, 0.6) 100%)",
    },
  })
);

export default function GenreCard({ genre }) {
  const classes = useStyles();

  const { setMediaFullScreen } = useContext(MainPageContext);

  const handleFollow = e => {
    e.preventDefault();
    e.stopPropagation();
    //TODO: FOLLOW/UNFOLLOW GENRE
  };

  return (
    <div
      className={classes.genreCard}
      style={{
        backgroundImage: genre.imageURL && genre.imageURL !== "" ? `url(${genre.imageURL})` : "none",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => {
        setMediaFullScreen(genre.name);
      }}
    >
      <div className={classes.row}>
        <h2>{genre.name ?? "genre"}</h2>
        <button
          onClick={handleFollow}
          className={genre.followed ? classes.followedButton : classes.whiteButton}
        >
          {genre.followed && <img src={require("assets/icons/check.png")} alt={"tick"} />}
          {genre.followed ? "Following" : "Follow"}
        </button>
      </div>
      <div className={classes.row}>
        <div className={classes.row}>
          <span>🌟 Songs</span> {genre.songs ?? 0}
        </div>
        <div className={classes.row}>
          <span>🔥 Privi Free Zone</span> {genre.freeMinutes ?? 0} min
        </div>
      </div>
      <div className={classes.gradient} />
    </div>
  );
}
