import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import "./FeedItem.css";
import WallPostModal from "../../../../Communities/CommunityPage/modals/WallPost/WallPostModal";
import { RootState } from "store/reducers/Reducer";

import URL from "shared/functions/getURL";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ThumbsUpSolid } from "assets/icons/thumbs-up-solid.svg";
import { ReactComponent as ThumbsDownSolid } from "assets/icons/thumbs-down-solid.svg";

export default function FeedItem(props) {
  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [item, setItem] = useState<any>({});
  const [url, setUrl] = useState<string>("");
  const [wallPostIdLabel, setWallPostIdLabel] = useState<string>("");

  const [width, setWidth] = useState<number>(250);
  const ref = useRef<HTMLHeadingElement>(null);

  const [openModalWallPost, setOpenModalWallPost] = useState<boolean>(false);
  const handleOpenModalWallPost = () => {
    setOpenModalWallPost(true);
  };
  const handleCloseModalWallPost = () => {
    setOpenModalWallPost(false);
  };

  useEffect(() => {
    if (props.item) {
      if (props.item.urlItem && props.item.urlItem === "user") {
        setItem(props.item);
        setUrl(`${URL()}/user/wall/`);
        setWallPostIdLabel("userWallPostId");
      }
    }

    //eslint-disable react-hooks/exhaustive-deps
  }, []);

  //resize graph
  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    //eslint-disable react-hooks/exhaustive-deps
  }, [ref]);

  useEffect(() => {
    if (!item.userName && !item.userImageURL) {
      if (users && users.length > 0) {
        users.forEach(user => {
          if (user.id === item.createdBy) {
            const newItem = { ...item };

            newItem.userImageURL = user.imageURL;
            newItem.userName = user.name;

            setItem(newItem);
            return;
          }
        });
      }
    }

    //eslint-disable react-hooks/exhaustive-deps
  }, [users]);

  const likePost = (item: any) => {
    console.log(wallPostIdLabel);
    let data: any = {
      userId: userSelector.id,
      userName: userSelector.firstName,
    };
    data[wallPostIdLabel] = props.item.id;
    axios
      .post(`${url}likePost`, data)
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

  const dislikePost = (item: any) => {
    let data: any = {
      userId: userSelector.id,
      userName: userSelector.firstName,
    };
    data[wallPostIdLabel] = props.item.id;
    axios
      .post(`${url}dislikePost`, data)
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

  if (item) {
    return (
      <div
        style={{
          backgroundImage:
            item.imageURL && item.imageURL.length > 0
              ? `url(${item.imageURL})`
              : props.imageUrl && props.imageUrl.length > 0
                ? `url(${props.imageUrl})`
                : "none",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: width * 0.9,
        }}
        className={"feed-item"}
        ref={ref}
      >
        <div className="gradient-container-top">
          <div className="gradient-container-bottom">
            <div className="top-items">
              <img
                src={
                  item.name === ` ` && item.textShort === ` `
                    ? require("assets/icons/camera_white.png")
                    : require("assets/icons/paragraph_white.png")
                }
                alt={item.description && item.description.length > 0 ? "text" : "picture"}
              />
              <div className="right-items">
                <div className="likesRowPostItem">
                  {item.likes && item.likes.findIndex(user => user === userSelector.id) !== -1 ? (
                    <div className="iconCenterFlex">
                      <SvgIcon htmlColor={"green"}>
                        <ThumbsUpSolid />
                      </SvgIcon>
                      &nbsp;{item.numLikes || 0}
                    </div>
                  ) : (
                    <div className="iconCenterFlex" onClick={() => likePost(item)}>
                      <SvgIcon>
                        <ThumbsUpSolid />
                      </SvgIcon>
                      &nbsp;{item.numLikes || 0}
                    </div>
                  )}
                  &nbsp;&nbsp;&nbsp;
                  {item.dislikes && item.dislikes.findIndex(user => user === userSelector.id) !== -1 ? (
                    <div className="iconCenterFlex">
                      <SvgIcon htmlColor={"red"}>
                        <ThumbsDownSolid />
                      </SvgIcon>
                      &nbsp;{item.numDislikes || 0}
                    </div>
                  ) : (
                    <div className="iconCenterFlex" onClick={() => dislikePost(item)}>
                      <SvgIcon>
                        <ThumbsDownSolid />
                      </SvgIcon>
                      &nbsp;{item.numDislikes || 0}
                    </div>
                  )}
                </div>
                {/*<span>Salute</span>*/}
              </div>
            </div>

            <div className="bottom-items" onClick={handleOpenModalWallPost}>
              <div className="row">
                <div
                  className="user-image"
                  style={{
                    backgroundImage:
                      item.userImageURL && item.userImageURL.length > 0
                        ? `url(${item.userImageURL})`
                        : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "30px",
                  }}
                />
                <div className="item-info">
                  <p>{item.name && item.name !== ` ` ? item.name : ""}</p>
                  <span>{item.userName}</span>
                </div>
              </div>
            </div>
            <WallPostModal
              open={openModalWallPost}
              onClose={handleCloseModalWallPost}
              wallPost={item}
              creatorImageURL={props.item.userImageURL || ``}
              creatorName={props.item.userName || ``}
              creatorSlug={props.item.urlSlug || ``}
              creatorLevel={props.item.level || ``}
              type={props.type}
              like={() => likePost(item)}
              dislike={() => dislikePost(item)}
              imageUrl={
                item.imageURL && item.imageURL.length > 0
                  ? item.imageURL
                  : props.imageUrl && props.imageUrl.length > 0
                    ? props.imageUrl
                    : ""
              }
            />
          </div>
        </div>
      </div>
    );
  } else return null;
}
