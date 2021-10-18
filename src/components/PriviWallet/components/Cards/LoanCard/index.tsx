import React from "react";

import { loanCardStyles } from "./index.styles";
import { Color, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import Moment from "react-moment";
import cls from "classnames";

const LoanCard = ({ loan, index }) => {
  const classes = loanCardStyles();

  const handleAddCollateral = () => {};

  return (
    <Box className={classes.loanCard}>
      <Box className={cls(classes.flexBox, classes.header)}>
        <Box>
          <b>Loan</b> #<b>{index + 1}</b> <Moment format={"MMMM DD, YYYY"}>{loan?.date ?? new Date()}</Moment>
        </Box>
        <Box className={classes.paybackBox}>
          <span>Payback Loan</span>
        </Box>
      </Box>
      <Box className={classes.flexBox} mt={2}>
        <Box width={1}>
          <Box className={classes.header1}>Collateral Amount</Box>
          <Box className={classes.header2}>
            {loan?.collateral?.toFixed(4) ?? "N/A"} {loan?.token ?? "BTC"}
          </Box>
        </Box>
        <Box width={1}>
          <Box className={classes.header1}>Loan Amount</Box>
          <Box className={classes.header2}>
            {loan?.amount?.toFixed(4) ?? "N/A"} {loan?.token ?? "BTC"}
          </Box>
        </Box>
      </Box>
      <Box className={classes.flexBox} mt={1}>
        <Box width={1}>
          <Box className={classes.header1}>Liquidation CCR</Box>
          <Box className={classes.header3}>{loan?.liquidationCCR ? loan?.liquidationCCR * 100 : "N/A"}%</Box>
        </Box>
        <Box className={loan?.liveCCR <= loan?.liquidationCCR ? classes.red : undefined} width={1}>
          <Box className={classes.header1}>Live CCR</Box>
          <Box className={classes.header3}>{loan?.liveCCR ? loan?.liveCCR * 100 : "N/A"}%</Box>
        </Box>
      </Box>
      {loan?.liveCCR <= loan?.liquidationCCR && (
        <Box className={classes.collateralBox} mt={1}>
          <Box className={classes.flexBox}>
            <img src={require("assets/icons/info_red.png")} width="18px" />
            <Box
              className={classes.header1}
              color={`${Color.Black} !important`}
              ml={"12px"}
              mb={"0px !important"}
            >
              Add Collateral to avoid liquidation
            </Box>
          </Box>
          <PrimaryButton size="small" onClick={handleAddCollateral}>
            Add Collateral
          </PrimaryButton>
        </Box>
      )}
    </Box>
  );
};

export default LoanCard;
