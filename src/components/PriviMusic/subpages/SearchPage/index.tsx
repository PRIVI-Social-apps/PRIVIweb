import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import cls from "classnames";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";

import { Grid } from "@material-ui/core";

import { priviMusicSubPageStyles } from "../index.styles";
import ArtistCard from "../../components/Cards/ArtistCard";
import MusicContext from "shared/contexts/MusicContext";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import AlbumCard from "../../components/Cards/AlbumCard";
import GenreCard from "../../components/Cards/GenreCard";
import ExploreCard from "../../components/Cards/ExploreCard";
import SongRow from "../../components/SongRow";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { useTypedSelector } from "store/reducers/Reducer";

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

export default function SearchPage() {
  const classes = priviMusicSubPageStyles();
  const { openTab } = useContext(MusicContext);
  const user = useTypedSelector(state => state.user);

  const [searchValue, setSearchValue] = useState<string>(openTab && openTab.id ? openTab.id : "");
  const [isSearched, setSearched] = useState<boolean>(false);

  const getSongList = () => {
    axios
      .get(`${URL()}/claimableSongs/getSongList`)
      .then(response => {
        if (response.data.success) {
          const songs = response.data.data;
          setSongs(songs);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

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
          artists.sort((a, b) => a.artist_name.localeCompare(b.artist_name))
          setArtists(artists);
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
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getGenresList = () => {
    axios
      .get(`${URL()}/claimableSongs/getGenreList`)
      .then(response => {
        if (response.data.success) {
          const genres = response.data.data;
          setGenres(genres);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getTopGenresList = () => {
    axios
      .get(`${URL()}/claimableSongs/getTopGenreList?userId=${user.id}`)
      .then(response => {
        if (response.data.success) {
          const data = response.data.data;
          console.log("-genres", genres);
          setTopGenres(genres.filter(el => data.includes(el.genres)));
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

  const getRecentSearches = () => {
    axios
      .get(`${URL()}/claimableSongs/recentSearch?userId=${user.id}`)
      .then(response => {
        if (response.data.success) {
          const recentKey = response.data.data;
          if (recentKey) {
            setRecentSearches([
              ...albums
                .filter(a => a.album_name && a.album_name.toUpperCase().includes(recentKey.toUpperCase()))
                .slice(0, 2),
              ...artists
                .filter(a => a.artist_name && a.artist_name.toUpperCase().includes(recentKey.toUpperCase()))
                .slice(0, 2),
              ...playlists
                .filter(a => a.Title && a.Title.toUpperCase().includes(recentKey.toUpperCase()))
                .slice(0, 2),
            ]);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const [recentSearches, setRecentSearches] = useState<any[]>([]);

  const [topGenres, setTopGenres] = useState<any[]>([]);
  const explore = [
    { genres: "Pop" },
    { genres: "Hip-Hop/Rap" },
    { genres: "Dance" },
    { genres: "Electronic" },
    { genres: "R&B/Soul" },
    { genres: "Alternative" },
    { genres: "Rock" },
    { genres: "Latin" },
    { genres: "Film, TV & Stage" },
    { genres: "Country" },
    { genres: "AfroBeats" },
    { genres: "Worldwide" },
    { genres: "Reggae/Dancehall" },
    { genres: "House" },
    { genres: "K-Pop" },
    { genres: "French Pop" },
    { genres: "Singer/Songwriter" },
    { genres: "Regional Mexicano" },
  ];

  const [mainResult, setMainResult] = useState<any>({});
  const [songs, setSongs] = useState<any[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<any[]>([]);
  const [withArtistName, setWithArtistName] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [filteredGenres, setFilteredGenres] = useState<any[]>([]);

  const [showMoreArtists, setShowMoreArtists] = useState<boolean>(false);
  const [showMorePlaylists, setShowMorePlaylists] = useState<boolean>(false);
  const [showMoreAlbums, setShowMoreAlbums] = useState<boolean>(false);
  const [showMoreGenres, setShowMoreGenres] = useState<boolean>(false);
  const userSelector = useSelector((state: RootState) => state.user);

  const handleClearHistory = () => {
    setRecentSearches([]);
  };

  useEffect(() => {
    getSongList();
    getAlbumList();
    getArtistList();
    loadPlaylists();
    getGenresList();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (!albums.length && !artists.length && !playlists.length) {
      return;
    }
    getRecentSearches();
  }, [user, albums, artists, playlists]);
  useEffect(() => {
    if (!user || !genres.length) {
      return;
    }
    getTopGenresList();
  }, [user, genres]);

  const onSearch = () => {
    if (searchValue && searchValue !== "") {
      setMainResult(
        artists.find(a => a.artist_name && a.artist_name.toUpperCase().includes(searchValue.toUpperCase()))
      );
      setFilteredAlbums(
        albums.filter(a => a.album_name && a.album_name.toUpperCase().includes(searchValue.toUpperCase()))
      );
      setFilteredArtists(
        artists.filter(a => a.artist_name && a.artist_name.toUpperCase().includes(searchValue.toUpperCase()))
      );
      setFilteredGenres(
        genres.filter(a => a.genres && a.genres.toUpperCase().includes(searchValue.toUpperCase()))
      );
      setFilteredPlaylists(
        playlists.filter(a => a.Title && a.Title.toUpperCase().includes(searchValue.toUpperCase()))
      );
      setFilteredSongs(
        songs.filter(a => a.song_name && a.song_name.toUpperCase().includes(searchValue.toUpperCase()))
      );
      setWithArtistName([
        ...albums.filter(a => a.artist_name.includes(searchValue.toUpperCase())),
        ...playlists.filter(
          a => a.Artist && a.Artist.Name && a.Artist.Name.toUpperCase().includes(searchValue.toUpperCase())
        ),
      ]);
      if (!isSearched) setSearched(true);
      axios
        .post(`${URL()}/claimableSongs/searchNFT`, {
          userId: userSelector.id,
          keyword: searchValue,
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      setFilteredAlbums(albums);
      setFilteredArtists(artists);
      setFilteredGenres(genres);
      setFilteredPlaylists(playlists);
      setFilteredSongs(songs);
    }
  };

  return (
    <div className={classes.pageHeader}>
      <div className={classes.content}>
        <Box display="flex">
          <div className={classes.searcher}>
            <SearchWithCreate
              searchValue={searchValue}
              handleSearchChange={e => {
                setSearchValue(e.target.value);
              }}
              searchPlaceholder="Search Privi Music"
              onSearch={onSearch}
            />
          </div>
        </Box>
        {!isSearched ? (
          <div>
            {recentSearches && recentSearches.length > 0 && (
              <div className={classes.title}>
                Recent searches
                <span onClick={handleClearHistory}>CLEAR SEARCH HISTORY</span>
              </div>
            )}
            {recentSearches && recentSearches.length > 0 && (
              <div className={cls(classes.cardsHide, classes.cards)}>
                <MasonryGrid
                  gutter={"30px"}
                  data={recentSearches}
                  renderItem={(item, index) =>
                    item.Type === OpenType.Playlist ? (
                      <PlaylistCard item={item} key={`item-${index}`} />
                    ) : item.Type === OpenType.Album ? (
                      <AlbumCard item={item} key={`item-${index}`} />
                    ) : (
                      <ArtistCard item={item} key={`item-${index}`} />
                    )
                  }
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </div>
            )}

            {topGenres && topGenres.length > 0 && (
              <div className={classes.title}>Your most listened genres</div>
            )}
            {topGenres && topGenres.length > 0 && (
              <div className={cls(classes.genreCardsHide, classes.genreCards)}>
                <MasonryGrid
                  gutter={"30px"}
                  data={topGenres}
                  renderItem={(item, index) => <GenreCard item={item} size="large" key={`genre-${index}`} />}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                />
              </div>
            )}
            {explore && explore.length > 0 && <div className={classes.title}>Explore all</div>}
            {explore && explore.length > 0 && (
              <div className={classes.exploreCards}>
                <MasonryGrid
                  gutter={"30px"}
                  data={explore}
                  renderItem={(item, index) => (
                    <GenreCard item={item} size="small" key={`explore-${index}`} />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <Grid container direction="row" spacing={2} style={{ marginBottom: "48px" }}>
              <Grid item xs={3}>
                <div className={classes.title}>Main result</div>
                {mainResult ? (
                  mainResult.Type === OpenType.Playlist || mainResult.Type === OpenType.Album ? (
                    <AlbumCard item={mainResult} />
                  ) : (
                    <ArtistCard item={mainResult} />
                  )
                ) : null}
              </Grid>
              <Grid item xs={9}>
                <div className={classes.title}>
                  Songs <span onClick={handleClearHistory}>CLEAR SEARCH HISTORY</span>
                </div>
                <Box display="flex" flexDirection="column" width="100%">
                  {filteredSongs &&
                    filteredSongs.length > 0 &&
                    filteredSongs
                      .filter((s, i) => i < 4)
                      .map((song, index) => <SongRow row={song} simplified={true} key={`row-${index}`} />)}
                </Box>
              </Grid>
            </Grid>
            {withArtistName && withArtistName.length > 0 && (
              <div className={classes.title}>With artist name</div>
            )}
            {withArtistName && withArtistName.length > 0 && (
              <div className={cls(classes.cardsHide, classes.cards)}>
                <MasonryGrid
                  gutter={"30px"}
                  data={withArtistName}
                  renderItem={(item, index) => <AlbumCard item={item} key={`item-${index}`} />}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </div>
            )}

            {filteredArtists && filteredArtists.length > 0 && (
              <div className={classes.title}>
                Artists{" "}
                <span onClick={() => setShowMoreArtists(!showMoreArtists)}>
                  {showMoreArtists ? "HIDE" : "VIEW MORE"}
                </span>
              </div>
            )}
            {filteredArtists && filteredArtists.length > 0 && (
              <div className={cls({ [classes.cardsHide]: !showMoreArtists }, classes.cards)}>
                <MasonryGrid
                  gutter={"30px"}
                  data={filteredArtists}
                  renderItem={(item, index) => <ArtistCard item={item} key={`item-${index}`} />}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </div>
            )}

            {filteredAlbums && filteredAlbums.length > 0 && (
              <div className={classes.title}>
                Albums{" "}
                <span onClick={() => setShowMoreAlbums(!showMoreAlbums)}>
                  {showMoreAlbums ? "HIDE" : "VIEW MORE"}
                </span>
              </div>
            )}
            {filteredAlbums && filteredAlbums.length > 0 && (
              <div className={cls({ [classes.cardsHide]: !showMoreAlbums }, classes.cards)}>
                {" "}
                <MasonryGrid
                  gutter={"30px"}
                  data={filteredAlbums}
                  renderItem={(item, index) => <AlbumCard item={item} key={`item-${index}`} />}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </div>
            )}

            {filteredPlaylists && filteredPlaylists.length > 0 && (
              <div className={classes.title}>
                Playlists{" "}
                <span onClick={() => setShowMorePlaylists(!showMorePlaylists)}>
                  {showMorePlaylists ? "HIDE" : "VIEW MORE"}
                </span>
              </div>
            )}
            {filteredPlaylists && filteredPlaylists.length > 0 && (
              <div className={cls({ [classes.cardsHide]: !showMorePlaylists }, classes.cards)}>
                <MasonryGrid
                  gutter={"30px"}
                  data={filteredPlaylists}
                  renderItem={(item, index) => <PlaylistCard item={item} key={`item-${index}`} />}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </div>
            )}

            {filteredGenres && filteredGenres.length > 0 && (
              <div className={classes.title}>
                Genres
                <span onClick={() => setShowMoreGenres(!showMoreGenres)}>
                  {showMoreGenres ? "HIDE" : "VIEW MORE"}
                </span>
              </div>
            )}
            {filteredGenres && filteredGenres.length > 0 && (
              <div className={cls({ [classes.genreCardsHide]: !showMoreGenres }, classes.genreCards)}>
                <MasonryGrid
                  gutter={"30px"}
                  data={filteredGenres}
                  renderItem={(item, index) => <GenreCard item={item} size="large" key={`genre-${index}`} />}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const COLUMNS_COUNT_BREAK_POINTS_SIX = {
  400: 1,
  570: 2,
  700: 3,
  800: 4,
  1200: 5,
  1440: 6,
};

const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  675: 1,
  900: 2,
  1440: 3,
};
