import cls from "classnames";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { SellModal } from "components/legacy/Media/Marketplace/modals/SellModal";
import { Slider, withStyles } from "@material-ui/core";
import {
  // FILTER_TYPE,
  SearchMediaMarketplaceFilters,
} from "./initialFilters";
import { useHistory } from "react-router-dom";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";

const arrow = require("assets/icons/arrow.png");

enum FILTER_TYPE {
  Auction = "AUCTION_TYPE",
  Sale = "SALE_TYPE",
  Media = "MEDIA_TYPE",
  Crypto = "CRYPTO_TYPE",
  PhysicalNFT = "PHYSICAL_NFT_TYPE",
  FT = "FT_TYPE",
}

type MediaMarketplaceFiltersProps = {
  filters: SearchMediaMarketplaceFilters;
  onFiltersChange: (filters: SearchMediaMarketplaceFilters) => void;
};

const OverPricedSlider = withStyles({
  root: {
    height: 6,
    borderRadius: 3,
    padding: "4px 0px",
  },
  thumb: {
    height: 14,
    width: 14,
    backgroundColor: "#fff",
    border: "none",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
  },
  active: {},
  track: {
    background: "linear-gradient(270deg, #FF254C -19.66%, #F4963E 100%)",
    height: 6,
    borderRadius: 3,
  },
  rail: {
    background: "#E0E4F3",
    height: 6,
    borderRadius: 3,
  },
})(Slider);

const UnderPricedSlider = withStyles({
  root: {
    color: "#52af77",
    height: 6,
    borderRadius: 3,
  },
  thumb: {
    height: 14,
    width: 14,
    backgroundColor: "#fff",
    border: "none",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
  },
  active: {},
  track: {
    background: "linear-gradient(270deg, #56DC53 -68.1%, #CFE967 100%)",
    height: 6,
    borderRadius: 3,
  },
  rail: {
    background: "#E0E4F3",
    height: 6,
    borderRadius: 3,
  },
})(Slider);

const MediaMarketplaceFilters: React.FunctionComponent<MediaMarketplaceFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const history = useHistory();

  const [searchValue, setSearchValue] = useState(filters.searchValue);
  const [filterTypes, setFilterTypes] = useState(filters.filterTypes);
  const [overpriced, setOverpriced] = useState(filters.overpriced);
  const [underpriced, setUnderpriced] = useState(filters.underpriced);

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  const [openSellModal, setOpenSellModal] = React.useState(false);

  const handleOpenSellModal = () => {
    setOpenSellModal(true);
  };

  const handleCloseSellModal = () => {
    setOpenSellModal(false);
  };

  useEffect(() => {
    onFiltersChange({
      searchValue,
      filterTypes,
      overpriced,
      underpriced,
    });
  }, [searchValue, filterTypes, overpriced, underpriced, onFiltersChange]);

  const handleAddDeleteFilter = (item: string, filter: "filterTypes") => {
    let list = [] as any;
    if (filter === "filterTypes") {
      list = [...filterTypes];
    }

    if (filter === "filterTypes") {
      if (item === "all") {
        list = [...Object.values(FILTER_TYPE)];
      } else if (list.length === Object.values(filterTypes).length) {
        list = [];
      }
    }

    if (list.includes(item) && item !== "all") {
      list.splice(
        list.findIndex(list => list === item),
        1
      );
    } else if (item !== "all") {
      list.push(item);
    }

    if (filter === "filterTypes") {
      if (list.length === 0) {
        list = [...Object.values(FILTER_TYPE)];
      }
      setFilterTypes(list);
    }
  };

  const goToVoting = () => {
    history.push("/media/voting");
  };

  return (
    <div className={styles.filters}>
      <div className={styles.row}>
        <div className={cls(styles.search, { [styles.nomargin]: !isSignedIn() })}>
          <SearchWithCreate
            searchValue={searchValue}
            searchPlaceholder="Search by artist, name or tag"
            handleSearchChange={e => setSearchValue(e.target.value)}
          />
        </div>
        {isSignedIn() && (
          <SecondaryButton size="large" onClick={goToVoting}>
            Vote NFTs
          </SecondaryButton>
        )}
        <SecondaryButton size="large">Market Stats</SecondaryButton>
        {isSignedIn() && <PrimaryButton size="large" onClick={handleOpenSellModal}>
          Sell
        </PrimaryButton>}
      </div>
      <div className={cls(styles.row, styles.icons)}>
        <div className={styles.mediaRow}>
          <button
            className={styles.slideLeft}
            type="button"
            onClick={() => {
              document.getElementsByClassName(styles.scrollable)[0]!.scrollLeft -= 75;
            }}
          >
            <img src={arrow} alt="" />
          </button>
          <div className={styles.scrollable}>
            <button
              className={cls(styles.mediaButton, {
                [styles.selected]:
                  filterTypes.includes(FILTER_TYPE.Auction) &&
                  filterTypes.includes(FILTER_TYPE.Sale) &&
                  filterTypes.includes(FILTER_TYPE.Media) &&
                  filterTypes.includes(FILTER_TYPE.Crypto) &&
                  filterTypes.includes(FILTER_TYPE.FT) &&
                  filterTypes.includes(FILTER_TYPE.PhysicalNFT),
              })}
              onClick={() => handleAddDeleteFilter("all", "filterTypes")}
            >
              {`All`}
              <img src={require(`assets/mediaIcons/small/all.png`)} alt={"all"} />
            </button>
            {Object.values(FILTER_TYPE).map((type, index) => (
              <MediaButton
                type={type}
                key={type}
                handleAddDeleteFilter={handleAddDeleteFilter}
                filterTypes={filterTypes}
              />
            ))}
          </div>
          <button
            className={styles.slideRight}
            type="button"
            onClick={() => {
              document.getElementsByClassName(styles.scrollable)[0]!.scrollLeft += 75;
            }}
          >
            <img src={arrow} alt="" />
          </button>
        </div>
        <div className={styles.sliderContainer}>
          <label>Overpriced by {(overpriced * 100).toFixed()}%</label>
          <OverPricedSlider
            min={0}
            step={0.05}
            max={1}
            value={overpriced}
            onChange={(event: any, newValue: number | number[]) => {
              setOverpriced(newValue as number);
            }}
            aria-labelledby="continuous-slider"
            className={styles.slider}
          />
        </div>
        <div className={styles.sliderContainer}>
          <label>Underpriced by {(underpriced * 100).toFixed()}%</label>
          <UnderPricedSlider
            min={0}
            step={0.05}
            max={1}
            value={underpriced}
            onChange={(event: any, newValue: number | number[]) => {
              setUnderpriced(newValue as number);
            }}
            aria-labelledby="continuous-slider"
            className={styles.slider}
          />
        </div>
      </div>
      {isSignedIn() && <SellModal open={openSellModal} onClose={handleCloseSellModal} />}
    </div>
  );
};

export default MediaMarketplaceFilters;

const MediaButton = ({ type, handleAddDeleteFilter, filterTypes }) => {
  return (
    <button
      className={cls(styles.mediaButton, {
        [styles.selected]:
          filterTypes.includes(type) && filterTypes.length < Object.values(FILTER_TYPE).length,
      })}
      onClick={() => handleAddDeleteFilter(type, "filterTypes")}
      disabled={type === FILTER_TYPE.FT || type === FILTER_TYPE.PhysicalNFT || type === FILTER_TYPE.Crypto}
    >
      {type === FILTER_TYPE.Auction
        ? `Auction`
        : type === FILTER_TYPE.Sale
          ? `Sale`
          : type === FILTER_TYPE.Media
            ? `Media`
            : type === FILTER_TYPE.Crypto
              ? `Crypto`
              : type === FILTER_TYPE.FT
                ? `FT`
                : `Physical NFT`}
      <img
        src={require(`assets/mediaIcons/small/${type === FILTER_TYPE.Auction
          ? `auction`
          : type === FILTER_TYPE.Sale
            ? `sale`
            : type === FILTER_TYPE.Media
              ? `media`
              : type === FILTER_TYPE.Crypto
                ? `crypto`
                : type === FILTER_TYPE.FT
                  ? `ft`
                  : `physical_nft`
          }.png`)}
        alt={type}
      />
    </button>
  );
};
