import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";

import { Table } from "@material-ui/core";

import { priviMusicSubPageStyles } from "../index.styles";
import MusicContext from "shared/contexts/MusicContext";
import SongsRowHeader from "../../components/SongsRowHeader";
import SongRow from "../../components/SongRow";
import ActionsRow from "../../components/ActionsRow";
import SubpageHeader from "../../components/SubpageHeader";
import axios from "axios";
import URL from "shared/functions/getURL";

export default function LikedPage() {
  const classes = priviMusicSubPageStyles();
  const [likedSongs, setLikedSongs] = useState<any>({});
  const userSelector = useSelector((state: RootState) => state.user);

  const { openTab } = useContext(MusicContext);

  const getSongList = () => {
    axios
      .get(`${URL()}/claimableSongs/getSongList`)
      .then(response => {
        if (response.data.success) {
          const songs = response.data.data;
          setLikedSongs(songs.filter(song => song.Likes && song.Likes.includes(userSelector.id)));
        } else {
          console.log(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    getSongList();
  }, [openTab]);

  if (likedSongs)
    return (
      <div className={classes.page}>
        <SubpageHeader item={likedSongs} />
        <div className={classes.content}>
          <ActionsRow item={likedSongs} setItem={setLikedSongs} />
          <Table className={classes.table}>
            <SongsRowHeader />
            {likedSongs &&
              likedSongs.length > 0 &&
              likedSongs.map(song => <SongRow row={song} simplified={false} />)}
          </Table>
        </div>
      </div>
    );
  else return null;
}
