import React, { useState, useEffect } from "react";
import Axios from "axios";
import Ticker from "react-ticker";

import { priviDAOSubPageStyles } from '../index.styles';
import Cards from "components/PriviDAO/components/Cards";
import Header from "components/PriviDAO/components/Header";
import Title from "components/PriviDAO/components/Title";
// import { mockThemes } from "components/PriviDAO/mockData";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { preloadImageAndGetDimenstions } from "components/legacy/Media/useMediaPreloader";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import DAOCard from "components/PriviDAO/components/Cards/DAOCard";
import { CircularLoadingIndicator } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

export default function HomePage() {
  const classes = priviDAOSubPageStyles();
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const scrollRef = React.useRef<any>();

  const [tickerMove, setTickerMove] = useState<boolean>(false);

  const [trendingDAOsLoading, setTrendingDAOsLoading] = useState<boolean>(true);
  const [myDAOsLoading, setMyDAOsLoading] = useState<boolean>(true);
  const [priviDAOsLoading, setPriviDAOsLoading] = useState<boolean>(true);
  const [moreDAOsLoading, setMoreDAOsLoading] = useState<boolean>(false);

  const [pagination, setPagination] = useState<number>(1);
  const [hasMoreInfiniteLoader, setHasMoreInfiniteLoader] = useState<boolean>(false);
  const [lastCommunityId, setLastCommunityId] = useState<string>("null");

  const [trendingDAOS, setTrendingDAOs] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const [myDAOS, setMyDAOs] = useState<any[]>([]);
  const [priviDAOS, setPriviDAOs] = useState<any[]>([]);

  const [viewAllThemes, setViewAllThemes] = useState<boolean>(false);
  const [viewAllMyDAOs, setViewAllMyDAOs] = useState<boolean>(false);

  useEffect(() => {
    if (user && user.id && user.id.length > 0 && users && users.length > 0) loadDAOs();
  }, [user.id, users]);

  useEffect(() => {
    if (user.id && !priviDAOsLoading) {
      setPagination(1); // reset pagination
      setLastCommunityId("null");
      fetchDataDAOs(1, "null", []);
    }
  }, [user]);

  const loadDAOs = () => {
    setPriviDAOsLoading(true);
    setTrendingDAOsLoading(true);

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

          setPriviDAOs(allCommunities);
          setPriviDAOsLoading(false);
          setHasMoreInfiniteLoader(hasMore);
          setLastCommunityId(lastId);
        } else {
          setPriviDAOsLoading(false);
          setHasMoreInfiniteLoader(false);
        }
      }
    );

    const config2 = {
      params: {
        displayingCommunitiesSelection: "My Communities",
        searchValue: "",
        sortByOptionsSelection: "Most Followed",
        sortByTokenOptionsSelection: "Descending",
        sortByEntryLevelSelection: "No",
        userId: user.id,
      },
    };

    Axios.get(`${URL()}/community/getCommunityBasicInfos/${pagination}/${lastCommunityId}`, config2).then(
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

          setMyDAOs(allCommunities);
          setMyDAOsLoading(false);
          setHasMoreInfiniteLoader(hasMore);
          setLastCommunityId(lastId);
        } else {
          setMyDAOsLoading(false);
          setHasMoreInfiniteLoader(false);
        }
      }
    );

    Axios.get(`${URL()}/community/getTrendingCommunityBasicInfos`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const data = resp.data;
        const trendingCommunities = data.trending ?? [];

        trendingCommunities.forEach((community, index) => {
          if (users.some(user => user.id === community.Creator)) {
            const thisUser = users[users.findIndex(user => user.id === community.Creator)];
            trendingCommunities[index].userData = {
              name: thisUser.name,
              imageURL: thisUser.imageURL,
            };
          }

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

        setTrendingDAOs(trendingCommunities);
      } else {
        console.log("error getting trending communities");
      }
      setTrendingDAOsLoading(false);
    });
  };

  const fetchDataDAOs = async (page, lastId, currFilteredCommunitiesList) => {
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
      setPriviDAOs([...currFilteredCommunitiesList, ...communities]);
      setHasMoreInfiniteLoader(hasMore);
      setLastCommunityId(lastId);

      setMoreDAOsLoading(false);
    }
  };

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

  const handleScroll = e => {
    if (scrollRef.current) {
      const bottom =
        scrollRef.current.scrollHeight - scrollRef.current.scrollTop >= scrollRef.current.clientHeight - 150;
      if (bottom && hasMoreInfiniteLoader) {
        setPagination(pagination + 1);
        fetchDataDAOs(pagination + 1, lastCommunityId, priviDAOS);
      }
    }
  };

  return (
    <div className={classes.content} onScroll={handleScroll} ref={scrollRef}>
      <Header type="home" />
      <Title title="Trending DAO’s" />
      <div className={classes.tickerWrapper}>
        <LoadingWrapper theme="dark" loading={trendingDAOsLoading}>
          {trendingDAOS.length > 0 ? (
            <Ticker direction="toLeft" move={tickerMove} offset={0}>
              {({ index }) => (
                <div
                  onMouseOver={() => {
                    setTickerMove(false);
                  }}
                  onMouseLeave={() => {
                    setTickerMove(true);
                  }}
                  className={classes.cards}
                >
                  <DAOCard
                    item={getCommunityWithUserData(trendingDAOS[index % trendingDAOS.length])}
                    heightFixed={true}
                    key={`${index}-trending-community-card`}
                  />
                </div>
              )}
            </Ticker>
          ) : (
            <Box color="white" width="100%" padding="20px" display="flex" justifyContent="center">
              No DAOs to show
            </Box>
          )}
        </LoadingWrapper>
      </div>
      <Title
        title="DAO’s by theme"
        heightFixed={themes && themes.length > 6 ? !viewAllThemes : undefined}
        handleHeightFixed={themes && themes.length > 6 ? () => setViewAllThemes(!viewAllThemes) : undefined}
      />
      {themes && themes.length > 0 ? (
        <Cards
          cardType="Theme"
          cards={themes ? themes.filter((item, index) => (viewAllThemes ? index > -1 : index < 6)) : []}
          heightFixed={!viewAllThemes}
        />
      ) : (
        <Box color="white" width="100%" padding="20px" display="flex" justifyContent="center">
          No Themes to show
        </Box>
      )}
      <Title
        title="My DAO’s"
        heightFixed={myDAOS && myDAOS.length > 6 ? !viewAllMyDAOs : undefined}
        handleHeightFixed={myDAOS && myDAOS.length > 6 ? () => setViewAllMyDAOs(!viewAllMyDAOs) : undefined}
      />
      <LoadingWrapper theme="dark" loading={myDAOsLoading}>
        {myDAOS && myDAOS.length > 0 ? (
          <Cards
            cardType="DAO"
            cards={myDAOS ? myDAOS.filter((item, index) => (viewAllMyDAOs ? index > -1 : index < 6)) : []}
            heightFixed={!viewAllMyDAOs}
          />
        ) : (
          <Box color="white" width="100%" padding="20px" display="flex" justifyContent="center">
            No DAOs to show
          </Box>
        )}
      </LoadingWrapper>
      <Title title="Privi DAO’s" />
      <LoadingWrapper theme="dark" loading={priviDAOsLoading}>
        {priviDAOS && priviDAOS.length > 0 ? (
          <Cards cardType="DAO" cards={priviDAOS} />
        ) : (
          <Box color="white" width="100%" padding="20px" display="flex" justifyContent="center">
            No DAOs to show
          </Box>
        )}
      </LoadingWrapper>
      {moreDAOsLoading && (
        <Box width="100%" padding="20px" display="flex" justifyContent="center">
          <CircularLoadingIndicator theme="dark" />
        </Box>
      )}
    </div>
  );
}
