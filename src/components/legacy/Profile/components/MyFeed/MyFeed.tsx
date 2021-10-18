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

import FeedItem from "./FeedItem/FeedItem";

import "./MyFeed.css";

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

const MyFeed = (props: any) => {
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [status, setStatus] = useState<any>("");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  // pagination
  const [lastId, setLastId] = useState<any>(null);
  const [lastCollection, setLastCollection] = useState<any>('community');
  const [hasMore, setHasMore] = useState<any>(true);

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
        lastId,
        lastCollection,
      },
    };
    axios
      .get(`${URL()}/user/feed/getPosts`, config)
      .then(res => {
        const resp = res.data;
        console.log("-------------------feed--------------", res)
        if (resp.success) {
          let data = [...resp.data];

          if (users && users.length > 0) {
            users.forEach(user => {
              data.forEach((post, index) => {
                if (user.id === post.createdBy) {
                  data[index].userImageURL = user.imageURL;
                  data[index].userName = user.name;
                }
              });
            });
          }

          data.forEach((post, index) => {
            if (post.hasPhoto) {
              data[index].imageURL = `${URL()}/user/wall/getPostPhoto/${post.id}`;
            }
          });

          data.sort((a, b) => b.schedulePost - a.schedulePost);

          let newPosts = data.filter(wall => wall.selectedFormat === 1);
          // let stories = data.filter(wall => wall.selectedFormat === 0);
          // setStories(stories);

          let oldPosts;
          if (lastId === null) {
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

  return (
    <div className="myFeedProfile">
      <div className="firstRowMyFeed">
        <div className="headerMyFeed">Latest Feed posts</div>
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
        <div className="feed-items">
          <MasonryGrid
            data={posts}
            renderItem={(item, index) => (
              <FeedItem
                item={item}
                imageUrl={item.hasPhoto ? `${URL()}/${item.urlItem}/wall/getPostPhoto/${item.id}` : undefined}
                Creator={item.createdBy}
                key={`feed-item-${index}`}
                itemTypeId={props.userId}
                handleRefresh={() => getPosts()}
              />
            )}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
            gutter={GUTTER}
          />
        </div>
      </InfiniteScroll>
      {posts && posts.length === 0 ? <div>No Posts available</div> : null}
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
};

export default MyFeed;
