import React from "react";
import { useSelector } from "react-redux";
import URL from "shared/functions/getURL";
import Divider from "@material-ui/core/Divider";

import WallPostModal from "../../../../Communities/CommunityPage/modals/WallPost/WallPostModal";
import { getUser } from "store/selectors/user";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { NotificationContent } from "shared/ui-kit/Header/components/Notifications/NotificationContent";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ThumbsUpSolid } from "assets/icons/thumbs-up-solid.svg";
import { ReactComponent as ThumbsDownSolid } from "assets/icons/thumbs-down-solid.svg";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";

const WallContent = props => {
  let userSelector = useSelector(getUser);
  const {
    wall,
    status,
    likePost,
    dislikePost,
    removeNotification,
    openModalWallPost,
    handleCloseModalWallPost,
    wallPost,
    wallPostType,
    ButtonsNotification,
    PhotoMyWall,
  } = props;
  return (
    <div style={{ width: "100%" }}>
      <div className="infoMyWall">
        {wall.type !== "post" ? (
          <div>
            <div className="flexMyWallRow">
              <PhotoMyWall type={"user"} itemId={wall.fromUserId} />
              <div className="myWallMessage"></div>
            </div>
            <div className="likesRowMyWall">
              {wall.likes && wall.likes.findIndex(user => user === userSelector.id) !== -1 ? (
                <div className="iconCenterFlex">
                  <SvgIcon htmlColor={"green"}>
                    <ThumbsUpSolid />
                  </SvgIcon>
                  &nbsp;{wall.numLikes || 0}
                </div>
              ) : (
                <div className="iconCenterFlex" onClick={() => likePost(wall)}>
                  <SvgIcon>
                    <ThumbsUpSolid />
                  </SvgIcon>
                  &nbsp;{wall.numLikes || 0}
                </div>
              )}
              &nbsp;&nbsp;&nbsp;
              {wall.dislikes && wall.dislikes.findIndex(user => user === userSelector.id) !== -1 ? (
                <div className="iconCenterFlex">
                  <SvgIcon htmlColor={"red"}>
                    <ThumbsDownSolid />
                  </SvgIcon>
                  &nbsp;{wall.numDislikes || 0}
                </div>
              ) : (
                <div className="iconCenterFlex" onClick={() => dislikePost(wall)}>
                  <SvgIcon>
                    <ThumbsDownSolid />
                  </SvgIcon>
                  &nbsp;{wall.numDislikes || 0}
                </div>
              )}
            </div>
            {wall.hasPhoto ? (
              <div
                className="imagePostShow"
                style={{
                  backgroundImage: `url(${URL()}/user/wall/getPostPhoto/${wall.id})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                }}
              />
            ) : null}
          </div>
        ) : (
          <div>
            <div className="flexMyWallRow">
              {wall.type === 10 ||
                wall.type === 12 ||
                wall.type === 13 ||
                wall.type === 14 ||
                wall.type === 17 ||
                wall.type === 33 ||
                wall.type === 34 ||
                wall.type === 37 ||
                wall.type === 38 ||
                wall.type === 39 ||
                wall.type === 47 ? (
                <PhotoMyWall type={"user"} itemId={userSelector.id} />
              ) : (
                <PhotoMyWall type={"user"} itemId={wall.itemId} />
              )}
              <div className="myWallMessage">
                <NotificationContent notification={wall} />
              </div>
              <div className="removeNotificationIcon" onClick={() => removeNotification()}>
                <SvgIcon><CloseSolid /></SvgIcon>
              </div>
            </div>
            <ButtonsNotification />
          </div>
        )}
      </div>
      {!props.noDivider ? <Divider className="dividerMyWall" /> : null}
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : null}
      <WallPostModal
        open={openModalWallPost}
        onClose={handleCloseModalWallPost}
        wallPost={wallPost}
        creatorImageURL={`${userSelector.url}?${Date.now()}`}
        creatorName={userSelector.firstName}
        type={wallPostType}
      />
    </div>
  );
};

export default WallContent;
