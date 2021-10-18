import React, { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import Ticker from "react-ticker";

import { useTypedSelector } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import URL from "shared/functions/getURL";
import { setOtherPodsList, setTrendingPodsList } from "store/actions/PodsManager";
import { VirtualizedMasnory } from "shared/ui-kit/VirtualizedMasnory";
import PodCard from "../../components/Cards/PodCard";
import DiscoverSection from "./components/Discover/DiscoverSction";
import { preloadImageAndGetDimenstions } from "../../../legacy/Media/useMediaPreloader";
import { priviPodsSubPageStyles } from '../index.styles';

const podStateOptions = ["All", "Formation", "Investment", "Released"];
const investingOptions = ["Off", "On"];
const sortByPriceOptions = ["Descending", "Ascending"];
const podTypeOptions = ["All", "Media Pods", "Fractionalised Media"];

export default function HomePage() {
  const classes = priviPodsSubPageStyles();
  const dispatch = useDispatch();
  const users = useTypedSelector(state => state.usersInfoList);
  const [trendingList, setTrendingList] = useState<any[]>([]);
  const [isTrendingPodsLoading, setIsTrendingPodsLoading] = useState<boolean>(false);
  const [tickerMove, setTickerMove] = useState<boolean>(false);

  const [isPodsLoading, setIsPodsLoading] = useState<boolean>(false);
  const [disableClick, setDisableClick] = useState<boolean>(false);

  // filter and sort selections
  const [podStateSelection, setPodStateSelection] = useState<string>(podStateOptions[0]);
  const [investingSelection, setInvestingSelection] = useState<string>(investingOptions[0]);
  const [sortByPriceSelection, setSortByPriceSelection] = useState<string>(sortByPriceOptions[0]);
  const [podTypeSelection, setPodTypeSelection] = useState<string>(podTypeOptions[0]); // all, media pod, fractionalized
  const [searchValue, setSearchValue] = useState<string>("");

  // pods
  const [otherPodsFullList, setOtherPodsFullList] = useState<any[]>([]);

  const [hasMorePods, setHasMorePods] = useState<boolean>(true);
  const [lastId, setLastId] = useState<string>("null");
  const [pagination, setPagination] = useState<number>(1);

  const scrollRef = React.useRef<any>();

  useEffect(() => {
    getMediaTrendingPods();
  }, []);

  useEffect(() => {
    setPagination(1);
    setOtherPodsFullList([]);
    setLastId("null");
    setHasMorePods(true);
    getMediaPodsInformation(1, [], null);
  }, [
    podStateSelection,
    investingSelection,
    sortByPriceSelection,
    podTypeSelection,
    // podType
  ]);

  const getMediaPodsInformation = async (page, currMediaPods, lastMediaPodId) => {
    if (!isPodsLoading) {
      setDisableClick(true);
      setIsPodsLoading(true);
      const config = {
        params: {
          podStateSelection: podStateSelection,
          investingSelection: investingSelection,
          sortByPriceSelection: sortByPriceSelection,
          podTypeSelection: podTypeSelection,
          searchValue: searchValue,
        },
      };
      const response = await axios.get(`${URL()}/mediaPod/getMediaPods/${page}/${lastMediaPodId}`, config);
      const resp = response.data;
      if (resp.success) {
        const data = resp.data;
        const mediaPods = data.mediaPods ?? [];
        const hasMore = data.hasMore ?? false;
        const lastId = data.lastId ?? "null";

        for (let index = 0; index < mediaPods.length; index++) {
          const mediaPod = mediaPods[index];
          if (mediaPod.PodAddress && !mediaPod.dimensions) {
            let dimensions;
            const mediaUrl = `${mediaPod.Url}?${Date.now()}`;
            if (mediaUrl) {
              try {
                dimensions = await preloadImageAndGetDimenstions(mediaUrl);
              } catch (e) {}
            }
            mediaPods[index].dimensions = dimensions;
          }
        }
        const newMediaPods = [...currMediaPods, ...mediaPods];
        dispatch(setOtherPodsList(newMediaPods));
        setOtherPodsFullList(newMediaPods);
        setHasMorePods(hasMore);
        setLastId(lastId);
      }
      setDisableClick(false);
      setIsPodsLoading(false);
    }
  };

  const getMediaTrendingPods = (forceRefreshCache?: boolean) => {
    setIsTrendingPodsLoading(true);

    axios
      .get(
        `${URL()}/mediaPod/getTrendingMediaPods`,
        forceRefreshCache
          ? {
              params: {
                forceRefreshCache: true,
              },
            }
          : undefined
      )
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          const data = resp.data;

          let trendingMediaPods = [...(data.trending || [])];

          trendingMediaPods = trendingMediaPods.reduce(
            (unique, pod) => (unique.some(u => u.PodAddress === pod.PodAddress) ? unique : [...unique, pod]),
            []
          );

          dispatch(setTrendingPodsList(trendingMediaPods));

          setTrendingList(trendingMediaPods);
        } else {
          console.log("error getting trending Media Pods");
        }
        setIsTrendingPodsLoading(false);
      });
  };

  const getPodWithUserData = useCallback(
    pod => {
      //load creator data
      if (users.some(user => pod.Creator === user.id)) {
        const trendingUser = users[users.findIndex(user => pod.Creator === user.id)];
        pod.CreatorImageURL = trendingUser.imageURL;
        pod.CreatorName = trendingUser.name;
      }

      if (pod.Followers && pod.Followers[0] && users.some(user => pod.Followers[0] === user.id)) {
        const trendingFollowUser = users[users.findIndex(user => pod.Followers[0] === user.id)];
        pod.FirstFollower = {
          imageURL: trendingFollowUser.imageURL,
          name: trendingFollowUser.name,
        };
      }

      return pod;
    },
    [users]
  );

  return (
    <div className={classes.pageHeader} ref={scrollRef}>
      <div className={classes.content}>
        <div className={classes.title}>Discover</div>
        <DiscoverSection />
        <div className={classes.title}>Trending Pods</div>
        <div className={classes.section}>
          <LoadingWrapper loading={isTrendingPodsLoading}>
            {trendingList.length > 0 ? (
              <Ticker direction="toLeft" move={tickerMove} offset={0}>
                {({ index }) => (
                  <div
                    onMouseOver={() => {
                      setTickerMove(false);
                    }}
                    onMouseLeave={() => {
                      setTickerMove(true);
                    }}
                    className={"pods-cards"}
                    style={{ minWidth: "364px" }}
                  >
                    <PodCard
                      pod={getPodWithUserData(trendingList[index % trendingList.length])}
                      type={"Digital-NFT"}
                      key={`${
                        trendingList[index % trendingList.length].PodAddress
                      }-${index}-DNFTtrending-card`}
                    />
                  </div>
                )}
              </Ticker>
            ) : (
              <div className="no-pods">No pods to show</div>
            )}
          </LoadingWrapper>
        </div>
        <div className={classes.title}>Suggested for you</div>
        <div className={classes.section}>
          <VirtualizedMasnory
            list={otherPodsFullList.map(item => getPodWithUserData(item))}
            loadMore={() => {
              const newPagination = pagination + 1;
              setPagination(newPagination);
              getMediaPodsInformation(newPagination, otherPodsFullList, lastId);
            }}
            hasMore={hasMorePods}
            scrollElement={scrollRef.current}
            disableClick={disableClick}
            itemRender={(item, index) => (
              <PodCard
                pod={getPodWithUserData(item)}
                type={"Digital-NFT"}
                key={`${item.PodAddress}-${index}-DNFT-card`}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
