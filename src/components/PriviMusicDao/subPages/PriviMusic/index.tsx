import React, { useState } from "react";

import { priviMusicStyles } from "./index.styles";
import Player from "./components/Player";
import Sidebar from "./components/Sidebar";
import MusicContext from "shared/contexts/MusicContext";
import AlbumPage from "./subpages/AlbumPage";
import ArtistPage from "./subpages/ArtistPage";
import HomePage from "./subpages/HomePage";
import LibraryPage from "./subpages/LibraryPage";
import LikedPage from "./subpages/LikedPage";
import PlaylistPage from "./subpages/PlaylistPage";
import MyPlaylistPage from "./subpages/MyPlaylistPage";
import QueuePage from "./subpages/QueuePage";
import SearchPage from "./subpages/SearchPage";
import FruitPage from "./subpages/Fruit";

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

export default function PriviMusic() {
  const classes = priviMusicStyles();
  const [openTab, setOpenTab] = useState<any>({ type: OpenType.Home, id: undefined, index: 0 });
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [songsList, setSongsList] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([{ type: OpenType.Home, id: undefined, index: 0 }]);

  const [freeMusicTime, setFreeMusicTime] = useState<number>(14400);

  console.log('-openTab.type', openTab.type)
  
  return (
    <MusicContext.Provider
      value={{
        openTab: openTab,
        setOpenTab: setOpenTab,
        selectedSong: selectedSong,
        setSelectedSong: setSelectedSong,
        songsList: songsList,
        setSongsList: setSongsList,
        history: history,
        setHistory: setHistory,
      }}
    >
      <div className={classes.priviMusic}>
        <div className={classes.contentContainer}>
          <Sidebar seconds={freeMusicTime}/>
          <div className={classes.mainContainer}>
            {/* <div className={classes.arrows}>
              <button
                onClick={() => {
                  let currentIndex = history.findIndex(h => h.index === openTab.index);
                  if (currentIndex !== -1) {
                    setOpenTab(history[currentIndex - 1]);
                  }
                }}
                disabled={history.length === 0 || history.findIndex(h => h.index === openTab.index) - 1 < 0}
              >
                <img src={require(`assets/icons/arrow.png`)} />
              </button>

              <button
                onClick={() => {
                  let currentIndex = history.findIndex(h => h.index === openTab.index);
                  if (currentIndex !== -1) {
                    setOpenTab(history[currentIndex + 1]);
                  }
                }}
                disabled={
                  history.length === 0 ||
                  history.findIndex(h => h.index === openTab.index) + 1 >= history.length
                }
              >
                <img src={require(`assets/icons/arrow.png`)} />
              </button>
            </div> */}
            <div
              className={classes.content}
              style={{
                maxHeight: "calc(100vh - 120px - 104px)",
                marginTop: 0,
              }}
            >
              {openTab.type === OpenType.Home ? (
                <HomePage />
              ) : openTab.type ? (
                openTab.type === OpenType.Album ? (
                  <AlbumPage />
                ) : openTab.type === OpenType.Artist ? (
                  <ArtistPage />
                ) : openTab.type === OpenType.Library ? (
                  <LibraryPage />
                ) : openTab.type === OpenType.Search ? (
                  <SearchPage />
                ) : openTab.type === OpenType.Liked ? (
                  <LikedPage />
                ) : openTab.type === OpenType.Playlist ? (
                  <PlaylistPage />
                ) : openTab.type === OpenType.MyPlaylist ? (
                  <MyPlaylistPage />
                ) : openTab.type === OpenType.Fruit ? (
                  <FruitPage />
                ) : (
                  <QueuePage />
                )
              ) : null}
            </div>
          </div>
        </div>
        <Player seconds={freeMusicTime} setSeconds={(scnds) => setFreeMusicTime(scnds)}/>
      </div>
    </MusicContext.Provider>
  );
}
