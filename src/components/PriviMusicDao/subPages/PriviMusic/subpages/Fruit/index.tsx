import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import cls from "classnames";
import axios from "axios";

import { priviMusicSubPageStyles } from '../index.styles';
import AlbumCard from "../../components/Cards/AlbumCard";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import ArtistCard from "../../components/Cards/ArtistCard";
import RankingCard from "../../components/Cards/RankingCard";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { COLUMNS_COUNT_BREAK_POINTS_SIX } from "../SearchPage/index";
import URL from "shared/functions/getURL";
import { Text } from "components/PriviMusicDao/components/ui-kit";

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
  Fruit = "FRUIT",
}

enum ViewAllType {
  Album = "New Albums",
  Discovery = "Weekly Dicovery",
}

export default function FruitPage() {
  const classes = priviMusicSubPageStyles();

  const [newAlbums, setNewAlbums] = useState<any>([]);
  const [playlists, setPlaylists] = useState<any>([]);

  const [showAll, setShowAll] = useState<ViewAllType | null>(null);
  const [lastId, setLastId] = useState(null);

  const getAlbumList = () => {
    if (lastId === null && newAlbums.length) {
      return;
    }
    axios
      .get(`${URL()}/claimableSongs/getAlbumList?pageSize=6&lastId=${lastId}`)
      .then(response => {
        if (response.data.success) {
          const albums = response.data.data.map(item => {
            return {
              ...item,
              Type: OpenType.Album,
            };
          });
          setNewAlbums([...newAlbums, ...albums]);
          setLastId(response.data.lastId);
        } else {
          console.log(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const loadPlaylists = () => {
    axios
      .get(`${URL()}/media/getPlaylists`)
      .then(async response => {
        const resp = response.data;
        if (resp.success) {
          const data = resp.data;
          const playlistsData = data.map(item => {
            return {
              ...item,
              id: item.Slug,
              Type: OpenType.Playlist,
            };
          });
          setPlaylists(playlistsData);
        }
      })
      .catch(error => { });
  };

  useEffect(() => {
    getAlbumList();
    loadPlaylists();
  }, []);

  const renderItem = (type: ViewAllType) => {
    if (type === ViewAllType.Album) {
      return (
        <MasonryGrid
          gutter={"30px"}
          data={showAll ? newAlbums : newAlbums.slice(0, 6)}
          renderItem={(item, index) => <AlbumCard item={item} key={`item-${index}`} />}
          columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
        />
      )
    } else if (type === ViewAllType.Discovery) {
      return (
        <MasonryGrid
          gutter={"30px"}
          data={showAll ? playlists : playlists.slice(0, 6)}
          renderItem={(item, index) => <PlaylistCard item={item} key={`item-${index}`} />}
          columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
        />
      )
    } else {
      return null;
    }
  }

  return (
    <div className={classes.pageHeader}>
      <div className={classes.content}>
        {showAll ? (
          <>
            <Box className={classes.pointer} display="flex" flexDirection="row" alignItems="center" onClick={() => setShowAll(null)} mb={3}>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Text ml={1.5}>Back</Text>
            </Box>
            <div className={classes.title}>
              {showAll}
            </div>
            <div className={classes.cards}>
              {renderItem(showAll)}
            </div>
          </>
        )
          :
          <>
            {Object.keys(ViewAllType).map((type, index) => (
              <div key={`view-cards-${index}`}>
                <div className={classes.title}>
                  {ViewAllType[type]}
                  <span onClick={() => setShowAll(ViewAllType[type])}>VIEW MORE</span>
                </div>
                <div className={classes.cards}>
                  {renderItem(ViewAllType[type])}
                </div>
              </div>
            ))}
          </>
        }
      </div>
    </div>
  );
}


const mockupRanking = [
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
]