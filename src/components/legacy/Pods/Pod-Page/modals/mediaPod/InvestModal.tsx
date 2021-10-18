import React, { useEffect, useState, useRef } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import { Dialog } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import "./InvestModal.css";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { formatNumber, handleSetStatus } from "shared/functions/commonFunctions";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { IInvestPod, investPod } from "shared/services/API";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const arrowUp = require("assets/icons/arrow_up_white-01.png");
const infoIcon = require("assets/icons/info_icon.png");

export default function InvestModal(props) {
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  //set to true when we don't want the user to perform certain actions
  //to make sure the data is fully updated before doing anyting

  const [wallet, setWallet] = useState<string>("PRIVI Wallet");
  const [fundingQuantity, setFundingQuantity] = useState<number>(0);
  const [podQuantity, setPodQuantity] = useState<string>("");

  const [gasFee, setGasFee] = useState<number>(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = React.useState<any>("");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const handleWalletChange = wallet => {
    setWallet(wallet);
    //TODO: change into selected wallet ? i don't know if the name is enough
  };

  const handleOpenSignatureModal = () => {
    let values = { podQuantity };
    let validatedErrors = validate(values);
    if (Object.keys(validatedErrors).length === 0) {
      const payload: IInvestPod = {
        Investor: user.address,
        PodAddress: props.pod.PodAddress,
        Amount: Number(fundingQuantity),
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    } else {
      setErrors(validatedErrors);
    }
  };

  const handleInvest = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        setDisableSubmit(true);
        const investPodRes = await investPod("investPod", payload, {}, user.mnemonic);
        setDisableSubmit(false);
        if (investPodRes.success) {
          handleSetStatus("invest success", "success", setStatus);
          setDisableSubmit(false);
          setTimeout(() => {
            props.handleClose();
            props.handleRefresh();
            setStatus("");
          }, 1000);
        } else handleSetStatus("invest failed", "error", setStatus);
      }
    } catch (e) {
      handleSetStatus("Unexpected error: " + e, "error", setStatus);
    }
  };

  // get pod token to receive in investment each time investing amount changes
  useEffect(() => {
    setFundingQuantity(Number(podQuantity));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podQuantity]);

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
            <InputWithLabelAndTooltip overriedClasses="" disabled inputValue={props.pod.FundingToken} type="text" />
          </div>
          <div className="balance">{`Available ${formatNumber(
            userBalances[props.pod.FundingToken] ? userBalances[props.pod.FundingToken].Balance : 0,
            props.pod.FundingToken,
            4
          )}`}</div>
        </div>

        <div className="right-item">
          <div className="label">
            Quantity
            <img src={infoIcon} className="infoIconAddLiquidityModal" alt={"info"} />
          </div>
          <div className="input-wrapper disabled">
            <InputWithLabelAndTooltip overriedClasses="" disabled={true} inputValue={`${fundingQuantity}`} type="text" />
          </div>
          {errors.fundingQuantity ? <div className="error">{errors.fundingQuantity}</div> : null}
        </div>
      </div>
    );
  };

  const SquareInvestBottom = () => {
    return (
      <div className="square-container">
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
            <InputWithLabelAndTooltip overriedClasses="" inputValue={props.pod.TokenSymbol} type="text" />
          </div>
          <div className="balance">{`Available ${formatNumber(
            userBalances[props.pod.TokenSymbol] ? userBalances[props.pod.TokenSymbol].Balance : 0,
            props.pod.TokenSymbol,
            4
          )}`}</div>
        </div>

        <div className="right-item">
          <div className="label">
            Quantity
            <img src={infoIcon} className="infoIconAddLiquidityModal" alt={"info"} />
          </div>
          <div className="input-wrapper">
            <InputWithLabelAndTooltip
              overriedClasses=""
              placeHolder="Pod Token to Invest"
              type="number"
              inputValue={`${podQuantity}`}
              onInputValueChange={v => {
                setPodQuantity(v.target.value);
              }}
            />
          </div>
          {errors.podQuantity ? <div className="error">{errors.fundingQuantity}</div> : null}
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      fullWidth
      maxWidth={"sm"}
      className="modal investModal"
    >
      <div className="modal-content">
        <SignatureRequestModal
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleInvest}
          handleClose={() => setOpenSignRequestModal(false)}
        />
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
            <div className="iconPodInvestModalSwapDiv">
              <img src={arrowUp} alt={"arrow up"} />
            </div>
            <SquareInvestBottom />
          </>
        </LoadingWrapper>

        <div className="footerPodInvest">
          <div className="firstColFooterPodInvest">
            <div className="estimateGasFeePodInvest">
              <div className="estimateGasFeeLabelPodInvest">Estimated Gas fee</div>
              <div className="estimateGasFeeValuePodInvest">{gasFee}</div>
            </div>
          </div>
          <div className="secondColFooterPodInvest">
            <button onClick={handleOpenSignatureModal} disabled={disableSubmit}>
              Invest
            </button>
          </div>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Dialog>
  );
}
