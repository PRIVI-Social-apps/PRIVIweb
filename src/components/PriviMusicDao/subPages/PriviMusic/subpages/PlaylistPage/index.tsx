import React, { useContext, useEffect, useState } from "react";

import { Table } from "@material-ui/core";

import { priviMusicSubPageStyles } from '../index.styles';
import MusicContext from "shared/contexts/MusicContext";
import SongsRowHeader from "../../components/SongsRowHeader";
import SongRow from "../../components/SongRow";
import ActionsRow from "../../components/ActionsRow";
import SubpageHeader from "../../components/SubpageHeader";
import getAverageColor from "get-average-color";
import axios from "axios";
import URL from "shared/functions/getURL";


export default function PlaylistPage() {
  const classes = priviMusicSubPageStyles();
  const [playlist, setPlaylist] = useState<any>({ ImageUrl: null });

  const { openTab } = useContext(MusicContext);

  const [color, setColor] = useState<string>("#cccccc");

  useEffect(() => {
    if (!openTab) {
      return;
    }
    axios
      .get(`${URL()}/media/getPlaylist/${openTab.id}`)
      .then(response => {
        if (response.data.success) {
          const a = response.data.data;
          if (a) {
            const RANDOM_MOCK_PLAYLISTS_LENGTH = 19;
            if (!a.ImageUrl) {
              a.ImageUrl = require(`assets/mediaIcons/mockup/playlist_mock_up_${
                Math.floor(Math.random() * RANDOM_MOCK_PLAYLISTS_LENGTH) + 1
              }.png`);
            }
          }
          getAverageColor(a.ImageUrl).then(rgb => {
            if (rgb) {
              setColor(`rgba(${rgb.r},${rgb.g},${rgb.b},1)`);
            }
          });
          if (a.Color) {
            setColor(a.Color);
          }

          if (a.Songs && a.Songs.length > 0) {
            let d = 0;
            let duration = "";
            a.Songs.forEach(s => {
              if (s.Duration) {
                d = d + s.Duration;
              }
            });
            if (d > 0) {
              let hrs = Math.floor(d / 3600);
              let min = Math.floor((d % 3600) / 60);
              let seg = Math.floor(d % 60);
              duration = `${hrs && hrs > 0 ? `${hrs} hrs ` : ""}${min ?? 0} min ${
                seg ? seg.toFixed(0) : 0
              } seg`;
            } else {
              duration = `0 hrs 0 min 0 seg`;
            }

            setPlaylist({ ...a, Duration: duration });
          } else {
            setPlaylist(a);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [openTab]);

  if (playlist && !playlist.ImageUrl) {
    return (
      <div className={classes.page}>
        <SubpageHeader
          item={{
            empty: true,
            Color: color,
          }}
        />
        <div className={classes.content} style={{ marginTop: "104px" }}>
          <div className={classes.empty}>Playlist not found</div>
        </div>
      </div>
    );
  } else if (playlist && ((playlist.ImageUrl !== "" && color !== "#ffffff") || playlist.ImageUrl === "")) {
    return (
      <div className={classes.page}>
        <SubpageHeader item={{ ...playlist, Color: color, count: playlist.Songs?.length || 0 }} />
        <div className={classes.content}>
          <ActionsRow item={playlist} setItem={setPlaylist} />
          <Table className={classes.table}>
            <SongsRowHeader />
            {playlist.Songs &&
              playlist.Songs.length > 0 &&
              playlist.Songs.map((song, index) => (
                <SongRow row={song} simplified={false} key={`song-${index}`} />
              ))}
          </Table>
        </div>
      </div>
    );
  } else return null;
}
