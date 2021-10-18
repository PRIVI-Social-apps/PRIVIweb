import React, { useState, useEffect } from "react";

import { Grid } from "@material-ui/core";

import PrintChart from "shared/ui-kit/Chart/Chart";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import TransHistory from "components/PriviWallet/components/TransHistory";
import { homepageStyles } from "./index.styles";
import Box from "shared/ui-kit/Box";
import MyTokensList from "components/PriviWallet/components/MyTokens";
import { useHistory } from "react-router-dom";
import { MediaEarningsConfig, AssetsConfig } from "./components/ChartsConfig";
import cls from "classnames";

const YearLabels: any[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
    gradient.addColorStop(1, `rgba(110, 108, 228, 0.4)`);
    gradient.addColorStop(0.5, `rgba(110, 108, 228, 0)`);
    config.data.datasets[index].backgroundColor = gradient;
  }

  return config;
};

const HomePage = () => {
  const classes = homepageStyles();
  const history = useHistory();

  const [assetsRadialConfig, setAssetsRadialConfig] = useState<any>(AssetsConfig);
  const [totalBalance, setTotalBalance] = useState<number>(28034908);
  const [walletTopBoxFlag, setWalletTopBoxFlag] = useState(true);
  const [dominanceConfig, setDominanceConfig] = useState<any>();

  const [selectedMediaFilter, setSelectedMediaFilter] = useState<number>(0);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<number>(0);

  const [daily, setDaily] = useState<number>(23);
  const [weekly, setWeekly] = useState<number>(224);
  const [monthly, setMonthly] = useState<number>(22443);
  const [debt, setDebt] = useState<number>(0);

  useEffect(() => {
    initAssetsConfig();
    initMediaEarningsConfig();
  }, []);

  const initAssetsConfig = () => {
    //TODO: get real assets data
    /* const newAssetsConfig = JSON.parse(JSON.stringify(AssetsConfig));

    newAssetsConfig.config.data.datasets[0].type = "doughnut";

    newAssetsConfig.config.data.labels = ["CRYPTO", "FT", "NFT", "Social"];
    newAssetsConfig.config.data.datasets[0].data = [34, 34, 15.5, 12.5];
    newAssetsConfig.config.data.datasets[0].backgroundColor = ["#7472EF", "#FFC61B", "#6833FE", "#FE83D5"];

    newAssetsConfig.config.data.datasets.push(
      JSON.parse(JSON.stringify(newAssetsConfig.config.data.datasets[0]))
    );

    setAssetsRadialConfig(newAssetsConfig);*/
  };

  const initMediaEarningsConfig = () => {
    //TODO: get real assets data
    const newMediaEarningsConfig = JSON.parse(JSON.stringify(MediaEarningsConfig));
    newMediaEarningsConfig.configurer = configurer;
    newMediaEarningsConfig.config.data.labels = YearLabels;
    newMediaEarningsConfig.config.data.datasets[0].data = [
      10, 20, 40, 55, 65, 75, 80, 120, 340, 230, 130, 125,
    ];
    newMediaEarningsConfig.config.data.datasets[0].type = "line";
    newMediaEarningsConfig.config.data.datasets[0].backgroundColor = "#6E6CE4";
    newMediaEarningsConfig.config.data.datasets[0].borderColor = "#6E6CE4";
    newMediaEarningsConfig.config.data.datasets[0].pointBackgroundColor = "#6E6CE4";
    newMediaEarningsConfig.config.data.datasets[0].hoverBackgroundColor = "#6E6CE4";

    setDominanceConfig(newMediaEarningsConfig);
  };

  const handleWalletTopBoxClose = () => {
    setWalletTopBoxFlag(false);
  };

  const handleClickMyEarnings = () => {
    history.push("/privi-wallet/earnings");
  };

  const handleClickMyWallet = () => {
    history.push("/privi-wallet/manager");
  };

  const handleClickBTC = () => {
    history.push("/privi-wallet/btc");
  };

  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        <div className={classes.flexBoxHeader}>
          <div className={classes.totalBalanceBox}>
            <Box>
              <div className={classes.headerTotalBalanceTitle}>Total Balance</div>
              <div className={classes.headerTotalBalanceValue}>${totalBalance?.toLocaleString()}</div>
            </Box>

            <Box>
              <PrimaryButton size="small" onClick={handleClickMyWallet}>
                View My Wallet
              </PrimaryButton>
              <SecondaryButton size="small" onClick={handleClickMyEarnings}>
                My Media Earnings
              </SecondaryButton>
            </Box>
          </div>
          {walletTopBoxFlag && (
            <div className={`${classes.flexBox} ${classes.walletTopBox}`}>
              <img src={require("assets/icons/wallet_top_icon.png")} height="100%" />
              <div className={classes.startNowSection}>
                <div className={classes.topHeaderLabel}>
                  <b>Get Privi</b> using <b>BTC</b> as collateral
                </div>
                <PrimaryButton size="small" onClick={handleClickBTC} style={{ height: 26, marginTop: 11 }}>
                  Start Now
                </PrimaryButton>
              </div>
              <div className={classes.closeButton} onClick={handleWalletTopBoxClose}>
                <img src={require("assets/icons/x_darkblue.png")} className={classes.closeIcon} alt={"x"} />
              </div>
            </div>
          )}
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ display: "flex" }} sm={4}>
            <Box className={classes.graphBox}>
              <Box className={classes.header1}>All my assets</Box>
              <Box height="100%">
                {assetsRadialConfig && <PrintChart config={assetsRadialConfig} canvasHeight={400} />}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} style={{ display: "flex" }} sm={8}>
            <Box className={classes.graphBox}>
              <Box className={classes.header1} mb="22px">
                Media Earnings
              </Box>
              <Box display="flex" width="100%" justifyContent="space-between" mb="25px">
                <Box className={classes.mediaFilters}>
                  {["Crypto", "FTs", "Social", "NFTs"].map((filter, index) => (
                    <div
                      className={cls(
                        { [classes.selectedMediaFilter]: index === selectedMediaFilter },
                        classes.mediaFilter
                      )}
                      onClick={() => setSelectedMediaFilter(index)}
                      key={`media-${filter}`}
                    >
                      {filter}
                    </div>
                  ))}
                </Box>

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
              <Box display="flex" justifyContent="space-between" alignItems="center" mb="25px">
                <Box display="flex" alignItems="center">
                  <Box mr="46px">
                    <div className={classes.label}>Daily</div>
                    <div className={classes.value}>$ {daily?.toFixed(4)}</div>
                  </Box>
                  <Box mr="46px">
                    <div className={classes.label}>Weekly</div>
                    <div className={classes.value}>$ {weekly?.toFixed(2)}</div>
                  </Box>
                  <Box>
                    <div className={classes.label}>Monthly</div>
                    <div className={classes.value}>$ {monthly?.toFixed(2)}</div>
                  </Box>
                </Box>
                <Box>
                  <div className={classes.label}>Debt</div>
                  <div className={classes.value}>$ {debt?.toFixed(2) ?? "0.00"}</div>
                </Box>
              </Box>
              <Box style={{ height: "100%" }}>
                {dominanceConfig && <PrintChart config={dominanceConfig} canvasHeight={200} />}
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box>
          <MyTokensList />
        </Box>
        <Box style={{ marginTop: "20px" }}>
          <TransHistory />
        </Box>
      </div>
    </div>
  );
};

export default HomePage;
