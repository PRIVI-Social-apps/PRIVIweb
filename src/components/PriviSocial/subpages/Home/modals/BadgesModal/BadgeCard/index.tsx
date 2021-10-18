import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import equal from "deep-equal";

import { badgeCardStyles } from "./index.styles";
import URL from "shared/functions/getURL";
import { RootState } from "store/reducers/Reducer";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import BadgeHexagon from "shared/ui-kit/Badge-hexagon/Badge-hexagon";
import IndividualBadgeModal from "../../IndividualBadgeModal";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { Avatar } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

const arePropsEqual = (prevProps, currProps) => {
  return equal(prevProps.item, currProps.item);
};

const BadgeCard = React.memo((props: any) => {
  const classes = badgeCardStyles();
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [item, setItem] = useState<any>({});
  const [status, setStatus] = useState<any>("");

  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleLikeCard = () => {
    const itemCopy = { ...item };
    itemCopy.userAddress = user.id;
    itemCopy.liked = !item.liked;
    let path = "";

    path = `/badge/like`;

    axios
      .post(`${URL()}` + path, itemCopy)
      .then(response => {
        if (response.data.success) {
          if (itemCopy.liked) {
            if (itemCopy.Likes) {
              if (!itemCopy.Likes.some(like => like.userId === user.id)) {
                itemCopy.Likes.push({ userId: user.id, date: new Date() });
              } else itemCopy.Likes = [{ userId: user.id, date: new Date() }];
            }
          } else {
            if (itemCopy.Likes) {
              itemCopy.Likes = itemCopy.Likes.filter(item => item.userId !== user.id);
            }
          }

          setItem(itemCopy);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (props.item) {
      let i = {
        ...props.item,
        name: "",
        imageURL: "",
        inverted: 0,
        dailyChanges: 0,
        ownedBy: 0,
        userName: "",
        userImage: "",
        chain: "PRIVI",
        owned: false,
        hidden: props.item.hidden ?? false,
        liked:
          props.item.Likes && props.item.Likes.find(likeObj => likeObj.userId === user.id) ? true : false,
        TotalSupply: props.item.TotalSupply,
      };

      i.imageURL = props.item.url ? `${props.item.url}?${Date.now()}` : "";
      i.name = props.item.Name ?? "";

      if ((i.Creator = "PRIVI")) {
        i.userName = "PRIVI";
        i.userImage = require("assets/logos/PRIVILOGO.png");
      } else {
        const creator = users.find(u => u.id === i.Creator);
        if (creator) {
          i.userName = creator.name;
          i.userImage = creator.imageURL;
        }
      }

      if (i.tokenData) {
        i.ownedBy = i.tokenData.Holders ? i.tokenData.Holders.length : 0;
        i.dailyChanges = i.tokenData.pctChange ?? 0;
        i.inverted = i.tokenData.price ? i.tokenData.price.toFixed(4) : 0;
      }
      if (i.tokenData && i.tokenData.Holders) {
        i.owned = i.tokenData.Holders.findIndex(holder => holder === user.id) > 0 ? true : false;
      } else if (i.Members) {
        i.owned = i.Members.findIndex(member => member.id === user.id) > 0 ? true : false;
      }

      setItem(i);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.item]);

  const handleSave = () => {};

  const handleShare = () => {};

  if (
    item &&
    Object.keys(item).length !== 0 &&
    item.constructor === Object &&
    (props.userProfile.id !== user.id ? !item.hidden : props.userProfile.id === user.id)
  ) {
    return (
      <>
        <div className={classes.badgeCard} onClick={handleOpenModal}>
          <div className={classes.badgeImage}>
            <BadgeHexagon
              isNormal={true}
              badge={props.item}
              style={{ width: "53px", height: "60px" }}
              onClickBadge={() => {}}
            />
          </div>
          <div className={classes.cardHeader}>
            <div className={classes.cardTitle}>
              <span>{item.name}</span>
              <div className={classes.cardTitleIsLocked}>
                {item.hidden ? (
                  <svg
                    width="16"
                    height="20"
                    viewBox="0 0 16 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 9V8.25C0.585786 8.25 0.25 8.58579 0.25 9H1ZM15 9H15.75C15.75 8.58579 15.4142 8.25 15 8.25V9ZM15 19V19.75C15.4142 19.75 15.75 19.4142 15.75 19H15ZM1 19H0.25C0.25 19.4142 0.585786 19.75 1 19.75L1 19ZM1 9.75H15V8.25H1V9.75ZM14.25 9V19H15.75V9H14.25ZM15 18.25H1V19.75H15V18.25ZM1.75 19V9H0.25V19H1.75ZM4.75 5C4.75 3.20507 6.20507 1.75 8 1.75V0.25C5.37665 0.25 3.25 2.37665 3.25 5H4.75ZM8 1.75C9.79493 1.75 11.25 3.20507 11.25 5H12.75C12.75 2.37665 10.6234 0.25 8 0.25V1.75ZM3.25 5V9H4.75V5H3.25ZM11.25 5V9H12.75V5H11.25Z"
                      fill="#707582"
                    />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="20"
                    viewBox="0 0 16 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 9V8.25C0.585786 8.25 0.25 8.58579 0.25 9H1ZM15 9H15.75C15.75 8.58579 15.4142 8.25 15 8.25V9ZM15 19V19.75C15.4142 19.75 15.75 19.4142 15.75 19H15ZM1 19H0.25C0.25 19.4142 0.585786 19.75 1 19.75L1 19ZM11.25 5C11.25 5.41421 11.5858 5.75 12 5.75C12.4142 5.75 12.75 5.41421 12.75 5H11.25ZM3.25 9C3.25 9.41421 3.58579 9.75 4 9.75C4.41421 9.75 4.75 9.41421 4.75 9H3.25ZM1 9.75H15V8.25H1V9.75ZM14.25 9V19H15.75V9H14.25ZM15 18.25H1V19.75H15V18.25ZM1.75 19V9H0.25V19H1.75ZM4.75 5C4.75 3.20507 6.20507 1.75 8 1.75V0.25C5.37665 0.25 3.25 2.37665 3.25 5H4.75ZM8 1.75C9.79493 1.75 11.25 3.20507 11.25 5H12.75C12.75 2.37665 10.6234 0.25 8 0.25V1.75ZM3.25 5V9H4.75V5H3.25Z"
                      fill="#707582"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className={classes.cardStats}>
              <Box display="flex" alignItems="center">
                <div className={classes.fruitsContainer}>
                  <FruitSelect fruitObject={item} />
                </div>
                Fruits {item.totalFruits ?? 0}
                <div className={classes.cardStatsActions}>
                  <span onClick={handleSave}>
                    <img src={require("assets/priviIcons/bookmark-gray.svg")} alt={"list"} />
                  </span>
                  <span onClick={handleShare}>
                    <img src={require("assets/priviIcons/share-gray.svg")} alt={"share"} />
                  </span>
                </div>
              </Box>

              <div className={classes.badge}>{`Chain: ${item.chain}`}</div>
            </div>
          </div>
          <div className={classes.info}>
            <div className={classes.infoCreator}>
              <Avatar
                url={
                  item.userImage !== ""
                    ? item.userImage
                    : require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)
                }
                size="small"
              />
              <div className={classes.infoCreatorName}>{item.userName}</div>
            </div>
            <div className={classes.totalSupply}>
              Total Supply: <span>{item.TotalSupply || 0}</span>
            </div>
          </div>
          <div className={classes.infoBottom}>
            <div>
              Owned by
              <span>{item.ownedBy !== "" ? item.ownedBy : "multiple users"}</span>
            </div>
            <div>
              {item.Views ? item.Views.length : 0}
              <span>views</span>
            </div>
          </div>
        </div>
        <IndividualBadgeModal badge={item} open={openModal} handleClose={handleCloseModal} />
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : null}
      </>
    );
  } else {
    return null;
  }
}, arePropsEqual);

export default BadgeCard;
