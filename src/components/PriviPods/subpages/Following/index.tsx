import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { useTypedSelector } from "store/reducers/Reducer";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { VirtualizedMasnory } from "shared/ui-kit/VirtualizedMasnory";
import PodCard from "../../components/Cards/PodCard";
import { preloadImageAndGetDimenstions } from "../../../legacy/Media/useMediaPreloader";
import { priviPodsSubPageStyles } from '../index.styles';

export default function FollowingPage() {
  const classes = priviPodsSubPageStyles();
  const users = useTypedSelector(state => state.usersInfoList);
  const userSelector = useSelector((state: RootState) => state.user);

  const [isPodsLoading, setIsPodsLoading] = useState<boolean>(false);

  // pods
  const [pods, setPods] = useState<any[]>([]);

  const [hasMorePods, setHasMorePods] = useState<boolean>(true);
  const [lastId, setLastId] = useState<number>(0);
  const scrollRef = React.useRef<any>();

  useEffect(() => {
    if (userSelector.id) {
      getFollowingPods();
    }
  }, [userSelector])

  const getFollowingPods = async () => {
    if (!isPodsLoading) {
      setIsPodsLoading(true);

      const response = await axios.get(`${URL()}/mediaPod/getMyFollowingPods/${userSelector.id}/${lastId}`);
      const resp = response.data;
      if (resp.success) {
        const data = resp.data;
        const mediaPods = data.mediaPods ?? [];
        const hasMore = data.hasMore ?? false;
        const lastId = data.lastId ?? 0;

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
        const newMediaPods = [...pods, ...mediaPods];
        setPods(newMediaPods);
        setHasMorePods(hasMore);
        setLastId(lastId);
      }
      setIsPodsLoading(false);
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
        <div className={classes.title}>Following Pods</div>
        <div className={classes.section}>
          <VirtualizedMasnory
            list={pods.map(item => getPodWithUserData(item))}
            loadMore={() => {
              getFollowingPods();
            }}
            hasMore={hasMorePods}
            scrollElement={scrollRef.current}
            disableClick={isPodsLoading}
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
