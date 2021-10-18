import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";

import { makeStyles } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

import MainPageContext from "components/legacy/Media/context";
import SongCard from "../Cards/SongCard";
import MediaClaimableSongsGenresFilters from "../Filters/GenreFilters";

import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { Gradient, Header3 } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const songsMock = [
  {
    claimed: false,
    format: { duration: 495.6545646546, bitrate: 320000 },
    imageURL: "https://source.unsplash.com/random/1",
    artistImageURL: require("assets/anonAvatars/ToyFaces_Colored_BG_075.jpg"),
    common: { title: "2002byAnneMarie" },
    price: 0.01,
    priceToken: "DAI",
    dimensions: { height: 225, width: 225 },
    genre: "Rock",
  },
  {
    claimed: false,
    format: { duration: 495.6545646546, bitrate: 320000 },
    imageURL: "https://source.unsplash.com/random/2",
    artistImageURL: require("assets/anonAvatars/ToyFaces_Colored_BG_088.jpg"),
    common: { title: "2002byAnneMarie" },
    price: 0.01,
    priceToken: "DAI",
    dimensions: { height: 225, width: 425 },
    genre: "Rock",
  },
  {
    claimed: true,
    format: { duration: 495.6545646546, bitrate: 320000 },
    imageURL: "https://source.unsplash.com/random/3",
    artistImageURL: require("assets/anonAvatars/ToyFaces_Colored_BG_105.jpg"),
    common: { title: "2002byAnneMarie" },
    price: 0.01,
    priceToken: "DAI",
    dimensions: { height: 425, width: 225 },
    free: true,
    genre: "Indie",
  },
  {
    claimed: true,
    format: { duration: 495.6545646546, bitrate: 320000 },
    imageURL: "https://source.unsplash.com/random/4",
    artistImageURL: require("assets/anonAvatars/ToyFaces_Colored_BG_005.jpg"),
    common: { title: "2002 by Anne Marie" },
    price: 0.01,
    priceToken: "DAI",
    genre: "Pop",
  },
  {
    claimed: false,
    format: { duration: 495.6545646546, bitrate: 320000 },
    imageURL: "https://source.unsplash.com/random/5",
    artistImageURL: require("assets/anonAvatars/ToyFaces_Colored_BG_064.jpg"),
    price: 0.01,
    priceToken: "DAI",
    free: true,
    genre: "Hip Hop",
    common: { title: "2002byAnneMarie" },
  },
  {
    claimed: false,
    format: { duration: 495.6545646546, bitrate: 320000 },
    imageURL: "https://source.unsplash.com/random/6",
    artistImageURL: require("assets/anonAvatars/ToyFaces_Colored_BG_055.jpg"),
    price: 0.01,
    priceToken: "DAI",
    genre: "Pop",
    common: { title: "2002byAnneMarie" },
  },
];

const useStyles = makeStyles(() =>
  createStyles({
    genresDisplay: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    back: {
      color: "white",
      fontSize: "14px",
      cursor: "pointer",
    },
    genresDisplayHeader: {
      marginLeft: "-72px",
      display: "flex",
      flexDirection: "column",
      width: "calc(100% + 72px * 2)",
      justifyContent: "space-between",
      padding: "22px 72px 26px",
      height: "487px",
      marginBottom: "54px",
      "& h5": {
        color: "white",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "36px",
        lineHeight: "104.5%",
        margin: 0,
        zIndex: 1,
      },
      "& h2": {
        color: "white",
        fontStyle: "normal",
        fontWeight: "800",
        fontSize: "80px",
        margin: "11px 0px 23px",
        zIndex: 1,
      },
    },
    gradient: {
      marginLeft: "-72px",
      width: "calc(100% + 2 * 72px)",
      height: "300px",
      zIndex: 0,
      marginBottom: "-26px",
      marginTop: "-274px",
      background: "linear-gradient(180deg, rgba(21, 21, 21, 0) -0%, rgba(14, 14, 14, 0.6) 100%)",
    },
    row: {
      zIndex: 1,
      display: "flex",
      alignItems: "center",
      paddingTop: "32px",
      borderTop: "1px solid #FFFFFF",
      "& div": {
        display: "flex",
        alignItems: "center",
        color: "white",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        marginRight: "40px",
        "& span": {
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "14px",
          marginRight: "6px",
        },
      },
    },
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
  })
);

export default function GenresDisplay() {
  const { setMediaFullScreen, mediaFullScreen } = useContext(MainPageContext);

  const classes = useStyles();
  const [songs, setSongs] = useState<any>(songsMock.filter(s => s.genre === mediaFullScreen));
  const [filters, setFilters] = useState<any>([]);

  useEffect(() => {
    Axios.get(`${URL()}/claimableSongs/getSongListByGenre`).then(res => {
      if (res.data.success) {
        if (res.data.data && res.data.data.length > 0) {
          setSongs(res.data.data);
        }
      }
    });
  }, []);

  const filteredData = () => {
    let filteredData = [...songs];

    //this should be filtered in backend, but there's no functions yet..
    if (filters.searchValue && filters.searchValue !== "") {
      filteredData = filteredData.filter(
        song =>
          (song.common &&
            song.common.title &&
            song.common.title.toUpperCase().includes(filters.searchValue?.toUpperCase())) ||
          (song.common &&
            song.common.artist &&
            song.common.artist.toUpperCase().includes(filters.searchValue?.toUpperCase())) ||
          (song.common &&
            song.common.hashtags &&
            song.common.hashtags.length > 0 &&
            song.common.hashtags.some(hashtag =>
              hashtag.toUpperCase().includes(filters.searchValue?.toUpperCase())
            ))
      );
    }

    return filteredData;
  };

  return (
    <div className={classes.genresDisplay}>
      <div
        className={classes.genresDisplayHeader}
        style={{
          backgroundImage: `url(https://cdn.wegow.com/media/artists/the-weeknd/the-weeknd-1585555957.8601027.2560x1440.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span
          className={classes.back}
          onClick={() => {
            setMediaFullScreen(null);
          }}
        >
          {`< Back`}
        </span>
        <div>
          <h5>Claimable Songs/Genre</h5>
          <h2>{mediaFullScreen}</h2>
          <div className={classes.row}>
            <div>
              <span>🌟 Total Songs:</span> {songs.length ?? 0}
            </div>
            <div>
              <span>🔥 Privi Free Zone Songs:</span> {songs.filter(a => a.free).length ?? 0}
            </div>
            <div>
              <span>🤘 Claimed:</span> {songs.filter(a => a.claimed).length ?? 0}
            </div>
            <div>
              <span>👎 Unclaimed:</span> {songs.filter(a => !a.claimed).length ?? 0}
            </div>
          </div>
          <div className={classes.gradient} />
        </div>
      </div>
      <MediaClaimableSongsGenresFilters filters={filters} onFiltersChange={setFilters} />
      <div className={classes.carousel}>
        <div className={classes.header}>
          <div className={classes.title}>
            <Header3 noMargin={true}>Songs</Header3>
            <span onClick={() => { }}>See all</span>
          </div>
        </div>
        <div className={classes.listContainer}>
          <LoadingWrapper loading={!songs}>
            <MasonryGrid
              data={filteredData()}
              renderItem={(item, index) => <SongCard media={item} key={`song-${index}`} />}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
              gutter={GUTTER}
            />
          </LoadingWrapper>
        </div>
      </div>
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
