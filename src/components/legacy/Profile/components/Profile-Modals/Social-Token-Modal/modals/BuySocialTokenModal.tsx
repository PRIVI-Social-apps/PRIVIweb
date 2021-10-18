import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";

import { Modal } from "@material-ui/core";

import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { formatNumber, handleSetStatus } from "shared/functions/commonFunctions";
import { PrimaryButton } from "shared/ui-kit";
import { buySocialTokenModalStyles } from "./BuySocialTokenModal.styles";
import { signPayload } from "shared/services/WalletSign";
import { getPriviWallet } from "shared/helpers";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.open === currProps.open &&
    JSON.stringify(prevProps.socialToken) === JSON.stringify(currProps.socialToken) &&
    JSON.stringify(prevProps.user) === JSON.stringify(currProps.user) &&
    JSON.stringify(prevProps.userBalances) === JSON.stringify(currProps.userBalances)
  );
};

const BuySocialTokenModal = React.memo((props: any) => {
  const classes = buySocialTokenModalStyles();

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  const [wallet, setWallet] = useState<string>("PRIVI Wallet");

  const [fromTokenQuantity, setFromTokenQuantity] = useState<number>(0);
  const [toTokenQuantity, setToTokenQuantity] = useState<number>(0);

  const [gasFee, setGasFee] = useState<number>(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = React.useState<any>("");

  useEffect(() => {
    if (props.socialToken?.PoolAddress && fromTokenQuantity) {
      setDisableSubmit(true);
      const config = {
        params: {
          poolAddress: props.socialToken.PoolAddress,
          amount: fromTokenQuantity,
        },
      };
      axios
        .get(`${URL()}/social/getSocialTokenAmount`, config)
        .then(res => {
          const resp = res.data;
          setDisableSubmit(false);
          if (resp.success) {
            setToTokenQuantity(resp.data);
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      setToTokenQuantity(0);
    }
  }, [props.socialToken.PoolAddress, fromTokenQuantity]);

  const handleWalletChange = wallet => {
    setWallet(wallet);
    //TODO: change into selected wallet ? i don't know if the name is enough
  };

  const handleBuy = async () => {
    let values = { toTokenQuantity };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);

    if (Object.keys(validatedErrors).length === 0) {
      setDisableSubmit(true);
      const body: any = {
        Investor: props.user.address,
        PoolAddress: props.socialToken.PoolAddress,
        Amount: fromTokenQuantity,
      };
      const { address, privateKey } = await getPriviWallet();
      const { signature } = await signPayload("createSocialToken", address, body, privateKey);

      const requestBody = {
        Data: {
          Function: "buySocialToken",
          Address: props.user.address, //this is mock data,
          Signature: signature,
          Payload: {
            Investor: props.user.address,
            PoolAddress: props.socialToken.PoolAddress,
            Amount: fromTokenQuantity,
          },
        },
      };
      axios
        .post(`${URL()}/social/buySocialToken/v2`, requestBody)
        .then(res => {
          const resp = res.data;
          setDisableSubmit(false);
          if (resp.success) {
            handleSetStatus("purchase success", "success", setStatus);
            setTimeout(() => {
              setFromTokenQuantity(0);
              setToTokenQuantity(0);
              props.handleClose();
              props.handleRefresh();
            }, 1000);
          } else {
            handleSetStatus("purchase failed", "error", setStatus);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  function validate(values: { [key: string]: number }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};

    if (values.toTokenQuantity === null || !Number(values.toTokenQuantity)) {
      errors.fromTokenQuantity = "invalid community token quantity";
    } else if (Number(values.toTokenQuantity) === 0) {
      errors.fromTokenQuantity = "community token quantity cant be 0";
    } else if (Number(values.toTokenQuantity) < 0) {
      errors.fromTokenQuantity = "community token quantity cant be negative";
    } else if (
      !props.userBalances[props.socialToken.FundingToken] ||
      Number(values.fromTokenQuantity) > props.userBalances[props.socialToken.FundingToken].Balance
    ) {
      errors.fromTokenQuantity = "insufficient fund to buy";
    }
    return errors;
  }

  const SquareBuyBottom = () => {
    return (
      <div className={classes.squareContainerBottom}>
        <div className={classes.leftItem}>
          <div className={classes.itemLabel}>
            Paying Token
            {/* <img src={infoIcon} className={classes.infoIconAddLiquidityModal} alt={"info"} /> */}
          </div>
          <div className={classes.itemDisabled}>
            {/* {props.socialToken && props.socialToken.FundingToken ? (
              <div
                className={classes.imgSelectorTokenAddLiquidityModal}
                style={{
                  backgroundImage:
                    props.socialToken.FundingToken !== ""
                      ? `url(${URL()}/wallet/getTokenPhoto/${props.socialToken.FundingToken})`
                      : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ) : null} */}
            <InputWithLabelAndTooltip overriedClasses={classes.inputWrapper} type='text' disabled inputValue={props.socialToken.FundingToken} />
          </div>
          <div className={classes.balance}>{`Available ${formatNumber(
            props.userBalances[props.socialToken.FundingToken]
              ? props.userBalances[props.socialToken.FundingToken].Balance
              : 0,
            props.socialToken.FundingToken ? props.socialToken.FundingToken : "",
            4
          )} `}</div>
        </div>

        <div className={classes.rightItem}>
          <div className={classes.itemLabel}>
            Quantity
            {/* <img src={infoIcon} className={classes.infoIconAddLiquidityModal} alt={"info"} /> */}
          </div>
          <div className={classes.itemDisabled}>
            <InputWithLabelAndTooltip overriedClasses={classes.inputWrapper} disabled inputValue={toTokenQuantity.toFixed(4)} type='text' />
          </div>
        </div>
      </div>
    );
  };

  const SquareBuyTop = () => {
    return (
      <div className={classes.squareContainer}>
        <div className={classes.leftItem}>
          <div className={classes.itemLabel}>
            Buying Token
            {/* <img src={infoIcon} className={classes.infoIconAddLiquidityModal} alt={"info"} /> */}
          </div>
          <div className={classes.itemDisabled}>
            {/* {props.socialToken && props.socialToken.TokenSymbol ? (
              <div
                className={classes.imgSelectorTokenAddLiquidityModal}
                style={{
                  backgroundImage:
                    props.socialToken.TokenSymbol !== ""
                      ? `url(${URL()}/wallet/getTokenPhoto/${props.socialToken.TokenSymbol})`
                      : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ) : null} */}
            <InputWithLabelAndTooltip type='text' overriedClasses={classes.inputWrapper} disabled inputValue={props.socialToken.TokenName} />
          </div>
          <div className={classes.balance}>{`Balance ${formatNumber(
            props.userBalances[props.socialToken.TokenSymbol]
              ? props.userBalances[props.socialToken.TokenSymbol].Balance
              : 0,
            props.socialToken.TokenSymbol ? props.socialToken.TokenSymbol : "",
            4
          )} `}</div>
        </div>

        <div className={classes.rightItem}>
          <div className={classes.itemLabel}>
            Quantity
            {/* <img src={infoIcon} className={classes.infoIconAddLiquidityModal} alt={"add"} /> */}
          </div>
          <div className={classes.rightInputWrapper}>
            <InputWithLabelAndTooltip
              overriedClasses={classes.inputWrapper}
              placeHolder="Social Token quantity..."
              type="number"
              minValue="0"
              inputValue={fromTokenQuantity}
              onInputValueChange={v => {
                const newFromTokenQuantity = Number(v.target.value);
                setFromTokenQuantity(newFromTokenQuantity);
              }}
            />
          </div>
          {errors.fromTokenQuantity ? <div className="error">{errors.fromTokenQuantity}</div> : null}
        </div>
      </div>
    );
  };

  return (
    <Modal open={props.open} onClose={props.handleClose} className={classes.root}>
      <div className={classes.socialModalContent}>
        <div className={classes.closeButton} onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className={classes.title}>
          <h2>{`Buy ${props.socialToken.TokenName ?? ""}`}</h2>
          <div className={classes.selectWallet}>
            <StyledSelect
              disableUnderline
              name="type"
              value={wallet}
              className={classes.styledWhiteTextSelect}
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

        <SquareBuyTop />
        <div className={classes.iconModalSwapDiv}>
          {/* <img src={arrowUp} className={classes.plusMiddleIconModalSwap} alt={"arrow up"} /> */}
        </div>
        <SquareBuyBottom />

        <div className={classes.footerAddLiquidityModal}>
          <div className={classes.firstColFooterAddLiquidityModal}>
            <div className={classes.estimateGasFeeAddLiquidityModal}>
              <div className={classes.estimateGasFeeLabelAddLiquidityModal}>Estimated Gas fee</div>
              <div className={classes.estimateGasFeeValueAddLiquidityModal}>{gasFee}</div>
            </div>
          </div>
          <div className={classes.secondColFooterAddLiquidityModal}>
            <PrimaryButton
              size="medium"
              className={classes.addLiquidityButtonSubHeaderSwapMain}
              onClick={handleBuy}
              disabled={disableSubmit}
            >
              Buy
            </PrimaryButton>
          </div>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
}, arePropsEqual);

const mapStateToProps = state => {
  return {
    user: state.user,
    userBalances: state.userBalances,
  };
};

export default connect(mapStateToProps)(BuySocialTokenModal);
