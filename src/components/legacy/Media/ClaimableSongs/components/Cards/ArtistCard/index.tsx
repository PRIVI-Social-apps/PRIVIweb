import { makeStyles } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Gradient } from "shared/ui-kit";
import { RootState } from "store/reducers/Reducer";

const useStyles = makeStyles(() =>
  createStyles({
    artistCard: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      height: "332px",
      width: "279px",
      minWidth: "279px",
      marginRight: "30px",
      borderRadius: "20px",
      background: "linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%)",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.3)",
      padding: "18px",
      cursor: "pointer",
    },
    followedButton: {
      background: Gradient.Mint,
      color: "white",
      "& img": {
        width: "12px",
        marginRight: "6px",
      },
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
        width: "50%",
        margin: "0px 15px 0px 0px !important",
        "&:last-child": {
          margin: "0 !important",
        },
      },
      "& h4": {
        color: "white",
        fontSize: 22,
        margin: 0,
      },
      "& span": {
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
    gradient: {
      marginLeft: "-18px",
      width: "calc(100% + 2 * 18px)",
      height: "80px",
      zIndex: 0,
      marginBottom: "-18px",
      marginTop: "-64px",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      background: "linear-gradient(180deg, rgba(21, 21, 21, 0) -0%, rgba(14, 14, 14, 0.6) 100%)",
    },
  })
);

export default function ArtistCard({ artist }) {
  const classes = useStyles();
  const user = useSelector((state: RootState) => state.user);

  const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
  const isFollowing = artist && isUserFollowed(artist.id);

  const history = useHistory();

  const handleFollow = async e => {
    e.preventDefault();
    e.stopPropagation();
    //TODO: FOLLOW/UNFOLLOW USER

    if (artist.id) {
      if (!isFollowing) {
        await followUser(artist.id);
      } else {
        await unfollowUser(artist.id);
      }
    }
  };

  return (
    <div
      className={classes.artistCard}
      style={{
        backgroundImage: artist.imageURL && artist.imageURL !== "" ? `url(${artist.imageURL})` : "none",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => {
        history.push(`/media/artist/${artist.urlSlug ?? artist.id}`);
      }}
    >
      <div className={classes.row}>
        <h4>{artist.name ?? "Artist"}</h4>
        {artist.id && user.id !== artist.id && (
          <button
            onClick={handleFollow}
            className={isFollowing ? classes.followedButton : classes.whiteButton}
          >
            {isFollowing && <img src={require("assets/icons/check.png")} alt={"tick"} />}
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>
      <div className={classes.row}>
        <div className={classes.row}>
          <span>🌟 Songs</span> {artist.songs ?? 0}
        </div>
        <div className={classes.row}>
          <span>🌟 Followers</span> {artist.followers ?? 0}
        </div>
      </div>

      <div className={classes.gradient} />
    </div>
  );
}
