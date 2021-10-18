import React, { useEffect, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import { updateTask } from "shared/functions/updateTask";
import axios from "axios";
import URL from "shared/functions/getURL";
import { Modal } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import { trackPromise } from "react-promise-tracker";
import { signTransaction } from "shared/functions/signTransaction";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

export default function LoanModal(props) {
  const pool: any = props.pool;

  const user = useTypedSelector(state => state.user);
  const [userBalance, setUserBalance] = useState<Number>(0);

  const [amount, setAmount] = useState<string>("");
  const [isAmountNOK, setIsAmountNOK] = useState<string>("");

  const [status, setStatus] = React.useState<any>("");

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  // reset fields after operation completed
  const resetFields = () => {
    setAmount("");
    setStatus("");
  };

  // Check lended amount not surpassing credit cap
  const handleSubmit = async () => {
    if (amount === "") {
      setIsAmountNOK("Please fill in the amount");
    } else if (pool.Deposited + Number(amount) > pool.MaxFunds) {
      setIsAmountNOK(`Lend amount is higher \n than the funding capitalisation`);
    } else if (Number(amount) > userBalance) {
      setIsAmountNOK(`Lend amount is higher \n than your wallet balance of ${pool.LendingToken}`);
    } else {
      // when validation passed
      setDisableSubmit(true);
      const body: any = {
        CreditAddress: pool.CreditAddress,
        Address: user.id,
        Amount: Number(amount),
      };
      const [hash, signature] = await signTransaction(user.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;
      trackPromise(
        axios
          .post(`${URL()}/priviCredit/depositFunds`, body)
          .then(res => {
            const resp = res.data;
            if (resp.success) {
              updateTask(user.id, "Lend test tokens to 1 Credit Pool");
              setStatus({
                msg: "credit lending success",
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
                msg: "credit lending failed",
                key: Math.random(),
                variant: "error",
              });
            }
            setDisableSubmit(false);
          })
          .catch(async err => {
            console.log("Error in LoanModal.tsx -> handleSubmit() : ", err);
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

  useEffect(() => {
    if (
      props.pool &&
      props.userBalances &&
      Object.keys(props.pool).length !== 0 &&
      Object.keys(props.userBalances).length !== 0 &&
      props.pool.LendingToken
    ) {
      const newBalance = props.userBalances[pool.LendingToken].Amount;
      if (newBalance) setUserBalance(newBalance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

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
          <h2>Loan</h2>
        </div>
        <label>
          {`Quantity (Available ${userBalance.toFixed(2)} ${pool.LendingToken ? pool.LendingToken : "Tokens"
            })`}
          <InputWithLabelAndTooltip
            type="number"
            inputValue={amount}
            placeHolder="0.00"
            onInputValueChange={e => setAmount(e.target.value)}
            required
          />
        </label>
        {isAmountNOK !== "" ? <div className={"error"}> {isAmountNOK} </div> : null}
        <p>{`Current deposit is ${pool.Deposited} ${pool.LendingToken}`}</p>
        <p>{`Max funding is ${pool.MaxFunds} ${pool.LendingToken}`}</p>
        <div className="buttons">
          <button onClick={handleSubmit} disabled={disableSubmit}>
            Loan
          </button>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
}
