import React, { useState } from "react";

import { FormControl, Grid, makeStyles } from "@material-ui/core";
import { ChevronIconLeft } from "shared/ui-kit/Icons";
import { useHistory } from "react-router-dom";

import "../Governance.css";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";

const YearLabels: any[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const HourFilters: any[] = ["Monthly"];
const StakeFilters: any[] = ["All Dao"];
const DominanceFilters: any[] = ["Max", "Min"];

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
      hover: { mode: null },
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

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(5),
    height: `calc(100vh - 80px)`,
    paddingBottom: "40px",
  },
  subContainer: {
    width: "100%",
    overflowY: "auto",
    scrollbarWidth: "none",
    height: "calc(100vh - 80px)",
    paddingBottom: "40px",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  globalNumberBox: {
    marginRight: theme.spacing(3),
  },
  header1: {
    fontSize: "14px",
  },
  header2: {
    fontSize: "12px",
  },
  flexBoxHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  borderBottomContainer: {
    borderBottom: "1px solid grey",
    marginBottom: theme.spacing(2),
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: "24px",
    color: "rgb(8, 24, 49)",
    lineHeight: "33.44px",
    marginTop: "20px",
    marginBottom: "10px",
    marginRight: "20px",
  },
  graphBox: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2.5),
    border: `2px solid #18181822`,
    borderRadius: theme.spacing(2),
    height: "300px",
    margin: theme.spacing(1),
    position: "relative",
  },
  valueBox: {
    position: "absolute",
    left: "60px",
    top: "70px",
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    boxShadow: `2px 2px 12px rgba(0, 0, 0, 0.1)`,
    background: "white",
  },
  headerGovernanceBox: {
    padding: "16px 10px",
    background: "linear-gradient(97.4deg, #ff79d1 14.43%, #db00ff 79.45%)",
    borderRadius: "20px",
    color: "white",
    margin: "8px",
  },
  markImg: {
    width: theme.spacing(6),
  },
  subImg: {
    width: theme.spacing(3),
  },
  graphHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0px 16px",
  },
  select: {
    "& > div": {
      paddingBottom: "11px",
      minWidth: "120px",
    },
  },
  circleBox: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: "50%",
    marginTop: theme.spacing(1),
  },
}));

const GovernaceGraph = props => {
  const history = useHistory();
  const classes = useStyles();
  const [hoursTab, setHoursTab] = useState<string>(HourFilters[0]);
  const [stakingDao, setStakingDao] = useState<any>(StakeFilters[0]);
  const [rewardDao, setRewardDao] = useState<any>(StakeFilters[0]);
  const [dominance, setDominance] = useState<any>(DominanceFilters[0]);

  const [freeHoursConfig, setFreeHoursConfig] = useState<any>();
  const [stakeConfig, setStakeConfig] = useState<any>();
  const [rewardConfig, setRewardConfig] = useState<any>();
  const [dominanceConfig, setDominanceConfig] = useState<any>();
  const [stakingRadialConfig, setStakingRadialConfig] = useState<any>();

  React.useEffect(() => {
    const newConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newConfig.configurer = configurer;
    newConfig.config.data.labels = YearLabels;
    newConfig.config.data.datasets[0].data = [
      100, 200, 400, 500, 600, 600, 800, 1200, 3400, 2300, 6700, 8900,
    ];
    newConfig.config.data.datasets[0].backgroundColor = "#F9E373";
    newConfig.config.data.datasets[0].borderColor = "#F9E373";
    newConfig.config.data.datasets[0].pointBackgroundColor = "#F9E373";
    newConfig.config.data.datasets[0].hoverBackgroundColor = "#F9E373";
    setFreeHoursConfig(newConfig);

    const newStackConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newStackConfig.configurer = configurer;
    newStackConfig.config.data.labels = YearLabels;
    newStackConfig.config.data.datasets[0].data = [
      100, 200, 400, 500, 600, 600, 800, 1200, 3400, 2300, 6700, 8900,
    ];
    newStackConfig.config.data.datasets[0].backgroundColor = "#23D3A1";
    newStackConfig.config.data.datasets[0].borderColor = "#23D3A1";
    newStackConfig.config.data.datasets[0].pointBackgroundColor = "#23D3A1";
    newStackConfig.config.data.datasets[0].hoverBackgroundColor = "#23D3A1";
    newStackConfig.config.data.datasets[0].type = "line";
    newStackConfig.config.options.scales.xAxes[0].offset = false;
    newStackConfig.config.options.scales.yAxes[0].ticks.display = false;
    setStakeConfig(newStackConfig);

    const newRewardConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newRewardConfig.configurer = configurer;
    newRewardConfig.config.data.labels = YearLabels;
    newRewardConfig.config.data.datasets[0].data = [10, 20, 40, 55, 65, 75, 80, 120, 340, 230, 130, 125];
    newRewardConfig.config.data.datasets[0].backgroundColor = "#E113F9";
    newRewardConfig.config.data.datasets[0].borderColor = "#E113F9";
    newRewardConfig.config.data.datasets[0].pointBackgroundColor = "#E113F9";
    newRewardConfig.config.data.datasets[0].hoverBackgroundColor = "#E113F9";
    newRewardConfig.config.data.datasets[0].type = "line";
    newRewardConfig.config.options.scales.xAxes[0].offset = false;
    newRewardConfig.config.options.scales.yAxes[0].ticks.display = false;
    setRewardConfig(newRewardConfig);

    const newDominanceConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newDominanceConfig.configurer = configurer;
    newDominanceConfig.config.data.labels = YearLabels;
    newDominanceConfig.config.data.datasets[0].data = [10, 20, 40, 55, 65, 75, 80, 120, 340, 230, 130, 125];
    newDominanceConfig.config.data.datasets[0].type = "line";
    newDominanceConfig.config.data.datasets[0].backgroundColor = "#E113F9";
    newDominanceConfig.config.data.datasets[0].borderColor = "#E113F9";
    newDominanceConfig.config.data.datasets[0].pointBackgroundColor = "#E113F9";
    newDominanceConfig.config.data.datasets[0].hoverBackgroundColor = "#E113F9";

    newDominanceConfig.config.data.datasets.push(
      JSON.parse(JSON.stringify(newDominanceConfig.config.data.datasets[0]))
    );
    newDominanceConfig.config.data.datasets[1].data = [
      10, 20, 40, 55, 65, 75, 80, 120, 340, 230, 130, 125,
    ].reverse();
    newDominanceConfig.config.data.datasets[1].type = "line";
    newDominanceConfig.config.data.datasets[1].backgroundColor = "#F9E373";
    newDominanceConfig.config.data.datasets[1].borderColor = "#F9E373";
    newDominanceConfig.config.data.datasets[1].pointBackgroundColor = "#F9E373";
    newDominanceConfig.config.data.datasets[1].hoverBackgroundColor = "#F9E373";

    newDominanceConfig.config.options.scales.xAxes[0].offset = false;

    setDominanceConfig(newDominanceConfig);

    const newStakingRadial = JSON.parse(JSON.stringify(RadialConfig));
    newStakingRadial.config.data.datasets[0].labels = ["Music", "Video", "Art"];
    newStakingRadial.config.data.datasets[0].data = [114.5953, 114.5953, 114.5953];
    newStakingRadial.config.data.datasets[0].backgroundColor = ["#0FCEA6", "#FF78D3", "#F9E373"];
    setStakingRadialConfig(newStakingRadial);
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        <div
          className={classes.flexBox}
          style={{ color: "#23D0C6", cursor: "pointer " }}
          onClick={() => {
            history.goBack();
          }}
        >
          <ChevronIconLeft />
          <div style={{ marginLeft: "10px" }}>Back to Governance</div>
        </div>
        <div className={`${classes.flexBox} ${classes.borderBottomContainer}`}>
          <div className={classes.headerTitle}>Global Numbers</div>
        </div>
        <div
          className={`${classes.flexBox} ${classes.borderBottomContainer}`}
          style={{ borderBottom: "1px dashed grey" }}
        >
          <div className={classes.globalNumberBox}>
            <div className="headerLabel4">🔥 Staked</div>
            <div className="headerLabel5">USDp 8.777</div>
          </div>
          <div className={classes.globalNumberBox}>
            <div className="headerLabel4">📈 Max. Staked</div>
            <div className="headerLabel5">USDp 568.702</div>
          </div>
          <div className={classes.globalNumberBox}>
            <div className="headerLabel4">⏱️ Available Time</div>
            <div className="headerLabel5">216 hrs.</div>
          </div>
          <div className={classes.globalNumberBox}>
            <div className="headerLabel4">🏆 Accumulated Rewards</div>
            <div className="headerLabel5">USDp 1.233</div>
          </div>
          <div className={classes.globalNumberBox}>
            <div className="headerLabel4">✋ Stakers</div>
            <div className="headerLabel5">216 hrs.</div>
          </div>
          <div className={classes.globalNumberBox}>
            <div className="headerLabel4">🗳️ Proposals</div>
            <div className="headerLabel5">USDp 1.233</div>
          </div>
        </div>
        <Grid container>
          <Grid item xs={12} sm={9}>
            <div className={classes.graphBox}>
              <div className={classes.graphHeader}>
                <div className={classes.header1}>Free Hours Of Content</div>
                <FormControl variant="outlined">
                  <StyledSelect className={classes.select} value={hoursTab} onChange={v => {}}>
                    {HourFilters.map((item, index) => (
                      <StyledMenuItem key={index} value={item}>
                        {item}
                      </StyledMenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              </div>
              <div style={{ height: "100%" }}>
                {freeHoursConfig && <PrintChart config={freeHoursConfig} />}
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={3}>
            <div className={classes.headerGovernanceBox}>
              <img className={classes.markImg} src={require("assets/icons/governance.png")} />
              <div style={{ paddingBottom: "8px", borderBottom: "1px dashed white" }}>
                <div className={classes.header1}>Stake & Get Content</div>
                <div className={classes.header2}>Enjoy endless hours of content by staking PRIVI coins.</div>
              </div>
              <div style={{ marginTop: "8px" }}>
                <div className={classes.header1}>Calculate your stake</div>
                <div className="stackBox">
                  <div>
                    <div className={classes.header2}>I want to stake</div>
                    <div className="stackSubBox">
                      <div>987</div>
                      <img src={require("assets/logos/PRIVILOGO.png")} className={classes.subImg} />
                    </div>
                  </div>
                  <div style={{ marginLeft: "24px" }}>
                    <div className={classes.header2}>I will get</div>
                    <div>
                      <div className={classes.header1} style={{ marginBottom: "0px" }}>
                        89 hrs.
                      </div>
                      <div className={classes.header2}>Of content to enjoy</div>
                    </div>
                  </div>
                </div>
                <div className={classes.header2} style={{ marginTop: "8px" }}>
                  The current minimum staking period is 30 days.
                </div>
              </div>
              <button style={{ marginTop: "8px" }}>Stake PRIVI Coins Now</button>
            </div>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <div className={classes.graphBox}>
              <div className={classes.graphHeader}>
                <div className={classes.header1}>Staking</div>
                <FormControl variant="outlined">
                  <StyledSelect className={classes.select} value={stakingDao} onChange={v => {}}>
                    {StakeFilters.map((item, index) => (
                      <StyledMenuItem key={index} value={item}>
                        {item}
                      </StyledMenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              </div>
              <div style={{ height: "100%" }}>{stakeConfig && <PrintChart config={stakeConfig} />}</div>
              <div className={classes.valueBox}>
                <div className={classes.header1}>28.034 USDp</div>
                <div className={classes.header2}>+2.544 (+7%)</div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className={classes.graphBox}>
              <div className={classes.graphHeader}>
                <div className={classes.header1}>Rewards</div>
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
                <div className={classes.header2}>+2.544 (+7%)</div>
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={3}>
            <div className={classes.graphBox}>
              <div className={classes.graphHeader}>
                <div className={classes.header1}>Staking Distribution</div>
              </div>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <div style={{ height: "100%" }}>
                    {stakingRadialConfig && <PrintChart config={stakingRadialConfig} canvasHeight={400} />}
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div style={{ marginLeft: "12px", marginTop: "40px" }}>
                    {stakingRadialConfig &&
                      stakingRadialConfig.config.data.datasets[0].labels.map((item, index) => (
                        <div>
                          <div
                            className={classes.circleBox}
                            style={{
                              backgroundColor:
                                stakingRadialConfig.config.data.datasets[0].backgroundColor[index],
                            }}
                          />
                          <div
                            className={classes.header2}
                          >{`${item}: ${stakingRadialConfig.config.data.datasets[0].data[index]}`}</div>
                        </div>
                      ))}
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12} sm={9}>
            <div className={classes.graphBox}>
              <div className={classes.graphHeader}>
                <div className={classes.header1}>Dominance</div>
                <FormControl variant="outlined">
                  <StyledSelect className={classes.select} value={dominance} onChange={v => {}}>
                    {DominanceFilters.map((item, index) => (
                      <StyledMenuItem key={index} value={item}>
                        {item}
                      </StyledMenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              </div>
              <div style={{ height: "100%" }}>
                {dominanceConfig && <PrintChart config={dominanceConfig} />}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default GovernaceGraph;
