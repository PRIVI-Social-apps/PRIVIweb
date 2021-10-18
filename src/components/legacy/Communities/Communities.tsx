import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "@material-ui/core";
import Ticker from "react-ticker";
import { useTypedSelector } from "store/reducers/Reducer";
import CreateCommunityModal from "./modals/CreateCommunity";
import CommunityCard from "./components/CommunityCard";
import axios from "axios";
import URL from "shared/functions/getURL";
import { StyledBlueSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import TutorialModal from "shared/ui-kit/Page-components/Tutorials/TutorialModal";
import { updateTutorialsSeen } from "store/actions/User";
import { preloadImageAndGetDimenstions } from "components/legacy/Media/useMediaPreloader";
import { VirtualizedMasnory } from "shared/ui-kit/VirtualizedMasnory";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";

import "./Communities.css";
import { PrimaryButton } from "shared/ui-kit";
import { HeaderTitle } from "shared/ui-kit/Header/components/HeaderTitle";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";

const infoIcon = require("assets/icons/info.svg");

const sortByOptions = ["Most Followed", "Recent"];
const sortByTokenOptions = ["Descending", "Ascending"];
const sortByEntryLevelOptions = ["No", ...Array.from({ length: 13 }, (_, v) => v.toString())];
const displayingCommunities = [
  "All Communities",
  "My Communities",
  "Private Communities",
  "Public Communities",
];

const Communities = React.memo(() => {
  // STORE
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);
  const dispatch = useDispatch();
  // HOOKS
  const [searchValue, setSearchValue] = useState<string>("");
  const [disableClick, setDisableClick] = useState<boolean>(false);
  const [communitiesLoading, setCommunitiesLoading] = useState<boolean>(true);
  const [openCreateCommunity, setOpenCreateCommunity] = useState<boolean>(false);
  const [tickerMove, setTickerMove] = useState<boolean>(false);
  const [trendingCommunitiesList, setTrendingCommunitiesList] = useState<any>([]);
  const [filteredCommunitiesList, setFilteredCommunitiesList] = useState<any[]>([]);
  const scrollRef = React.useRef<any>();
  const [pagination, setPagination] = useState<number>(1);
  const [hasMoreInfiniteLoader, setHasMoreInfiniteLoader] = useState<boolean>(false);
  const [lastCommunityId, setLastCommunityId] = useState<string>("null");
  const [trendingCommunitiesLoading, setTrendingCommunitiesLoading] = useState<boolean>(true);
  const [sortByOptionsSelection, setSortByOptionsSelection] = useState<string>(sortByOptions[0]);
  const [sortByTokenOptionsSelection, setSortByTokenOptionsSelection] = useState<string>(
    sortByTokenOptions[0]
  );
  const [sortByEntryLevelSelection, setSortByEntryLevelSelection] = useState<string>(
    sortByEntryLevelOptions[0]
  );
  const [displayingCommunitiesSelection, setDisplayingCommunitiesSelection] = useState<string>(
    displayingCommunities[0]
  );
  const [openTutorialModal, setOpenTutorialModal] = useState<boolean>(true);
  const mobileMatches = useMediaQuery("(max-width:375px)");

  const handleOpenTutorialModal = () => {
    setOpenTutorialModal(true);
  };
  const handleCloseTutorialModal = () => {
    setOpenTutorialModal(false);
  };

  // FUNCTIONS
  useEffect(() => {
    if (user && user.tutorialsSeen && user.tutorialsSeen.communities === false) {
      handleOpenTutorialModal();
    }
    if (user && user.id && user.id.length > 0) loadCommunities();
  }, [user.id]);

  // when filter optiosn chage
  useEffect(() => {
    if (user.id && !communitiesLoading) {
      setPagination(1); // reset pagination
      setLastCommunityId("null"); //
      setFilteredCommunitiesList([]); // reset communities
      fetchDataCommunities(1, "null", []);
    }
  }, [
    displayingCommunitiesSelection,
    sortByOptionsSelection,
    sortByTokenOptionsSelection,
    sortByEntryLevelSelection,
    searchValue,
    user,
  ]);

  const getCommunityWithUserData = React.useCallback(
    community => {
      //load creator data
      if (users.some(user => user.id === community.Creator)) {
        const thisUser = users[users.findIndex(user => user.id === community.Creator)];
        community.userData = {
          name: thisUser.name,
          imageURL: thisUser.imageURL,
        };
      }

      community.Members?.forEach(member => {
        if (users.some(user => user.id === member.id)) {
          const thisUser = users[users.findIndex(user => user.id === member.id)];
          member.imageURL = thisUser.imageURL;
        }
      });

      return community;
    },
    [users]
  );

  const handleOpenCreateCommunity = () => {
    setOpenCreateCommunity(true);
  };

  const handleCloseCreateCommunity = () => {
    setOpenCreateCommunity(false);
  };

  const loadCommunities = () => {
    setCommunitiesLoading(true);
    setTrendingCommunitiesLoading(true);
    setDisableClick(true);

    const config = {
      params: {
        displayingCommunitiesSelection: displayingCommunitiesSelection,
        searchValue: searchValue,
        sortByOptionsSelection: sortByOptionsSelection,
        sortByTokenOptionsSelection: sortByTokenOptionsSelection,
        sortByEntryLevelSelection: sortByEntryLevelSelection,
        userId: user.id,
      },
    };

    axios
      .get(`${URL()}/community/getCommunityBasicInfos/${pagination}/${lastCommunityId}`, config)
      .then(async res => {
        const resp = res.data;
        if (resp.success) {
          const data = resp.data;
          let allCommunities = data.all ?? [];
          const hasMore = data.hasMore ?? false;
          const lastId = data.lastId ?? "";

          for (let index = 0; index < allCommunities.length; index++) {
            const community = allCommunities[index];
            //load conversations
            let counters = community.counters;
            let conversationsCounter = counters?.conversationsMonthCounter;

            allCommunities[index].conversationsMonth = conversationsCounter ?? 0;

            //load last month users
            if (community.Members && typeof community.Members[Symbol.iterator] === "function") {
              let totalMembers = 0;
              let thisMonthMembers = 0;
              community.Members.forEach(member => {
                totalMembers = totalMembers++;
                if (
                  new Date(member.date).getMonth() === new Date().getMonth() &&
                  new Date(member.date).getFullYear() === new Date().getFullYear()
                ) {
                  thisMonthMembers = thisMonthMembers++;
                }
              });
              allCommunities[index].membersGrowth = totalMembers - thisMonthMembers;
            } else {
              allCommunities[index].membersGrowth = 0;
            }

            if (community.CommunityAddress && !community.dimensions) {
              let dimensions;
              let mediaUrl: any;
              if (community.Url) {
                mediaUrl = community.Url + "?" + Date.now();
              }
              if (mediaUrl) {
                try {
                  dimensions = await preloadImageAndGetDimenstions(mediaUrl);
                } catch (e) { }
              }
              allCommunities[index].dimensions = dimensions;
            }
          }

          setDisplayingCommunitiesSelection(displayingCommunities[0]);
          setFilteredCommunitiesList([...filteredCommunitiesList, ...allCommunities]);
          setCommunitiesLoading(false);
          setHasMoreInfiniteLoader(hasMore);
          setLastCommunityId(lastId);
        } else {
          setCommunitiesLoading(false);
          setHasMoreInfiniteLoader(false);
        }
        setDisableClick(false);
      });

    axios.get(`${URL()}/community/getTrendingCommunityBasicInfos`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const data = resp.data;
        //console.log("loadTrendingCommunities", data);
        const trendingCommunities = data.trending ?? [];

        trendingCommunities.forEach((community, index) => {
          //load conversations
          let counters = community.counters;
          let conversationsCounter = counters ? counters.conversationsMonthCounter : 0;

          trendingCommunities[index].conversationsMonth = conversationsCounter ?? 0;

          //load last month users
          if (community.Members && typeof community.Members[Symbol.iterator] === "function") {
            let totalMembers = 0;
            let thisMonthMembers = 0;
            community.Members.forEach(member => {
              totalMembers = totalMembers++;
              if (
                new Date(member.date).getMonth() === new Date().getMonth() &&
                new Date(member.date).getFullYear() === new Date().getFullYear()
              ) {
                thisMonthMembers = thisMonthMembers++;
              }
            });
            trendingCommunities[index].membersGrowth = totalMembers - thisMonthMembers;
          } else {
            trendingCommunities[index].membersGrowth = 0;
          }
        });
        setTrendingCommunitiesList(trendingCommunities);
      } else {
        console.log("error getting trending communities");
      }
      setTrendingCommunitiesLoading(false);
      setDisableClick(false);
    });
  };

  const fetchDataCommunities = async (page, lastId, currFilteredCommunitiesList) => {
    const config = {
      params: {
        displayingCommunitiesSelection: displayingCommunitiesSelection,
        searchValue: searchValue,
        sortByOptionsSelection: sortByOptionsSelection,
        sortByTokenOptionsSelection: sortByTokenOptionsSelection,
        sortByEntryLevelSelection: sortByEntryLevelSelection,
        userId: user.id,
      },
    };

    setCommunitiesLoading(true);
    const res = await axios.get(`${URL()}/community/getCommunityBasicInfos/${page}/${lastId}`, config);

    const resp = res.data;
    if (resp.success) {
      const data = resp.data;
      const communities = data.all ?? [];
      const hasMore = data.hasMore ?? false;
      const lastId = data.lastId ?? "";

      for (let index = 0; index < communities.length; index++) {
        const community = communities[index];
        //load conversations
        let counters = community.counters;
        let conversationsCounter = counters ? counters.conversationsMonthCounter : 0;

        communities[index].conversationsMonth = conversationsCounter ?? 0;

        //load last month users
        if (
          community.Members &&
          typeof community.Members[Symbol.iterator] === "function" &&
          !community.membersGrowth
        ) {
          let totalMembers = 0;
          let thisMonthMembers = 0;
          community.Members.forEach(member => {
            totalMembers = totalMembers++;
            if (
              new Date(member.date).getMonth() === new Date().getMonth() &&
              new Date(member.date).getFullYear() === new Date().getFullYear()
            ) {
              thisMonthMembers = thisMonthMembers++;
            }
          });
          communities[index].membersGrowth = totalMembers - thisMonthMembers;
        } else {
          communities[index].membersGrowth = 0;
        }

        if (community.CommunityAddress) {
          let dimensions;
          const mediaUrl = `${community.Url}?${Date.now()}}`;
          if (mediaUrl) {
            try {
              dimensions = await preloadImageAndGetDimenstions(mediaUrl);
            } catch (e) { }
          }
          communities[index].dimensions = dimensions;
        }
      }
      setFilteredCommunitiesList([...currFilteredCommunitiesList, ...communities]);
      setHasMoreInfiniteLoader(hasMore);
      setLastCommunityId(lastId);

      setCommunitiesLoading(false);
    }
  };

  const handleRestartTutorials = () => {
    const body = {
      userId: user.id,
      tutorialsSeen: {
        communities: false,
        pods: user.tutorialsSeen.pods,
        creditPools: user.tutorialsSeen.creditPools,
      },
    };

    axios
      .post(`${URL()}/user/updateTutorialsSeen`, body)
      .then(response => {
        if (response.data.success) {
          //update redux data aswell
          dispatch(updateTutorialsSeen(body.tutorialsSeen));
        } else {
          console.log(`Restart communities tutorials failed`);
        }
      })
      .catch(error => {
        console.log(error);
        //alert('Error handling anonymous avatar update');
      });
  };

  return (
    <React.Fragment>
      <div className="communities-page" ref={scrollRef}>
        <div className="communities">
          <HeaderTitle
            title="Communities"
            subtitle="The heartbeat of the PRIVI network. Find groups, businesses, creators, and individuals."
          />
          <div style={{ textAlign: "center" }}>
            <button className="connect-mobile" onClick={handleOpenCreateCommunity}>
              Create new
            </button>
          </div>
          <div className="trending">
            <div className="title">
              <div className="trending-communities">
                <h3>🔥 Trending Communities</h3>
              </div>
            </div>
            <LoadingWrapper loading={trendingCommunitiesLoading}>
              {trendingCommunitiesList.length > 0 ? (
                <Ticker direction="toLeft" move={tickerMove} offset={0}>
                  {({ index }) => (
                    <div
                      onMouseOver={() => {
                        setTickerMove(false);
                      }}
                      onMouseLeave={() => {
                        setTickerMove(true);
                      }}
                      className={"community-cards"}
                    >
                      <CommunityCard
                        trending={true}
                        community={getCommunityWithUserData(
                          trendingCommunitiesList[index % trendingCommunitiesList.length]
                        )}
                        key={`${index}-trending-community-card`}
                        disableClick={disableClick}
                      />
                    </div>
                  )}
                </Ticker>
              ) : (
                <div className="no-pods">No communities to show</div>
              )}
            </LoadingWrapper>
          </div>
          <div className="title">
            <div style={{ display: "flex", alignItems: "center" }}>
              <h3>Communities</h3>
              {!mobileMatches && (
                <PrimaryButton size="medium" onClick={handleOpenCreateCommunity}>
                  Create new
                </PrimaryButton>
              )}
            </div>
            <label>
              <SearchWithCreate
                searchValue={searchValue}
                handleSearchChange={e => setSearchValue(e.target.value)}
                searchPlaceholder={mobileMatches ? "Search" : "Search by artist, name, tag"}
              />
            </label>
          </div>
          <div className="display-filter">
            <div className="filters">
              <div className="dropdown">
                <p>Displaying:</p>
                <StyledBlueSelect
                  disableUnderline
                  labelId="simple-select-label"
                  id="simple-select"
                  value={displayingCommunitiesSelection}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    setDisplayingCommunitiesSelection(event.target.value as string);
                  }}
                >
                  {displayingCommunities.map((option: string, i: number) => {
                    return (
                      <StyledMenuItem value={option} key={i}>
                        {option}
                      </StyledMenuItem>
                    );
                  })}
                </StyledBlueSelect>
              </div>
              <div className="dropdown">
                <p>Sort by:</p>
                <StyledBlueSelect
                  disableUnderline
                  labelId="simple-select-label"
                  id="simple-select"
                  value={sortByOptionsSelection}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    setSortByOptionsSelection(event.target.value as string);
                  }}
                >
                  {sortByOptions.map((option: string, i: number) => {
                    return (
                      <StyledMenuItem value={option} key={i}>
                        {option}
                      </StyledMenuItem>
                    );
                  })}
                </StyledBlueSelect>
              </div>
              <div className="dropdown">
                <p>Token price:</p>
                <StyledBlueSelect
                  disableUnderline
                  labelId="simple-select-label"
                  id="simple-select"
                  value={sortByTokenOptionsSelection}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    setSortByTokenOptionsSelection(event.target.value as string);
                  }}
                >
                  {sortByTokenOptions.map((option: string, i: number) => {
                    return (
                      <StyledMenuItem value={option} key={i}>
                        {option}
                      </StyledMenuItem>
                    );
                  })}
                </StyledBlueSelect>
              </div>
              <div className="dropdown">
                <p>Entry level:</p>
                <StyledBlueSelect
                  disableUnderline
                  labelId="simple-select-label"
                  id="simple-select"
                  value={sortByEntryLevelSelection}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    setSortByEntryLevelSelection(event.target.value as string);
                  }}
                >
                  {sortByEntryLevelOptions.map((option: string, i: number) => {
                    return (
                      <StyledMenuItem value={option} key={i}>
                        {option}
                      </StyledMenuItem>
                    );
                  })}
                </StyledBlueSelect>
              </div>
            </div>
          </div>
          <LoadingWrapper
            loading={
              trendingCommunitiesLoading || (communitiesLoading && filteredCommunitiesList.length === 0)
            }
          >
            {filteredCommunitiesList.length > 0 && (
              <VirtualizedMasnory
                list={filteredCommunitiesList.map(item => getCommunityWithUserData(item))}
                loadMore={() => {
                  setPagination(pagination + 1);
                  fetchDataCommunities(pagination + 1, lastCommunityId, filteredCommunitiesList);
                }}
                hasMore={hasMoreInfiniteLoader}
                scrollElement={scrollRef.current}
                type={"community"}
                disableClick={disableClick}
                itemRender={undefined}
              />
            )}
            {!communitiesLoading && filteredCommunitiesList.length === 0 && (
              <div className="no-pods">No communities to show</div>
            )}
          </LoadingWrapper>
        </div>
      </div>
      {openCreateCommunity && (
        <CreateCommunityModal
          open={openCreateCommunity}
          handleRefresh={loadCommunities}
          handleClose={handleCloseCreateCommunity}
        />
      )}
      {/* {user.tutorialsSeen.communities === false && openTutorialModal && (
        <TutorialModal
          open={openTutorialModal}
          handleClose={handleCloseTutorialModal}
          tutorial={"communities"}
        />
      )} */}
    </React.Fragment>
  );
});

export default Communities;
