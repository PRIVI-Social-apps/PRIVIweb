import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Divider, Grid, makeStyles, createStyles, Theme } from "@material-ui/core";

import MainPageContext from "components/legacy/Media/context";
import { PlaceBidModal } from "components/legacy/Media/modals/PlaceBidModal/index";
import { ChooseWalletModal } from "shared/ui-kit/Modal/Modals/ChooseWalletModal";
import { PlaceBidDetailModal } from "components/legacy/Media/modals/PlaceBidDetailModal/index";
import AuctionDetailModal from "../../modals/AuctionDetailModal";
import {
  EthMediaCurrentPrice,
  EthMediaDetails,
  FinalStepModal,
  LikeShareInformation,
  MediaActionButtons,
  MediaAuctionstatus,
  MediaCollection,
  MediaComments,
  MediaContentWrapper,
  MediaDetails,
  MediaDisplayHeader,
  RateMedia,
  WalletSignatureRequestModal,
  MediaNFTPrice,
  EthMediaActionButtons,
} from "./elements";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { Accordion, AccordionSummary, AccordionDetails } from "shared/ui-kit";
import { parsePrice } from "shared/helpers/utils";
import { sumTotalViews } from "shared/functions/totalViews";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { buildJsxFromObject, handleSetStatus } from "shared/functions/commonFunctions";
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
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { cancelAuction, withdrawAuction, placeBid } from "shared/services/API";
import ConfirmPayment from "components/legacy/Communities/modals/ConfirmPayment";
import styles from "./elements.module.scss";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  })
);

export const MediaCurrentPrice = ({ playing, vipAccess }) => {
  const user = useTypedSelector(state => state.user);
  const [seconds, setSeconds] = useState<number>(0);
  const { selectedMedia } = useContext(MainPageContext);

  React.useEffect(() => {
    let interval = null as any;
    if (playing) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!playing && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [playing, seconds]);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary>💰 Price</AccordionSummary>
      <AccordionDetails>
        <div className={styles.priceWrapper}>
          {selectedMedia.CreatorId !== user.id ? (
            <>
              <div className={styles.assetPrice}>
                {selectedMedia.QuickCreation && selectedMedia.ViewConditions ? (
                  <div>
                    {selectedMedia.ViewConditions &&
                      selectedMedia.ViewConditions.ViewingType === "DYNAMIC" ? (
                      <>
                        {selectedMedia?.ViewConditions.ViewingToken || ""}{" "}
                        {selectedMedia?.ViewConditions?.Price ?? "0"}
                        <span style={{ fontSize: "22px" }}>/sec</span>
                      </>
                    ) : (
                      `${selectedMedia?.ViewConditions.ViewingToken || ""} ${selectedMedia?.ViewConditions?.Price
                        ? parsePrice(selectedMedia?.ViewConditions?.Price.toString())
                        : "0"
                      } `
                    )}
                  </div>
                ) : null}

                {!selectedMedia.QuickCreation
                  ? `${selectedMedia?.FundingToken || ""} ${selectedMedia?.Price ?? "0"}/PricePerSecond`
                  : null}
              </div>
              {vipAccess ? (
                <SpentPrice
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span>VIP ACCESS</span>
                </SpentPrice>
              ) : (
                <>
                  {(selectedMedia.QuickCreation &&
                    selectedMedia.ViewConditions &&
                    selectedMedia.ViewConditions.ViewingType === "DYNAMIC") ||
                    selectedMedia.PaymentType === "DYNAMIC" ? (
                    <SpentPrice>
                      <span>Spent</span>
                      <span>{`${seconds} sec. = ${selectedMedia.QuickCreation
                          ? selectedMedia?.ViewConditions.ViewingToken
                          : selectedMedia?.FundingToken ?? "ETH"
                        } ${seconds > 0
                          ? (
                            seconds *
                            (selectedMedia.QuickCreation &&
                              selectedMedia.ViewConditions.ViewingType === "DYNAMIC"
                              ? selectedMedia?.ViewConditions?.Price
                              : selectedMedia.PricePerSecond)
                          ).toFixed(5)
                          : 0
                        }`}</span>
                    </SpentPrice>
                  ) : null}
                </>
              )}
            </>
          ) : (
            <div className={styles.assetPrice}>Free</div>
          )}
          <Divider />
          <LikeShareInformation />
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export const TypicalLayout = props => {
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);
  const { selectedMedia, setSelectedMedia } = useContext(MainPageContext);

  const [openPlaceBidModal, setOpenPlaceBidModal] = useState(false);
  const [openChooseWalletModal, setOpenChooseWalletModal] = useState(false);
  const [openFinalStepModal, setOpenFinalStepModal] = useState(false);
  const [openWalletSignatureRequestModal, setOpenWalletSignatureRequestModal] = useState(false);
  const [openPlaceBidDetailModal, setOpenPlaceBidDetailModal] = useState(false);
  const [openAuctionDetailModal, setOpenAuctionDetailModal] = useState(false);
  const [status, setStatus] = useState<any>("");
  const { api, apiState, keyring, keyringState } = useSubstrate();
  const payloadRef = React.useRef<any>({});
  const functionRef = React.useRef<string>("");
  const priceRef = React.useRef<number>(0);
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);
  const [openConfirmPaymentModal, setOpenConfirmPaymentModal] = useState<boolean>(false);
  const classes = useStyles();

  React.useEffect(() => {
    sumTotalViews(selectedMedia);
  }, []);

  const payWithOwnWallet = async () => {
    setOpenConfirmPaymentModal(false);
    const price = priceRef.current;
    const token = selectedMedia.Auctions.TokenSymbol;
    if (selectedMedia.BlockchainNetwork === "Substrate Chain") {
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
        owner: selectedMedia.Auctions.Owner,
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
              const body: any = {
                Data: {
                  MediaSymbol: selectedMedia.MediaSymbol,
                  MediaType: selectedMedia.Type,
                  TokenSymbol: token,
                  Owner: selectedMedia.Auctions.Owner,
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
                    setTimeout(() => {
                      setOpenPlaceBidModal(false);
                    }, 1000);
                    handleSetStatus("Bid completed", "success", setStatus);
                    axios
                      .get(`${URL()}/media/getMedia/${selectedMedia.id}/privi`, {
                        params: { mediaType: selectedMedia.Type },
                      })
                      .then(res => {
                        if (res.data.success) {
                          const data = res.data.data;
                          const newSelectedMedia = {
                            ...selectedMedia,
                            Auctions: {
                              ...data.Auctions,
                              Gathered: price,
                            },
                            BidHistory: [...data.BidHistory],
                          };
                          setSelectedMedia(newSelectedMedia);
                          setTimeout(() => {
                            setOpenPlaceBidModal(false);
                          }, 1000);
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });
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
    } else handleOpenSignatureModal("placeBid", price);
  };

  const handlePlaceBid = async (price: number, topBidPrice: number | "N/A") => {
    if (!selectedMedia.Auctions) {
      handleSetStatus("Failed to Place a Bid", "error", setStatus);
      return;
    }
    const token = selectedMedia.Auctions.TokenSymbol;
    const lowestBid = Math.max(
      selectedMedia?.Auctions?.Gathered ?? 0 + selectedMedia?.Auctions?.BidIncrement ?? 0,
      selectedMedia?.Auctions?.ReservePrice ?? 0
    );
    if (!userBalances[token] || userBalances[token].Balance < price) {
      handleSetStatus(`Insufficient ${token} balance`, "error", setStatus);
      return;
    } else if (price <= lowestBid) {
      handleSetStatus(`Bid have to be greater than ${lowestBid} ${token}`, "error", setStatus);
      return;
    }

    priceRef.current = price;
    setOpenConfirmPaymentModal(true);
  };

  const handleOpenSignatureModal = (operation, price?) => {
    let payload;
    if (operation == "cancelAuction") {
      payload = {
        MediaSymbol: selectedMedia?.Auctions?.MediaSymbol,
        TokenSymbol: selectedMedia?.Auctions?.TokenSymbol,
        Owner: selectedMedia?.Auctions?.Owner,
      };
    } else if (operation == "placeBid") {
      payload = {
        MediaSymbol: selectedMedia?.Auctions?.MediaSymbol,
        TokenSymbol: selectedMedia?.Auctions?.TokenSymbol,
        Owner: selectedMedia?.Auctions?.Owner,
        Address: user.address,
        Amount: price.toString(),
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
        cancelAuction(payload, { MediaType: selectedMedia.Type })
          .then(resp => {
            if (resp.success) {
              handleSetStatus("Auction cancelled successfully", "success", setStatus);
            } else handleSetStatus("Auction cancelation failed", "error", setStatus);
          })
          .catch(error => {
            handleSetStatus("Auction creation failed: " + error, "error", setStatus);
          });
      } else if (functionRef.current == "placeBid") {
        placeBid(payload, { MediaType: selectedMedia.Type })
          .then(resp => {
            if (resp.success) {
              handleSetStatus("Bid placed successfully", "success", setStatus);
              setTimeout(() => {
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

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  useEffect(() => {
    console.log(
      (selectedMedia.QuickCreation && selectedMedia.ViewConditions) || !selectedMedia.QuickCreation
    );
  }, []);

  return (
    <MediaContentWrapper>
      <MediaDisplayHeader type={props.type || ""} />
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} md={8} direction="column">
          {props.child ?? props}
          <RateMedia />
          <MediaComments />
        </Grid>

        <Grid item xs={12} md={4}>
          <Divider />
          {selectedMedia &&
            selectedMedia.price &&
            selectedMedia.price !== 0 &&
            selectedMedia.price !== "" &&
            selectedMedia.price !== "0" &&
            selectedMedia.price !== "Not available" &&
            selectedMedia.price !== "Not Available" &&
            ((selectedMedia.QuickCreation && selectedMedia.ViewConditions) || !selectedMedia.QuickCreation) ? (
            <>
              {!selectedMedia.eth ? (
                <MediaCurrentPrice playing={props.playing} vipAccess={props.vipAccess} />
              ) : (
                <EthMediaCurrentPrice />
              )}
            </>
          ) : (
            <></>
          )}

          {!selectedMedia.eth ? <MediaDetails /> : <EthMediaDetails />}
          {selectedMedia.collection && selectedMedia.collection.length > 0 ? <MediaCollection /> : null}
          {!selectedMedia.eth &&
            selectedMedia.NftConditions &&
            selectedMedia.NftConditions?.Price &&
            !selectedMedia.Auctions &&
            selectedMedia.Exchange && <MediaNFTPrice />}
          {selectedMedia.Auctions && !selectedMedia.eth && <MediaAuctionstatus />}
          <Divider />
          {!selectedMedia.eth ? (
            <MediaActionButtons
              showMoreDetailsButton={!!selectedMedia.Auctions}
              onMoreDetails={() => {
                if (selectedMedia.Auctions) {
                  if (selectedMedia.Auctions.Owner === user.address) {
                    setOpenAuctionDetailModal(true);
                  } else {
                    setOpenPlaceBidDetailModal(true);
                  }
                } else {
                  //TODO: display details modal for media
                }
              }}
              onPlaceBid={() => {
                setOpenPlaceBidModal(true);
              }}
              onBuyNFT={() => { }}
            />
          ) : (
            <EthMediaActionButtons
              onMoreDetails={() => {
                if (selectedMedia.Auctions) {
                  setOpenPlaceBidDetailModal(true);
                } else {
                  //TODO: display details modal for media
                }
              }}
              onPlaceBid={() => {
                setOpenPlaceBidModal(true);
              }}
            />
          )}
          {selectedMedia.Auctions && (
            <PlaceBidModal
              isOpen={openPlaceBidModal}
              onClose={() => {
                setOpenPlaceBidModal(false);
              }}
              placeBid={handlePlaceBid}
              viewDetails={() => {
                setOpenPlaceBidModal(false);
                setOpenPlaceBidDetailModal(true);
              }}
            />
          )}
          <ChooseWalletModal
            isOpen={openChooseWalletModal}
            onClose={() => {
              setOpenChooseWalletModal(false);
            }}
            onAccept={() => {
              setOpenChooseWalletModal(false);
              setOpenFinalStepModal(true);
              setTimeout(() => {
                setOpenFinalStepModal(false);
                setOpenWalletSignatureRequestModal(true);
              }, 2000);
            }}
          />
          <FinalStepModal
            isOpen={openFinalStepModal}
            onClose={() => {
              setOpenFinalStepModal(false);
            }}
          />
          <WalletSignatureRequestModal
            isOpen={openWalletSignatureRequestModal}
            onClose={() => {
              setOpenWalletSignatureRequestModal(false);
            }}
          />
          <PlaceBidDetailModal
            isOpen={openPlaceBidDetailModal}
            onClose={() => {
              setOpenPlaceBidDetailModal(false);
            }}
            makeOffer={() => {
              setOpenPlaceBidDetailModal(false);
              setOpenPlaceBidModal(true);
            }}
          />
        </Grid>
      </Grid>
      {isSignedIn() && (
        <AuctionDetailModal
          open={openAuctionDetailModal}
          handleClose={() => {
            setOpenAuctionDetailModal(false);
          }}
        />
      )}
      {isSignedIn() && (
        <SignatureRequestModal
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleConfirmSign}
          handleClose={() => setOpenSignRequestModal(false)}
        />
      )}
      {isSignedIn() && (
        <ConfirmPayment
          open={openConfirmPaymentModal}
          handleClose={() => setOpenConfirmPaymentModal(false)}
          payWithOwnWallet={payWithOwnWallet}
          payWithCommunity={() => {}}
        />
      )}
      <div className={classes.root}>
        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </MediaContentWrapper>
  );
};

export const SpentPrice = styled.div`
  width: 100%;
  min-height: 90px;
  padding: 14px;
  margin: 16px 0;
  background: linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%);
  border-radius: 10px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > span:first-child {
    font-weight: normal;
    font-size: 18px;
  }

  & > span:last-child {
    font-weight: bold;
    font-size: 30px;
  }
`;
