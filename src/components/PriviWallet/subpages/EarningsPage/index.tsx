import React, { useState, useEffect } from "react";

import { FormControl, Grid } from "@material-ui/core";

import PrintChart from "shared/ui-kit/Chart/Chart";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import { PrimaryButton } from "shared/ui-kit";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import TransHistory from "components/PriviWallet/components/TransHistory";
import { homepageStyles } from "./index.styles";

const YearLabels: any[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const StakeFilters: any[] = ["6 Months"];

const FreeHoursChartConfig = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: "bar",
          label: "",
          data: [] as any[],
          pointRadius: 0,
          backgroundColor: "#F9E373",
          borderColor: "#F9E373",
          pointBackgroundColor: "#F9E373",
          hoverBackgroundColor: "#F9E373",
          borderJoinStyle: "round",
          borderCapStyle: "round",
          borderWidth: 3,
          cubicInterpolationMode: "monotone",
          lineTension: 0.1,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: "#F7F9FECC",
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 5,
          hoverRadius: 5,
        },
      },

      legend: {
        display: false,
      },

      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 50,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            offset: true,
            display: true,
            gridLines: {
              color: "#ffffff",
              lineWidth: 50,
            },
            ticks: {
              beginAtZero: true,
              fontColor: "#6B6B6B",
              fontFamily: "Agrandir",
            },
          },
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              color: "#EFF2F8",
            },
            ticks: {
              display: true,
              beginAtZero: true,
            },
          },
        ],
      },

      tooltips: {
        mode: "label",
        intersect: false,
        callbacks: {
          //This removes the tooltip title
          title: function () {},
          label: function (tooltipItem, data) {
            return `$${tooltipItem.yLabel.toFixed(4)}`;
          },
        },
        //this removes legend color
        displayColors: false,
        yPadding: 10,
        xPadding: 10,
        position: "nearest",
        caretSize: 10,
        backgroundColor: "rgba(255,255,255,0.9)",
        bodyFontSize: 15,
        bodyFontColor: "#303030",
      },

      plugins: {
        datalabels: {
          display: function (context) {
            return context.dataset.data[context.dataIndex] !== 0;
          },
        },
      },
    },
  },
};

const RadialConfig = {
  config: {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [] as any,
          backgroundColor: [] as any,
          hoverOffset: 0,
          labels: [] as any,
        },
      ],
    },
    options: {
      cutoutPercentage: 80,
      animation: false,
      rotation: Math.PI / 2,
      tooltips: { enabled: false },
    },
  },
};

const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
    gradient.addColorStop(1, `${config.data.datasets[index].backgroundColor}33`);
    gradient.addColorStop(0.5, `${config.data.datasets[index].backgroundColor}b0`);
    config.data.datasets[index].backgroundColor = gradient;
  }

  return config;
};

const EarningsPage = props => {
  const classes = homepageStyles();

  const [rewardDao, setRewardDao] = useState<any>(StakeFilters[0]);
  const [rewardConfig, setRewardConfig] = useState<any>();
  const [stakingRadialConfig, setStakingRadialConfig] = useState<any>();
  const [totalBalance, setTotalBalance] = useState<string>("$28,034,908");
  const [walletTopBoxFlag, setWalletTopBoxFlag] = useState(true);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());

  useEffect(() => {
    const newRewardConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newRewardConfig.configurer = configurer;
    newRewardConfig.config.data.labels = YearLabels;
    newRewardConfig.config.data.datasets[0].data = [10, 40, 65, 80, 120, 230];
    newRewardConfig.config.data.datasets[0].backgroundColor = "#0FCEA6";
    newRewardConfig.config.data.datasets[0].borderColor = "#0FCEA6";
    newRewardConfig.config.data.datasets[0].pointBackgroundColor = "#0FCEA6";
    newRewardConfig.config.data.datasets[0].hoverBackgroundColor = "#0FCEA6";
    newRewardConfig.config.data.datasets[0].type = "line";
    newRewardConfig.config.options.scales.xAxes[0].offset = false;
    newRewardConfig.config.options.scales.yAxes[0].ticks.display = false;
    setRewardConfig(newRewardConfig);

    const newStakingRadial = JSON.parse(JSON.stringify(RadialConfig));
    newStakingRadial.config.data.datasets[0].labels = ["Music", "Video", "Digital Art", "Writing"];
    newStakingRadial.config.data.datasets[0].data = [114.5953, 114.5953, 114.5953, 114.5953];
    newStakingRadial.config.data.datasets[0].backgroundColor = ["#0FCEA6", "#FF78D3", "#F9E373", "#3177FF"];
    setStakingRadialConfig(newStakingRadial);
  }, []);

  const handleWalletTopBoxClose = () => {
    setWalletTopBoxFlag(false);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        <div className={classes.flexBoxHeader}>
          <div className={classes.totalBalanceBox}>
            <div className={classes.headerTotalBalanceTitle}>Total Balance</div>
            <div className={classes.headerTotalBalanceValue}>
              {totalBalance}
              <span className={classes.headerTotalBalancePlus}>(+12%)</span>
            </div>
          </div>
          {walletTopBoxFlag && (
            <div className={`${classes.flexBox} ${classes.walletTopBox}`}>
              <img src={require("assets/icons/wallet_top_icon.png")} height="100%" />
              <div className={classes.startNowSection}>
                <div className={classes.topHeaderLabel}>
                  <b>Get Privi</b> using
                </div>
                <div className={classes.topHeaderLabel}>
                  <b>BTC</b> as collateral
                </div>
                <PrimaryButton size="small" onClick={() => {}} style={{ height: 29, marginTop: 8 }}>
                  Start Now
                </PrimaryButton>
              </div>
              <div className={classes.closeButton} onClick={handleWalletTopBoxClose}>
                <img src={require("assets/icons/x_darkblue.png")} className={classes.closeIcon} alt={"x"} />
              </div>
            </div>
          )}
        </div>
        <Grid container>
          <Grid item xs={12} sm={4}>
            <div className={classes.graphBox}>
              <div className={classes.graphHeader}>
                <div className={classes.header1}>My Media Balance</div>
              </div>
              <Grid container style={{ marginTop: "16px" }}>
                <Grid item xs={12} sm={6}>
                  <div style={{ marginBottom: "16px" }}>
                    <div className={classes.header2}>Total</div>
                    <div className={classes.header3}>$1,226,728</div>
                  </div>
                  {stakingRadialConfig && <PrintChart config={stakingRadialConfig} canvasHeight={250} />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div style={{ marginLeft: "12px" }}>
                    {stakingRadialConfig &&
                      stakingRadialConfig.config.data.datasets[0].labels.map((item, index) => (
                        <div style={{ marginBottom: "16px" }}>
                          <div className={classes.header2}>{item}</div>
                          <div className={classes.header3}>
                            ${stakingRadialConfig.config.data.datasets[0].data[index]}
                          </div>
                        </div>
                      ))}
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12} sm={8}>
            <div className={classes.graphBox}>
              <div className={classes.graphHeader}>
                <div className={classes.header1}>My Earnings</div>
                <FormControl variant="outlined">
                  <StyledSelect className={classes.select} value={rewardDao} onChange={v => {}}>
                    {StakeFilters.map((item, index) => (
                      <StyledMenuItem key={index} value={item}>
                        {item}
                      </StyledMenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              </div>
              <div style={{ height: "100%" }}>{rewardConfig && <PrintChart config={rewardConfig} />}</div>
              <div className={classes.valueBox}>
                <div className={classes.header1}>28.034 USDp</div>
                <div className={classes.header2} color="#0FCEA6">
                  +2.544 (+7%)
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        <div className={classes.transactionSection}>
          <div className={classes.flexBoxHeader}>
            <div className={classes.transactionTitle}>Transactions</div>
            <div className={classes.transactionDate}>
              <DateInput
                id="date-picker-start-date1"
                minDate={new Date()}
                format="MM.dd.yyyy"
                placeholder="Select date..."
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
          </div>
          <TransHistory />
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
