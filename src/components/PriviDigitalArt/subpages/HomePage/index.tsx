import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import cls from "classnames";

import { subPageStyles } from "../index.styles";
import { COLUMNS_COUNT_BREAK_POINTS_FOUR } from "../SearchPage/index";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { VirtualizedMasnory } from "shared/ui-kit/VirtualizedMasnory";
import ArtistCard from "components/PriviDigitalArt/components/Cards/ArtistCard";
import CollectionCard from "components/PriviDigitalArt/components/Cards/CollectionCard";
import DigitalArtCard from "components/PriviDigitalArt/components/Cards/DigitalArtCard";
import { CollectionsWax } from "components/legacy/Media/components/MediaFilters/collections";
import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { useTypedSelector } from "store/reducers/Reducer";
import { ARTWORK_MEDIA_TYPES } from "components/PriviDigitalArt/productUtils";
import Box from "shared/ui-kit/Box";

export default function HomePage() {
  const classes = subPageStyles();
  const scrollRef = React.useRef<any>();

  const [showMoreArtists, setShowMoreArtists] = useState<boolean>(false);
  const [showMoreCollections, setShowMoreCollections] = useState<boolean>(false);
  const [showMoreDigitalArts, setShowMoreDigitalArts] = useState<boolean>(false);
  const [loadingTopSellers, setLoadingTopSellers] = useState<boolean>(false);
  const [loadingDigitalArtsForFirstTime, setLoadingDigitalArtsForFirstTime] = useState<boolean>(true);
  const [loadingDigitalArts, setLoadingDigitalArts] = useState<boolean>(false);
  const user = useTypedSelector(state => state.user);
  const userId = React.useMemo(() => (user ? user.id : null), [user]);
  const [artists, setArtists] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([...CollectionsWax]);
  const [digitalArts, setDigitalArts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);

  const getTopSellers = useCallback(() => {
    setLoadingTopSellers(true);
    axios
      .get(`${URL()}/artwork/topsellers`)
      .then(res => {
        if (res.data.success) setArtists(res.data.userList);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingTopSellers(false);
      });
  }, []);

  const getDigitalArts = useCallback(
    offset => {
      if (!userId || loadingDigitalArts) return;
      const config = {
        params: {
          offset,
          limit: 10,
        },
      };
      setLoadingDigitalArts(true);
      axios
        .post(
          `${URL()}/media/getUserMediasByType`,
          {
            userId: userId,
            mediaTypes: ARTWORK_MEDIA_TYPES,
          },
          config
        )
        .then(res => {
          if (res.data.success) {
            setDigitalArts(digitalArts => [...digitalArts, ...res.data.data]);
            setHasMore(res.data.hasMore);
            setOffset(offset + res.data.data.length);
          }
        })
        .catch(err => console.log(err))
        .finally(() => {
          setLoadingDigitalArtsForFirstTime(false);
          setLoadingDigitalArts(false);
        });
    },
    [userId, loadingDigitalArts]
  );

  useEffect(() => {
    getTopSellers();
  }, []);

  useEffect(() => {
    getDigitalArts(0);
  }, [userId]);

  return (
    <div className={classes.page} ref={scrollRef}>
      <div className={classes.content}>
        <div className={classes.title}>
          ✨ Top Sellers
          {!loadingTopSellers && artists && artists.length > 0 && (
            <span
              onClick={() => {
                setShowMoreArtists(!showMoreArtists);
              }}
            >
              {showMoreArtists ? "HIDE" : "VIEW MORE"}
            </span>
          )}
        </div>
        <LoadingWrapper loading={loadingTopSellers}>
          {artists && artists.length > 0 ? (
            <div className={cls({ [classes.artistCardsHide]: !showMoreArtists }, classes.artistCards)}>
              <MasonryGrid
                gutter={"24px"}
                data={artists}
                renderItem={(item, index) => (
                  <ArtistCard item={item} key={`item-${index}`} currentIndex={index} />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            </div>
          ) : (
            <div className={classes.artistCardsHide}>
              <Box display="flex" justifyContent="center" mb={3}>
                No items found
              </Box>
            </div>
          )}
        </LoadingWrapper>

        <div className={classes.title}>
          ✨ Top Collections
          {collections && collections.length > 0 && (
            <span
              onClick={() => {
                setShowMoreCollections(!showMoreCollections);
              }}
            >
              {showMoreCollections ? "HIDE" : "VIEW MORE"}
            </span>
          )}
        </div>
        {collections && collections.length > 0 ? (
          <div
            className={cls({ [classes.collectionCardsHide]: !showMoreCollections }, classes.collectionCards)}
          >
            <MasonryGrid
              gutter={"24px"}
              data={collections}
              renderItem={(item, index) => (
                <CollectionCard heightFixed={true} item={item} key={`item-${index}`} />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
          </div>
        ) : (
          <div className={classes.collectionCardsHide}>
            <Box display="flex" justifyContent="center" mb={3}>
              No items found
            </Box>
          </div>
        )}

        <div className={classes.title}>
          ✨ Created
          {!loadingDigitalArtsForFirstTime && digitalArts && digitalArts.length > 0 && (
            <span
              onClick={() => {
                setShowMoreDigitalArts(!showMoreDigitalArts);
              }}
            >
              {showMoreDigitalArts ? "HIDE" : "VIEW MORE"}
            </span>
          )}
        </div>
        <LoadingWrapper loading={loadingDigitalArtsForFirstTime}>
          {digitalArts && digitalArts.length > 0 ? (
            <div className={classes.artCards}>
              <VirtualizedMasnory
                list={digitalArts}
                loadMore={() => {
                  getDigitalArts(offset);
                }}
                hasMore={hasMore}
                scrollElement={scrollRef.current}
                disableClick={loadingDigitalArtsForFirstTime}
                itemRender={(item, index) => (
                  <DigitalArtCard heightFixed={true} item={item} key={`item-${index}`} index={index + 1} />
                )}
              />
            </div>
          ) : (
            <Box display="flex" justifyContent="center" mt={2} mb={3}>
              No items found
            </Box>
          )}
        </LoadingWrapper>
      </div>
    </div>
  );
}
