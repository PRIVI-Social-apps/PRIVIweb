import React, { useContext } from "react";

import MusicContext from "shared/contexts/MusicContext";
import { albumCardStyles } from './index.styles';

export default function AlbumCard({ item }) {
  const classes = albumCardStyles();
  const { setOpenTab, history, setHistory } = useContext(MusicContext);

  return (
    <div
      className={classes.card}
      onClick={() => {
        setOpenTab({ type: item.Type, id: item.id, index: history.length });
        setHistory([...history, { type: item.Type, id: item.id, index: history.length }]);
      }}
    >
      <div
        className={classes.album}
        style={{
          backgroundImage: item.album_image && item.album_image !== "" ? `url(${item.album_image})` : "none",
        }}
      />
      <div className={classes.title}>{item.album_name ?? "Title"}</div>
      <div className={classes.description}>
        {item.artist_name ?? "Description or creator name"}
      </div>
    </div>
  );
}
