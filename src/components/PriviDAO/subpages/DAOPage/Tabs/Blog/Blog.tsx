import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { RootState } from "store/reducers/Reducer";

import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import { TitleGrandLight } from "../../index.styles";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import Cards from "components/PriviDAO/components/Cards";
import CreateBlogPostModal from "./modals/Create-Blog/CreateBlogPostModal";
import { Box } from "@material-ui/core";

export default function CommunityBlog({ communityId, community }) {
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [blogPostLoading, setBlogPostLoading] = useState(false);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  const [openCreateBlogModal, setOpenCreateBlogModal] = useState<boolean>(false);

  const handleOpenCreateBlogModal = () => {
    setOpenCreateBlogModal(true);
  };
  const handleCloseCreateBlogModal = () => {
    setOpenCreateBlogModal(false);
  };

  useEffect(() => {
    loadBlogPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, community]);

  const loadBlogPosts = () => {
    setBlogPostLoading(true);

    axios
      .get(`${URL()}/community/blog/getBlogPosts/${communityId}`)
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
    <>
      <Box display="flex" alignItems="center" width="100%" justifyContent="space-between" mb={5}>
        <TitleGrandLight fontSize="30px" disableUppercase bold>
          Latest blogs
        </TitleGrandLight>
        <DAOButton onClick={handleOpenCreateBlogModal}>Create new Post</DAOButton>
      </Box>
      <LoadingWrapper loading={blogPostLoading}>
        {blogPosts.length > 0 ? (
          <Cards cardType="Blog" cards={blogPosts} />
        ) : (
          <TitleGrandLight fontSize="14px">No Blog posts to display</TitleGrandLight>
        )}
      </LoadingWrapper>
      <CreateBlogPostModal
        open={openCreateBlogModal}
        onClose={handleCloseCreateBlogModal}
        communityId={community.CommunityAddress}
        type={"Post"}
        handleRefresh={loadBlogPosts}
      />
    </>
  );
}
