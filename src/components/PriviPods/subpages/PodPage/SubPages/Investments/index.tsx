import React, { useState } from "react";

import { FormControl, Grid, makeStyles } from "@material-ui/core";

import PrintChart from "shared/ui-kit/Chart/Chart";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import { useTypedSelector } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton, Variant } from "shared/ui-kit";
import BuySellTokenModal from "components/PriviPods/modals/BuySellTokenModal";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Moment from "react-moment";

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
    headerName: 'TYPE',
  },
  {
    headerName: 'TOKEN',
  },
  {
    headerName: 'QUANTITY',
  },
  {
    headerName: 'PRICE',
  },
  {
    headerName: 'SENDER',
  },
  {
    headerName: 'RECEIVER',
  },
  {
    headerName: 'DATE',
  },
  {
    headerName: 'STATUS',
  },
  {
    headerName: 'PRIVISCAN',
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
    background: `linear-gradient(272.2deg, #7F6FFF 0.52%, #FF4ACC 108.45%)`,
    boxShadow: `0px 2px 14px rgba(0, 0, 0, 0.08)`,
    color: "white",
    margin: theme.spacing(1),
  },
  topHeaderLabel: {
    background: `linear-gradient(270.47deg, #D66DB2 -3.25%, #BB34D1 93.45%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
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
  flexBoxHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
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

const Investments = props => {
  const classes = useStyles();
  const userBalances = useTypedSelector(state => state.userBalances);

  const [rewardDao, setRewardDao] = useState<any>(StakeFilters[0]);

  const [rewardConfig, setRewardConfig] = useState<any>();
  const [stakingRadialConfig, setStakingRadialConfig] = useState<any>();

  const [totalBalance, setTotalBalance] = useState<Number>(28034908);

  const [openBuySellModal, setOpenBuySellModal] = useState<boolean>(false);
  const [isBuy, setIsBuy] = useState<boolean>(props.buyMode ?? false);

  const [transactionList, setTransactionList] = React.useState<any[]>([]);

  React.useEffect(() => {
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
    newStakingRadial.config.data.datasets[0].labels = ["Pod Owners", "Investors", "Share & Earn"];
    newStakingRadial.config.data.datasets[0].data = [56811, 121801, 6589];
    newStakingRadial.config.data.datasets[0].backgroundColor = ["#0FCEA6", "#FF78D3", "#F9E373"];
    setStakingRadialConfig(newStakingRadial);

    const sortedList = [] as any;
    const object = {
      type: txnTypeMap["PRIVI_credit_creation"],
      Token: "BNB",
      quantity: 152.25,
      from: "0xeec9...82f8",
      to: "0xeec9...82f8",
      date: new Date(),
      id: "test",
      chain: "Substrate",
      price: "45",
      status: "Pending",
    };
    sortedList.push(object);
    sortedList.push(object);
    sortedList.push(object);
    sortedList.push(object);
    sortedList.push(object);
    setTransactionList(sortedList);
  }, []);

  const getTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    transactionList.map(item => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box>{item.type}</Box>
        ),
      });
      row.push({
        cell: (
          <img src={require(`assets/tokenImages/${item.Token}.png`)} width={24} height={24} />
        ),
      });
      row.push({
        cell: (
          <Box>{item.quantity}</Box>
        ),
      });
      row.push({
        cell: (
          <Box>{item.price}</Box>
        ),
      });
      row.push({
        cell: (
          <Box color="#7F6FFF">{item.from}</Box>
        ),
      });
      row.push({
        cell: (
          <Box color="#7F6FFF">{item.to}</Box>
        ),
      });
      row.push({
        cell: (
          <Moment format="ddd, DD MMM-h:mm A">{item.Date}</Moment>
        ),
      });
      row.push({
        cell: (
          <Box className={classes.flexBox}>
            <Box className={classes.circle}></Box>
            {item.status}
          </Box>
        ),
      });
      row.push({
        cell: (
          <Box>{item.id && (
            <a target="_blank" rel="noopener noreferrer" href={"https://priviscan.io/tx/" + item.id}>
              <img
                className={classes.externalLink}
                src={require("assets/icons/newScreen.svg")}
                alt="link"
              />
            </a>
          )}</Box>
        ),
      });
      tableData.push(row);
    });

    return tableData;
  }

  return (
    <Box>
      <Box className={classes.flexBox} justifyContent="flex-end" px={2}>
        <SecondaryButton
          size="small"
          onClick={() => {
            setIsBuy(false);
            setOpenBuySellModal(true);
          }}
        >
          Sell
        </SecondaryButton>
        <PrimaryButton
          size="small"
          onClick={() => {
            setIsBuy(true);
            setOpenBuySellModal(true);
          }}
        >
          Buy
        </PrimaryButton>
      </Box>
      <Grid container>
        <Grid item xs={12} sm={4}>
          <Box className={classes.shadowBox}>
            <Box className={classes.header1}>Market Cap</Box>
            <Box className={classes.title} mt={1}>
              ${totalBalance}
            </Box>
          </Box>
          <Box className={classes.graphBox}>
            <Box className={classes.graphHeader}>
              <Box className={classes.header1}>Shares Distribution</Box>
            </Box>
            <Grid container style={{ marginTop: "16px" }}>
              <Grid item xs={12} sm={6}>
                {stakingRadialConfig && <PrintChart config={stakingRadialConfig} canvasHeight={250} />}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box style={{ marginLeft: "12px" }}>
                  {stakingRadialConfig &&
                    stakingRadialConfig.config.data.datasets[0].labels.map((item, index) => (
                      <Box className={classes.flexBox} mb={2}
                        key={'labels-' + index}>
                        <Box
                          className={classes.colorBox}
                          style={{
                            background: stakingRadialConfig.config.data.datasets[0].backgroundColor[index],
                          }}
                        />
                        <Box ml={2}>
                          <Box className={classes.header2}>{item}</Box>
                          <Box className={classes.header1}>
                            ${stakingRadialConfig.config.data.datasets[0].data[index]}
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
                <StyledSelect className={classes.select} value={rewardDao} onChange={v => { }}>
                  {StakeFilters.map((item, index) => (
                    <StyledMenuItem key={index} value={item}>
                      {item}
                    </StyledMenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </Box>
            <Box style={{ height: "100%" }}>{rewardConfig && <PrintChart config={rewardConfig} />}</Box>
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
        <CustomTable headers={TRANSACTIONTABLEHEADER} rows={getTableData()} variant={Variant.Tertiary} />
      </Box>
      {openBuySellModal && (
        <BuySellTokenModal
          open={openBuySellModal}
          buyMode={isBuy}
          pod={props.pod}
          handleClose={() => setOpenBuySellModal(false)}
        />
      )}
    </Box>
  );
};

export default Investments;
