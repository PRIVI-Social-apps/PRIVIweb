import React, { useState } from "react";
import { useSocialTokenStyles } from "../..";
import PrintPriceChart from "./components/Chart/PriceChart/PriceChart";
import PriceChartConfig from "./components/Chart/PriceChart/PriceChartConfig";
import AirdropHistoryTable from "./components/AirdropHistoryTable";
import PrintAdoptionChart from "./components/Chart/AdoptionChart/AdoptionChart";
import AdoptionChartConfig from "./components/Chart/AdoptionChart/AdoptionChartConfing";
import Box from 'shared/ui-kit/Box';
import { Grid } from "@material-ui/core";

const airdropHistoryMock = [
  {
    Date: new Date().getTime() - 10000,
    From: "0x0ea6451b47fdb705dc52316b40e99b8a871b165d",
    Amount: 1.23,
    Price: 2.65,
    Id: "",
  },
  {
    Date: new Date().getTime(),
    From: "0x964DE4135F6D8079D4e23048b887317547C7deBF",
    Amount: 1.23,
    Price: 2.65,
    Id: "",
  },
  {
    Date: new Date().getTime() - 52000000,
    From: "0x9eba16f9c9e6f98246968ac575e3837c00a596c2",
    Amount: 1.23,
    Price: 2.65,
    Id: "",
  },
  {
    Date: new Date().getTime() - 20000000,
    From: "0x04f32a8eb65d2559c631eb964adc6fa23a13778a",
    Amount: 1.23,
    Price: 2.65,
    Id: "",
  },
];

export default function HistoryTab({ socialToken }) {
  const classes = useSocialTokenStyles();

  const [airdropHistory, setAirdropHistory] = useState<any>(airdropHistoryMock);
  const [adoptionHistoryData, setAdoptionHistoryData] = useState<any>(AdoptionChartConfig);
  const [priceHistoryData, setPriceHistoryData] = useState<any>(PriceChartConfig);

  return (
    <Box width="100%">
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <div className={classes.label}>Airdrop history</div>
          <Box overflow={"auto"} width={"100%"}>
            <AirdropHistoryTable airdropHistory={airdropHistory} />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className={classes.label}>Adoption history</div>
          {PrintAdoptionChart(adoptionHistoryData, socialToken.FundingToken, 0)}
        </Grid>
      </Grid>

      <div className={classes.label}>Price history</div>
      {PrintPriceChart(priceHistoryData, socialToken.FundingToken)}
    </Box>
  );
}
