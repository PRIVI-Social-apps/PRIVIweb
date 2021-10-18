import React, { useState, useEffect, useCallback } from "react";

import { Grid } from "@material-ui/core";

import PrintChart from "shared/ui-kit/Chart/Chart";
import { useTypedSelector } from "store/reducers/Reducer";
import TransHistory from "components/PriviWallet/components/TransHistory";
import Box from "shared/ui-kit/Box";
import * as WalletAPIProvider from "shared/services/API/WalletAPI";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { transactionPageStyles } from "./index.styles";
import cls from "classnames";
import { MediaEarningsConfig } from "../HomePage/components/ChartsConfig";

const YearLabels: any[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
    gradient.addColorStop(1, `rgba(110, 108, 228, 0.4)`);
    gradient.addColorStop(0.5, `rgba(110, 108, 228, 0)`);
    config.data.datasets[index].backgroundColor = gradient;
  }

  return config;
};

const TransactionsPage = () => {
  const classes = transactionPageStyles();

  const [transactionConfig, setTransactionConfig] = useState<any>();
  const [totalBalance, setTotalBalance] = useState<Number>(28034908);

  const [status, setStatus] = useState<any>("");

  const [totalTxns, setTotalTxns] = useState<number>(23);
  const [incoming, setIncoming] = useState<number>(224);
  const [outgoing, setOutgoing] = useState<number>(22443);

  const [selectedTimeFilter, setSelectedTimeFilter] = useState<number>(3);

  useEffect(() => {
    const newTransactionConfig = JSON.parse(JSON.stringify(MediaEarningsConfig));
    newTransactionConfig.config.data.labels = YearLabels;
    newTransactionConfig.config.data.datasets[0].data = [10, 40, 65, 80, 120, 230];
    newTransactionConfig.configurer = configurer;

    setTransactionConfig(newTransactionConfig);
  }, []);

  return (
    <Box className={classes.container}>
      <Grid container spacing={3}>
        <Grid item sm={12} md={4} style={{ display: "flex", height: "auto", flexDirection: "column" }}>
          <Box
            className={classes.whiteBox}
            justifyContent="center"
            marginBottom="14px"
            padding="30px 35px 20px"
          >
            <Box className={classes.blueHeader}>Total transfered</Box>
            <Box className={classes.balance} mt={"10px"}>
              ${totalBalance?.toLocaleString() ?? 0}
            </Box>
          </Box>

          <Box className={classes.whiteBox} padding="23px 35px 28px" justifyContent="space-between">
            <div className={classes.txnRow}>
              <TotalTxnsIcon />
              <Box display="flex" flexDirection="column" alignItems="right">
                <Box className={classes.header3} mb={1}>
                  Total Txns
                </Box>
                <Box className={classes.header2}>{`$ ${
                  totalTxns?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) ?? 0
                }`}</Box>
              </Box>
            </div>

            <div className={classes.divider} />

            <div className={classes.txnRow}>
              <IncomingIcon />

              <Box display="flex" flexDirection="column" alignItems="right">
                <Box className={classes.header3} mb={1}>
                  Incoming
                </Box>
                <Box className={classes.header2}>{`$ ${
                  incoming?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) ?? 0
                }`}</Box>
              </Box>
            </div>

            <div className={classes.divider} />

            <div className={classes.txnRow}>
              <OutgoingIcon />

              <Box display="flex" flexDirection="column" alignItems="right">
                <Box className={classes.header3} mb={1}>
                  Outgoing
                </Box>
                <Box className={classes.header2}>{`$ ${
                  outgoing?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) ?? 0
                }`}</Box>
              </Box>
            </div>
          </Box>
        </Grid>
        <Grid item sm={12} md={8} style={{ display: "flex", height: "auto", flexDirection: "column" }}>
          <Box padding="26px" className={classes.whiteBox} justifyContent="space-between">
            <Box display="flex" alignItems="center" justifyContent="space-between" mb="52px">
              <Box className={classes.header1}>My Transactions In 6 Months</Box>

              <Box className={classes.timeFilters}>
                {["1D", "7D", "1M", "YTD"].map((filter, index) => (
                  <div
                    className={cls(
                      { [classes.selectedTimeFilter]: index === selectedTimeFilter },
                      classes.timeFilter
                    )}
                    onClick={() => setSelectedTimeFilter(index)}
                    key={`time-${filter}`}
                  >
                    {filter}
                  </div>
                ))}
              </Box>
            </Box>
            <Box style={{ height: "100%" }}>
              {transactionConfig && <PrintChart config={transactionConfig} canvasHeight={220} />}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box style={{ marginTop: "52px" }}>
        <TransHistory filter />
      </Box>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Box>
  );
};

const TotalTxnsIcon = () => {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="18" fill="#CBA163" fill-opacity="0.1" />
      <path
        d="M9 18C9 22.9706 13.0294 27 18 27C22.9706 27 27 22.9706 27 18C27 13.0294 22.9706 9 18 9M9 18C9 13.0294 13.0294 9 18 9M9 18H18M18 9V18M18 18L24.3555 24.3555"
        stroke="#FF8E3C"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const IncomingIcon = () => {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="18" fill="#65CB63" fill-opacity="0.1" />
      <path
        d="M18 26L18 10M18 26L12 20M18 26L24 20"
        stroke="#65CB63"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const OutgoingIcon = () => {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="18" fill="#F43E5F" fill-opacity="0.1" />
      <path
        d="M18 10L18 26M18 10L24 16M18 10L12 16"
        stroke="#F43E5F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default TransactionsPage;
