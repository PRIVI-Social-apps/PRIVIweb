import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { priviMusicSubPageStyles } from "../index.styles";
import { COLUMNS_COUNT_BREAK_POINTS_SIX } from "../SearchPage";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import SubpageHeader from "../../components/SubpageHeader";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import URL from "shared/functions/getURL";
import { RootState } from "store/reducers/Reducer";

enum OpenType {
  Home = "HOME",
  Playlist = "PLAYLIST",
  MyPlaylist = "MYPLAYLIST",
  Album = "ALBUM",
  Artist = "ARTIST",
  Liked = "LIKED",
  Library = "LIBRARY",
  Search = "SEARCH",
  Queue = "QUEUE",
}

export default function MyPlaylistPage() {
  const classes = priviMusicSubPageStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const [playlists, setPlaylists] = useState<any[]>([]);

  const loadPlaylists = () => {
    axios
      .get(`${URL()}/media/getPlaylists`)
      .then(async response => {
        const resp = response.data;
        if (resp.success) {
          const data = resp.data;
          const playlistsData = data
            .map(item => {
              return {
                ...item,
                id: item.Slug,
                Type: OpenType.Playlist,
              };
            })
            .filter(data => data.Creator === userSelector.id);
          setPlaylists(playlistsData);
        }
      })
      .catch(error => {});
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  return (
    <div className={classes.page}>
      <SubpageHeader item={[]} />
      <div className={classes.content}>
        {playlists && playlists.length > 0 && (
          <div className={classes.cards}>
            <MasonryGrid
              gutter={"30px"}
              data={playlists}
              renderItem={(item, index) => <PlaylistCard item={item} key={`item-${index}`} />}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
            />
          </div>
        )}
      </div>
    </div>
  );
}
