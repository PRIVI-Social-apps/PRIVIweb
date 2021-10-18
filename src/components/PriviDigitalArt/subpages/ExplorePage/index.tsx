import React, { useEffect, useState, useContext } from "react";

import { subPageStyles } from '../index.styles';
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { COLUMNS_COUNT_BREAK_POINTS_FOUR } from "../SearchPage";
import DigitalArtCard from "components/PriviDigitalArt/components/Cards/DigitalArtCard";
import DigitalArtContext from "shared/contexts/DigitalArtContext";
import { useMediaPreloader } from "components/legacy/Media/useMediaPreloader";
import { CircularLoadingIndicator } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';
import { useTypedSelector } from "store/reducers/Reducer";

const displayOptions = ["All items"];
const sortOptions = ["Sort by"];

const ExplorePage = ({ filters }) => {
  const classes = subPageStyles();
  const { setOpenFilters } = useContext(DigitalArtContext);
  const { data, hasMore, loadMore, reload } = useMediaPreloader(filters);
  const [displayOption, setDisplayOption] = useState<string>(displayOptions[0]);
  const [sortOption, setSortOption] = useState<string>(sortOptions[0]);
  const [digitalArts, setDigitalArts] = useState<any[]>([]);
  const user = useTypedSelector(state => state.user);

  useEffect(() => {
    setDigitalArts([]);
  }, [filters]);

  useEffect(() => {
    if (data && data.length > 0) {
      let medias = [...data.map(item => item.media)];
      if (user.uninterestedMedias) {
        medias = medias.filter((item) => !user.uninterestedMedias?.includes(item.id));
      }
      setDigitalArts(medias);
    }
  }, [data, user.uninterestedMedias]);

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 112 && hasMore) {
        loadMore();
      }
    },
    [hasMore, loadMore]
  );

  return (
    <div className={classes.page} onScroll={handleScroll}>
      <div className={classes.content}>
        <div className={classes.headerTitle}>
          <Box display="flex" alignItems="center">
            ✨ All Digital Art
            <button
              onClick={() => {
                setOpenFilters(true);
              }}
            >
              <img src={require("assets/icons/filters.png")} alt="filters" />
            </button>
          </Box>
        </div>
        <div className={classes.artCards}>
          <MasonryGrid
            gutter={"24px"}
            data={digitalArts}
            renderItem={(item, index) => (
              <DigitalArtCard
                heightFixed={false}
                item={item}
                key={`item-${index}`}
                index={index+1}
              />
            )}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
          />
        </div>
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
    </div>
  );
};

export default React.memo(ExplorePage);
