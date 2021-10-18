import React, { useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import { Dialog, Box, Grid } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import "./InvestModal.css";
import { CustomWalletSelector } from "shared/ui-kit/Styled-components/StyledComponents";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const tokenTypes = ["Social", "Crypto", "FT Tokens", "NFT Tokens"];

export default function InvestModal(props) {
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  //set to true when we don't want the user to perform certain actions
  //to make sure the data is fully updated before doing anyting

  const [wallet, setWallet] = useState<string>("PRIVI Wallet");
  const [fundingQuantity, setFundingQuantity] = useState<string>("");
  const [tokenName, setTokenName] = useState<string>("");

  const [gasFee, setGasFee] = useState<number>(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = React.useState<any>("");
  const [tokenType, setTokenType] = React.useState(tokenTypes[0]);

  const handleWalletChange = wallet => {
    setWallet(wallet);
  };

  const handleInvest = async () => { };

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
          <h2>{`Send Tokens`}</h2>
          <CustomWalletSelector onChange={handleWalletChange} />
        </div>

        <label>
          Select Token type
          <div
            className="select-tokens"
            style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}
          >
            {tokenTypes.map((item, index) => (
              <Box
                key={index}
                style={{
                  padding: "16px",
                  border: "1px solid #cccccc",
                  borderRadius: "8px",
                  width: "120px",
                  textAlign: "center",
                  background: item === tokenType ? "white" : "#F7F8FA",
                  fontSize: "14px",
                }}
                onClick={() => {
                  setTokenType(item);
                }}
              >
                {item}
              </Box>
            ))}
          </div>
        </label>

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
              labelName={`Token Name`}
              tooltip={""}
              inputValue={tokenName}
              type={"text"}
              onInputValueChange={e => {
                setTokenName(e.target.value);
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
            <div style={{ marginLeft: "4px", fontSize: "12px" }}>Balance: 0.000000 KHCT</div>
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
              <div className="estimateGasFeeValueAddLiquidityModal">{gasFee}</div>
            </div>
          </div>
          <div className="secondColFooterAddLiquidityModal">
            <button onClick={handleInvest} disabled={disableSubmit}>
              Send
            </button>
          </div>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Dialog>
  );
}
