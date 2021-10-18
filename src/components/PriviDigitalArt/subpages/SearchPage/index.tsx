import React, { useEffect, useState, useCallback } from "react";
import { useDebounce } from "use-debounce";
import cls from "classnames";
import axios from "axios";

import { subPageStyles } from '../index.styles';
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import ArtistCard from "components/PriviDigitalArt/components/Cards/ArtistCard";
import CollectionCard from "components/PriviDigitalArt/components/Cards/CollectionCard";
import DigitalArtCard from "components/PriviDigitalArt/components/Cards/DigitalArtCard";
import { CollectionsWax } from "components/legacy/Media/components/MediaFilters/collections";
import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import { initialDigitalArtFilters } from "shared/contexts/DigitalArtContext";
import { useMediaPreloader } from "components/legacy/Media/useMediaPreloader";
import { useTypedSelector } from "store/reducers/Reducer";
import { CircularLoadingIndicator } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';

const Tabs = ["Featured", "Artists", "Top Sellers", "Collections", "Top Collections"];

export default function SearchPage() {
  const classes = subPageStyles();

  const [value, setValue] = useState<string>("");
  const [searchValue] = useDebounce(value, 400);
  const user = useTypedSelector(state => state.user);

  const [filters, setFilters] = useState<any>(initialDigitalArtFilters);
  const { data, hasMore, loadMore } = useMediaPreloader(filters);

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [digitalArts, setDigitalArts] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const filteredArtists = React.useMemo(
    () => artists.filter(artist => artist.name.toLowerCase().includes(searchValue.toLowerCase())),
    [artists, searchValue]
  );
  const [collections, setCollections] = useState<any[]>([...CollectionsWax]);
  const filteredCollections = React.useMemo(
    () => collections.filter(collection => collection.name.toLowerCase().includes(searchValue.toLowerCase())),
    [collections, searchValue]
  );
  const [loadingArtists, setLoadingArtists] = useState<boolean>(false);
  const [lastId, setLastId] = useState<string>("null");
  const [topSellers, setTopSellers] = useState<any[]>([]);
  const [loadingTopSellers, setLoadingTopSellers] = useState<boolean>(false);
  const filteredTopSellers = React.useMemo(
    () => topSellers.filter(seller => seller.name.toLowerCase().includes(searchValue.toLowerCase())),
    [topSellers, searchValue]
  );

  useEffect(() => {
    setFilters({ ...filters, searchValue });
    if (selectedTab === 1) {
      setLastId("null");
      getArtists(true);
    }
  }, [searchValue]);

  useEffect(() => {
    if (data && data.length > 0) {
      let medias = [...data.map(item => item.media)];
      if (user.uninterestedMedias) {
        medias = medias.filter((item) => !user.uninterestedMedias?.includes(item.id));
      }
      setDigitalArts(medias);
    } else {
      setDigitalArts([]);
    }
  }, [data, user.uninterestedMedias]);

  const getArtists = useCallback(
    (isNew: boolean) => {
      if ((!isNew && !lastId) || loadingArtists) return;
      setLoadingArtists(true);
      axios
        .get(`${URL()}/artwork/getArtists?lastId=${isNew ? "null" : lastId}&searchValue=${searchValue}`)
        .then(res => {
          if (res.data.success) {
            setArtists(isNew ? res.data.data : artists.concat([...res.data.data]));
            setLastId(res.data.lastId);
          }
        })
        .catch(err => console.log(err))
        .finally(() => setLoadingArtists(false));
    },
    [lastId, searchValue, loadingArtists, setArtists, setLastId, setLoadingArtists]
  );

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 42) {
        if (hasMore && selectedTab === 0) loadMore();
        else if (selectedTab === 1) getArtists(false);
      }
    },
    [hasMore, loadMore, getArtists]
  );

  const getTopSellers = useCallback(() => {
    setLoadingTopSellers(true);
    axios
      .get(`${URL()}/artwork/topsellers`)
      .then(res => {
        if (res.data.success) setTopSellers(res.data.userList);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingTopSellers(false);
      });
  }, [setTopSellers, setLoadingTopSellers]);

  useEffect(() => {
    getArtists(true);
    getTopSellers();
  }, []);

  return (
    <div className={classes.page} onScroll={handleScroll}>
      <div className={classes.content}>
        <div className={classes.headerTitle}>✨ Search</div>
        <div className={classes.searcher}>
          <SearchWithCreate
            searchValue={value}
            handleSearchChange={e => {
              setValue(e.target.value);
            }}
            searchPlaceholder="Search Privi Art"
          />
        </div>
        <Box >
          <Box style={{ overflowX: 'scroll' }} mb={2}>
            <Box display="flex" width='600px' >
              {Tabs.map((tab, index) => (
                <div
                  key={`tab-${index}`}
                  className={cls({ [classes.selectedTab]: index === selectedTab }, classes.tab)}
                  onClick={() => {
                    setSelectedTab(index);
                  }}
                >
                  {tab}
                </div>
              ))}
            </Box>
          </Box>
          {selectedTab === 0 ? (
            <div className={classes.artCards}>
              <MasonryGrid
                gutter={"24px"}
                data={digitalArts}
                renderItem={(item, index) => (
                  <DigitalArtCard heightFixed={false} item={item} key={`item-${index}`} />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
              {hasMore && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 16,
                    paddingBottom: 16,
                  }}
                >
                  <CircularLoadingIndicator />
                </div>
              )}
            </div>
          ) : selectedTab === 1 ? (
            <div className={classes.artistCards}>
              <MasonryGrid
                gutter={"24px"}
                data={filteredArtists}
                renderItem={(item, index) => (
                  <ArtistCard item={item} key={`item-${index}`} currentIndex={index} />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
              {loadingArtists && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 16,
                    paddingBottom: 16,
                  }}
                >
                  <CircularLoadingIndicator />
                </div>
              )}
            </div>
          ) : selectedTab === 2 ? (
            <LoadingWrapper loading={loadingTopSellers}>
              <div className={classes.artistCards}>
                <MasonryGrid
                  gutter={"24px"}
                  data={filteredTopSellers}
                  renderItem={(item, index) => (
                    <ArtistCard item={item} key={`item-${index}`} currentIndex={index} />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                />
              </div>
            </LoadingWrapper>
          ) : selectedTab === 3 ? (
            filteredCollections && filteredCollections.length > 0 ? (
              <div className={classes.collectionCards}>
                <MasonryGrid
                  gutter={"24px"}
                  data={filteredCollections}
                  renderItem={(item, index) => (
                    <CollectionCard heightFixed={false} item={item} key={`item-${index}`} />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                />
              </div>
            ) : (
              <div className={classes.empty}>No results</div>
            )
          ) : filteredCollections && filteredCollections.length > 0 ? (
            <div className={classes.collectionCards}>
              <MasonryGrid
                gutter={"24px"}
                data={filteredCollections}
                renderItem={(item, index) => (
                  <CollectionCard heightFixed={false} item={item} key={`item-${index}`} />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            </div>
          ) : (
            <div className={classes.empty}>No results</div>
          )}
        </Box>
        {/* )} */}
      </div>
    </div>
  );
}

export const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  800: 2,
  1200: 3,
  1440: 4,
};
