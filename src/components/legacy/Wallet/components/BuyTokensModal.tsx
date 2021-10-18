import React, { useEffect, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import { Modal } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import { sampleBalanceData } from "../sampleData";
import "./BuyTokenModal.css";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

export default function BuyTokensModal(props) {
  const user = useTypedSelector(state => state.user);

  const tokenTypeOptions = ["SOCIAL", "CRYPTO", "FTPOD", "NFTPOD"];
  const tokenTypeOptionsMap = {
    SOCIAL: "Social",
    CRYPTO: "Crypto",
    FTPOD: "FT Tokens",
    NFTPOD: "NFT Tokens",
  };

  const [tokenType, setTokenType] = useState<string>(tokenTypeOptions[0]);
  const [filteredTokens, setFilteredTokens] = useState<any[]>([]);
  const [buyingToken, setBuyingToken] = useState<string>("");

  const [quantity, setQuantity] = useState<string>("");
  const [paymentTokens, setPaymentTokens] = useState<any[]>([]);
  const [paymentToken, setPaymentToken] = useState<string>("");
  const [availableBalance, setAvailableBalance] = useState<number>(Infinity); // balance of the paying token, TODO: set correct userBalance when payment changed

  const [equivalence, setEquivalence] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = React.useState<any>("");

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  const [tokensInfo, setTokensInfo] = useState<any[]>([]); // from BE
  const [userAllBalance, setUserAllBalance] = useState<any[]>([]); // from BE
  const [payments, setPayments] = useState<any[]>([]);
  const [isTokenLoading, setIsTokenLoading] = useState<boolean>(false);

  const handleBuy = () => {
    let values = { tokenType, buyingToken, quantity };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);

    if (Object.keys(validatedErrors).length === 0) {
      setDisableSubmit(true);
      let buyingQuantity = Number(quantity);
      if (buyingQuantity) {
        let body = {};
        let address = "";
        paymentTokens.forEach(tokenObj => {
          if (tokenObj.token == paymentToken) address = tokenObj.address;
        });

        if (Number(quantity)) buyingQuantity = Number(quantity);
        switch (tokenType) {
          case "FTPOD":
            body = {
              Investor: user.id,
              PodAddress: address,
              Amount: buyingQuantity,
            };
            axios.post(`${URL()}/pod/FT/investPod`, body).then(res => {
              const resp = res.data;
              if (resp.success) {
                setStatus({
                  msg: "buy success",
                  key: Math.random(),
                  variant: "success",
                });
                setTimeout(() => {
                  loadData();
                  props.handleClose();
                  props.handleRefresh();
                }, 1000);
              } else {
                setStatus({
                  msg: "buy failed",
                  key: Math.random(),
                  variant: "error",
                });
              }
            });
            break;

          case "NFTPOD":
            let offerId = "";
            let seller = "";
            paymentTokens.forEach(offerObj => {
              if (offerObj.token == paymentToken) {
                offerId = offerObj.offerId;
                seller = offerObj.seller;
              }
            });
            body = {
              buyerAddress: user.id,
              sellerAddress: seller,
              podAddress: address,
              orderId: offerId,
              amount: buyingQuantity,
            };
            axios.post(`${URL()}/pod/NFT/buyPodTokens`, body).then(response => {
              const resp = response.data;
              if (resp.success) {
                setStatus({
                  msg: "buy success",
                  key: Math.random(),
                  variant: "success",
                });
                setTimeout(() => {
                  loadData();
                  props.handleRefresh();
                  props.handleClose();
                }, 1000);
              } else {
                setStatus({
                  msg: "buy failed",
                  key: Math.random(),
                  variant: "error",
                });
              }
            });
            break;

          case "SOCIAL":
            body = {
              investor: user.id,
              communityAddress: address,
              amount: buyingQuantity,
            };
            axios.post(`${URL()}/community/buyCommunityToken`, body).then(res => {
              const resp = res.data;
              if (resp.success) {
                setStatus({
                  msg: "buy success",
                  key: Math.random(),
                  variant: "success",
                });
                setTimeout(() => {
                  loadData();
                  props.handleClose();
                  props.handleRefresh();
                }, 1000);
              } else {
                setStatus({
                  msg: "buy failed",
                  key: Math.random(),
                  variant: "error",
                });
              }
            });
        }
        setDisableSubmit(false);
      }
    }
  };

  function validate(values: { [key: string]: string }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};

    if (values.quantity === null || !values.quantity) {
      errors.quantity = "invalid quantity";
    } else if (Number(values.quantity) === 0) {
      errors.quantity = "quantity cant be 0";
    } else if (Number(values.quantity) < 0) {
      errors.quantity = "quantity cant be negative";
    } else if (totalPrice > availableBalance) {
      errors.quantity = "insufficient balance";
    }
    return errors;
  }

  // load data from backend
  const loadData = async () => {
    // load token info data
    setIsTokenLoading(true);
    axios
      .get(`${URL()}/wallet/getAllTokensWithBuyingPrice`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setTokensInfo(resp.data);
          setTokenType(tokenType); // to trigger useEffects
        }
        setIsTokenLoading(false);
      })
      .catch(() => {
        setIsTokenLoading(false);
      });
    // TODO: load user balance data from backend
  };

  useEffect(() => {
    loadData();
  }, []);

  // set correct total price when quantity and equivalence changed
  useEffect(() => {
    if (quantity && equivalence) {
      setTotalPrice(Number(equivalence) * Number(quantity));
    }
  }, [equivalence, quantity]);

  // filter token when token type changed
  useEffect(() => {
    const tokens = [] as any;
    tokensInfo.forEach(tokenObj => {
      if (tokenObj.type === tokenType) {
        tokens.push(tokenObj);
      }
    });
    setFilteredTokens(tokens);
  }, [tokenType]);

  // set buying token when filtered token changed
  useEffect(() => {
    if (filteredTokens.length > 0) {
      setBuyingToken(filteredTokens[0].token);
      setPaymentToken("");
    } else {
      setBuyingToken("");
      setPaymentToken("");
    }
  }, [filteredTokens]);

  // filter payment tokens when buying token changed
  useEffect(() => {
    filteredTokens.forEach(tokenObj => {
      if (tokenObj.token === buyingToken) {
        setPaymentTokens(tokenObj.payments);
        if (tokenObj.payments.length > 0) setPaymentToken(tokenObj.payments[0].token);
        return;
      }
    });
  }, [buyingToken]);

  // set correct equivalence when payment or buying token changed
  useEffect(() => {
    if (paymentToken && quantity) {
      let buyingQuantity = 1;
      let body = {};
      let address = "";
      paymentTokens.forEach(tokenObj => {
        if (tokenObj.token == paymentToken) address = tokenObj.address;
      });

      if (Number(quantity)) buyingQuantity = Number(quantity);
      switch (tokenType) {
        case "FTPOD":
          body = {
            podId: address,
            amount: Number(buyingQuantity),
          };
          axios.post(`${URL()}/pod/FT/getBuyTokenAmount`, body).then(res => {
            const resp = res.data;
            if (resp.success) {
              const totalPrice = resp.data;
              const pricePerUnit = totalPrice / Number(quantity);
              setEquivalence(pricePerUnit.toFixed(4));
            }
          });
          break;

        case "NFTPOD":
          paymentTokens.forEach(tokenObj => {
            console.log(paymentToken, tokenObj);
            if (tokenObj.token == paymentToken) {
              setEquivalence(tokenObj.price);
            }
          });
          break;

        case "SOCIAL":
          body = {
            communityAddress: address,
            amount: Number(buyingQuantity),
          };
          axios.post(`${URL()}/community/getBuyTokenAmount`, body).then(res => {
            const resp = res.data;
            if (resp.success) {
              const totalPrice = resp.data;
              const pricePerUnit = totalPrice / Number(quantity);
              setEquivalence(pricePerUnit.toFixed(4));
            }
          });
      }
    } else {
      setEquivalence("");
    }
  }, [paymentToken, quantity]);

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-content white-inputs w50 buy-send-tokens-modal">
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className="title">
          <h2>Buy Tokens</h2>
          <div className="balance">
            <p>
              <span>Balance</span>
              {sampleBalanceData.map(token => {
                return <span key={`${token.Name}-balance`}>{`${token.balance} ${token.Name}`}</span>;
              })}
            </p>
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
          <label>
            <p>
              Token Name
              <span>
                <img className="info-icon" src={require(`assets/icons/info_icon.png`)} alt={"info"} />
              </span>
            </p>
            <LoadingWrapper loading={isTokenLoading}>
              <StyledSelect
                className="white-select"
                disableUnderline
                name="token name"
                value={buyingToken}
                onChange={v => {
                  setBuyingToken(v.target.value as string);
                }}
                required
              >
                {filteredTokens.map(tokenObj => {
                  return (
                    <StyledMenuItem
                      value={tokenObj.token ? tokenObj.token : ""}
                      key={tokenObj.token ? `${tokenObj.token}-buy-token` : "token-key"}
                    >
                      {/*<img
                        src={require(`assets/tokenImages/${token.Name}.png`)}
                      />*/}
                      {tokenObj.token ? tokenObj.token : ""}
                    </StyledMenuItem>
                  );
                })}
              </StyledSelect>
            </LoadingWrapper>
          </label>
          <label>
            <p>
              Quantity
              <span>
                <img className="info-icon" src={require(`assets/icons/info_icon.png`)} alt={"info"} />
              </span>
            </p>
            <InputWithLabelAndTooltip
              overriedClasses=""
              type="number"
              placeHolder="0"
              inputValue={quantity}
              required
              onInputValueChange={elem => {
                setQuantity(elem.target.value);
              }}
            />
          </label>
          {errors.quantity ? <div className="error">{errors.quantity}</div> : null}
        </div>

        <div className="inputs-row-two w65 bottom-align">
          <label>
            <p>
              Payment Type
              <span>
                <img className="info-icon" src={require(`assets/icons/info_icon.png`)} alt={"info"} />
              </span>
            </p>
            <StyledSelect
              className="white-select"
              disableUnderline
              name="token name"
              value={paymentToken}
              onChange={v => {
                setPaymentToken(v.target.value as string);
              }}
              required
            >
              {paymentTokens.map(tokenObj => {
                return (
                  <StyledMenuItem value={tokenObj.token} key={`${tokenObj.token}-payment`}>
                    {tokenObj.token} {"--"}
                  </StyledMenuItem>
                );
              })}
            </StyledSelect>
          </label>
          <label>
            <InputWithLabelAndTooltip
              overriedClasses="disabled"
              type="text"
              inputValue={`1 ${buyingToken} = ${equivalence} ${paymentToken}`}
              disabled
            />
          </label>
          {errors.quantity ? <div className="error">{errors.quantity}</div> : null}
        </div>

        <div className="buttons">
          <div className="disabled">
            <p>
              <span>Total price</span>
              <span>{`${totalPrice} ${paymentToken}`}</span>
            </p>
          </div>
          <PrimaryButton size="medium" onClick={handleBuy} disabled={disableSubmit}>
            Buy
          </PrimaryButton>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
}
