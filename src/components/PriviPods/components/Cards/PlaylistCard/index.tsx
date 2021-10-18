import React, { useContext } from "react";

import MusicContext from "shared/contexts/MusicContext";
import { playlistCardStyles } from './index.styles';

const RANDOM_MOCK_PLAYLISTS_LENGTH = 19;

export default function PlaylistCard({ item }) {
  const classes = playlistCardStyles();
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
          backgroundImage: item.ImageUrl
            ? `url(${item.ImageUrl})`
            : `url(${require(`assets/mediaIcons/mockup/playlist_mock_up_${
                Math.floor(Math.random() * RANDOM_MOCK_PLAYLISTS_LENGTH) + 1
              }.png`)})`,
        }}
      />
      <div className={classes.title}>{item.Title ?? "Title"}</div>
      <div className={classes.description}>{item.Description ?? "Description or creator name"}</div>
    </div>
  );
}
