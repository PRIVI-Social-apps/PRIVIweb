import React, { useEffect, useState } from 'react';
import axios from 'axios';
import URL from 'shared/functions/getURL';
import { useTypedSelector } from 'store/reducers/Reducer';
import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import { Modal } from '@material-ui/core';
import { formatNumber } from "shared/functions/commonFunctions";
import { signTransaction } from "shared/functions/signTransaction";
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';

const arePropsEqual = (prevProps, currProps) => {
  return (prevProps.open == currProps.open && prevProps.offer == currProps.offer);
}

// when user wants to sell token to a buying offer of the order book
const SellModal = React.memo((props: any) => {
  const user = useTypedSelector((state) => state.user);
  const userBalances = useTypedSelector((state) => state.userBalances);

  const [amount, setAmount] = useState<string>('');
  const [status, setStatus] = React.useState<any>('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  const handleSell = async () => {
    let values = { amount };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);

    if (Object.keys(validatedErrors).length === 0) {
      setDisableSubmit(true);
      const body: any = {
        SellerAddress: user.id,
        BAddress: props.offer.trader,
        PodAddress: props.offer.podAddress,
        OrderId: props.offer.offerId,
        Amount: Number(amount),
      };
      const [hash, signature] = await signTransaction(user.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;
      axios
        .post(`${URL()}/pod/NFT/sellPodTokens`, body)
        .then((response) => {
          const resp = response.data;
          if (resp.success) {
            setStatus({
              msg: 'sell success',
              key: Math.random(),
              variant: 'success',
            });
            setDisableSubmit(false);
            setTimeout(() => {
              setAmount('');
              props.handleRefresh();
              props.handleClose();
            }, 1000);
          }
        })
        .catch((error) => {
          setDisableSubmit(false);
          console.log(error);
          setStatus({
            msg: 'sell failed',
            key: Math.random(),
            variant: 'error',
          });
          // alert('Error selling tokens');
        });
    }
  };

  function validate(values: {
    [key: string]: string;
  }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};

    if (values.amount === null || !Number(values.amount)) {
      errors.amount = 'invalid amount';
    } else if (Number(values.amount) === 0) {
      errors.amount = 'amount cant be 0';
    } else if (Number(values.amount) < 0) {
      errors.amount = 'amount cant be negative';
    } else if (!userBalances[props.podToken] || Number(amount) > userBalances[props.podToken].Balance) {
      errors.amount = 'insufficient pod tokens to perform this operation';
    }
    return errors;
  }

  const cleanInputs = () => {
    setAmount('');
    setErrors({});
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
        <div
          className="exit"
          onClick={() => {
            props.handleClose();
            cleanInputs();
          }}
        >
          <img
            src={require('assets/icons/x_darkblue.png')}
            alt={'x'}
          />
        </div>
        <div className="inputs-row-two">
          <label>
            {`Units To Sell (${formatNumber(userBalances[props.podToken] ? userBalances[props.podToken].Balance : 0, props.podToken, 0)} available)`}
            <InputWithLabelAndTooltip
              overriedClasses=""
              type="number"
              inputValue={amount}
              placeHolder="0"
              onInputValueChange={(elem) => {
                const amount = elem.target.value;
                setAmount(amount);
                if (amount > props.offer.amount) setAmount(props.offer.amount);
              }}
              required
            />
            {errors.amount ? (
              <div className="error">{errors.amount}</div>
            ) : null}
          </label>
          <label>
            Price
            <InputWithLabelAndTooltip
              overriedClasses="disabled"
              type="text"
              disabled
              inputValue={
                props.offer.price * Number(amount) + ' ' + props.offer.token
              }
            />
          </label>
        </div>
        <div className="buttons">
          <button onClick={handleSell} disabled={disableSubmit}>
            Sell
          </button>
        </div>
        {status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : (
          ''
        )}
      </div>
    </Modal>
  );
}, arePropsEqual);

export default SellModal;
