import React from "react";
import { Tab, Tabs, AppBar, Dialog } from "@material-ui/core";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";

import { CircularLoadingIndicator, PrimaryButton, TabNavigation } from "shared/ui-kit";
import PrintProfileChart from "../Profile-Chart/Profile-Chart";
import CreateImportSocialTokenModal from "../../modals/Create-social-token/CreateImportSocialTokenModal";
import CardsGrid from "./CardsGrid";
import { useSelector } from "react-redux";
import { getUser } from "store/selectors";
import ComingSoon from "shared/ui-kit/Modal/Modals/ComingSoonModal";
import CreateMediaModal from "components/legacy/Media/modals/CreateMediaModal";

const CardTypes = ["Social", "Pods", "MediaPods", "Credit", "Media", "WIP", "Playlist"];

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 50px;
`;

const ProfilePane = (props: any) => {
  const {
    ownUser,
    socialChart,
    socialChartTokenList,
    ftChart,
    ftChartTokenList,
    tabsCardsValue,
    userId,
    podList,
    podsMediaList,
    socialList,
    creditPoolsList,
    myMedia,
    myPlaylists,
    myWips,
    userProfile,
    getAllInfoProfile,
    onImportModalCall,
    hasMore,
    lastId,
    pagination,
    profileCardsOptions,
    profileSubTabs,
    isLastNFT,
    lastLikedMedia,
    resetPagination,
    subTabsValue,
    setSubTabsValue,
  } = props;
  const [openModalCreateNew, setOpenModalCreateNew] = React.useState(false);

  const userSelector = useSelector(getUser);

  const handleOpenModalCreateNew = () => {
    setOpenModalCreateNew(true);
  };

  const handleCloseModalCreateNew = () => {
    setOpenModalCreateNew(false);
  };

  const handleChangeSocialTab = newValue => {
    resetPagination();
    setSubTabsValue(newValue);
  };

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  const loadMore = () => {
    getAllInfoProfile(
      userId,
      profileCardsOptions[tabsCardsValue],
      profileSubTabs[subTabsValue],
      lastId,
      isLastNFT,
      pagination,
      lastLikedMedia
    );
  };

  const dataInfo = () => {
    if (tabsCardsValue === 0) {
      return {
        title: "My Social Tokens and Communities",
        data: socialList,
      };
    } else if (tabsCardsValue === 1) {
      return {
        title: "My FT Pods",
        data: podList,
      };
    } else if (tabsCardsValue === 2) {
      return {
        title: "My Media Pods",
        data: podsMediaList,
      };
    } else if (tabsCardsValue === 3) {
      return {
        title: "My Credit Pools",
        data: creditPoolsList,
      };
    } else if (tabsCardsValue === 4) {
      if (subTabsValue === 4) {
        return {
          title: "My Playlist",
          data: myPlaylists,
        };
      } else {
        return {
          title: "My Media",
          data: myMedia,
        };
      }
    } else {
      return {
        title: "My Work in Progress",
        data: myWips,
      };
    }
  };

  const ProfileChart = () => {
    if (tabsCardsValue === 0) {
      return PrintProfileChart(socialChart, socialChartTokenList);
    } else if (tabsCardsValue === 1) {
      return PrintProfileChart(ftChart, ftChartTokenList);
    }
    return null;
  };

  return (
    <div className="profile-cards">
      {subTabsValue !== 4 && (
        <div className={"row"}>
          {ownUser && (
            <>
              <h3>{dataInfo().title}</h3>
              {tabsCardsValue !== 5 && tabsCardsValue !== 0 && isSignedIn() ? (
                <PrimaryButton size="medium" onClick={handleOpenModalCreateNew} ml={3}>
                  Create New
                </PrimaryButton>
              ) : null}
            </>
          )}
          {tabsCardsValue === 0 ? (
            <Dialog
              className="modalCreateModal"
              open={openModalCreateNew}
              onClose={handleCloseModalCreateNew}
              fullWidth={true}
              maxWidth={"md"}
            >
              <CreateImportSocialTokenModal
                user={userSelector}
                onCloseModal={handleCloseModalCreateNew}
                type={"FT"}
                open={openModalCreateNew}
                onImportModalCall={onImportModalCall}
              />
            </Dialog>
          ) : tabsCardsValue === 4 ? (
            <CreateMediaModal open={openModalCreateNew} handleClose={handleCloseModalCreateNew} />
          ) : (
            openModalCreateNew && (
              <ComingSoon open={openModalCreateNew} handleClose={handleCloseModalCreateNew} />
            )
          )}
        </div>
      )}
      <div className="cards-content">
        <ProfileChart />
        <div className="appbar-container">
          <TabNavigation
            tabs={["All", "Owned", "Curated", "Liked", tabsCardsValue === 4 ? "Playlist" : ""]}
            currentTab={subTabsValue}
            variant="primary"
            onTabChange={handleChangeSocialTab}
            padding={0}
          />
        </div>
        <InfiniteScroll
          hasChildren={dataInfo().data.length > 0}
          dataLength={dataInfo().data.length}
          scrollableTarget="profile-infite-scroll"
          next={loadMore}
          hasMore={hasMore}
          loader={
            <LoadingIndicatorWrapper>
              <CircularLoadingIndicator />
            </LoadingIndicatorWrapper>
          }
        >
          <CardsGrid
            list={dataInfo().data}
            type={subTabsValue === 4 ? "Playlist" : CardTypes[tabsCardsValue]}
            userProfile={userProfile}
            getAllInfoProfile={getAllInfoProfile}
            ownUser={ownUser}
            hasMore={hasMore}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ProfilePane;
