import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import SvgIcon from "@material-ui/core/SvgIcon";
import {
  ClickAwayListener,
  Grow,
  MenuList,
  Paper,
  Popper,
  withStyles,
  MenuItem,
  Divider,
} from "@material-ui/core";

import { threadModalStyles } from "./ThreadModal.styles";
import { RootState } from "store/reducers/Reducer";
import { setSelectedUser } from "store/actions/SelectedUser";
import URL from "shared/functions/getURL";
import { updateTask } from "shared/functions/updateTask";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import { ReactComponent as ShareAltSolid } from "assets/icons/share-alt-solid.svg";

const chatIconGrey = require("assets/icons/message_gray.png");

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

type CreatorInfo = {
  name?: string;
  level?: string;
  url?: string;
};

export default function ThreadModal(props) {
  const { shareMediaToSocial } = useShareMedia();
  const classes = threadModalStyles();
  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [thread, setThread] = useState<any>(props.thread ?? {});

  const [response, setResponse] = useState("");
  const [responses, setResponses] = useState<any[]>([]);
  const [responseLoader, setResponseLoader] = useState(false);
  const [status, setStatus] = useState<any>("");
  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);

  const [urlDescriptionPhotos, setUrlDescriptionPhotos] = useState<string>("");
  const [creator, setCreator] = useState<CreatorInfo>({
    name: "",
    level: "level 1",
    url: "",
  });

  const spanRef = React.useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.innerHTML = props.thread.descriptionArray;
    }
  }, [spanRef.current, props.thread.descriptionArray]);

  useEffect(() => {
    if (props.thread && props.thread.responses) setResponses(props.thread.responses);
  }, []);

  useEffect(() => {
    if (users && users.length > 0 && props.thread) {
      let t = { ...props.thread };
      if (t.comments && t.comments.length > 0) {
        t.comments.forEach((comment, index) => {
          if (users.some(user => user.id === comment.user.id)) {
            const thisUser = users[users.findIndex(user => user.id === comment.user.id)];
            t.comments[index].user = {
              ...comment.user,
              imageURL: thisUser.imageURL,
              name: thisUser.name,
              level: thisUser.level,
              cred: thisUser.creds,
            };
          }
        });
      }
      setUrlDescriptionPhotos("/community/discussions/getDescriptionPostPhoto");

      setThread(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  useEffect(() => {
    let user: any = users.find(usr => usr.id === props.thread.createdBy);
    setCreator({
      name: user.name,
      level: `level ${user.level}`,
      url: user.url,
    });
  }, [props.thread]);

  const upVote = () => {
    axios
      .post(`${URL()}/community/discussions/likePost`, {
        itemDiscussionId: thread.id,
        userId: userSelector.id,
      })
      .then(response => {
        if (response.data.success) {
          updateTask(userSelector.id, "Give 1st cred");
          let data = response.data.data;

          let itemCopy = { ...thread };
          itemCopy.likes = data.likes;
          itemCopy.dislikes = data.dislikes;
          itemCopy.numLikes = data.numLikes;
          itemCopy.numDislikes = data.numDislikes;
          setThread(itemCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const downVote = () => {
    axios
      .post(`${URL()}/community/discussions/dislikePost`, {
        itemDiscussionId: thread.id,
        userId: userSelector.id,
      })
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;

          let itemCopy = { ...thread };
          itemCopy.likes = data.likes;
          itemCopy.dislikes = data.dislikes;
          itemCopy.numLikes = data.numLikes;
          itemCopy.numDislikes = data.numDislikes;
          setThread(itemCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const makeResponse = () => {
    setResponseLoader(true);
    if (response) {
      let body = {
        discussionId: props.thread.id,
        userId: userSelector.id,
        userName: userSelector.firstName,
        response: response,
      };
      axios
        .post(`${URL()}/community/discussions/makeResponse`, body)
        .then(response => {
          if (response.data.success) {
            let responses: any[] = [...response.data.data];
            setResponses(responses);
            setResponseLoader(false);
          } else {
            console.log(response.data.error);
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
      setResponse("");
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
    shareMediaToSocial(thread.id, "Community");
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  return thread && Object.keys(thread).length !== 0 && thread.constructor === Object ? (
    <Modal size="medium" isOpen={props.open} onClose={props.onClose} className={classes.root} showCloseIcon>
      <div className={classes.modalContent}>
        <div className={classes.threadCard}>
          <div className={classes.threadTitle}>
            <h3>{thread.name}</h3>
            {thread.textShort ? <h4>{thread.textShort}</h4> : null}
          </div>
          <Divider />
          <div className={classes.userWrapper}>
            <div className={classes.creatorInfo}>
              <div className={classes.avatarContainer}>
                <div
                  className={classes.avatar}
                  style={{
                    backgroundImage: `url(${creator.url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <span className={"online"}></span>
                </div>
              </div>
              <div className={classes.threadInfo}>
                <div className={classes.creator}>{creator.name}</div>
                <div className={classes.info}>
                  <span className={classes.creatorAlias}>@{thread.user.name}</span>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M13.9369 6.60355C14.1321 6.40829 14.1321 6.09171 13.9369 5.89645C13.7416 5.70118 13.425 5.70118 13.2298 5.89645L13.9369 6.60355ZM7.16665 12.6667L6.8131 13.0202C7.00836 13.2155 7.32494 13.2155 7.5202 13.0202L7.16665 12.6667ZM4.77016 9.56311C4.5749 9.36785 4.25832 9.36785 4.06306 9.56312C3.86779 9.75838 3.8678 10.075 4.06306 10.2702L4.77016 9.56311ZM13.2298 5.89645L6.8131 12.3131L7.5202 13.0202L13.9369 6.60355L13.2298 5.89645ZM4.06306 10.2702L6.8131 13.0202L7.5202 12.3131L4.77016 9.56311L4.06306 10.2702ZM16.75 9C16.75 13.2802 13.2802 16.75 9 16.75V17.75C13.8325 17.75 17.75 13.8325 17.75 9H16.75ZM9 16.75C4.71979 16.75 1.25 13.2802 1.25 9H0.25C0.25 13.8325 4.16751 17.75 9 17.75V16.75ZM1.25 9C1.25 4.71979 4.71979 1.25 9 1.25V0.25C4.16751 0.25 0.25 4.16751 0.25 9H1.25ZM9 1.25C13.2802 1.25 16.75 4.71979 16.75 9H17.75C17.75 4.16751 13.8325 0.25 9 0.25V1.25Z"
                      fill="#707582"
                    />
                  </svg>
                  <div className={classes.level}>{creator.level}</div>
                </div>
              </div>
            </div>
            <div className={classes.shareWrapper} onClick={handleOpenShareModal}>
              <SvgIcon>
                <ShareAltSolid />
              </SvgIcon>
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
            </div>
          </div>
          <div className={classes.threadContent}>
            <div>
              {thread.url && (
                <div
                  className={classes.threadMarginBottom}
                  style={{
                    backgroundImage: `url(${thread.url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "300px",
                    width: "100%",
                    borderRadius: 14,
                  }}
                />
              )}

              {thread.descriptionImages && thread.descriptionImages.length > 0 ? (
                <div className={classes.imagesWallPost}>
                  {thread.descriptionImages.map((item, i) => {
                    return (
                      <div
                        className={classes.descriptionImageWallPost}
                        key={i}
                        style={{
                          backgroundImage:
                            thread && thread.id
                              ? `url(${URL()}/community/discussions/getDescriptionPostPhoto/${
                                  thread.id
                                }/photo${i})`
                              : "none",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                    );
                  })}
                </div>
              ) : null}

              <span ref={spanRef} className={classes.threadMarginBottom} />

              <Divider />

              <div className={classes.threadTags}>
                {thread.hashtags && thread.hashtags.length > 0
                  ? thread.hashtags.map((hashtag, i) => {
                      return (
                        <div key={i} className={classes.hashtag}>
                          {hashtag}
                        </div>
                      );
                    })
                  : null}
              </div>

              <div className={classes.bottom}>
                <div style={{ display: "flex" }}>
                  <img src={chatIconGrey} style={{ width: "20px", marginRight: "10px" }} alt="chat" />
                  <span style={{ fontSize: 14, fontWeight: 400 }}>
                    {responses && responses.length
                      ? `${responses.length} comment${responses.length > 1 ? "s" : ""}`
                      : "0 comments"}
                  </span>
                </div>
              </div>
              <div className={classes.commentButtonWrapper}>
                <LoadingWrapper loading={responseLoader}>
                  <input
                    type="text"
                    className={classes.comment}
                    placeholder="Comment..."
                    value={response}
                    onChange={e => {
                      let res = e.target.value;
                      setResponse(res);
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  <PrimaryButton size="medium" onClick={makeResponse}>
                    Comment
                  </PrimaryButton>
                </LoadingWrapper>
              </div>
            </div>

            {thread.comments && responses && responses.length > 0 ? (
              <div
                className={classes.responsesWallPost}
                style={{
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  width: "100%",
                  borderRadius: 8,
                }}
              >
                {responses && responses.length > 0
                  ? responses.map((item, i) => {
                      return <Response key={i} index={i} response={item} />;
                    })
                  : null}
              </div>
            ) : null}
            {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
          </div>
        </div>
      </div>
    </Modal>
  ) : null;
}

const Response = (props: any) => {
  const classes = threadModalStyles();
  const users = useSelector((state: RootState) => state.usersInfoList);

  const dispatch = useDispatch();
  const history = useHistory();

  const [responseContent, setResponseContent] = useState<any>({});

  useEffect(() => {
    if (users && users.length > 0 && props.response) {
      let response = { ...props.response };
      const usr = users[users.findIndex(user => user.id === response.userId)];
      response.url = usr.url;
      if (response.replies && response.replies.length > 0) {
        response.replies.forEach((comment, index) => {
          if (users.some(user => user.id === comment.user.id)) {
            const thisUser = users[users.findIndex(user => user.id === comment.user.id)];
            response.replies[index].user = {
              ...comment.user,
              imageURL: thisUser.imageURL,
              name: thisUser.name,
              level: thisUser.level,
              cred: thisUser.creds,
            };
          }
        });
      }

      setResponseContent(response);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  if (responseContent && Object.keys(responseContent).length !== 0 && responseContent.constructor === Object)
    return (
      <div
        className={classes.responseComponent}
        style={{
          paddingLeft: props.replyLevel !== undefined ? `calc(${props.replyLevel} * 20px)` : 0,
          width: props.replyLevel !== undefined ? `calc(100% - ${props.replyLevel} * 20px)` : "100%",
        }}
      >
        <div
          style={{ cursor: "pointer", display: "flex", justifyContent: 'space-between' }}
          onClick={() => {
            history.push(`/profile/${responseContent.user.id}`);
            dispatch(setSelectedUser(responseContent.user.id));
          }}
        >
          {responseContent && responseContent.userId && responseContent.userName ? (
            <div className={classes.userInfoThread}>
              <div
                className={classes.userImage}
                style={{
                  backgroundImage: responseContent.url ? `url(${responseContent.url})` : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "48px",
                  height: "48px",
                }}
              />
              <div className={classes.message}>
                <span>{responseContent.userName ?? ""}</span>
                <p>{responseContent.response}</p>
              </div>
            </div>
          ) : null}
          <Moment format="DD/MM/YYYY" className={classes.responseDate}>{responseContent.date}</Moment>
        </div>
      </div>
    );
  else return null;
};
