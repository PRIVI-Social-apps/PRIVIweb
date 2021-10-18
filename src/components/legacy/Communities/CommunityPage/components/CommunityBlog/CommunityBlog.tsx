import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { RootState } from "store/reducers/Reducer";
import { BlogColumnsLayout } from "./components/BlogColumnsLayout";

import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import "./CommunityBlog.css";
import { PrimaryButton } from "shared/ui-kit";

export default function CommunityBlog(props: any) {
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [blogPostLoading, setBlogPostLoading] = useState(false);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    loadBlogPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, props.community]);

  const loadBlogPosts = () => {
    setBlogPostLoading(true);

    axios
      .get(`${URL()}/community/blog/getBlogPosts/${props.communityId}`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          let data = [...resp.data];

          if (users && users.length > 0) {
            data.forEach((post, index) => {
              if (users.some(user => user.id === post.createdBy)) {
                const user = users[users.findIndex(user => user.id === post.createdBy)];
                data[index].creatorInfo = {
                  name: user.name || "",
                  imageURL: user.imageURL || "",
                  urlSlug: user.urlSlug || "",
                  level: user.level || 1,
                };
              }
            });
          }

          setBlogPosts(data);
        } else {
          console.log("Error getting blog posts");
        }
        setBlogPostLoading(false);
      })
      .catch(() => {
        setBlogPostLoading(false);
      });
  };

  return (
    <div className="community-blog">
      <div className="create-blog">
        <PrimaryButton size="medium" onClick={props.handleOpenModalNewBlogPost}>+ Create Blog</PrimaryButton>
      </div>
      <h3>Latest blogs</h3>
      <LoadingWrapper loading={blogPostLoading}>
        <div className="posts">
          {blogPosts && blogPosts.length > 0 ? <BlogColumnsLayout data={blogPosts} /> : <p>No blogs</p>}
        </div>
      </LoadingWrapper>
    </div>
  );
}
