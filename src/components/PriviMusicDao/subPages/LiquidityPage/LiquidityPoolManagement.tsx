import React from "react";
import classnames from 'classnames';
import { Box, Grid, makeStyles, Select, MenuItem, useMediaQuery, useTheme } from "@material-ui/core";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";
import { useStyles } from './index.styles';
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { FontSize, Color, StyledDivider, SecondaryButton, PrimaryButton } from "shared/ui-kit";
import PoolCard from "components/PriviMusicDao/components/PoolCard";
import { ArrowDownIcon, ArrowUpIcon, EtherScanIcon, GrowIcon } from "components/PriviMusicDao/components/Icons/SvgIcons";
import {ReactComponent as ArrowLeft} from "assets/icons/arrow-left.svg";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { ArrowLeftIcon, BackIcon } from "../GovernancePage/styles";
import { useHistory } from "react-router-dom";
import LiquidityPositionCard from "components/PriviMusicDao/components/LiquidityPositionCard";

const Transactions = [
  { Token: 'USDT', RangeMin: 74.3, RangeMax: 84.3, TotalAmount: 24.4, Account: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'ETH', RangeMin: 74.3, RangeMax: 84.3, TotalAmount: 24.4, Account: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'BNB', RangeMin: 74.3, RangeMax: 84.3, TotalAmount: 24.4, Account: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'BAL', RangeMin: 74.3, RangeMax: 84.3, TotalAmount: 24.4, Account: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'USDT', RangeMin: 74.3, RangeMax: 84.3, TotalAmount: 24.4, Account: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'BNB', RangeMin: 74.3, RangeMax: 84.3, TotalAmount: 24.4, Account: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'USDT', RangeMin: 74.3, RangeMax: 84.3, TotalAmount: 24.4, Account: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'USDT', RangeMin: 74.3, RangeMax: 84.3, TotalAmount: 24.4, Account: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'ETH', RangeMin: 74.3, RangeMax: 84.3, TotalAmount: 24.4, Account: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'USDT', RangeMin: 74.3, RangeMax: 84.3, TotalAmount: 24.4, Account: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'BNB', RangeMin: 74.3, RangeMax: 84.3, TotalAmount: 24.4, Account: '0xcD242...294', Time: '1 minute ago' },
];

const FreeHoursChartConfig = {
  config: {
    type: 'bar',
    data: {
      labels: [] as any[],
      datasets: [
        {
          label: "",
          data: [] as any[],
          pointRadius: 0,
          backgroundColor: "#0FCEA6",
          borderColor: "#0FCEA6",
          pointBackgroundColor: "#0FCEA6",
          hoverBackgroundColor: "#0FCEA6",
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      // chartArea: {
      //   backgroundColor: "#F7F9FECC",
      // },
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
const YearLabels: any[] = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

const LiquidityIntervals = ['Daily', 'Hourly'];
const TransactionTypes = ['All', 'Adds', 'Removes'];


export default function LiquidityPoolManagement() {
  const classes = useStyles();
  const commonClasses = priviMusicDaoPageStyles();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.only("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const history = useHistory();

  const [liquidityType, setLiquidityType] = React.useState<string>(LiquidityIntervals[0]);
  const [transactionType, setTransactionType] = React.useState<string>(TransactionTypes[0]);

  const [liquidityConfig, setLiquidityConfig] = React.useState<any>();
  const [poolStateIndex, setPoolStateIndex] = React.useState<any>(0);

  React.useEffect(() => {
    const newLiquidityConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newLiquidityConfig.config.data.labels = YearLabels;
    newLiquidityConfig.config.data.datasets[0].data = [10, 40, 65, 80, 120, 230, 10, 40, 65, 80, 120, 230, 10, 40, 65, 80, 120, 230, 10, 40, 65, 80, 120, 230, 10, 40, 65];
    newLiquidityConfig.config.options.scales.xAxes[0].offset = false;
    newLiquidityConfig.config.options.scales.yAxes[0].ticks.display = false;

    setLiquidityConfig(newLiquidityConfig);
  }, []);

  const handleChangeLiquidity = (type: string) => () => {
    setLiquidityType(type);
  }

  const handleChangeTransaction = (type: string) => () => {
    setTransactionType(type);
  }

  const changePoolStateIndex = (index) => {
    const newIndex = index + poolStateIndex;
    if (newIndex >= 0 && newIndex < 3) {
      setPoolStateIndex(newIndex);
    }
  }

  const cardCount = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <Box className={classes.container}>
      <Box className={classes.content}>
        <Box mt={5} display="flex" flexDirection="row" className={commonClasses.backButton} onClick={() => history.goBack()}>
          <BackIcon />
          <Text ml={1} color={Color.White} bold>BACK</Text>
        </Box>
        <Box display="flex" flexDirection="column" mt={4}>
          <Text size={FontSize.H3} color={Color.White} bold>Liquidity Pool Management</Text>
          <Box display="flex" flexDirection="column" className={commonClasses.card} mt={4} px={4} py={4.5} mb={3}>
            <Box className={classes.poolRewards}display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" gridColumnGap={20} gridRowGap={20}>
              <Box className={classes.poolRewardsSelect} display="flex" flexDirection="row" alignItems="center">
                <Text size={FontSize.XXL} bold mr={2}>Rewards</Text>
                <Select value={'2020-05-17'} className={commonClasses.outlineSelect}>
                  <MenuItem value={'2020-05-17'}><Text color={Color.MusicDAOLightBlue} bold>17 May 2020</Text></MenuItem>
                  <MenuItem value={'2020-05-18'}><Text color={Color.MusicDAOLightBlue} bold>18 May 2020</Text></MenuItem>
                  <MenuItem value={'2020-05-19'}><Text color={Color.MusicDAOLightBlue} bold>19 May 2020</Text></MenuItem>
                  <MenuItem value={'2020-05-20'}><Text color={Color.MusicDAOLightBlue} bold>20 May 2020</Text></MenuItem>
                  <MenuItem value={'2020-05-21'}><Text color={Color.MusicDAOLightBlue} bold>21 May 2020</Text></MenuItem>
                  <MenuItem value={'2020-05-22'}><Text color={Color.MusicDAOLightBlue} bold>22 May 2020</Text></MenuItem>
                  <MenuItem value={'2020-05-23'}><Text color={Color.MusicDAOLightBlue} bold>23 May 2020</Text></MenuItem>
                </Select>
              </Box>
              <Box className={classes.poolRewardsButtons} display="flex" flexDirection="row" justifyContent="flex-end">
                <Box bgcolor="#F0F5F8" borderRadius={77} p={0.5}>
                  {LiquidityIntervals.map((item, index) => (
                    <button
                      key={`liquidity-button-${index}`}
                      className={`${commonClasses.groupButton} ${item === liquidityType && commonClasses.selectedGroupButton}`}
                      onClick={handleChangeLiquidity(item)}
                    >
                      {item}
                    </button>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box className={classes.divider}>
              <StyledDivider type="solid" margin={2} />
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Text size={FontSize.XXL} mr={2}>126,487</Text>
              <Box display="flex" alignItems="center" justifyContent="center" bgcolor={Color.MusicDAOGreen} borderRadius={40} py={1} px={2}>
                <GrowIcon />
                <Text ml={1} size={FontSize.S} bold color={Color.White}>+421.27%</Text>
              </Box>
            </Box>
            <Box flex={1}>
              {liquidityConfig && <PrintChart config={liquidityConfig} canvasHeight={200} />}
            </Box>
          </Box>
          {isMobile && (
            <Box display="flex" justifyContent="flex-end" alignItems="center" mb={1}>
              <ArrowLeft className={classes.arrowIcons} onClick={() => changePoolStateIndex(-1)} />
              <ArrowLeft className={classes.arrowIcons} onClick={() => changePoolStateIndex(1)} />
            </Box>
          )}
          <Grid container spacing={2}>
            {(!isMobile || poolStateIndex === 0) && <Grid item xs={12} sm={4}>
              <Box display="flex" flexDirection="column" alignItems="center" className={commonClasses.card} px={3} py={9} position="relative">
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="row" bgcolor="rgba(244, 62, 95, 0.09)" borderRadius={15} px={1} py={0.5} ml={1} position="absolute" top={24} right={24}>
                  <ArrowDownIcon />
                  <Text size={FontSize.L} color={Color.Red} ml={0.5} bold>-3%</Text>
                </Box>
                <Text mb={1} size={FontSize.XL} color={Color.MusicDAOLightBlue} bold opacity={0.8}>TOTAL LIQUIDITY</Text>
                <Text mb={1} size={FontSize.H3} bold>0.5732</Text>
                <Text mb={1} size={FontSize.XL} color={Color.MusicDAOLightBlue} bold opacity={0.8}>PRIVI</Text>
              </Box>
            </Grid>}
            {(!isMobile || poolStateIndex === 1) && <Grid item xs={12} sm={4}>
              <Box display="flex" flexDirection="column" alignItems="center" className={commonClasses.card} px={3} py={9} position="relative">
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="row" bgcolor="rgba(0, 209, 59, 0.09)" borderRadius={15} px={1} py={0.5} ml={1} position="absolute" top={24} right={24}>
                  <ArrowUpIcon />
                  <Text size={FontSize.L} color={Color.MusicDAOTightGreen} ml={0.5} bold>-3%</Text>
                </Box>
                <Text mb={1} size={FontSize.XL} color={Color.MusicDAOLightBlue} bold opacity={0.8}>TOTAL REWARD</Text>
                <Text mb={1} size={FontSize.H3} bold>7,923</Text>
                <Text mb={1} size={FontSize.XL} color={Color.MusicDAOLightBlue} bold opacity={0.8}>PRIVI</Text>
              </Box>
            </Grid>}
            {(!isMobile || poolStateIndex === 2) && <Grid item xs={12} sm={4}>
              <Box display="flex" flexDirection="column" alignItems="center" className={commonClasses.card} px={3} py={9} position="relative">
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="row" bgcolor="rgba(244, 62, 95, 0.09)" borderRadius={15} px={1} py={0.5} ml={1} position="absolute" top={24} right={24}>
                  <ArrowDownIcon />
                  <Text size={FontSize.L} color={Color.Red} ml={0.5} bold>-3%</Text>
                </Box>
                <Text mb={1} size={FontSize.XL} color={Color.MusicDAOLightBlue} bold opacity={0.8}>MINING REWARDS</Text>
                <Text mb={1} size={FontSize.H3} bold>8,5732</Text>
                <Text mb={1} size={FontSize.XL} color={Color.MusicDAOLightBlue} bold opacity={0.8}>PRIVI</Text>
              </Box>
            </Grid>}
          </Grid>
        </Box>
        <StyledDivider type="solid" margin={9} />
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Text size={FontSize.XXL} bold>Adds</Text>
          <SecondaryButton className={classnames(commonClasses.showAll, classes.showAllButton)} size="medium" radius={29}>
            Show All
            <Box position="absolute" flexDirection="row" top={0} right={0} pr={2}>
              <ArrowLeftIcon />
            </Box>
          </SecondaryButton>
        </Box>
        <Box>
          <Grid container spacing={2}>
            {[0, 1, 2].slice(0, cardCount).map(index => (
              <Grid key={`active-history-${index}`} item xs={12} sm={6} md={4}>
                <LiquidityPositionCard data={{ type: "Add", status: index % 2 }} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={3} mt={6}>
          <Text size={FontSize.XXL} bold>Removes</Text>
          <SecondaryButton className={classnames(commonClasses.showAll, classes.showAllButton)} size="medium" radius={29}>
            Show All
            <Box position="absolute" flexDirection="row" top={0} right={0} pr={2}>
              <ArrowLeftIcon />
            </Box>
          </SecondaryButton>
        </Box>
        <Box>
          <Grid container spacing={2}>
            {[0, 1, 2].slice(0, cardCount).map(index => (
              <Grid key={`active-history-${index}`} item xs={12} sm={6} md={4}>
                <LiquidityPositionCard data={{ type: "Remove" }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}
