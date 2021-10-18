import React, { useEffect, useState, useRef } from "react";
import ReactStars from "react-rating-stars-component";
import axios from "axios";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ClickAwayListener,
  Grid,
  Grow,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@material-ui/core";

import {
  Avatar,
  Color,
  FontSize,
  Header3,
  Header5,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Text,
} from "shared/ui-kit";
import { DropDownIcon } from "shared/ui-kit/Icons";
import { ChooseWalletModal } from "shared/ui-kit/Modal/Modals/ChooseWalletModal";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import { convertObjectToJsx } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { signPayload } from "shared/services/WalletSign";
import Box from "shared/ui-kit/Box";
import ConfirmPayment from "components/legacy/Communities/modals/ConfirmPayment";
import { ShareMenu } from "components/PriviDigitalArt/components/ShareMenu";
import { PlaceBidModal } from "../PlaceBidModal";
import PlaceBuyingOfferModal from "../PlaceBuyingOfferModal";
import DigitalArtDetailsModal from "../DigitalArtDetailsModal";
import BuyNFTModal from "../BuyNFTModal";
import { digitalArtModalStyles } from "./index.styles";

export default function DigitalArtModal({ open, handleClose, selectedMedia, creator }) {
  const classes = digitalArtModalStyles();
  const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
  const isFollowing = creator && isUserFollowed(creator.id);
  const [openDetailModal, setOpenDetailModal] = React.useState<boolean>(false);
  const [openBidModal, setOpenBidModal] = React.useState<boolean>(false);
  const [chooseWalletModal, setChooseWalletModal] = React.useState<boolean>(false);
  const [auctionEnded, setAuctionEnded] = React.useState<boolean>(false);
  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const [liked, setLiked] = React.useState<boolean>(false);
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);
  const allUsers = useTypedSelector(state => state.usersInfoList);
  const { convertTokenToUSD } = useTokenConversion();
  const [endTime, setEndTime] = useState<any>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [status, setStatus] = useState<any>(""); // show status of the operation
  const [media, setMedia] = useState<any>(null);
  const [openPlaceOffer, setOpenPlaceOffer] = React.useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);
  const [bidPrice, setBidPrice] = useState<number>(0);
  const priceRef = useRef<number>(0);
  const [openConfirmPaymentModal, setOpenConfirmPaymentModal] = useState<boolean>(false);

  const [openOptionsMenu, setOpenOptionsMenu] = useState<boolean>(false);
  const anchorOptionsMenuRef = React.useRef<HTMLDivElement>(null);

  const [mediaRatings, setRatings] = useState<any[]>([
    {
      key: "like",
      feedback: "I like it",
      myRate: 0,
      average: 0,
    },
    {
      key: "beautiful",
      feedback: "Beautiful",
      myRate: 0,
      average: 0,
    },
    {
      key: "buy",
      feedback: "A must buy",
      myRate: 0,
      average: 0,
    },
    {
      key: "priced",
      feedback: "Over priced",
      myRate: 0,
      average: 0,
    },
    {
      key: "dontLike",
      feedback: "Don't like it",
      myRate: 0,
      average: 0,
    },
    {
      key: "innovative",
      feedback: "Innovative",
      myRate: 0,
      average: 0,
    },
  ]);

  React.useEffect(() => {
    axios
      .get(`${URL()}/media/getMedia/${selectedMedia.MediaSymbol ?? selectedMedia.id}/${selectedMedia.tag ?? 'privi'}`, {
        params: { mediaType: selectedMedia.Type },
      })
      .then(async response => {
        let data: any = response.data;
        if (data.success) {
          setMedia(data.data);
          if (data.data.Rating) handleRatings(data.data.Rating);
        }
      })
      .catch(err => console.log(err));
  }, [selectedMedia]);

  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);

  const handleOpenDetailModal = React.useCallback(() => {
    setOpenDetailModal(true);
  }, [setOpenDetailModal]);

  const handleCloseDetailModal = React.useCallback(() => {
    setOpenDetailModal(false);
  }, [setOpenDetailModal]);

  const handleOpenBidModal = React.useCallback(() => {
    setOpenBidModal(true);
  }, [setOpenBidModal]);

  const handleCloseBidModal = React.useCallback(() => {
    setOpenBidModal(false);
  }, [setOpenBidModal]);

  const handleOpenPlaceOffer = React.useCallback(() => {
    setOpenPlaceOffer(true);
  }, [setOpenPlaceOffer]);

  const handleClosePlaceOffer = React.useCallback(() => {
    setOpenPlaceOffer(false);
  }, [setOpenPlaceOffer]);

  const payWithOwnWallet = async () => {
    setOpenConfirmPaymentModal(false);
    const price = priceRef.current;
    const placeBidData = {
      MediaSymbol: media.Auctions.MediaSymbol,
      TokenSymbol: media.Auctions.TokenSymbol,
      MediaType: media.Type,
      Owner: media.Auctions.Owner,
      Address: user.address,
      Amount: price,
    };

    setBidPrice(price);
    const detailNode = convertObjectToJsx(placeBidData);
    setSignRequestModalDetail(detailNode);
    setOpenSignRequestModal(true);
  };
  const handlePlaceBid = (price: number, topBidPrice: number | "N/A") => {
    if (!media.Auctions) {
      setStatus({
        msg: "Failed to Place a Bid",
        key: Math.random(),
        variant: "error",
      });
      return;
    }
    const token = media.Auctions.TokenSymbol;
    if (!userBalances[token] || userBalances[token].Balance < price) {
      setStatus({
        msg: `Insufficient ${token} balance`,
        key: Math.random(),
        variant: "error",
      });
      return;
    }
    if (topBidPrice !== "N/A" && price < topBidPrice + media.Auctions.BidIncrement) {
      setStatus({
        msg: `Bid Amount should be higher than Top Bid Amount(${media.Auctions.TokenSymbol}${
          topBidPrice + media.Auctions.BidIncrement
        })`,
        key: Math.random(),
        variant: "error",
      });
      return;
    }

    priceRef.current = price;
    setOpenConfirmPaymentModal(true);
  };

  const handleConfirmSign = async () => {
    const data = {
      MediaSymbol: media.Auctions.MediaSymbol,
      TokenSymbol: media.Auctions.TokenSymbol,
      MediaType: media.Type,
      Owner: media.Auctions.Owner,
      Address: user.address,
      Amount: bidPrice,
    };

    const { signature } = await signPayload("placeBid", user.address, data);
    axios
      .post(`${URL()}/auction/placeBid/v2`, {
        Data: {
          Address: user.address,
          Function: "placeBid",
          Signature: signature,
          Payload: data,
        },
        Chain: "privi",
      })
      .then(response => {
        if (response.data.success) {
          setStatus({
            msg: "Bid placed successfully",
            key: Math.random(),
            variant: "success",
          });
          axios
            .get(`${URL()}/media/getMedia/${media.id}/privi`, {
              params: { mediaType: media.Type },
            })
            .then(res => {
              if (res.data.success) {
                const data = res.data.data;
                setMedia(data);
              }
            })
            .catch(err => {
              console.log(err);
            });
          setTimeout(() => {
            handleCloseBidModal();
          }, 1000);
        } else {
          setStatus({
            msg: "Failed to Place a Bid",
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(error => {
        setStatus({
          msg: "Failed to Place a Bid",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  const handleLike = () => {
    if (liked) {
      axios
        .post(`${URL()}/media/removeLikeMedia/${media.MediaSymbol ?? media.id}`, {
          userId: user.id,
          tag: media.tag ?? "privi",
          mediaType: media.Type,
        })
        .then(response => {
          if (response.data.success) {
            setLiked(false);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      axios
        .post(`${URL()}/media/likeMedia/${media.MediaSymbol ?? media.id}`, {
          userId: user.id,
          tag: media.tag ?? "privi",
          mediaType: media.Type,
        })
        .then(response => {
          if (response.data.success) {
            setLiked(true);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const handleOpenShareMenu = () => {
    setOpenShareMenu(!openShareMenu);
  };

  const handleCloseShareMenu = () => {
    setOpenShareMenu(false);
  };

  const handleFollow = e => {
    e.stopPropagation();
    e.preventDefault();
    if (!creator) return;

    if (!isFollowing) {
      followUser(creator.id);
    } else {
      unfollowUser(creator.id);
    }
  };

  useEffect(() => {
    if (media && media.Bookmarks && media.Bookmarks.some((id: string) => id === user.id)) setBookmarked(true);
    if (media && media.Likes && media.Likes.some((id: string) => id === user.id)) setLiked(true);
    if (media && media.Auctions) {
      const timerId = setInterval(() => {
        const now = new Date();
        let delta = Math.floor(media.Auctions.EndTime - now.getTime() / 1000);
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
  }, [media]);

  const handleOpenWalletModal = () => {
    setChooseWalletModal(true);
  };

  const handleCloseWalletModal = () => {
    setChooseWalletModal(false);
  };

  const topBidPrice = React.useMemo(() => {
    if (!media || !media.Auctions || !media.BidHistory || media.BidHistory.length === 0) return "N/A";
    return Math.max(...media.BidHistory.map((history: any) => parseInt(history.price)));
  }, [media]);

  const owners = React.useMemo(() => {
    if (!media || !media.Auctions || !media.BidHistory || media.BidHistory.length === 0) return [];
    return [
      ...new Set(
        media.BidHistory.map((history: any) =>
          allUsers.find(user => user.address === history.bidderAddress)
        ).filter(history => !!history)
      ),
    ];
  }, [allUsers, media]);

  const handleChangeComment = e => {
    setComment(e.target.value);
  };

  const addComment = () => {
    if (!comment) return;
    axios
      .post(`${URL()}/streaming/addComment`, {
        DocId: media.MediaSymbol ?? media.id,
        MediaType: media.Type,
        MediaTag: media.tag ?? "privi",
        UserId: user.id,
        Comment: {
          user: {
            id: user.id,
            name: `${user.firstName || ""} ${user.lastName || ""}`,
          },
          comment,
          date: new Date(),
        },
      })
      .then(res => {
        setStatus({
          msg: "Comment added",
          key: Math.random(),
          variant: "success",
        });
        setComment("");
      })
      .catch(err => {
        console.log(err);
      });
  };

  const bookmarkMedia = () => {
    axios
      .post(`${URL()}/media/bookmarkMedia/${media.MediaSymbol ?? media.id}`, {
        userId: user.id,
        mediaType: media.Type,
      })
      .then(res => {
        setStatus({
          msg: "Bookmarked media",
          key: Math.random(),
          variant: "success",
        });
        setComment("");
      })
      .catch(err => {
        console.log(err);
      });
  };

  const unBookmarkMedia = () => {
    axios
      .post(`${URL()}/media/removeBookmarkMedia/${media.MediaSymbol ?? media.id}`, {
        userId: user.id,
        mediaType: media.Type,
      })
      .then(res => {
        setStatus({
          msg: "Removed bookmark",
          key: Math.random(),
          variant: "success",
        });
        setComment("");
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleBookmark = React.useCallback(() => {
    if (!bookmarked) bookmarkMedia();
    else unBookmarkMedia();
  }, [bookmarked, bookmarkMedia, unBookmarkMedia]);

  const handleRatings = (ratings: any) => {
    let rates = [...mediaRatings];
    const count = ratings.length;

    const sumLike = ratings.reduce((prev, current) => (prev + current.like ? current.like : 0), 0);
    const sumBeautiful = ratings.reduce(
      (prev, current) => (prev + current.beautiful ? current.beautiful : 0),
      0
    );
    const sumBuy = ratings.reduce((prev, current) => (prev + current.buy ? current.buy : 0), 0);
    const sumPriced = ratings.reduce((prev, current) => (prev + current.priced ? current.priced : 0), 0);
    const sumDontLike = ratings.reduce(
      (prev, current) => (prev + current.dontLike ? current.dontLike : 0),
      0
    );
    const sumInnovative = ratings.reduce(
      (prev, current) => (prev + current.innovative ? current.innovative : 0),
      0
    );

    rates[0].average = sumLike / count;
    rates[1].average = sumBeautiful / count;
    rates[2].average = sumBuy / count;
    rates[3].average = sumPriced / count;
    rates[4].average = sumDontLike / count;
    rates[5].average = sumInnovative / count;

    // My rate
    const myRate = ratings.filter(item => item.userId === user.id)[0];
    if (myRate) {
      rates[0].myRate = myRate.like ? myRate.like : rates[0].myRate;
      rates[1].myRate = myRate.beautiful ? myRate.beautiful : rates[1].myRate;
      rates[2].myRate = myRate.buy ? myRate.buy : rates[2].myRate;
      rates[3].myRate = myRate.priced ? myRate.priced : rates[3].myRate;
      rates[4].myRate = myRate.dontLike ? myRate.dontLike : rates[4].myRate;
      rates[5].myRate = myRate.innovative ? myRate.innovative : rates[5].myRate;
    }
    setRatings([...rates]);
  };

  const handleRateMedia = React.useCallback(
    (rating: any, newRating: number) => {
      const ratingType = rating.key;
      if (newRating >= 0) {
        axios
          .post(`${URL()}/media/rateMedia`, {
            mediaId: media.id,
            mediaType: media.Type,
            mediaTag: media.tag ?? "privi",
            userId: user.id,
            ratingType,
            ratingValue: newRating,
          })
          .then(response => {
            if (response.data.success) {
              handleRatings(response.data.ratings);
            }
          })
          .catch(error => console.log(error));
      }
    },
    [handleRatings]
  );

  const renderCollection = () => {
    return (
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box display="flex" flexDirection="column">
          <Text>Royalty</Text>
          <Text mt={1} color={Color.Black} size={FontSize.XL}>
            {media.NftConditions ? media.NftConditions.Royalty || 1 : 1}%
          </Text>
        </Box>
        <Box display="flex" flexDirection="column">
          <Text>Investors Share</Text>
          <Text mt={1} color={Color.Black} size={FontSize.XL}>
            25%
          </Text>
        </Box>
        <Box display="flex" flexDirection="column">
          <Text>Sharing Share</Text>
          <Text mt={1} color={Color.Black} size={FontSize.XL}>
            {media.SharingPct || 5}%
          </Text>
        </Box>
      </Box>
    );
  };

  const handleOptions = () => {
    setOpenOptionsMenu(!openOptionsMenu);
  };

  const handleCloseOptionsMenu = () => {
    setOpenOptionsMenu(false);
  };

  if (!media) return null;
  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
      <Box>
        <Header3 noMargin>{media.MediaName}</Header3>
        <Box display="flex" flexDirection="row" mt={2} mb={3}>
          <Box width={1} mr={1}>
            <img
              src={media.Type === "VIDEO_TYPE" ? media.UrlMainPhoto : media.Url || media.url}
              className={classes.detailImg}
              width="100%"
            />
          </Box>
          <Box width={1} ml={1} py={media.Auctions ? 0 : 2}>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
              <Box display="flex" flexDirection="row" alignItems="center">
                <Avatar size="medium" url={creator.imageUrl || creator.anonAvatar} />
                <Box display="flex" flexDirection="column" ml={1} mr={1.25}>
                  <Text color={Color.Black} className={classes.creatorName} style={{ marginBottom: 4 }}>
                    {creator.name}
                  </Text>
                  <Text className={classes.creatorName}>{`@${creator.urlSlug}`}</Text>
                </Box>
                {user && media.CreatorId !== user.id && (
                  <SecondaryButton size="medium" onClick={handleFollow} className={classes.followBtn}>
                    {isFollowing ? "Unfollow" : "Follow"}
                  </SecondaryButton>
                )}
              </Box>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box onClick={handleLike} mr={2}>
                  <img
                    src={require(`assets/icons/${liked ? "heart_dark_filled" : "heart_dark"}.png`)}
                    alt="like"
                    style={{ cursor: "pointer", width: 21 }}
                  />
                </Box>
                <Box mr={2}>
                  <img
                    src={require(`assets/icons/bookmark.png`)}
                    alt="Bookmark"
                    onClick={handleBookmark}
                    style={{ cursor: "pointer" }}
                  />
                </Box>
                <Box mb={1}>
                  <div ref={anchorOptionsMenuRef} onClick={handleOptions} style={{ cursor: "pointer" }}>
                    <img src={require(`assets/icons/more.png`)} alt="like" />
                  </div>
                </Box>
              </Box>
            </Box>
            <ShareMenu
              openMenu={openOptionsMenu}
              anchorRef={anchorOptionsMenuRef}
              item={media}
              handleCloseMenu={handleCloseOptionsMenu}
              isLeftAligned={true}
            />
            <Box display="flex" flexDirection="row" my={2}>
              <Text size={FontSize.XL} mr={5}>
                ❤️ {media.NumLikes || 0}
              </Text>
              <Text size={FontSize.XL} mr={5}>
                💾 {media.shareCount || 0}
              </Text>
              <div onClick={handleOpenShareMenu} ref={anchorShareMenuRef}>
                <Text size={FontSize.XL} mr={5}>
                  👀 {media.TotalViews || 0}
                </Text>
              </div>
              <Popper
                open={openShareMenu}
                anchorEl={anchorShareMenuRef.current}
                transition
                disablePortal
                style={{ position: "inherit", zIndex: 9999 }}
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
                        <MenuList autoFocusItem={openShareMenu} id="menu-list-grow">
                          <MenuItem>
                            <img
                              src={require("assets/icons/spaceship.png")}
                              alt={"spaceship"}
                              style={{ width: 20, height: 20, marginRight: 5 }}
                            />
                            <b style={{ marginRight: 5 }}>{"Share & Earn"}</b> to Privi
                          </MenuItem>
                          <MenuItem>
                            <img
                              src={require("assets/icons/butterfly.png")}
                              alt={"spaceship"}
                              style={{ width: 20, height: 20, marginRight: 5 }}
                            />
                            Share on social media
                          </MenuItem>
                          <MenuItem>
                            <img
                              src={require("assets/icons/qrcode_small.png")}
                              alt={"spaceship"}
                              style={{ width: 20, height: 20, marginRight: 5 }}
                            />
                            Share With QR Code
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Box>
            {owners.length > 0 && (
              <Box display="flex" flexDirection="row" alignItems="center">
                {owners.map((owner: any) => (
                  <Avatar
                    key={`artist-${owner.id}`}
                    className={classes.artist}
                    size="small"
                    url={owner.url}
                  />
                ))}
                <Text color={Color.Purple} ml={2}>
                  Ownership History
                </Text>
              </Box>
            )}
            <hr className={classes.divider} />
            {media.BidHistory && media.BidHistory.length > 0 ? (
              <Accordion className={classes.accordion}>
                <AccordionSummary expandIcon={<DropDownIcon />}>
                  <Header5 noMargin>Collection</Header5>
                </AccordionSummary>
                <AccordionDetails>{renderCollection()}</AccordionDetails>
              </Accordion>
            ) : (
              <>
                <Header5>Collection</Header5>
                {renderCollection()}
              </>
            )}
            <hr className={classes.divider} />
            {!media.Auctions && media.NftConditions ? (
              <Box display="flex" flexDirection="row" alignItems="center">
                <Text color={Color.Black} size={FontSize.XL}>
                  Price
                </Text>
                <Text color={Color.Purple} size={FontSize.XXL} ml={1} mr={1}>
                  {`ETH ${media.ExchangeData ? media.ExchangeData.Price : media.NftConditions.Price}`}
                </Text>
                <Text color={Color.Black} size={FontSize.S}>
                  {`$(${convertTokenToUSD(
                    media.ExchangeData
                      ? media.ExchangeData.OfferToken
                      : media.NftConditions.NftToken || media.NftConditions.FundingToken,
                    media.ExchangeData ? media.ExchangeData.Price : media.NftConditions.Price
                  ).toFixed(6)})`}
                </Text>
              </Box>
            ) : media.Auctions && media.NftConditions ? (
              <>
                <>
                  {topBidPrice !== "N/A" && (
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <Text color={Color.Black} size={FontSize.XL}>
                        Top bid
                      </Text>
                      <Text color={Color.Purple} size={FontSize.XXL} ml={1} mr={1}>
                        {`${media.Auctions.TokenSymbol} ${topBidPrice}`}
                      </Text>
                      <Text color={Color.Black} size={FontSize.S}>
                        {`$(${convertTokenToUSD(media.Auctions.TokenSymbol, topBidPrice).toFixed(6)})`}
                      </Text>
                    </Box>
                  )}
                  <Box mb={1}>
                    <Text size={FontSize.S} color={Color.Black}>
                      {`Bidding token is ${media.Auctions.TokenSymbol}`}
                    </Text>
                  </Box>
                </>
                {media.NftConditions && (
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    bgcolor={Color.GreenLight}
                    borderRadius={8}
                    px={2}
                    py={1}
                  >
                    <Box display="flex" flexDirection="column" alignItems="flex-start">
                      <Text color={Color.Purple} mb={0.5}>
                        Reserve price
                      </Text>
                      {media.Auctions ? (
                        <Text color={Color.Purple} size={FontSize.XL} bold>{`${
                          (media.Auctions.Gathered ? media.Auctions.Gathered : media.NftConditions.Price) ||
                          ""
                        } ${
                          media.Auctions.Gathered
                            ? media.Auctions.TokenSymbol || ""
                            : media.NftConditions.NftToken || ""
                        }`}</Text>
                      ) : media.ExchangeData ? (
                        <Text color={Color.Purple} size={FontSize.XL} bold>{`${
                          media.ExchangeData.Price || ""
                        } ${media.ExchangeData.OfferToken || ""}`}</Text>
                      ) : (
                        <Text color={Color.Purple} size={FontSize.XL} bold>{`${
                          media.NftConditions.Price || ""
                        } ${media.NftConditions.NftToken || ""}`}</Text>
                      )}
                    </Box>
                    {media.Auctions && (
                      <Box display="flex" flexDirection="column" alignItems="flex-end">
                        <Text color={Color.Purple} mb={0.5}>
                          {!auctionEnded ? "Auction Ending In" : "Auction Ended"}
                        </Text>
                        {!auctionEnded && (
                          <Text color={Color.Purple} size={FontSize.XL} bold>
                            {`${endTime.days ? `${String(endTime.days).padStart(2, "0")}d` : ""} ${String(
                              endTime.hours
                            ).padStart(2, "0")}h ${String(endTime.minutes).padStart(2, "0")}m ${String(
                              endTime.seconds
                            ).padStart(2, "0")}s`}
                          </Text>
                        )}
                      </Box>
                    )}
                  </Box>
                )}
              </>
            ) : null}
            <Box display="flex" flexDirection="row" justifyContent="space-between" mt={3}>
              {media.Auctions && media.Auctions.Address !== user.address && (
                <PrimaryButton size="medium" onClick={handleOpenBidModal} className={classes.primaryBtn}>
                  Place a Bid
                </PrimaryButton>
              )}
              {media.ExchangeData && media.ExchangeData.NewOwnerAddress !== user.address && (
                <PrimaryButton size="medium" onClick={handleOpenBidModal} className={classes.primaryBtn}>
                  Buy NFT
                </PrimaryButton>
              )}
              {((media.Auctions && media.Auctions.Address === user.address) ||
                (media.ExchangeData && media.ExchangeData.NewOwnerAddress === user.address)) && (
                <SecondaryButton
                  size="medium"
                  onClick={handleOpenDetailModal}
                  className={classes.transparentBtn}
                >
                  View More Details
                </SecondaryButton>
              )}
            </Box>
          </Box>
        </Box>
        <Header5>Description</Header5>
        <Text style={{ overflowWrap: "anywhere" }}>{media.MediaDescription}</Text>
        <hr className={classes.divider} />
        <Header5>{`About ${creator.name}`}</Header5>
        <Text>{creator.bio}</Text>
        <hr className={classes.divider} />
        <Header5>Rate this Digital Art</Header5>
        <Grid container spacing={2}>
          {mediaRatings.map((rating, index) => (
            <Grid item={true} key={`rating - ${index}`} xs={12} md={4} lg={2}>
              <Box mb={2}>
                <Header5 noMargin>{rating.average}</Header5>
                <Text mt={1.5}>{rating.feedback}</Text>
              </Box>
              <ReactStars
                count={5}
                value={rating.myRate}
                isHalf={true}
                onChange={newRating => handleRateMedia(rating, newRating)}
                size={12}
                activeColor="#FFD43E"
                color="#E0E4F3"
              />
            </Grid>
          ))}
        </Grid>
        <hr className={classes.divider} />
        <Header5>Comments</Header5>
        <Box className={classes.message} display="flex" flexDirection="row" alignItems="center" mb={2}>
          <Avatar size="medium" url={user.url} />
          <InputWithLabelAndTooltip
            transparent
            overriedClasses=""
            type="text"
            inputValue={comment}
            onInputValueChange={handleChangeComment}
          />
          <Text
            size={FontSize.S}
            mr={2}
            onClick={() => setComment(`${comment}😍`)}
            style={{ cursor: "pointer" }}
          >
            😍
          </Text>
          <Text
            size={FontSize.S}
            mr={2}
            onClick={() => setComment(`${comment}😭`)}
            style={{ cursor: "pointer" }}
          >
            😭
          </Text>
          <img src={require("assets/icons/+.png")} onClick={addComment} style={{ cursor: "pointer" }} />
        </Box>
        <Text size={FontSize.S}>View all comments</Text>
      </Box>
      <DigitalArtDetailsModal open={openDetailModal} handleClose={handleCloseDetailModal} media={media} />
      {media.Auctions ? (
        <PlaceBidModal
          isOpen={openBidModal}
          onClose={handleCloseBidModal}
          placeBid={(price: number, topBidPrice: number | "N/A") => {
            handlePlaceBid(price, topBidPrice);
            // handleOpenWalletModal();
          }}
          viewDetails={() => {}}
          media={media}
        />
      ) : (
        <BuyNFTModal
          open={openBidModal}
          handleClose={handleCloseBidModal}
          handleRefresh={() => null}
          handleSwitchPlaceOffer={handleOpenPlaceOffer}
          setStatus={setStatus}
          media={media}
        />
      )}
      {media.ExchangeData && (
        <PlaceBuyingOfferModal
          open={openPlaceOffer}
          handleClose={handleClosePlaceOffer}
          handleRefresh={() => null}
          setStatus={setStatus}
          media={media}
        />
      )}
      <ChooseWalletModal isOpen={chooseWalletModal} onClose={handleCloseWalletModal} onAccept={() => {}} />
      <SignatureRequestModal
        open={openSignRequestModal}
        address={user.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleConfirmSign}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <ConfirmPayment
        open={openConfirmPaymentModal}
        handleClose={() => setOpenConfirmPaymentModal(false)}
        payWithOwnWallet={payWithOwnWallet}
        payWithCommunity={() => {}}
      />
      <div>
        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </Modal>
  );
}
