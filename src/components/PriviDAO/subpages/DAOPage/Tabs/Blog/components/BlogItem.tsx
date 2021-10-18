import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Box } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import BlogPostModal from "../modals/Blog-Post/BlogPostModal";
import URL from "shared/functions/getURL";
import { SecondaryButton } from "shared/ui-kit";

import cls from "classnames";
import styles from "components/PriviDAO/components/Cards/DAOCard/index.module.css";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";

export default function item({ item }) {
  let users = useSelector((state: RootState) => state.usersInfoList);

  const [usersList, setUsersList] = useState<string[]>([]);
  const [onHover, setOnHover] = useState<boolean>(false);

  const [openBlogPostModal, setOpenBlogPostModal] = useState<boolean>(false);

  const handleOpenBlogPostModal = () => {
    setOpenBlogPostModal(true);
  };
  const handleCloseBlogPostModal = () => {
    setOpenBlogPostModal(false);
  };

  useEffect(() => {
    if (item && users && users.length > 0) {
      let ul = [] as any;
      let user: any = users.find(usr => usr.id === item.createdBy);
      if (user && user.imageURL) {
        ul.push(user.imageURL);
      } else {
        ul.push(getRandomAvatar());
      }

      if (item.responses) {
        item.responses.forEach(r => {
          if (ul.length < 4) {
            let user: any = users.find(usr => usr.id === r.userId);
            if (!ul.includes(user?.imageURL)) {
              if (user && user.imageURL) {
                ul.push(user.imageURL);
              } else {
                ul.push(getRandomAvatar());
              }
            }
          }
        });
      }

      setUsersList(ul);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, users]);

  return (
    <Box
      className={styles.cardContainer}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
      color="white"
      style={{ cursor: "inherit" }}
    >
      <div className={styles.card}>
        <div
          className={styles.cardCover}
          style={
            item.dimensions
              ? {
                  height: 0,
                  paddingBottom: `${
                    (item.dimensions.height / item.dimensions.width) * 100 >= 120
                      ? (item.dimensions.height / item.dimensions.width) * 100
                      : 120
                  }%`,
                }
              : {
                  height: "272px",
                }
          }
        >
          <div className={styles.aspectRatioWrapper}>
            {item.hasPhoto && item.id ? (
              <img
                className={styles.image}
                src={`${URL()}/community/blog/getPostPhoto/${item.id}`}
                alt={item.name}
              />
            ) : (
              <div className={styles.image} />
            )}
          </div>

          <div className={cls({ [styles.hidden]: !onHover }, styles.aspectRatioWrapper)}>
            <div className={styles.content}>
              {usersList && usersList.length > 0 && (
                <Box mb={3} display="flex" alignItems="center">
                  {usersList.map((u, i) => (
                    <div
                      key={`user-${i}`}
                      className={styles.avatar}
                      style={{
                        backgroundImage: u !== "" ? `url(${u})` : "none",
                        marginRight: "-16px",
                      }}
                    />
                  ))}
                </Box>
              )}

              <Box mb={3} textAlign="center">
                {item.textShort}
              </Box>

              <SecondaryButton size="small" onClick={handleOpenBlogPostModal}>
                Read
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>
      <Box display="flex" flexDirection="column" alignItems="center">
        <h5 style={{ fontSize: "Agrandir GrandLight" }}>{item.name}</h5>
      </Box>
      <BlogPostModal open={openBlogPostModal} onClose={handleCloseBlogPostModal} post={item} />
    </Box>
  );
}
