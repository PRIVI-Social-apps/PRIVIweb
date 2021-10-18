import React, { useEffect, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import { Modal } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import { updateTask } from "shared/functions/updateTask";
import "../../../legacy/Pods/Pod-Page/modals/StakeModal.css";
import {
  StyledSelect,
  StyledMenuItem,
} from "shared/ui-kit/Styled-components/StyledComponents";
import "./StakeModal.css";
import SwapModal from "../../../Swap/components/Swap-Modal/Swap-Modal";
import { signTransaction } from "shared/functions/signTransaction";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

export default function StakeModal(props) {
  const user = useTypedSelector((state) => state.user);
  const userBalances = useTypedSelector((state) => state.userBalances);

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  //set to true when we don't want the user to perform certain actions
  //to make sure the data is fully updated before doing anyting

  const [balance, setBalance] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(15);

  const [errorsMessage, setErrorMessage] = useState<string>("");
  const [status, setStatus] = React.useState<any>("");

  const [wallet, setWallet] = useState<string>("PRIVI Wallet");

  const [tokens, setTokens] = useState<any[]>([]);

  const [openSwapModal, setOpenSwapModal] = useState<boolean>(false);
  const handleOpenSwapModal = () => {
    setOpenSwapModal(true);
  };
  const handleCloseSwapModal = () => {
    setOpenSwapModal(false);
  };

  const handleWalletChange = (wallet) => {
    setWallet(wallet);
    //TODO: change into selected wallet ? i don't know if the name is enough
  };

  // get token list from backend
  useEffect(() => {
    if (tokens.length === 0 && props.open === true) {
      axios.get(`${URL()}/wallet/getCryptosRateAsList`).then((res) => {
        const resp = res.data;
        setDisableSubmit(true);
        if (resp.success) {
          const tokenList: string[] = []; // list of tokens
          const tokenRatesObj: {} = {}; // tokenRates
          const data = resp.data;
          data.forEach((rateObj) => {
            tokenList.push(rateObj.token);
            tokenRatesObj[rateObj.token] = rateObj.rate;
          });
          setTokens(tokenList); // update token list

          //get balance
          let obj: any = {};
          for (obj of Object.values(userBalances)) {
            if (obj.Token === "PRIVI") {
              setBalance(obj.Balance);
            }
          }

          console.log(userBalances);
          setDisableSubmit(false);
        } else {
          setDisableSubmit(false);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  const handleVerify = async () => {
    if (validate()) {
      const sigBody = {
        UserAddress: user.id,
        Token: "PRIVI",
        Amount: Number(quantity),
      };
      const [hash, signature] = await signTransaction(user.mnemonic, sigBody);
      let body: any = { ...sigBody };
      body.Hash = hash;
      body.Signature = signature;

      setDisableSubmit(true);
      axios.post(`${URL()}/stake/verifyProfileStaking`, body).then((res) => {
        const resp = res.data;
        setDisableSubmit(false);
        if (resp.success) {
          updateTask(user.id, "Verify your profile with test tokens")
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
        }
      });
    }
  };

  function validate() {
    if (quantity === null || !Number(quantity)) {
      setErrorMessage("invalid quantity");
      return false;
    } else if (Number(quantity) < 15) {
      setErrorMessage("quantity cant be lower than 15");
      return false;
    } else if (Number(quantity) > balance) {
      setErrorMessage("insufficient fund to verify your profile");
      return false;
    } else {
      setErrorMessage("");
      return true;
    }
  }

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-content w50 stake-modal">
        <div className="exit" onClick={props.handleClose}>
          <img
            src={require("assets/icons/x_darkblue.png")}
            alt={"x"}
          />
        </div>
        <div className="title">
          <h2>Verify Profile</h2>
          <div className="select-wallet">
            <StyledSelect
              disableUnderline
              name="type"
              className="styledWhiteTextSelect"
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
        <p className="desc">
          In order to get your Profile verified soon, you should stake at least
          15 PRIVI.
        </p>
        <div className="flexRowInputs">
          <label>
            <p>
              Stake quantity
              <span>
                <img
                  className="info-icon"
                  src={require(`assets/icons/info_icon.png`)}
                  alt={"info"}
                />
              </span>
            </p>
            <InputWithLabelAndTooltip
              type="number"
              minValue={15}
              inputValue={quantity}
              onInputValueChange={(e) => {
                setQuantity(Number(e.target.value));
              }}
            />
            <span>Balance: {balance} PRIVI</span>
          </label>
          <button onClick={handleVerify} disabled={disableSubmit}>
            Verify
          </button>
        </div>

        {errorsMessage.length > 0 ? (
          <div className="error">{errorsMessage}</div>
        ) : null}

        <div className="swap-option">
          <p>Not enough PRIVI tokens?</p>
          <button onClick={handleOpenSwapModal} disabled={disableSubmit}>
            Swap for PRIVI
          </button>
          <SwapModal
            open={openSwapModal}
            handleClose={handleCloseSwapModal}
            tokens={tokens}
            tokenTo={"PRIVI"}
          />
        </div>
        {status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : (
          ""
        )}
      </div>
    </Modal>
  );
}
