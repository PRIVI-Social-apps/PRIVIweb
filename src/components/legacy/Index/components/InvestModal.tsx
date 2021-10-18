import { Modal } from "@material-ui/core";
import React, { useState } from "react";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
//import URL from 'shared/functions/getURL';
//import { useTypedSelector } from 'store/reducers/Reducer';
//import axios from 'axios';
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "./InvestModal.css";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

/*NOTES: atm considering a index object gotten from props with: {
        id: string,
        name: string,
        shares: number,
        returnType: string,
        assets: string[],
        performanceAllTime: string,
        performanceMonth: string,
        sharePrice: string
  }

  and the user data (also passed via props), where we need the balances
  balances: [
    {
      tokenName:stirng
      balance: number
    }
  ]
  check sampleUserData and sampleIndexesData in sampleData.js to see an example*/

//TODO: get user balances
//TODO: get equivalence list for balance tokens
//TODO: get index data

export default function InvestModal(props) {
  //const user = useTypedSelector((state) => state.user);

  const [quantity, setQuantity] = useState<string>("");
  const [paymentToken, setPaymentToken] = useState<string>(props.userData.balances[0].tokenName);
  const [availableBalance, setAvailableBalance] = useState<number>(props.userData.balances[0].amount);
  const [equivalence, setEquivalence] = useState<string>("1");
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = React.useState<any>("");

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  const handleInvest = () => {
    let values = { quantity };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);

    if (Object.keys(validatedErrors).length === 0) {
      setDisableSubmit(true);

      //TODO: Invest
      //and refresh index page
      setDisableSubmit(false);
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

  const updateTotalPrice = (quantity, equivalence) => {
    if (quantity && equivalence) {
      setTotalPrice(Number(equivalence) * Number(quantity));
    } else setTotalPrice(0);
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-content white-inputs w50 invest-modal">
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className="title">
          <h2>{`Invest into ${props.index.name}`}</h2>
          <div className="balance">
            <p>
              <span>Balance</span>
              <span>
                {availableBalance} {paymentToken}
              </span>
            </p>
          </div>
        </div>
        <div className="info">
          <div>
            <p>Share price</p>
            <h3>{props.index.sharePrice ? `${props.index.sharePrice.toFixed(0)} PRIVI` : "N/A"}</h3>
          </div>
          <div>
            <p>Daily Returns</p>
            <h4>{props.index.dailyReturns ? `${props.index.dailyReturns.toFixed(2)} PRIVI` : "N/A"}</h4>
          </div>
          <div>
            <p>Weekly Returns</p>
            <h4>{props.index.weeklyReturns ? `${props.index.weeklyReturns.toFixed(2)} PRIVI` : "N/A"}</h4>
          </div>
          <div>
            <p>Monthly Returns</p>
            <h4>{props.index.monthlyReturns ? `${props.index.monthlyReturns.toFixed(2)} PRIVI` : "N/A"}</h4>
          </div>
        </div>
        <label>
          <InputWithLabelAndTooltip
            labelName="Quantity"
            tooltip={''}
            required
            inputValue={quantity}
            type="number"
            onInputValueChange={v => {
              setQuantity(v.target.value);
              updateTotalPrice(v.target.value, equivalence);
            }}
          />
        </label>
        <div className="inputs-row-two w65 bottom-align">
          <label>
            <p>
              Payment type
              <span>
                <img className="info-icon" src={require(`assets/icons/info_icon.png`)} alt={"info"} />
              </span>
            </p>
            <StyledSelect
              className="white-select"
              disableUnderline
              name="token name"
              value={paymentToken}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setPaymentToken(event.target.value as string);

                let tokenObject = props.userData.balances.find(obj => {
                  return obj.tokenName === event.target.value;
                });

                setAvailableBalance(tokenObject.balance);

                //TODO: set real equivalence
                setEquivalence("0.01");
                updateTotalPrice(quantity, "0.01");
              }}
              required
            >
              {props.userData.balances.map(balance => {
                return (
                  <StyledMenuItem value={balance.tokenName} key={`${balance.tokenName}-payment`}>
                    {balance.tokenName} {balance.balance}
                  </StyledMenuItem>
                );
              })}
            </StyledSelect>
          </label>
          <label>
            <InputWithLabelAndTooltip
              inputValue={`1 ${paymentToken} = ${equivalence} ${paymentToken}`}
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
          <button onClick={handleInvest} disabled={disableSubmit}>
            Invest
          </button>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
}
