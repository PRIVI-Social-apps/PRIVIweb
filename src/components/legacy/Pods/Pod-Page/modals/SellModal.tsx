import React, { useEffect, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import { Modal } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { signTransaction } from "shared/functions/signTransaction";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const arrowUp = require("assets/icons/arrow_up_white-01.png");
const infoIcon = require("assets/icons/info_icon.png");

export default function SellModal(props) {
  const user = useTypedSelector(state => state.user);

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  //set to true when we don't want the user to perform certain actions
  //to make sure the data is fully updated before doing anyting

  const [wallet, setWallet] = useState<string>("PRIVI Wallet");
  const [availablePod, setAvailablePod] = useState<number>(0);
  const [quantity, setQuantity] = useState<string>("");
  const [tokenQuantity, setTokenQuantity] = useState<number>(0);

  const handleQuantityChange = value => {
    setQuantity(value);
    setTokenQuantity(value);
  };

  const [fee, setFee] = useState<number>(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = React.useState<any>("");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  // used to get user pod token balance
  useEffect(() => {
    setDisableSubmit(true);
    const body = {
      userAddress: user.address,
      token: props.pod.TokenSymbol,
    };
    setIsDataLoading(true);
    axios
      .post(`${URL()}/wallet/getUserTokenBalance`, body)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setAvailablePod(resp.data.toFixed(4));
        }
        setDisableSubmit(false);
        setIsDataLoading(false);
      })
      .catch(() => {
        setIsDataLoading(false);
      });
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props.pod]);

  // get funding token to receive in investment each time investing amount changes
  useEffect(() => {
    setDisableSubmit(true);
    const body = {
      podId: props.pod.PodAddress,
      amount: Number(quantity),
    };
    if (quantity) {
      setIsDataLoading(true);
      axios
        .post(`${URL()}/pod/FT/getSellTokenAmount`, body)
        .then(res => {
          const resp = res.data;
          let newFundingTokenQuantity = NaN;
          if (resp.success) {
            newFundingTokenQuantity = resp.data;
          }
          setTokenQuantity(Number(newFundingTokenQuantity.toFixed(4)));
          setDisableSubmit(false);
          setIsDataLoading(false);
        })
        .catch(() => {
          setIsDataLoading(false);
        });
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [quantity]);

  const handleWalletChange = wallet => {
    setWallet(wallet);
    //TODO: change into selected wallet ? i don't know if the name is enough
  };

  const handleSell = async () => {
    let values = { quantity };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);

    if (Object.keys(validatedErrors).length === 0) {
      setDisableSubmit(true);
      const sigBody = {
        Investor: user.id,
        PodAddress: props.pod.PodAddress,
        Amount: Number(quantity),
      };
      const [hash, signature] = await signTransaction(user.mnemonic, sigBody);
      let body: any = { ...sigBody };
      body.Hash = hash;
      body.Signature = signature;

      axios.post(`${URL()}/pod/FT/sellPod`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "sell success",
            key: Math.random(),
            variant: "success",
          });
          setDisableSubmit(false);
          setTimeout(() => {
            props.handleClose();
            props.refreshPod();
          }, 1000);
        } else {
          setStatus({
            msg: "sell failed",
            key: Math.random(),
            variant: "error",
          });
          setDisableSubmit(false);
        }
      });
    }
  };

  function validate(values: { [key: string]: string }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};

    if (values.quantity === null || !Number(values.quantity)) {
      errors.quantity = "invalid quantity";
    } else if (Number(values.quantity) === 0) {
      errors.quantity = "quantity cant be 0";
    } else if (Number(values.quantity) < 0) {
      errors.quantity = "quantity cant be negative";
    } else if (Number(values.quantity) > availablePod) {
      errors.quantity = "insufficient pod tokens to sell";
    }
    return errors;
  }

  const SquareSellTop = () => {
    return (
      <div className="square-container">
        <div className="left-item">
          <div className="label">
            From
            <img src={infoIcon} className="infoIconAddLiquidityModal" alt={"info"} />
          </div>
          <div className="select-wrapper disabled">
            <div
              className="img"
              style={{
                backgroundImage: props.pod.HasPhoto ? `url(${props.pod.Url}?${Date.now()})` : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <InputWithLabelAndTooltip type="text" disabled inputValue={props.pod.TokenSymbol} />
          </div>
          <div className="balance">{`Available ${availablePod} ${props.pod.TokenSymbol}`}</div>
        </div>

        <div className="right-item">
          <InputWithLabelAndTooltip
            labelName="Quantity"
            tooltip=''
            placeHolder="Pod quantity..."
            type="number"
            minValue="0"
            inputValue={quantity}
            onInputValueChange={v => {
              handleQuantityChange(v.target.value);
            }}
          />
        </div>
        {errors.quantity ? <div className="error">{errors.quantity}</div> : null}
      </div >
    );
  };

  const SquareSellBottom = () => {
    return (
      <div className="square-container square-container-bottom">
        <div className="left-item">
          <div className="label">
            To
            <img src={infoIcon} className="infoIconAddLiquidityModal" alt={"info"} />
          </div>
          <div className="select-wrapper disabled">
            <div
              className="img"
              style={{
                backgroundImage: props.pod.FundingToken
                  ? `url(${require(`assets/tokenImages/${props.pod.FundingToken}.png`)})`
                  : props.pod.Token
                    ? `url(${require(`assets/tokenImages/${props.pod.Token}.png`)})`
                    : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <InputWithLabelAndTooltip
              type="text"
              disabled
              inputValue={
                props.pod.FundingToken
                  ? props.pod.FundingToken
                  : props.pod.Token
                    ? props.pod.Token
                    : "Pod token"
              }
            />
          </div>
        </div>

        <div className="right-item">
          <InputWithLabelAndTooltip
            type='number'
            labelName="Quantity"
            tooltip=""
            minValue="0"
            disabled
            inputValue={`${tokenQuantity}`} />
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
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className="title">
          <h2>{`Sell ${props.pod.Name} Tokens`}</h2>
          <div className="select-wallet">
            <StyledSelect
              disableUnderline
              name="type"
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
              onClick={handleSell}
              disabled={disableSubmit}
            >
              Sell
            </button>
          </div>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
}
