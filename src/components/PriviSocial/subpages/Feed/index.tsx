import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import axios from "axios";

import { Grid, Slider, withStyles } from "@material-ui/core";

import { GreenTitle } from "components/PriviSocial/index.styles";
import Box from "shared/ui-kit/Box";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Gradient, Color } from "shared/ui-kit";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import FriendLabel from "./components/FriendLabel";
import CreateWallPostModal from "../Home/components/MyWall/CreateWallPostModal";
import WallFeedCard from "components/PriviSocial/components/Cards/WallFeedCard";
import { feedStyles } from "./index.styles";
import * as UserConnectionsAPI from "shared/services/API/UserConnectionsAPI";
import { UserInfo } from "store/actions/UsersInfo";
import { removeUndef } from "shared/helpers";
import { VirtualizedMasnory } from "shared/ui-kit/VirtualizedMasnory";
import CreatePostContainer from "./components/CreatePostContainer";

const Feed = ({ userId, userProfile, scrollRef }) => {
  const classes = feedStyles();
  const users = useSelector((state: RootState) => state.usersInfoList);
  const userSelector = useSelector((state: RootState) => state.user);

  const [closenessDegree, setClosenessDegree] = useState<number[]>([1.6, 2.6]);

  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredFriends, setFilteredFriends] = useState<UserInfo[]>([]);
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  const [status, setStatus] = useState<any>("");

  const [openCreatePostModal, setOpenCreatePostModal] = useState<boolean>(false);
  const handleOpenCreatePostModal = () => {
    setOpenCreatePostModal(true);
  };
  const handleCloseCreatePostModal = () => {
    setOpenCreatePostModal(false);
  };

  // pagination
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [lastId, setLastId] = useState<any>(null);
  const [lastCollection, setLastCollection] = useState<any>("community");
  const [hasMore, setHasMore] = useState<any>(true);

  useEffect(() => {
    if (userId) {
      getPosts();
      getFriends(userId, users);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, userId]);

  useEffect(() => {
    if (searchValue && searchValue !== "") {
      let fends = [] as any;
      friends.forEach(f => {
        if (f.name && f.name.toUpperCase().includes(searchValue.toUpperCase())) {
          fends.push(f);
        } else if (f.urlSlug && f.urlSlug.toUpperCase().includes(searchValue.toUpperCase())) {
          fends.push(f);
        }
      });

      setFilteredFriends(fends);
    } else {
      setFilteredFriends(friends);
    }
  }, [searchValue]);

  const getPosts = (filterChanged = false) => {
    if (isDataLoading) return;
    setIsDataLoading(true);
    const config = {
      params: {
        userId: userId,
        lastId: filterChanged ? null : lastId,
        lastCollection: filterChanged ? "community" : lastCollection,
        closenessDegree: JSON.stringify(closenessDegree),
      },
    };
    axios
      .get(`${URL()}/user/feed/getPosts`, config)
      .then(res => {
        const resp = res.data;

        if (resp.success) {
          let data = [...resp.data];

          data.forEach((post, index) => {
            if (userId === post?.createdBy) {
              data[index].userImageURL = userProfile.anon
                ? require(`assets/anonAvatars/${userProfile.anonAvatar}`)
                : userProfile.hasPhoto
                  ? userProfile.url
                  : "";
              data[index].userName = userProfile.firstName ?? userProfile.name ?? "User name";
              data[index].urlSlug =
                userProfile.urlSlug ?? userProfile.firstName ?? userProfile.name ?? "User name";
              data[index].level = userProfile.level ?? 1;
              data[index].verified = userProfile.verified ?? false;
            } else {
              const thisUser = users.find(user => user.id === post?.createdBy);
              if (thisUser) {
                data[index].userImageURL = thisUser.imageURL;
                data[index].userName = thisUser.name;
                data[index].urlSlug = thisUser.urlSlug ?? thisUser.name ?? "User name";
                data[index].level = thisUser.level ?? 1;
                data[index].verified = thisUser.verified ?? false;
              } else {
                data[index].userImageURL = getRandomAvatarForUserIdWithMemoization(post?.createdBy);
                data[index].userName = "User name";
                data[index].urlSlug = "Username";
                data[index].level = 1;
                data[index].verified = false;
              }
            }

            if (post.hasPhoto && !post.url) {
              data[index].url = `${URL()}/user/wall/getPostPhoto/${post.id}`;
            }
          });

          data.sort((a, b) => b.schedulePost - a.schedulePost);

          let newPosts = data.filter(wall => wall.selectedFormat === 1);

          let oldPosts;
          if (lastId === null || filterChanged) {
            oldPosts = [];
          } else {
            oldPosts = [...posts];
          }

          setHasMore(resp.hasMore);
          setLastId(resp.lastId);
          setLastCollection(resp.lastCollection);
          setPosts([...oldPosts, ...newPosts]);
        } else {
          setStatus({
            msg: resp.error || "Error making get posts request",
            key: Math.random(),
            variant: "error",
          });
        }
        setIsDataLoading(false);
      })
      .catch(err => {
        setStatus({
          msg: "Error making get posts request",
          key: Math.random(),
          variant: "success",
        });
        setIsDataLoading(false);
      });
  };

  const getFriends = async (userId: string, allUsers: UserInfo[]) => {
    const friendIds = await UserConnectionsAPI.getFriends(userId);

    const friends: UserInfo[] = friendIds
      .map(userId => allUsers.find(u => u.id === userId))
      .filter(removeUndef);

    setFriends(friends);
    setFilteredFriends(friends);
  };

  const handleClosenessDegreeChange = (event: any, newValue: number | number[]) => {
    setClosenessDegree(newValue as number[]);
  };

  const handleClosenessDegreeChanged = () => {
    getPosts(true);
  };

  const getFriendsBox = () => {
    return (
      <div className={classes.friends}>
        <Box mb="32px">
          Friends <b>({friends.length})</b>
        </Box>
        <Box overflow="auto">
          {filteredFriends.map((friend, index) => (
            <FriendLabel friend={friend} key={`friend-${index}`} />
          ))}
        </Box>
        <div className={classes.inputSearch}>
          <input
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search friends"
          />
          <img src={require("assets/icons/search_gray.png")} />
        </div>
      </div>
    );
  };

  return (
    <div>
      <Grid container spacing={2} style={{ marginBottom: "50px" }}>
        <Grid item xs={12} sm={6} md={4}>
          <GreenTitle className={classes.headerTitle}>FEED</GreenTitle>
        </Grid>
        <Grid item xs={12} sm={6} md={8} style={{ width: "100%", display: "flex", alignItems: "center" }}>
          <Grid container>
            <Grid item sm={12} md={4}>
              <Box color="#181818" mr="12px" flexShrink={0}>
                💫&nbsp;&nbsp;Filter by Closeness Degree
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <GreenSlider
                min={0}
                marks
                step={0.1}
                max={3}
                value={closenessDegree}
                onChange={handleClosenessDegreeChange}
                onChangeCommitted={handleClosenessDegreeChanged}
                className={classes.slider}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box className={classes.topFriendContainer} mb={5}>
        {getFriendsBox()}
      </Box>
      <Box display="flex" width="100%">
        <Box className={classes.leftFriendContainer} mr={5}>
          {getFriendsBox()}
        </Box>
        <Box width={1}>
          {(posts && posts.length > 0) || isDataLoading ? (
            <VirtualizedMasnory
              list={posts}
              loadMore={getPosts}
              hasMore={hasMore}
              scrollElement={scrollRef.current}
              itemRender={(item, index) =>
                index === 0 ? (
                  <>
                    <CreatePostContainer handleOpenCreatePostModal={handleOpenCreatePostModal} />
                    <WallFeedCard feedItem item={item} userProfile={userProfile} key={`feed-item-${index}`} />
                  </>
                ) : (
                  <WallFeedCard feedItem item={item} userProfile={userProfile} key={`feed-item-${index}`} />
                )
              }
            />
          ) : (
            <CreatePostContainer handleOpenCreatePostModal={handleOpenCreatePostModal} />
          )}
          {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
        </Box>
      </Box>
      {openCreatePostModal && (
        <CreateWallPostModal
          handleClose={handleCloseCreatePostModal}
          open={openCreatePostModal}
          handleRefresh={getPosts}
          type="userFeed"
          userId={userSelector.id}
        />
      )}
    </div>
  );
};

export const GreenSlider = withStyles({
  root: {
    color: "hsla(78, 100%, 50%, 1)",
    height: 8,
    borderRadius: 4,
  },
  thumb: {
    height: 24,
    width: 24,
    background: Gradient.Green,
    border: "none",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    marginTop: -7,
  },
  mark: {
    marginTop: 3,
    backgroundColor: Color.Mint,
  },
  track: {
    background: Gradient.Green,
    height: 8,
    borderRadius: 4,
  },
  rail: {
    background: Gradient.Green,
    height: 8,
    borderRadius: 4,
  },
  valueLabel: {
    marginLeft: "12px",
    "& span": {
      background: "#EFF2F8",
      color: "#707582",
      fontFamily: "Agrandir",
      fontSize: "14px",
    },
  },
})(Slider);

export default Feed;
