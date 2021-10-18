import { Modal } from "@material-ui/core";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import URL from "shared/functions/getURL";
import { RootState } from "store/reducers/Reducer";

import styles from "../index.module.scss";
import Moment from "react-moment";
import { useHistory } from "react-router-dom";
import { setSelectedUser } from "store/actions/SelectedUser";
import cls from "classnames";

import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as HeartSolid } from "assets/icons/heart-solid.svg"
import { ReactComponent as HeartRegular } from "assets/icons/heart-regular.svg"
import { ReactComponent as CommentAltRegular } from "assets/icons/comment-alt-regular.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
const arrowRightBlue = require("assets/icons/arrow_right_blue_icon.png");

const arePropsEqual = (prevProps, currProps) =>
  prevProps.media === currProps.media && prevProps.open === currProps.open;

const EthMediaModal = React.memo((props: any) => {
  const user = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();
  const history = useHistory();

  const [media, setMedia] = useState<any>({});
  const [liked, setLiked] = useState<boolean>(false);

  const [comment, setComment] = useState("");
  const [commentLoader, setCommentLoader] = useState(false);
  const [comments, setComments] = useState<any[]>([]);

  const [status, setStatus] = useState<any>("");

  useEffect(() => {
    if (props.media) {
      const mediaCopy = { ...props.media };
      if (!mediaCopy.NumLikes) {
        mediaCopy.NumLikes = 0;
      }
      if (mediaCopy.Likes && mediaCopy.Likes.some((like) => like === user.id)) {
        setLiked(true);
      }
      if (props.media.comments) {
        setComments(props.media.comments);
      }
      setMedia(mediaCopy);
    }
  }, []);

  /*------------------- LIKE FUNCTION ----------------------*/
  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);

    const mediaCopy = { ...media };

    //to update frontend
    if (liked) {
      mediaCopy.NumLikes--;
    } else {
      mediaCopy.NumLikes++;
    }

    if (mediaCopy.Likes && mediaCopy.Likes.some((like) => like === user.id)) {
      Axios.post(`${URL()}/media/removeLikeMedia/${mediaCopy.id}`, {
        userId: user.id,
        mediaType: mediaCopy.Type,
      })
        .then((response) => {
          if (response.data.success) {
            let data = response.data.data;

            mediaCopy.Likes = data.Likes;
            mediaCopy.NumLikes = data.NumLikes;
            setMedia(mediaCopy);
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        })
    } else {
      Axios.post(`${URL()}/media/likeMedia/${mediaCopy.id}`, {
        userId: user.id,
        mediaType: mediaCopy.Type,
      })
        .then((response) => {
          if (response.data.success) {
            let data = response.data.data;

            mediaCopy.Likes = data.Likes;
            mediaCopy.NumLikes = data.NumLikes;
            setMedia(mediaCopy);
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    setMedia(mediaCopy);
  };

  /*----------------- COMMENT FUNCTIONS -------------------*/
  const makeResponse = () => {
    setCommentLoader(true);
    if (comment) {
      let body = {
        mediaId: props.media.id,
        userId: user.id,
        userName: user.firstName,
        response: comment,
      };
      //TODO: post comment
      /*Axios
        .post(`${URL()}/media/makeResponse`, body)
        .then((response) => {
          if (response.data.success) {
            let responses: any[] = [...response.data.data];
            setComments(responses);
            setComment("");
            setCommentLoader(false);
          } else {
            console.log(response.data.error);
            setCommentLoader(false);
            setStatus({
              msg: "Error making request",
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          setCommentLoader(false);
          setStatus({
            msg: "Error making request",
            key: Math.random(),
            variant: "error",
          });
        });*/
    }
    setCommentLoader(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      makeResponse();
    }
  };

  /*------------------ COMPONENTS --------------------*/

  const ResponseItem = (propsFunction: any) => {
    //console.log(propsFunction);
    return (
      <div
        className={cls(styles.responseItem, {
          [styles.borderBottom]: propsFunction.index !== comments.length - 1,
        })}
      >
        <div className={styles.firstRow}>
          <div
            className={styles.column}
            style={{ cursor: "pointer" }}
            onClick={() => {
              history.push(`/profile/${propsFunction.response.userId}`);
              dispatch(setSelectedUser(propsFunction.response.userId));
            }}
          >
            <div
              className={styles.userImg}
              style={{
                backgroundImage: propsFunction.response && propsFunction.response.url ?
                  `url(${propsFunction.response.url}?${Date.now()})`
                  : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className={styles.label}>
              {propsFunction.response.userName}
            </div>
          </div>
          <div className={styles.column}>
            <Moment fromNow>{propsFunction.response.date}</Moment>
          </div>
        </div>
        <div className={styles.response}>{propsFunction.response.response}</div>
      </div>
    );
  };

  if (props.media) {
    return (
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={styles.modal}
      >
        <div className={styles.modalContent}>
          <div className={styles.exit} onClick={props.handleClose}>
            <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
          </div>
          <div
            className={styles.image}
            style={{
              background:
                props.media.Url && props.media.Url !== ""
                  ? `url(${props.media.Url})`
                  : "none",
            }}
          />
          <div className={styles.tags}>
            <div className={styles.tagContainer}>
              {props.media.tag ? (
                <span>{props.media.tag.toUpperCase()}</span>
              ) : null}
              {props.media.Fractionalised ? <span>Fractionalised</span> : null}
            </div>
            <div className={styles.tagContainer} onClick={handleLike}>
              <span>
                {liked ? (
                  <SvgIcon htmlColor={"#FC4850"}><HeartSolid /></SvgIcon>
                ) : (
                  <SvgIcon><HeartRegular /></SvgIcon>
                )}
                {media.NumLikes
                  ? `${media.NumLikes > 1000000
                    ? (media.NumLikes / 1000000).toFixed(1)
                    : media.NumLikes > 1000
                      ? (media.NumLikes / 1000).toFixed(1)
                      : media.NumLikes
                  } ${media.NumLikes > 1000000
                    ? "M"
                    : media.NumLikes > 1000
                      ? "K"
                      : ""
                  }`
                  : 0}
              </span>
              <span>
                <SvgIcon>
                  <CommentAltRegular />
                </SvgIcon>
                {media.NumComments ?? 0}
              </span>
            </div>
          </div>
          <div className={styles.content}>
            <section>
              <h2>{props.media.title ?? ""}</h2>
              <p>{props.media.description ?? ""}</p>
            </section>
            <section>
              <h5>Creator</h5>
              <div className={styles.creator}>
                <div
                  className={styles.img}
                  style={{
                    background:
                      props.media.Url && props.media.Url !== ""
                        ? `url(${props.media.Url})`
                        : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <p>{props.media.creator ?? ""}</p>
              </div>
              <h5>Owned by</h5>
              <div className={styles.owner}>
                <div
                  className={styles.img}
                  style={{
                    background:
                      props.media.Url && props.media.Url !== ""
                        ? `url(${props.media.Url})`
                        : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <p>{props.media.owner ?? ""}</p>
              </div>
              <h5>Owner history</h5>
              <p>No data</p>
            </section>
          </div>
          <div className={styles.comments}>
            {props.media.comments ? (
              <div className={styles.commentsContainer}>
                {comments && comments.length > 0
                  ? comments.map((item, i) => {
                    return <ResponseItem key={i} index={i} response={item} />;
                  })
                  : null}
                <LoadingWrapper loading={commentLoader}>
                  <div className={styles.addResponse}>
                    <div className={styles.inputResponse}>
                      <InputWithLabelAndTooltip
                        type="text"
                        inputValue={comment}
                        onInputValueChange={(elem) => {
                          let res = elem.target.value;
                          setComment(res);
                        }}
                        onKeyDown={handleKeyDown}
                        placeHolder="Write your response"
                      />
                    </div>
                    <div className={styles.arrow} onClick={makeResponse}>
                      <img src={arrowRightBlue} alt={"arrow right"} />
                    </div>
                  </div>
                </LoadingWrapper>
              </div>
            ) : (
              <p>No comments yet</p>
            )}
          </div>
          {status ? (
            <AlertMessage
              key={status.key}
              message={status.msg}
              variant={status.variant}
            />
          ) : (
            ""
          )}
        </div>
      </Modal>
    );
  } else return null;
}, arePropsEqual);

export default EthMediaModal;
