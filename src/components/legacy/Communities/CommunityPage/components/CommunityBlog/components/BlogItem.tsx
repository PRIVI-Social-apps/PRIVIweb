import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import SvgIcon from "@material-ui/core/SvgIcon";
import {
  ClickAwayListener,
  Grow,
  MenuList,
  Paper,
  Popper,
  MenuItem,
  withStyles,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";

import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { updateTask } from "shared/functions/updateTask";
import { RootState } from "store/reducers/Reducer";
import WallPostModal from "../../../modals/WallPost/WallPostModal";
import URL from "shared/functions/getURL";
import { PrimaryButton } from "shared/ui-kit";

import { ReactComponent as ListSolid } from "assets/icons/list-solid.svg";
import { ReactComponent as ListAltSolid } from "assets/icons/list-alt-solid.svg";
import { ReactComponent as ShareAltSolid } from "assets/icons/share-alt-solid.svg";
import { ReactComponent as HeartSolid } from "assets/icons/heart-solid.svg";
import { ReactComponent as HeartRegular } from "assets/icons/heart-regular.svg";
import BlogIcon from "assets/icons/blog_icon.png";
import BlogMark from "assets/icons/blog_mark.png";

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    paper: {
      width: 267,
      marginRight: -267,
      marginLeft: -90,
      borderRadius: 10,
      boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
      position: "inherit",
    },
  })
);

export default function BlogItem(props) {
  const classes = useStyles();
  let userSelector = useSelector((state: RootState) => state.user);
  const { shareMediaToSocial } = useShareMedia();

  const [item, setItem] = useState<any>({});
  const [days, setDays] = useState<number>(0);

  const [openModalWallPost, setOpenModalWallPost] = useState<boolean>(false);
  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);

  const handleOpenModalWallPost = () => {
    setOpenModalWallPost(true);
  };
  const handleCloseModalWallPost = () => {
    setOpenModalWallPost(false);
  };

  useEffect(() => {
    setItem(props.item);

    if (props.item.createdAt) {
      let time = new Date().getTime() - new Date(props.item.createdAt).getTime();
      setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLike = () => {
    if (item.likes && item.likes.includes(userSelector.id) > 0) {
      return true;
    }
    return false;
  };

  const getLikesCount = () => {
    if (item && item.numLikes) {
      if (item.numLikes < 1000) {
        return item.numLikes;
      } else {
        return (item.numLikes - (item.numLikes % 100)) / 1000 + "K";
      }
    }

    return 0;
  };

  const likePost = (item: any) => {
    axios
      .post(`${URL()}/community/blog/likePost`, {
        itemPostId: item.id,
        userId: userSelector.id,
        userName: `${userSelector.firstName} ${userSelector.lastName}`,
      })
      .then(response => {
        if (response.data.success) {
          updateTask(userSelector.id, "Give 1st cred");
          let data = response.data.data;

          let itemCopy = { ...item };
          itemCopy.likes = data.likes;
          itemCopy.dislikes = data.dislikes;
          itemCopy.numLikes = data.numLikes;
          itemCopy.numDislikes = data.numDislikes;
          setItem(itemCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const dislikePost = (item: any) => {
    axios
      .post(`${URL()}/community/blog/dislikePost`, {
        itemPostId: item.id,
        userId: userSelector.id,
        userName: `${userSelector.firstName} ${userSelector.lastName}`,
      })
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;

          let itemCopy = { ...item };
          itemCopy.likes = data.likes;
          itemCopy.dislikes = data.dislikes;
          itemCopy.numLikes = data.numLikes;
          itemCopy.numDislikes = data.numDislikes;
          setItem(itemCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getRandomAvatarNumber = () => {
    const random = Math.floor(Math.random() * 100);
    if (random < 10) {
      return `00${random}`;
    }

    return `0${random}`;
  };

  const handleToggleShareMenu = e => {
    e.stopPropagation();
    e.preventDefault();

    setOpenShareMenu(prevShareMenuOpen => !prevShareMenuOpen);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenShareMenu(false);
  };

  const handleOpenShareModal = () => {
    shareMediaToSocial(item.id, "Community");
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const isListed = () => {
    if (item.Catalog) {
      if (item.Catalog.some(listItem => listItem.userId === userSelector.id)) {
        return true;
      }
    }

    return false;
  };

  const handleList = e => {
    e.stopPropagation();
    e.preventDefault();

    const itemCopy = { ...item };
    itemCopy.userAddress = userSelector.id;
    itemCopy.cataloged = !isListed();

    let path = "/community/blog/catalog";
    axios
      .post(`${URL()}` + path, itemCopy)
      .then(response => {
        if (response.data.success) {
          if (itemCopy.cataloged) {
            if (itemCopy.Catalog) {
              if (!itemCopy.Catalog.some(listItem => listItem.userId === userSelector.id)) {
                itemCopy.Catalog.push({ userId: userSelector.id, date: new Date() });
              }
            } else itemCopy.Catalog = [{ userId: userSelector.id, date: new Date() }];
          } else {
            if (itemCopy.Catalog) {
              itemCopy.Catalog = itemCopy.Catalog.filter(listItem => listItem.userId !== userSelector.id);
            }
          }

          setItem(itemCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className="blog-item-container clickable">
      <div className="blog-item">
        <img
          className="blog-image"
          src={item.id ? `${URL()}/community/blog/getPostPhoto/${item.id}` : "none"}
          alt="blog"
        />
        <div className="users">
          <div
            className={"creator_avatar"}
            style={{
              backgroundImage: item.creatorInfo?.imageURL
                ? `url(${item.creatorInfo.imageURL})`
                : `url(${URL()}/assets/anonAvatars/ToyFaces_Colored_BG_${getRandomAvatarNumber()})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "32px",
              height: "32px",
            }}
          />
        </div>
        <div className="right">
          <div className="bottomToolContainer">
            <div className="listIcon" onClick={handleList}>
              <SvgIcon>{isListed() ? <ListAltSolid /> : <ListSolid />}</SvgIcon>
            </div>
            <span className="commonIcon" onClick={handleToggleShareMenu} ref={anchorShareMenuRef}>
              <SvgIcon>
                <ShareAltSolid />
              </SvgIcon>
            </span>
            <Popper
              open={openShareMenu}
              anchorEl={anchorShareMenuRef.current}
              transition
              disablePortal={false}
              style={{ position: "inherit" }}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                    position: "inherit",
                  }}
                >
                  <Paper className={classes.paper}>
                    <ClickAwayListener onClickAway={handleCloseShareMenu}>
                      <MenuList
                        autoFocusItem={openShareMenu}
                        id="menu-list-grow"
                        onKeyDown={handleListKeyDownShareMenu}
                      >
                        <CustomMenuItem onClick={handleOpenShareModal}>
                          <img
                            src={require("assets/icons/butterfly.png")}
                            alt={"spaceship"}
                            style={{ width: 20, height: 20, marginRight: 5 }}
                          />
                          Share on social media
                        </CustomMenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            <div
              className="commonIcon"
              onClick={() => {
                isLike() ? dislikePost(item) : likePost(item);
              }}
            >
              <SvgIcon>{isLike() ? <HeartSolid /> : <HeartRegular />}</SvgIcon>
              <span>{getLikesCount()}</span>
            </div>
          </div>
          <img src={BlogIcon} style={{ width: "50px", objectFit: "contain" }} alt="blogIcon" />
          <div className="rowNameDate">
            <h3>{item.name ? item.name : "Untitled Blog"}</h3>
          </div>
          <div className="description">{item.description}</div>
          <div className="bottomRow">
            <div className={"blogMark"}>
              <img src={BlogMark} alt="blogMark" />
            </div>
            <PrimaryButton size="small" onClick={handleOpenModalWallPost}>
              Continue Reading
            </PrimaryButton>
          </div>
        </div>
      </div>
      {/*modals*/}
      <WallPostModal
        open={openModalWallPost}
        onClose={handleCloseModalWallPost}
        wallPost={item}
        creatorInfo={item.creatorInfo}
        type={"Community"}
        like={() => likePost(item)}
        dislike={() => dislikePost(item)}
        isLike={isLike}
        isListed={isListed}
        handleList={handleList}
      />
    </div>
  );
}
