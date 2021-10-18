import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import DigitalArtContext, {
  SearchDigitalArtFilters,
  initialDigitalArtFilters,
} from "shared/contexts/DigitalArtContext";
import Header from "shared/ui-kit/Header/Header";
import { priviDigitalArtStyles } from './index.styles';
import HomePage from "./subpages/HomePage";
import ExplorePage from "./subpages/ExplorePage";
import LikedPage from "./subpages/LikedPage";
import SearchPage from "./subpages/SearchPage";
import MarketplacePage from "./subpages/MarketplacePage";
import Filters from "./components/Filters";
import Sidebar from "./components/Sidebar";
import MediaPage from "./subpages/MediaPage";

enum OpenType {
  Home = "HOME",
  Explore = "EXPLORE",
  Liked = "LIKED",
  Search = "SEARCH",
  Marketplace = "MARKETPLACE",
}

export default function PriviDigitalArt() {
  const classes = priviDigitalArtStyles();

  const location: any = useLocation();
  let pathName = window.location.href;
  let idUrl = pathName.split("/")[5] ? pathName.split("/")[5] : "";

  const [openTab, setOpenTab] = useState<any>({ type: OpenType.Home });
  const [openFilters, setOpenFilters] = useState<boolean>(false);
  const [showStatus, setShowStatus] = useState<boolean>(true);
  const [filters, setFilters] = useState<SearchDigitalArtFilters>(initialDigitalArtFilters);

  const handleRefresh = () => { };

  useEffect(() => {
    if (openTab.type === OpenType.Marketplace) {
      setShowStatus(false);
    } else {
      setShowStatus(true);
    }
  }, [openTab]);

  return (
    <DigitalArtContext.Provider
      value={{
        openTab: openTab,
        setOpenTab: setOpenTab,
        openFilters: openFilters,
        setOpenFilters: setOpenFilters,
        showStatus: showStatus,
        setShowStatus: setShowStatus,
      }}
    >
      <div className={classes.priviDigitalArt}>
        <Header
          handleOpenSearcher={() => {
            setOpenTab({ type: OpenType.Search, id: undefined });
          }}
          openTab={openTab}
        />
        <div className={classes.mainContainer}>
          <div className={classes.content}>
            {openFilters ? (
              <Filters filters={filters} onFiltersChange={setFilters} showStatus={showStatus} />
            ) : (
              <Sidebar handleRefresh={handleRefresh} />
            )}
            {idUrl ? (
              <MediaPage />
            ) : openTab.type === OpenType.Home ? (
              <HomePage />
            ) : openTab.type === OpenType.Explore ? (
              <ExplorePage filters={filters} />
            ) : openTab.type === OpenType.Search ? (
              <SearchPage />
            ) : openTab.type === OpenType.Liked ? (
              <LikedPage />
            ) : openTab.type === OpenType.Marketplace ? (
              <MarketplacePage filters={filters} />
            ) : null}
          </div>
        </div>
      </div>
    </DigitalArtContext.Provider>
  );
}
