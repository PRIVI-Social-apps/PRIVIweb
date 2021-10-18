import { Grid, makeStyles, Box } from "@material-ui/core";
import React from "react";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(4),
  },
  infoLabel: {
    fontSize: "12px !important",
    color: "grey !important",
    marginTop: "-12px !important",
  },
}));

export default function CreateDAOTokenVestingTab({ communityToken, setCommunityToken }) {
  const classes = useStyles();

  return (
    <>
      <Grid container spacing={3} direction="row" alignItems="flex-start" justify="flex-start">
        <Grid item xs={12} md={6}>
          <InputWithLabelAndTooltip
            theme="dark"
            labelName={"Immediate Allocation (%)"}
            type={"number"}
            minValue={"0"}
            inputValue={communityToken.ImmediateAllocationPct}
            onInputValueChange={elem => {
              let tokenCopy = { ...communityToken };
              tokenCopy.ImmediateAllocationPct = parseFloat(elem.target.value);
              setCommunityToken(tokenCopy);
            }}
            placeHolder={""}
            tooltip={""}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithLabelAndTooltip
            theme="dark"
            labelName={"Vested Allocation (%)"}
            type={"number"}
            minValue={"0"}
            inputValue={communityToken.VestedAllocationPct}
            onInputValueChange={elem => {
              let tokenCopy = { ...communityToken };
              tokenCopy.VestedAllocationPct = parseFloat(elem.target.value);
              setCommunityToken(tokenCopy);
            }}
            placeHolder={""}
            tooltip={""}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} direction="row" alignItems="flex-start" justify="flex-start">
        <Grid item xs={12} md={6}>
          <>
            <InputWithLabelAndTooltip
              theme="dark"
              labelName={"What's the Vesting Time?"}
              type={"number"}
              minValue={"0"}
              inputValue={communityToken.VestingTime}
              onInputValueChange={elem => {
                let tokenCopy = { ...communityToken };
                tokenCopy.VestingTime = parseFloat(elem.target.value);
                setCommunityToken(tokenCopy);
              }}
              placeHolder={""}
              tooltip={`Number of months for the vesting part portion of the allocation`}
            />
            <Box mt={1} fontSize="11px" color="white">
              Number of months for the vesting part portion of the allocation
            </Box>
          </>
        </Grid>
        <Grid item xs={12} md={6}>
          <>
            <InputWithLabelAndTooltip
              theme="dark"
              labelName={"Choose Taxation Percentage"}
              type={"number"}
              minValue={"0"}
              inputValue={communityToken.TaxationPct}
              onInputValueChange={elem => {
                let tokenCopy = { ...communityToken };
                tokenCopy.TaxationPct = parseFloat(elem.target.value);
                setCommunityToken(tokenCopy);
              }}
              placeHolder={""}
              tooltip={`Percentage charged for all trades taking place inside the community`}
            />
            <Box mt={1} fontSize="11px" color="white">
              Percentage charged for all trades taking place inside the community
            </Box>
          </>
        </Grid>
      </Grid>
    </>
  );
}
