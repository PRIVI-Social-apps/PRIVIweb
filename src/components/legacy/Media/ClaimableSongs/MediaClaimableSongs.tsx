import React, { useEffect, useState } from "react";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { CircularLoadingIndicator } from "shared/ui-kit";
import {
  initialFilters,
  SearchMediaClaimableSongsFilters,
} from "./components/Filters/MainFilters/initialFilters";
import MediaClaimableSongsFilters from "./components/Filters/MainFilters";
import SongCard from "./components/Cards/SongCard";

import RankedSongs from "./components/RankedSongs";
import Artists from "./components/Artists";
import Genres from "./components/Genres";
import { createStyles, makeStyles } from "@material-ui/core";
import Axios from "axios";
import URL from "shared/functions/getURL";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    header: {
      fontSize: "30px",
      width: "100%",
      paddingBottom: "15px",
      borderBottom: "1px solid #181818",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      "& h3": {
        fontWeigth: 700,
      },
      "& img": {
        cursor: "pointer",
        width: 30,
        height: 30,
      },
    },
    noResults: {
      fontSize: "30px",
      textAlign: "center",
      paddingBottom: "22px",
      padding: "20px 0px 30px 0px",
      fontWeight: 500,
    },
    container: {
      marginRight: "72px",
      paddingBottom: "20px",
    },
  })
);

const MediaClaimableSongs = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<SearchMediaClaimableSongsFilters>(initialFilters);
  const [data, setData] = useState<any[]>([]);

  const fetchData = () => {
    Axios.get(`${URL()}/claimableSongs/getSongList`).then(res => {
      if (res.data.success) {
        let songs = res.data.data ?? [];
        if (songs && songs.length > 0) {
          //- song image missing, can't access with uploads/id route
          //would need another backend function or something like that;
          //also if we could get the dimensions like we do in media
          //that would really help
          //- artist image also missing
          setData(songs);
        }
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = () => {
    let filteredData = [...data];

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
    <div className={classes.root}>
      <MediaClaimableSongsFilters filters={filters} onFiltersChange={setFilters} />
      {filters.searchValue && filters.searchValue !== "" ? (
        <>
          <div className={classes.header}>
            <h3>Results</h3>
            <img
              src={require("assets/icons/cross_large.png")}
              alt="close"
              onClick={() => {
                setFilters({ searchValue: "" });
              }}
            />
          </div>
          {loading ? (
            <CircularLoadingIndicator />
          ) : filteredData().length > 0 ? (
            <div className={classes.container}>
              <MasonryGrid
                data={filteredData()}
                renderItem={(item, index) => <SongCard media={item} key={`${index}-card`} />}
              />
            </div>
          ) : (
            <div className={classes.noResults}>No Results</div>
          )}
        </>
      ) : (
        <>
          <RankedSongs />
          <Artists />
          <Genres />
        </>
      )}
    </div>
  );
};

export default MediaClaimableSongs;
