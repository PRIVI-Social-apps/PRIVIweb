import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Color, StyledDivider } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { RootState } from "store/reducers/Reducer";
import { TwitterShareButton, InstapaperShareButton, FacebookShareButton } from "react-share";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import WallItemModal from "../../../subpages/Home/components/MyWall/WallItemModal";
import { wallFeedCardStyles } from "./index.styles";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";

const twitterIcon = require("assets/snsIcons/twitter_gray.png");
const instagramIcon = require("assets/snsIcons/instagram_gray.png");
const facebookIcon = require("assets/snsIcons/facebook_gray.png");

export default function WallFeedCard({
  item,
  userProfile,
  feedItem,
}: {
  item: any;
  userProfile: any;
  feedItem?: boolean;
}) {
  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const classes = wallFeedCardStyles();

  const [ownUserWall, setOwnUserWall] = useState<any>(false);
  const [onlyTitle, setOnlyTitle] = useState<any>(false);
  const [readMore, setReadMore] = useState<any>(false);
  const descRef = useRef<HTMLHeadingElement>(null);
  const [descHeight, setDescHeight] = useState<number>(0);
  const [comments, setComments] = useState<any[]>([]);

  const [openWallItemModal, setOpenWallItemModal] = useState<any>(false);
  const handleOpenWallItemModal = () => {
    setOpenWallItemModal(true);
  };
  const handleCloseWallItemModal = () => {
    setOpenWallItemModal(false);
  };

  useEffect(() => {
    if (item.comments && item.responses?.length > 0) {
      let r = [] as any;
      item.responses.forEach(response => {
        let slug = response.userName;
        let image = "";
        let thisUser = users.find(u => u.id === response.userId);
        if (thisUser) {
          slug = thisUser.urlSlug;
          image = thisUser.url ?? thisUser.imageURL;
        } else {
          image = getRandomAvatarForUserIdWithMemoization(response.userId);
        }

        r.push({ ...response, urlSlug: slug, url: image });
      });

      setComments && setComments(r);
    }
  }, [item, users]);

  useEffect(() => {
    if (userSelector.id === userProfile.id) {
      setOwnUserWall(true);
    } else {
      setOwnUserWall(false);
    }

    if (
      item &&
      item.name &&
      item.name !== "" &&
      item.name !== ` ` &&
      (!item.descriptionArray ||
        (item.descriptionArray &&
          (item.descriptionArray[0] === "" || item.descriptionArray[0] === undefined))) &&
      (item.textShort === "" || item.textShort === ` ` || !item.textShort) &&
      item.hasPhoto === false &&
      ((item.descriptionImages && item.descriptionImages.length === 0) || !item.descriptionImages)
    ) {
      setOnlyTitle(true);
    }
    if (descRef.current && item) {
      setDescHeight(descRef.current.offsetHeight);
    }
  }, [item]);

  //resize desc
  useEffect(() => {
    const handleResize = () => {
      if (descRef.current && item) {
        setDescHeight(descRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    //eslint-disable react-hooks/exhaustive-deps
  }, [descRef, item]);

  const handleFruit = type => {
    const body = {
      userId: userSelector.id,
      fruitId: type,
      feedAddress: item.id,
    };

    axios.post(`${URL()}/user/wall/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...item };
        itemCopy.fruits = [
          ...(itemCopy.fruits || []),
          { userId: userSelector.id, fruitId: type, date: new Date().getTime() },
        ];
      }
    });
  };

  return (
    <div className={classes.wallItem}>
      <Box mb={"16px"} display="flex" alignItems="center">
        <Avatar
          size={"small"}
          url={
            item.imageURL ??
            userProfile.imageURL ??
            users.find(u => u.id === item.createdBy)?.imageURL ??
            getRandomAvatarForUserIdWithMemoization(item.createdBy)
          }
        />
        <Box ml="8px" fontSize="12px">
          {userSelector.id !== item.createdBy ? <span>{item.userName}</span> : "You"}
          {!feedItem
            ? item.name === ` ` && item.textShort === ` `
              ? userSelector.id !== item.createdBy
                ? ` sent `
                : ` posted `
              : ` wrote on `
            : ""}
          {!feedItem && ownUserWall
            ? item.name === ` ` && item.textShort === ` `
              ? userSelector.id !== item.createdBy
                ? "you"
                : ""
              : "your"
            : ""}
          <span>{!feedItem && !ownUserWall ? `${item.userName}` : ""}</span>
          {!feedItem && item.name === ` ` && item.textShort === ` `
            ? ` an image`
            : !feedItem
              ? `${!ownUserWall ? "'s" : ""} wall`
              : ""}
        </Box>
      </Box>

      {item.hasPhoto && (item?.url || item?.imageURL) ? (
        <img
          onClick={handleOpenWallItemModal}
          src={item?.url ?? item?.imageURL}
          className={classes.postImage}
          alt={"wall"}
          style={item.dimensions ? { height: "auto" } : { height: "200px", objectFit: "cover" }}
        />
      ) : null}

      {!item.hasPhoto ? (
        <Box onClick={handleOpenWallItemModal}>
          {item.name && item.name !== ` ` ? <h3>{item.name}</h3> : null}
          {item.textShort && item.textShort !== ` ` ? (
            <div className={classes.desc}>
              <p style={{ maxHeight: readMore ? "none" : "140px" }} ref={descRef}>
                {item.textShort}
              </p>
              {descHeight >= 140 && !readMore ? (
                <span
                  className={classes.readMore}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setReadMore(true);
                  }}
                >
                  ... Read More
                </span>
              ) : null}
            </div>
          ) : null}
        </Box>
      ) : (
        <>
          <h3 onClick={handleOpenWallItemModal}>{item.name}</h3>
        </>
      )}

      <Box width="100%" onClick={handleOpenWallItemModal}>
        <StyledDivider margin={2} type="solid" color={Color.GrayInputBorderSelected} />
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <div className={classes.fruitsContainer}>
            <FruitSelect
              counter1={2}
              counter2={30}
              counter3={137}
              fruitObject={item}
              members={[]}
              onGiveFruit={handleFruit}
            />
          </div>
          <TwitterShareButton
            className={classes.shareButton}
            title={item.name + "\n" + item.textShort + "\n\n"}
            url={window.location.href}
          >
            <img className={classes.shareImg} src={twitterIcon} alt="twitter" />
          </TwitterShareButton>
          <InstapaperShareButton
            className={classes.shareButton}
            title={item.name + "\n" + item.textShort + "\n\n"}
            url={window.location.href}
          >
            <img className={classes.shareImg} src={instagramIcon} alt="twitter" />
          </InstapaperShareButton>
          <FacebookShareButton
            className={classes.shareButton}
            title={item.name + "\n" + item.textShort + "\n\n"}
            url={window.location.href}
          >
            <img className={classes.shareImg} src={facebookIcon} alt="twitter" />
          </FacebookShareButton>
        </Box>

        {item.comments ? (
          <Box fontSize="12px" onClick={handleOpenWallItemModal}>
            {comments && comments.length
              ? `${comments.length} comment${comments.length > 1 ? "s" : ""}`
              : `0 comments`}
          </Box>
        ) : null}
      </Box>
      <WallItemModal
        open={openWallItemModal}
        onClose={handleCloseWallItemModal}
        item={item}
        comments={comments}
        setComments={setComments}
      />
    </div>
  );
}
