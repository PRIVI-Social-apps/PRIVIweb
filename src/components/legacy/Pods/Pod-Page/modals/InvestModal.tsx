import React, { useEffect, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import { Modal } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import "./InvestModal.css";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { signTransaction } from "shared/functions/signTransaction";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const arrowUp = require("assets/icons/arrow_up_white-01.png");
const infoIcon = require("assets/icons/info_icon.png");

export default function InvestModal(props) {
  const user = useTypedSelector(state => state.user);

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  //set to true when we don't want the user to perform certain actions
  //to make sure the data is fully updated before doing anyting

  const [wallet, setWallet] = useState<string>("PRIVI Wallet");
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [fundingQuantity, setFundingQuantity] = useState<string>("");
  const [podQuantity, setPodQuantity] = useState<number>(0);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const handleQuantityChange = value => {
    setFundingQuantity(value);
    //TODO: update POD fundingQuantity ??
    setPodQuantity(value);
  };

  const [gasFee, setGasFee] = useState<number>(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = React.useState<any>("");

  // used to get user funding token balance
  useEffect(() => {
    setDisableSubmit(true);
    const body = {
      userAddress: user.address,
      token: props.pod.FundingToken,
    };
    setIsDataLoading(true);
    axios
      .post(`${URL()}/wallet/getUserTokenBalance`, body)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setAvailableBalance(resp.data.toFixed(4));
        }
        setDisableSubmit(false);
        setIsDataLoading(false);
      })
      .catch(() => {
        setIsDataLoading(false);
      });
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props.pod]);

  const handleWalletChange = wallet => {
    setWallet(wallet);
    //TODO: change into selected wallet ? i don't know if the name is enough
  };

  const handleInvest = async () => {
    let values = { fundingQuantity };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);

    if (Object.keys(validatedErrors).length === 0) {
      setDisableSubmit(true);
      const sigBody = {
        Investor: user.address,
        PodAddress: props.pod.PodAddress,
        Amount: Number(fundingQuantity),
      };
      const [hash, signature] = await signTransaction(user.mnemonic, sigBody);
      let body: any = { ...sigBody };
      body.Hash = hash;
      body.Signature = signature;

      console.log(body);
      axios.post(`${URL()}/pod/FT/investPod`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "invest success",
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
            msg: "invest failed",
            key: Math.random(),
            variant: "error",
          });
          setDisableSubmit(false);
        }
      });
    }
  };

  // get pod token to receive in investment each time investing amount changes
  useEffect(() => {
    setDisableSubmit(true);
    const body = {
      podId: props.pod.PodAddress,
      amount: Number(fundingQuantity),
    };
    if (fundingQuantity) {
      setIsDataLoading(true);
      axios
        .post(`${URL()}/pod/FT/getBuyTokenAmount`, body)
        .then(res => {
          const resp = res.data;
          let newPodQuantity = NaN;
          if (resp.success) {
            newPodQuantity = resp.data;
          } else {
          }
          setPodQuantity(Number(newPodQuantity.toFixed(4)));
          setDisableSubmit(false);
          setIsDataLoading(false);
        })
        .catch(() => {
          setIsDataLoading(false);
        });
    }
  }, [fundingQuantity]);

  function validate(values: { [key: string]: string }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};

    if (values.fundingQuantity === null || !Number(values.fundingQuantity)) {
      errors.fundingQuantity = "invalid fundingQuantity";
    } else if (Number(values.fundingQuantity) === 0) {
      errors.fundingQuantity = "fundingQuantity cant be 0";
    } else if (Number(values.fundingQuantity) < 0) {
      errors.fundingQuantity = "fundingQuantity cant be negative";
    } else if (Number(values.fundingQuantity) > availableBalance) {
      errors.fundingQuantity = "insufficient fund to invest";
    }
    return errors;
  }

  const SquareInvestTop = () => {
    return (
      <div className="square-container">
        <div className="left-item left-item-no-label">
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
            <InputWithLabelAndTooltip type="text" disabled inputValue={props.pod.FundingToken} />
          </div>
          <div className="balance">{`Available ${availableBalance} ${props.pod.FundingToken}`}</div>
        </div>

        <div className="right-item">
          <InputWithLabelAndTooltip
            labelName="Quantity"
            tooltip={""}
            placeHolder="Token fundingQuantity..."
            type="number"
            inputValue={`${fundingQuantity}`}
            onInputValueChange={v => {
              handleQuantityChange(v.target.value);
            }}
          />
        </div>
      </div>
    );
  };

  const SquareInvestBottom = () => {
    return (
      <div className="square-container square-container-bottom">
        <div className="left-item left-item-no-label">
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
        </div>

        <div className="right-item">
          <InputWithLabelAndTooltip
            labelName="Quantity"
            tooltip=""
            type="text"
            disabled
            inputValue={`${podQuantity}`}
          />
          {errors.fundingQuantity ? <div className="error">{errors.fundingQuantity}</div> : null}
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
      className="modal investModal"
    >
      <div className="modal-content w50">
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className="title">
          <h2>{`Invest into ${props.pod.TokenSymbol}`}</h2>
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
            <SquareInvestTop />
            <div className="iconModalSwapDiv">
              <img src={arrowUp} className="plusMiddleIconModalSwap" alt={"arrow up"} />
            </div>
            <SquareInvestBottom />
          </>
        </LoadingWrapper>

        <div className="footerAddLiquidityModal">
          <div className="firstColFooterAddLiquidityModal">
            <div className="estimateGasFeeAddLiquidityModal">
              <div className="estimateGasFeeLabelAddLiquidityModal">Estimated Gas fee</div>
              <div className="estimateGasFeeValueAddLiquidityModal">{gasFee}</div>
            </div>
          </div>
          <div className="secondColFooterAddLiquidityModal">
            <button
              className="buttonSubHeaderSwapMain addLiquidityButtonSubHeaderSwapMain"
              onClick={handleInvest}
              disabled={disableSubmit}
            >
              Invest
            </button>
          </div>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
}
