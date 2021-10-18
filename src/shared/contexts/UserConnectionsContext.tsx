import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import {
  FollowResult,
  followUser,
  unfollowUser,
  FollowEntry,
  getFollowers,
  getFollowings,
  applyClosenessDegree,
} from "shared/services/API/UserConnectionsAPI";
import { useTypedSelector } from "store/reducers/Reducer";
import { UserInfo } from "store/actions/UsersInfo";

const UserActionContext = createContext<UserActionContextType | null>(null);

type UserActionContextType = {
  followers: FollowEntry[];
  followings: FollowEntry[];
  followUser: (userId: string) => Promise<FollowResult>;
  unfollowUser: (userId: string) => Promise<FollowResult>;
  isUserFollower: (userId: string) => boolean;
  isUserFollowed: (userId: string) => boolean;
  chatWithUser: (user: UserInfo) => void;
  applyClosenessDegree: (userId: string, type: "Followers" | "Followings", closenessDegree: number) => void;
};

export const UserConnectionsContextProvider: React.FunctionComponent = ({ children }) => {
  const history = useHistory();
  const currentUser = useTypedSelector(state => state.user);

  const [followers, setFollowers] = useState<FollowEntry[]>([]);
  const [followings, setFollowings] = useState<FollowEntry[]>([]);

  const followerUserIds = useMemo(() => new Set(followers.map(entry => entry.id)), [followers]);
  const followedUserIds = useMemo(() => new Set(followings.map(entry => entry.id)), [followings]);

  useEffect(() => {
    if (currentUser.id) {
      getFollowers(currentUser.id, true).then(setFollowers);
      getFollowings(currentUser.id, true).then(setFollowings);
    }
  }, [currentUser.id]);

  const context = useMemo<UserActionContextType>(
    () => ({
      followers,
      followings,
      async followUser(userId: string) {
        const result = await followUser(userId);

        const newFollowing: FollowEntry = {
          id: userId,
          ...result,
          isFollowing: 1,
          closenessDegree: 0,
        };

        setFollowings(followings => [...followings, newFollowing]);
        return result;
      },
      async unfollowUser(userId: string) {
        setFollowings(followings => followings.filter(entry => entry.id !== userId));
        return unfollowUser(userId);
      },
      isUserFollower(userId: string) {
        return followerUserIds.has(userId);
      },
      isUserFollowed(userId: string) {
        return followedUserIds.has(userId);
      },
      chatWithUser(user: UserInfo) {
        history.push(`/profile/${user.name.replace(/\s/g, "")}/messages`);
      },
      async applyClosenessDegree(userId: string, type: "Followers" | "Followings", closenessDegree: number) {
        await applyClosenessDegree(userId, type, closenessDegree);
        if (type === 'Followers') {
          setFollowers(followers => followers.filter(follower => follower.id === userId).map(item => {
            item.closenessDegree = closenessDegree;
            return item;
          }));
        } else if (type === 'Followings') {
          setFollowings(followings => followings.filter(following => following.id === userId).map(item => {
            item.closenessDegree = closenessDegree;
            return item;
          }));
        }
      }
    }),
    [followers, followings, followerUserIds, followedUserIds, history]
  );
  return <UserActionContext.Provider value={context}>{children}</UserActionContext.Provider>;
};

export const useUserConnections = () => {
  const context = useContext(UserActionContext);

  if (!context) {
    throw new Error("useUserConnections hook must be used inside UserConnectionsContextProvider");
  }

  return context;
};
