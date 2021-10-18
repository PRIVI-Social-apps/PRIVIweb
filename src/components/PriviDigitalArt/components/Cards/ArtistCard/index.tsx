import * as React from "react";
import { useHistory } from "react-router-dom";

import { artistCardStyles } from './index.styles';
import { useTypedSelector } from "store/reducers/Reducer";
import { useAuth } from "shared/contexts/AuthContext";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import Box from 'shared/ui-kit/Box';

export default function ArtistCard({ item, currentIndex }) {
  const classes = artistCardStyles();

  const user = useTypedSelector(state => state.user);
  const history = useHistory();
  const { isSignedin } = useAuth();
  const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
  const isFollowing = item && isUserFollowed(item.id);

  const handleFollow = e => {
    e.stopPropagation();
    e.preventDefault();
    if (!item) return;

    if (!isFollowing) {
      followUser(item.id);
    } else {
      unfollowUser(item.id);
    }
  };

  return (
    <div
      className={classes.card}
      onClick={() => {
        history.push(`/profile/${item.urlSlug}`);
      }}
      style={{
        backgroundImage: item.url
          ? `url(${item.url})`
          : `url(https://source.unsplash.com/random/${currentIndex})`,
      }}
    >
      <div className={classes.filter}>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="16px">
          {<b>{`${item.firstName || ""} ${item.lastName || ""}`}</b>}
          {user && item.id !== user.id && isSignedin && (
            <button className={isFollowing ? classes.unfollow : classes.follow} onClick={handleFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </Box>
        <Box display="flex" width="100%" justifyContent="space-between">
          <Box display="flex" flexDirection="column">
            <b>🌟 Collections</b>
            <Box marginTop="8px">
              {item.myMediasCount
                ? `${
                    item.myMediasCount > 1000000
                      ? (item.myMediasCount / 1000000).toFixed(1)
                      : item.myMediasCount > 1000
                      ? (item.myMediasCount / 1000).toFixed(1)
                      : item.myMediasCount
                  }${item.myMediasCount > 1000000 ? "M" : item.myMediasCount > 1000 ? "K" : ""}`
                : 0}
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <b>🌟 Followers</b>
            <Box marginTop="8px">
              {item.numFollowers && item.numFollowers > 0
                ? `${
                  item.numFollowers > 1000000
                      ? (item.numFollowers / 1000000).toFixed(1)
                      : item.numFollowers > 1000
                      ? (item.numFollowers / 1000).toFixed(1)
                      : item.numFollowers
                  }${item.numFollowers > 1000000 ? "M" : item.numFollowers > 1000 ? "K" : ""}`
                : 0}
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
}
