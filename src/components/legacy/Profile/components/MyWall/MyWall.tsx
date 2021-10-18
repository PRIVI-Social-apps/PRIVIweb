import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { Modal } from "@material-ui/core";
import styled from "styled-components";
import axios from "axios";

import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import URL from "shared/functions/getURL";
import WallItem from "shared/ui-kit/Page-components/WallItem";
import { RootState } from "store/reducers/Reducer";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { CircularLoadingIndicator, PrimaryButton } from "shared/ui-kit";

import CreatePostModal from "../../../Communities/CommunityPage/modals/Create-Post/CreatePostModal";
import "./MyWall.css";

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

const GUTTER = "16px";

const MyWall = (props: any) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [posts, setPosts] = useState<any[]>([]);
  //const [stories, setStories] = useState<any[]>([]);
  const [status, setStatus] = useState<any>("");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  // pagination
  const [pagination, setPagination] = useState<any>(1);
  const [lastId, setLastId] = useState<any>(null);
  const [hasMore, setHasMore] = useState<any>(true);

  const [openModalNewCreditPoolPost, setOpenModalCreditPoolPost] = useState<boolean>(false);
  const handleOpenModalNewCreditPoolPost = () => {
    setOpenModalCreditPoolPost(true);
  };
  const handleCloseModalNewCreditPoolPost = () => {
    getPosts();
    setOpenModalCreditPoolPost(false);
  };

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const getPosts = () => {
    if (isDataLoading) return;
    setIsDataLoading(true);
    const config = {
      params: {
        userId: props.userId,
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
              let mediaUrl = `${URL()}/user/wall/getPostPhoto/${post.id}`;

              data[index].imageURL = mediaUrl;

              try {
                run(mediaUrl).then(dim => {
                  data[index].dimensions = dim;
                });
              } catch (e) {
                console.log(e);
              }
            }

            if (users && users.length > 0) {
              const thisUser = users.find(user => user.id === post.createdBy);
              if (thisUser) {
                data[index].userImageURL = thisUser.imageURL;
                data[index].userName = thisUser.name;
                return;
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
          //let stories = data.filter(wall => wall.selectedFormat === 0);
          //setStories(stories);
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

  return (
    <div className="myWallProfile">
      <div className="firstRowMyWall">
        <div className="headerMyWall">Latest Wall posts</div>
        <div className="buttonCreateNewMyWall">
          <PrimaryButton size="medium" onClick={() => handleOpenModalNewCreditPoolPost()}>
            Create new
          </PrimaryButton>
        </div>
      </div>
      <InfiniteScroll
        hasChildren={posts.length > 0}
        dataLength={posts.length}
        scrollableTarget="profile-infite-scroll"
        next={getPosts}
        hasMore={hasMore}
        loader={
          <LoadingIndicatorWrapper>
            <CircularLoadingIndicator />
          </LoadingIndicatorWrapper>
        }
      >
        <div className="wall-container">
          <MasonryGrid
            data={posts || []}
            renderItem={(item, index) => (
              <WallItem
                item={item}
                imageUrl={item.hasPhoto ? `${URL()}/user/wall/getPostPhoto/${item.id}` : ""}
                Creator={item.createdBy}
                key={`wall-item-${index}`}
                type={"UserPost"}
                itemTypeId={props.userId}
                admin={item.createdBy === userSelector.id}
                handleRefresh={() => getPosts()}
                index={index}
              />
            )}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
            gutter={GUTTER}
          />
        </div>
      </InfiniteScroll>
      {posts && posts.length === 0 ? <div>No posts available</div> : null}

      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}

      <CreatePostModal
        open={openModalNewCreditPoolPost}
        handleClose={handleCloseModalNewCreditPoolPost}
        userId={props.userId}
        type={"UserPost"}
        handleRefresh={getPosts}
      />
    </div>
  );
};

export default MyWall;
