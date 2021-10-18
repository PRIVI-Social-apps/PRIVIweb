import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import URL from "shared/functions/getURL";
import axios from "axios";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import {
  makeStyles,
  Badge,
  Avatar,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Popper,
} from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { withStyles } from "@material-ui/core/styles";
import PrintMarketplaceChart from "components/legacy/Media/Marketplace/components/Chart/MarketplaceChart";
import MarketplaceChartConfig from "components/legacy/Media/Marketplace/components/Chart/MarketplaceChartConfig";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import { makePoints, makeLabels } from "shared/ui-kit/Chart/Chart-Utils";
import { buildJsxFromObject, formatNumber, getMediaImage, handleSetStatus } from "shared/functions/commonFunctions";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { ChainInfo, Collection, Details } from "../components/MarkeplaceMediaDetail";
import { SaleOfferTable } from "./components";
import BuyNFTModal from "components/legacy/Media/modals/BuyNFTModal/index";
import PlaceBuyingOfferModal from "components/legacy/Media/modals/PlaceBuyingOfferModal/index";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";
import Box from 'shared/ui-kit/Box';
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { cancelSellingOffer, ICancelOffer, getTokenHolders } from "shared/services/API";

const backIcon = require("assets/icons/back.png");

// ---------- from MyEarningsNew -----------
const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    maxHeight: "95vh",
    padding: "21px 72px 57px 72px",
    overflow: "auto",
  },
  loaderDiv: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  back: {
    color: "#707582",
    "& span": {
      fontSize: 14,
      marginLeft: 10,
    },
    marginBottom: 19,
    cursor: "pointer",
  },
  headerImg: {
    width: 367,
    height: 367,
    borderRadius: 20,
  },
  avatarImg: {
    width: 72,
    height: 72,
  },
  auctionUser: {
    color: "#FF79D1",
  },
  auctionUserVerified: {
    marginLeft: "4px",
    width: "20px",
    height: "20px",
  },
  auctionUserLevel: {
    marginLeft: 4,
    padding: "3px 8px 1px",
    fontSize: 11,
    lineHeight: 12,
    fontWeight: 400,
    border: "1px solid #707582",
    borderRadius: 9,
    height: 18,
    width: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedLabel: {
    width: 21,
    height: 21,
    marginRight: 4,
  },
  ownershipHistory: {
    color: "#23D0C6",
    cursor: "pointer",
  },
  accordionSection: {
    width: 373,
  },
  accordionHistory: {
    width: "100%",
    marginLeft: 48,
  },
  dashedTopBorder: {
    borderTop: "1px dashed #18181830",
  },
  actionButton: {
    marginBottom: "0 !important",
  },
  paper: {
    minWidth: 200,
    marginLeft: -65,
    marginTop: -105,
    borderRadius: 10,
    boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
  },
  bookmarkShareBtn: {
    backgroundColor: "white",
    padding: 0,
    height: 0,
  },
}));

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

const StyledBadge = withStyles(theme => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const SalePage = () => {
  const classes = useStyles();
  const history = useHistory();
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);
  const { shareMediaToSocial, shareMediaToPrivi } = useShareMedia();

  const [media, setMedia] = useState<any>({});
  const [owner, setOwner] = useState<any>({});
  const [creator, setCreator] = useState<any>({});
  const [owners, setOwners] = useState<any[]>([]);

  const [offerList, setOfferList] = useState<any>([]);
  const [priceHistoryChart, setPriceHistoryChart] = useState<any>(MarketplaceChartConfig("$"));

  const [rateOfChange, setRateOfChange] = useState<any>({});

  const [isMediaLoading, setIsMediaLoading] = useState<boolean>(false);
  const [isOwnerLoading, setIsOwnerLoading] = useState<boolean>(false);
  const [isOfferLoading, setIsOfferLoading] = useState<boolean>(false);
  const [isPriceLoading, setIsPriceLoading] = useState<boolean>(false);
  const [isRateLoading, setIsRateLoading] = useState<boolean>(false);

  const [liked, setLiked] = useState<boolean>(false);
  const [openShareMenu, setOpenShareMenu] = useState(false);
  const anchorShareMenuRef = useRef<HTMLButtonElement>(null);

  const [openBuyNFT, setOpenBuyNFT] = useState<boolean>(false);
  const [openPlaceOffer, setOpenPlaceOffer] = useState<boolean>(false);
  const [status, setStatus] = useState<any>("");

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  // initialise
  useEffect(() => {
    loadData();
  }, [users]);

  useEffect(() => {
    if (media?.Likes && media.Likes.includes(user.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [media?.Likes, user.id]);

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  // load data
  const loadData = async () => {
    const pathName = window.location.href;
    const idUrl = pathName.split("/")[6];
    if (idUrl) {
      let exchangeId;
      let newPriceHistoryChart = { ...priceHistoryChart };
      // get media & set owner
      setIsMediaLoading(true);
      const response = await axios.get(`${URL()}/media/getMedia/${idUrl}/privi`)
      setIsMediaLoading(false);
      const resp: any = response.data;
      if (resp.success) {
        const newMedia = resp.data;
        setMedia(newMedia);
        // set creator as owner
        let ownerAddress;
        if (newMedia.ExchangeData) ownerAddress = newMedia.ExchangeData.NewOwnerAddress ?? newMedia.ExchangeData.CreatorAddress;
        if (ownerAddress) {
          const foundUser = users.find(u => u.address === ownerAddress);
          if (foundUser) setOwner(foundUser);
        }
        // exchange Id
        if (newMedia.Exchange && newMedia.Exchange.length > 0) exchangeId = newMedia.Exchange[0];
        if (newMedia.ExchangeData) {
          // token for graph
          if (newMedia.ExchangeData.OfferToken) {
            newPriceHistoryChart = MarketplaceChartConfig(newMedia.ExchangeData.OfferToken);
          }
          // set creator
          if (newMedia.ExchangeData.CreatorAddress) {
            const foundUser = users.find(u => u.address == newMedia.ExchangeData.CreatorAddress);
            if (foundUser) setCreator(foundUser);
          }
        }
      }
      // get token holders (owners)
      setIsOwnerLoading(true);
      getTokenHolders(idUrl).then(resp => {
        setIsOwnerLoading(false);
        if (resp.success) {
          const data = resp.data;
          const holders = data.Holders;
          const newOwners: any[] = [];
          holders.forEach(holderAddress => {
            if (holderAddress) {
              const foundUser = users.find(u => u.address === holderAddress);
              if (foundUser) newOwners.push(foundUser);
            }
          });
          setOwners(newOwners);
        }
      }).catch(err => {
        setIsOwnerLoading(false);
        console.log(err);
      });
      
      if (exchangeId) {
        // get offer list
        const config = {
          params: {
            token: idUrl,
          },
        };
        setIsOfferLoading(true);
        axios
          .get(`${URL()}/exchange/getBuyingOffers/${exchangeId}`, config)
          .then(async response => {
            setIsOfferLoading(false);
            const resp: any = response.data;
            if (resp.success) {
              const data = resp.data;
              const newOfferList: any[] = [];
              data.forEach(offer => {
                if (offer.CreatorAddress) {
                  // TODO: the creator of the offer could also be a community, not only user
                  const foundUser = users.find(u => u.address === offer.CreatorAddress);
                  newOfferList.push({
                    ...offer,
                    imageUrl: foundUser ? foundUser.imageUrl : "none",
                    name: foundUser ? foundUser.name : "Community",
                    twitter: foundUser ? foundUser.twitter : "community",
                  });
                }
              });
              setOfferList(newOfferList);
            }
          })
          .catch(err => {
            console.log(err);
            setIsOfferLoading(false);
          });
        // get price history
        setIsPriceLoading(true);
        axios
          .get(`${URL()}/exchange/getPriceHistory/${exchangeId}`)
          .then(async response => {
            const resp: any = response.data;
            if (resp.success) {
              const data = resp.data;
              const ys: number[] = [];
              const xs: number[] = [];
              data.forEach(point => {
                ys.push(point.price);
                xs.push(point.date);
              });
              newPriceHistoryChart.config.data.labels = makeLabels(xs, xs.length);
              newPriceHistoryChart.config.data.datasets[0].data = makePoints(xs, ys, xs.length);
              setPriceHistoryChart(newPriceHistoryChart);
            }
            setIsPriceLoading(false);
          })
          .catch(err => {
            setIsPriceLoading(false);
            console.log(err);
          });
      }
      // get rate of change
      setIsRateLoading(true);
      axios.get(`${URL()}/wallet/getCryptosRateAsMap`).then(res => {
        const resp = res.data;
        if (resp.success) {
          setRateOfChange(resp.data);
        }
        setIsRateLoading(false);
      });
    }
  };

  const handleOpenSignatureModal = () => {
    if (media?.ExchangeData?.Id && media?.ExchangeData?.Id) {
      const payload: ICancelOffer = {
        ExchangeId: media.ExchangeData.Id,
        OfferId: media.ExchangeData.Id
      }
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  }

  const handleConfirmSign = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        const resp = await cancelSellingOffer(payload, {});
        if (resp && resp.success) {
          handleSetStatus("Order cancelled successfully", "success", setStatus);
          setTimeout(() => {
            loadData();
          }, 1000);
        }
        else handleSetStatus("Order cancellation failed", "error", setStatus);
      }
    }
    catch (e) {
      handleSetStatus("Order cancellation Order failed: " + e, "error", setStatus);
    }
  };

  const handleLike = () => {
    if (isSignedIn()) {
      setLiked(!liked);

      const mediaCopy = { ...media };
      //to update frontend
      if (liked) {
        mediaCopy.NumLikes--;
      } else {
        mediaCopy.NumLikes++;
      }

      if (mediaCopy.Likes && mediaCopy.Likes.some(like => like === user.id)) {
        axios
          .post(`${URL()}/media/removeLikeMedia/${mediaCopy.id}`, {
            userId: user.id,
            tag: mediaCopy.tag,
            mediaType: mediaCopy.Type,
          })
          .then(response => {
            if (response.data.success) {
              let data = response.data.data;
              mediaCopy.Likes = data.Likes;
              mediaCopy.NumLikes = data.NumLikes;
              setMedia(mediaCopy);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        axios
          .post(`${URL()}/media/likeMedia/${mediaCopy.id}`, {
            userId: user.id,
            tag: mediaCopy.tag,
            mediaType: mediaCopy.Type,
          })
          .then(response => {
            if (response.data.success) {
              let data = response.data.data;
              mediaCopy.Likes = data.Likes;
              mediaCopy.NumLikes = data.NumLikes;
              setMedia(mediaCopy);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };

  const handleWatchMedia = () => {
    if (media.MediaSymbol) {
      history.push(`/media/${media.MediaSymbol.replace(/\s/g, "")}`);
    }
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenShareMenu(false);
  };

  const handleListKeyDownShareMenu = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpenShareMenu(false);
    }
  };

  const handleToggleShareMenu = e => {
    e.stopPropagation();
    e.preventDefault();
    if (isSignedIn()) setOpenShareMenu(prevShareMenuOpen => !prevShareMenuOpen);
  };

  const handleOpenBuyNFT = () => {
    setOpenBuyNFT(true);
  };
  const handleCloseBuyNFT = () => {
    setOpenBuyNFT(false);
  };
  const handleOpenPlaceOffer = () => {
    setOpenPlaceOffer(true);
  };
  const handleClosePlaceOffer = () => {
    setOpenPlaceOffer(false);
  };

  return (
    <div className={classes.root}>
      <SignatureRequestModal
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleConfirmSign}
          handleClose={() => setOpenSignRequestModal(false)}
        />
      <Box display="flex" flexDirection="row" className={classes.back} onClick={() => history.goBack()}>
        <img src={backIcon} />
        <span>Back</span>
      </Box>
      <Box display="flex" flexDirection="row">
        <LoadingWrapper loading={isMediaLoading}>
          <Box mr={6} mb={1} display="flex" flexDirection="column">
            <img className={classes.headerImg} src={getMediaImage(media)} alt="sale_img" />
            {isSignedIn() && (
              <Box display="flex" flexDirection="row" mt={3}>
                <Box mr={2} style={{ cursor: "pointer" }}>
                  <img src={require("assets/icons/tag.png")} alt={"tag"} />
                </Box>
                <Box style={{ marginRight: 12, cursor: "pointer" }} onClick={handleLike}>
                  <img
                    src={require(liked ? "assets/icons/like_filled.png" : "assets/icons/likes.png")}
                    alt={"heart"}
                  />
                </Box>
                <button
                  onClick={handleToggleShareMenu}
                  ref={anchorShareMenuRef}
                  className={classes.bookmarkShareBtn}
                >
                  <img
                    src={require(openShareMenu ? "assets/icons/share_filled.svg" : "assets/icons/share.png")}
                    alt={"share"}
                  />
                </button>
                <Popper
                  open={openShareMenu}
                  anchorEl={anchorShareMenuRef.current}
                  transition
                  disablePortal
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
                            {!media?.eth && (
                              <CustomMenuItem onClick={() => shareMediaToPrivi(media)}>
                                <img
                                  src={require("assets/icons/spaceship.png")}
                                  alt={"spaceship"}
                                  style={{ width: 20, height: 20, marginRight: 5 }}
                                />
                                <b style={{ marginRight: 5 }}>{"Share & Earn"}</b> to Privi
                              </CustomMenuItem>
                            )}
                            <CustomMenuItem onClick={() => shareMediaToSocial(media.id, "Media", media.Type)}>
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
              </Box>
            )}
          </Box>
        </LoadingWrapper>
        <Box display="flex" flexDirection="column" style={{ width: "100%" }}>
          <LoadingWrapper loading={isMediaLoading}>
            <>
              <Box fontWeight={400} fontSize={40} color="#181818">
                {media.MediaName}
              </Box>
              <Box mt={1} display="flex" flexDirection="row">
                <Box>
                  <StyledBadge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    variant="dot"
                  >
                    <Avatar
                      className={classes.avatarImg}
                      alt={owner.name ?? "U"}
                      src={owner.imageUrl ?? "none"}
                    />
                  </StyledBadge>
                </Box>
                <Box ml={2} mt={1} display="flex" flexDirection="column">
                  <Box fontWeight={700} fontSize={22} mb={1}>
                    {owner.name}
                  </Box>
                  <Box display="flex" flexDirection="row">
                    <Box fontWeight={400} fontSize={14} color="#FF79D1">
                      @{owner.twitter != "" ? owner.twitter : owner.name}
                    </Box>
                    <Box>
                      <img
                        className={classes.auctionUserVerified}
                        src={require("assets/icons/check_gray.png")}
                        alt={`tick`}
                      />
                    </Box>
                    <div className={classes.auctionUserLevel}>{`level ${owner.level}`}</div>
                  </Box>
                  <Box className={classes.verifiedLabel}>
                    <img src={require("assets/icons/check.png")} alt={"check"} />
                  </Box>
                </Box>
              </Box>
            </>
          </LoadingWrapper>
          <Box pt={2} className={classes.dashedTopBorder}>
            <Box fontWeight={700} fontSize={14} color="#707582" style={{ marginBottom: 5 }}>
              Owners
            </Box>
            <LoadingWrapper loading={isMediaLoading || isOwnerLoading || isRateLoading}>
              <>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <AvatarGroup max={4}>
                    {owners.map(o => {
                      return <Avatar alt={o.name} src={o.imageUrl ?? "none"} />;
                    })}
                  </AvatarGroup>
                  <Box ml={2}>
                    <Box fontWeight={400} fontSize={14} color="#23D0C6">
                      View Ownership History
                    </Box>
                  </Box>
                </Box>
                <Box mt={3} pt={2} display="flex" flexDirection="row" className={classes.dashedTopBorder}>
                  <Box display="flex" flexDirection="column">
                    <Box fontWeight={400} fontSize={18} color="#707582">
                      💰 Price
                    </Box>
                    <Box mt={2} fontWeight={400} fontSize={30} color="#181818">
                      {media.ExchangeData && !["Sold", "Cancelled"].includes(media.ExchangeData.Status)
                        ? formatNumber(media.ExchangeData.Price, media.ExchangeData.OfferToken, 4)
                        : ""}
                    </Box>
                    <Box fontWeight={400} fontSize={18} color="#707582">
                      {media.ExchangeData && !["Sold", "Cancelled"].includes(media.ExchangeData.Status)
                        ? formatNumber(
                            Math.floor(
                              (rateOfChange[media.ExchangeData.OfferToken] ?? 1) * media.ExchangeData.Price
                            ),
                            "$",
                            4
                          )
                        : ""}
                    </Box>
                  </Box>
                  <Box ml={4} display="flex" flexDirection="column">
                    <Box fontWeight={400} fontSize={18} color="#707582">
                      📈 Shares
                    </Box>
                    <Box mt={2} fontWeight={400} fontSize={30} color="#181818">
                      {media.NftConditions ? media.NftConditions.Royalty : "0"}%
                    </Box>
                    <Box fontWeight={400} fontSize={18} color="#707582">
                      Royalty
                    </Box>
                  </Box>
                  <Box ml={4} display="flex" flexDirection="column">
                    <Box mt={6} fontWeight={400} fontSize={30} color="#181818">
                      {media.SharingPct ?? "0"}%
                    </Box>
                    <Box fontWeight={400} fontSize={18} color="#707582">
                      Sharing Share
                    </Box>
                  </Box>
                </Box>
                <Box mt={3} display="flex" flexDirection="row" alignItems="center">
                  {isSignedIn() && media.ExchangeData && media?.ExchangeData?.Status != "Sold" &&
                    media?.ExchangeData?.Status != "Cancelled" ? (
                    false ? (
                    // user.address && owner.address && user.address == owner.address ? (
                        <PrimaryButton
                          size="medium"
                          style={{ width: 250 }}
                          className={classes.actionButton}
                          onClick={handleOpenSignatureModal}
                        >
                          Remove Selling Offer
                        </PrimaryButton>
                    ) : (
                      <>
                        <PrimaryButton
                          size="medium"
                          style={{ width: 220 }}
                          className={classes.actionButton}
                          onClick={handleOpenBuyNFT}
                        >
                          Buy Now
                        </PrimaryButton>
                        <BuyNFTModal
                          open={openBuyNFT}
                          handleClose={handleCloseBuyNFT}
                          handleRefresh={loadData}
                          handleSwitchPlaceOffer={() => {
                            handleCloseBuyNFT();
                            handleOpenPlaceOffer();
                          }}
                          setStatus={setStatus}
                          media={media}
                          isFromExchange={true}
                        />
                        <PlaceBuyingOfferModal
                          open={openPlaceOffer}
                          handleClose={handleClosePlaceOffer}
                          handleRefresh={loadData}
                          setStatus={setStatus}
                          media={media}
                        />
                        <SecondaryButton
                          size="medium"
                          style={{ width: 220 }}
                          className={classes.actionButton}
                          onClick={handleWatchMedia}
                        >
                          Watch Media
                        </SecondaryButton>
                      </>
                    )
                  ) : null}
                  <Box ml={1} style={{ width: "100%", border: "1px solid #99a1b3" }}></Box>
                </Box>
              </>
            </LoadingWrapper>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row">
        <LoadingWrapper loading={isMediaLoading}>
          <Box display="flex" flexDirection="column" className={classes.accordionSection}>
            <Box>
              <Details owner={creator} user={user} media={media} />
            </Box>
            <Box>
              <Collection media={media} />
            </Box>
            <Box>
              <ChainInfo media={media} />
            </Box>
          </Box>
        </LoadingWrapper>

        <Box display="flex" flexDirection="column" className={classes.accordionHistory}>
          <Box mt={6} fontWeight={700} fontSize={18}>
            Price History
          </Box>
          <Box>{PrintMarketplaceChart(priceHistoryChart, [])}</Box>
          <LoadingWrapper loading={isOfferLoading || isMediaLoading}>
            <SaleOfferTable
              isOwner={user.address && owner.address && user.address == owner.address}
              offerList={offerList}
              media={media}
              setStatus={setStatus}
              handleRefresh={loadData}
            />
          </LoadingWrapper>
        </Box>
      </Box>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
};

export default SalePage;
