import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Axios from "axios";

import { InputBase, makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { sellModalStyles } from "./index.styles";
import URL from "shared/functions/getURL";
import { Modal, PrimaryButton, SecondaryButton, HeaderBold4, TabNavigation } from "shared/ui-kit";
import { RootState } from "store/reducers/Reducer";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { TimeInput } from "shared/ui-kit/TimeInput";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Dropdown } from "shared/ui-kit/Select/Select";
import { BlockchainNets } from "shared/constants/constants";
import { useSubstrate } from "shared/connectors/substrate";
import { ContractInstance, decodeAbiData } from "shared/connectors/substrate/functions";
import POD_AUCTION_CONTRACT from "shared/connectors/substrate/contracts/PodAuction.json";
import ERC721_CONTRACT from "shared/connectors/substrate/contracts/ERC721.json";
import { POD_AUCTION_CONTRACT_ADDRESS, ERC721_CONTRACT_ADDRESS, ERC20_CONTRACT_ADDRESS } from "shared/connectors/substrate/config/test.json";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { buildJsxFromObject, handleSetStatus } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import Box from 'shared/ui-kit/Box';
import { getUserMedias, createAuction, createExchange } from "shared/services/API";

import { ReactComponent as AddIcon } from "assets/icons/plus-solid.svg";
const searchIcon = require("assets/icons/search.png");
const removeIcon = require("assets/icons/remove_red.png");

export const SellModal = (props: any) => {
  const classes = sellModalStyles();
  //store
  const user = useSelector((state: RootState) => state.user);

  //hooks
  const [tabSelection, setTabSelection] = useState<number>(0);
  const [userMedias, setUserMedias] = useState<any[]>([]);
  const [sale, setSale] = useState<any>({
    SelectedMedia: undefined,
    Price: 0,
    Token: "PRIVI",
    blockchainNet: BlockchainNets[0].value,
  });
  const [auction, setAuction] = useState<any>({
    SelectedMedia: undefined,
    ReservePrice: 0,
    Token: "PRIVI",
    StartDateTime: new Date().getTime(),
    EndDateTime: new Date().getTime(),
    TokensAllowed: [],
    blockchainNet: BlockchainNets[0].value,
  });
  const [tokensObjList, setTokensObjList] = useState<any[]>([]);

  const [status, setStatus] = useState<any>("");
  const [isUserMediaLoading, setIsUserMediaLoading] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const { api, keyring, keyringState } = useSubstrate();

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  useEffect(() => {
    if (props.open === true) {
      setIsDataLoading(true);
      Axios.get(`${URL()}/wallet/getCryptosRateAsList`)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            const data: any = resp.data;
            const newTokenList: any[] = [];
            data.forEach(rateObj => {
              newTokenList.push({ token: rateObj.token, name: rateObj.name });
            });

            const saleCopy = { ...sale };
            const auctionCopy = { ...auction };
            saleCopy.Token = newTokenList[0].token;
            auctionCopy.Token = newTokenList[0].token;
            setSale(saleCopy);
            setAuction(auctionCopy);

            setTokensObjList(newTokenList);
          }
          setIsDataLoading(false);
        })
        .catch(() => {
          setIsDataLoading(false);
        });

      getUserMedias(user.address)
        .then(resp => {
          if (resp && resp.success) {
            const media = [...resp.data] || [];

            if (media.length > 0) {
              media.forEach((m, index) => {
                if (m.HasPhoto) {
                  media[index].imageURL = `${URL()}/media/getMediaMainPhoto/${m.MediaSymbol.replace(
                    /\s/g,
                    ""
                  )}`;
                }
              });
            }
            setUserMedias(media.filter(item => !item.Auctions && !item.Exchange));
          }
          setIsUserMediaLoading(false);
        })
        .catch(() => {
          setIsUserMediaLoading(false);
        });
    } else {
      setSale({
        SelectedMedia: undefined,
        Price: 0,
        Token: "PRIVI",
        blockchainNet: BlockchainNets[0].value,
      });
      setAuction({
        SelectedMedia: undefined,
        ReservePrice: 0,
        Token: "PRIVI",
        StartDateTime: new Date().getTime(),
        EndDateTime: new Date().getTime(),
        TokensAllowed: [],
        blockchainNet: BlockchainNets[0].value,
      });
    }
  }, [props.open]);

  const validate = () => {
    if ((tabSelection === 0 && !sale.SelectedMedia) || (tabSelection === 1 && !auction.SelectedMedia)) {
      setStatus({
        msg: "Please select a media",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      (tabSelection === 0 && (!sale.Token || sale.Token === "")) ||
      (tabSelection === 1 && (!auction.Token || auction.Token === ""))
    ) {
      setStatus({
        msg: "Please select a Token for the price",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      (tabSelection === 0 && (!sale.Price || sale.Price <= 0)) ||
      (tabSelection === 1 && (!auction.ReservePrice || auction.ReservePrice <= 0))
    ) {
      setStatus({
        msg: "Invalid Price. Price should be higher than 0",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      tabSelection === 1 &&
      (!auction.StartDateTime ||
        new Date(auction.StartDateTime).getTime() < new Date().getTime() ||
        new Date(auction.StartDateTime).getTime() >= new Date(auction.EndDateTime).getTime())
    ) {
      setStatus({
        msg: "Invalid Start date. Start date should be later than now and before End date",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      tabSelection === 1 &&
      (!auction.EndDateTime || new Date(auction.EndDateTime).getTime() < new Date().getTime())
    ) {
      setStatus({
        msg: "Invalid End date. End date should be later than now and Start date",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  };

  const handlePlaceSellingOrder = async () => {
    if (validate()) {

      const payload = {
        Address: user.address,
        ExchangeToken: sale?.SelectedMedia?.MediaSymbol,
        InitialAmount: 1,
        OfferToken: sale.Token,
        Price: sale.Price.toString(),
      };

      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  };

  const handleStartAuction = async () => {
    if (validate()) {
      let endDate = new Date(auction.EndDateTime);
      let startDate = new Date(auction.StartDateTime);

      let startDateTimeInMs = startDate.getTime();
      let endDateTimeInMs = endDate.getTime();
      let mediaSymbol = auction.SelectedMedia.MediaSymbol;

      if (auction.blockchainNet === "Substrate Chain") {
        if (!api) return;
        const podAuctionContract = ContractInstance(api, JSON.stringify(POD_AUCTION_CONTRACT), POD_AUCTION_CONTRACT_ADDRESS);
        const erc721Contract = ContractInstance(api, JSON.stringify(ERC721_CONTRACT), ERC721_CONTRACT_ADDRESS);

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

        await (await erc721Contract).tx.mint({ value, gasLimit }, 'ANY').signAndSend(accountPair, async result => {
          if (result.status.isError) {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
          } else if (result.status.isFinalized) {
            await (await erc721Contract).tx.setApprovalForAll({ value, gasLimit }, POD_AUCTION_CONTRACT_ADDRESS, true).signAndSend(accountPair, async result => {
              if (result.status.isFinalized) {
                await (await podAuctionContract).tx.approveUser({ value, gasLimit }, accountPair.address).signAndSend(accountPair, async result => {
                  if (result.status.isFinalized) {
                    const input = {
                      media_address: ERC721_CONTRACT_ADDRESS,
                      media_token_id: 1,
                      token_address: ERC20_CONTRACT_ADDRESS,
                      owner: accountPair.address,
                      bid_increment: auction.ReservePrice.toString(),
                      start_time: Math.floor(startDateTimeInMs / 1000),
                      end_time: Math.floor(endDateTimeInMs / 1000),
                      reserve_price: 15,
                      ipfs_hash: ""
                    }

                    await (await podAuctionContract).tx.createAuction(
                      { value, gasLimit },
                      input
                    ).signAndSend(accountPair, result => {
                      if (result.status.isError) {
                        setStatus({
                          msg: "Error when making the request",
                          key: Math.random(),
                          variant: "error",
                        });
                      } else if (result.status.isFinalized) {
                        result.events
                          .filter(({ event }) => api?.events.system.ExtrinsicSuccess.is(event))
                          .forEach(({ event }) => {
                            const [dispatchInfo] = event.data;
                          })

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
                            }
                          );
                        if (events && events.length) {
                          setStatus({
                            msg: "Error when making the request",
                            key: Math.random(),
                            variant: "error",
                          });
                        } else {
                          const body = {
                            Data: {
                              MediaSymbol: mediaSymbol,
                              MediaType: auction.SelectedMedia.Type,
                              TokenSymbol: auction.Token,
                              Owner: accountPair.address,
                              BidIncrement: auction.ReservePrice.toString(),
                              StartTime: Math.floor(startDateTimeInMs / 1000),
                              EndTime: Math.floor(endDateTimeInMs / 1000),
                              IpfHash: "",
                              ReservePrice: 15,
                              chain: "substrate",
                              Address: user.address
                            },
                          };
                          // To be fixed: create separate function in BE for substrate
                          Axios.post(`${URL()}/auction/createAuction`, body)
                            .then(response => {
                              if (response.data.success) {
                                setStatus({
                                  msg: tabSelection === 0 ? "Selling Order created successfully" : "Auction created successfully",
                                  key: Math.random(),
                                  variant: "success",
                                });
                                setTimeout(() => {
                                  props.onClose();
                                }, 1000);
                              } else {
                                setStatus({
                                  msg: "Auction creation failed",
                                  key: Math.random(),
                                  variant: "error",
                                });
                              }
                            })
                            .catch(error => {
                              setStatus({
                                msg: "Exchange creation failed",
                                key: Math.random(),
                                variant: "error",
                              });
                            });
                        }

                      }
                    });
                  }
                })
              }
            })
          }
        });
      }
      // hlf
      else {
        const payload = {
          MediaSymbol: mediaSymbol,
          TokenSymbol: auction.Token,
          Owner: user.address,
          BidIncrement: "0",
          StartTime: Math.floor(startDateTimeInMs / 1000),
          EndTime: Math.floor(endDateTimeInMs / 1000),
          ReservePrice: auction.ReservePrice.toString(),
          IpfHash: "",
        };
        payloadRef.current = payload;
        setSignRequestModalDetail(buildJsxFromObject(payload));
        setOpenSignRequestModal(true);
      }
    }
  };

  const handleConfirmSign = async () => {
    const payload = payloadRef.current;
    if (Object.keys(payload).length) {
      if (tabSelection === 0) {
        createExchange(payload, { MediaType: sale.SelectedMedia.Type }).then(resp => {
          if (resp?.success) {
            handleSetStatus("Selling order created successfully", "success", setStatus);
            setTimeout(() => {
              props.onClose();
            }, 1000);
          }
          else handleSetStatus("Selling order failed", "error", setStatus);
        })
          .catch(error => {
            handleSetStatus("Exchange creation failed: " + error, "error", setStatus);
          });
      }
      else {
        createAuction(payload, { MediaType: auction.SelectedMedia.Type })
          .then(resp => {
            if (resp?.success) {
              handleSetStatus("Auction created successfully", "success", setStatus);
              setTimeout(() => {
                props.onClose();
              }, 1000);
            }
            else handleSetStatus("Auction creation failed", "error", setStatus);

          })
          .catch(error => {
            handleSetStatus("Auction creation failed: " + error, "error", setStatus);
          });
      }
    }
  };


  return (
    <Modal size="medium" isOpen={props.open} onClose={props.onClose} showCloseIcon className={classes.root}>
      <div className={classes.modalContent}>
        <HeaderBold4>Sell</HeaderBold4>
        <div className={classes.appbarContainer}>
          <TabNavigation
            tabs={["Set a Price", "Start Auction"]}
            currentTab={tabSelection}
            variant="primary"
            theme="cyan"
            onTabChange={setTabSelection}
          />
        </div>
        <LoadingWrapper loading={isDataLoading || isUserMediaLoading}>
          <>
            {tabSelection === 0 ? (
              <>
                <MediaAndPriceSelect
                  userMedias={userMedias}
                  element={sale}
                  setter={v => setSale(v)}
                  tokensList={tokensObjList}
                />
                <Box display="flex" width="100%" flexDirection="column" mt={3} mb={5}>
                  <Box fontSize={18} fontWeight={400} color="#000000">
                    Choose Blockchain Network
                  </Box>
                  <Dropdown
                    value={sale.blockchainNet}
                    menuList={BlockchainNets}
                    onChange={e => {
                      setSale({
                        ...sale,
                        blockchainNet: e.target.value,
                      });
                    }}
                    hasImage
                  />
                </Box>
              </>
            ) : (
              <>
                <MediaAndPriceSelect
                  userMedias={userMedias}
                  element={auction}
                  setter={v => setAuction(v)}
                  tokensList={tokensObjList}
                />
                <Box display="flex" width="100%" flexDirection="column" mt={3} mb={5}>
                  <Box fontSize={18} fontWeight={400} color="#000000">
                    Choose Blockchain Network
                  </Box>
                  <Dropdown
                    value={auction.blockchainNet}
                    menuList={BlockchainNets}
                    onChange={e => {
                      setAuction({
                        ...auction,
                        blockchainNet: e.target.value,
                      });
                    }}
                    hasImage
                  />
                </Box>
                <DateAndHourSelect element={auction} setter={v => setAuction(v)} label={"Start"} />
                <DateAndHourSelect element={auction} setter={v => setAuction(v)} label={"End"} />
              </>
            )}
          </>
        </LoadingWrapper>
        <div className={classes.buttons}>
          <SecondaryButton size="medium" onClick={props.onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            onClick={tabSelection === 0 ? handlePlaceSellingOrder : handleStartAuction}
          >
            {tabSelection === 0 ? "Place Selling Order" : "Start Auction"}
          </PrimaryButton>
        </div>
        <SignatureRequestModal
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleConfirmSign}
          handleClose={() => setOpenSignRequestModal(false)}
        />
        <div className={classes.alertMessageSection}>
          {status && (
            <AlertMessage
              key={status.key}
              message={status.msg}
              variant={status.variant}
              onClose={() => setStatus(undefined)}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

const useAutoCompleteStyles = makeStyles({
  root: {
    width: "100%",
  },
  listbox: {
    maxHeight: 168,
  },
  option: {
    height: 52,
  },
});

type MediaAndPriceSelectProps = {
  userMedias: any[];
  element: any;
  setter: (v) => void;
  tokensList: any[];
};

export const MediaAndPriceSelect: React.FunctionComponent<MediaAndPriceSelectProps> = ({
  userMedias,
  element,
  setter,
  tokensList,
}) => {
  const classes = sellModalStyles();
  const autocompleteStyle = useAutoCompleteStyles();

  const [searchName, setSearchName] = useState<string>("");
  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());
  const [requiredToken, setRequiredToken] = useState<string>("");

  useEffect(() => {
    if (tokensList && tokensList.length > 0) {
      setRequiredToken(tokensList[0].token);
    }
  }, [tokensList]);

  return (
    <div className={classes.mediaAndPriceSelect}>
      <div className={classes.inputContainer}>
        <Autocomplete
          clearOnBlur
          id="autocomplete-share-media"
          freeSolo
          classes={autocompleteStyle}
          key={autocompleteKey}
          onChange={(event: any, newValue: any | null) => {
            if (newValue) {
              const elementCopy = { ...element };
              elementCopy.SelectedMedia = newValue;
              setter(elementCopy);
              // reset search query
              setAutocompleteKey(new Date().getTime());
            }
          }}
          options={userMedias}
          renderOption={(option, { selected }) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                borderBottom: "1px solid #eff2f8",
                margin: 0,
                width: "100%",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    backgroundImage: option.imageURL ? `url(${option.imageURL})` : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "6px",
                    width: "40px",
                    height: "40px",
                    marginRight: "21px",
                    background: "#c4c4c4",
                  }}
                />
                <div
                  style={{
                    fontStyle: "normal",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "#181818",
                    fontFamily: "Agrandir",
                  }}
                >
                  {option.MediaName ?? option.name ?? option.MediaSymbol}
                </div>
              </div>
              <AddIcon style={{ color: '#431AB7', width: "16px" }} />
            </div>
          )}
          getOptionLabel={option => option.MediaName}
          getOptionSelected={option => option.MediaSymbol === element.SelectedMedia.MediaSymbol}
          renderInput={params => (
            <InputBase
              value={searchName}
              onChange={event => {
                setSearchName(event.target.value);
              }}
              ref={params.InputProps.ref}
              inputProps={params.inputProps}
              style={{ width: "100%" }}
              autoFocus
              placeholder="Search Media by Title or Address"
            />
          )}
        />
        <img src={searchIcon} alt={"search"} />
      </div>

      {element && element.SelectedMedia && (
        <MediaDisplay selectedMedia={element.SelectedMedia} element={element} setter={setter} />
      )}

      <div style={{ color: "black", fontSize: 18, fontWeight: 400, marginTop: 30 }}>
        {element.Price !== undefined ? "Price" : "Starting Price"}
      </div>
      <div className={classes.row}>
        <InputWithLabelAndTooltip
          inputValue={element.Price || element.ReservePrice}
          placeHolder="0"
          onInputValueChange={e => {
            const elementCopy = { ...element };
            if (elementCopy.Price !== undefined) {
              elementCopy.Price = e.target.value;
            } else if (elementCopy.ReservePrice !== undefined) {
              elementCopy.ReservePrice = e.target.value;
            }
            setter(elementCopy);
          }}
          type="number"
          minValue="0"
          style={{ marginBottom: 0 }}
        />
        <div className={classes.selectorWithToken} style={{ border: "unset", height: "unset" }}>
          <TokenSelect
            tokens={tokensList}
            value={element.Token}
            onChange={e => {
              const elementCopy = { ...element };
              elementCopy.Token = e.target.value;
              setter(elementCopy);
            }}
          />
        </div>
      </div>
    </div>
  );
};

const MediaDisplay = ({ selectedMedia, element, setter }) => {
  const classes = sellModalStyles();

  return (
    <div className={classes.mediaDisplay}>
      <div className={classes.leftSection}>
        <div
          className={classes.avatarSection}
          style={{
            backgroundImage: selectedMedia.imageURL ? `url(${selectedMedia.imageURL})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {selectedMedia.MediaName ?? selectedMedia.name ?? selectedMedia.MediaSymbol}
      </div>
      <span
        onClick={() => {
          if (element) {
            const elementCopy = { ...element };
            elementCopy.SelectedMedia = null;
            setter(elementCopy);
          }
        }}
      >
        <img src={removeIcon} alt={"remove"} />
      </span>
    </div>
  );
};

type DateAndHourSelectProps = {
  element: any;
  setter: (v) => void;
  label: string;
};

const DateAndHourSelect: React.FunctionComponent<DateAndHourSelectProps> = ({ element, setter, label }) => {
  const classes = sellModalStyles();

  const handleDateTime = (date: Date | null) => {
    const elementCopy = { ...element };
    if (label === "Start") {
      elementCopy.StartDateTime = date?.getTime();
    } else {
      elementCopy.EndDateTime = date?.getTime();
    }
    setter(elementCopy);
  };

  return (
    <div className={classes.dateHourSelect}>
      <div className="col">
        <label>{label} Time</label>
        <DateInput
          minDate={new Date()}
          format="MM.dd.yyyy"
          placeholder="Select date..."
          value={label === "Start" ? element.StartDateTime : element.EndDateTime}
          onChange={(date: Date | null) => handleDateTime(date)}
          height={40}
        />
      </div>

      <div className="col">
        <label>{label} Hour</label>
        <TimeInput
          minDate={new Date()}
          format="HH:mm"
          placeholder="Select time..."
          value={label === "Start" ? element.StartDateTime : element.EndDateTime}
          onChange={(date: Date | null) => handleDateTime(date)}
          height={40}
        />
      </div>
    </div>
  );
};
