import React, { useState, useEffect } from "react";
//import { useTypedSelector } from 'store/reducers/Reducer';
//import axios from 'axios';
//import URL from 'shared/functions/getURL';
import { Modal } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import { useDispatch } from "react-redux";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

export default function InvestModal(props) {
  const dispatch = useDispatch();
  //const user = useTypedSelector((state) => state.user);

  const [balance, setBalance] = useState<number>(0); // user balance in the pod asked token

  const [amount, setAmount] = useState<string>("");
  const [invest_option, setInvestOption] = React.useState("Fabric");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = React.useState<any>("");

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  useEffect(() => {
    getBalance();
  }, []);

  const getBalance = () => {
    setDisableSubmit(true);
    //TODO: update user balance from token -> props.pool.Token

    setDisableSubmit(false);
  };

  const handleInvest = () => {
    let values = { amount };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);

    if (Object.keys(validatedErrors).length === 0) {
      //TODO: invest
      //TODO: update redux pool ? update data
    }
  };

  function validate(values: { [key: string]: string }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};

    if (values.amount === null || !Number(values.amount)) {
      errors.amount = "invalid amount";
    } else if (Number(values.amount) === 0) {
      errors.amount = "amount cant be 0";
    } else if (Number(values.amount) < 0) {
      errors.amount = "amount cant be negative";
    } else if (props.offer.price * Number(amount) > balance) {
      errors.amount = "insufficient balance to perform this operation";
    }
    return errors;
  }

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
        <div className="inputs-row-two">
          <label>
            Option
            <StyledSelect
              className="selectCreatePod"
              disableUnderline
              name="type"
              value={invest_option}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                setInvestOption(event.target.value as string)
              }
              required
            >
              <StyledMenuItem value="Fabric" key={1}>
                Fabric
              </StyledMenuItem>
              <StyledMenuItem value="Ethereum" key={2}>
                Ethereum
              </StyledMenuItem>
            </StyledSelect>
          </label>
          <label>
            Balance
            <InputWithLabelAndTooltip disabled inputValue={`${balance} ${props.pool.Token}`} type='text' />
          </label>
        </div>

        <div className="inputs-row-two">
          <label>
            Amount
            <InputWithLabelAndTooltip
              type="number"
              inputValue={amount}
              placeHolder="0.00"
              onInputValueChange={e => {
                setAmount(e.target.value);
              }}
              required
            />
            {errors.amount ? <div className="error">{errors.amount}</div> : null}
          </label>
          <label>
            Estimated fee
            <InputWithLabelAndTooltip disabled inputValue={`0`} type='text' />
          </label>
        </div>

        {invest_option === "Ethereum" ? <button>Connect to Ethereum</button> : null}

        <div className="buttons">
          <button onClick={handleInvest} disabled={disableSubmit}>
            Invest
          </button>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
}
