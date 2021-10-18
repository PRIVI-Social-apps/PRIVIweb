import React, { useState, useEffect } from "react";
import Axios from "axios";

import { priviDAOSubPageStyles } from '../index.styles';
import Cards from "components/PriviDAO/components/Cards";
import Header from "components/PriviDAO/components/Header";
import Title from "components/PriviDAO/components/Title";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { preloadImageAndGetDimenstions } from "components/legacy/Media/useMediaPreloader";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CircularLoadingIndicator } from "shared/ui-kit";
// import { mockSearches } from "components/PriviDAO/mockData";
import Box from 'shared/ui-kit/Box';

export default function SearchPage({ handleCloseSearcher }) {
  const classes = priviDAOSubPageStyles();
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const scrollRef = React.useRef<any>();

  const [searchValue, setSearchValue] = useState<any>("");

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedDAOs, setSelectedDAOs] = useState<any[]>([]);
  const [popularDAOs, setPopularDAOs] = useState<any[]>([]);
  const [searchDAOS, setSearchDAOS] = useState<any[]>([]);

  const [suggestedDAOsLoading, setSuggestedDAOsLoading] = useState<boolean>(true);
  const [popularDAOsLoading, setPopularDAOsLoading] = useState<boolean>(true);
  const [searchDAOsLoading, setSearchDAOsLoading] = useState<boolean>(true);
  const [moreDAOsLoading, setMoreDAOsLoading] = useState<boolean>(false);

  const [pagination, setPagination] = useState<number>(1);
  const [hasMoreInfiniteLoader, setHasMoreInfiniteLoader] = useState<boolean>(false);
  const [lastCommunityId, setLastCommunityId] = useState<string>("null");

  const [viewAllSuggested, setViewAllSuggested] = useState<boolean>(false);
  const [viewAllPopular, setViewAllPopular] = useState<boolean>(false);

  useEffect(() => {
    if (user && user.id && user.id.length > 0 && users && users.length > 0) loadDAOs();
  }, [user.id, users]);

  useEffect(() => {
    if (user.id && !searchDAOsLoading) {
      setPagination(1); // reset pagination
      setLastCommunityId("null");
      fetchDataDAOs(1, "null", []);
    }
  }, [user, searchValue]);

  useEffect(() => {
    setTimeout(() => {
      if (
        searchValue &&
        searchValue !== "" &&
        !recentSearches.some(s => s.toUpperCase().includes(searchValue.toUpperCase()))
      ) {
        const searches = [...recentSearches];
        searches.unshift(searchValue.charAt(0).toUpperCase() + searchValue.slice(1));
        setRecentSearches(searches);
      }
    }, 10000);
  }, [searchValue]);

  const loadDAOs = () => {
    setSearchDAOsLoading(true);
    setSuggestedDAOsLoading(true);
    setPopularDAOsLoading(true);

    const config = {
      params: {
        displayingCommunitiesSelection: "All Communities",
        searchValue: "",
        sortByOptionsSelection: "Most Followed",
        sortByTokenOptionsSelection: "Descending",
        sortByEntryLevelSelection: "No",
        userId: user.id,
      },
    };

    Axios.get(`${URL()}/community/getCommunityBasicInfos/${pagination}/${lastCommunityId}`, config).then(
      async res => {
        const resp = res.data;
        if (resp.success) {
          const data = resp.data;
          let allCommunities = data.all ?? [];
          const hasMore = data.hasMore ?? false;
          const lastId = data.lastId ?? "";

          for (let index = 0; index < allCommunities.length; index++) {
            const community = allCommunities[index];

            if (users.some(user => user.id === community.Creator)) {
              const thisUser = users[users.findIndex(user => user.id === community.Creator)];
              allCommunities[index].userData = {
                name: thisUser.name,
                imageURL: thisUser.imageURL,
              };
            }

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
                } catch (e) {}
              }
              allCommunities[index].dimensions = dimensions;
            }
          }

          setSelectedDAOs(allCommunities);
          setSelectedDAOs(allCommunities.filter((i, ind) => ind < 6));
          setPopularDAOs(allCommunities.filter((i, ind) => ind < 6));
          setSearchDAOsLoading(false);
          setSuggestedDAOsLoading(false);
          setPopularDAOsLoading(false);
          setHasMoreInfiniteLoader(hasMore);
          setLastCommunityId(lastId);
        } else {
          setSearchDAOsLoading(false);
          setHasMoreInfiniteLoader(false);
        }
      }
    );
  };

  const fetchDataDAOs = async (page, lastId, currFilteredCommunitiesList) => {
    const config = {
      params: {
        displayingCommunitiesSelection: "All Communities",
        searchValue: searchValue,
        sortByOptionsSelection: "Most Followed",
        sortByTokenOptionsSelection: "Descending",
        sortByEntryLevelSelection: "No",
        userId: user.id,
      },
    };

    setMoreDAOsLoading(true);
    const res = await Axios.get(`${URL()}/community/getCommunityBasicInfos/${page}/${lastId}`, config);

    const resp = res.data;
    if (resp.success) {
      const data = resp.data;
      const communities = data.all ?? [];
      const hasMore = data.hasMore ?? false;
      const lastId = data.lastId ?? "";

      for (let index = 0; index < communities.length; index++) {
        const community = communities[index];

        if (!communities[index].userData && users.some(user => user.id === community.Creator)) {
          const thisUser = users[users.findIndex(user => user.id === community.Creator)];
          communities[index].userData = {
            name: thisUser.name,
            imageURL: thisUser.imageURL,
          };
        }

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
            } catch (e) {}
          }
          communities[index].dimensions = dimensions;
        }
      }
      setSearchDAOS([...currFilteredCommunitiesList, ...communities]);
      setHasMoreInfiniteLoader(hasMore);
      setLastCommunityId(lastId);

      setMoreDAOsLoading(false);
    }
  };

  const handleScroll = e => {
    if (scrollRef.current && searchValue !== "") {
      const bottom =
        scrollRef.current.scrollHeight - scrollRef.current.scrollTop >= scrollRef.current.clientHeight - 150;
      if (bottom && hasMoreInfiniteLoader) {
        setPagination(pagination + 1);
        fetchDataDAOs(pagination + 1, lastCommunityId, searchDAOS);
      }
    }
  };

  const handleRemove = searchIndex => {
    const searches = [...recentSearches];
    searches.splice(searchIndex, 1);
    setRecentSearches(searches);
  };

  return (
    <div className={classes.content} onScroll={handleScroll} ref={scrollRef}>
      <Header type="search" handleCloseSearcher={handleCloseSearcher} />
      <div className={classes.inputContainer}>
        <input
          value={searchValue}
          onChange={e => {
            setSearchValue(e.target.value);
          }}
        />
        <img src={require("assets/icons/search_gray.png")} alt="search" />
      </div>
      {searchValue === "" ? (
        <Box display="flex" flexDirection="column" width="100%">
          <Title title="Recent searches" />
          {recentSearches && recentSearches.length > 0 ? (
            <Cards
              cardType="Pills"
              cards={recentSearches ? recentSearches.filter((item, index) => index < 6) : []}
              handleRemove={i => handleRemove(i)}
              handleOnClick={item => setSearchValue(item)}
            />
          ) : (
            <Box color="white" width="100%" padding="20px" display="flex" justifyContent="center">
              No items to show
            </Box>
          )}

          <Title
            title="Selected for you"
            heightFixed={selectedDAOs && selectedDAOs.length > 6 ? !viewAllSuggested : undefined}
            handleHeightFixed={
              selectedDAOs && selectedDAOs.length > 6
                ? () => setViewAllSuggested(!viewAllSuggested)
                : undefined
            }
          />
          <LoadingWrapper theme="dark" loading={suggestedDAOsLoading}>
            {selectedDAOs && selectedDAOs.length > 0 ? (
              <Cards
                cardType="DAO"
                cards={
                  selectedDAOs
                    ? selectedDAOs.filter((item, index) => (viewAllSuggested ? index > -1 : index < 6))
                    : []
                }
                heightFixed={!viewAllSuggested}
              />
            ) : (
              <Box color="white" width="100%" padding="20px" display="flex" justifyContent="center">
                No DAOs to show
              </Box>
            )}
          </LoadingWrapper>

          <Title
            title="Popular on Privi"
            heightFixed={popularDAOs && popularDAOs.length > 6 ? !viewAllPopular : undefined}
            handleHeightFixed={
              popularDAOs && popularDAOs.length > 6 ? () => setViewAllPopular(!viewAllPopular) : undefined
            }
          />
          <LoadingWrapper theme="dark" loading={popularDAOsLoading}>
            {popularDAOs && popularDAOs.length > 0 ? (
              <Cards
                cardType="DAO"
                cards={
                  popularDAOs
                    ? popularDAOs.filter((item, index) => (viewAllPopular ? index > -1 : index < 6))
                    : []
                }
                heightFixed={!viewAllPopular}
              />
            ) : (
              <Box color="white" width="100%" padding="20px" display="flex" justifyContent="center">
                No DAOs to show
              </Box>
            )}
          </LoadingWrapper>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" width="100%">
          <h5 className={classes.title}>Filter by category</h5>
          <LoadingWrapper theme="dark" loading={searchDAOsLoading}>
            {searchDAOS && searchDAOS.length > 0 ? (
              <Cards cardType="DAO" cards={searchDAOS} />
            ) : (
              <Box color="white" width="100%" padding="20px" display="flex" justifyContent="center">
                No DAOs to show
              </Box>
            )}
          </LoadingWrapper>
          {moreDAOsLoading && (
            <Box width="100%" padding="20px" display="flex" justifyContent="center">
              <CircularLoadingIndicator />
            </Box>
          )}
        </Box>
      )}
    </div>
  );
}
