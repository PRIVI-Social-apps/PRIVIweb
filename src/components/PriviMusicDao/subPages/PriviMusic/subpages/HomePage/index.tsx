import React, { useState, useEffect, useCallback } from "react";
import { Box, Grid } from "@material-ui/core";
import Pagination from '@material-ui/lab/Pagination';
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
import { Color, FontSize, PrimaryButton } from "shared/ui-kit";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";

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

enum ViewAllType {
  Album = "New Albums",
  Artist = "Featured Artirsts",
  Ranking = "World Ranking",
  Discovery = "Weekly Dicovery",
}

export default function HomePage() {
  const classes = priviMusicSubPageStyles();
  const commonClasses = priviMusicDaoPageStyles();

  const [newAlbums, setNewAlbums] = useState<any>([]);
  const [artists, setArtists] = useState<any>([]);
  const [rankings, setRankings] = useState<any>(mockupRanking);
  const [discovers, setDiscovers] = useState<any>([]);

  const [showAll, setShowAll] = useState<ViewAllType | null>(null);

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const fetchAlbumList = useCallback((pagination = 1) => {
    axios
      .get(`${URL()}/claimableSongs/getAlbumList?pageSize=18&lastId=${0}`) //FIXME: should be fixed once endpoint is updated
      .then(response => {
        if (response.data.success) {
          setNewAlbums(response.data.data.map(item => ({
            ...item,
            Type: OpenType.Album,
          })));
          setTotal(response.data.data.totalCount);
        } else {
          console.log(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const fetchArtistList = useCallback((pagination = 1) => {
    axios
      .get(`${URL()}/musicDao/home/getTopArtists/${pagination}`)
      .then(response => {
        if (response.data.success) {
          setArtists(response.data.data.topArtists.map((item: any) => ({
            ...item,
            Type: OpenType.Artist,
          })));
          setTotal(response.data.data.totalCount);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const fetchRankingList = useCallback((pagination = 1) => {
    axios
      .get(`${URL()}/musicDao/home/getTrendingSongs/${pagination}`)
      .then(response => {
        if (response.data.success) {
          setRankings(response.data.data.trendingSongs.map((item: any) => ({
            ...item,
            Type: OpenType.Playlist,
          })));
          setTotal(response.data.data.totalCount);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const fetchDiscoveryList = useCallback((pagination = 1) => {
    axios
      .get(`${URL()}/musicDao/home/getTrendingSongs/${pagination}`) //FIXME: should be fixed once endpoint is updated
      .then(response => {
        if (response.data.success) {
          setDiscovers(response.data.data.trendingSongs.map((item: any) => ({
            ...item,
            Type: OpenType.Playlist,
          })));
          setTotal(response.data.data.totalCount);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if(showAll === ViewAllType.Album) {
      fetchAlbumList(page);
    } else if (showAll === ViewAllType.Artist) {
      fetchArtistList(page);
    } else if (showAll === ViewAllType.Ranking) {
      fetchRankingList(page);
    } else if (showAll === ViewAllType.Discovery) {
      fetchDiscoveryList(page);
    } else {
      fetchAlbumList();
      fetchArtistList();
      fetchRankingList();
      fetchDiscoveryList();
    }
  }, [page, showAll]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const renderItem = (type: ViewAllType) => {
    const sliceSize = showAll ? 18 : 6;
    if (type === ViewAllType.Album) {
      return (
        <Grid
          container
          spacing={2}
        >
          {newAlbums.slice(0, sliceSize).map((album, index) => (
            <Grid key={`album-card-${index}`} item md={2} sm={3} xs={6}>
              <AlbumCard item={album} />
            </Grid>
          ))}
        </Grid>
      )
    } else if (type === ViewAllType.Artist) {
      return (
        <Grid
          container
          spacing={2}
        >
          {artists.slice(0, sliceSize).map((artist, index) => (
            <Grid key={`artist-card-${index}`} item md={2} sm={3} xs={6}>
              <ArtistCard item={artist} />
            </Grid>
          ))}
        </Grid>
      )
    } else if (type === ViewAllType.Ranking) {
      return (
        <Grid
          container
          spacing={2}
        >
          {rankings.slice(0, sliceSize).map((ranking, index) => (
            <Grid key={`ranking-card-${index}`} item md={2} sm={3} xs={6}>
              <RankingCard item={ranking} />
            </Grid>
          ))}
        </Grid>
      )
    } else if (type === ViewAllType.Discovery) {
      return (
        <Grid
          container
          spacing={2}
        >
          {discovers.slice(0, sliceSize).map((discover, index) => (
            <Grid key={`discover-card-${index}`} item md={2} sm={3} xs={6}>
              <PlaylistCard item={discover} />
            </Grid>
          ))}
        </Grid>
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
            <Box
              className={classes.pointer}
              display="flex"
              flexDirection="row"
              alignItems="center"
              mb={3}
              onClick={() => {
                setPage(1);
                setShowAll(null);
              }}
            >
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
            <Box display="flex" flexDirection="row" justifyContent="center" mt={5}>
              <Pagination count={Math.floor((total - 1) / 18) + 1} page={page} onChange={handleChange} />
            </Box>
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
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" className={`${commonClasses.sidebarFooter} ${commonClasses.bodyFooter}`}>
          <Box display="flex" flexDirection="row" alignItems="center" mt={2} mb={2}>
            <img src={require("assets/icons/flash.png")} alt="flash" />
            <Text bold color={Color.White} ml={1}>Privi Free Zone</Text>
            <Text size={FontSize.L} bold ml={1} color={Color.White}>
              02H 33M 45S Left
            </Text>
          </Box>
          <PrimaryButton size="medium" className={`${commonClasses.primaryButton} ${classes.moreButton}`}>
            Get more free music
          </PrimaryButton>
        </Box>
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
