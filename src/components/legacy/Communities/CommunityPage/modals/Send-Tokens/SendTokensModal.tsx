import React, { useEffect, useState } from "react";
import axios from "axios";

import { Modal } from "@material-ui/core";

import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { formatNumber } from "shared/functions/commonFunctions";
import { signTransaction } from "shared/functions/signTransaction";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import "./SendTokensModal.css";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

export default function SendTokensModal(props) {
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);

  const tokenTypeOptions = ["SOCIAL", "CRYPTO", "FTPOD", "NFTPOD"];
  const tokenTypeOptionsMap = {
    SOCIAL: "Social",
    CRYPTO: "Crypto",
    FTPOD: "FT Tokens",
    NFTPOD: "NFT Tokens",
  };

  const [tokenType, setTokenType] = useState<string>(tokenTypeOptions[0]);
  const [filteredTokens, setFilteredTokens] = useState<any[]>([]);
  const [token, setToken] = useState<string>("");

  const [quantity, setQuantity] = useState<string>("");
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  const [gasFee, setGasFee] = useState<number>(0.001);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [status, setStatus] = React.useState<any>("");

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  const [allTokens, setAllTokens] = useState<any[]>([]); // from BE

  const [wallet, setWallet] = useState<string>("Ethereum Wallet");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const handleWalletChange = wallet => {
    setWallet(wallet);
    //TODO: change into selected wallet ? i don't know if the name is enough
  };

  useEffect(() => {
    if (userBalances[token]) setAvailableBalance(userBalances[token].Balance);
    else setAvailableBalance(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSend = async () => {
    const body: any = {
      From: user.address,
      To: props.community.CommunityAddress,
      Amount: Number(quantity),
      Token: token,
      Type: "transfer",
    };

    const [hash, signature] = await signTransaction(user.mnemonic, body);
    body.Hash = hash;
    body.Signature = signature;
    body.userId = user.id;

    if (validateErrors()) {
      setDisableSubmit(true);
      axios.post(`${URL()}/community/transfer`, body).then(res => {
        const resp = res.data;
        setDisableSubmit(false);
        if (resp.success) {
          setStatus({
            msg: "transfer success",
            key: Math.random(),
            variant: "success",
          });
          setTimeout(() => {
            props.handleRefresh();
            props.handleClose();
          }, 500);
        } else {
          setStatus({
            msg: "transfer failed",
            key: Math.random(),
            variant: "error",
          });
        }
      });
    }
  };

  function validateErrors() {
    if (quantity === null || !quantity) {
      setErrorMessage("invalid quantity");
      return false;
    } else if (Number(quantity) === 0) {
      setErrorMessage("quantity cant be 0");
      return false;
    } else if (Number(quantity) < 0) {
      setErrorMessage("quantity cant be negative");
      return false;
    } else if (Number(quantity) > availableBalance) {
      setErrorMessage("insufficient balance");
      return false;
    } else {
      setErrorMessage("");
      return true;
    }
  }

  // load data from backend
  const loadData = async () => {
    // load token info data
    setIsDataLoading(true);
    axios
      .get(`${URL()}/wallet/getAllTokensWithBuyingPrice`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setAllTokens(resp.data);
          const tokens = [] as any[];
          resp.data.forEach(tokenObj => {
            if (tokenObj.type === tokenType) {
              tokens.push(tokenObj);
            }
          });
          if (tokens.length > 0) {
            setToken(tokens[0].token);
          } else {
            setToken("");
          }
          setFilteredTokens(tokens);
        }
        setIsDataLoading(false);
      })
      .catch(() => {
        setIsDataLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // filter token when token type changed
  useEffect(() => {
    const tokens = [] as any;
    allTokens.forEach(tokenObj => {
      if (tokenObj.type === tokenType) {
        tokens.push(tokenObj);
      }
    });
    if (tokens.length > 0) {
      setToken(tokens[0].token);
    } else {
      setToken("");
    }
    setFilteredTokens(tokens);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenType]);

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal buySendTokensModal"
    >
      <div className="modal-content white-inputs buy-send-tokens-modal">
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className="title">
          <h2>Send Tokens</h2>
          <div className="select-wallet">
            <StyledSelect
              disableUnderline
              name="type"
              className="styledWhiteTextSelect"
              value={wallet}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                handleWalletChange(event.target.value as string)
              }
              required
            >
              <StyledMenuItem value="PRIVI Wallet" key={1}>
                PRIVI Wallet
              </StyledMenuItem>
              <StyledMenuItem value="Ethereum Wallet" key={2}>
                Ethereum Wallet
              </StyledMenuItem>
            </StyledSelect>
          </div>
        </div>
        <label>
          Select Token type
          <div className="select-tokens">
            {tokenTypeOptions.map(type => {
              return (
                <button
                  className={type !== tokenType ? "disabled" : ""}
                  onClick={() => {
                    setTokenType(type);
                  }}
                  key={type}
                >
                  {tokenTypeOptionsMap[type]}
                </button>
              );
            })}
          </div>
        </label>
        <div className="inputs-row-two w65">
          <LoadingWrapper loading={isDataLoading}>
            <>
              <label>
                <p>
                  Token Name
                  <span>
                    <img className="info-icon" src={require(`assets/icons/info_icon.png`)} alt={"info"} />
                  </span>
                </p>
                <div className="selector-with-token">
                  {filteredTokens.some(t => t.token === token && t.type === "CRYPTO") ? (
                    <div
                      className="img"
                      style={{
                        backgroundImage:
                          token.length > 0 &&
                            filteredTokens.some(t => t.token === token && t.type === "CRYPTO")
                            ? `url(${require(`assets/tokenImages/${token}.png`)})`
                            : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : null}
                  <StyledSelect
                    className="white-select"
                    disableUnderline
                    style={{
                      paddingLeft: tokenType !== "CRYPTO" ? 20 : 10,
                      width: tokenType !== "CRYPTO" ? `calc(100% - 20px)` : `calc(100% - 60px)`,
                    }}
                    name="token name"
                    value={token}
                    onChange={v => {
                      setToken(v.target.value as string);
                    }}
                    required
                  >
                    {filteredTokens.map(tokenObj => {
                      return (
                        <StyledMenuItem
                          value={tokenObj.token ? tokenObj.token : ""}
                          key={tokenObj.token ? `${tokenObj.token}-buy-token` : "token-key"}
                        >
                          {tokenObj.token ? tokenObj.token : ""}
                        </StyledMenuItem>
                      );
                    })}
                  </StyledSelect>
                </div>
              </label>
              <label>
                <InputWithLabelAndTooltip
                  labelName="Quantity"
                  tooltip={""}
                  type="number"
                  inputValue={quantity}
                  required
                  placeHolder="0"
                  minValue={"0.001"}
                  onInputValueChange={e => setQuantity(e.target.value)} />
                <p className="balance">Balance: {formatNumber(availableBalance, token, 4)}</p>
              </label>
            </>
          </LoadingWrapper>
        </div>

        {errorMessage.length > 0 ? <div className="error">{errorMessage}</div> : null}

        <div className="buttons">
          <div className="disabled">
            <p>
              <span>Estimated gas fee</span>
              <span>{`${gasFee} ${wallet === "Ethereum Wallet" ? "ETH" : wallet.replace("Wallet", "")
                }`}</span>
            </p>
          </div>
          <button onClick={handleSend} disabled={disableSubmit}>
            Send
          </button>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
}
