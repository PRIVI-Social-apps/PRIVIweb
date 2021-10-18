import React, { useState } from "react";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { BlockchainNets } from "shared/constants/constants";
import { BTCtoPriviStyles } from "./index.styles";
import { Box, Fade, Grid, Tooltip } from "@material-ui/core";

import { PrimaryButton } from "shared/ui-kit";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";

const InfoIcon = () => {
  return (
    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <rect y="0.728027" width="12" height="12" rx="6" fill="#9276FF" />
        <path
          d="M5.5 9.61693C5.5 9.89308 5.72386 10.1169 6 10.1169C6.27614 10.1169 6.5 9.89308 6.5 9.61693H5.5ZM6.5 6.06136C6.5 5.78522 6.27614 5.56136 6 5.56136C5.72386 5.56136 5.5 5.78522 5.5 6.06136H6.5ZM5.5 4.73358C5.5 5.00972 5.72386 5.23358 6 5.23358C6.27614 5.23358 6.5 5.00972 6.5 4.73358H5.5ZM6.5 4.72803C6.5 4.45188 6.27614 4.22803 6 4.22803C5.72386 4.22803 5.5 4.45188 5.5 4.72803H6.5ZM6.5 9.61693V6.06136H5.5V9.61693H6.5ZM6.5 4.73358V4.72803H5.5V4.73358H6.5Z"
          fill="white"
        />
      </g>
    </svg>
  );
};

//TODOS:
//1. get rate
//2. update issuance and liquidation CCR when changing the values
//3. complete transaction (handleProceed)

export default function BTCtoPrivi() {
  const width = useWindowDimensions().width;
  const classes = BTCtoPriviStyles();

  const [collateral, setCollateral] = useState<number>(0);
  const [loan, setLoan] = useState<number>(0);
  const [blockChain, setBlockChain] = useState<any>(BlockchainNets[0].name);

  const [rate, setRate] = useState<string>("1 BTC/768 PRIVI");
  const [issuanceCCR, setIssuanceCCR] = useState<number>(0);
  const [liquidationCCR, setLiquidationCCR] = useState<number>(0);

  const [address, setAddress] = useState<string>("");

  const handleProceed = () => {};

  return (
    <div className={classes.blueBox}>
      <img className={classes.moneyTree} src={require("assets/icons/moneytree_2.png")} alt="moneytree" />

      <Grid container spacing={2}>
        <Grid item xs={6} sm={4} md={3}>
          <InputWithLabelAndTooltip
            labelName={"Collateral"}
            overriedClasses={classes.input}
            type="number"
            inputValue={collateral}
            minValue={0}
            endAdornment={<img src={require(`assets/tokenImages/BNB.png`)} width={36} height={36} />}
            onInputValueChange={e => {
              setCollateral(Number(e.target.value));
            }}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <InputWithLabelAndTooltip
            labelName={"Loan"}
            overriedClasses={classes.input}
            type="number"
            inputValue={loan}
            minValue={0}
            endAdornment={<img src={require(`assets/tokenImages/COMP.png`)} width={36} height={36} />}
            onInputValueChange={e => {
              setLoan(Number(e.target.value));
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <label>Blockchain</label>
          <TokenSelect
            networks
            tokens={BlockchainNets}
            className={classes.select}
            value={blockChain}
            onChange={v => {
              v => setBlockChain(v.target.value);
            }}
          />
        </Grid>

        {width >= 960 && (
          <Grid item xs={4} md={4}>
            <InputWithLabelAndTooltip
              labelName={"Deposit Address"}
              overriedClasses={classes.input}
              type="text"
              inputValue={address}
              onInputValueChange={e => {
                setAddress(e.target.value);
              }}
            />
          </Grid>
        )}

        <Grid item xs={6} sm={4} md={3}>
          <div className={classes.info}>
            <Box display="flex" alignItems="center">
              Rate:
              <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                <InfoIcon />
              </Tooltip>
            </Box>
            <Box fontWeight={600}>{rate}</Box>
          </div>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <div className={classes.info}>
            <Box display="flex" alignItems="center">
              Issuance CCR:
              <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                <InfoIcon />
              </Tooltip>
            </Box>
            <Box>{issuanceCCR ? issuanceCCR * 100 : 0}%</Box>
          </div>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <div className={classes.info}>
            <Box display="flex" alignItems="center">
              Liquidation CCR:
              <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                <InfoIcon />
              </Tooltip>
            </Box>
            <Box fontWeight={600}>{liquidationCCR ? liquidationCCR * 100 : 0}%</Box>
          </div>
        </Grid>
        {width < 960 && (
          <Grid item xs={12} sm={6}>
            <InputWithLabelAndTooltip
              labelName={"Deposit Address"}
              overriedClasses={classes.input}
              type="text"
              inputValue={address}
              onInputValueChange={e => {
                setAddress(e.target.value);
              }}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={5}>
          <PrimaryButton
            size="medium"
            onClick={handleProceed}
            style={{
              boxShadow: "0px 20px 21px #381DA0",
              width: width >= 960 ? "80%" : "100%",
              height: "46px",
              marginTop: width >= 960 ? "0" : "32px",
            }}
          >
            Proceed
          </PrimaryButton>
        </Grid>
      </Grid>
    </div>
  );
}
