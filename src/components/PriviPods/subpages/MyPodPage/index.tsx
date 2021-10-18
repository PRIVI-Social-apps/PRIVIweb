import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";

import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import PodCard from "../../components/Cards/PodCard";

import { preloadImageAndGetDimenstions } from "../../../legacy/Media/useMediaPreloader";
import { VirtualizedMasnory } from "shared/ui-kit/VirtualizedMasnory";
import { priviPodsSubPageStyles } from "../index.styles";

export default function MyPodPage() {
  const classes = priviPodsSubPageStyles();
  const users = useTypedSelector(state => state.usersInfoList);
  const user = useTypedSelector(state => state.user);

  const [isPodsLoading, setIsPodsLoading] = useState<boolean>(false);
  const [disableClick, setDisableClick] = useState<boolean>(false);

  // pods
  const [myPodsFullList, setMyPodsFullList] = useState<any[]>([]);

  const scrollRef = React.useRef<any>();

  useEffect(() => {
    getMediaPodsInformation();
  }, []);

  const getMediaPodsInformation = async () => {
    if (!isPodsLoading) {
      setDisableClick(true);
      setIsPodsLoading(true);
      const response = await axios.get(`${URL()}/mediaPod/getMyMediaPods/${user.id}`);
      const resp = response.data;
      if (resp.success) {
        const data = resp.data;
        const mediaPods = data.mediaPods ?? [];

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
        setMyPodsFullList(mediaPods);
      }
      setDisableClick(false);
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
        <div className={classes.title}>My Pods</div>
        <div className={classes.section}>
          {myPodsFullList && myPodsFullList.length
          ? (
            <VirtualizedMasnory
              list={myPodsFullList.map(item => getPodWithUserData(item))}
              loadMore={() => {}}
              hasMore={false}
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
          ) : (
            <p>No pods</p>
          )}
        </div>
      </div>
    </div>
  );
}
