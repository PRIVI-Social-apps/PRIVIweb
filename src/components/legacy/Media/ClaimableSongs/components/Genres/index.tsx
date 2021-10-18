import { makeStyles } from "@material-ui/core";
import { Gradient, Header3 } from "shared/ui-kit";
import { createStyles } from "@material-ui/styles";
import React, { useState } from "react";

import GenreCard from "../Cards/GenreCard";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const GenresMock = [
  {
    name: "Rock",
    imageURL:
      "https://www.frosch.com/wp-content/uploads/2018/12/Blog-Thumbnail-Holland-America-Line-Partners-with-Rolling-Stone-to-Launch-Rock-Room-Live-Music-At-Sea-Venue.png",
    songs: 987,
    freeMinutes: 90,
  },
  {
    name: "Pop",
    imageURL: "https://i.pinimg.com/originals/01/64/6b/01646b19c45c0a2171fb659504a284f5.png",
    songs: 987,
    freeMinutes: 90,
  },
  {
    name: "Indie",
    imageURL: "https://www.lasmejoreslistasde.com/wp-content/uploads/2020/07/indie-rock-discos-2.jpg",
    songs: 987,
    freeMinutes: 90,
  },
  {
    name: "Hip Hop",
    imageURL:
      "https://lh3.googleusercontent.com/proxy/yGF7JV7_73cE6-Qz_cKcN9uTOEtdKjiIs5uz1hLLd6YXzmhbV3fRmCUG_sSkRMkybeLfA94O06yHvDwYlqK8j8KcavDdvFQDecZbFOVw1fU_ZZQYE2DrdAG06wKPLUppHMwS",
    songs: 987,
    freeMinutes: 90,
  },
];

const arrow = require("assets/icons/arrow.png");

const useStyles = makeStyles(() =>
  createStyles({
    rankings: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    },
    header: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
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

export default function Genres() {
  const classes = useStyles();
  const [genres, setGenres] = useState<any>(GenresMock);

  return (
    <div className={classes.rankings}>
      <div className={classes.header}>
        <div className={classes.title}>
          <Header3 noMargin={true}>Genre</Header3>
          <span>See all</span>
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
        <LoadingWrapper loading={!genres || genres.length === 0}>
          <div className={classes.list}>
            {genres.map((genre, index) => (
              <GenreCard genre={genre} key={genre.name ?? `genre-${index}`} />
            ))}
          </div>
        </LoadingWrapper>
      </div>
    </div>
  );
}
