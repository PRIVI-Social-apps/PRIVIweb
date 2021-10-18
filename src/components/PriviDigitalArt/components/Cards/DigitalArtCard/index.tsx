import React, { useEffect, useState } from "react";
import cls from "classnames";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import { digitalArtCardStyles } from "./index.styles";
import { ShareMenu } from "../../ShareMenu";
import { useTypedSelector } from "store/reducers/Reducer";
import DigitalArtModal from "components/PriviDigitalArt/modals/DigitalArtModal";
import { useAuth } from "shared/contexts/AuthContext";
import Box from "shared/ui-kit/Box";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import URL from "shared/functions/getURL";

export default function DigitalArtCard({ item, heightFixed, index = 0 }) {
  const classes = digitalArtCardStyles();

  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);
  const history = useHistory();
  const { isSignedin } = useAuth();
  const [auctionEnded, setAuctionEnded] = React.useState<boolean>(false);
  const [endTime, setEndTime] = useState<any>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [openDigitalArtModal, setOpenDigitalArtModal] = useState<boolean>(false);
  const [openOptionsMenu, setOpenOptionsMenu] = useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);

  const parentNode = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item && item.Auctions) {
      const timerId = setInterval(() => {
        const now = new Date();
        let delta = Math.floor(item.Auctions.EndTime - now.getTime() / 1000);
        if (delta < 0) {
          setAuctionEnded(true);
          setEndTime({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          });
          clearInterval(timerId);
        } else {
          let days = Math.floor(delta / 86400);
          delta -= days * 86400;

          // calculate (and subtract) whole hours
          let hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;

          // calculate (and subtract) whole minutes
          let minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;

          // what's left is seconds
          let seconds = delta % 60;
          setAuctionEnded(false);
          setEndTime({
            days,
            hours,
            minutes,
            seconds,
          });
        }
      }, 1000);

      return () => clearInterval(timerId);
    } else return;
  }, [item, user]);

  const handleOpenDigitalArtModal = () => {
    if (isSignedin && item && creator) {
      history.push(`/privi-digital-art/${item.MediaSymbol ?? item.id}`);
    }
    // setOpenDigitalArtModal(true);
  };

  const handleCloseDigitalArtModal = () => {
    setOpenDigitalArtModal(false);
  };

  const creator = React.useMemo(() => users.find((u: any) => u.id === item.CreatorId), [users]);

  const handleOptions = () => {
    setOpenOptionsMenu(!openOptionsMenu);
  };

  const handleCloseOptionsMenu = () => {
    setOpenOptionsMenu(false);
  };

  const handleFruit = type => {
    const body = {
      userId: user.id,
      fruitId: type,
      mediaAddress: item.MediaSymbol ?? item.id,
      mediaType: item.Type,
      tag: item.tag ?? "privi",
    };

    Axios.post(`${URL()}/media/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...item };
        itemCopy.fruits = [
          ...(itemCopy.fruits || []),
          { userId: user.id, fruitId: type, date: new Date().getTime() },
        ];
      }
    });
  };

  return (
    <div className={classes.card} style={{ marginBottom: heightFixed === "auction" ? 100 : 0 }}>
      <div className={classes.header}>
        {creator ? (
          <Box display="flex" alignItems="center">
            <div
              className={classes.avatar}
              style={{
                backgroundImage: creator.imageUrl
                  ? `url(${creator.imageUrl})`
                  : creator.anonAvatar
                    ? `url(${creator.anonAvatar})`
                    : "none",
              }}
              onClick={() => history.push(`/profile/${creator.urlSlug}`)}
            />
            <Box display="flex" flexDirection="column">
              <div className={cls(classes.black, classes.creatorName)} style={{ marginBottom: 4 }}>
                {creator.name}
              </div>
              <div className={cls(classes.gray, classes.creatorName)}>@{creator.urlSlug}</div>
            </Box>
          </Box>
        ) : (
          <div className={classes.black}>{item.collection}</div>
        )}

        <Box display="flex" alignItems="center">
          <FruitSelect fruitObject={item} onGiveFruit={handleFruit} parentNode={parentNode.current ?? undefined} />
          <button onClick={handleOptions} className={classes.optionsBtn} ref={anchorShareMenuRef}>
            <img src={require(`assets/icons/menu_dots.png`)} alt="like" />
          </button>
          <ShareMenu
            openMenu={openOptionsMenu}
            anchorRef={anchorShareMenuRef}
            item={item}
            handleCloseMenu={handleCloseOptionsMenu}
            index={index}
          />
        </Box>
      </div>
      {heightFixed ? (
        <div
          className={cls(classes.media, classes.fixed)}
          style={{
            backgroundImage: `url(${item.Type !== "DIGITAL_ART_TYPE" ? item.UrlMainPhoto : item.UrlMainPhoto || item.Url
              })`,
          }}
          onClick={handleOpenDigitalArtModal}
        />
      ) : (
        <div ref={parentNode} style={{ borderRadius: "16px" }}>
          <img
            src={`${item.Type !== "DIGITAL_ART_TYPE" ? item.UrlMainPhoto : item.UrlMainPhoto || item.Url}`}
            alt={item.MediaSymbol ?? item.id}
            onClick={handleOpenDigitalArtModal}
            className={classes.media}
          />
        </div>
      )}
      <div className={classes.info} onClick={handleOpenDigitalArtModal}>
        <div className={cls(classes.black, classes.title)}>{item.MediaName}</div>

        {item.NftConditions && (
          <div className={classes.gray}>
            Reserve price
            {item.Auctions ? (
              <span>{`${(item.Auctions.Gathered ? item.Auctions.Gathered : item.NftConditions.Price) || ""} ${item.Auctions.Gathered ? item.Auctions.TokenSymbol || "" : item.NftConditions.NftToken || ""
                }`}</span>
            ) : item.ExchangeData ? (
              <span>{`${item.ExchangeData.Price || ""} ${item.ExchangeData.OfferToken || ""}`}</span>
            ) : (
              <span>{`${item.NftConditions.Price || ""} ${item.NftConditions.NftToken || ""}`}</span>
            )}
          </div>
        )}

        {item.Auctions && (
          <div className={classes.auction}>
            <div>{!auctionEnded ? "Auction Ending In" : "Auction Ended"}</div>
            {!auctionEnded && (
              <h5>
                {`${endTime.days ? `${String(endTime.days).padStart(2, "0")}d` : ""} ${String(
                  endTime.hours
                ).padStart(2, "0")}h ${String(endTime.minutes).padStart(2, "0")}m ${String(
                  endTime.seconds
                ).padStart(2, "0")}s`}
              </h5>
            )}
          </div>
        )}
      </div>
      {isSignedin && item && creator && (
        <DigitalArtModal
          open={openDigitalArtModal}
          handleClose={handleCloseDigitalArtModal}
          selectedMedia={item}
          creator={creator}
        />
      )}
    </div>
  );
}
