import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import styles from "./index.module.scss";
import URL from "shared/functions/getURL";
import MediaArtistsSlider from "components/legacy/Media/components/MediaArtistsSlider";
import { createUserInfo, UserInfo } from "store/actions/UsersInfo";
import CreatorExplore from "./components/CreatorExplore/CreatorExplore";
import CreatorSearch from "./components/CreatorSearch/CreatorSearch";
import CreatorTitle from "./components/CreatorTitle/CreatorTitle";

type CreatorPageProps = {
  showBackButton: boolean;
};

const scrollContainerId = "scrollContainer";

const CreatorPage: React.FunctionComponent<CreatorPageProps> = React.memo(
  ({ showBackButton }) => {
    const history = useHistory();
    const [filterString, setFilterString] = useState("");
    const [isLastUser, setIsLastUser] = useState(true);
    const [lastId, setLastId] = useState("");
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [allArtists, setAllArtists] = useState<UserInfo[]>([]);
    const [comingArtists, setComingArtists] = useState<UserInfo[]>([]);
    const [error, setError] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
    if (!showBackButton) showBackButton = true;

    const loadData = useCallback(() => {
      setIsDataLoading(true);

      axios
        .post(`${URL()}/chat/getAllArtists`, {
          userName: filterString,
          lastId: lastId,
          isLastUser: isLastUser,
        })
        .then(response => {
          if (response.data.success) {
            const allUsers = response.data.data.users;

            const u = [] as any[];
            allUsers.forEach(user => {
              let image = "";
              if (user.hasPhoto && user.url) {
                image = `${user.url}?${Date.now()}`;
              } else if (user.anonAvatar && user.anonAvatar.length > 0) {
                image = `${require(`assets/anonAvatars/${user.anonAvatar}`)}`;
              } else {
                image = `${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)}`;
              }
              if (!allArtists.find(artist => artist.id !== user.id)) {
                u.push(
                  createUserInfo(
                    user.id,
                    `${user.firstName ? user.firstName : ""} ${user.lastName ? user.lastName : ""}`,
                    user.address,
                    user.mnemonic,
                    image,
                    user.level ?? 1,
                    user.numFollowers || 0,
                    user.numFollowings || 0,
                    user.creds?.length ?? 0,
                    user.badges ?? [],
                    user.urlSlug ??
                      `${user.firstName ? user.firstName : ""}${user.lastName ? user.lastName : ""}`,
                    user.twitter ?? "",
                    user.anon ?? false,
                    user.verified ?? false,
                    user.MediaLikes?.length ?? 0,
                    user.profileViews ?? 0,
                    user.awards?.length ?? 0,
                    user.trustScore ?? 0,
                    user.endorsementScore ?? 0,
                    user.bio ?? "",
                    user.isExternalUser ?? false,
                    user.connected ?? false,
                    user.rate ?? 0,
                    user.anonAvatar ?? "",
                    user.backgroundURL ?? "",
                    user.imageUrl ?? "",
                    user.assistances ?? 0,
                    user.hasPhoto ?? false,
                    user.myMediasCount ?? 0,
                    user.url ?? "",
                    user.wallets ?? [],
                    user.email ?? "",
                  )
                );
              }
            });
            setComingArtists(u);
            setHasMore(response.data.data.hasMore);
            setIsLastUser(response.data.data.isLastUser);
            setLastId(response.data.data.lastId);
            setIsDataLoading(false);
            setError(false);
          }
        })
        .catch(error => {
          console.log(error);
          setIsDataLoading(false);
          setError(true);
        });
    }, [filterString, lastId, isLastUser]);

    useEffect(() => {
      if (!isDataLoading) {
        setLastId("");
        setIsLastUser(true);
        loadData();
      }
    }, [filterString]);

    useEffect(() => {
      if (!isDataLoading && comingArtists.length > 0) {
        setAllArtists([...allArtists, ...comingArtists]);
      }
    }, [isDataLoading, comingArtists.length]);

    return (
      <div className={styles.container} id={scrollContainerId}>
        <div className={styles.mainContainer}>
          {showBackButton && (
            <>
              <nav
                className="cursor-pointer"
                onClick={() => {
                  history.goBack();
                }}
              >{`< back`}</nav>
              <h5 className={styles.pretitle}>creators</h5>
            </>
          )}
          <CreatorTitle />
          <CreatorSearch searchCreator={userName => setFilterString(userName)} />
          <MediaArtistsSlider title="Trending" showSeeAll={false} />
          <CreatorExplore
            data={allArtists}
            error={error}
            hasMore={hasMore}
            loadMore={loadData}
            scrollableContainerId={scrollContainerId}
            isDataLoading={isDataLoading}
          />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.showBackButton === nextProps.showBackButton
);

export default CreatorPage;
