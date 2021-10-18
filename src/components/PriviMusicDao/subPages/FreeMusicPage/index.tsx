import React, { useState } from "react";
import Moment from "react-moment";

import { Grid, Hidden } from "@material-ui/core";

import { ShortArrowIcon, SharePriviIcon, SparkIcon } from "../../components/Icons/SvgIcons";
import HowItWorksModal from "components/PriviMusicDao/modals/HowItWorks";

import { ReactComponent as OscelloIcon } from "assets/icons/oscello.svg";
import Box from "shared/ui-kit/Box";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import PrintChart from "shared/ui-kit/Chart/Chart";

import { freeMusicPageStyles } from "./index.styles";
import StakingPoolCard from "components/PriviMusicDao/components/Cards/StakingPoolCard";

const TRANSACTIONHEADERS: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Hours Received",
    headerAlign: "center",
  },
  {
    headerName: "Staking Amount",
    headerAlign: "center",
  },
  {
    headerName: "Total Value",
    headerAlign: "center",
  },
  {
    headerName: "Address",
    headerAlign: "center",
  },
  {
    headerName: "Time",
    headerAlign: "center",
    sortable: true,
  },
  {
    headerName: "Privi Scan",
    headerAlign: "center",
  },
];

const TRANSACTIONS = [
  {
    stakingAmmount: 22.45,
    totalValue: 73500,
    address: "0xcD242294D242294D242294",
    time: new Date(),
    date: new Date(),
  },
  {
    stakingAmmount: 22.45,
    totalValue: 73500,
    address: "0xcD242294D242294D242294",
    time: new Date(),
    date: new Date(),
  },
  {
    stakingAmmount: 22.45,
    totalValue: 73500,
    address: "0xcD242294D242294D242294",
    time: new Date(),
    date: new Date(),
  },
  {
    stakingAmmount: 22.45,
    totalValue: 73500,
    address: "0xcD242294D242294D242294",
    time: new Date(),
    date: new Date(),
  },
  {
    stakingAmmount: 22.45,
    totalValue: 73500,
    address: "0xcD242294D242294D242294",
    time: new Date(),
    date: new Date(),
  },
  {
    stakingAmmount: 22.45,
    totalValue: 73500,
    address: "0xcD242294D242294D242294",
    time: new Date(),
    date: new Date(),
  },
];

const SONGHEADERS: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Artist",
    headerAlign: "center",
  },
  {
    headerName: "Song Title",
    headerAlign: "center",
  },
  {
    headerName: "Uploads",
    headerAlign: "center",
  },
  {
    headerName: "Address",
    headerAlign: "center",
  },
  {
    headerName: "Privi Scan",
    headerAlign: "center",
  },
];

const SONGS = [
  {
    artist: "Tester",
    name: "Lorem Ipsum Dolor",
    uploads: 73500,
    address: "0xcD242294D242294D242294",
  },
  {
    artist: "Tester",
    name: "Lorem Ipsum Dolor",
    uploads: 73500,
    address: "0xcD242294D242294D242294",
  },
  {
    artist: "Tester",
    name: "Lorem Ipsum Dolor",
    uploads: 73500,
    address: "0xcD242294D242294D242294",
  },
  {
    artist: "Tester",
    name: "Lorem Ipsum Dolor",
    uploads: 73500,
    address: "0xcD242294D242294D242294",
  },
  {
    artist: "Tester",
    name: "Lorem Ipsum Dolor",
    uploads: 73500,
    address: "0xcD242294D242294D242294",
  },
];

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
          lineTension: 0.05,
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
          top: 30,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            barPercentage: 0.4,
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
            position: "right",
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

const FreeHoursChartConfig1 = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: "line",
          label: "",
          data: [] as any[],
          pointRadius: 0,
          backgroundColor: "#5CC4D1",
          borderColor: "#5CC4D1",
          pointBackgroundColor: "#5CC4D1",
          hoverBackgroundColor: "#5CC4D1",
          borderJoinStyle: "round",
          borderCapStyle: "round",
          borderWidth: 3,
          cubicInterpolationMode: "monotone",
          lineTension: 0.05,
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
          top: 30,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            barPercentage: 0.4,
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
            position: "right",
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

const FreeHoursChartConfig2 = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: "line",
          label: "",
          data: [] as any[],
          pointRadius: 0,
          backgroundColor: "#6D4DD1",
          borderColor: "#6D4DD1",
          pointBackgroundColor: "#6D4DD1",
          hoverBackgroundColor: "#6D4DD1",
          borderJoinStyle: "round",
          borderCapStyle: "round",
          borderWidth: 3,
          cubicInterpolationMode: "monotone",
          lineTension: 0.05,
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
          top: 30,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            barPercentage: 0.4,
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
            position: "right",
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

const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
    gradient.addColorStop(1, `${config.data.datasets[index].backgroundColor}50`);
    gradient.addColorStop(0, `${config.data.datasets[index].backgroundColor}ff`);
    config.data.datasets[index].backgroundColor = gradient;

    if (config.data.datasets[index].type === "bar") {
      config.data.datasets[index].borderWidth = 0;
    }
  }

  return config;
};

const STAKINGPOOLS = [
  {
    token: "BNB",
    days: 24,
    data: [10, 40, 65, 80, 120, 230],
  },
  {
    token: "BTC",
    days: 24,
    data: [10, 40, 65, 80, 120, 230],
  },
  {
    token: "USDT",
    days: 24,
    data: [10, 40, 65, 80, 120, 230],
  },
  {
    token: "DAI",
    days: 24,
    data: [10, 40, 65, 80, 120, 230],
  },
];

export default function FreeMusicPage() {
  const classes = freeMusicPageStyles();

  const [freeHoursConfig, setFreeHoursConfig] = useState<any>();
  const [graphType, setGraphType] = useState<number>(0);
  const [labelType, setLabelType] = useState<number>(0);

  const [openHowModal, setOpenHowModal] = useState<boolean>(false);

  const [ascending, setAscending] = useState<boolean>(false);

  const getAllDaysInMonth = () => {
    const dt = new Date();
    const month = dt.getMonth();
    const year = dt.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();

    const result: string[] = [];
    for (let index = 1; index <= daysInMonth; index++) {
      result.push(index < 10 ? `0${index}` : `${index}`);
    }

    return result;
  };

  const getAllValuesInMonth = () => {
    const dt = new Date();
    const month = dt.getMonth();
    const year = dt.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();

    const result: number[] = [];
    for (let index = 1; index <= daysInMonth; index++) {
      result.push(Math.floor(Math.random() * 10000));
    }

    return result;
  };

  React.useEffect(() => {
    console.log(`graphType---------------------`, graphType);
    const newConfig =
      graphType === 0
        ? JSON.parse(JSON.stringify(FreeHoursChartConfig))
        : graphType === 1
        ? JSON.parse(JSON.stringify(FreeHoursChartConfig1))
        : JSON.parse(JSON.stringify(FreeHoursChartConfig2));
    // const newConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newConfig.configurer = configurer;
    newConfig.config.data.labels = getAllDaysInMonth();
    newConfig.config.data.datasets[0].data = getAllValuesInMonth();
    // newConfig.config.data.datasets[0].type = graphType === 0 ? "bar" : "line";
    // newConfig.config.data.datasets[0].backgroundColor =
    //   graphType === 0 ? "#F9E373" : graphType === 1 ? "#5CC4D1" : "#6D4DD1";
    // newConfig.config.data.datasets[0].borderColor =
    //   graphType === 0 ? "#F9E373" : graphType === 1 ? "#5CC4D1" : "#6D4DD1";
    // newConfig.config.data.datasets[0].pointBackgroundColor =
    //   graphType === 0 ? "#F9E373" : graphType === 1 ? "#5CC4D1" : "#6D4DD1";
    // newConfig.config.data.datasets[0].hoverBackgroundColor =
    //   graphType === 0 ? "#F9E373" : graphType === 1 ? "#5CC4D1" : "#6D4DD1";
    setFreeHoursConfig(newConfig);
  }, [graphType]);

  const getPercentValueBox = (percent: number) => {
    return (
      <Box
        className={classes.percentValueBox}
        style={{ background: percent > 0 ? "rgba(0, 209, 59, 0.09)" : "rgba(244, 62, 95, 0.09)" }}
      >
        <Box style={{ transform: `rotate(${percent > 0 ? 0 : 180}deg)` }} className={classes.flexBox}>
          <ShortArrowIcon color={percent > 0 ? "#00D13B" : "#F43E5F"} />
        </Box>
        <Box className={classes.header3} color={percent > 0 ? "#00D13B" : "#F43E5F"} ml={1}>
          {`${percent > 0 ? "+ " : ""}${percent}%`}
        </Box>
      </Box>
    );
  };

  const getTransactonTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    TRANSACTIONS.map(item => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box className={classes.flexBox} justifyContent="center">
            <span>
              {item.date.getHours() > 0 && (
                <span style={{ color: "#65CB63", fontSize: 16, fontWeight: 600, marginRight: 4 }}>
                  <b>{String(item.date.getHours()).padStart(2, "0")}</b>h
                </span>
              )}
              {item.date.getMinutes() > 0 && (
                <span style={{ color: "#65CB63", fontSize: 16, fontWeight: 600, marginRight: 4 }}>
                  <b>{String(item.date.getMinutes()).padStart(2, "0")}</b>m
                </span>
              )}
              <span style={{ color: "#65CB63", fontSize: 16, fontWeight: 600, marginRight: 4 }}>
                <b>{String(item.date.getSeconds()).padStart(2, "0")}</b>s
              </span>
            </span>
          </Box>
        ),
      });
      row.push({
        cell: <Box className={classes.header3}>{item.stakingAmmount} PRIVI</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Box className={classes.header3}>${item.totalValue}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: (
          <Box className={classes.header3} style={{ color: "#65CB63" }}>
            {item.address.substr(0, 12) + "..." + item.address.substr(16)}
          </Box>
        ),
        cellAlign: "center",
      });
      row.push({
        cell: (
          <Moment className={classes.header3} fromNow>
            {item.time}
          </Moment>
        ),
        cellAlign: "center",
      });
      row.push({
        cell: <SharePriviIcon color="#65CB63" />,
        cellAlign: "center",
      });

      tableData.push(row);
    });

    return tableData;
  };

  const getSongsTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    SONGS.map(item => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box className={classes.header3} style={{ color: "#FF8E3C" }}>
            {item.artist}
          </Box>
        ),
        cellAlign: "center",
      });
      row.push({
        cell: <Box className={classes.header3}>{item.name}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Box className={classes.header3}>${item.uploads}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: (
          <Box className={classes.header3} style={{ color: "#FF8E3C" }}>
            {item.address.substr(0, 12) + "..." + item.address.substr(16)}
          </Box>
        ),
        cellAlign: "center",
      });
      row.push({
        cell: <SharePriviIcon color="#FF8E3C" />,
        cellAlign: "center",
      });

      tableData.push(row);
    });

    return tableData;
  };

  return (
    <Box className={classes.content}>
      <img src={require("assets/musicDAOImages/background.png")} className={classes.gradient} />
      <Box className={classes.flexBox} justifyContent="flex-end" zIndex={1}>
        <SecondaryButton
          size="medium"
          onClick={() => {}}
          isRounded
          style={{ background: "rgba(255, 255, 255, 0.5)", border: "none", color: "#404658" }}
        >
          Show all your stakes
        </SecondaryButton>
      </Box>
      <Box
        className={classes.flexBox}
        width={1}
        justifyContent="center"
        flexDirection="column"
        mt={2}
        zIndex={1}
      >
        <Box className={classes.headerTitle}>
          <b>Free</b> Music
        </Box>
        <Box className={classes.header2} mb={2} color="white">
          <b>Stake stablecoins</b> to get hours of
          <br /> free music from Privi Free Zone.
        </Box>
        <PrimaryButton
          size="medium"
          onClick={() => setOpenHowModal(true)}
          isRounded
          style={{ background: Color.MusicDAODark, paddingLeft: "24px", paddingRight: "24px" }}
        >
          How It Works
        </PrimaryButton>
      </Box>
      <Box zIndex={1} mt={3}>
        <Box className={classes.header1} color="white">
          Staking Pools
        </Box>
        <Box className={classes.horizontalScrollBox}>
          <Box className={classes.flexBox} mt={2} minWidth="800px">
            {STAKINGPOOLS.map((pool, index) => (
              <Box key={index} ml={index > 0 ? 4 : 0}>
                <StakingPoolCard item={pool} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box zIndex={1} mt={3}>
        <Box className={classes.header1} color={Color.MusicDAODark}>
          Staking stats
        </Box>
        <Grid container spacing={2} style={{ marginTop: 16 }}>
          <Grid item xs={6} md={4}>
            <Box className={classes.whiteBox}>
              <Box className={classes.flexBox} justifyContent="space-between" width={1}>
                <OscelloIcon />
                {getPercentValueBox(3)}
              </Box>
              <Box className={classes.header3} color={"#54658F"} mt={2}>
                MUSIC CONSUMED
              </Box>
              <Box className={classes.header1} color={Color.MusicDAODark} mt={1}>
                17.456 hrs.
              </Box>
              <Box className={classes.header3} color={"#54658F"} mt={1}>
                Per Day
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} md={4}>
            <Box className={classes.whiteBox}>
              <Box className={classes.flexBox} justifyContent="flex-end" width={1}>
                {getPercentValueBox(-3)}
              </Box>
              <Box className={classes.header3} color={"#54658F"} mt={2}>
                REPAYMENT RATE
              </Box>
              <Box className={classes.header1} color={Color.MusicDAODark} mt={1}>
                7,923
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box className={classes.whiteBox}>
              <Box className={classes.flexBox} justifyContent="flex-end" width={1}>
                {getPercentValueBox(2.5)}
              </Box>
              <Box className={classes.header3} color={"#54658F"} mt={2}>
                TOTAL AMOUNT STAKED
              </Box>
              <Box className={classes.header1} color={Color.MusicDAODark} mt={1}>
                85,732
              </Box>
              <Box className={classes.header3} color={"#54658F"} mt={1}>
                USD
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.graphBox} zIndex={1} mt={6}>
        <Box className={classes.graphTobBox} borderBottom="1px solid #00000022" pb={2}>
          <Box className={classes.header1}>
            {graphType === 0 ? "Repayment rate" : graphType === 1 ? "USD staked" : "Music consumed"}
          </Box>
          <Box className={classes.controlBox}>
            <Box
              className={`${classes.buttonBox} ${graphType === 0 ? classes.selectedButtonBox : ""}`}
              onClick={() => setGraphType(0)}
            >
              Repayment rate
            </Box>
            <Box
              className={`${classes.buttonBox} ${graphType === 1 ? classes.selectedButtonBox : ""}`}
              onClick={() => setGraphType(1)}
            >
              USD Staked
            </Box>
            <Box
              className={`${classes.buttonBox} ${graphType === 2 ? classes.selectedButtonBox : ""}`}
              onClick={() => setGraphType(2)}
            >
              Music consumed
            </Box>
          </Box>
        </Box>

        <Box className={classes.flexBox} justifyContent="space-between">
          <Box className={classes.flexBox} my={1}>
            <Box className={classes.header2}>{graphType === 0 ? "126,487" : "$4.16b"}</Box>
            <Box
              className={classes.secondButtonBox}
              style={{
                background:
                  graphType === 0 ? "rgba(255, 153, 0, 1)" : graphType === 1 ? "#5CC4D1" : "#6D4DD1",
                paddingLeft: "16px",
                paddingRight: "16px",
                border: "none",
              }}
              ml={2}
            >
              <SparkIcon />
              <span style={{ marginLeft: "8px", color: "white" }}>+421.27%</span>
            </Box>
          </Box>
          {graphType !== 0 && (
            <Box
              className={classes.controlBox}
              style={{
                background: graphType === 1 ? "#5CC4D133" : "#6D4DD133",
              }}
              mt={0}
            >
              <Box
                className={classes.secondButtonBox}
                style={{
                  background: labelType === 0 ? (graphType === 0 ? "#5CC4D1" : "#6D4DD1") : "transparent",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  border: "none",
                  color: labelType === 0 ? "white" : "black",
                }}
                onClick={() => setLabelType(0)}
              >
                Day
              </Box>
              <Box
                className={classes.secondButtonBox}
                style={{
                  background: labelType === 1 ? (graphType === 0 ? "#5CC4D1" : "#6D4DD1") : "transparent",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  border: "none",
                  color: labelType === 1 ? "white" : "black",
                }}
                onClick={() => setLabelType(1)}
              >
                Week
              </Box>
            </Box>
          )}
        </Box>
        <Box style={{ height: "350px" }}>{freeHoursConfig && <PrintChart config={freeHoursConfig} />}</Box>
      </Box>
      <Box mt={6} zIndex={1}>
        <Box className={classes.flexBox} justifyContent="space-between" mb={2}>
          <Box className={classes.header1} color="#404658">
            Transactions
          </Box>
          <Box className={classes.flexBox} justifyContent="center">
            <Box className={classes.secondButtonBox} onClick={() => {}}>
              <Box className={classes.header3} color={Color.MusicDAODark}>
                Show All
              </Box>
              <Box style={{ transform: `rotate(90deg)` }} className={classes.flexBox} ml={3}>
                <ShortArrowIcon color={Color.MusicDAODark} />
              </Box>
            </Box>
          </Box>
        </Box>
        <CustomTable
          headers={TRANSACTIONHEADERS}
          rows={getTransactonTableData()}
          theme="transaction"
          onSort={_ => setAscending(prev => !prev)}
          sorted={{ Time: !ascending }}
        />
      </Box>
      {openHowModal && (
        <HowItWorksModal open={openHowModal} handleClose={() => setOpenHowModal(false)} isStack />
      )}
    </Box>
  );
}
