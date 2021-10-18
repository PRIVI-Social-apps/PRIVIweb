import React, { useEffect, useRef, useState } from "react";
import { Avatar, Modal } from "shared/ui-kit";
import styles from "./index.module.css";
import Moment from "react-moment";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import Axios from "axios";
import SvgIcon from "@material-ui/core/SvgIcon";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { withStyles } from "@material-ui/styles";
import { ClickAwayListener, Grow, MenuItem, Popper, MenuList, Paper } from "@material-ui/core";
import { ReactComponent as ShareAltSolid } from "assets/icons/share.svg";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { setSelectedUser } from "store/actions/SelectedUser";
import { useHistory } from "react-router-dom";
import { GreenText } from "components/PriviSocial/index.styles";
import MorePicturesModal from "./MorePicturesModal";
import DiscordVideoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordVideoFullScreen/DiscordVideoFullScreen";
import ReactPlayer from "react-player";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";

const chatGreyIcon = require("assets/icons/message_gray.png");
const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

export default function WallItemModal({ item, open, onClose, comments, setComments }) {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [urlMainPhoto, setUrlMainPhoto] = useState<string>("");

  useEffect(() => {
    item.id &&
      item.videosId &&
      item.videosId[0] &&
      setVideoUrl(`${URL()}/user/wall/getVideo/${item.id}/${item.videosId[0]}`);

    if (item.hasPhoto) {
      setUrlMainPhoto(item?.url ?? item?.imageURL ?? "");
    }
  }, [item]);

  if (item)
    return (
      <Modal isOpen={open} theme="light" size="medium" showCloseIcon onClose={onClose}>
        <WallPostModalContent
          item={item}
          videoUrl={videoUrl}
          urlMainPhoto={urlMainPhoto}
          comments={comments}
          setComments={setComments}
        />
      </Modal>
    );
  else return null;
}

const ResponseWallPost = ({ response }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <Box display="flex" alignItems="center" className={styles.responseContainer}>
      <div className={styles.userCardImageWallPost}>
        <div
          className={styles.authorPhotoWallPost}
          style={{
            backgroundImage: response && response.url ? `url(${response.url}?${Date.now()})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            history.push(`/privi-social/${response.userId}`);
            dispatch(setSelectedUser(response.userId));
          }}
        />
        <Box ml="8px">
          <Box fontSize="18px" fontWeight={800}>
            {response.userName}
          </Box>
          <GreenText fontSize="12px" bold>
            @{response?.urlSlug}
          </GreenText>
        </Box>
      </div>

      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <div className={styles.response}>{response.response}</div>
        <Moment fromNow>{response.date}</Moment>
      </Box>
    </Box>
  );
};

export const WallPostModalContent = ({
  item,
  onlyDisplay,
  videoUrl,
  urlMainPhoto,
  comments,
  setComments,
}: {
  item: any;
  onlyDisplay?: boolean;
  videoUrl: string;
  urlMainPhoto: string;
  comments: any[];
  setComments: any;
}) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const history = useHistory();

  const { shareMediaToSocial } = useShareMedia();

  const [isListed, setIsListed] = useState(false);

  const [response, setResponse] = useState("");
  const [responseLoader, setResponseLoader] = useState(false);

  const [status, setStatus] = useState<any>("");
  const [openShareMenu, setOpenShareMenu] = useState(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);

  const [openMorePicturesModal, setOpenMorePicturesModal] = useState<boolean>(false);
  const handleOpenMorePicturesModal = () => {
    setOpenMorePicturesModal(true);
  };
  const handleCloseMorePicturesModal = () => {
    setOpenMorePicturesModal(false);
  };

  useEffect(() => {
    if (!onlyDisplay) {
      if (item.Catalog) {
        if (item.Catalog.some(listItem => listItem.userId === userSelector.id)) {
          setIsListed(true);
        }
      } else {
        setIsListed(false);
      }
    }
  }, [item]);

  const handleList = e => {
    e.stopPropagation();
    e.preventDefault();

    const itemCopy = { ...item };
    itemCopy.userAddress = userSelector.id;

    let path = "/user/wall/catalog";
    Axios.post(`${URL()}` + path, itemCopy)
      .then(response => {
        if (response.data.success) {
          setIsListed(!isListed);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const makeResponse = () => {
    if (response) {
      let body = {
        blogPostId: item.id,
        userId: userSelector.id,
        userName: userSelector.firstName,
        response: response,
      };
      setResponseLoader(true);
      Axios.post(`${URL()}/user/wall/makeResponse`, body)
        .then(response => {
          if (response.data.success) {
            let responses: any[] = [...response.data.data];

            setComments && setComments(responses);
            setResponse("");
            setResponseLoader(false);
          } else {
            setResponseLoader(false);
            setStatus({
              msg: "Error making request",
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(error => {
          console.log(error);
          setResponseLoader(false);
          setStatus({
            msg: "Error making request",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  };

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      makeResponse();
    }
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
    shareMediaToSocial(item.urlSlug, "userWall", "SOCIAL_APP");
    setOpenShareMenu(false);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const [openModalDiscordVideoFullScreen, setOpenModalDiscordVideoFullScreen] = useState<boolean>(false);
  const handleOpenModalDiscordVideoFullScreen = () => {
    setOpenModalDiscordVideoFullScreen(true);
  };
  const handleCloseModalDiscordVideoFullScreen = () => {
    setOpenModalDiscordVideoFullScreen(false);
  };

  return (
    <>
      <Moment className={styles.date} fromNow>
        {!onlyDisplay ? item?.createdAt : new Date()}
      </Moment>
      {(urlMainPhoto || (item.descriptionImages && item.descriptionImages.length > 0)) && (
        <Box className={styles.postImages} mt="24px">
          {urlMainPhoto && urlMainPhoto !== "" && (
            <div
              className={styles.photoPost}
              style={{
                backgroundImage: `url(${urlMainPhoto})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "center",
                borderRadius:
                  item.descriptionImages && item.descriptionImages.length > 0 ? `67px 0px 0px 67px` : "67px",
              }}
            />
          )}
          {item.descriptionImages && item.descriptionImages.length > 0 && (
            <Box
              className={styles.postDescriptionImages}
              style={{
                marginLeft: urlMainPhoto && urlMainPhoto !== "" ? "4px" : 0,
                flexDirection: urlMainPhoto && urlMainPhoto !== "" ? "column" : "row",
              }}
              width={urlMainPhoto && urlMainPhoto !== "" ? "50%" : "100%"}
            >
              {item.descriptionImages &&
                item.descriptionImages.length > 0 &&
                item.descriptionImages
                  .filter((im, ind) => ind < 2)
                  .map((image, index) => (
                    <div
                      className={styles.photoPost}
                      style={{
                        width: urlMainPhoto && urlMainPhoto !== "" ? "100%" : "50%",
                        backgroundImage: image
                          ? `url(${URL()}/user/wall/getDescriptionPostPhoto/${image})`
                          : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        marginTop: urlMainPhoto && urlMainPhoto !== "" && index === 1 ? "4px" : 0,
                        marginLeft: !urlMainPhoto && index === 1 ? "4px" : 0,
                        height: urlMainPhoto && urlMainPhoto !== "" ? "50%" : "100%",
                        backgroundPosition: "center",
                        borderRadius:
                          index === 0
                            ? urlMainPhoto && urlMainPhoto !== ""
                              ? item.descriptionImages.length > 1
                                ? `0px 67px 0px 0px`
                                : `0px 67px 67px 0px`
                              : item.descriptionImages.length > 1
                                ? `67px 0px 0px 67px`
                                : `67px 67px 67px 67px`
                            : urlMainPhoto && urlMainPhoto !== ""
                              ? "0px 0px 67px 0px"
                              : `0px 67px 67px 0px`,
                      }}
                    />
                  ))}
            </Box>
          )}

          {item.descriptionImages && item.descriptionImages.length > 2 && (
            <div
              className={styles.moreImages}
              style={{
                marginTop: urlMainPhoto && urlMainPhoto !== "" ? "4px" : 0,
                marginLeft: !urlMainPhoto ? "4px" : 0,
                borderRadius: urlMainPhoto && urlMainPhoto !== "" ? "0px 0px 67px 0px" : `0px 67px 67px 0px`,
                height: urlMainPhoto && urlMainPhoto !== "" ? "50%" : "100%",
              }}
              onClick={handleOpenMorePicturesModal}
            >
              +{item.descriptionImages.length - 2}
            </div>
          )}
        </Box>
      )}

      {videoUrl ? (
        <Box mb={3}>
          <ReactPlayer
            onClick={() => {
              handleOpenModalDiscordVideoFullScreen();
            }}
            url={videoUrl}
            className={styles.reactPlayer}
            progressInterval={200}
          />
          <Modal
            size="small"
            className={styles.reactPlayerModal}
            isOpen={openModalDiscordVideoFullScreen}
            onClose={handleCloseModalDiscordVideoFullScreen}
            showCloseIcon
          >
            <DiscordVideoFullScreen onCloseModal={handleCloseModalDiscordVideoFullScreen} url={videoUrl} />
          </Modal>
        </Box>
      ) : null}

      <Box display="flex" alignItems="flex-end" justifyContent="space-between" mb={"48px"}>
        <Box className={styles.userInfo} onClick={() => history.push(`/privi-social/${item.createdBy}`)}>
          <Avatar
            url={
              users.find(u => u.id === item?.createdBy)?.imageURL ??
              getRandomAvatarForUserIdWithMemoization(item?.createdBy)
            }
            size={"large"}
          />
          <Box ml={"36px"}>
            <Box fontSize="22px" fontWeight={800}>
              {users.find(u => u.id === item?.createdBy)?.name ||
                users.find(u => u.id === item?.createdBy)?.urlSlug}
            </Box>
            <Box display="flex" alignItems="center">
              <GreenText fontSize="14px">
                @{users.find(u => u.id === item?.createdBy)?.urlSlug ?? "Username"}
              </GreenText>
              {users.find(u => u.id === item?.createdBy)?.verified && (
                <img
                  src={require("assets/icons/verified_gray.png")}
                  alt="verified"
                  width="16.5px"
                  height="16.5px"
                  style={{ marginLeft: "4.5px" }}
                />
              )}
              <div className={styles.levelLabel}>{`level ${users.find(u => u.id === item?.createdBy)?.level ?? 1
                }`}</div>
            </Box>
          </Box>
        </Box>
        {item.hashtags && item.hashtags.length > 0 && (
          <Box display="flex" alignItems="center" flexWrap="wrap">
            {item.hashtags.map((hashtag, i) => {
              return (
                <div key={i} className={styles.hashtag}>
                  {hashtag}
                </div>
              );
            })}
          </Box>
        )}
      </Box>

      <Box mb="48px">
        <h3 className={styles.title}>{item.name}</h3>
        {item.textShort && <p className={styles.textShort}>{item.textShort}</p>}
        {item.descriptionArray && (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: typeof item.descriptionArray === 'string' ? item.descriptionArray : item.description
            }}
          />
        )}
      </Box>

      <Box mb="48px" display="flex" alignItems="center" justifyContent="space-between">
        {comments.length ? (
          <div className={styles.numResponsesWallPost}>
            <img src={chatGreyIcon} alt={"chat bubble"} />
            {comments.length ?? 0} comments
          </div>
        ) : (
          <div />
        )}

        <div className={styles.socialsRowPostItem}>
          <span onClick={!onlyDisplay ? handleList : undefined}>
            <img
              src={require(isListed
                ? "assets/priviIcons/bookmark-filled.svg"
                : "assets/priviIcons/bookmark.svg")}
              alt="bookmark"
            />
          </span>
          <span onClick={!onlyDisplay ? handleToggleShareMenu : undefined} ref={anchorShareMenuRef}>
            <SvgIcon htmlColor={"white"}>
              <ShareAltSolid />
            </SvgIcon>
          </span>
          {!onlyDisplay && (
            <Popper
              open={openShareMenu}
              anchorEl={anchorShareMenuRef.current}
              transition
              disablePortal={false}
              style={{ position: "inherit", zIndex: 1400 }}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                    position: "inherit",
                  }}
                >
                  <Paper className={styles.paper}>
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
          )}
        </div>
      </Box>

      <LoadingWrapper theme="green" loading={responseLoader}>
        <>
          {!onlyDisplay && comments && comments.length > 0 ? (
            <div className={styles.commentsSection}>
              {comments.map((item, i) => (
                <ResponseWallPost key={i} response={item} />
              ))}
            </div>
          ) : null}
          <div className={styles.inputResponseWallPost}>
            <input
              value={response}
              placeholder="Write a message..."
              onChange={e => {
                let res = e.target.value;
                setResponse(res);
              }}
              onKeyDown={handleKeyDown}
              type="text"
              disabled={onlyDisplay}
            />
            <img src={require("assets/icons/send_gray.png")} alt={"send"} onClick={makeResponse} />
          </div>
        </>
      </LoadingWrapper>
      {item.descriptionImages && item.descriptionImages.length > 2 && (
        <MorePicturesModal
          open={openMorePicturesModal}
          onClose={handleCloseMorePicturesModal}
          picturesArray={item.descriptionImages}
        />
      )}
    </>
  );
};
