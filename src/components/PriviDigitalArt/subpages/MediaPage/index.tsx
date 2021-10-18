import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import { useHistory, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ClickAwayListener,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@material-ui/core";

import { digitalArtModalStyles } from "./index.styles";
import {
  Avatar,
  Text,
  Header3,
  PrimaryButton,
  SecondaryButton,
  Color,
  FontSize,
  Header5,
  SignatureRequestModal,
  Variant,
} from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { ShareMenu } from "components/PriviDigitalArt/components/ShareMenu";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import { useTypedSelector } from "store/reducers/Reducer";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import URL from "shared/functions/getURL";
import { convertObjectToJsx } from "shared/functions/commonFunctions";
import { signPayload } from "shared/services/WalletSign";
import { DropDownIcon } from "shared/ui-kit/Icons";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import DigitalArtDetailsModal from "components/PriviDigitalArt/modals/DigitalArtDetailsModal";
import { PlaceBidModal } from "components/PriviDigitalArt/modals/PlaceBidModal";
import BuyNFTModal from "components/PriviDigitalArt/modals/BuyNFTModal";
import PlaceBuyingOfferModal from "components/PriviDigitalArt/modals/PlaceBuyingOfferModal";
import { ChooseWalletModal } from "shared/ui-kit/Modal/Modals/ChooseWalletModal";
import ConfirmPayment from "components/legacy/Communities/modals/ConfirmPayment";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { removeUndef } from "shared/helpers";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { BackButton } from "components/legacy/Collab/components/backButton";
import { MediaPhotoDetailsModal } from "../../modals/MediaPhotoDetailsModal";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";

const FreeHoursChartConfig = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: "line",
          label: "",
          data: [] as any[],
          pointRadius: 0,
          backgroundColor: "#F9E373",
          borderColor: "#F9E373",
          pointBackgroundColor: "#F9E373",
          hoverBackgroundColor: "#F9E373",
          borderJoinStyle: "round",
          borderCapStyle: "round",
          borderWidth: 3,
          cubicInterpolationMode: "monotone",
          lineTension: 0,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: "#F7F9FECC",
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 5,
          hoverRadius: 5,
        },
      },

      legend: {
        display: false,
      },

      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 32,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            offset: false,
            display: true,
            gridLines: {
              color: "#ffffff",
              lineWidth: 50,
            },
            ticks: {
              beginAtZero: true,
              fontColor: "#6B6B6B",
              fontFamily: "Agrandir",
              display: false,
            },
          },
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              color: "#EFF2F8",
            },
            ticks: {
              display: false,
              beginAtZero: true,
            },
          },
        ],
      },

      tooltips: {
        mode: "label",
        intersect: false,
        callbacks: {
          //This removes the tooltip title
          title: function () { },
          label: function (tooltipItem, data) {
            return `$${tooltipItem.yLabel.toFixed(4)}`;
          },
        },
        //this removes legend color
        displayColors: false,
        yPadding: 10,
        xPadding: 10,
        position: "nearest",
        caretSize: 10,
        backgroundColor: "rgba(255,255,255,0.9)",
        bodyFontSize: 15,
        bodyFontColor: "#303030",
      },

      plugins: {
        datalabels: {
          display: function (context) {
            return context.dataset.data[context.dataIndex] !== 0;
          },
        },
      },
    },
  },
};

const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
    gradient.addColorStop(1, `${config.data.datasets[index].backgroundColor}33`);
    gradient.addColorStop(0.5, `${config.data.datasets[index].backgroundColor}b0`);
    config.data.datasets[index].backgroundColor = gradient;
  }

  return config;
};

const offerTableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "From",
    headerAlign: "center",
  },
  {
    headerName: "Token",
    headerAlign: "center",
  },
  {
    headerName: "Symbol",
    headerAlign: "center",
  },
  {
    headerName: "Price",
    headerAlign: "center",
  },
];

const MediaPage = () => {
  const location: any = useLocation();
  let pathName = window.location.href;
  let idUrl = pathName.split("/")[5] ? pathName.split("/")[5] : "";
  const tag = location.state ? location.state.blockchainTag : "privi";
  const classes = digitalArtModalStyles();
  const history = useHistory();
  const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
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
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [creator, setCreator] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [comments, setComments] = useState<any[]>([]);
  const [isViewComments, setIsViewComments] = useState<boolean>(false);
  const [isShowingMediaPhotoDetailModal, setIsShowingMediaPhotoDetailModal] = useState<boolean>(false);

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

  const [freeHoursConfig, setFreeHoursConfig] = useState<any>();

  // update getMedia
  useEffect(() => {
    const newConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newConfig.configurer = configurer;
    newConfig.config.data.labels = [100, 200, 400, 500, 600, 600, 800, 1200, 3400, 2300, 6700, 8900];
    newConfig.config.data.datasets[0].data = [
      100,
      200,
      400,
      500,
      600,
      600,
      800,
      1200,
      3400,
      2300,
      6700,
      8900,
    ];
    newConfig.config.data.datasets[0].backgroundColor = "#9EACF2";
    newConfig.config.data.datasets[0].borderColor = "#9EACF2";
    newConfig.config.data.datasets[0].pointBackgroundColor = "#9EACF2";
    newConfig.config.data.datasets[0].hoverBackgroundColor = "#9EACF2";
    setFreeHoursConfig(newConfig);

    const loadMedia = async () => {
      setIsDataLoading(true);
      axios
        .get(`${URL()}/media/getMedia/${idUrl}/${tag}`)
        .then(async response => {
          let data: any = response.data;
          if (data.success) {
            let m = data.data;

            if (m.Comments && m.Comments.length) {
              const newComments = m.Comments.map(item => {
                const user = allUsers.find(userItem => userItem.id === item.user.id);
                return {
                  comment: item.comment,
                  date: item.date,
                  user,
                };
              });
              setComments(newComments);
            }
            m.eth = tag === "privi" ? false : true;
            m.ImageUrl = m.HasPhoto
              ? `${URL()}/media/getMediaMainPhoto/${m.MediaSymbol.replace(/\s/g, "")}`
              : undefined;

            const artistUser = allUsers.find(
              user =>
                (m.Creator && m.Creator !== "" && user.id === m.Creator) ||
                (m.CreatorId && m.CreatorId !== "" && user.id === m.CreatorId) ||
                (m.Requester && m.Requester !== "" && user.id === m.Requester)
            );

            if (artistUser) {
              m.Artist = {
                name: artistUser.name ?? "",
                imageURL: artistUser.imageURL ?? "",
                urlSlug: artistUser.urlSlug ?? "",
                id: artistUser.id ?? "",
              };
            } else if (m.creator) {
              m.randomAvatar = getRandomAvatarForUserIdWithMemoization(m.creator);
            } else {
              m.Artist = undefined;
            }

            const SavedCollabs =
              m.SavedCollabs && m.SavedCollabs.length > 0
                ? m.SavedCollabs.map(collaborator => {
                  const collaboratorUser = allUsers.find(user => user.id === collaborator.id);

                  return collaboratorUser
                    ? {
                      ...collaborator,
                      name: collaboratorUser.name ?? "",
                      imageURL: collaboratorUser.imageURL ?? "",
                      urlSlug: collaboratorUser.urlSlug ?? "",
                      id: collaboratorUser.id ?? "",
                    }
                    : undefined;
                }).filter(removeUndef)
                : undefined;

            m.SavedCollabs = SavedCollabs;

            if (!m.price) {
              if (
                m.QuickCreation &&
                m.ViewConditions &&
                m.ViewConditions.Price > 0 &&
                m.ViewConditions.ViewingToken
              ) {
                m.price = `${m.ViewConditions.ViewingToken.toUpperCase()} ${m.ViewConditions.Price}${m.ViewConditions.ViewingType === "DYNAMIC" ? "/per sec" : ""
                  }`;
              } else if (m.PaymentType === "FIXED" && m.FundingToken) {
                m.price = `${m.FundingToken.toUpperCase() ?? ""} ${m.Price && m.Price !== 0 ? m.Price : ""}`;
              } else if (m.PaymentType === "DYNAMIC" && m.FundingToken) {
                m.price = `${m.FundingToken.toUpperCase() ?? ""} ${m.PricePerSecond && m.PricePerSecond !== 0 ? m.PricePerSecond + "/per sec." : ""
                  }`;
              } else m.price = "";
            } else {
              if (m.price && m.price.includes("($")) {
                //separate price from usd price
                let price = m.price.split("(")[0];
                let usdPrice = "(" + m.price.split("(")[1];

                m.price = price;
                m.usdPrice = usdPrice;
              }
            }

            setCreator(artistUser);
            // setSelectedMedia(m);
            setMedia(data.data);
            if (data.data.Rating) handleRatings(data.data.Rating);
          } else {
            setStatus({
              msg: "Error loading Media",
              key: Math.random(),
              variant: "error",
            });
            if (window.location.href.includes("/privi-digital-art/")) {
              history.push("/privi-digital-art");
            }
          }
          setIsDataLoading(false);
        })
        .catch(err => {
          setIsDataLoading(false);
          setStatus({
            msg: "Error requesting Media",
            key: Math.random(),
            variant: "error",
          });
          if (window.location.href.includes("/privi-digital-art/")) {
            history.push("/privi-digital-art");
          }
        });
    };
    if (idUrl !== "" && (!media || !media?.id)) {
      loadMedia();
    }
  }, [idUrl, pathName]);

  useEffect(() => {
    if (creator && isUserFollowed(creator?.id)) {
      setIsFollowing(true);
    }
  }, [creator]);

  useEffect(() => {
    if (media && media?.Bookmarks && media?.Bookmarks.some((id: string) => id === user.id))
      setBookmarked(true);
    if (media && media?.Likes && media?.Likes.some((id: string) => id === user.id)) setLiked(true);
    if (media && media?.Auctions) {
      const timerId = setInterval(() => {
        const now = new Date();
        let delta = Math.floor(media?.Auctions.EndTime - now.getTime() / 1000);
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
      MediaSymbol: media?.Auctions.MediaSymbol,
      TokenSymbol: media?.Auctions.TokenSymbol,
      MediaType: media?.Type,
      Owner: media?.Auctions.Owner,
      Address: user.address,
      Amount: price,
    };

    setBidPrice(price);
    const detailNode = convertObjectToJsx(placeBidData);
    setSignRequestModalDetail(detailNode);
    setOpenSignRequestModal(true);
  };

  const handlePlaceBid = (price: number, topBidPrice: number | "N/A") => {
    if (!media?.Auctions) {
      setStatus({
        msg: "Failed to Place a Bid",
        key: Math.random(),
        variant: "error",
      });
      return;
    }
    const token = media?.Auctions.TokenSymbol;
    if (!userBalances[token] || userBalances[token].Balance < price) {
      setStatus({
        msg: `Insufficient ${token} balance`,
        key: Math.random(),
        variant: "error",
      });
      return;
    }
    if (topBidPrice !== "N/A" && price < topBidPrice + media?.Auctions.BidIncrement) {
      setStatus({
        msg: `Bid Amount should be higher than Top Bid Amount(${media?.Auctions.TokenSymbol}${topBidPrice + media?.Auctions.BidIncrement
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
      MediaSymbol: media?.Auctions.MediaSymbol,
      TokenSymbol: media?.Auctions.TokenSymbol,
      MediaType: media?.Type,
      Owner: media?.Auctions.Owner,
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
            .get(`${URL()}/media/getMedia/${media?.id}/privi`, {
              params: { mediaType: media?.Type },
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
        .post(`${URL()}/media/removeLikeMedia/${media?.MediaSymbol ?? media?.id}`, {
          userId: user.id,
          tag: media?.tag ?? "privi",
          mediaType: media?.Type,
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
        .post(`${URL()}/media/likeMedia/${media?.MediaSymbol ?? media?.id}`, {
          userId: user.id,
          tag: media?.tag ?? "privi",
          mediaType: media?.Type,
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
      followUser(creator?.id);
    } else {
      unfollowUser(creator?.id);
    }
  };

  const handleOpenWalletModal = () => {
    setChooseWalletModal(true);
  };

  const handleCloseWalletModal = () => {
    setChooseWalletModal(false);
  };

  const topBidPrice = React.useMemo(() => {
    if (!media || !media?.Auctions || !media?.BidHistory || media?.BidHistory.length === 0) return "N/A";
    return Math.max(...media?.BidHistory.map((history: any) => parseInt(history.price)));
  }, [media]);

  const owners = React.useMemo(() => {
    if (!media || !media?.Auctions || !media?.BidHistory || media?.BidHistory.length === 0) return [];
    return [
      ...new Set(
        media?.BidHistory.map((history: any) =>
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
        DocId: media?.MediaSymbol ?? media?.id,
        MediaType: media?.Type,
        MediaTag: media?.tag ?? "privi",
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
      .post(`${URL()}/media/bookmarkMedia/${media?.MediaSymbol ?? media?.id}`, {
        userId: user.id,
        mediaType: media?.Type,
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
      .post(`${URL()}/media/removeBookmarkMedia/${media?.MediaSymbol ?? media?.id}`, {
        userId: user.id,
        mediaType: media?.Type,
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
            mediaId: media?.id,
            mediaType: media?.Type,
            mediaTag: media?.tag ?? "privi",
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
            {media?.NftConditions ? media?.NftConditions.Royalty || 1 : 1}%
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
            {media?.SharingPct || 5}%
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

  const handleOpenMediaPhotoDetailModal = () => {
    setIsShowingMediaPhotoDetailModal(true);
  };

  const handleCloseMediaPhotoDetailModal = () => {
    setIsShowingMediaPhotoDetailModal(false);
  };
  const getTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    [1, 2, 3, 4].map(item => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
            <Avatar size="medium" url={creator?.imageUrl || creator?.anonAvatar} />
            <Box display="flex" flexDirection="column">
              <Text color={Color.Black} className={classes.creatorName} style={{ marginBottom: 4 }}>
                {creator?.name}
              </Text>
              <Text className={classes.creatorName}>{`@${creator?.urlSlug}`}</Text>
            </Box>
          </Box>
        ),
        cellAlign: "center",
      });
      row.push({
        cell: <img src={require("assets/tokenImages/USDT.png")} width="24px" />,
        cellAlign: "center",
      });
      row.push({
        cell: <Box className={classes.header2}>USDT</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Box className={classes.header2}>2,400</Box>,
        cellAlign: "center",
      });

      tableData.push(row);
    });

    return tableData;
  };

  const handleFruit = type => {
    const body = {
      userId: user.id,
      fruitId: type,
      mediaAddress: media.MediaSymbol ?? media.id,
      mediaType: media.Type,
      tag: media.tag ?? "privi",
    };

    axios.post(`${URL()}/media/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...media };
        itemCopy.fruits = [
          ...(itemCopy.fruits || []),
          { userId: user.id, fruitId: type, date: new Date().getTime() },
        ];
      }
    });
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>{media?.MediaName || media?.title}</title>
        <meta name="description" content={media?.MediaDescription || media?.description} />
        <meta property="og:image" content={media?.Type === 'DIGITAL_ART_TYPE' ? media?.Url : media?.UrlMainPhoto} />
        <meta name="og:image" content={media?.mediaURL} />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="720" />
      </Helmet>
      <div className={classes.content}>
        <BackButton />
        <LoadingWrapper loading={!media || isDataLoading}>
          <Box>
            <Header3 noMargin>{media?.MediaName}</Header3>
            <Grid container spacing={2} style={{ marginTop: "16px", marginBottom: "16px" }}>
              <Grid item xs={12} sm={6}>
                <Box width={1} mr={1} onClick={handleOpenMediaPhotoDetailModal}>
                  <img
                    src={
                      media?.Type === "VIDEO_TYPE"
                        ? media?.UrlMainPhoto
                        : media?.Url ||
                        media?.url ||
                        `https://source.unsplash.com/random/${Math.floor(Math.random() * 1000)}`
                    }
                    className={classes.detailImg}
                    width="100%"
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                style={{
                  marginTop: "8px",
                  paddingTop: media?.Auctions ? 0 : 2,
                  paddingBottom: media?.Auctions ? 0 : 2,
                }}
              >
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Avatar size="medium" url={creator?.imageUrl || creator?.anonAvatar} />
                    <Box display="flex" flexDirection="column" ml={1} mr={1.25}>
                      <Text color={Color.Black} className={classes.creatorName} style={{ marginBottom: 4 }}>
                        {creator?.name}
                      </Text>
                      <Text className={classes.creatorName}>{`@${creator?.urlSlug}`}</Text>
                    </Box>
                    {user && media?.CreatorId !== user.id && (
                      <SecondaryButton size="small" onClick={handleFollow} className={classes.followBtn}>
                        {isFollowing ? "Unfollow" : "Follow"}
                      </SecondaryButton>
                    )}
                  </Box>
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Box mr={2} style={{ background: "rgba(67, 26, 183, 0.32)", borderRadius: "50%" }}>
                      <FruitSelect fruitObject={media} onGiveFruit={handleFruit} />
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
                <Box display="flex" alignItems="center" my={2}>
                  {owners.length > 0 && (
                    <Box display="flex" alignItems="center">
                      {owners.map((owner: any) => (
                        <Avatar
                          key={`artist-${owner.id}`}
                          className={classes.artist}
                          size="small"
                          url={owner.hasPhoto ? owner.url : owner.imageUrl}
                        />
                      ))}
                      <Text color={Color.Purple} ml={2}>
                        Ownership History
                      </Text>
                    </Box>
                  )}
                  <Text size={FontSize.XL} mr={5}>
                    💾 {media?.shareCount || 0}
                  </Text>
                  <div onClick={handleOpenShareMenu} ref={anchorShareMenuRef}>
                    <Text size={FontSize.XL} mr={5}>
                      👀 {media?.TotalViews || 0}
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
                <hr className={classes.divider} />
                {media?.BidHistory && media?.BidHistory.length > 0 ? (
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
                <Box display="flex" alignItems="center" mb={2}>
                  <img src={require("assets/logos/privi.png")} width="32px" />
                  <Box ml={2}>Privi Chain</Box>
                </Box>
                {!media?.Auctions && media?.NftConditions ? (
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Text color={Color.Black} size={FontSize.XL}>
                      Price
                    </Text>
                    <Text color={Color.Purple} size={FontSize.XXL} ml={1} mr={1}>
                      {`ETH ${media?.ExchangeData ? media?.ExchangeData.Price : media?.NftConditions.Price}`}
                    </Text>
                    <Text color={Color.Black} size={FontSize.S}>
                      {`$(${convertTokenToUSD(
                        media?.ExchangeData
                          ? media?.ExchangeData.OfferToken
                          : media?.NftConditions.NftToken || media?.NftConditions.FundingToken,
                        media?.ExchangeData ? media?.ExchangeData.Price : media?.NftConditions.Price
                      ).toFixed(6)})`}
                    </Text>
                  </Box>
                ) : media?.Auctions && media?.NftConditions ? (
                  <>
                    <>
                      {topBidPrice !== "N/A" && (
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <Text color={Color.Black} size={FontSize.XL}>
                            Top bid
                          </Text>
                          <Text color={Color.Purple} size={FontSize.XXL} ml={1} mr={1}>
                            {`${media?.Auctions.TokenSymbol} ${topBidPrice}`}
                          </Text>
                          <Text color={Color.Black} size={FontSize.S}>
                            {`$(${convertTokenToUSD(media?.Auctions.TokenSymbol, topBidPrice).toFixed(6)})`}
                          </Text>
                        </Box>
                      )}
                      <Box mb={1}>
                        <Text size={FontSize.S} color={Color.Black}>
                          {`Bidding token is ${media?.Auctions.TokenSymbol}`}
                        </Text>
                      </Box>
                    </>
                    {media?.NftConditions && (
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
                          {media?.Auctions ? (
                            <Text color={Color.Purple} size={FontSize.XL} bold>{`${(media?.Auctions.Gathered
                                ? media?.Auctions.Gathered
                                : media?.NftConditions.Price) || ""
                              } ${media?.Auctions.Gathered
                                ? media?.Auctions.TokenSymbol || ""
                                : media?.NftConditions.NftToken || ""
                              }`}</Text>
                          ) : media?.ExchangeData ? (
                            <Text color={Color.Purple} size={FontSize.XL} bold>{`${media?.ExchangeData.Price || ""
                              } ${media?.ExchangeData.OfferToken || ""}`}</Text>
                          ) : (
                            <Text color={Color.Purple} size={FontSize.XL} bold>{`${media?.NftConditions.Price || ""
                              } ${media?.NftConditions.NftToken || ""}`}</Text>
                          )}
                        </Box>
                        {media?.Auctions && (
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
                  {media?.Auctions && media?.Auctions.Address !== user.address && (
                    <PrimaryButton size="medium" onClick={handleOpenBidModal} className={classes.primaryBtn}>
                      Place a Bid
                    </PrimaryButton>
                  )}
                  {media?.ExchangeData && media?.ExchangeData.NewOwnerAddress !== user.address && (
                    <PrimaryButton size="medium" onClick={handleOpenBidModal} className={classes.primaryBtn}>
                      Buy NFT
                    </PrimaryButton>
                  )}
                  {((media?.Auctions && media?.Auctions.Address === user.address) ||
                    (media?.ExchangeData && media?.ExchangeData.NewOwnerAddress === user.address)) && (
                      <SecondaryButton
                        size="medium"
                        onClick={handleOpenDetailModal}
                        className={classes.transparentBtn}
                      >
                        View More Details
                      </SecondaryButton>
                    )}
                </Box>
              </Grid>
            </Grid>
            <Box my={3}>{media?.Auctions ? "Bid History" : "Price History"}</Box>
            <Box className={classes.graphBox} height="200px" mb={3}>
              {freeHoursConfig && <PrintChart config={freeHoursConfig} />}
              <Box className={classes.whiteBox}>
                <Box>1.034 ETH</Box>
                <Box mt={1} color="#431AB7" fontSize={"12px"}>
                  +2.544 (+7%)
                </Box>
              </Box>
            </Box>
            <Box my={2}>Offers</Box>
            {media?.Auctions ? (
              <Box mb={2}>
                <Grid container>
                  {[1, 2, 3, 4].map((_, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
                        <Avatar size="medium" url={creator?.imageUrl || creator?.anonAvatar} />
                        <Box display="flex" flexDirection="column" ml={1} mr={3}>
                          <Text
                            color={Color.Black}
                            className={classes.creatorName}
                            style={{ marginBottom: 4, maxWidth: "none" }}
                          >
                            Bid Placed by <span style={{ color: "#431AB7" }}>@{creator?.name}</span>
                          </Text>
                          <Text className={classes.creatorName}>
                            <span style={{ color: "#431AB7", opacity: 0.7 }}>1.868 ETH</span> On March 30,
                            2021 at 1:05pm
                          </Text>
                        </Box>
                        <img src={require("assets/icons/newScreen.svg")} alt="link" />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Box mb={2}>
                <CustomTable
                  headers={offerTableHeaders}
                  rows={getTableData()}
                  placeholderText="No Offers"
                  theme="transaction"
                  variant={Variant.Tertiary}
                />
              </Box>
            )}

            <Header5>Description</Header5>
            <Text style={{ overflowWrap: "anywhere" }}>{media?.MediaDescription}</Text>
            <hr className={classes.divider} />
            <Header5>{`About ${creator?.name}`}</Header5>
            <Text>{creator?.bio}</Text>
            <hr className={classes.divider} />
            <Header5>Rate this Digital Art</Header5>
            <Grid container spacing={2}>
              {mediaRatings.map((rating, index) => (
                <Grid item={true} key={`rating - ${index}`} xs={6} md={4} lg={2}>
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

            {comments.length ? (
              !isViewComments ? (
                <Text className={classes.link} size={FontSize.S} onClick={() => setIsViewComments(true)}>
                  View all {comments.length} comments
                </Text>
              ) : (
                comments.map((comment, index) => (
                  <Box key={`comment-${index}`} mt={2} display="flex" alignContent="center" gridColumnGap={8}>
                    <Avatar
                      size="medium"
                      url={comment.user.hasPhoto ? comment.user.url : comment.user.imageUrl}
                    />
                    <Box display="flex" flexDirection="column" justifyContent="center" gridRowGap={4}>
                      <span className={classes.commentUername}>{comment.user.urlSlug}</span>
                      <span className={classes.commentDescription}>{comment.comment}</span>
                    </Box>
                  </Box>
                ))
              )
            ) : null}
          </Box>
          <DigitalArtDetailsModal open={openDetailModal} handleClose={handleCloseDetailModal} media={media} />
          {media?.Auctions ? (
            <PlaceBidModal
              isOpen={openBidModal}
              onClose={handleCloseBidModal}
              placeBid={(price: number, topBidPrice: number | "N/A") => {
                handlePlaceBid(price, topBidPrice);
                // handleOpenWalletModal();
              }}
              viewDetails={() => { }}
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
          {media?.ExchangeData && (
            <PlaceBuyingOfferModal
              open={!openPlaceOffer}
              handleClose={handleClosePlaceOffer}
              handleRefresh={() => null}
              setStatus={setStatus}
              media={media}
            />
          )}
          <ChooseWalletModal
            isOpen={chooseWalletModal}
            onClose={handleCloseWalletModal}
            onAccept={() => { }}
          />
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
            payWithCommunity={() => { }}
          />
          <MediaPhotoDetailsModal
            isOpen={isShowingMediaPhotoDetailModal}
            onClose={handleCloseMediaPhotoDetailModal}
            imageURL={
              media?.Type === "VIDEO_TYPE"
                ? media?.UrlMainPhoto
                : media?.Url ||
                media?.url ||
                `https://source.unsplash.com/random/${Math.floor(Math.random() * 1000)}`
            }
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
        </LoadingWrapper>
      </div>
    </div>
  );
};

export default React.memo(MediaPage);
