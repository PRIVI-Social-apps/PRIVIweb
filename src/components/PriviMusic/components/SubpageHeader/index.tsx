import React, { useContext, useState } from "react";

import FreeZoneIndicator from "../FreeZoneIndicator";
import { subpageHeaderStyles } from "./index.styles";
import MusicContext from "shared/contexts/MusicContext";
import EditPlaylistModal from "../../modals/EditPlaylistModal";
import Box from "shared/ui-kit/Box";

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

export default function SubpageHeader({ item }) {
  const classes = subpageHeaderStyles();
  const { openTab, setOpenTab, history, setHistory } = useContext(MusicContext);

  const [openPlaylistModal, setOpenPlaylistModal] = useState<boolean>(false);

  const handleOpenEditPlaylistModal = () => {
    setOpenPlaylistModal(true);
  };
  const handleCloseEditPlaylistModal = () => {
    setOpenPlaylistModal(false);
  };

  if (openTab && item)
    return (
      <div className={classes.headerContainer}>
        {!item.empty && (
          <div
            className={classes.header}
            style={
              openTab.type === OpenType.Artist || openTab.type === OpenType.Playlist
                ? {
                    height: "310px",
                    minHeight: "310px",
                    maxHeight: "310px",
                    background: `linear-gradient(360deg, #ffffff -100%, ${item.Color} 100%)`,
                  }
                : openTab.type === OpenType.Album
                ? {
                    height: "310px",
                    minHeight: "310px",
                    maxHeight: "310px",
                    backgroundImage: item.album_image ? `url(${item.album_image})` : "none",
                  }
                : {
                    background: `linear-gradient(90deg, #43CEA2 -20%, #185A9D 100%)`,
                  }
            }
          >
            <div
              className={classes.filter}
              style={{
                backgroundColor:
                  openTab.type === OpenType.Album ||
                  openTab.type === OpenType.Playlist ||
                  openTab.type === OpenType.Artist
                    ? "rgba(0,0,0, 0.2)"
                    : "transparent",
              }}
            >
              {openTab.type === OpenType.Artist ? (
                <div
                  className={classes.albumImage}
                  style={{
                    backgroundImage: item.artist_image ? `url(${item.artist_image})` : "none",
                  }}
                />
              ) : openTab.type === OpenType.Playlist ? (
                <div
                  className={classes.albumImage}
                  style={{
                    backgroundImage: item.ImageUrl ? `url(${item.ImageUrl})` : "none",
                  }}
                />
              ) : null}
              <Box display="flex" flexDirection="column" color="white">
                {(openTab.type === OpenType.Album ||
                  openTab.type === OpenType.Playlist ||
                  openTab.type === OpenType.Artist) && (
                  <label>
                    {openTab.type === OpenType.Artist && item.verified && `VERIFIED `}
                    {openTab.type}
                    {openTab.type === OpenType.Artist && item.verified && (
                      <img src={require("assets/icons/check_white.png")} alt="check" />
                    )}
                  </label>
                )}
                {openTab.type === OpenType.Playlist && item.artist_name && (
                  <Box
                    display="flex"
                    alignItems="center"
                    color="white"
                    fontSize="14px"
                    marginBottom="16px"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setOpenTab({ type: OpenType.Artist, id: item.artist_name, index: history.length });
                      setHistory([
                        ...history,
                        { type: OpenType.Artist, id: item.artist_name, index: history.length },
                      ]);
                    }}
                  >
                    <div
                      className={classes.avatar}
                      style={{
                        backgroundImage: item.artist_image !== "" ? `url(${item.artist_image})` : "none",
                      }}
                    />
                    <b>{item.artist_name ?? "Artist Name"}</b>
                  </Box>
                )}
                <div className={classes.title}>
                  {openTab.type === OpenType.Album
                    ? item.album_name ?? "Album Title"
                    : openTab.type === OpenType.Playlist
                    ? item.Title ?? "Playlist Name"
                    : openTab.type === OpenType.Artist
                    ? item.artist_name ?? "Artist Name"
                    : openTab.type === OpenType.Liked
                    ? "Liked Content"
                    : openTab.type === OpenType.Library
                    ? "Library"
                    : openTab.type === OpenType.MyPlaylist
                    ? "My Playlist"
                    : "Queued"}
                </div>
                {openTab.type === OpenType.Album || openTab.type === OpenType.Artist ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    color="white"
                    fontSize="14px"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setOpenTab({ type: OpenType.Artist, id: item.artist_name, index: history.length });
                      setHistory([
                        ...history,
                        { type: OpenType.Artist, id: item.artist_name, index: history.length },
                      ]);
                    }}
                  >
                    <div
                      className={classes.avatar}
                      style={{
                        backgroundImage: item.artist_image ? `url(${item.artist_image})` : "none",
                      }}
                    />
                    {openTab.type === OpenType.Album ? (
                      <Box display="flex" alignItems="center">
                        <b>{item.artist_name ?? "Artist Name"}</b>
                        <span>·</span>
                        <span>{item.year ?? "unknown"}</span>
                        <span>·</span>
                        <span>{item.songs ? item.songs.length : "0"} songs</span>
                        <span>·</span>
                        <span>{item.duration}</span>
                      </Box>
                    ) : openTab.type === OpenType.Artist ? (
                      `${item.followers ? item.followers.length : 0} followers`
                    ) : null}
                  </Box>
                ) : openTab.type === OpenType.Library ||
                  openTab.type === OpenType.Liked ||
                  openTab.type === OpenType.Queue ? (
                  <span>{`${item.length ?? 0} songs`}</span>
                ) : openTab.type === OpenType.Playlist ? (
                  <button className={classes.transparentButton} onClick={handleOpenEditPlaylistModal}>
                    Edit Playlist
                  </button>
                ) : null}
              </Box>
            </div>
            {openTab.type === OpenType.Playlist && (
              <EditPlaylistModal
                playlist={item}
                open={openPlaylistModal}
                handleClose={handleCloseEditPlaylistModal}
                handleRefresh={itm => {
                  //if (setItem) {
                  // TODO: fix this
                  //setItem(itm);
                  //}
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  else return null;
}
