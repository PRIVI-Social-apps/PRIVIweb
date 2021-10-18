import React from "react";
import { Box, makeStyles, Select, MenuItem, Grid } from "@material-ui/core";
import Carousel from "react-spring-3d-carousel";

import PrintChart from "shared/ui-kit/Chart/Chart";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { Color, FontSize, PrimaryButton, StyledDivider, Variant } from "shared/ui-kit";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";

import LiquidityCard from "components/PriviMusicDao/components/LiquidityCard";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CarouselArrowLeft,
  CarouselArrowRight,
  GrowIcon,
} from "components/PriviMusicDao/components/Icons/SvgIcons";
import BuyShareModal from "components/PriviMusicDao/modals/BuyShare";
import { CustomTable, CustomTableCellInfo } from "shared/ui-kit/Table";

const useStyles = makeStyles(theme => ({
  container: {
    background:
      "linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #F0F5F8 96.61%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)",
    height: "100%",
    padding: "30px 45px",
  },
  topBox: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  clockBox: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  header1: {
    fontSize: "24px",
    color: "white",
    [theme.breakpoints.down("sm")]: {
      fontSize: "20px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "16px",
    },
    marginLeft: theme.spacing(1),
  },
  headerTitle: {
    fontSize: 58,
    fontWeight: 400,
    marginBlock: 0,
    marginBottom: 26,
    color: Color.White,
    "& span": {
      fontWeight: 800,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 44,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 35,
    },
  },
  subTitleBox: {
    width: "70%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      textAlign: "center",
    },
  },
  headerSubTitle: {
    fontSize: 26,
    fontWeight: 400,
    marginBlock: 0,
    marginBottom: 26,
    lineHeight: "150%",
    color: Color.White,
    textAlign: "center",
    "& span": {
      fontWeight: 800,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 21,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 21,
    },
  },
  carouselBox: {
    width: 1000,
    height: "500px",

    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: `0px ${theme.spacing(10)}px`,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      margin: `0px ${theme.spacing(5)}px`,
    },
  },
  chartContainer: {
    marginTop: theme.spacing(5),
  },
  controlParentBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      alignItems: "flex-start",
    },
    width: "100%",
  },
  liquidityBox: {
    display: "flex",
    alignItems: "center",
    background: "#F0F5F8",
    borderRadius: theme.spacing(5),
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(1),
    },
    "& button": {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  controlBox: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-end",
    },
  },
  graphBox: {
    overflow: "hidden",
    background: Color.White,
    boxShadow: "0px 25px 36px -11px rgba(0, 0, 0, 0.02)",
    borderRadius: 20,
    padding: `${theme.spacing(3.5)}px ${theme.spacing(5)}px`,
    margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
  table: {
    borderRadius: 34,
    marginBottom: 40,
    "& .MuiTableRow-root": {
      background: Color.White,
      borderRadius: 34,
      marginBottom: 12,
    },
  },
  progressContainer: {
    border: "1px solid #1ABB00",
    borderRadius: 32,
    height: 10,
    padding: 1,
    position: "relative",
  },
  progress: {
    height: "100%",
    width: "70%",
    borderRadius: 32,
    backgroundColor: "#1ABB00",
  },
  carouselNav: {
    width: 257,
    height: 46,
    background: Color.White,
    boxShadow: "0px 10px 21px -9px rgba(29, 103, 84, 0.28)",
    borderRadius: 37,
  },
}));

const Liquidities = [
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
];

const YearLabels: any[] = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
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
          borderRadius: Number.MAX_VALUE,
          borderSkipped: true,
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
          top: 20,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            barPercentage: 0.3,
            offset: true,
            display: true,
            gridLines: {
              color: "#ffffff",
              lineWidth: 50,
            },
            ticks: {
              beginAtZero: false,
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
              drawBorder: false,
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
const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
    gradient.addColorStop(1, `${config.data.datasets[index].backgroundColor}33`);
    gradient.addColorStop(0.5, `${config.data.datasets[index].backgroundColor}b0`);
    config.data.datasets[index].backgroundColor = gradient;
  }

  return config;
};

const Periods = ["1D", "6D", "YTD"];

export default function HighYieldPage() {
  const classes = useStyles();
  const commonClasses = priviMusicDaoPageStyles();

  const [currentSlider, setCurrentSlider] = React.useState<number>(0);
  const [period, setPeriod] = React.useState<string>(Periods[0]);

  const [openBuyShareModal, setOpenBuyShareModal] = React.useState<boolean>(false);

  const [rewardConfig, setRewardConfig] = React.useState<any>();
  const [rewardConfig1, setRewardConfig1] = React.useState<any>();
  const [liquidities, setLiquidities] = React.useState<any[]>([]);

  React.useEffect(() => {
    const newRewardConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newRewardConfig.configurer = configurer;
    newRewardConfig.config.data.labels = YearLabels;
    newRewardConfig.config.data.datasets[0].data = [
      10, 40, 65, 80, 120, 230, 10, 40, 65, 80, 120, 230, 10, 40, 65, 80, 120, 230, 10, 40, 65, 80, 120, 230,
      10, 40, 65,
    ];
    newRewardConfig.config.data.datasets[0].backgroundColor = "#0FCEA6";
    newRewardConfig.config.data.datasets[0].borderColor = "#0FCEA600";
    newRewardConfig.config.data.datasets[0].pointBackgroundColor = "#0FCEA6";
    newRewardConfig.config.data.datasets[0].hoverBackgroundColor = "#0FCEA6";
    newRewardConfig.config.options.scales.xAxes[0].offset = true;
    newRewardConfig.config.options.scales.yAxes[0].ticks.display = true;

    const newRewardConfig1 = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newRewardConfig1.configurer = configurer;
    newRewardConfig1.config.data.labels = YearLabels;
    newRewardConfig1.config.data.datasets[0].data = [
      10, 40, 65, 80, 120, 230, 10, 40, 65, 80, 120, 230, 10, 40, 65, 80, 120, 230, 10, 40, 65, 80, 120, 230,
      10, 40, 65,
    ];
    newRewardConfig1.config.data.datasets[0].backgroundColor = "#FFD705";
    newRewardConfig1.config.data.datasets[0].borderColor = "#FFD70500";
    newRewardConfig1.config.data.datasets[0].pointBackgroundColor = "#FFD705";
    newRewardConfig1.config.data.datasets[0].hoverBackgroundColor = "#FFD705";
    newRewardConfig1.config.data.datasets[0].type = "line";
    newRewardConfig1.config.options.scales.xAxes[0].offset = true;
    newRewardConfig1.config.options.scales.yAxes[0].ticks.display = true;

    setRewardConfig(newRewardConfig);
    setRewardConfig1(newRewardConfig1);

    setLiquidities(
      Liquidities.map((data, index) => ({
        key: `uuid_${data.name}_${index}`,
        content: <LiquidityCard data={data} onBuyShare={handleOpenBuyShareModal} />,
      }))
    );
  }, []);

  const handleChangePeriod = (period: string) => () => {
    setPeriod(period);
  };

  const handleOpenBuyShareModal = () => {
    setOpenBuyShareModal(true);
  };

  const handleCloseBuyShareModal = () => {
    setOpenBuyShareModal(false);
  };

  const getTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    [1, 2, 3, 4, 5].map(item => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box display="flex" flexDirection="row" alignItems="center">
            <img src={require("assets/musicDAOImages/audio.png")} alt={"audio"} />
            <Text
              size={FontSize.L}
              color={Color.MusicDAOLightBlue}
              ml={1.5}
              mr={1.5}
              style={{ fontWeight: 700 }}
            >
              From
            </Text>
            <Text size={FontSize.L} bold color={Color.MusicDAODeepGreen} style={{ fontWeight: 700 }}>
              0h
            </Text>
            <Text
              size={FontSize.L}
              color={Color.MusicDAOLightBlue}
              ml={1.5}
              mr={1.5}
              style={{ fontWeight: 700 }}
            >
              To
            </Text>
            <Text size={FontSize.L} bold color={Color.MusicDAODeepGreen} style={{ fontWeight: 700 }}>
              4h
            </Text>
          </Box>
        ),
      });
      row.push({
        cell: <img src={require("assets/musicDAOImages/graph.png")} alt="graph" />,
      });
      row.push({
        cell: (
          <Box display="flex" flexDirection="column">
            <Text size={FontSize.L} style={{ fontWeight: 700, opacity: 0.8 }} color={Color.MusicDAOLightBlue}>
              Liquidity
            </Text>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Text size={FontSize.L} style={{ fontWeight: 700, color: "#585b75" }}>
                3232.456 USDp
              </Text>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="row"
                bgcolor="rgba(244, 62, 95, 0.09)"
                borderRadius={15}
                width={48}
                height={20}
                ml={1}
              >
                <ArrowDownIcon />
                <Text size={FontSize.S} color={Color.Red} ml={0.5}>
                  -3%
                </Text>
              </Box>
            </Box>
          </Box>
        ),
      });
      row.push({
        cell: (
          <Box display="flex" flexDirection="column">
            <Text size={FontSize.L} style={{ fontWeight: 700, opacity: 0.8 }} color={Color.MusicDAOLightBlue}>
              Relative Liquidity
            </Text>
            <Text size={FontSize.L} style={{ fontWeight: 700, color: "#585b75" }}>
              3232.456 USDp
            </Text>
            <div className={classes.progressContainer}>
              <div className={classes.progress} />
            </div>
          </Box>
        ),
      });
      row.push({
        cell: (
          <Box display="flex" flexDirection="column">
            <Text size={FontSize.L} style={{ fontWeight: 700, opacity: 0.8 }} color={Color.MusicDAOLightBlue}>
              Shares at
            </Text>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Text size={FontSize.L} style={{ fontWeight: 700, color: "#1ABB00" }}>
                17.456 pUSD
              </Text>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="row"
                bgcolor="rgba(0, 209, 59, 0.09)"
                borderRadius={15}
                width={48}
                height={20}
                ml={1}
              >
                <ArrowUpIcon />
                <Text size={FontSize.S} color={Color.MusicDAOTightGreen} ml={0.5}>
                  -3%
                </Text>
              </Box>
            </Box>
          </Box>
        ),
      });

      row.push({
        cell: (
          <PrimaryButton size="medium" className={commonClasses.primaryButton} isRounded>
            Buy Shares
          </PrimaryButton>
        ),
      });

      tableData.push(row);
    });

    return tableData;
  };

  return (
    <Box className={classes.container}>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Box className={classes.topBox}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <img src={require("assets/musicDAOImages/clock.png")} alt="clock" className={classes.clockBox} />
            <Box className={classes.header1} mr={0.5}>
              Round closing in
            </Box>
          </Box>
          <Box className={classes.header1} fontWeight="bold">
            03:54 (12:00 PM CET)
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          bgcolor="rgba(255, 255, 255, 0.5)"
          borderRadius={29}
          padding={1}
        >
          <img src={require("assets/musicDAOImages/USDp.png")} alt="usdp" />
          <Text size={FontSize.L} ml={1}>
            USDp
          </Text>
          <Text size={FontSize.L} ml={1}>
            $276.914
          </Text>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={9}>
        <h1 className={classes.headerTitle}>
          <span>Play &</span> reap the rewards!
        </h1>
        <Box className={classes.subTitleBox}>
          <h3 className={classes.headerSubTitle}>
            <span>Buy shares on the time slot</span> that you think will have the{" "}
            <span>most listens on platform</span> during the next 24 hours <span>and earn PRIVI tokens.</span>
          </h3>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="center">
        <Box className={classes.carouselBox}>
          <Carousel
            slides={liquidities}
            goToSlide={currentSlider}
            showNavigation={false}
            offsetRadius={3}
          // animationConfig={{ tension: 170, friction: 26 }}
          />
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" mt={2}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          px={6}
          className={classes.carouselNav}
        >
          <Box mr={2} onClick={() => setCurrentSlider(prev => prev - 1)}>
            <CarouselArrowLeft />
          </Box>
          <Box width={"1px"} height={"100%"} bgcolor={"#E4ECED"} />
          <Box ml={2} onClick={() => setCurrentSlider(prev => prev + 1)}>
            <CarouselArrowRight />
          </Box>
        </Box>
      </Box>
      <Grid container className={classes.chartContainer}>
        <Grid xs={12} sm={12} md={12} lg={6}>
          <Box className={classes.graphBox}>
            <Box className={classes.controlParentBox}>
              <Text mr={1} size={FontSize.H4} style={{ fontWeight: 700 }}>
                Liquidity
              </Text>
              <Box className={classes.controlBox}>
                <Select value={"2020-05-17"} className={commonClasses.outlineSelect}>
                  <MenuItem value={"2020-05-17"}>
                    <Text color={Color.MusicDAOLightBlue} bold>
                      17 May 2020
                    </Text>
                  </MenuItem>
                  <MenuItem value={"2020-05-18"}>
                    <Text color={Color.MusicDAOLightBlue} bold>
                      18 May 2020
                    </Text>
                  </MenuItem>
                  <MenuItem value={"2020-05-19"}>
                    <Text color={Color.MusicDAOLightBlue} bold>
                      19 May 2020
                    </Text>
                  </MenuItem>
                  <MenuItem value={"2020-05-20"}>
                    <Text color={Color.MusicDAOLightBlue} bold>
                      20 May 2020
                    </Text>
                  </MenuItem>
                  <MenuItem value={"2020-05-21"}>
                    <Text color={Color.MusicDAOLightBlue} bold>
                      21 May 2020
                    </Text>
                  </MenuItem>
                  <MenuItem value={"2020-05-22"}>
                    <Text color={Color.MusicDAOLightBlue} bold>
                      22 May 2020
                    </Text>
                  </MenuItem>
                  <MenuItem value={"2020-05-23"}>
                    <Text color={Color.MusicDAOLightBlue} bold>
                      23 May 2020
                    </Text>
                  </MenuItem>
                </Select>
                <Box className={classes.liquidityBox}>
                  {Periods.map((item, index) => (
                    <button
                      key={`period-button-${index}`}
                      className={`${commonClasses.groupButton} ${item === period && commonClasses.selectedGroupButton
                        }`}
                      onClick={handleChangePeriod(item)}
                      style={{ marginLeft: index > 0 ? "8px" : 0 }}
                    >
                      {item}
                    </button>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box mt={4}>
              <StyledDivider type="solid" />
            </Box>
            <Box display="flex" flexDirection="row" mt={4} alignItems="flex-end">
              <Text size={FontSize.XXL} mr={3}>
                126,487
              </Text>
              <Box display="flex" alignItems="flex-end" justifyContent="space-between" width={1} mb={0.5}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor={Color.MusicDAOGreen}
                  borderRadius={40}
                  py={1}
                  px={2}
                >
                  <GrowIcon />
                  <Text ml={1} size={FontSize.S} bold color={Color.White}>
                    +421.27%
                  </Text>
                </Box>
                <Text size={FontSize.S} style={{ fontWeight: 600 }}>
                  PRIVI
                </Text>
              </Box>
            </Box>
            <Box display="flex" alignItems="flex-end" justifyContent="space-between" width={1}>
              <Text size={FontSize.S} style={{ fontWeight: 600, marginBottom: 4 }}>
                Hours
              </Text>
              <Box height="250px" width={1}>
                {rewardConfig && <PrintChart config={rewardConfig} />}
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={6}>
          <Box className={classes.graphBox}>
            <Box className={classes.controlParentBox}>
              <Text mr={1} size={FontSize.H4} style={{ fontWeight: 700 }}>
                Listening hours per user
              </Text>
              <Select value={"2020-05-17"} className={commonClasses.outlineSelect}>
                <MenuItem value={"2020-05-17"}>
                  <Text color={Color.MusicDAOLightBlue} bold>
                    17 May 2020
                  </Text>
                </MenuItem>
                <MenuItem value={"2020-05-18"}>
                  <Text color={Color.MusicDAOLightBlue} bold>
                    18 May 2020
                  </Text>
                </MenuItem>
                <MenuItem value={"2020-05-19"}>
                  <Text color={Color.MusicDAOLightBlue} bold>
                    19 May 2020
                  </Text>
                </MenuItem>
                <MenuItem value={"2020-05-20"}>
                  <Text color={Color.MusicDAOLightBlue} bold>
                    20 May 2020
                  </Text>
                </MenuItem>
                <MenuItem value={"2020-05-21"}>
                  <Text color={Color.MusicDAOLightBlue} bold>
                    21 May 2020
                  </Text>
                </MenuItem>
                <MenuItem value={"2020-05-22"}>
                  <Text color={Color.MusicDAOLightBlue} bold>
                    22 May 2020
                  </Text>
                </MenuItem>
                <MenuItem value={"2020-05-23"}>
                  <Text color={Color.MusicDAOLightBlue} bold>
                    23 May 2020
                  </Text>
                </MenuItem>
              </Select>
            </Box>
            <Box mt={4}>
              <StyledDivider type="solid" />
            </Box>
            <Box display="flex" flexDirection="row" mt={4} alignItems="flex-end">
              <Text size={FontSize.XXL} mr={3}>
                126,487
              </Text>
              <Box display="flex" alignItems="flex-end" justifyContent="space-between" width={1} mb={0.5}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor={Color.MusicDAOOrange}
                  py={1}
                  borderRadius={40}
                  px={2}
                >
                  <GrowIcon />
                  <Text ml={1} size={FontSize.S} bold color={Color.White}>
                    +421.27%
                  </Text>
                </Box>
                <Text size={FontSize.S} style={{ fontWeight: 600 }}>
                  Hours
                  <br />
                  listened
                  <br />
                  per user
                </Text>
              </Box>
            </Box>
            <Box display="flex" alignItems="flex-end" justifyContent="space-between" width={1}>
              <Text size={FontSize.S} style={{ fontWeight: 600, marginBottom: 4 }}>
                Time
              </Text>
              <Box height="250px" width={1}>
                {rewardConfig1 && <PrintChart config={rewardConfig1} />}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box display="flex" flexDirection="column" mt={10} mb={5}>
        <Text size={FontSize.XXL} bold mb={4}>
          Slot positions
        </Text>
        <Box className={classes.table}>
          <CustomTable
            headers={[]}
            rows={getTableData()}
            placeholderText="No Slot"
            theme="transparent"
            variant={Variant.Transparent}
            radius={20}
          />
        </Box>
      </Box>
      {openBuyShareModal && <BuyShareModal open={openBuyShareModal} handleClose={handleCloseBuyShareModal} />}
    </Box>
  );
}
