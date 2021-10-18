import React, { useEffect, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import { Modal } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import "./BorrowModal.css";
import { trackPromise } from "react-promise-tracker";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { signTransaction } from "shared/functions/signTransaction";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as PlusSolid } from "assets/icons/plus-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

export default function BorrowModal(props) {
  const pool = props.pool;

  const user = useTypedSelector(state => state.user);
  const [userBalance, setUserBalance] = useState<Number>(0);
  const [amount, setAmount] = useState<string>("");
  const [isBorrowNOK, setIsBorrowNOK] = useState<string>("");

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  //borrow status, to update the message to show at the end after calling backend
  const [status, setStatus] = React.useState<any>("");

  //collaterals
  const [tokens, setTokens] = useState<string[]>(["PC", "BC", "DC"]);
  const [collateralToken, setCollateralToken] = useState<string>(tokens[0]);
  const [collateral, setCollateral] = useState<string>("");
  const [collaterals, setCollaterals] = useState<Map<string, string>>(new Map([]));
  const [collateralBalance, setCollateralBalance] = useState<Number>(0);
  const [collateralError, setCollateralError] = useState<string>("");

  // check if user has enought funds in each tokens added as collateral
  const enoughtFundsForCollaterals = () => {
    if (!props.userBalances) return true;
    let enoughtFunds = true;
    collaterals.forEach((val, key, _) => {
      if (!props.userBalances[key] || props.userBalances[key].Amount < Number(val)) enoughtFunds = false;
    });
    return enoughtFunds;
  };

  // reset fields after operation completed
  const resetFields = () => {
    setAmount("");
    setCollateral("");
    setCollateralToken(tokens[0]);
    setCollaterals(new Map());
    setStatus("");
  };

  // Check available amount is greater than borrow amount
  const handleSubmit = async () => {
    if (amount === "") {
      setIsBorrowNOK("Please fill in the amount");
    } else if (pool.Deposited < parseInt(amount)) {
      setIsBorrowNOK(`Borrow amount is higher \n than the available funds`);
    } else if (!enoughtFundsForCollaterals()) {
      setIsBorrowNOK(`Don't have enought funds for one of the collaterals`);
    } else {
      setDisableSubmit(true);
      const collateralObj = {};
      collaterals.forEach((value: string, key: string) => {
        collateralObj[key] = parseFloat(value);
      });
      const body: any = {
        Address: user.id,
        CreditAddress: pool.CreditAddress,
        Amount: Number(amount),
        Collaterals: collateralObj,
      };
      const [hash, signature] = await signTransaction(user.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;

      trackPromise(
        axios
          .post(`${URL()}/priviCredit/borrowFunds`, body)
          .then(res => {
            const resp = res.data;
            if (resp.success) {
              setStatus({
                msg: "credit borrow success",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                props.refreshPool();
                props.handleClose();
                resetFields();
              }, 1000);
            } else {
              setStatus({
                msg: "credit borrow failed",
                key: Math.random(),
                variant: "error",
              });
            }
            setDisableSubmit(false);
          })
          .catch(async err => {
            console.log("Error in Borrow.tsx -> handleSubmit() : ", err);
            setStatus({
              msg: "deposit failed",
              key: Math.random(),
              variant: "error",
            });
            setDisableSubmit(false);
          })
      );
    }
  };

  //check collateral value (before adding it to the collaterals list) > 0
  function validateCollateral(value: string) {
    var collateralError: string = "";
    if (!value) {
      collateralError = "please enter a valid number";
    } else if (collaterals.get(collateralToken)) {
      collateralError = "collateral with this token already added";
    } else if (Number.parseFloat(value) <= 0) {
      collateralError = "collateral must be greater than 0";
    }
    return collateralError;
  }

  // set accepted collateral and userBalance in lending token and balance in selected collateral token
  useEffect(() => {
    if (
      props.pool &&
      props.userBalances &&
      Object.keys(props.pool).length !== 0 &&
      Object.keys(props.userBalances).length !== 0
    ) {
      if (props.pool.CollateralsAccepted) {
        setTokens(props.pool.CollateralsAccepted);
        setCollateralToken(props.pool.CollateralsAccepted[0]);
      }
      if (props.pool.LendingToken) {
        if (props.userBalances) {
          const newBalance = props.userBalances[props.pool.LendingToken].Amount;
          if (newBalance) setUserBalance(newBalance);
        }
      }
    }
  }, [props.pool, props.userBalances]);

  useEffect(() => {
    if (props.userBalances && props.userBalances[collateralToken]) {
      setCollateralBalance(props.userBalances[collateralToken].Amount);
    } else {
      setCollateralBalance(0);
    }
  }, [collateralToken]);

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
          <h2>Borrow</h2>
        </div>
        <label>
          {`Quantity (Balance ${userBalance.toFixed(2)} ${pool.LendingToken ? pool.LendingToken : "Tokens"})`}
          <InputWithLabelAndTooltip
            type="number"
            placeHolder="0"
            inputValue={amount}
            required
            onInputValueChange={e => setAmount(e.target.value)}
          />
        </label>
        <div className="inputs-row-two w65 bottom-align">
          <label>
            {`Collateral (Available ${collateralBalance.toFixed(2)} ${collateralToken})`}
            <InputWithLabelAndTooltip
              inputValue={collateral}
              type="number"
              placeHolder="0"
              onInputValueChange={e => setCollateral(e.target.value)}
            />
          </label>
          <label className="h">
            <StyledSelect
              disableUnderline
              //select collateral token
              name="collateralToken"
              value={collateralToken}
              id="collateralToken"
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setCollateralToken(event.target.value as string);
              }}
              required
            >
              {tokens.map((collateralToken: string) => {
                return (
                  <StyledMenuItem value={collateralToken} key={collateralToken}>
                    {collateralToken}
                  </StyledMenuItem>
                );
              })}
            </StyledSelect>
            <button
              onClick={(e: any) => {
                //add collateral and update collaterals list
                e.preventDefault();
                let validatedErrors = validateCollateral(collateral);
                setCollateralError(validatedErrors);
                if (validatedErrors.length === 0) {
                  const c = new Map();
                  collaterals.forEach((value, key) => {
                    c.set(key, value);
                  });
                  c.set(collateralToken, collateral);
                  setCollaterals(c);
                  setCollateral("");
                }
              }}
            >
              <SvgIcon>
                <PlusSolid />
              </SvgIcon>
            </button>
          </label>
        </div>
        {collateralError ? <div className="error">{collateralError}</div> : null}
        <div className="collaterals">
          {tokens.map(value => {
            //display collaterals
            if (collaterals.has(value)) {
              return (
                <div key={value} className="item-card">
                  <span>{`${collaterals.get(value)} ${value}`}</span>
                  <span
                    className="clickable"
                    onClick={() => {
                      const c = new Map();
                      collaterals.forEach((value: string, key: string) => {
                        c.set(key, value);
                      });
                      c.delete(value);
                      setCollaterals(c);
                    }}
                  >
                    ✕
                  </span>
                </div>
              );
            } else return null;
          })}
        </div>
        <p>{`Max available is ${pool.Deposited} ${pool.LendingToken}`}</p>
        {isBorrowNOK !== "" ? <div className={"error"}> {isBorrowNOK} </div> : null}
        <div className="buttons">
          <button onClick={handleSubmit} disabled={disableSubmit}>
            Borrow
          </button>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
}
