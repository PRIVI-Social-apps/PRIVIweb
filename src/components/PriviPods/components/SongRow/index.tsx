import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import cls from "classnames";

import {
  ClickAwayListener,
  createStyles,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  TableCell,
  TableRow,
  withStyles,
} from "@material-ui/core";

import { songRowStyles } from './index.styles';
import MusicContext from "shared/contexts/MusicContext";
import { queueMock, albumsMock, playlistMock } from "components/PriviPods/mockData";
import URL from "shared/functions/getURL";
import Box from 'shared/ui-kit/Box';

enum OpenType {
  Home = "HOME",
  Playlist = "PLAYLIST",
  Album = "ALBUM",
  Artist = "ARTIST",
  Liked = "LIKED",
  Library = "LIBRARY",
  Search = "SEARCH",
  Queue = "QUEUE",
}

export default function SongRow({ row, simplified }) {
  const classes = songRowStyles();
  const { setSelectedSong, selectedSong, openTab, setOpenTab, setSongsList, songsList } = useContext(MusicContext);

  const [album, setAlbum] = useState<any>({});

  const [duration, setDuration] = useState<string>("");
  const [playing, setPlaying] = useState<boolean>(false);

  const [openAddtoPlaylistModal, setOpenAddToPlaylistModal] = useState<boolean>(false);

  const [openMenu, setOpenMenu] = React.useState(false);
  const anchorMenuRef = React.useRef<HTMLButtonElement>(null);

  const [liked, setLiked] = useState<boolean>(false);

  const handleOpenAddToPlaylistModal = () => {
    setOpenAddToPlaylistModal(true);
  };

  const handleCloseAddToPlaylistModal = () => {
    setOpenAddToPlaylistModal(false);
  };

  const handleShare = () => {};

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleToggleMenu = e => {
    e.stopPropagation();
    e.preventDefault();
    setOpenMenu(prevMenuOpen => !prevMenuOpen);
  };

  const handleCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorMenuRef.current && anchorMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenMenu(false);
  };

  function handleListKeyDownMenu(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpenMenu(false);
    }
  }

  useEffect(() => {
    if (row.duration) {
      let hrs = Math.floor(row.duration / 3600);
      let min = Math.floor((row.duration % 3600) / 60);
      let sec = Math.floor(row.duration % 60);
      let strDur = "";
      if (hrs) {
        if (hrs < 10) strDur += "0";
        strDur += hrs.toString();
        strDur += ":";
      }
      if (min < 10) strDur += "0";
      strDur += min.toString();
      strDur += ":";
      if (sec < 10) strDur += "0";
      strDur += sec.toString();
      setDuration(strDur);
    }
    const fetchAlbumData = async () => {
      try {
        const response = await axios.get(`${URL()}/claimableSongs/getAlbumDetail?albumId=${row.album_name}`);
        if (response.data.success) {
          let albumData = response.data.data;
          setAlbum(albumData);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAlbumData();
  }, [row]);

  useEffect(() => {
    if (selectedSong && selectedSong.Url && row.Url && selectedSong.Url === row.Url) {
      if (selectedSong.playing) {
        setPlaying(true);
      } else {
        setPlaying(false);
      }
    }
  }, [selectedSong]);

  const handleSelectSong = () => {
    //find list where this song is stored
    //TODO: find album and load songs
    let album = albumsMock.find(a => openTab && a.id === openTab.id);
    if (openTab && openTab.type === OpenType.Liked) {
      //TODO: load liked songs
      setSongsList(queueMock);
    } else if (openTab && openTab.type === OpenType.Queue) {
      //TODO: load songs in queue
      setSongsList(queueMock);
    } else if (openTab && openTab.type === OpenType.Album) {
      if (album) {
        setSongsList(album.songs);
      }
    } else if (openTab && openTab.type === OpenType.Playlist) {
      //TODO: find album and load songs
      let playlist = playlistMock.find(p => p.id === openTab.id);
      if (playlist) setSongsList(playlist.Songs);
    }

    //set song
    if (!playing) {
      setSelectedSong({ ...row, ImageUrl: album?.ImageUrl ?? "", playing: true });
      setPlaying(true);
    } else {
      setSelectedSong({ ...row, ImageUrl: album?.ImageUrl ?? "", playing: false });
      setPlaying(false);
    }
  };

  const onAddToQueue = () => {
    if (!row) {
      return;
    }
    setSongsList([row, ...songsList]);
    setOpenTab({ type: OpenType.Queue, id: row.id, index: history.length });
  };

  return (
    <StyledTableRow className={cls({ selected: selectedSong && row.id === selectedSong.id }, classes.row)}>
      <StyledTableCell align="left">
        <Box display="flex" flexDirection="row" alignItems="center">
          <button onClick={handleSelectSong}>
            <img
              src={require(`assets/icons/${playing ? "pause_dark" : "play_dark_filled"}.png`)}
              alt="play"
            />
          </button>
          <div
            className={classes.songImage}
            style={{
              backgroundImage: album.album_image ? `url(${album.album_image})` : "none",
            }}
          />
          <Box display="flex" flexDirection="column" color="#181818">
            <Box fontSize={18}>{row.song_name ?? "Song Name"}</Box>
            <Box fontSize={14}>{row.artist_name ?? "Artist"}</Box>
          </Box>
        </Box>
      </StyledTableCell>
      <StyledTableCell align="center">
        {row.FreeZone && <img src={require("assets/icons/flash.png")} alt="flash" />}
        {`${row.priceToken ?? "ETH"} ${row.price ?? "N/A"}`} / per sec
      </StyledTableCell>

      {!simplified && (
        <StyledTableCell align="center">
          {row.NumViews
            ? `${
                row.NumViews > 1000000
                  ? (row.NumViews / 1000000).toFixed(1)
                  : row.NumViews > 1000
                  ? (row.NumViews / 1000).toFixed(1)
                  : row.NumViews.toFixed(1)
              } ${row.NumViews > 1000000 ? "M" : row.NumViews > 1000 ? "K" : ""}`
            : "N/A"}
        </StyledTableCell>
      )}
      <StyledTableCell align="center">{duration}</StyledTableCell>
      {!simplified && (
        <StyledTableCell align="right" style={{ width: "100px" }}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <button onClick={handleShare}>
              <img src={require("assets/icons/share_small.png")} alt="share" />
            </button>
            <button onClick={handleLike}>
              <img
                src={require(`assets/icons/${liked ? "heart_dark_filled" : "heart_dark"}.png`)}
                alt="like"
              />
            </button>

            <button onClick={handleToggleMenu} ref={anchorMenuRef} style={{ marginRight: 0 }}>
              <img src={require("assets/icons/menu_dots.png")} alt="open menu" />
            </button>

            <Popper
              open={openMenu}
              anchorEl={anchorMenuRef.current}
              transition
              disablePortal
              style={{ position: "inherit", zIndex: 3 }}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                    position: "inherit",
                  }}
                >
                  <Paper className={classes.paper}>
                    <ClickAwayListener onClickAway={handleCloseMenu}>
                      <MenuList
                        autoFocusItem={openMenu}
                        id="menu-list-grow"
                        onKeyDown={handleListKeyDownMenu}
                      >
                        <CustomMenuItem onClick={onAddToQueue}>Add to play queue</CustomMenuItem>
                        <CustomMenuItem onClick={() => {}}>Go to Artist</CustomMenuItem>
                        <CustomMenuItem onClick={() => {}}>Go to Album</CustomMenuItem>
                        <CustomMenuItem onClick={() => {}}>Save to Like</CustomMenuItem>
                        <CustomMenuItem onClick={() => {}}>Remove from this Playlist</CustomMenuItem>
                        <CustomMenuItem onClick={() => {}}>
                          Add to Playlist
                          <img src={require("assets/icons/arrow.png")} alt="arrow" style={{ width: "5px" }} />
                        </CustomMenuItem>
                        <CustomMenuItem onClick={() => {}}>
                          Share
                          <img src={require("assets/icons/arrow.png")} alt="arrow" style={{ width: "5px" }} />
                        </CustomMenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>
        </StyledTableCell>
      )}
    </StyledTableRow>
  );
}

const StyledTableCell = withStyles(() =>
  createStyles({
    root: {
      borderBottom: "none",
      fontFamily: "Agrandir",
      fontSize: "18px",
      color: "#181818",
      margin: "16px 0px",
      "&.selected": {
        background: "#f7f9fe",
      },
    },
  })
)(TableCell);

const StyledTableRow = withStyles(() =>
  createStyles({
    root: {
      borderBottom: "none",
      padding: "0px 16px",
      fontFamily: "Agrandir",
      "&.selected": {
        background: "#f7f9fe",
      },
    },
  })
)(TableRow);

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
    color: "#181818",
    display: "flex",
    justifyContent: "space-between",
  },
})(MenuItem);
