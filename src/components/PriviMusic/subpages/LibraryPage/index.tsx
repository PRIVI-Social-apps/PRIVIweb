import React, { useEffect, useState } from "react";
import cls from "classnames";
import axios from "axios";

import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, withStyles } from "@material-ui/core";

import { priviMusicSubPageStyles } from "../index.styles";
import { actionsRowStyles } from "../../components/ActionsRow/index.styles";
import { COLUMNS_COUNT_BREAK_POINTS_SIX } from "../SearchPage";
import SubpageHeader from "../../components/SubpageHeader";
import { RightItemsActions } from "../../components/ActionsRow";
import ArtistCard from "../../components/Cards/ArtistCard";
import AlbumCard from "../../components/Cards/AlbumCard";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import { playlistMock, albumsMock, artistsMock } from "../../mockData";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";

const libraryTabs = ["Playlists", "Artists", "Albums", "Sort"];
const sortOptions = ["More relevants", "Recently heard", "Recently added", "Alphabetical order"];

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

export default function LibraryPage() {
  const classes = priviMusicSubPageStyles();
  const actionRowClasses = actionsRowStyles();

  const [libraryTab, setLibraryTab] = useState<number>(0);
  const [menuItem, setMenuItem] = useState<number>(0);

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [streamings, setStreamings] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);

  const getArtistList = () => {
    axios
      .get(`${URL()}/claimableSongs/getArtistList`)
      .then(response => {
        if (response.data.success) {
          const artists = response.data.data.map(item => {
            return {
              ...item,
              Type: OpenType.Artist,
            };
          });
          setArtists(artists);
        } else {
          console.log(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getAlbumList = () => {
    axios
      .get(`${URL()}/claimableSongs/getAlbumList`)
      .then(response => {
        if (response.data.success) {
          const albums = response.data.data.map(item => {
            return {
              ...item,
              Type: OpenType.Album,
            };
          });
          setAlbums(albums);
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
      .catch(error => {});
  };

  useEffect(() => {
    if (libraryTab === 0) {
      loadPlaylists();
    } else if (libraryTab === 1) {
      getArtistList();
    } else if (libraryTab === 2) {
      getAlbumList();
    }
  }, [libraryTab]);

  useEffect(() => {
    //TODO: sort
    if (menuItem === 0) {
      //Sort by more relevants
    } else if (menuItem === 1) {
      //Sort by recently heard
    } else if (menuItem === 2) {
      //Sort by recently added
    } else {
      //Sort by alphabetical order
      console.log(playlists, artists, albums);
      setPlaylists([...playlists.sort((a, b) => a.Title.localeCompare(b.Title))]);
      setArtists([...artists.sort((a, b) => a.artist_name.localeCompare(b.artist_name))]);
      setAlbums([...albums.sort((a, b) => a.album_name.localeCompare(b.album_name))]);
    }
  }, [menuItem]);

  const [openMenu, setOpenMenu] = React.useState(false);
  const anchorMenuRef = React.useRef<HTMLImageElement>(null);

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

  const handleFindStreamings = () => {};

  return (
    <div className={classes.page}>
      <SubpageHeader item={[]} />
      <div className={classes.content}>
        <Box
          display="flex"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={"32px"}
          className={actionRowClasses.actions}
        >
          <Box display="flex">
            {libraryTabs.map((tab, index) =>
              index !== libraryTabs.length - 1 ? (
                <div
                  key={`tab-${index}`}
                  className={cls({ [classes.selectedTab]: index === libraryTab }, classes.tab)}
                  onClick={() => {
                    setLibraryTab(index);
                  }}
                >
                  {tab}
                </div>
              ) : (
                <div>
                  <img
                    src={require("assets/icons/filters.png")}
                    alt="sort"
                    onClick={handleToggleMenu}
                    ref={anchorMenuRef}
                    style={{ cursor: "pointer" }}
                  />
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
                              {sortOptions.map((option, index) => (
                                <CustomMenuItem
                                  key={`option-${index}`}
                                  onClick={e => {
                                    setMenuItem(index);
                                    handleCloseMenu(e);
                                  }}
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    color={index === menuItem ? "#181818" : "#707582"}
                                  >
                                    {option}
                                    {index === menuItem && (
                                      <img src={require("assets/icons/check_dark.png")} alt="check" />
                                    )}
                                  </Box>
                                </CustomMenuItem>
                              ))}
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </div>
              )
            )}
          </Box>
          <RightItemsActions hours={5} />
        </Box>

        {libraryTab === 0
          ? playlists &&
            playlists.length > 0 && (
              <div className={classes.cards}>
                <MasonryGrid
                  gutter={"30px"}
                  data={playlists}
                  renderItem={(item, index) => <PlaylistCard item={item} key={`item-${index}`} />}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </div>
            )
          : libraryTab === 1
          ? artists &&
            artists.length > 0 && (
              <div className={classes.cards}>
                <MasonryGrid
                  gutter={"30px"}
                  data={artists}
                  renderItem={(item, index) => <ArtistCard item={item} key={`item-${index}`} />}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </div>
            )
          : albums &&
            albums.length > 0 && (
              <div className={classes.cards}>
                <MasonryGrid
                  gutter={"30px"}
                  data={albums}
                  renderItem={(item, index) => <AlbumCard item={item} key={`item-${index}`} />}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </div>
            )}
      </div>
    </div>
  );
}

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& img": {
      width: "10px",
      height: "7px",
      marginLeft: "15px",
    },
  },
})(MenuItem);
