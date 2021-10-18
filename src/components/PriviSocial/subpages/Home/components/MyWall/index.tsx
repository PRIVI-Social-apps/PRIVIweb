import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";

import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { RootState } from "store/reducers/Reducer";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { CircularLoadingIndicator } from "shared/ui-kit";

import Box from "shared/ui-kit/Box";
import { SocialPrimaryButton } from "components/PriviSocial/index.styles";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import CreateWallPostModal from "./CreateWallPostModal";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import WallFeedCard from "components/PriviSocial/components/Cards/WallFeedCard";
import { Grid, makeStyles } from "@material-ui/core";

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 50px;
`;

const COLUMNS_COUNT_BREAK_POINTS = {
  675: 1,
  900: 2,
  1200: 3,
};

const GUTTER = "40px";

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.userId === currProps.userId && prevProps.userProfile === currProps.userProfile;
};

const useStyles = makeStyles(theme => ({
  wallPostOption: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "flex-start",
      marginTop: theme.spacing(2),
    },
  },
}));

const MyWall = React.memo(
  ({ userId, userProfile, handleBack }: { userId: string; userProfile: any; handleBack: () => void }) => {
    const classes = useStyles();
    const user = useSelector((state: RootState) => state.user);
    const users = useSelector((state: RootState) => state.usersInfoList);

    const [posts, setPosts] = useState<any[]>([]);
    const [status, setStatus] = useState<any>("");
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

    const [superFollowersAllowed, setSuperFollowersAllowed] = useState<boolean>(false);

    const [openCreateWallPostModal, setOpenCreateWallPostModal] = useState<boolean>(false);

    const handleOpenCreateWallPostModal = () => {
      setOpenCreateWallPostModal(true);
    };
    const handleCloseCreateWallPostModal = () => {
      setOpenCreateWallPostModal(false);
    };

    // pagination
    const [lastId, setLastId] = useState<any>(null);
    const [hasMore, setHasMore] = useState<any>(true);

    useEffect(() => {
      if (userId) {
        getPosts();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users, userId]);

    useEffect(() => {
      //TODO: update on backend and set who can post on user's wall
    }, [superFollowersAllowed]);

    const getPosts = () => {
      if (isDataLoading) return;
      setIsDataLoading(true);
      const config = {
        params: {
          userId: userId,
          lastId: lastId,
        },
      };
      axios
        .get(`${URL()}/user/wall/getUserPosts`, config)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            let data = [...resp.data];

            data.forEach(async (post, index) => {
              if (post.hasPhoto) {
                let mediaUrl = post.url;

                try {
                  run(mediaUrl).then(dim => {
                    data[index].dimensions = dim;
                  });
                } catch (e) {
                  console.log(e);
                }
              }

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
                  data[index].userImageURL = thisUser.url ?? thisUser.imageURL;
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
            });

            data.sort((a, b) => b.schedulePost - a.schedulePost);
            data.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : b.pinned));

            let newPosts = data.filter(wall => wall.selectedFormat === 1);

            let oldPosts;
            if (lastId === null) {
              oldPosts = [];
            } else {
              oldPosts = [...posts];
            }

            setHasMore(resp.hasMore);
            setLastId(resp.lastId);
            setPosts([...oldPosts, ...newPosts]);
          } else {
            setStatus({
              msg: resp.error,
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

      async function run(url) {
        let img: any = await getMeta(url);

        let w = img.width;
        let h = img.height;

        return { height: h, width: w };
      }
    };

    function getMeta(url) {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject();
        img.src = url;
      });
    }

    if (userId)
      return (
        <>
          <Box
            mt={"80px"}
            mb="16px"
            onClick={handleBack}
            style={{ cursor: "pointer" }}
            display="flex"
            alignItems="center"
          >
            <img width="5px" height="10px" src={require("assets/icons/arrow_gray.png")} />
            <Box ml="8px" fontSize="14px">
              Back
            </Box>
          </Box>
          {user.id === userId && (
            <Box className={classes.wallPostOption} mb={2}>
              <Box fontSize="14px" mr={"24px"} alignItems="center" display="flex">
                <img
                  src={require("assets/icons/yellow_star.svg")}
                  alt="star"
                  width="24px"
                  style={{ marginRight: "8px" }}
                />
                {superFollowersAllowed
                  ? "Only your superfollowers can post to your Wall"
                  : "Everyone can post to your wall"}
              </Box>
              <CustomSwitch
                checked={superFollowersAllowed}
                onChange={() => setSuperFollowersAllowed(!superFollowersAllowed)}
                theme="green"
              />
            </Box>
          )}
          <Box display="flex" alignItems="center" mb={2}>
            <Box fontWeight={800} fontSize="22px" mr={"40px"}>
              Latest Wall Post
            </Box>
            <SocialPrimaryButton onClick={handleOpenCreateWallPostModal}>Create New</SocialPrimaryButton>
          </Box>
          <InfiniteScroll
            hasChildren={posts.length > 0}
            dataLength={posts.length}
            scrollableTarget="profile-infite-scroll"
            next={getPosts}
            hasMore={hasMore}
            loader={
              <LoadingIndicatorWrapper>
                <CircularLoadingIndicator theme={"green"} />
              </LoadingIndicatorWrapper>
            }
          >
            <>
              <MasonryGrid
                data={posts}
                renderItem={(item, index) => (
                  <WallFeedCard userProfile={userProfile} item={item} key={`feed-item-${index}`} />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                gutter={GUTTER}
              />
            </>
          </InfiniteScroll>
          {posts && posts.length === 0 ? <div>No Posts available</div> : null}
          {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}

          <CreateWallPostModal
            open={openCreateWallPostModal}
            handleClose={handleCloseCreateWallPostModal}
            userId={userId}
            type={"UserPost"}
            handleRefresh={getPosts}
          />
        </>
      );
    else return null;
  },
  arePropsEqual
);

export default MyWall;
