import { makeStyles } from "@material-ui/core";
import { Gradient, Header3 } from "shared/ui-kit";
import { createStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";

import URL from "shared/functions/getURL";
import Axios from "axios";

const RankingMock = [
  {
    imageURL: "https://source.unsplash.com/random/1",
    common: { title: "Song name 1" },
  },
  {
    imageURL: "https://source.unsplash.com/random/2",
    common: { title: "Song name 2" },
  },
  {
    imageURL: "https://source.unsplash.com/random/3",
    common: { title: "Song name 3" },
  },
];

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
    rankingRow: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      padding: "50px 0px",
    },

    rankingTile: {
      display: "flex",
      alignItems: "center",
      marginRight: "32px",
    },
    ranking: {
      width: 39,
      height: 38,
      borderRadius: 20,
      background: Gradient.Magenta,
      color: "white",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: 22,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "50px",
      marginLeft: "-20px",
    },
    songImage: {
      width: 96,
      minWidth: 96,
      height: 96,
      background: "#F7F9FE",
      borderRadius: 100,
    },
    title: {
      marginLeft: "18px",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: 28,
    },
  })
);

export default function RankedSongs() {
  const classes = useStyles();
  const [rankSongs, setRankSongs] = useState<any>(RankingMock);

  useEffect(() => {
    Axios.get(`${URL()}/claimableSongs/getSongListByRanking`).then(res => {
      if (res.data.success) {
        if (res.data && res.data.length > 0) {
          setRankSongs(res.data);
        }
      }
    });
  }, []);

  return (
    <div className={classes.rankings}>
      <div className={classes.header}>
        <Header3 noMargin={true}>Ranked Songs</Header3>
        <span>See all</span>
      </div>
      <div className={classes.rankingRow}>
        {rankSongs.map((song, index) =>
          index < 3 ? <Ranking song={song} ranking={index + 1} key={`ranking-${index + 1}`} /> : null
        )}
      </div>
    </div>
  );
}

const Ranking = ({ song, ranking }) => {
  const classes = useStyles();
  return (
    <div className={classes.rankingTile}>
      <div
        className={classes.songImage}
        style={{
          backgroundImage: song.imageURL && song.imageURL !== "" ? `url(${song.imageURL})` : "none",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className={classes.ranking}>{ranking}</div>
      <div className={classes.title}>
        {song.common && song.common.title ? song.common.title : "Song title"}
      </div>
    </div>
  );
};
