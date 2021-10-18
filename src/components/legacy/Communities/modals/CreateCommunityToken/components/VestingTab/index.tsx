import { Grid, makeStyles } from "@material-ui/core";
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

export default function CreateCommunityTokenVestingTab({ communityToken, setCommunityToken }) {
  const classes = useStyles();

  function renderInputCreateModal(p) {
    return (
      <div className={classes.container}>
        <InputWithLabelAndTooltip
          labelName={p.name}
          type={p.type}
          minValue={p.min}
          inputValue={p.value ? p.value : communityToken[p.item]}
          onInputValueChange={elem => {
            let tokenCopy = { ...communityToken };
            tokenCopy[p.item] = p.type === "number" ? parseFloat(elem.target.value) : elem.target.value;
            setCommunityToken(tokenCopy);
          }}
          placeHolder={p.placeholder}
          disabled={p.disable ? true : false}
          tooltip={p.info}
        />
      </div>
    );
  }

  return (
    <div>
      <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
        <Grid item xs={12} md={6}>
          {renderInputCreateModal({
            name: "Immediate Allocation (%)",
            placeholder: "",
            type: "number",
            item: "ImmediateAllocationPct",
            info: ``,
          })}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderInputCreateModal({
            name: "Vested Allocation (%)",
            placeholder: "",
            type: "number",
            item: "VestedAllocationPct",
            info: ``,
          })}
        </Grid>
      </Grid>
      <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
        <Grid item xs={12} md={6}>
          {renderInputCreateModal({
            name: "What’s the Vesting Time?",
            placeholder: "",
            type: "number",
            item: "VestingTime",
            min: "0",
            info: `Number of months for the vesting part portion of the allocation`,
          })}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderInputCreateModal({
            name: "Choose Taxation Percentage",
            placeholder: "",
            type: "number",
            item: "TaxationPct",
            min: "0",
            info: `Percentage charged for all trades taking place inside the community`,
          })}
        </Grid>
      </Grid>
    </div>
  );
}
