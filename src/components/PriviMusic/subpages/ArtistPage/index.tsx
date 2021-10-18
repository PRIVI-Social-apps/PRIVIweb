import React, { useContext, useEffect, useState } from "react";
import cls from "classnames";
import getAverageColor from "get-average-color";
import axios from "axios";

import { Table, useMediaQuery, useTheme } from "@material-ui/core";

import { priviMusicSubPageStyles } from "../index.styles";
import MusicContext from "shared/contexts/MusicContext";
import { albumsMock, artistsMock } from "../../mockData";
import SongsRowHeader from "../../components/SongsRowHeader";
import SongRow from "../../components/SongRow";
import SubpageHeader from "../../components/SubpageHeader";
import ActionsRow from "../../components/ActionsRow";
import AlbumCard from "../../components/Cards/AlbumCard";
import ArtistCard from "../../components/Cards/ArtistCard";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import { useTypedSelector } from "store/reducers/Reducer";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { COLUMNS_COUNT_BREAK_POINTS_SIX } from "../SearchPage";
import URL from "shared/functions/getURL";
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

export default function ArtistPage() {
  const classes = priviMusicSubPageStyles();
  const user = useTypedSelector(state => state.user);

  const theme = useTheme();
  const simplified = useMediaQuery(theme.breakpoints.down("sm"));

  const [artist, setArtist] = useState<any>({ ImageUrl: "" });
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);

  const [color, setColor] = useState<string>("#ffffff");

  const { openTab } = useContext(MusicContext);

  useEffect(() => {
    loadPlaylists();
    getArtistList();
    getAlbumList();
  }, []);

  useEffect(() => {
    getArtistDetail();
  }, [openTab]);

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

  const getArtistDetail = () => {
    if (!openTab) {
      return;
    }
    axios
      .get(`${URL()}/claimableSongs/getArtistDetail?artistId=${openTab.id}`)
      .then(response => {
        if (response.data.success) {
          const artistData = response.data.data;
          setArtist(artistData);
          getAverageColor(artistData.artist_image).then(rgb => {
            if (rgb) {
              setColor(`rgba(${rgb.r},${rgb.g},${rgb.b},1)`);
            }
          });
        } else {
          console.log(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleFollowStreaming = () => {};

  const matchAlbums = React.useCallback(
    () =>
      albums
        .filter(el => {
          const songs = artist.songs;
          if (!songs) {
            return false;
          }
          if (songs.find(sEl => sEl.album_name === el.album_name)) {
            return true;
          } else {
            return false;
          }
        })
        .slice(0, 6),
    [albums, artist]
  );

  const matchPlaylists = React.useCallback(() => playlists.slice(0, 6), [playlists]);

  const matchArtists = React.useCallback(
    () => artists.filter(el => el.artist_name !== artist.artist_name).slice(0, 6),
    [artists, artist]
  );

  if (!artist?.artist_image) {
    return (
      <div className={classes.page}>
        <SubpageHeader
          item={{
            empty: true,
            Color: color,
          }}
        />
        <div className={classes.content} style={{ marginTop: "104px" }}>
          <div className={classes.empty}>Artist not found</div>
        </div>
      </div>
    );
  } else if (artist && ((artist.artist_image !== "" && color !== "#ffffff") || artist.artist_image === ""))
    return (
      <div className={classes.page}>
        <SubpageHeader item={{ ...artist, Color: color }} />
        <div className={classes.content}>
          <ActionsRow item={artist} setItem={setArtist} />
          <Table className={classes.table}>
            <SongsRowHeader simplified={simplified} />
            {artist.songs &&
              artist.songs.length > 0 &&
              artist.songs.map(
                (song, index) =>
                  index < 4 && <SongRow row={song} simplified={simplified} key={`song-${index}`} />
              )}
          </Table>

          <Box height="50px" />

          {matchAlbums() && matchAlbums().length > 0 && <div className={classes.title}>Albums</div>}
          {matchAlbums() && matchAlbums().length > 0 && (
            <div className={classes.cards}>
              <MasonryGrid
                gutter={"30px"}
                data={matchAlbums()}
                renderItem={(item, index) => <AlbumCard item={item} key={`item-${index}`} />}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
              />
            </div>
          )}

          {matchPlaylists() && matchPlaylists().length > 0 && <div className={classes.title}>Spotted On</div>}
          {matchPlaylists() && matchPlaylists().length > 0 && (
            <div className={classes.cards} style={{ justifyContent: "flex-start" }}>
              <MasonryGrid
                gutter={"30px"}
                data={matchPlaylists()}
                renderItem={(item, index) => <PlaylistCard item={item} key={`item-${index}`} />}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
              />
            </div>
          )}

          {matchArtists() && matchArtists().length > 0 && (
            <div className={classes.title}>You might be interested</div>
          )}
          {matchArtists() && matchArtists().length > 0 && (
            <div className={cls(classes.cards, classes.cardsHide)}>
              <MasonryGrid
                gutter={"30px"}
                data={matchArtists()}
                renderItem={(item, index) => <ArtistCard item={item} key={`item-${index}`} />}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
              />
            </div>
          )}

          <div className={classes.title}>Information</div>
          <div
            className={classes.artistInfo}
            style={{
              backgroundImage: artist.artist_image ? `url(${artist.artist_image})` : "none",
            }}
          >
            <div className={classes.filter}>
              <h4>
                {artist.monthlyListeners ? artist.monthlyListeners.toLocaleString() : 0} Monthly listeners
              </h4>

              {/* <p>
                {artist.About ??
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."}
              </p> */}
            </div>
          </div>

          {/* <div className={classes.title}>Follow Artist on:</div>
          <img
            src={require("assets/logos/privi_streaming.png")}
            alt="privi_streaming"
            className={classes.priviPlatform}
            onClick={handleFollowStreaming}
          /> */}
        </div>
      </div>
    );
  else return null;
}
