import React, { useContext, useEffect, useState } from "react";
import getAverageColor from "get-average-color";
import axios from "axios";

import { Table } from "@material-ui/core";

import { priviMusicSubPageStyles } from '../index.styles';
import MusicContext from "shared/contexts/MusicContext";
import SongsRowHeader from "../../components/SongsRowHeader";
import SongRow from "../../components/SongRow";
import ActionsRow from "../../components/ActionsRow";
import SubpageHeader from "../../components/SubpageHeader";
import URL from "shared/functions/getURL";

export default function AlbumPage() {
  const classes = priviMusicSubPageStyles();
  const [album, setAlbum] = useState<any>({ album_image: null });

  const { openTab } = useContext(MusicContext);

  const [color, setColor] = useState<string>("#ffffff");

  useEffect(() => {
    //TODO: get real album
    if (!openTab) {
      return;
    }
    const fetchAlbumData = async () => {
      try {
        const response = await axios.get(`${URL()}/claimableSongs/getAlbumDetail?albumId=${openTab.id}`);
        if (response.data.success) {
          let albumData = response.data.data;
          if (albumData.album_image) {
            getAverageColor(albumData.album_image).then(rgb => {
              if (rgb) {
                setColor(`rgba(${rgb.r},${rgb.g},${rgb.b},1)`);
              }
            });
          } else {
            albumData.album_image = "";
          }
          if (albumData.songs && albumData.songs.length > 0) {
            let d = 0;
            let duration = "";
            albumData.songs.forEach(s => {
              if (s.duration) {
                d = d + s.duration;
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
            setAlbum({ ...albumData, Duration: duration });
          } else {
            setAlbum(albumData);
          }
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAlbumData();
  }, [openTab]);

  if (album && !album.album_image) {
    return (
      <div className={classes.page}>
        <SubpageHeader
          item={{
            empty: true,
            Color: color,
          }}
        />
        <div className={classes.content} style={{ marginTop: "104px" }}>
          <div className={classes.empty}>Album not found</div>
        </div>
      </div>
    );
  } else if (album && ((album.album_image !== "" && color !== "#ffffff") || album.album_image === ""))
    return (
      <div className={classes.page}>
        <SubpageHeader item={{ ...album, Color: color }} />
        <div className={classes.content}>
          <ActionsRow item={album} setItem={setAlbum} />
          <Table className={classes.table}>
            <SongsRowHeader />
            {album.songs &&
              album.songs.length > 0 &&
              album.songs.map((song, index) => (
                <SongRow row={song} simplified={false} key={`song-${index}`} />
              ))}
          </Table>
        </div>
      </div>
    );
  else return null;
}
