import React from "react";
type ContextType = {
  openTab: { type: OpenType; id: string | undefined; index: number } | null;
  setOpenTab: (state: { type: OpenType; id: string | undefined; index: number } | null) => void;
  selectedSong: any | null;
  setSelectedSong: (state: any | null) => void;
  songsList: any[] | [];
  setSongsList: (state: any[] | []) => void;
  history: any[] | [];
  setHistory: (state: any[] | []) => void;
};

const MusicContext: React.Context<ContextType> = React.createContext<ContextType>({
  openTab: null,
  setOpenTab: () => {},
  selectedSong: null,
  setSelectedSong: () => {},
  songsList: [],
  setSongsList: () => {},
  history: [],
  setHistory: () => {},
});

export enum OpenType {
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

export default MusicContext;
