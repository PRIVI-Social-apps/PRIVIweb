import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import cls from "classnames";

import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, withStyles } from "@material-ui/core";

import { SocialPrimaryButton } from "components/PriviSocial/index.styles";
import URL from "shared/functions/getURL";
import { Color, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { useTypedSelector } from "store/reducers/Reducer";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { profileCardStyles } from "./index.styles";
import MediaDetailsModal from "components/PriviSocial/modals/MediaDetailsModal";

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

export default function ProfileCard({
  item,
  type,
  heightFixed,
  noMargin,
}: {
  item: any;
  type: "Social" | "Media" | "Crew" | "Media Pod";
  heightFixed?: boolean;
  noMargin?: boolean;
}) {
  const classes = profileCardStyles();
  const usersList = useTypedSelector(state => state.usersInfoList);
  const user = useTypedSelector(state => state.user);

  const history = useHistory();

  const [onHover, setOnHover] = useState<boolean>(false);
  const [openShareMenu, setOpenShareMenu] = useState(false);
  const anchorShareMenuRef = useRef<HTMLButtonElement>(null);
  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();

  const [chain, setChain] = useState<string>("PRIVI");
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string>("");
  const [fruits, setFruits] = useState<number>(0);
  const [shares, setShares] = useState<number>(0);
  const [views, setViews] = useState<number>(0);
  const [price, setPrice] = useState<string>("N/A ETH");
  const [usdPrice, setUsdPrice] = useState<number>(0);
  const [change24h, setChange24h] = useState<number>(0);
  const [creatorsImages, setCreatorsImages] = useState<any[]>([]);
  const [itemName, setItemName] = useState<string>("Item name");

  const [openMediaDetailsModal, setOpenMediaDetailsModal] = useState<boolean>(false);

  useEffect(() => {
    if (item) {
      setItemName(
        type === "Social"
          ? item.TokenName
          : item.name ?? item.MediaName ?? item.Name ?? item.Title ?? "Item Name"
      );
      setChain(item.TokenChain ? (item.TokenChain === "" ? "PRIVI" : item.TokenChain) : item.tag ?? "PRIVI");
      setBookmarked(true);
      setImageURL(item.imageURL ?? item.UrlMainPhoto ?? item.Url ?? item.url ?? "");
      setFruits(0);
      setShares(0);
      setViews(item.TotalViews ?? 0);
      setPrice(
        `${item.FundingToken ?? "ETH"} ${item.InitialSupply ?? item.InitialPrice ?? item.Price ?? item.price ?? "N/A"
        }`
      );
      setUsdPrice(0);
      setChange24h(item.tokenData?.pctChange ?? 0);

      let cts = [] as any;
      const foundUser = usersList.find(
        user =>
          user.id === item.Creator ||
          user.id === item.CreatorId ||
          user.address === item.Creator ||
          user.address === item.CreatorId
      );

      if (foundUser) cts.push(foundUser);

      if (item.Members && item.Members.length > 0) {
        item.Members.forEach((member, index) => {
          const foundUser = usersList.find(u => u.id === member.id);
          if (foundUser && !cts.find(u => u.id === foundUser.id)) {
            cts.push(foundUser);
          }
        });
      }

      if (!item.Members && item.tokenData?.Holders && item.tokenData?.Holders.length > 0) {
        item.tokenData?.Holders.forEach((member, index) => {
          const foundUser = usersList.find(user => user.id === member.id);
          if (foundUser && !cts.find(u => u.id === foundUser.id)) cts.push(foundUser);
        });
      }

      setCreatorsImages(cts);
    }
  }, [item, usersList]);

  const isBookmarked = () => {
    if (item.Bookmarks) {
      if (item.Bookmarks.some(bookmark => bookmark.userId === user.id)) {
        return true;
      }
    }

    return false;
  };

  const handleSave = e => {
    e.stopPropagation();
    e.preventDefault();

    const itemCopy = { ...item };
    itemCopy.userAddress = user.id;
    itemCopy.bookmarked = !isBookmarked();

    let path = `/community/bookmark`;
    axios
      .post(`${URL()}` + path, itemCopy)
      .then(response => {
        if (response.data.success) {
          if (itemCopy.bookmarked) {
            if (itemCopy.Bookmarks) {
              if (!itemCopy.Bookmarks.some(bookmark => bookmark.userId === user.id)) {
                itemCopy.Bookmarks.push({ userId: user.id, date: new Date() });
              }
            } else itemCopy.Bookmarks = [{ userId: user.id, date: new Date() }];
          } else {
            if (itemCopy.Bookmarks) {
              itemCopy.Bookmarks = itemCopy.Bookmarks.filter(item => item.userId !== user.id);
            }
          }

          setBookmarked(itemCopy.Bookmarks.some(b => b.userId === user.id));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = e => {
    e.stopPropagation();
    e.preventDefault();
    if (type === "Social") {
      history.push(`/privi-social/${window.location.href.split("/")[5]}/social-token/${item.TokenSymbol}`);
      return;
    }
  };

  const handleCloseModal = e => {
    e.stopPropagation();
    e.preventDefault();
    setOpenModal(false);
  };

  const handleOpenShareModal = e => {
    e.stopPropagation();
    e.preventDefault();

    shareMediaToSocial(item.id, "Community");
  };

  const handleOpenQRCodeModal = e => {
    e.stopPropagation();
    e.preventDefault();
    shareMediaWithQrCode(item?.Name, `communities/${item?.Name.replace(/\s/g, "")}`);
  };

  const handleToggleShareMenu = e => {
    e.stopPropagation();
    e.preventDefault();

    setOpenShareMenu(prevShareMenuOpen => !prevShareMenuOpen);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    event.stopPropagation();
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenShareMenu(false);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const handleClickCard = () => {
    if (type === "Social") {
    } else if (type === "Crew") {
      history.push(`/privi-DAO/${item.id}`);
    } else if (type === "Media") {
      setOpenMediaDetailsModal(true);
    } else {
    }

    //TODO: route to new pages
  };

  return (
    <>
      <div
        className={classes.card}
        style={
          noMargin
            ? { margin: 0, width: "100%" }
            : {
              marginRight: "42px",
              marginBottom: "42px",
              width: "calc(100% - 42px)",
            }
        }
        onClick={handleClickCard}
      >
        <div className={classes.topActions}>
          <Box display="flex" alignItems="center">
            {type !== "Social" && (
              <span onClick={handleSave}>
                <img
                  src={require(`assets/priviIcons/${bookmarked ? "bookmark-filled" : "bookmark"}.svg`)}
                  alt={"list"}
                />
              </span>
            )}
            {type !== "Social" && (
              <span onClick={handleToggleShareMenu} ref={anchorShareMenuRef}>
                <img src={require("assets/priviIcons/share.svg")} alt={"share"} />
              </span>
            )}
            {openShareMenu && (
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
                    <Paper className="popoverPaper">
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

                          <CustomMenuItem onClick={handleOpenQRCodeModal}>
                            <img
                              src={require("assets/icons/qrcode_small.png")}
                              alt={"spaceship"}
                              style={{ width: 20, height: 20, marginRight: 5 }}
                            />
                            Share With QR Code
                          </CustomMenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            )}
          </Box>
          <div className={classes.chain}>Chain: {chain}</div>
        </div>
        <div
          className={classes.header}
          onMouseEnter={() => setOnHover(true)}
          onMouseLeave={() => setOnHover(false)}
          style={!heightFixed && creatorsImages.length > 0 ? { minHeight: "330px" } : { minHeight: "270px" }}
        >
          <div
            className={classes.cardCover}
            style={
              item.dimensions && !heightFixed
                ? {
                  height: 0,
                  paddingBottom: `${(item.dimensions.height / item.dimensions.width) * 100 >= 120
                    ? (item.dimensions.height / item.dimensions.width) * 100
                    : 120
                    }%`,
                }
                : {
                  height: !heightFixed && creatorsImages.length > 0 ? "330px" : "272px",
                }
            }
          >
            <div className={classes.aspectRatioWrapper}>
              {!imageURL || type === "Social" ? (
                <div
                  className={classes.image}
                  style={
                    type === "Social"
                      ? {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }
                      : {}
                  }
                >
                  {type === "Social" && (
                    <img className={classes.socialTokenImg} src={item.imageURL} alt={"card"} />
                  )}
                </div>
              ) : (
                <object data={imageURL} type="image/png" className={cls(classes.image, classes.img)}>
                  <div className={classes.image} />
                </object>
              )}
            </div>
            <div className={cls({ [classes.hidden]: !onHover }, classes.aspectRatioWrapper)}>
              <div className={classes.content}>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <Box>
                    <Box fontSize="14px" alignItems="center" display="flex">
                      <img
                        src={require("assets/emojiIcons/fruits.png")}
                        alt="fruits"
                        width="22px"
                        height="21px"
                        style={{ marginRight: "8px" }}
                      />
                      Fruits
                    </Box>
                    <Box>{fruits}</Box>
                  </Box>
                  <Box>
                    <Box fontSize="14px" alignItems="center" display="flex">
                      <img
                        src={require("assets/emojiIcons/spaceship.png")}
                        alt="spaceship"
                        width="22px"
                        height="21px"
                        style={{ marginRight: "8px" }}
                      />
                      Shares
                    </Box>
                    <Box>{shares}</Box>
                  </Box>
                  <Box>
                    <Box fontSize="14px" alignItems="center" display="flex">
                      <img
                        src={require("assets/emojiIcons/glasses.png")}
                        alt="glasses"
                        width="22px"
                        height="21px"
                        style={{ marginRight: "8px" }}
                      />
                      Views
                    </Box>
                    <Box>{views}</Box>
                  </Box>
                </Box>

                <Box width="100%">
                  <StyledDivider color={Color.White} type="solid" margin={3} />
                </Box>

                <Box display="flex" alignItems="flex-start" justifyContent="space-between" width="100%">
                  <Box>
                    <Box fontSize="14px">Price</Box>
                    <Box>{price}</Box>
                    <Box fontSize="14px">(${usdPrice})</Box>
                  </Box>
                  <Box>
                    <Box fontSize="14px">24h change</Box>
                    <Box>{change24h}</Box>
                  </Box>
                </Box>

                {creatorsImages && creatorsImages.length > 0 && (
                  <Box width="100%">
                    <StyledDivider color={Color.White} type="solid" margin={3} />
                  </Box>
                )}

                {creatorsImages && creatorsImages.length > 0 && (
                  <Box display="flex" alignItems="center" justifyContent="flex-start" alignSelf="flex-start">
                    {creatorsImages.map((creator, index) =>
                      index < 3 ? (
                        <div
                          key={`creator-${index}`}
                          className={classes.avatar}
                          style={{
                            backgroundImage: `url(${creator && creator.imageURL
                              ? creator.imageURL
                              : getRandomAvatarForUserIdWithMemoization(creator.id)
                              })`,
                          }}
                        />
                      ) : null
                    )}
                    {creatorsImages.length > 3 && (
                      <div className={classes.creatorsCounter}>+{creatorsImages.length - 1}</div>
                    )}
                  </Box>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={classes.bottomContent}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              {type === "Media" && (
                <img
                  width={36}
                  style={{ marginRight: "8px" }}
                  src={require(`assets/mediaIcons/small/${item.Type
                    ? item.Type === MediaType.Audio
                      ? "audio"
                      : item.Type === MediaType.Blog
                        ? "blog"
                        : item.Type === MediaType.BlogSnap
                          ? "blog_snap"
                          : item.Type === MediaType.DigitalArt
                            ? "digital_art"
                            : item.Type === MediaType.LiveAudio
                              ? "audio_live"
                              : item.Type === MediaType.LiveVideo
                                ? "video_live"
                                : "video"
                    : "all"
                    }.png`)}
                />
              )}
              <Box>{itemName}</Box>
            </Box>

            <FruitSelect
              counter1={2}
              counter2={30}
              counter3={137}
              fruitObject={item}
              members={type === "Crew" ? item.Members : []}
            />
          </Box>

          {type.includes("Pod") && (
            <Box mt="4px">
              <SocialPrimaryButton>Fractionalise</SocialPrimaryButton>
            </Box>
          )}
        </div>
      </div>
      {openMediaDetailsModal && (
        <MediaDetailsModal
          open={openMediaDetailsModal}
          handleClose={() => setOpenMediaDetailsModal(false)}
          media={item}
        />
      )}
    </>
  );
}

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);
