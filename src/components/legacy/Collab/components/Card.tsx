import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  ClickAwayListener,
  Grow,
  MenuList,
  Paper,
  Popper,
  Theme,
  makeStyles,
  createStyles,
  withStyles,
  MenuItem,
} from "@material-ui/core";

import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { setSelectedUser } from "store/actions/SelectedUser";
import { HeartIcon, MarkIcon } from "shared/ui-kit/Icons";
import User from "./User";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";

import { ReactComponent as ShareAltSolid } from "assets/icons/share-alt-solid.svg";

const CollabText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

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

const Card = (props: any) => {
  const { projectType, className } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { shareMediaToSocial } = useShareMedia();

  const [item, setItem] = useState<any>({});
  const [upvotes, setUpvotes] = useState<number>(0);
  const [upvoted, setUpvoted] = useState<boolean>(false);
  const [reacted, setReacted] = useState<boolean>(false);
  const [openShareMenu, setOpenShareMenu] = useState<boolean>(false);
  const userSelector = useSelector((state: RootState) => state.user);
  const anchorShareMenuRef = useRef<any>(null);

  useEffect(() => {
    if (props.project) {
      setItem(props.project);
    }
  }, [props.project]);
  const handleLikeCard = () => {
    const body = {
      collabAddress: item.CollabId,
      userAddress: userSelector.id,
    };
    axios
      .post(`${URL()}/collab/like`, body)
      .then(res => {
        const itemCopy = { ...item };
        itemCopy.Likes = res.data.collabLikes;
        setItem({ ...itemCopy });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleUpVote = () => {
    const body = {
      CollabId: props.project.CollabId,
      User: userSelector.id,
    };
    axios.post(`${URL()}/collab/upvote`, body).then(res => {
      setUpvotes(upvotes + 1);
      setUpvoted(true);
    });
  };

  const handleReact = () => {
    const body = {
      CollabId: props.project.CollabId,
      User: userSelector.id,
    };
    axios.post(`${URL()}/collab/react`, body).then(res => {
      setReacted(true);
    });
  };

  const liked = item.Likes && item.Likes.find(like => like.userId === userSelector.id);

  const isBookmarked = () => {
    if (item.Bookmarks) {
      if (item.Bookmarks.some(bookmark => bookmark.userId === userSelector.id)) {
        return true;
      }
    }

    return false;
  };

  const handleBookmark = e => {
    const itemCopy = { ...item };
    itemCopy.collabAddress = item.CollabId;
    itemCopy.userAddress = userSelector.id;
    itemCopy.bookmarked = !isBookmarked();

    let path = "/collab/bookmark";
    axios
      .post(`${URL()}` + path, itemCopy)
      .then(response => {
        if (response.data.success) {
          if (itemCopy.bookmarked) {
            if (itemCopy.Bookmarks) {
              if (!itemCopy.Bookmarks.some(bookmark => bookmark.userId === userSelector.id)) {
                itemCopy.Bookmarks.push({ userId: userSelector.id, date: new Date() });
              }
            } else itemCopy.Bookmarks = [{ userId: userSelector.id, date: new Date() }];
          } else {
            if (itemCopy.Bookmarks) {
              itemCopy.Bookmarks = itemCopy.Bookmarks.filter(bookmark => bookmark.userId !== userSelector.id);
            }
          }

          setItem(itemCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
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

  const handleListKeyDownShareMenu = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  };

  const handleOpenShareModal = () => {
    shareMediaToSocial(item.CollabId, "Collab");
  };

  // const handleOpenQRCodeModal = () => {
  //   shareMediaWithQrCode(item.CollabId, `media/${selectedMedia?.id}`);
  // };

  return (
    <div className={className}>
      <div className={`project-card ` + projectType}>
        {props.project.CollaboratorsData && props.project.CollaboratorsData.length > 0 ? (
          <>
            <User {...props} handleUpVote={handleUpVote} reacted={reacted} handleReact={handleReact} />
            <CollabText className="collab-text">
              <span className="text-row">
                <label>I want </label>
                <span
                  onClick={() => {
                    if (
                      props.project.CollaboratorsData[0] &&
                      props.project.CollaboratorsData[0].userId &&
                      !props.project.CollaboratorsData[0].isTwitterUser
                    ) {
                      history.push(`/profile/${props.project.CollaboratorsData[0].userId}`);
                      dispatch(setSelectedUser(props.project.CollaboratorsData[0].userId));
                    } else if (
                      props.project.CollaboratorsData[0] &&
                      props.project.CollaboratorsData[0].isTwitterUser
                    ) {
                      const newWindow = window.open(
                        "https://twitter.com/" + props.project.CollaboratorsData[0].userId,
                        "_blank",
                        "noopener,noreferrer"
                      );
                      if (newWindow) newWindow.opener = null;
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {props.project.CollaboratorsData[0].userSlug.indexOf("@") === 0
                    ? `${props.project.CollaboratorsData[0].userSlug.substring(0, 10)}`
                    : `@${props.project.CollaboratorsData[0].userSlug.substring(0, 10)}`}
                </span>
              </span>
              {props.project.CollaboratorsData.length > 1
                ? props.project.CollaboratorsData.map((collaborator, index) =>
                    index !== 0 ? (
                      <span key={collaborator.userSlug} className="text-row">
                        {index === props.project.CollaboratorsData.length - 1 ? <label>and </label> : ""}
                        <span
                          onClick={() => {
                            if (collaborator.userId && !collaborator.isTwitterUser) {
                              history.push(`/profile/${collaborator.userId}`);
                              dispatch(setSelectedUser(collaborator.userId));
                            } else if (collaborator.userId && collaborator.isTwitterUser) {
                              const newWindow = window.open(
                                "https://twitter.com/" + collaborator.userId,
                                "_blank",
                                "noopener,noreferrer"
                              );
                              if (newWindow) newWindow.opener = null;
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {collaborator.userSlug.indexOf("@") === 0
                            ? `${collaborator.userSlug.substring(0, 10)}`
                            : `@${collaborator.userSlug.substring(0, 10)}`}
                        </span>
                        {index < props.project.CollaboratorsData.length - 1 ? `, ` : ""}
                      </span>
                    ) : null
                  )
                : null}
              <span className="text-row">
                <label>to </label>
                <span style={{ padding: "5px" }}>
                  <label>{props.project.Idea}</label>
                </span>
              </span>
              <span className="text-row">
                <label>on </label>
                <a href={props.project.Platform.website}>
                  <label>{props.project.Platform.name}</label>
                </a>
              </span>
            </CollabText>
            <div className="social-wrapper">
              <div className="div-likes">
                <span>
                  💜 Likes <b>{item.Likes ? item.Likes.length : 0}</b>
                </span>
              </div>
              <div className="social-buttons">
                <MarkIcon onClick={handleBookmark} fill={isBookmarked() ? "black" : "none"} />
                <ShareAltSolid
                  onClick={handleToggleShareMenu}
                  ref={anchorShareMenuRef}
                  style={{ width: "14px" }}
                />
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
                            {/* <CustomMenuItem onClick={handleOpenQRCodeModal}>
                              <img
                                src={require("assets/icons/qrcode_small.png")}
                                alt={"spaceship"}
                                style={{ width: 20, height: 20, marginRight: 5 }}
                              />
                              Share With QR Code
                            </CustomMenuItem> */}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
                <HeartIcon onClick={handleLikeCard} fill={liked ? "black" : "none"} />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default styled(Card)`
  .project-card {
    width: 100%;
    height: 260px;
    // min-width: 310px
    background-color: transparent;
    border-radius: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 26px;
    display: flex;
    justify-content: left;
    align-items: flex-start;
    flex-direction: column;
    @media screen and (max-width: 992px) {
      padding: 18px;
    }
  }
  .project-card:hover {
    color: #fff !important;
    background: linear-gradient(97.4deg, #23d0c6 73.68%, #00cc8f 85.96%);
  }
  .social-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .div-likes {
    span {
      color: #949bab;
      b {
        color: #181818;
      }
    }
  }
  .project-card:hover .div-likes {
    span {
      color: white;
      b {
        color: white;
      }
    }
  }
  .social-buttons {
    margin-left: auto;
    order: 2;
    width: 105px;
    height: 32px;
    background: #ffffff;
    border: 2px solid #ffffff;
    border-radius: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #181818;

    svg {
      margin: 0 4px;
      path {
        color: black;
      }
      :hover {
        cursor: pointer;
      }
    }
  }
  .project-card .text-row {
    font-size: 18px;
    font-weight: 400;
    font-family: Agrandir, sans-serif;
    line-height: 100%;
  }

  .project-card .user-images {
    display: flex;
    flex-direction: row-reverse;
    align-self: flex-start;
  }

  .project-card .collab-text {
    margin: auto;
  }

  .project-card .collab-text span span,
  .project-card .collab-text a {
    background: linear-gradient(97.4deg, #29e8dc 14.43%, #03eaa5 79.45%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-decoration: none;
  }

  .project-card:hover .collab-text span,
  .project-card:hover .collab-text a,
  .project-card:hover p {
    background: none;
    -webkit-background-clip: inherit;
    -webkit-text-fill-color: inherit;
    text-decoration: none;
    color: white;
  }

  .project-card:hover .collab-text span span,
  .project-card:hover .collab-text a {
    font-weight: 700;
  }

  .project-card .collab-text span.no-styled {
    color: #656e7e;
  }

  .project-card .row svg {
    margin-left: 10px;
  }

  .project-card .user {
    border-top: 1px solid hsla(218, 11%, 45%, 0.3);
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .project-card .user p {
    color: #081831;
    margin: 0;
  }

  .project-card .user .user-image {
    width: 30px;
    height: 30px;
    min-width: 30px;
    border-radius: 15px;
    margin-right: 10px;
    background-color: #656e7e;
  }

  .project-card .user .row {
    display: flex;
    align-items: center;
  }

  .project-card p {
    max-width: 60%;
    line-height: 20px;
    color: #656e7e;
    text-align: justify;
    white-space: pre-line;
  }

  .project-card button {
    padding: 10px 30px;
    align-self: center;
  }

  /* trending */
  .project-card.trending {
    margin: 0 !important;
  }

  .project-card.trending:hover {
    color: #fff !important;
    background: linear-gradient(97.4deg, #ec3be9 100%, #ec3be9 100%);
  }

  .project-card.trending .collab-text span span,
  .project-card.trending .collab-text a {
    background: linear-gradient(97.4deg, #ec3be9 100%, #ec3be9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-decoration: none;
  }

  .project-card.trending:hover .collab-text span,
  .project-card.trending:hover .collab-text a,
  .project-card.trending:hover p {
    background: none;
    -webkit-background-clip: inherit;
    -webkit-text-fill-color: inherit;
    text-decoration: none;
    color: white;
  }

  .project-card.trending:hover .collab-text span span,
  .project-card.trending:hover .collab-text a {
    background: none;
    font-weight: 700;
  }

  .project-card.trending .user p {
    color: white;
  }

  .project-card.trending p {
    color: rgba(227, 233, 239, 1);
    max-height: 120px;
    overflow: hidden;
    white-space: pre-line;
    text-overflow: ellipsis;
  }

  .project-card.trending:hover p {
    background: none;
    -webkit-background-clip: inherit;
    -webkit-text-fill-color: inherit;
  }

  .project-card.trending button {
    color: #081831;
    background-color: white;
  }

  .project-card.trending .collab-text span.no-styled {
    color: rgba(227, 233, 239, 1);
  }

  /* my collabs */

  .project-card.mycollabs {
    background-color: #656e7e;
    color: white;
  }

  .project-card.mycollabs .user {
    border-top: 1px solid hsla(0, 0%, 100%, 0.2);
  }

  .project-card.trending .user p,
  .project-card.mycollabs .user p {
    color: white;
  }

  .project-card.trending p {
    color: rgba(227, 233, 239, 1);
    max-height: 120px;
    overflow: hidden;
    white-space: pre-line;
    text-overflow: ellipsis;
  }

  .project-card.trending button {
    color: #081831;
    background-color: white;
  }

  .project-card.trending .collab-text span.no-styled {
    color: rgba(227, 233, 239, 1);
  }
`;
