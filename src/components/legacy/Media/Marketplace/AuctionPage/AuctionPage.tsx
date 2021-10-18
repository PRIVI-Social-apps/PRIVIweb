/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  Grid,
  Badge,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Typography,
  createStyles,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
} from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useTypedSelector } from "store/reducers/Reducer";
import PrintMarketplaceChart from "components/legacy/Media/Marketplace/components/Chart/MarketplaceChart";
import MarketplaceChartConfig from "components/legacy/Media/Marketplace/components/Chart/MarketplaceChartConfig";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import {
  buildJsxFromObject,
  formatNumber,
  getMonthName,
  getMediaImage,
  handleSetStatus,
} from "shared/functions/commonFunctions";
import { PlaceBidModal } from "components/legacy/Media/modals/PlaceBidModal/index";
import { PlaceBidDetailModal } from "components/legacy/Media/modals/PlaceBidDetailModal";
import { makePoints, makeLabels } from "shared/ui-kit/Chart/Chart-Utils";
import {
  Details,
  ChainInfo,
  Collection,
} from "components/legacy/Media/Marketplace/components/MarkeplaceMediaDetail";
import { sumTotalViews } from "shared/functions/totalViews";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import Box from 'shared/ui-kit/Box';
import { cancelAuction, placeBid, startMediaAcquisitionVoting, getTokenHolders } from "shared/services/API";

import { useSubstrate } from "shared/connectors/substrate";
import { ContractInstance, decodeAbiData } from "shared/connectors/substrate/functions";
import POD_AUCTION_CONTRACT from "shared/connectors/substrate/contracts/PodAuction.json";
import ERC721_CONTRACT from "shared/connectors/substrate/contracts/ERC721.json";
import {
  POD_AUCTION_CONTRACT_ADDRESS,
  ERC721_CONTRACT_ADDRESS,
  MEDIA_CONTRACT,
  ERC20_CONTRACT_ADDRESS,
} from "shared/connectors/substrate/config/test.json";
import ConfirmPayment from "components/legacy/Communities/modals/ConfirmPayment";

const backIcon = require("assets/icons/back.png");

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
  headerImgBox: {
    height: 367,
    width: 367,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImg: {
    maxWidth: 367,
    borderRadius: 20,
  },
  avatarImg: {
    width: 72,
    height: 72,
  },
  ownerSection: {
    marginTop: 14,
    borderBottom: "1px dashed #99a1b3",
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
  ownerAvatarImg: {
    width: 32,
    height: 32,
  },
  auctionEndingIn: {
    background: "linear-gradient(97.4deg, #23D0C6 14.43%, #00CC8F 85.96%)",
    color: "White",
    borderRadius: 6,
  },
  accordionSection: {
    width: 373,
  },
  auctionDetailsAccordion: {
    width: 373,
    margin: "0 !important",
    border: "none",
    boxShadow: "none !important",
  },
  auctionDetailsAccodionSummary: {
    padding: 0,
    margin: 0,
    color: "#181818",
    minHeight: 0,
    maxHeight: 58,
  },
  auctionStatusContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  auctionTitleH4: {
    margin: 0,
  },
  tagType: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "4px 11px",
    border: "1px solid #99a1b3",
    borderRadius: "14px",
    height: "30px",
    width: "fit-content",
  },
  noCollectionDiv: {
    padding: 20,
    fontSize: 20,
  },
  auctionCollectionImg: {
    width: 78,
    height: 78,
    borderRadius: 6,
  },
  accordionHistory: {
    width: "100%",
    marginLeft: 48,
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
  noWrap: {
    whiteSpace: "nowrap",
  },
  topBidBox: {
    background: "linear-gradient(97.4deg, #FF79D1 14.43%, #DB00FF 79.45%)",
    borderRadius: 6,
    padding: 12,
  },
  displaceBidBox: {
    padding: 12,
  },
  topBidderName: {
    color: "#FFFFFF",
    fontSize: 14,
    margin: "0px 10px",
  },
  secondBidderName: {
    color: "#FF79D1",
    fontSize: 14,
    margin: "0px 10px",
  },
  bidderAvatar: {
    width: 32,
    height: 32,
  },
  topBidBoxWrapper: {
    height: 100,
  },
  displaceBidBoxWrapper: {
    height: 100,
  },
  stopAuctionButton: {
    width: "350px",
    marginBottom: 0,
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

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      fontFamily: "Agrandir",
      fontSize: "14px",
      color: "black",
      border: "none",
      fontWeight: "normal",
      background: "#F7F9FE",
    },
    body: {
      fontSize: "14px",
      fontFamily: "Agrandir",
      border: "none",
      color: "#949BAB",
      textTransform: "none",
    },
  })
)(TableCell);

// date is in secs
const formatDate = dateSec => {
  const date = new Date(dateSec * 1000);
  return `On ${getMonthName(
    date.getMonth()
  )} ${date.getDate()}, ${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`;
};

interface bidTransaction {
  name: string;
  imageUrl: string;
  twitter: string;
  amount: number;
  token: string;
  date: number;
  id: string;
}

interface Bidder {
  name: string;
  imageUrl: string;
}

export const AuctionPage = () => {
  const classes = useStyles();
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);
  const users = useTypedSelector(state => state.usersInfoList);
  const history = useHistory();
  const { shareMediaToSocial, shareMediaToPrivi } = useShareMedia();

  const [media, setMedia] = useState<any>({});
  const [owner, setOwner] = useState<any>({}); // user (creator)
  const [owners, setOwners] = useState<any[]>([]); // user list (holders)

  const endTimeRef = useRef<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<any>({});

  const [bidTransactions, setBidTransaction] = useState<bidTransaction[]>([]);
  const [topBidder, setTopBidder] = useState<Bidder | null>(null);
  const [displacedBidder, setDisplacedBidder] = useState<Bidder | null>(null);
  const [status, setStatus] = useState<any>("");
  const [rateOfChange, setRateOfChange] = useState<any>({});

  const [openPlaceBidModal, setOpenPlaceBidModal] = useState<boolean>(false);
  const [openViewDetailsModal, setOpenViewDetailsModal] = useState<boolean>(false);
  const [isMediaLoading, setIsMediaLoading] = useState<boolean>(false);
  const [isOwnerLoading, setIsOwnerLoading] = useState<boolean>(false);
  const [isTransactionLoading, setIsTransactionLoading] = useState<boolean>(false);
  const [isBidLoading, setIsBidLoading] = useState<boolean>(false);
  const [isRateLoading, setIsRateLoading] = useState<boolean>(false);

  const [bidHistoryChart, setBidHistoryChart] = useState<any>(MarketplaceChartConfig("$", false));
  const [liked, setLiked] = useState<boolean>(false);
  const [openShareMenu, setOpenShareMenu] = useState(false);
  const anchorShareMenuRef = useRef<HTMLButtonElement>(null);

  const { api, apiState, keyring, keyringState } = useSubstrate();

  const hideShareOnPrivi = media?.eth ?? false;

  const payloadRef = useRef<any>({});
  const functionRef = useRef<string>("");
  const priceRef = useRef<number>(0);
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);
  const [openConfirmPaymentModal, setOpenConfirmPaymentModal] = useState<boolean>(false);
  
  // initialise
  useEffect(() => {
    loadData();
  }, [users]);

  // each second update time reamining
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      if (endTimeRef.current && endTimeRef.current >= now) {
        let n = endTimeRef.current - now;
        let days = parseInt((n / (24 * 3600)).toString());
        n = n % (24 * 3600);
        let hours = parseInt((n / 3600).toString());
        n %= 3600;
        let minutes = parseInt((n / 60).toString());
        n %= 60;
        let seconds = parseInt(n.toString());
        setTimeRemaining({
          days,
          hours,
          minutes,
          seconds,
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (media?.Likes && media.Likes.includes(user.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [media?.Likes, user.id]);

  // load data
  const loadData = async () => {
    const pathName = window.location.href;
    const idUrl = pathName.split("/")[6];
    let newBidHistoryChart = { ...bidHistoryChart };
    if (idUrl) {
      // get media & set owner
      setIsMediaLoading(true);
      await axios
        .get(`${URL()}/media/getMedia/${idUrl}/privi`)
        .then(async response => {
          const resp: any = response.data;
          if (resp.success) {
            const newMedia = resp.data;
            setMedia(newMedia);
            // set auction token for graph
            if (newMedia.Auctions && newMedia.Auctions.TokenSymbol) {
              newBidHistoryChart = MarketplaceChartConfig(newMedia.Auctions.TokenSymbol, false);
            }
            // set end time
            if (newMedia.Auctions && newMedia.Auctions.EndTime) {
              endTimeRef.current = newMedia.Auctions.EndTime;
            }
            // set creator
            if (newMedia.CreatorAddress) {
              const foundUser = users.find(u => u.address === newMedia.CreatorAddress);
              if (foundUser) setOwner(foundUser);
            }
            sumTotalViews(media);
          }
          setIsMediaLoading(false);
        })
        .catch(err => {
          setIsMediaLoading(false);
          console.log(err);
        });
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
      // get tnx
      setIsTransactionLoading(true);
      axios
        .get(`${URL()}/auction/getAuctionTransactions/${idUrl}`)
        .then(async response => {
          const resp: any = response.data;
          if (resp.success) {
            const data = resp.data;
            const newBidTxns: bidTransaction[] = [];
            data.forEach(txn => {
              const foundUser = users.find(u => u.address === txn.From);
              if (foundUser)
                newBidTxns.push({
                  name: foundUser.name,
                  imageUrl: foundUser.imageUrl || foundUser.name,
                  twitter: foundUser.twitter || foundUser.name,
                  token: txn.Token,
                  amount: txn.Amount,
                  date: txn.Date,
                  id: txn.Id,
                });
            });
            const bidTrans = newBidTxns.sort((a, b) => b.amount - a.amount);
            setBidTransaction(bidTrans);

            if (bidTrans.length > 0) {
              const topBidderName = bidTrans[0].twitter;
              setTopBidder({
                name: topBidderName,
                imageUrl: bidTrans[0].imageUrl,
              });
              const filteredBidTrans = bidTrans
                .filter(trans => trans.twitter !== topBidderName)
                .sort((a, b) => b.amount - a.amount);
              if (filteredBidTrans.length > 0) {
                setDisplacedBidder({
                  name: filteredBidTrans[0].twitter,
                  imageUrl: filteredBidTrans[0].imageUrl,
                });
              }
            }
          }
          setIsTransactionLoading(false);
        })
        .catch(err => {
          setIsTransactionLoading(false);
          console.log(err);
        });
      // get bid history
      setIsBidLoading(true);
      axios
        .get(`${URL()}/auction/getBidHistory/${idUrl}`)
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
            newBidHistoryChart.config.data.labels = makeLabels(xs, xs.length);
            newBidHistoryChart.config.data.datasets[0].data = makePoints(xs, ys, xs.length);
            setBidHistoryChart(newBidHistoryChart);
          }
          setIsBidLoading(false);
        })
        .catch(err => {
          setIsBidLoading(false);
          console.log(err);
        });
      // get rate of change
      setIsRateLoading(true);
      axios
        .get(`${URL()}/wallet/getCryptosRateAsMap`)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            setRateOfChange(resp.data);
          }
          setIsRateLoading(false);
        })
        .catch(() => {
          setIsRateLoading(false);
        });
    }
  };

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  const handleCancelAuction = async () => {
    if (media.BlockchainNetwork === "Substrate Chain") {
      if (!api) return;
      const podAuctionContract = ContractInstance(
        api,
        JSON.stringify(POD_AUCTION_CONTRACT),
        POD_AUCTION_CONTRACT_ADDRESS
      );
      const keyringOptions = (keyring as any).getPairs().map(account => ({
        key: account.address,
        value: account.address,
        text: account.meta.name.toUpperCase(),
        icon: "user",
      }));
      const accountAddress = keyringOptions.length > 0 ? keyringOptions[0].value : "";
      const accountPair =
        accountAddress && keyringState === "READY" && (keyring as any).getPair(accountAddress);

      const value = 0;
      const gasLimit = 3000 * 10000000;

      const input = {
        token_address: ERC20_CONTRACT_ADDRESS,
        owner: media.Auctions.Owner,
      };
      await (await podAuctionContract).tx
        .cancelBid({ value, gasLimit }, input)
        .signAndSend(accountPair, result => {
          if (result.status.isInBlock) {
            console.log("in a block");
          } else if (result.status.isError) {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
          } else if (result.status.isFinalized) {
            console.log("finalized");
            result.events
              .filter(({ event }) => api?.events.system.ExtrinsicSuccess.is(event))
              .forEach(({ event }) => {
                const [dispatchInfo] = event.data;
                console.log(dispatchInfo.toHuman());
              });

            const events = result.events
              .filter(({ event }) => api?.events.contracts.ContractEmitted.is(event))
              .forEach(
                async ({
                  event: {
                    data: [, data],
                  },
                }) => {
                  const { args } = decodeAbiData(api, JSON.stringify(POD_AUCTION_CONTRACT), data);
                  let blockchainRes: any = args[0].toHuman();
                  console.log("ContractEmitted: state => ", blockchainRes);
                }
              );
            if (events && events.length) {
              setStatus({
                msg: "Error when making the request",
                key: Math.random(),
                variant: "error",
              });
            } else {
              const body: any = {
                Data: {
                  MediaSymbol: media.MediaSymbol,
                  TokenSymbol: media.Auctions.TokenSymbol,
                  Owner: media.Auctions.Owner,
                  Chain: "substrate",
                },
              };
              axios
                .post(`${URL()}/auction/cancelBid`, body)
                .then(async response => {
                  const resp: any = response.data;
                  if (resp.success) {
                    handleSetStatus("Cancel auction completed", "success", setStatus);
                    loadData();
                  } else {
                    handleSetStatus("Cancel failed", "error", setStatus);
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            }
        }
      });
    }
    else handleOpenSignatureModal("cancelAuction");
  };

  const payWithOwnWallet = async () => {
    const price = priceRef.current;
    const token = media.Auctions.TokenSymbol;
    if (media.BlockchainNetwork === "Substrate Chain") {
      if (!api) return;
      const podAuctionContract = ContractInstance(
        api,
        JSON.stringify(POD_AUCTION_CONTRACT),
        POD_AUCTION_CONTRACT_ADDRESS
      );

      const keyringOptions = (keyring as any).getPairs().map(account => ({
        key: account.address,
        value: account.address,
        text: account.meta.name.toUpperCase(),
        icon: "user",
      }));
      const accountAddress = keyringOptions.length > 0 ? keyringOptions[0].value : "";
      const accountPair =
        accountAddress && keyringState === "READY" && (keyring as any).getPair(accountAddress);
      const value = 0;
      const gasLimit = 3000 * 10000000;
      const input = {
        token_address: ERC20_CONTRACT_ADDRESS,
        owner: media.Auctions.Owner,
        address: accountPair.address,
        amount: price,
      };
      await (await podAuctionContract).tx
        .placeBid({ value, gasLimit }, input)
        .signAndSend(accountPair, result => {
          if (result.status.isInBlock) {
            console.log("in a block");
          } else if (result.status.isError) {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
          } else if (result.status.isFinalized) {
            console.log("finalized");
            result.events
              .filter(({ event }) => api?.events.system.ExtrinsicSuccess.is(event))
              .forEach(({ event }) => {
                const [dispatchInfo] = event.data;
                console.log(dispatchInfo.toHuman());
              });

            const events = result.events
              .filter(({ event }) => api?.events.contracts.ContractEmitted.is(event))
              .forEach(
                async ({
                  event: {
                    data: [, data],
                  },
                }) => {
                  const { args } = decodeAbiData(api, JSON.stringify(POD_AUCTION_CONTRACT), data);
                  let blockchainRes: any = args[0].toHuman();
                  console.log("ContractEmitted: state => ", blockchainRes);
                }
              );
            if (events && events.length) {
              setStatus({
                msg: "Error when making the request",
                key: Math.random(),
                variant: "error",
              });
            } else {
              setOpenConfirmPaymentModal(false);
              const body: any = {
                Data: {
                  MediaSymbol: media.MediaSymbol,
                  MediaType: media.Type,
                  TokenSymbol: token,
                  Owner: media.Auctions.Owner,
                  Address: accountPair,
                  Amount: price,
                  Chain: "substrate",
                },
              };
              // To be fixed: create separate function in BE for substrate
              axios
                .post(`${URL()}/auction/placeBid`, body)
                .then(async response => {
                  const resp: any = response.data;
                  if (resp.success) {                    
                    handleSetStatus("Bid completed", "success", setStatus);
                    setTimeout(() => {
                      setOpenPlaceBidModal(false);
                    }, 1000);
                    loadData();
                  } else {
                    handleSetStatus("Bid failed", "error", setStatus);
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            }
          }
        });
    } 
    else handleOpenSignatureModal("placeBid");
  };

  const payWithCommunity = (communityId) => {
    const body = {
      ProposalCreator: user.address,
      ProposalCreatorId: user.id,
      CommunityId: communityId,
      Proposal: {
        MediaSymbol: media?.Auctions?.MediaSymbol,
        Amount: priceRef.current.toString(),
        TokenSymbol: media?.Auctions?.TokenSymbol,
      },
      ProposalType: "MemberCommunityBid"
    }
    startMediaAcquisitionVoting(body).then(resp => {
      if (resp && resp.success) {
        setOpenConfirmPaymentModal(false);
        setOpenPlaceBidModal(false);
        handleSetStatus("Community media bidding proposal created", "success", setStatus);
      }
      else handleSetStatus("Proposal creation failed", "error", setStatus);
    })
  }

  const handlePlaceBid = (price, topBidPrice) => {
    const token = media.Auctions.TokenSymbol;
    const lowestBid = Math.max(
      media?.Auctions?.Gathered ?? 0 + media?.Auctions?.BidIncrement ?? 0,
      media?.Auctions?.ReservePrice ?? 0
    );
    if (!userBalances[token] || userBalances[token].Balance < price) {
      handleSetStatus(`Insufficient ${token} balance`, "error", setStatus);
      return;
    } 
    else if (price <= lowestBid) {
      handleSetStatus(`Bid have to be greater than ${lowestBid} ${token}`, "error", setStatus);
      return;
    }
    priceRef.current = price;
    setOpenConfirmPaymentModal(true);
  };

  const handleOpenSignatureModal = (operation) => {
    let payload;
    if (operation == "cancelAuction") {
      payload = {
        MediaSymbol: media?.Auctions?.MediaSymbol,
        TokenSymbol: media?.Auctions?.TokenSymbol,
        Owner: media?.Auctions?.Owner,
      };
    } else if (operation == "placeBid") {
      payload = {
        MediaSymbol: media?.Auctions?.MediaSymbol,
        TokenSymbol: media?.Auctions?.TokenSymbol,
        Owner: media?.Auctions?.Owner,
        Address: user.address,
        Amount: priceRef.current.toString(),
      };
    }
    if (payload) {
      functionRef.current = operation;
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  };

  const handleConfirmSign = async () => {
    const payload = payloadRef.current;
    if (Object.keys(payload).length) {
      if (functionRef.current == "cancelAuction") {
        cancelAuction(payload, { MediaType: media.Type })
          .then(resp => {
            if (resp.success) {
              handleSetStatus("Auction cancelled successfully", "success", setStatus);
            } else handleSetStatus("Auction cancelation failed", "error", setStatus);
          })
          .catch(error => {
            handleSetStatus("Auction creation failed: " + error, "error", setStatus);
          });
      } else if (functionRef.current == "placeBid") {
        placeBid(payload, { MediaType: media.Type })
          .then(resp => {
            if (resp.success) {
              handleSetStatus("Bid placed successfully", "success", setStatus);
              setTimeout(() => {
                setOpenConfirmPaymentModal(false);
                setOpenPlaceBidModal(false);
              }, 1000);
            } else handleSetStatus("Bid failed", "error", setStatus);
          })
          .catch(error => {
            handleSetStatus("Bid failed: " + error, "error", setStatus);
          });
      }
    }
  };

  const handleWatchMedia = () => {
    if (media && media.MediaSymbol) {
      history.push(`/media/${media.MediaSymbol.replace(/\s/g, "")}`);
    }
  };

  const numToStr = (num, length) => {
    if (num === undefined) {
      return "-";
    }
    const str = num.toString();
    const zero = "0";
    const fillZeroCnt = length - str.length;
    const res = zero.repeat(fillZeroCnt) + str;
    return res;
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
      <ConfirmPayment
        open={openConfirmPaymentModal}
        handleClose={() => setOpenConfirmPaymentModal(false)}
        payWithOwnWallet={payWithOwnWallet}
        payWithCommunity={payWithCommunity}
      />
      <Box display="flex" flexDirection="row" className={classes.back} onClick={() => history.goBack()}>
        <img src={backIcon} alt="back" />
        <span>Back</span>
      </Box>
      <Box display="flex" flexDirection="row">
        <Box mr={6} mb={1} display="flex" flexDirection="column">
          <LoadingWrapper loading={isMediaLoading}>
            <>
              <Box display="flex" flexDirection="column" className={classes.headerImgBox}>
                <img className={classes.headerImg} src={getMediaImage(media)} alt="auction_img" />
              </Box>
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
                      src={require(openShareMenu
                        ? "assets/icons/share_filled.svg"
                        : "assets/icons/share.png")}
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
                              {!hideShareOnPrivi && (
                                <CustomMenuItem onClick={() => shareMediaToPrivi(media)}>
                                  <img
                                    src={require("assets/icons/spaceship.png")}
                                    alt={"spaceship"}
                                    style={{ width: 20, height: 20, marginRight: 5 }}
                                  />
                                  <b style={{ marginRight: 5 }}>{"Share & Earn"}</b> to Privi
                                </CustomMenuItem>
                              )}
                              <CustomMenuItem
                                onClick={() => shareMediaToSocial(media.id, "Media", media.Type)}
                              >
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
            </>
          </LoadingWrapper>
        </Box>
        <Box display="flex" flexDirection="column" style={{ width: "100%" }}>
          <LoadingWrapper loading={isMediaLoading}>
            <>
              <Box fontWeight={400} fontSize={40} color="#181818">
                {media.MediaName ?? "Media Name"}
              </Box>
              <Box display="flex" flexDirection="row" className={classes.ownerSection}>
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
                      @{owner.twitter !== "" ? owner.twitter : owner.name}
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
          <Box>
            <Box display="flex" flexDirection="row" marginTop="4px">
              <Box display="flex" flexDirection="column">
                <Box fontWeight={700} fontSize={14} color="#707582" marginTop="12px" marginBottom="12px">
                  Owners
                </Box>
                <LoadingWrapper loading={isOwnerLoading}>
                  <>
                    <Box display="flex" flexDirection="row" alignItems="center" marginBottom="20px">
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
                    <Box
                      padding={2}
                      display="flex"
                      flexDirection="column"
                      className={classes.auctionEndingIn}
                    >
                      <Box mb={1} fontWeight={400} fontSize={18} color="#FFFFFF">
                        ⏳ Auction Ending In
                      </Box>
                      <Grid container>
                        <Grid item xs={3}>
                          <Box fontWeight={400} fontSize={30} color="#FFFFFF">
                            {numToStr(timeRemaining.days, 2)}
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box fontWeight={400} fontSize={30} color="#FFFFFF">
                            {numToStr(timeRemaining.hours, 2)}
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box fontWeight={400} fontSize={30} color="#FFFFFF">
                            {numToStr(timeRemaining.minutes, 2)}
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box fontWeight={400} fontSize={30} color="#FFFFFF">
                            {numToStr(timeRemaining.seconds, 2)}
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid item xs={3}>
                          <Box mr={6} fontWeight={400} fontSize={18} color="#FFFFFF">
                            Days
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box mr={6} fontWeight={400} fontSize={18} color="#FFFFFF">
                            Hours
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box mr={6} fontWeight={400} fontSize={18} color="#FFFFFF">
                            Minutes
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box fontWeight={400} fontSize={18} color="#FFFFFF">
                            Seconds
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                </LoadingWrapper>
              </Box>
              <LoadingWrapper loading={isRateLoading || isTransactionLoading || isMediaLoading}>
                <>
                  <Box display="flex" flexDirection="column" ml={2}>
                    <Box className={classes.topBidBoxWrapper}>
                      {topBidder && (
                        <Box display="flex" flexDirection="column" className={classes.topBidBox}>
                          <Box fontWeight={700} fontSize={14} color="#FFFFFF" className={classes.noWrap}>
                            Top Bid Placed By
                          </Box>
                          <Box display="flex" flexDirection="row" marginTop={"12px"} alignItems="center">
                            <Avatar
                              src={topBidder.imageUrl}
                              alt={topBidder.name}
                              className={classes.bidderAvatar}
                            />
                            <Typography variant="caption" className={classes.topBidderName}>
                              {`@${topBidder.name}`}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                    <Box padding={1} display="flex" flexDirection="column">
                      <Box fontWeight={400} fontSize={18} color="#707582" className={classes.noWrap}>
                        🔥 Top bid
                      </Box>
                      <Box mt={2}>
                        <Box fontWeight={400} fontSize={30} color="#181818" className={classes.noWrap}>
                          {formatNumber(
                            media.Auctions && media.Auctions.Gathered ? media.Auctions.Gathered : 0,
                            media.Auctions && media.Auctions.TokenSymbol ? media.Auctions.TokenSymbol : "",
                            3
                          )}
                        </Box>
                      </Box>
                      <Box fontWeight={400} fontSize={18} color="#707582 className={classes.noWrap}">
                        {media.Auctions &&
                          media.Auctions.TokenSymbol &&
                          media.Auctions.Gathered !== 0 &&
                          `${formatNumber(
                            Math.floor(
                              (rateOfChange[media.Auctions.TokenSymbol] ?? 1) * media.Auctions.Gathered
                            ),
                            "$",
                            4
                          )}`}
                      </Box>
                      <Box fontWeight={400} fontSize={14} color="#707582" className={classes.noWrap}>
                        Reserve Price&nbsp;
                        <strong>
                          {" "}
                          {formatNumber(
                            media.Auctions && media.Auctions.ReservePrice ? media.Auctions.ReservePrice : 0,
                            media.Auctions && media.Auctions.TokenSymbol ? media.Auctions.TokenSymbol : "",
                            3
                          )}
                        </strong>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column" ml={2}>
                    <Box className={classes.displaceBidBoxWrapper}>
                      {displacedBidder && (
                        <Box display="flex" flexDirection="column" className={classes.displaceBidBox}>
                          <Box fontWeight={700} fontSize={14} color="#707582" className={classes.noWrap}>
                            Displaced Bidder
                          </Box>
                          <Box display="flex" flexDirection="row" marginTop={"12px"} alignItems="center">
                            <Avatar
                              src={displacedBidder.imageUrl}
                              alt={displacedBidder.name}
                              className={classes.bidderAvatar}
                            />
                            <Typography variant="caption" className={classes.secondBidderName}>
                              {`@${displacedBidder.name}`}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                    <Box display="flex" flexDirection="row">
                      <Box padding={1} display="flex" flexDirection="row">
                        <Box display="flex" flexDirection="column">
                          <Box fontWeight={400} fontSize={18} color="#707582" className={classes.noWrap}>
                            📈 Shares
                          </Box>
                          <Box mt={2} fontWeight={400} fontSize={30} color="#181818">
                            {media.NftConditions ? media.NftConditions.Royalty : "0"}%
                          </Box>
                          <Box fontWeight={400} fontSize={18} color="#707582">
                            Royalty
                          </Box>
                        </Box>
                        {!isNaN(media.SharingPct) && media.SharingPct > 0 && (
                          <Box ml={2} display="flex" flexDirection="column">
                            <Box mt={6} fontWeight={400} fontSize={30} color="#181818">
                              {media.SharingPct}%
                            </Box>
                            <Box fontWeight={400} fontSize={18} color="#707582">
                              Sharing Share
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </>
              </LoadingWrapper>
            </Box>
            <LoadingWrapper loading={isMediaLoading}>
              <Box mt={3} display="flex" flexDirection="row" alignItems="center">
                  {/* {user.address && media.CreatorAddress && user.address === media.CreatorAddress ?  */}
                  {false?
                  (
                  <>
                    <PrimaryButton
                      size="medium"
                      onClick={handleCancelAuction}
                      className={classes.stopAuctionButton}
                    >
                      Stop Auction
                    </PrimaryButton>
                    <Box ml={3} mr={1}>
                      <img
                        src={
                          media.Auctions && media.Auctions.TokenSymbol
                            ? require(`assets/tokenImages/${media.Auctions.TokenSymbol}.png`)
                            : "none"
                        }
                        alt={media.Auctions && media.Auctions.TokenSymbol ? media.Auctions.TokenSymbol : ""}
                        style={{ width: "20px" }}
                      />
                    </Box>
                    <Box fontWeight={700} fontSize={14} color="#99a1b3" style={{ width: "300px" }}>
                      Bidding token is{" "}
                      <b>{media.Auctions && media.Auctions.TokenSymbol ? media.Auctions.TokenSymbol : ""}</b>
                    </Box>
                  </>
                ) : (
                  <>
                    {isSignedIn() && (
                      <PrimaryButton
                        size="medium"
                        style={{ width: "300px" }}
                        onClick={() => setOpenPlaceBidModal(true)}
                      >
                        Place A Bid
                      </PrimaryButton>
                    )}
                    <SecondaryButton size="medium" style={{ width: "300px" }} onClick={handleWatchMedia}>
                      Watch Media
                    </SecondaryButton>
                    <PlaceBidModal
                      isOpen={openPlaceBidModal}
                      onClose={() => setOpenPlaceBidModal(false)}
                      placeBid={handlePlaceBid}
                      viewDetails={() => {
                        setOpenPlaceBidModal(false);
                        setOpenViewDetailsModal(true);
                      }}
                      media={media}
                    />
                    <PlaceBidDetailModal
                      isOpen={openViewDetailsModal}
                      onClose={() => setOpenViewDetailsModal(false)}
                      makeOffer={() => {
                        setOpenViewDetailsModal(false);
                        setOpenPlaceBidModal(true);
                      }}
                      media={media}
                    />
                  </>
                )}
                <Box ml={1} style={{ width: "100%", border: "1px solid #99a1b3" }}></Box>
              </Box>
            </LoadingWrapper>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row">
        <LoadingWrapper loading={isMediaLoading}>
          <Box display="flex" flexDirection="column" className={classes.accordionSection}>
            <Box>
              <Details owner={owner} user={user} media={media} />
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
          {user.address && media.CreatorAddress && user.address !== media.CreatorAddress && (
            <Box display="flex" flexDirection="row">
              <Box mr={1}>
                <img
                  src={
                    media.Auctions && media.Auctions.TokenSymbol
                      ? require(`assets/tokenImages/${media.Auctions.TokenSymbol}.png`)
                      : "none"
                  }
                  alt={media.Auctions && media.Auctions.TokenSymbol ? media.Auctions.TokenSymbol : ""}
                  style={{ width: "20px" }}
                />
              </Box>
              <Box fontWeight={700} fontSize={14} color="#99a1b3" style={{ width: "300px" }}>
                Bidding token is{" "}
                <b>{media.Auctions && media.Auctions.TokenSymbol ? media.Auctions.TokenSymbol : ""}</b>
              </Box>
            </Box>
          )}
          <Box mt={3} fontWeight={700} fontSize={18}>
            Bid History
          </Box>
          <Box>
            {PrintMarketplaceChart(bidHistoryChart, media.Auctions ? media.Auctions.TokenSymbol : "$")}
          </Box>
          <LoadingWrapper loading={isTransactionLoading}>
            <Box mt={3} style={{ borderBottom: "1px solid #707582" }}>
              <Table aria-label="customized table">
                <TableHead></TableHead>
                <TableBody>
                  {bidTransactions && bidTransactions.length > 0 ? (
                    bidTransactions.map(bidTxn => {
                      return (
                        <TableRow key={`row-${0}`} style={{ borderTop: "1px solid #707582" }}>
                          <StyledTableCell
                            align="left"
                            style={{
                              minWidth: 40,
                              width: 40,
                            }}
                          >
                            <Avatar
                              className={classes.ownerAvatarImg}
                              alt={bidTxn.name}
                              src={bidTxn.imageUrl}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Box display="flex" flexDirection="column">
                              <Box fontWeight={400} fontSize={14} color="#707582">
                                Bid placed by @{bidTxn.twitter}
                              </Box>
                              <Box fontWeight={400} fontSize={14}>
                                <b>{formatNumber(bidTxn.amount, bidTxn.token, 4)}</b>{" "}
                                {formatDate(bidTxn.date)}
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell size={"small"} align="right">
                            <a
                              className="bridge_text"
                              target="_blank"
                              rel="noopener noreferrer"
                              href={"https://priviscan.io/tx/" + bidTxn.id}
                            >
                              <img src={require("assets/icons/newScreen_black.svg")} alt="link" />
                            </a>
                          </StyledTableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow style={{ borderTop: "1px solid #707582" }}>
                      <StyledTableCell align="center">No Data</StyledTableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </LoadingWrapper>
        </Box>
      </Box>

      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
};
