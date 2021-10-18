import React, { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { useTypedSelector } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Variant } from "shared/constants/const";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import URL from "shared/functions/getURL";
import { setTrendingPodsList } from "store/actions/PodsManager";
import PodCard from "../../components/Cards/PodCard";
import { priviPodsSubPageStyles } from '../index.styles';

const COLUMNS_COUNT_BREAK_POINTS_SIX = {
  400: 1,
  650: 2,
  1200: 3,
  1440: 4,
};

export default function Fractions() {
  const classes = priviPodsSubPageStyles();
  const dispatch = useDispatch();
  const users = useTypedSelector(state => state.usersInfoList);
  const [trendingList, setTrendingList] = useState<any[]>([]);
  const [isTrendingPodsLoading, setIsTrendingPodsLoading] = useState<boolean>(false);

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

  useEffect(() => {
    getMediaTrendingPods();
  }, []);

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
    <div className={classes.pageHeader}>
      <div className={classes.content}>
        <div className={classes.title}>Fractions</div>
        <div className={classes.section}>
          <LoadingWrapper loading={isTrendingPodsLoading}>
            {trendingList.length > 0 && (
              <MasonryGrid
                gutter={"24px"}
                data={trendingList}
                renderItem={(item, index) => (
                  <PodCard
                    pod={getPodWithUserData(item)}
                    type={"Digital-NFT"}
                    key={`${item.PodAddress}-${index}-DNFTtrending-card`}
                    variant={Variant.Tertiary}
                    isFractionalised
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
              />
            )}
          </LoadingWrapper>
        </div>
      </div>
    </div>
  );
}
