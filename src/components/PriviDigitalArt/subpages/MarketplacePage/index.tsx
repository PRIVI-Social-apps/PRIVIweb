import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import { subPageStyles } from '../index.styles';
import { COLUMNS_COUNT_BREAK_POINTS_FOUR } from "../SearchPage";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import DigitalArtCard from "components/PriviDigitalArt/components/Cards/DigitalArtCard";
import DigitalArtContext from "shared/contexts/DigitalArtContext";
import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Box from 'shared/ui-kit/Box';
import { ARTWORK_MEDIA_TYPES } from "components/PriviDigitalArt/productUtils";
import { useTypedSelector } from "store/reducers/Reducer";

const displayOptions = ["All items"];
const sortOptions = ["Sort by"];

export default function MarketplacePage({ filters }) {
  const classes = subPageStyles();
  const { setOpenFilters } = useContext(DigitalArtContext);

  const [displayOption, setDisplayOption] = useState<string>(displayOptions[0]);
  const [sortOption, setSortOption] = useState<string>(sortOptions[0]);
  const [loadingDigitalArts, setLoadingDigitalArts] = useState<boolean>(false);
  const [digitalArts, setDigitalArts] = useState<any[]>([]);
  const user = useTypedSelector(state => state.user);

  useEffect(() => {
    //TODO: sort
  }, [sortOption, displayOption]);

  useEffect(() => {
    setLoadingDigitalArts(true);
    axios
      .post(`${URL()}/media/getMedias`, {
        mediaTypes: ARTWORK_MEDIA_TYPES,
        blockChains: filters.blockChains,
      })
      .then(res => {
        if (res.data.success) {
          let medias = res.data.data;
          if (user.uninterestedMedias) {
            medias = medias.filter((item) => !user.uninterestedMedias?.includes(item.MediaSymbol || item.id));
          }
          setDigitalArts(medias);
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingDigitalArts(false);
      });
  }, [filters]);

  useEffect(() => {
    let medias = [...digitalArts];
    if (user.uninterestedMedias) {
      medias = medias.filter((item) => !user.uninterestedMedias?.includes(item.MediaSymbol || item.id));
    }
    setDigitalArts(medias);
  }, [user.uninterestedMedias]);

  const filteredMedias = React.useMemo(() => {
    let filteredData = [...digitalArts];
    if(filters.status) {
      if(filters.status === 'buyNow') {
        filteredData = filteredData.filter(item => item.Exchange);
      } else if(filters.status === 'auction') {
        filteredData = filteredData.filter(item => item.Auctions);
      }
    }
    return filteredData;
  }, [digitalArts]);

  return (
    <div className={classes.page}>
      <div className={classes.content}>
        <div className={classes.headerTitle}>
          <Box display="flex" alignItems="center">
            ✨ Marketplace
            <button
              onClick={() => {
                setOpenFilters(true);
              }}
            >
              <img src={require("assets/icons/filters.png")} alt="filters" />
            </button>
          </Box>
        </div>
        <LoadingWrapper loading={loadingDigitalArts}>
          <div className={classes.artCards}>
            <MasonryGrid
              gutter={"24px"}
              data={filteredMedias}
              renderItem={(item, index) => (
                <DigitalArtCard heightFixed={false} item={item} key={`item-${index}`} />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
          </div>
        </LoadingWrapper>
      </div>
    </div>
  );
}
