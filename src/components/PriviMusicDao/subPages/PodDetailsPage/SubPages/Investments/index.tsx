import React, { useState, useEffect } from "react";
import { FormControl, Grid, makeStyles } from "@material-ui/core";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import Box from "shared/ui-kit/Box";
import { Gradient, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import TradePodTokenModal from "components/PriviMusicDao/modals/TradePodTokenModal";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Moment from "react-moment";
import { formatNumber, generateMonthLabelsFromDate } from "shared/functions/commonFunctions";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { musicDaogGetPodPriceHistory } from "shared/services/API"

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
          title: function () { },
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

const TRANSACTIONTABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: "TYPE",
    headerAlign: "center",
  },
  {
    headerName: "TOKEN",
    headerAlign: "center",
  },
  {
    headerName: "QUANTITY",
    headerAlign: "center",
  },
  {
    headerName: "PRICE",
    headerAlign: "center",
  },
  {
    headerName: "SENDER",
    headerAlign: "center",
  },
  {
    headerName: "RECEIVER",
    headerAlign: "center",
  },
  {
    headerName: "DATE",
    headerAlign: "center",
  },
  {
    headerName: "STATUS",
    headerAlign: "center",
  },
  {
    headerName: "PRIVISCAN",
    headerAlign: "center",
  },
];

const INVESTTABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Quantity",
    headerAlign: "center",
  },
  {
    headerName: "Investment",
    headerAlign: "center",
  },
  {
    headerName: "Address",
    headerAlign: "center",
  },
  {
    headerName: "Date",
    headerAlign: "center",
  },
  {
    headerName: "Status",
    headerAlign: "center",
  },
  {
    headerName: "PRIVISCAN",
    headerAlign: "center",
  },
];

const txnTypeMap = {
  PRIVI_credit_creation: "Creation",
  PRIVI_credit_deposit: "Lent",
  PRIVI_credit_borrowing: "Borrowed",
  PRIVI_credit_collateral: "Collateral",
  PRIVI_credit_interest: "Interest",
  PRIVI_credit_withdraw: "Withdraw",
  PRIVI_credit_modified: "Modified",
  PRIVI_risk_taking: "Assume Risk",

  NFT_Pod_Selling: "Sell",
  NFT_Pod_Buying: "Buy",

  POD_Minting: "Mint",
  POD_Buying: "Buy",
};

const useStyles = makeStyles(theme => ({
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  shadowBox: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    background: Gradient.Green1,
    boxShadow: `0px 2px 14px rgba(0, 0, 0, 0.08)`,
    color: "white",
    margin: theme.spacing(1),
  },
  topHeaderLabel: {
    background: `linear-gradient(270.47deg, #D66DB2 -3.25%, #BB34D1 93.45%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  whiteBox: {
    borderRadius: theme.spacing(2),
    background: "white",
    padding: theme.spacing(4),
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
  },
  header1: {
    fontSize: "14px",
  },
  header2: {
    fontSize: "12px",
  },
  header3: {
    fontSize: "18px",
    fontWeight: 800,
  },
  flexBoxHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
  greenBox: {
    background: "rgba(218, 230, 229, 0.5)",
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    border: "0.76px solid rgba(84, 101, 143, 0.1)",
    borderRadius: theme.spacing(0.5),
  },
  graphBox: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2.5),
    border: `2px solid #18181822`,
    borderRadius: theme.spacing(2),
    margin: theme.spacing(1),
    position: "relative",
    background: "white",
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
  graphHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  select: {
    "& > div": {
      paddingBottom: "11px",
      minWidth: "120px",
    },
  },
  colorBox: {
    width: theme.spacing(0.5),
    height: theme.spacing(4.5),
    borderRadius: "2px",
  },
  circle: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#FFD43E",
    marginRight: "8px",
  },
  externalLink: {
    verticalAlign: "middle",
  },
}));

const TimRangeList: any[] = ["6 Months"];

const Investments = ({ pod, handleRefresh }) => {
  const classes = useStyles();
  const { convertTokenToUSD } = useTokenConversion();

  const [selectedTimeRange, setSelectedTimeRange] = useState<any>(TimRangeList[0]);
  const [priceChartConfig, setPriceChartConfig] = useState<any>();
  const [ownershipConfig, setOwnershipConfig] = useState<any>();
  const [transactionList, setTransactionList] = useState<any[]>([]);
  const [transactionTableData, setTransactionTableData] = useState<any[]>([]);
  const [investList, setInvestList] = useState<any[]>([]);
  const [investmentTableData, setInvestmentTableData] = useState<any[]>([]);

  const [mode, setMode] = useState<string>("invest");
  const [openBuySellModal, setOpenBuySellModal] = useState<boolean>(false);

  const [remainingTime, setRemainingTime] = useState<any>({ day: 0, hour: 0, min: 0, sec: 0 });

  // TODO: load real data for graphs
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    if (pod.Status == "FORMATION" || pod.Status == "INVESTING") {
      // load price history
      musicDaogGetPodPriceHistory(pod.PodAddress, 180).then(resp => {
        const points = resp.data;
        const prices:number[] = points.map(obj => obj.price);
        const dates:number[] = points.map(obj => obj.date);
        const labels:string[] = generateMonthLabelsFromDate(dates);
        const newRewardConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
        newRewardConfig.configurer = configurer;
        newRewardConfig.config.data.labels = labels;
        newRewardConfig.config.data.datasets[0].data = prices;
        newRewardConfig.config.data.datasets[0].backgroundColor = "#0FCEA6";
        newRewardConfig.config.data.datasets[0].borderColor = "#0FCEA6";
        newRewardConfig.config.data.datasets[0].pointBackgroundColor = "#0FCEA6";
        newRewardConfig.config.data.datasets[0].hoverBackgroundColor = "#0FCEA6";
        newRewardConfig.config.data.datasets[0].type = "line";
        newRewardConfig.config.options.scales.xAxes[0].offset = false;
        newRewardConfig.config.options.scales.yAxes[0].ticks.display = false;
        setPriceChartConfig(newRewardConfig);
      });
      // load shares distribution
      const newStakingRadial = JSON.parse(JSON.stringify(RadialConfig));
      newStakingRadial.config.data.datasets[0].labels = ["Pod Owners", "Investors", "Share & Earn"];
      newStakingRadial.config.data.datasets[0].data = [56811, 121801, 6589];
      newStakingRadial.config.data.datasets[0].backgroundColor = ["#0FCEA6", "#FF78D3", "#F9E373"];
      setOwnershipConfig(newStakingRadial);
      // load table
      const sortedList = [] as any;
      const object = {
        type: txnTypeMap["PRIVI_credit_creation"],
        Token: "BNB",
        quantity: 152.25,
        from: "0xeec9...82f8",
        to: "0xeec9...82f8",
        date: new Date(),
        id: "test",
        price: "45",
        status: "Pending",
      };
      sortedList.push(object);
      sortedList.push(object);
      sortedList.push(object);
      sortedList.push(object);
      sortedList.push(object);
      setTransactionList(sortedList);
    }
    else {
      // load table
      const sortedList = [] as any;
      const object = {
        type: txnTypeMap["PRIVI_credit_creation"],
        Token: "BNB",
        quantity: 152.25,
        from: "0xeec9...82f8",
        to: "0xeec9...82f8",
        date: new Date(),
        id: "test",
        price: "45",
        status: "Pending",
      };
      sortedList.push(object);
      sortedList.push(object);
      sortedList.push(object);
      sortedList.push(object);
      sortedList.push(object);
      setInvestList(sortedList);
    }
  }

  // funding time inverval
  useEffect(() => {
    if (pod.FundingDate && (pod.Status == "FORMATION" || pod.Status == "INVESTMENT")) {
      const intervalId = setInterval(() => {
        calculateRemainingTime();
      }, 1000)
      return () => clearInterval(intervalId);
    }
  }, [pod.FundingDate]);

  const calculateRemainingTime = () => {
    const currTimeInSec = Math.floor(Date.now() / 1000);
    const timeDiff = pod.FundingDate - currTimeInSec;
    const day = Math.floor(timeDiff / (3600 * 24));
    const hour = Math.floor((timeDiff % (day * 3600 * 24)) / 3600);
    const min = Math.floor((timeDiff % (hour * 3600)) / 60);
    const sec = Math.floor((timeDiff % 60));
    setRemainingTime({
      day,
      hour,
      min,
      sec
    })
  }

  // set buy/sell table data
  useEffect(() => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    transactionList.map(item => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: <Box>{item.type}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <img src={require(`assets/tokenImages/${item.Token}.png`)} width={24} height={24} />,
        cellAlign: "center",
      });
      row.push({
        cell: <Box>{item.quantity}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Box>{item.price}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Box color="#65CB63">{item.from}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Box color="#65CB63">{item.to}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Moment format="ddd, DD MMM-h:mm A">{item.Date}</Moment>,
        cellAlign: "center",
      });
      row.push({
        cell: (
          <Box className={classes.flexBox}>
            <Box className={classes.circle}></Box>
            {item.status}
          </Box>
        ),
        cellAlign: "center",
      });
      row.push({
        cell: (
          <Box>
            {item.id && (
              <a target="_blank" rel="noopener noreferrer" href={"https://priviscan.io/tx/" + item.id}>
                <img
                  className={classes.externalLink}
                  src={require("assets/icons/newScreen_black.svg")}
                  alt="link"
                />
              </a>
            )}
          </Box>
        ),
        cellAlign: "center",
      });
      tableData.push(row);
    });
    setTransactionTableData(tableData);
  }, [transactionList]);

  // set investment table data
  useEffect(() => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    investList.map(item => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: <Box>{item.quantity}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Box>{item.price} USD</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Box color="#65CB63">{item.from}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Moment format="ddd, DD MMM-h:mm A">{item.Date}</Moment>,
        cellAlign: "center",
      });
      row.push({
        cell: (
          <Box className={classes.flexBox}>
            <Box className={classes.circle}></Box>
            {item.status}
          </Box>
        ),
        cellAlign: "center",
      });
      row.push({
        cell: (
          <Box>
            {item.id && (
              <a target="_blank" rel="noopener noreferrer" href={"https://priviscan.io/tx/" + item.id}>
                <img
                  className={classes.externalLink}
                  src={require("assets/icons/newScreen_black.svg")}
                  alt="link"
                />
              </a>
            )}
          </Box>
        ),
        cellAlign: "center",
      });
      tableData.push(row);
    });
    setInvestmentTableData(tableData);
  }, [investList]);

  return (
    <Box>
      <Box className={classes.flexBox} justifyContent="space-between" px={1}>
        <Box className={classes.title}>Investment</Box>
        {pod.Status != "FORMATION" ?
          pod.Status == "INVESTING" ? (
            <PrimaryButton
              size="small"
              onClick={() => {
                setMode("invest");
                setOpenBuySellModal(true);
              }}
              style={{ background: Gradient.Green1 }}
              isRounded
            >
              Invest
            </PrimaryButton>
          ) : (
            <Box className={classes.flexBox} justifyContent="flex-end" px={2}>
              <SecondaryButton
                size="small"
                onClick={() => {
                  setMode("sell");
                  setOpenBuySellModal(true);
                }}
                style={{ background: "#F43E5F", border: "none" }}
                isRounded
              >
                Sell
              </SecondaryButton>
              <PrimaryButton
                size="small"
                onClick={() => {
                  setMode("buy");
                  setOpenBuySellModal(true);
                }}
                style={{ background: "#65CB63", border: "none" }}
                isRounded
              >
                Buy
              </PrimaryButton>
            </Box>
          ) : null}
      </Box>
      {pod.status == "INVESTING" ? (
        // {pod.Status == "FORMATION" || pod.status == "INVESTING" ? (
        <Box>
          <Box className={classes.whiteBox} mt={2} mx={1}>
            <Box className={classes.flexBox} justifyContent="space-between">
              <Box>
                <Box className={classes.header2}>Token price</Box>
                <Box className={classes.header3} mt={1}>
                  {formatNumber(convertTokenToUSD(pod.FundingToken ?? "PRIVI", pod.FundingTokenPrice ?? 0), "USD", 4)}
                </Box>
              </Box>
              <Box>
                <Box className={classes.header2}>Funds raised </Box>
                <Box className={classes.header3} mt={1}>
                  {formatNumber(convertTokenToUSD(pod.FundingToken ?? "PRIVI", pod.RaisedFunds ?? 0), "USD", 4)}
                </Box>
              </Box>
              <Box className={classes.header2}>Supply already sold</Box>
              <Box className={classes.flexBox}>
                <Box className={classes.header2}>{pod.SupplyReleased}/</Box>
                <Box className={classes.header3}>{pod.FundingTarget ?? 0} {pod.TokenSymbol}</Box>
              </Box>
            </Box>
            <Box className={classes.flexBox} justifyContent="space-between" mt={2}>
              <Box className={classes.header2}>Time to finish funding</Box>
              <Box className={classes.flexBox}>
                <Box className={classes.greenBox}>{remainingTime.day} Day{remainingTime.day > 1 ? "s" : ""}</Box>
                <Box className={classes.greenBox} ml={1} color="#65CB63">
                  {remainingTime.hour} h
                </Box>
                <Box className={classes.greenBox} ml={1} color="#65CB63">
                  {remainingTime.min} min
                </Box>
                <Box className={classes.greenBox} ml={1} color="#65CB63">
                  {remainingTime.sec} s
                </Box>
              </Box>
            </Box>
          </Box>
          <Box mt={2} px={1}>
            <CustomTable headers={INVESTTABLEHEADER} rows={investmentTableData} theme="transaction" />
          </Box>
        </Box>
      ) : (
        <Box>
          <Grid container>
            <Grid item xs={12} sm={4}>
              <Box className={classes.shadowBox}>
                <Box className={classes.header1}>Market Cap</Box>
                <Box className={classes.title} mt={1}>
                  {formatNumber(convertTokenToUSD(pod.FundingToken, pod.Price), "USD", 4)}
                </Box>
              </Box>
              <Box className={classes.graphBox}>
                <Box className={classes.graphHeader}>
                  <Box className={classes.header1}>Shares Distribution</Box>
                </Box>
                <Grid container style={{ marginTop: "16px" }}>
                  <Grid item xs={12} sm={6}>
                    {ownershipConfig && <PrintChart config={ownershipConfig} canvasHeight={250} />}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box style={{ marginLeft: "12px" }}>
                      {ownershipConfig &&
                        ownershipConfig.config.data.datasets[0].labels.map((item, index) => (
                          <Box className={classes.flexBox} mb={2} key={"labels-" + index}>
                            <Box
                              className={classes.colorBox}
                              style={{
                                background:
                                  ownershipConfig.config.data.datasets[0].backgroundColor[index],
                              }}
                            />
                            <Box ml={2}>
                              <Box className={classes.header2}>{item}</Box>
                              <Box className={classes.header1}>
                                ${ownershipConfig.config.data.datasets[0].data[index]}
                              </Box>
                            </Box>
                          </Box>
                        ))}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Box className={classes.graphBox} height="400px">
                <Box className={classes.graphHeader}>
                  <Box className={classes.header1}>Price History</Box>
                  <FormControl variant="outlined">
                    <StyledSelect className={classes.select} value={selectedTimeRange} onChange={v => { }}>
                      {TimRangeList.map((item, index) => (
                        <StyledMenuItem key={index} value={item}>
                          {item}
                        </StyledMenuItem>
                      ))}
                    </StyledSelect>
                  </FormControl>
                </Box>
                <Box style={{ height: "100%" }}>{priceChartConfig && <PrintChart config={priceChartConfig} />}</Box>
                <Box className={classes.valueBox}>
                  <Box className={classes.header1}>$4,28,034</Box>
                  <Box className={classes.header2} color="#0FCEA6">
                    +2.544 (+7%)
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box mt={2} px={1}>
            <CustomTable headers={TRANSACTIONTABLEHEADER} rows={transactionTableData} theme="transaction" />
          </Box>
        </Box>
      )}
      {openBuySellModal && (
        <TradePodTokenModal
          open={openBuySellModal}
          mode={mode}
          setMode={setMode}
          pod={pod}
          handleClose={() => setOpenBuySellModal(false)}
          handleRefresh={handleRefresh}
        />
      )}
    </Box>
  );
};

export default Investments;
