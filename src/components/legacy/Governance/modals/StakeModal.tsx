import React, { useEffect, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import { Modal } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import { trackPromise } from "react-promise-tracker";
import "./StakeModal.css";
import {
  StyledSelect,
  StyledMenuItem,
} from "shared/ui-kit/Styled-components/StyledComponents";
import { updateTask } from "shared/functions/updateTask";
import { signTransaction } from "shared/functions/signTransaction";
import SignTransaction from "shared/ui-kit/Page-components/SignTransaction/SignTransaction";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";



const infoIcon = require("assets/icons/info_icon.png");

const propsAreSame = (prevProps, currProps) => {
  return prevProps.open === currProps.open;
};

const StakeModal = React.memo((props: any) => {
  const user = useTypedSelector((state) => state.user);
  const userBalances = useTypedSelector((state) => state.userBalances);

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  //set to true when we don't want the user to perform certain actions
  //to make sure the data is fully updated before doing anything

  let availableBalance = userBalances[props.tokenToUse]
    ? userBalances[props.tokenToUse].Balance
    : 0;

  const [wallet, setWallet] = useState<string>("PRIVI Wallet");
  const [amount, setAmount] = useState<string>("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = React.useState<any>("");

  const [mainView, setMainView] = useState<boolean>(true);  // 0 own view, 1 input mnemonic view
  const [mnemonic, setMnemonic] = useState<string>('');

  const changeView = () => {
    setMainView(!mainView);
  }

  const handleStake = async () => {
    let validatedErrors = validate({ amount });
    setErrors(validatedErrors);
    if (Object.keys(validatedErrors).length === 0) {
      changeView();
    }
  };

  const postStake = async () => {
    const sigBody = {
      UserAddress: user.id,
      Token: props.tokenToUse,
      Amount: Number(amount),
    };
    const [hash, signature] = await signTransaction(mnemonic, sigBody);
    let body: any = { ...sigBody };
    body.Hash = hash;
    body.Signature = signature;

    setDisableSubmit(true);
    trackPromise(
      axios.post(`${URL()}/stake/stakeToken`, body).then((res) => {
        const resp = res.data;
        setDisableSubmit(false);
        if (resp.success) {
          updateTask(user.id, "Stake coins in Governance");
          setStatus({
            msg: "stake success",
            key: Math.random(),
            variant: "success",
          });
          setTimeout(() => {
            props.handleRefresh();
            props.handleClose();
          }, 300);
        } else {
          setStatus({
            msg: "stake failed",
            key: Math.random(),
            variant: "error",
          });
          setMnemonic('');
        }
      })
    );
  }

  useEffect(() => {
    if (mnemonic) {
      postStake();
    }
  }, [mnemonic])

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
      errors.amount = "insufficient fund to invest";
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
      {mainView ?
        (<div className="modal-content w50 stake-modal">
          <div className="exit" onClick={props.handleClose}>
            <img
              src={require("assets/icons/x_darkblue.png")}
              alt={"x"}
            />
          </div>
          <div className="title">
            <h2>{`Staking`}</h2>
            <div className="select-wallet">
              <StyledSelect
                disableUnderline
                name="type"
                value={wallet}
                // onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                //   handleWalletChange(event.target.value as string)
                // }
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

          <div className="square-container">
            <div className="left-item left-item-no-label">
              <div className="select-wrapper disabled">
                <img
                  src={require("assets/logos/PRIVILOGO.png")}
                  alt={props.tokenToUse}
                />
                <InputWithLabelAndTooltip disabled inputValue={`${props.tokenToUse} Coins`} type='text' />
              </div>
              <div className="balance">{`Available ${availableBalance} ${props.tokenToUse}`}</div>
            </div>

            <div className="right-item">
              <InputWithLabelAndTooltip
                labelName="Amount"
                tooltip={''}
                overriedClasses="input-wrapper"
                placeHolder="Amount..."
                type="number"
                minValue={"0"}
                inputValue={amount}
                onInputValueChange={(v) => {
                  setAmount(v.target.value);
                }}
              />
              {errors.amount ? (
                <div className="error">{errors.amount}</div>
              ) : null}
            </div>
          </div>

          <button
            className="buttonSubHeaderSwapMain addLiquidityButtonSubHeaderSwapMain"
            onClick={handleStake}
            disabled={disableSubmit}
          >
            Stake
        </button>
          {status ? (
            <AlertMessage
              key={status.key}
              message={status.msg}
              variant={status.variant}
            />
          ) : (
            ""
          )}
        </div>)
        :
        <SignTransaction changeView={changeView} handleClose={props.handleClose} setMnemonic={setMnemonic} />
      }
    </Modal >
  );
}, propsAreSame);

export default StakeModal;
