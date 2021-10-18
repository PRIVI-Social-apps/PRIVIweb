import React, { useEffect, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import { Modal } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";

import { signTransaction } from "shared/functions/signTransaction";
import { generateUniqueId } from "shared/functions/commonFunctions";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const arrowUp = require("assets/icons/arrow_up_white-01.png");
const infoIcon = require("assets/icons/info_icon.png");

export default function CreateOfferModal(props) {
  const user = useTypedSelector(state => state.user);

  const [userBalances, setUserBalances] = useState<any>({});

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  //set to true when we don't want the user to perform certain actions
  //to make sure the data is fully updated before doing anyting

  const [selectedInput, setSelectedInput] = useState<number>(0);

  const [wallet, setWallet] = useState<string>("PRIVI Wallet");

  const [price, setPrice] = useState<string>("");

  const handlePodQuantityChange = value => {
    //TODO: UPDATE CORRECTLY
    setPrice(value);
  };

  const [tokens, setTokens] = useState<any[]>([]);
  const [tokenNames, setTokenNames] = useState<string[]>([]);
  const [token, setToken] = useState<string>("");
  const [tokenName, setTokenName] = useState<string>("");
  const handleTokenChange = event => {
    const value = event.target.value;
    setTokenName(value);
    const t = tokens.find(token => token.name === value);
    setToken(t.token);
  };

  const [podAmount, setPodAmount] = useState<string>("");
  const [podBalance, setPodBalance] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  const handleQuantityChange = value => {
    setPodAmount(value);
    //TODO: UPDATE CORRECTLY¡
  };

  const [fee, setFee] = useState<number>(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<any>("");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  //get tokens
  useEffect(() => {
    setIsDataLoading(true);
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const tokenList: any[] = []; // list of tokens
        const tokenNamesList: string[] = []; // list of name tokens
        const tokenRatesObj: {} = {}; // tokenRates
        const data = resp.data;
        data.forEach(rateObj => {
          tokenList.push({ token: rateObj.token, name: rateObj.name });
          tokenNamesList.push(rateObj.name);
          tokenRatesObj[rateObj.token] = rateObj.rate;
        });
        setTokens(tokenList);
        setTokenNames(tokenNamesList); // update token list
        setTokenName(tokenNamesList[0]);
        setToken(tokenList[0].token);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.pod]);

  // used to get user pod token balance
  useEffect(() => {
    if (props.type === "Buy") {
      if (userBalances[token]) setBalance(userBalances[token].Amount);
      else setBalance(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleWalletChange = wallet => {
    setWallet(wallet);
    //TODO: change into selected wallet ? i don't know if the name is enough
  };

  const handleSubmit = async () => {
    let values = { podAmount, price };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);

    if (Object.keys(validatedErrors).length === 0) {
      setDisableSubmit(true);
      const orderId = generateUniqueId();
      if (props.type === "Sell") {
        const body: any = {
          Offer: {
            OrderId: orderId,
            SAddress: user.id,
            PodAddress: props.pod.PodAddress,
            Amount: Number(podAmount),
            Price: Number(price),
            Token: token,
          },
        };
        const [hash, signature] = await signTransaction(user.mnemonic, body);
        body.Hash = hash;
        body.Signature = signature;
        axios
          .post(`${URL()}/pod/NFT/newSellOrder`, body)
          .then(res => {
            const resp = res.data;
            if (resp.success) {
              setStatus({
                msg: "order created",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                props.handleRefresh();
                props.handleClose();
                setStatus("");
              }, 1000);
            } else {
              setStatus({
                msg: "order creation failed",
                key: Math.random(),
                variant: "error",
              });
            }
          })
          .catch(error => {
            console.log(error);
            // alert('Error Creating new buying offer');
          });
      } else {
        const body: any = {
          Offer: {
            OrderId: orderId,
            BAddress: user.id,
            PodAddress: props.pod.PodAddress,
            Amount: Number(podAmount),
            Price: Number(price),
            Token: token,
          },
        };
        const [hash, signature] = await signTransaction(user.mnemonic, body);
        body.Hash = hash;
        body.Signature = signature;
        axios
          .post(`${URL()}/pod/NFT/newBuyOrder`, body)
          .then(res => {
            const resp = res.data;
            if (resp.success) {
              setStatus({
                msg: "order created",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                props.handleRefresh();
                props.handleClose();
                setStatus("");
              }, 1000);
            } else {
              setStatus({
                msg: "order creation failed",
                key: Math.random(),
                variant: "error",
              });
            }
          })
          .catch(error => {
            console.log(error);
            // alert('Error Creating new selling offer');
          });
      }
      cleanInputs();
      setDisableSubmit(false);
    }
  };

  function validate(values: { [key: string]: string }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};

    if (values.podAmount === null || !Number(values.podAmount)) {
      errors.podAmount = "invalid podAmount";
    } else if (Number(values.podAmount) === 0) {
      errors.podAmount = "podAmount cant be 0";
    } else if (Number(values.podAmount) < 0) {
      errors.podAmount = "podAmount cant be negative";
    } else if (props.type === "Sell" && Number(values.podAmount) > podBalance) {
      errors.podAmount = "insufficient pod amount";
    }

    if (values.price === null || !Number(values.price)) {
      errors.price = "invalid podAmount";
    } else if (Number(values.price) === 0) {
      errors.price = "podAmount cant be 0";
    } else if (Number(values.price) < 0) {
      errors.price = "podAmount cant be negative";
    } else if (props.type === "Buy" && Number(values.price) > balance) {
      errors.price = "insufficient balance";
    }
    return errors;
  }

  const cleanInputs = () => {
    setPodAmount("");
    setPrice("");
    setErrors({});
  };

  const SquareSellTop = () => {
    return (
      <div className="square-container">
        <div className="left-item">
          <div className="label">
            {props.type === "Sell" ? "To Sell" : "To Buy"}
            <img src={infoIcon} className="infoIconAddLiquidityModal" alt={"info"} />
          </div>
          <div className="select-wrapper disabled">
            {
              //TODO: CHANGE PodId TO POD ADDRESS ! also check if it's the right way to get pod image
              ""
            }
            {props.pod.HasPhoto ? (
              <img src={`url(${props.pod.Url}?${Date.now()}`} alt={props.pod.Name} />
            ) : null}
            <InputWithLabelAndTooltip disabled type="text" inputValue={props.pod.Name} overriedClasses="disabled" />
          </div>
          {props.type === "Sell" ? (
            <div className="balance">{`Balance: ${podBalance} ${props.pod.Name}`}</div>
          ) : null}
        </div>

        <div className="right-item">
          <div className="label">
            Quantity
            <img src={infoIcon} className="infoIconAddLiquidityModal" alt={"info"} />
          </div>
          <div className="input-wrapper">
            <InputWithLabelAndTooltip
              overriedClasses=""
              placeHolder="0.0"
              type="number"
              inputValue={podAmount}
              onInputValueChange={v => {
                handleQuantityChange(v.target.value);
                setSelectedInput(0);
              }}
              required
            />
          </div>
          {errors.podAmount ? <div className="error">{errors.podAmount}</div> : null}
        </div>
      </div>
    );
  };

  const SquareSellBottom = () => {
    return (
      <div className="square-container square-container-bottom">
        <div className="left-item">
          <div className="label">
            {props.type === "Sell" ? "Selling Price" : "Buying Price"}
            <img src={infoIcon} className="infoIconAddLiquidityModal" alt={"info"} />
          </div>
          <div className="selector-with-token">
            {token && token.length > 0 ? (
              <img
                className="imgSelectorTokenAddLiquidityModal"
                src={require(`assets/tokenImages/${token}.png`)}
                alt={tokenName}
              />
            ) : null}
            <StyledSelect
              disableUnderline
              value={tokenName}
              className="selectCreatePod"
              style={{ width: "100%" }}
              onChange={e => {
                handleTokenChange(e);
              }}
            >
              {tokenNames.map((item, i) => {
                return (
                  <StyledMenuItem key={i} value={item}>
                    {item}
                  </StyledMenuItem>
                );
              })}
            </StyledSelect>
          </div>
          {props.type === "Buy" ? <div className="balance">{`Balance: ${balance} ${token}`}</div> : null}
        </div>

        <div className="right-item">
          <div className="label">
            Quantity
            <img src={infoIcon} className="infoIconAddLiquidityModal" alt={"info"} />
          </div>
          <div className="input-wrapper">
            <InputWithLabelAndTooltip
              overriedClasses=""
              placeHolder="0.0"
              type="number"
              inputValue={price}
              onInputValueChange={v => {
                handlePodQuantityChange(v.target.value);
                setSelectedInput(1);
              }}
              required
            />
          </div>
          {errors.price ? <div className="error">{errors.price}</div> : null}
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-content w50">
        <div
          className="exit"
          onClick={() => {
            props.handleClose();
            cleanInputs();
          }}
        >
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className="title">
          <h2>{`New ${props.type} Offer`}</h2>
          <div className="select-wallet">
            <StyledSelect
              disableUnderline
              name="type"
              value={wallet}
              onChange={v => handleWalletChange(v.target.value as string)}
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
        <LoadingWrapper loading={isDataLoading}>
          <>
            <SquareSellTop />
            <div className="iconModalSwapDiv">
              <img src={arrowUp} className="plusMiddleIconModalSwap" alt={"arrow up"} />
            </div>
            <SquareSellBottom />
          </>
        </LoadingWrapper>

        <div className="footerAddLiquidityModal">
          <div className="firstColFooterAddLiquidityModal">
            <div className="estimateGasFeeAddLiquidityModal">
              <div className="estimateGasFeeLabelAddLiquidityModal">Estimated fee</div>
              <div className="estimateGasFeeValueAddLiquidityModal">{fee}</div>
            </div>
          </div>
          <div className="secondColFooterAddLiquidityModal">
            <button
              className="buttonSubHeaderSwapMain addLiquidityButtonSubHeaderSwapMain"
              onClick={handleSubmit}
              disabled={disableSubmit}
            >
              Submit
            </button>
          </div>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
}
