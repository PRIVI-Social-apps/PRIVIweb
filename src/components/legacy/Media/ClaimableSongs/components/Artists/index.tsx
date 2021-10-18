import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Gradient, Header3 } from "shared/ui-kit";
import { createStyles } from "@material-ui/styles";
import ArtistCard from "../Cards/ArtistCard";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import MainPageContext from "components/legacy/Media/context";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const arrow = require("assets/icons/arrow.png");

const useStyles = makeStyles(() =>
  createStyles({
    carousel: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    },
    header: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 18,
      borderBottom: "1px solid #181818",
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
      "& h3": {
        fontWeight: "bold",
      },
    },
    title: {
      display: "flex",
      alignItems: "center",
    },
    buttons: {
      "& button": {
        marginLeft: 50,
        background: "transparent",
        padding: 0,
        outline: "none",
        "& img": {
          width: 8,
          height: 16,
        },
        "&:first-child": {
          "& img": {
            transform: "rotate(180deg)",
          },
        },
      },
    },
    listContainer: { display: "flex", width: "100%", marginBottom: 20 },
    list: {
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "center",
      overflow: "hidden",
      padding: "20px 0px",
      scrollBehavior: "smooth",
    },
  })
);

export default function Artists() {
  const users = useSelector((state: RootState) => state.usersInfoList);

  const { setMediaFullScreen } = useContext(MainPageContext);

  const classes = useStyles();
  const [artists, setArtists] = useState<any>([]);

  useEffect(() => {
    if (users && users.length > 0) {
      const usersCopy = users.filter(u => u.imageURL && u.imageURL !== "");

      setArtists(usersCopy);
    }
  }, [users]);

  return (
    <div className={classes.carousel}>
      <div className={classes.header}>
        <div className={classes.title}>
          <Header3 noMargin={true}>Artists</Header3>
          <span
            onClick={() => {
              setMediaFullScreen("Artists");
            }}
          >
            See all
          </span>
        </div>
        <div className={classes.buttons}>
          <button
            onClick={() => {
              document.getElementsByClassName(classes.list)[0]!.scrollLeft -= 75;
            }}
          >
            <img src={arrow} alt="" />
          </button>
          <button
            onClick={() => {
              document.getElementsByClassName(classes.list)[0]!.scrollLeft += 75;
            }}
          >
            <img src={arrow} alt="" />
          </button>
        </div>
      </div>
      <div className={classes.listContainer}>
        <LoadingWrapper loading={!artists || artists.length === 0}>
          <div className={classes.list}>
            {artists.map((artist, index) => (
              <ArtistCard artist={artist} key={artist.id ?? `artist-${index}`} />
            ))}
          </div>
        </LoadingWrapper>
      </div>
    </div>
  );
}
