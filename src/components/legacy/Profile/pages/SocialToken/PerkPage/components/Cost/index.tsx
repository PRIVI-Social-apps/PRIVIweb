import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Accordion, AccordionSummary, AccordionDetails } from "shared/ui-kit";
import SocialTokenContext from "components/legacy/Profile/pages/SocialToken/context";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";

const useStyles = makeStyles(theme => ({
  assetPrice: {
    "& span": {
      marginLeft: "12px",
    },
  },
}));

export default function PerkCost() {
  const { selectedPerk } = useContext(SocialTokenContext);
  const { convertTokenToUSD } = useTokenConversion();

  const [usdCost, setUsdCost] = useState<any>("");

  const classes = useStyles();

  useEffect(() => {
    if (selectedPerk && selectedPerk.Cost && selectedPerk.Token && !selectedPerk.UsdCost) {
      setUsdCost(convertTokenToUSD(selectedPerk.Token, selectedPerk.Cost).toFixed(6));
    }
  }, [selectedPerk]);

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary>🤑 Redeem cost</AccordionSummary>
      <AccordionDetails>
        <div>
          <div className={classes.assetPrice}>
            {selectedPerk ? `${selectedPerk.Token ?? ""} ${selectedPerk.Cost ?? "0"}` : "N/A"}
            <span>(${selectedPerk.UsdCost ?? usdCost ?? "N/A"})</span>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
