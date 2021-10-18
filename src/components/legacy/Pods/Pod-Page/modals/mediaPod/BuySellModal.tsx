import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import { buySellModalStyles } from "./BuySellModal.styles";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { formatNumber } from "shared/functions/commonFunctions";
import { useTypedSelector } from "store/reducers/Reducer";
import { buildJsxFromObject, handleSetStatus } from "shared/functions/commonFunctions";
import { Modal } from "shared/ui-kit";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { IBuySellPodTokens, buyPodTokens, sellPodTokens } from "shared/services/API";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const arrowUp = require("assets/icons/arrow_up_white.png");

export default function BuySellModal(props) {
  const classes = buySellModalStyles();

  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  //set to true when we don't want the user to perform certain actions
  //to make sure the data is fully updated before doing anyting

  const [wallet, setWallet] = useState<string>("PRIVI Wallet");
  const [fundingQuantity, setFundingQuantity] = useState<number>(0);
  const [podQuantity, setPodQuantity] = useState<string>("");

  const [fee, setFee] = useState<number>(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<any>("");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  // get pod token to receive in investment each time investing amount changes
  useEffect(() => {
    if (props.modalType && podQuantity) {
      if (props.modalType == "buy") {
        setDisableSubmit(true);
        const config = {
          params: {
            PodAddress: props.pod.PodAddress,
            Amount: Number(podQuantity),
          },
        };
        setIsDataLoading(true);
        axios
          .get(`${URL()}/mediaPod/getBuyingPodFundingTokenAmount`, config)
          .then(res => {
            const resp = res.data;
            let newFundintTokenAmount: number = 0;
            if (resp.success) {
              newFundintTokenAmount = resp.data;
            }
            setFundingQuantity(Number(newFundintTokenAmount.toFixed(4)));
            setDisableSubmit(false);
            setIsDataLoading(false);
          })
          .catch(() => {
            setIsDataLoading(false);
          });
      } else {
        setDisableSubmit(true);
        const config = {
          params: {
            PodAddress: props.pod.PodAddress,
            Amount: Number(podQuantity),
          },
        };
        setIsDataLoading(true);
        axios
          .get(`${URL()}/mediaPod/getSellingPodFundingTokenAmount`, config)
          .then(res => {
            const resp = res.data;
            let newFundintTokenAmount: number = 0;
            if (resp.success) {
              newFundintTokenAmount = resp.data;
            }
            setFundingQuantity(Number(newFundintTokenAmount.toFixed(4)));
            setDisableSubmit(false);
            setIsDataLoading(false);
          })
          .catch(() => {
            setIsDataLoading(false);
          });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podQuantity, props.modalType]);

  const handleWalletChange = wallet => {
    setWallet(wallet);
    //TODO: change into selected wallet ? i don't know if the name is enough
  };

  const handleOpenSignatureModal = () => {
    const values = { podQuantity };
    const validatedErrors = validate(values);
    if (Object.keys(validatedErrors).length === 0) {
      const payload: IBuySellPodTokens = {
        PodAddress: props.pod.PodAddress,
        Amount: Number(podQuantity),
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    } else {
      setErrors(validatedErrors);
    }
  };

  const handleBuyOrSell = async () => {
    const payload = payloadRef.current;
    if (Object.keys(payload).length) {
      if (props.modalType === "buy") {
        setDisableSubmit(true);
        const buyResponse = await buyPodTokens("buyPodTokens", payload, {}, user.mnemonic);
        setDisableSubmit(false);
        if (buyResponse.success) {
          handleSetStatus("buy success", "success", setStatus);
          setTimeout(() => {
            props.handleClose();
            props.handleRefresh();
            setStatus("");
          }, 1000);
        } else {
          handleSetStatus("buy failed", "error", setStatus);
        }
      } else {
        setDisableSubmit(true);
        const buyResponse = await sellPodTokens("sellPodTokens", payload, {}, user.mnemonic);
        setDisableSubmit(false);
        if (buyResponse.success) {
          handleSetStatus("sell success", "success", setStatus);
          setTimeout(() => {
            props.handleClose();
            props.handleRefresh();
            setStatus("");
          }, 1000);
        } else {
          handleSetStatus("sell failed", "error", setStatus);
        }
      }
    }
  };

  function validate(values: { [key: string]: string }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};

    if (values.podQuantity === null || !Number(values.podQuantity)) {
      errors.podQuantity = "invalid podQuantity";
    } else if (Number(values.podQuantity) === 0) {
      errors.podQuantity = "podQuantity cant be 0";
    } else if (Number(values.podQuantity) < 0) {
      errors.podQuantity = "podQuantity cant be negative";
    } else if (
      userBalances[props.pod.FundingToken] &&
      Number(values.fundingQuantity) > userBalances[props.pod.FundingToken].Balance
    ) {
      errors.fundingQuantity = "insufficient fund to invest";
    }
    return errors;
  }

  const SquareInvestTop = () => {
    return (
      <div className={classes.squareContainer}>
        <div>
          <div className={classes.squareContainerLabel}>Token</div>
          <div className={classes.squareContainerInput}>
            <InputWithLabelAndTooltip
              type="text"
              overriedClasses={classes.imageInput}
              inputValue={props.pod.FundingToken}
              disabled
            />
            <img
              src={
                props.pod.FundingToken ? require(`assets/tokenImages/${props.pod.FundingToken}.png`) : "none"
              }
              alt="ETH"
            />
          </div>
          <div className={classes.balance}>
            {`Available ${formatNumber(
              userBalances[props.pod.FundingToken] ? userBalances[props.pod.FundingToken].Balance : 0,
              props.pod.FundingToken,
              4
            )}`}
          </div>
        </div>
        <div>
          <div className={classes.squareContainerLabel}>Amount</div>
          <div className={classes.squareContainerInput}>
            <InputWithLabelAndTooltip
              overriedClasses=""
              type="text"
              inputValue={`${fundingQuantity}`}
              disabled
            />
          </div>
          {errors.fundingQuantity ? <div className="error">{errors.fundingQuantity}</div> : null}
        </div>
      </div>
    );
  };

  const SquareInvestBottom = () => {
    return (
      <div className={classes.squareContainer}>
        <div>
          <div className={classes.squareContainerLabel}>Token</div>
          <div className={classes.squareContainerInput}>
            <InputWithLabelAndTooltip
              type="text"
              overriedClasses={classes.imageInput}
              inputValue={props.pod.TokenSymbol}
              disabled
            />
            <img src={require("assets/icons/ETHToken.svg")} alt="BALToken" />
          </div>
          <div className={classes.balance}>
            {`Available ${formatNumber(
              userBalances[props.pod.TokenSymbol] ? userBalances[props.pod.TokenSymbol].Balance : 0,
              props.pod.TokenSymbol,
              4
            )}`}
          </div>
        </div>
        <div>
          <div className={classes.squareContainerLabel}>Amount</div>
          <div className={classes.squareContainerInput}>
            <InputWithLabelAndTooltip
              overriedClasses=""
              type="number"
              inputValue={podQuantity}
              onInputValueChange={v => {
                setPodQuantity(v.target.value);
              }}
            />
          </div>
          {errors.podQuantity ? <div className={classes.error}>{errors.podQuantity}</div> : null}
        </div>
      </div>
    );
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      className={classes.root}
      showCloseIcon
    >
      <div className={classes.modalContent}>
        <SignatureRequestModal
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleBuyOrSell}
          handleClose={() => setOpenSignRequestModal(false)}
        />
        <div className={classes.title}>
          {props.modalType === "buy" ? "Buy " : "Sell Your "}
          {props.pod.TokenSymbol}
        </div>
        <LoadingWrapper loading={isDataLoading}>
          {props.modalType === "buy" ? <SquareInvestTop /> : <SquareInvestBottom />}
        </LoadingWrapper>
        <div className={classes.swapBtnSection}>
          <button
            className={classes.swapButton}
            onClick={() => {
              const type = props.modalType === "buy" ? "sell" : "buy";
              props.changeModalType && props.changeModalType(type);
            }}
          >
            <span>SWAP TO {props.modalType === "buy" ? "SELL" : "BUY"}</span>
            <img src={arrowUp} alt="arrow up" />
          </button>
        </div>
        <LoadingWrapper loading={isDataLoading}>
          {props.modalType === "buy" ? <SquareInvestBottom /> : <SquareInvestTop />}
        </LoadingWrapper>

        <div className={classes.squareContainer}>
          <div>
            <div className={classes.squareContainerLabel}>Estimated fee</div>
            <div className={classes.squareContainerInput}>
              <InputWithLabelAndTooltip type="text" inputValue={`${fee}`} disabled overriedClasses="" />
            </div>
          </div>
          <div className={classes.submit}>
            <button onClick={handleOpenSignatureModal} disabled={disableSubmit}>
              {props.modalType === "buy" ? "Buy" : "Sell"}
            </button>
          </div>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
}
