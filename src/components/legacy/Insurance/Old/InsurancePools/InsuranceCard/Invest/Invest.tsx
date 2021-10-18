import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'store/reducers/Reducer';
//import AlertMessage from "../../AlertMessage";
import { Modal } from '@material-ui/core';

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';

export default function Invest(props: any) {
  //const user = useTypedSelector((state) => state.user);
  const user = useTypedSelector((state) => state.user);
  const availableTokens = user.availableTokens;

  const [amount, setAmount] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  //const [status, setStatusBase] = React.useState<any>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let values = { amount };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);
    if (Object.keys(validatedErrors).length === 0) {
      console.log('no errors, send invest request now');
      //TODO: invest to props.pool
    }
  };

  function validate(values: {
    [key: string]: string;
  }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};

    if (values.amount === null || !Number.parseInt(values.amount)) {
      errors.amount = 'invalid amount';
    } else if (Number.parseFloat(values.amount) < 0)
      errors.amount = 'amount cant be negative';
    else if (Number.parseFloat(values.amount) > 3000)
      errors.amount = 'amount cant surpass 3000';

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
      <div className="modal-box invest-modal invest-insurance">
        <span className="close-button cursor-pointer" onClick={props.handleClose}>
          <SvgIcon><CloseSolid /></SvgIcon>
        </span>
        <h3>INVEST</h3>
        <form onSubmit={handleSubmit}>
          <div className="container">
            <div className="v">
              <label>
                Amount:
                <InputWithLabelAndTooltip
                  overriedClasses="balance-input"
                  type="number"
                  inputValue={amount}
                  onInputValueChange={(v) => setAmount(v.target.value)}
                  required
                />
              </label>
              {errors.amount ? (
                <div className="error">{errors.amount}</div>
              ) : null}
            </div>
            <label className="select-token">
              <select
                name="token"
                value={token}
                id="token"
                onChange={(v) => setToken(v.target.value)}
                required
              >
                {availableTokens.map((token: string) => {
                  return (
                    <option value={token} key={token}>
                      {token}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <div className={'container marginTopDown10px'}>
            <button type="submit">APPLY</button>
          </div>
        </form>

        {/*status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : (
          ''
        )*/}
      </div>
    </Modal>
  );
} // Deposit
