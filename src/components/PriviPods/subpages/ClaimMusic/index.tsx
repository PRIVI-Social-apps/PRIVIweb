import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";

import { useTypedSelector } from "store/reducers/Reducer";
import { Variant } from "shared/constants/const";
import URL from "shared/functions/getURL";
import PodCard from "components/PriviPods/components/Cards/PodCard";
import { VirtualizedMasnory } from "shared/ui-kit/VirtualizedMasnory";
import { priviPodsSubPageStyles } from '../index.styles';


export default function ClaimMusic() {
  const classes = priviPodsSubPageStyles();
  const users = useTypedSelector(state => state.usersInfoList);
  const [claimablePodsFullList, setClaimablePodsFullList] = useState<any[]>([]);
  const [isClaimablePodsLoading, setIsClaimablePodsLoading] = useState<boolean>(false);
  const [hasMoreClaimablePods, setHasMoreClaimablePods] = useState<boolean>(true);
  const [claimablePagination, setClaimablePagination] = useState<number>(1);
  const [lastClaimableId, setLastClaimableId] = useState<string>("null");

  const scrollRef = React.useRef<any>();

  useEffect(() => {
    getClaimablePods(1, [], null);
  }, []);

  const getClaimablePods = async (page, currClaimablePods, lastClaimablePodId) => {
    if (!isClaimablePodsLoading) {
      setIsClaimablePodsLoading(true);
      const config = {
        params: {
          searchValue: "",
        },
      };

      const response = await axios.get(
        `${URL()}/claimableSongs/getClaimablePods/${page}/${lastClaimablePodId}`,
        config
      );
      const resp = response.data;
      if (resp.success) {
        const data = resp.data;
        const claimablePods = data.data ?? [];
        const hasMore = data.hasMore ?? false;
        const lastId = data.lastId ?? "null";

        const newClaimablePods = [...currClaimablePods, ...claimablePods];
        setClaimablePodsFullList(newClaimablePods);
        setHasMoreClaimablePods(hasMore);
        setLastClaimableId(lastId);
      }
      setIsClaimablePodsLoading(false);
    }
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
        <div className={classes.title}>Claimable songs</div>
        <div className={classes.section}>
          <VirtualizedMasnory
            list={claimablePodsFullList}
            loadMore={() => {
              const newPagination = claimablePagination + 1;
              setClaimablePagination(newPagination);
              getClaimablePods(newPagination, claimablePodsFullList, lastClaimableId);
            }}
            hasMore={hasMoreClaimablePods}
            scrollElement={scrollRef.current}
            itemRender={(item, index) => (
              <PodCard
                pod={getPodWithUserData(item)}
                type={"claim-music"}
                key={`${item.PodAddress}-${index}-DNFTtrending-card`}
                variant={Variant.Secondary}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
