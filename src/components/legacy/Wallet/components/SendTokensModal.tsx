import React, { useState, useEffect } from "react";
import cls from "classnames";
import axios from "axios";

import { Autocomplete } from "@material-ui/lab";
import { InputBase, Box } from "@material-ui/core";

import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import {
  StyledMenuItem,
  StyledModalSelect,
  StyledTextField2,
} from "shared/ui-kit/Styled-components/StyledComponents";
import { signTransaction } from "shared/functions/signTransaction";
import * as API from "shared/services/API";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { Dropdown } from "shared/ui-kit/Select/Select";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { BasicModal } from "shared/ui-kit/Modal/Modals";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { BlockchainNets } from "shared/constants/constants";

import { sendTokensModal } from "./SendTokensModal.styles";

import tadaIcon from "assets/icons/tada.svg";
import { PrimaryButton, Modal } from "shared/ui-kit";
import { useSubstrate } from "shared/connectors/substrate";
import { ContractInstance } from "shared/connectors/substrate/functions";
import ERC20_META from "shared/connectors/substrate/contracts/ERC20_META.json";
import substrateTokens from "shared/connectors/substrate/tokens";
import { IAPIRequestProps } from "shared/services/API/interfaces";
import { getPriviWallet } from "shared/helpers";
import { signPayload } from "shared/services/WalletSign";

const tokenTypeOptions = ["CRYPTO", "FTPOD", "NFTPOD", "SOCIAL"];
const tokenTypeMap = {
  SOCIAL: "Social 📸",
  CRYPTO: "Crypto 💵",
  FTPOD: "FT Pods 👘",
  NFTPOD: "NFT Pods 🏆",
};

type PAYMENT_TYPE = "Instant" | "Streaming";
const PAYMENT_OPTIONS: Array<{ label: string; value: PAYMENT_TYPE }> = [
  { label: "Instant", value: "Instant" },
  { label: "Streaming", value: "Streaming" },
];

const minStartDate = Date.now();

function formatDate(date: Date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth() + 1).toString();
  var dd = date.getDate().toString();
  return `${yyyy}/${mm}/${dd}`;
}

function formatTime(date: Date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
}

function getTimestampFromString(date: string, time: string) {
  var dateParts: string[] = date.split("/");
  const timestamp = Date.parse(`${dateParts[0]}/${dateParts[1]}/${dateParts[2]} ${time}`);
  return isNaN(timestamp) ? 0 : timestamp;
}

const SendTokensModal = (props: any) => {
  const classes = sendTokensModal();

  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);
  const users = useTypedSelector(state => state.usersInfoList);

  const [paymentType, setPaymentType] = useState<PAYMENT_TYPE>("Instant");

  const [tokenType, setTokenType] = useState<string>(props.defaultTokenType || tokenTypeOptions[0]);
  const [tokenName, setTokenName] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [maxQuantity, setMaxQuantity] = useState<number>(0);

  const [frequency, setFrequency] = useState<string>("1");
  const [startingTime, setStartingTime] = useState<number>(Date.now());
  const [endingTime, setEndingTime] = useState<number>(Date.now());

  const [startingDateString, setStartingDateString] = useState<string>(formatDate(new Date()));
  const [startingTimeString, setStartingTimeString] = useState<string>(formatTime(new Date()));
  const [endingDateString, setEndingDateString] = useState<string>(formatDate(new Date()));
  const [endingTimeString, setEndingTimeString] = useState<string>(formatTime(new Date()));

  const [recipient, setRecipient] = useState<string>("");

  const [status, setStatus] = useState<any>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [uidToAddressMap, setUidToAddressMap] = useState<any>({});
  const [tokenList, setTokenList] = useState<any[]>([]); // token list used for dropdown list
  const [substrateTokenList, setSubstrateTokenList] = useState<any[]>(props.substrateTokenList);
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [openSignSuccessAlertModal, setOpenSignSuccessAlertModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);
  const [blockchainNet, setBlockchainNet] = useState<any>(BlockchainNets[0].value);

  const { api, apiState, keyring, keyringState } = useSubstrate();

  // get emailToUid map from backend
  useEffect(() => {
    axios.get(`${URL()}/wallet/getUidToAddressMap`).then(res => {
      const resp = res.data;
      if (resp.success) {
        setUidToAddressMap(resp.data);
      }
    });
  }, []);

  useEffect(() => {
    if (tokenName) {
      if (blockchainNet === BlockchainNets[0].value && userBalances[tokenName]) {
        setMaxQuantity(userBalances[tokenName].Balance);
      } else if (blockchainNet === BlockchainNets[1].value) {
        substrateTokenList.forEach(token => {
          if (token.Token === tokenName) {
            setMaxQuantity(token.Balance);
          }
        });
      }
    } else setMaxQuantity(0);
  }, [tokenName, userBalances]);

  // set correct tokenList (dropdown) and maxAmount whenever tokenType changes
  useEffect(() => {
    if (props.open) {
      const newTokenList: any[] = [];
      Object.entries(userBalances).forEach((token: any) => {
        if (token[1].Type === tokenType) {
          token[1].token = token[1].Token;
          newTokenList.push(token[1]);
        }
      });
      setTokenList(newTokenList);
    }
  }, [tokenType, props.open]);

  // set correct tokenName when token list changed
  useEffect(() => {
    if (tokenList.length > 0) {
      let includesToken = false;
      tokenList.forEach(token => {
        if (token.Token === tokenName) {
          includesToken = true;
        }
      });
      if (!includesToken) setTokenName(tokenList[0].Token);
    } else {
      setTokenName("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenList]);
  useEffect(() => {
    if (blockchainNet === BlockchainNets[0].value) {
      setTokenName(tokenList.length > 0 ? tokenList[0].Token : "");
    } else if (blockchainNet === BlockchainNets[1].value) {
      console.log(props.substrateTokenList);
      setSubstrateTokenList(props.substrateTokenList);
      setTokenName(props.substrateTokenList.length > 0 ? props.substrateTokenList[0].Token : "");
    }
  }, [blockchainNet]);

  const clearInputs = () => {
    setQuantity("");
    setFrequency("");
    setPaymentType("Instant");
    setStatus(undefined);
  };

  const handleClickSend = () => {
    if (blockchainNet === BlockchainNets[0].value && validate()) {
      let to = recipient;
      if (uidToAddressMap[recipient]) to = uidToAddressMap[recipient];
      const detailNode = (
        <p style={{ fontSize: "14px", marginTop: "0px" }}>
          Token: {tokenName} <br />
          From: {user.address} <br />
          To: {to} <br />
          Amount: {quantity} <br />
          Type: transfer <br />
        </p>
      );
      setSignRequestModalDetail(detailNode);
      setOpenSignRequestModal(true);
    } else if (blockchainNet === BlockchainNets[1].value) {
      const fromUser = users.find(u => {
        return u.id === user.id && u.wallets.find(wallet => wallet.name.toUpperCase() === "POLKADOT");
      });
      const fromAddress = fromUser
        ? fromUser.wallets.find(wallet => wallet.name.toUpperCase() === "POLKADOT").address
        : "";

      const toUser = users.find(u => {
        return u.id === recipient && u.wallets.find(wallet => wallet.name.toUpperCase() === "POLKADOT");
      });
      const toAddress = toUser
        ? toUser.wallets.find(wallet => wallet.name.toUpperCase() === "POLKADOT").address
        : "";
      const detailNode = (
        <p style={{ fontSize: "14px", marginTop: "0px" }}>
          Token: {tokenName} <br />
          From: {fromAddress} <br />
          To: {toAddress} <br />
          Amount: {quantity} <br />
          Type: transfer <br />
        </p>
      );
      setSignRequestModalDetail(detailNode);
      setOpenSignRequestModal(true);
    }
  };

  function validate() {
    if (!tokenName) {
      setStatus({
        msg: "a token should be selected",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (quantity === null || !quantity) {
      setStatus({
        msg: "invalid quantity",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (Number(quantity) === 0) {
      setStatus({
        msg: "quantity cant be 0",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (Number(quantity) < 0) {
      setStatus({
        msg: "quantity cant be negative",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (Number(quantity) > Number(maxQuantity)) {
      setStatus({
        msg: "quantity cant surpass max quantity available",
        key: Math.random(),
        variant: "error",
      });
      return false;
    }
    if (!recipient) {
      setStatus({
        msg: "recipient empty",
        key: Math.random(),
        variant: "error",
      });
      return false;
    }
    // check if recipient exists (a valid email or uid)
    if (!recipient.startsWith("0x") && !uidToAddressMap[recipient]) {
      setStatus({
        msg: "recipient is not a valid id nor address",
        key: Math.random(),
        variant: "error",
      });
      return false;
    }
    if (paymentType === "Streaming") {
      if (startingTime === 0) {
        setStatus({
          msg: "starting time format error",
          key: Math.random(),
          variant: "error",
        });
        return false;
      }
      if (endingTime === 0) {
        setStatus({
          msg: "ending time format error",
          key: Math.random(),
          variant: "error",
        });
        return false;
      }
      if (startingTime < minStartDate) {
        setStatus({
          msg: "starting time can't earlier than current time",
          key: Math.random(),
          variant: "error",
        });
        return false;
      }
      if (startingTime > endingTime) {
        setStatus({
          msg: "starting time can't be superior to ending time",
          key: Math.random(),
          variant: "error",
        });
        return false;
      }
      if (!Number(frequency) || Number(frequency) <= 0) {
        setStatus({
          msg: "frequency cant be 0 or negative",
          key: Math.random(),
          variant: "error",
        });
        return false;
      }
    }
    return true;
  }

  const handleConfirmSign = async () => {
    setLoading(true);
    try {
      if (blockchainNet === BlockchainNets[0].value) {
        let to = recipient;
        if (uidToAddressMap[recipient]) to = uidToAddressMap[recipient];
        const { address } = await getPriviWallet();
        if (paymentType == "Instant") {
          const payload: API.ITransfer = {
            Token: tokenName,
            From: address,
            To: to,
            Amount: quantity,
            Type: "transfer",
          };
          await API.transfer(payload, {});
          setLoading(false);
          setStatus({
            msg: "Tokens send successfully!",
            key: Math.random(),
            variant: "success",
          });
          setOpenSignSuccessAlertModal(true);
          setTimeout(() => {
            props.handleRefresh();
            props.handleClose();
            clearInputs();
          }, 500);
        } else {
          const startTimeInSec = Math.floor(startingTime / 1000);
          const endTimeInSec = Math.floor(endingTime / 1000);
          const totalQuantity = Number(quantity);
          const amountPerPeriod = (Number(frequency) * totalQuantity) / (endTimeInSec - startTimeInSec);
          const body: any = {
            SenderAddress: user.address,
            ReceiverAddress: to,
            Frequency: Number(frequency),
            AmountPerPeriod: amountPerPeriod,
            StreamingToken: tokenName,
            StartingDate: startTimeInSec,
            EndingDate: endTimeInSec,
          };
          const [hash, signature] = await signTransaction(user.mnemonic, body);
          body.UserId = user.id;
          body.Hash = hash;
          body.Signature = signature;
          axios
            .post(`${URL()}/wallet/createStreaming`, body)
            .then(res => {
              const resp = res.data;
              setLoading(false);
              if (resp.success) {
                setStatus({
                  msg: "Tokens send successfully!",
                  key: Math.random(),
                  variant: "success",
                });
                setTimeout(() => {
                  props.handleRefresh();
                  props.handleClose();
                  clearInputs();
                }, 500);
              } else {
                setStatus({
                  msg: "transfer failed",
                  key: Math.random(),
                  variant: "error",
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      } else if (blockchainNet === BlockchainNets[1].value) {
        const fromUser = users.find(u => {
          return u.id === user.id && u.wallets.find(wallet => wallet.name.toUpperCase() === "POLKADOT");
        });
        const fromAddress = fromUser
          ? fromUser.wallets.find(wallet => wallet.name.toUpperCase() === "POLKADOT").address
          : "";

        const toUser = users.find(u => {
          return u.id === recipient && u.wallets.find(wallet => wallet.name.toUpperCase() === "POLKADOT");
        });
        const toAddress = toUser
          ? toUser.wallets.find(wallet => wallet.name.toUpperCase() === "POLKADOT").address
          : "";

        const token = substrateTokens.find(token => tokenName === token.name);
        const contract = ContractInstance(api as any, JSON.stringify(ERC20_META), (token as any).address);

        const value = 0;
        const gasLimit = 30000 * 10000000;

        const keyringOptions = (keyring as any).getPairs().map(account => ({
          key: account.address,
          value: account.address,
          text: account.meta.name ? account.meta.name.toUpperCase() : "",
          icon: "user",
        }));

        const accountAddress = keyringOptions.length > 0 ? keyringOptions[0].value : "";

        const accountPair =
          accountAddress && keyringState === "READY" && (keyring as any).getPair(accountAddress);

        setLoading(false);

        await (await contract).tx
          .transfer({ value, gasLimit }, toAddress, quantity)
          .signAndSend(accountPair, async result => {
            setStatus({
              msg: "Tokens send successfully!",
              key: Math.random(),
              variant: "success",
            });
            setOpenSignSuccessAlertModal(true);
            setTimeout(() => {
              props.handleRefresh();
              props.handleClose();
              clearInputs();
            }, 500);
          });
      }
    } catch (e) {
      setStatus({
        msg: e.message,
        key: Math.random(),
        variant: "error",
      });
      setLoading(false);
    }
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      className={classes.root}
      showCloseIcon
    >
      <div>
        <SignatureRequestModal
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleConfirmSign}
          handleClose={() => setOpenSignRequestModal(false)}
        />
        <BasicModal
          icon={tadaIcon}
          title="All right!"
          subtitle="The signature process was completed <br /> successfully."
          open={openSignSuccessAlertModal}
          handleClose={() => setOpenSignSuccessAlertModal(false)}
        />
        <div className={classes.modalContent}>
          <div className={classes.heading}>
            <span>Send Tokens</span>
            <StyledModalSelect
              value={paymentType}
              onChange={v => {
                setPaymentType(v.target.value as PAYMENT_TYPE);
              }}
            >
              {PAYMENT_OPTIONS.map(option => {
                return (
                  <StyledMenuItem value={option.value} key={option.value}>
                    {option.label}
                  </StyledMenuItem>
                );
              })}
            </StyledModalSelect>
          </div>
          <div className={classes.content}>
            <h4>
              <label>SELECT TOKEN TYPE</label>
            </h4>
            <div className={classes.radioGroup}>
              {tokenTypeOptions.map(type => {
                return (
                  <button
                    className={type === tokenType ? cls(classes.radio, classes.active) : classes.radio}
                    onClick={() => {
                      setTokenType(type);
                    }}
                    key={type}
                  >
                    {tokenTypeMap[type]}
                  </button>
                );
              })}
            </div>
            <h4>
              <label>Choose Blockchain Network</label>
            </h4>
            <Dropdown
              value={blockchainNet}
              menuList={BlockchainNets}
              onChange={e => setBlockchainNet(e.target.value)}
              hasImage
            />
            <h4>
              <label>COMPLETE TOKEN INFORMATION</label>
            </h4>
            <div className={classes.row}>
              {(blockchainNet === BlockchainNets[0].value && tokenList.length > 0) ||
              (blockchainNet === BlockchainNets[1].value && substrateTokenList.length > 0) ? (
                <TokenSelect
                  tokens={blockchainNet === BlockchainNets[0].value ? tokenList : substrateTokenList}
                  value={tokenName}
                  onChange={e => {
                    setTokenName(e.target.value as string);
                  }}
                />
              ) : (
                <StyledModalSelect value={0} fullWidth>
                  <StyledMenuItem value={0}> No tokens </StyledMenuItem>
                </StyledModalSelect>
              )}
              <div>
                <StyledTextField2
                  style={{ padding: "9px 15px" }}
                  type="number"
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                  placeholder="Quantity"
                  value={quantity}
                  onChange={elem => {
                    setQuantity(elem.target.value);
                  }}
                  fullWidth
                />
                <span style={{ marginTop: "10px", marginLeft: "10px", display: "block" }}>
                  Max available {maxQuantity}
                </span>
              </div>
            </div>
            {paymentType === "Streaming" && (
              <>
                <h4 className={classes.timespan}>Timespan</h4>
                <div className={classes.row}>
                  <div className={classes.row}>
                    <span className={classes.title}>From</span>
                    <StyledTextField2
                      placeholder="dd/mm/yyyy"
                      value={startingDateString}
                      onChange={elem => {
                        setStartingDateString(elem.target.value);
                        const timestamp = getTimestampFromString(elem.target.value, startingTimeString);
                        setStartingTime(timestamp);
                      }}
                      fullWidth
                    />
                    <StyledTextField2
                      placeholder="hh:mm"
                      value={startingTimeString}
                      onChange={elem => {
                        setStartingTimeString(elem.target.value);
                        const timestamp = getTimestampFromString(startingDateString, elem.target.value);
                        setStartingTime(timestamp);
                      }}
                      fullWidth
                    />
                  </div>
                  <div className={classes.row}>
                    <span className={classes.title}>Until</span>
                    <StyledTextField2
                      placeholder="dd/mm/yyyy"
                      value={endingDateString}
                      onChange={elem => {
                        setEndingDateString(elem.target.value);
                        const timestamp = getTimestampFromString(elem.target.value, endingTimeString);
                        setEndingTime(timestamp);
                      }}
                      fullWidth
                    />
                    <StyledTextField2
                      placeholder="hh:mm"
                      value={endingTimeString}
                      onChange={elem => {
                        setEndingTimeString(elem.target.value);
                        const timestamp = getTimestampFromString(endingDateString, elem.target.value);
                        setEndingTime(timestamp);
                      }}
                      fullWidth
                    />
                  </div>
                </div>
              </>
            )}
            <h4>
              <label>RECIPIENT</label>
            </h4>
            <div className={classes.row}>
              <Autocomplete
                clearOnBlur
                id="autocomplete-0"
                freeSolo
                value={recipient !== "" ? users.find(user => user.id === recipient) : ""}
                onChange={(event: any, newValue: any | null) => {
                  if (newValue) {
                    setRecipient(newValue.id);
                  }
                }}
                options={
                  blockchainNet === BlockchainNets[0].value
                    ? ["", ...users]
                    : [
                        "",
                        ...users.filter(
                          user =>
                            user.wallets &&
                            user.wallets.find(wallet => wallet.name.toUpperCase() === "POLKADOT")
                        ),
                      ]
                }
                renderOption={(option, { selected }) => (
                  <React.Fragment>
                    {option !== "" ? (
                      <div
                        style={{
                          backgroundImage:
                            typeof option !== "string" && option.imageURL
                              ? `url(${option.imageURL})`
                              : "none",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          cursor: "pointer",
                          minWidth: 30,
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: "#656e7e",
                          marginRight: 10,
                        }}
                      />
                    ) : null}
                    <div className={classes.text}>
                      {typeof option !== "string" ? <span>{option.name ? `${option.name}` : ""}</span> : ""}
                    </div>
                  </React.Fragment>
                )}
                getOptionLabel={option => (typeof option !== "string" && option.name ? `${option.name}` : "")}
                getOptionSelected={option => typeof option !== "string" && option.id === recipient}
                renderInput={params => (
                  <InputBase
                    className={classes.autocomplete}
                    ref={params.InputProps.ref}
                    inputProps={params.inputProps}
                    autoFocus
                    placeholder="enter recipient name"
                  />
                )}
              />
              <LoadingWrapper loading={loading}>
                <PrimaryButton size="medium" className={classes.button} onClick={handleClickSend}>
                  Send
                </PrimaryButton>
              </LoadingWrapper>
            </div>
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
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SendTokensModal;
