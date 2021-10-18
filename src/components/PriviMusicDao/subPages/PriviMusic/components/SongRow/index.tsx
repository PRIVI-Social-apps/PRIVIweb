import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import cls from "classnames";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";

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

import { songRowStyles } from "./index.styles";
import MusicContext from "shared/contexts/MusicContext";
import { queueMock, albumsMock, playlistMock } from "../../mockData";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { AddPlayListIcon, AddQueueIcon, AlbumIcon, ArtistIcon, RemovePlayListIcon, CopyAddressIcon, DownloadQRIcon, FaceBookShareIcon, InstagramShareIcon, SongShareIcon, TwitterShareIcon } from "components/PriviMusicDao/components/Icons/SvgIcons";

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

export default function SongRow({ row, simplified }) {
  const userSelector = useSelector((state: RootState) => state.user);
  const classes = songRowStyles();
  const {
    setSelectedSong,
    selectedSong,
    openTab,
    setOpenTab,
    setSongsList,
    songsList,
    history,
    setHistory,
  } = useContext(MusicContext);

  const [album, setAlbum] = useState<any>({});

  const [duration, setDuration] = useState<string>("");
  const [playing, setPlaying] = useState<boolean>(false);

  const [openAddtoPlaylistModal, setOpenAddToPlaylistModal] = useState<boolean>(false);

  const [fruitOpenMenu, setFruitOpenMenu] = useState<boolean>(false);
  const anchorFruitMenuRef = useRef<HTMLButtonElement>(null);

  const [shareOpenMenu, setShareOpenMenu] = useState<boolean>(false);
  const anchorShareMenuRef = useRef<HTMLButtonElement>(null);

  const [openSettingMenu, setOpenSettingMenu] = useState(false);
  const anchorSettingMenuRef = useRef<HTMLButtonElement>(null);

  const [liked, setLiked] = useState<boolean>(row.Likes ? row.Likes.includes(userSelector.id) : false);

  const handleOpenAddToPlaylistModal = () => {
    setOpenAddToPlaylistModal(true);
  };

  const handleCloseAddToPlaylistModal = () => {
    setOpenAddToPlaylistModal(false);
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(`${URL()}/claimableSongs/likeNFT`, {
        userId: userSelector.id,
        mediaSymbol: row.song_name,
      });
      if (response.data.success) {
        setLiked(!liked);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFruitCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorFruitMenuRef.current && anchorFruitMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setFruitOpenMenu(false);
  };

  const handleListKeyDownFruitMenu = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setFruitOpenMenu(false);
    }
  };

  const handleShareCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setShareOpenMenu(false);
  };

  const handleListKeyDownShareMenu = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setShareOpenMenu(false);
    }
  };

  const handleCloseSettingMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorSettingMenuRef.current && anchorSettingMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenSettingMenu(false);
  };

  function handleListKeyDownSettingMenu(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpenSettingMenu(false);
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
    if (selectedSong && selectedSong.url && row.url) {
      if(selectedSong.url !== row.url) {
        setPlaying(false);
      } else {
        if (selectedSong.playing) {
          setPlaying(true);
        } else {
          setPlaying(false);
        }
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
    setHistory([...history, { type: OpenType.Queue, id: row.id, index: history.length }]);
  };

  const onGoToArtist = () => {
    if (!row) {
      return;
    }
    setOpenTab({ type: OpenType.Artist, id: row.artist_name, index: history.length });
    setHistory([...history, { type: OpenType.Artist, id: row.artist_name, index: history.length }]);
  };

  const onGoToAlbum = () => {
    if (!row) {
      return;
    }
    setOpenTab({ type: OpenType.Album, id: row.album_name, index: history.length });
    setHistory([...history, { type: OpenType.Album, id: row.album_name, index: history.length }]);
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
        {album.album_name}
      </StyledTableCell>

      {!simplified && (
        <StyledTableCell align="center">
          {row.NumViews
            ? `${row.NumViews > 1000000
              ? (row.NumViews / 1000000).toFixed(1)
              : row.NumViews > 1000
                ? (row.NumViews / 1000).toFixed(1)
                : row.NumViews
            } ${row.NumViews > 1000000 ? "M" : row.NumViews > 1000 ? "K" : ""}`
            : "N/A"}
        </StyledTableCell>
      )}
      <StyledTableCell align="center">{duration}</StyledTableCell>
      {!simplified && (
        <StyledTableCell align="right" style={{ width: "100px" }}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <button ref={anchorShareMenuRef} onClick={() => setShareOpenMenu(true)}>
              <img src={require(`assets/musicDAOImages/upload.png`)} alt="like" />
            </button>
            <Popper
              open={shareOpenMenu}
              anchorEl={anchorShareMenuRef.current}
              transition
              disablePortal={false}
              placement="bottom"
              style={{ position: "inherit" }}
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                  <Paper className={classes.paper}>
                    <ClickAwayListener onClickAway={handleShareCloseMenu}>
                      <MenuList
                        autoFocusItem={shareOpenMenu}
                        id="share-menu-list-grow"
                        onKeyDown={handleListKeyDownShareMenu}
                      >
                        <MenuItem>
                          <TwitterShareIcon />
                          Share on Twitter
                        </MenuItem>
                        <MenuItem>
                          <FaceBookShareIcon />
                          Share on Facebook
                        </MenuItem>
                        <MenuItem>
                          <InstagramShareIcon />
                          Share on Instagram
                        </MenuItem>
                        <MenuItem>
                          <SongShareIcon />
                          Copy song link
                        </MenuItem>
                        <MenuItem>
                          <DownloadQRIcon />
                          Download QR code
                        </MenuItem>
                        <MenuItem>
                          <CopyAddressIcon />
                          Copy address
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            <button ref={anchorFruitMenuRef} onClick={() => setFruitOpenMenu(true)}>
              <img width={30} src={require(`assets/musicDAOImages/trending.png`)} alt="like" />
            </button>
            <Popper
              open={fruitOpenMenu}
              anchorEl={anchorFruitMenuRef.current}
              transition
              disablePortal={false}
              placement="bottom"
              style={{ position: "inherit" }}
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                  <Paper className={classes.paper}>
                    <ClickAwayListener onClickAway={handleFruitCloseMenu}>
                      <MenuList
                        autoFocusItem={fruitOpenMenu}
                        id="fruit-menu-list-grow"
                        onKeyDown={handleListKeyDownFruitMenu}
                      >
                        <MenuItem>
                          🍉 02
                        </MenuItem>
                        <MenuItem>
                          🥑 30
                        </MenuItem>
                        <MenuItem>
                          🍊 137
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            <button ref={anchorSettingMenuRef} onClick={() => setOpenSettingMenu(true)}>
              <img src={require("assets/icons/menu_dots.png")} alt="open menu" />
            </button>
            <Popper
              open={openSettingMenu}
              anchorEl={anchorSettingMenuRef.current}
              transition
              disablePortal={false}
              placement="bottom"
              style={{ position: "inherit" }}
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                  <Paper className={classes.paper}>
                    <ClickAwayListener onClickAway={handleCloseSettingMenu}>
                      <MenuList
                        autoFocusItem={openSettingMenu}
                        id="setting-menu-list-grow"
                        onKeyDown={handleListKeyDownSettingMenu}
                      >
                        <MenuItem onClick={onAddToQueue}>
                          <AddQueueIcon />
                          Add to play queue
                        </MenuItem>
                        <MenuItem onClick={onGoToArtist}>
                          <ArtistIcon />
                          Go to Artist
                        </MenuItem>
                        <MenuItem onClick={onGoToAlbum}>
                          <AlbumIcon />
                          Go to Album
                        </MenuItem>
                        <MenuItem>
                          <RemovePlayListIcon />
                          Remove from this Playlist
                        </MenuItem>
                        <MenuItem>
                          <AddPlayListIcon />
                          Add to Playlist
                        </MenuItem>
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