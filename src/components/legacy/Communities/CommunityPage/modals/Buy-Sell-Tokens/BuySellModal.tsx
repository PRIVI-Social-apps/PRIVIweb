import React, { useEffect, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import { Dialog, Grid } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "./InvestModal.css";
import { CustomWalletSelector } from "shared/ui-kit/Styled-components/StyledComponents";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const arrowUp = require("assets/icons/arrow_up_white.png");
const infoIcon = require("assets/icons/info_icon.png");

export default function BuySellModal(props) {
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  //set to true when we don't want the user to perform certain actions
  //to make sure the data is fully updated before doing anyting

  const [wallet, setWallet] = useState<string>("PRIVI Wallet");
  const [fromName, setFromName] = useState<string>("");
  const [fundingQuantity, setFundingQuantity] = useState<string>("0");
  const [toName, setToName] = useState<string>("");
  const [toFundingQuantity, setToFundingQuantity] = useState<string>("0");
  const [podQuantity, setPodQuantity] = useState<string>("");

  const [fee, setFee] = useState<number>(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = React.useState<any>("");

  const handleBuy = async () => { };

  const handleSell = async () => { };

  const handleWalletChange = wallet => {
    setWallet(wallet);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
      fullWidth
      maxWidth="md"
    >
      <div className="modal-content">
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>

        <div
          className="title"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: "16px",
          }}
        >
          {props.modalType === "buy" ? "Invest Into" : "Sell Tokens"}
          <CustomWalletSelector onChange={handleWalletChange} />
        </div>

        <Grid
          container
          spacing={2}
          className="square-container"
          style={{
            width: "100%",
            height: "unset",
            justifyContent: "space-between",
            background: "none",
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          <Grid item xs={12} sm={6}>
            <InputWithLabelAndTooltip
              labelName={`From`}
              tooltip={""}
              inputValue={fromName}
              type={"text"}
              onInputValueChange={e => {
                setFromName(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputWithLabelAndTooltip
              labelName={`Quantity`}
              tooltip={""}
              inputValue={fundingQuantity}
              minValue="0"
              type={"number"}
              onInputValueChange={e => {
                setFundingQuantity(e.target.value);
              }}
            />
          </Grid>
        </Grid>

        <div className="iconModalSwapDiv" style={{ marginTop: "12px" }}>
          <div
            className="plusMiddleIconModalSwap"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              padding: "8px",
              background: "#64c89e",
            }}
          >
            <img src={arrowUp} style={{ width: "100%", height: "100%" }} alt={"arrow up"} />
          </div>
        </div>

        <Grid
          container
          spacing={2}
          className="square-container"
          style={{
            width: "100%",
            height: "unset",
            justifyContent: "space-between",
            background: "none",
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          <Grid item xs={12} sm={6}>
            <InputWithLabelAndTooltip
              labelName={`To`}
              tooltip={""}
              inputValue={toName}
              type={"text"}
              onInputValueChange={e => {
                setToName(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputWithLabelAndTooltip
              labelName={`Quantity`}
              tooltip={""}
              inputValue={toFundingQuantity}
              minValue="0"
              type={"number"}
              onInputValueChange={e => {
                setToFundingQuantity(e.target.value);
              }}
            />
          </Grid>
        </Grid>
        <div className="footerAddLiquidityModal" style={{ marginLeft: 0 }}>
          <div className="firstColFooterAddLiquidityModal" style={{ width: "50%" }}>
            <div
              className="estimateGasFeeAddLiquidityModal"
              style={{ border: "none", background: "none", borderTop: "1px solid", borderRadius: 0 }}
            >
              <div className="estimateGasFeeLabelAddLiquidityModal" style={{ width: "100%" }}>
                Estimated Gas fee
              </div>
              <div className="estimateGasFeeValueAddLiquidityModal">{fee}</div>
            </div>
          </div>
          <div className="secondColFooterAddLiquidityModal">
            <button onClick={props.modalType === "buy" ? handleBuy : handleSell} disabled={disableSubmit}>
              {props.modalType === "buy" ? "Post DAO Proposal" : "Sell"}
            </button>
          </div>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Dialog>
  );
}
