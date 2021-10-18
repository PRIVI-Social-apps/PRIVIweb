import React, { useState, useEffect } from "react";
import "./Add-Liquidity-Swap-Modal.css";
import Modal from "@material-ui/core/Modal";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import {
  StyledMenuItem,
  StyledSelect,
} from "shared/ui-kit/Styled-components/StyledComponents";
import FormControl from "@material-ui/core/FormControl";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { signTransaction } from "shared/functions/signTransaction";
import {
  formatNumber,
  generateUniqueId,
} from "shared/functions/commonFunctions";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const infoIcon = require("assets/icons/info_icon.png");

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.open === currProps.open &&
    prevProps.token === currProps.token &&
    prevProps.tokens === currProps.tokens
  );
};

const AddLiquiditySwapModal = React.memo((props: any) => {
  const userBalances = useTypedSelector((state) => state.userBalances);
  const user = useTypedSelector((state) => state.user);

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [wallet, setWallet] = useState<string>("PRIVI Wallet");
  const [amount, setAmount] = useState<string>("");
  const [token, setToken] = useState<string>(
    props.token ? props.token : props.tokens ? props.tokens[0] : ""
  );
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [errors, setErrors] = useState<any>({});
  const [status, setStatus] = React.useState<any>("");

  const [gasFee, setGasFee] = useState<number>(0);

  const handleWalletChange = (wallet) => {
    setWallet(wallet);
  };

  const handleAddLiquidity = async () => {
    let values = { amount };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);

    if (Object.keys(validatedErrors).length === 0) {
      setDisableSubmit(true);
      const depositId = generateUniqueId();
      const body: any = {
        LiquidityProviderAddress: user.id,
        PoolToken: token,
        Amount: Number(amount),
        DepositId: depositId,
      };
      const [hash, signature] = await signTransaction(user.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;
      trackPromise(
        axios
          .post(`${URL()}/liquidityPool/depositLiquidity`, body)
          .then((res) => {
            const resp = res.data;
            setDisableSubmit(false);
            if (resp.success) {
              setStatus({
                msg: "add liquidity success",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                setAmount("");
                props.handleRefresh();
                props.handleClose();
              }, 1000);
            } else {
              setStatus({
                msg: "add liquidity failed",
                key: Math.random(),
                variant: "error",
              });
            }
          })
      );
    }
  };

  function validate(values: {
    [key: string]: string;
  }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};

    if (values.amount === null || !Number(values.amount)) {
      errors.amount = "invalid amount";
    } else if (Number(values.amount) === 0) {
      errors.amount = "amount cant be 0";
    } else if (Number(values.amount) < 0) {
      errors.amount = "amount cant be negative";
    } else if (Number(values.amount) > availableBalance) {
      errors.amount = "insufficient balance to perform this operation";
    }
    return errors;
  }

  useEffect(() => {
    let newAvailableBalance = 0;
    if (userBalances && userBalances[token]) {
      newAvailableBalance = userBalances[token].Balance;
    }
    setAvailableBalance(newAvailableBalance);
  }, [token, userBalances]);

  useEffect(() => {
    if (props.token) {
      setToken(props.token);
    } else if (props.tokens && props.tokens.length > 0) {
      setToken(props.tokens[0]);
    }
  }, [props.token, props.tokens]);

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="addLiquiditySwapModal modal-content  w50">
        <div className="exit" onClick={props.handleClose}>
          <img
            src={require("assets/icons/x_darkblue.png")}
            alt={"x"}
          />
        </div>
        <div className="headerAddLiquidityModal">
          <div className="labelHeaderAddLiquidityModal">Add liquidity</div>
          <div className="balancePaperHeaderAddLiquidityModalDiv">
            <div className="balancePaperHeaderAddLiquidityModal">
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
        </div>

        <div className="squareTokenQuantitySwap">
          <div className="tokenColAddLiquidityModal">
            <div className="labelTokenAddLiquidityModal">
              Token
              <img
                src={infoIcon}
                className="infoIconAddLiquidityModal"
                alt="info"
              />
            </div>
            {props.token ? (
              <div className="squareTokenAddLiquidityModal">
                <img
                  className="imgSelectorTokenAddLiquidityModal"
                  src={require(`assets/tokenImages/${props.token}.png`)}
                  alt={props.token}
                />
                <div className="selectorTokenAddLiquidityModal">
                  {props.token}
                </div>
              </div>
            ) : props.tokens ? (
              <div className="squareTokenAddLiquidityModal">
                {token ? (
                  <img
                    className="imgSelectorTokenAddLiquidityModal"
                    src={require(`assets/tokenImages/${token}.png`)}
                    alt={token}
                  />
                ) : null}
                <div className="selectorTokenAddLiquidityModal">
                  <FormControl>
                    <StyledSelect
                      disableUnderline
                      value={token}
                      className="selectTokenAddLiquidityModal"
                      onChange={(e) => {
                        setToken(e.target.value as string);
                      }}
                    >
                      {props.tokens.map((item, i) => {
                        return (
                          <StyledMenuItem key={i} value={item}>
                            {item}
                          </StyledMenuItem>
                        );
                      })}
                    </StyledSelect>
                  </FormControl>
                </div>
              </div>
            ) : null}
            <div className="commentAddLiquidityModal">{`Available ${formatNumber(
              availableBalance,
              token,
              4
            )}`}</div>
          </div>
          <div className="quantityColAddLiquidityModal">
            <div className="labelTokenAddLiquidityModal">
              Quantity
              <img
                src={infoIcon}
                className="infoIconAddLiquidityModal"
                alt="info"
              />
            </div>
            <div className="squareQuantityAddLiquidityModal">
              <InputWithLabelAndTooltip
                overriedClasses="inputQualityAddLiquidityModal"
                inputValue={amount}
                placeHolder="Token quantity..."
                type="number"
                minValue="0"
                onInputValueChange={(elem) => {
                  setAmount(elem.target.value);
                }}
                required
              />
            </div>
            {errors.amount ? (
              <div className="error">{errors.amount}</div>
            ) : null}
          </div>
        </div>

        <div className="footerAddLiquidityModal">
          <div className="firstColFooterAddLiquidityModal">
            <div className="estimateGasFeeAddLiquidityModal">
              <div className="estimateGasFeeLabelAddLiquidityModal">
                Estimated Gas fee
              </div>
              <div className="estimateGasFeeValueAddLiquidityModal">
                {`${gasFee} PRIVI`}
              </div>
            </div>
          </div>
          <div className="secondColFooterAddLiquidityModal">
            <button
              className="buttonSubHeaderSwapMain addLiquidityButtonSubHeaderSwapMain"
              onClick={handleAddLiquidity}
              disabled={disableSubmit}
            >
              Add liquidity
            </button>
          </div>
        </div>
        {status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : null}
      </div>
    </Modal>
  );
}, arePropsEqual);

export default AddLiquiditySwapModal;
