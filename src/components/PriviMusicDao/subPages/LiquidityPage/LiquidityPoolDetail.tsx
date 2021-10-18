import React from "react";
import classnames from 'classnames';
import { Box, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";
import { useStyles } from './index.styles';
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { FontSize, Color, StyledDivider, SecondaryButton, PrimaryButton } from "shared/ui-kit";
import PoolCard from "components/PriviMusicDao/components/PoolCard";
import { ArrowUpIcon, EtherScanIcon } from "components/PriviMusicDao/components/Icons/SvgIcons";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { ArrowLeftIcon, BackIcon } from "../GovernancePage/styles";
import { useHistory } from "react-router-dom";
import AddLiquidityModal from "components/PriviMusicDao/modals/AddLiquidity";

// const useStyles = makeStyles((theme) => ({
//   container: {
//     background: "linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #F0F5F8 96.61%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)",
//     height: "100%",
//     padding: "30px 45px",
//   },
//   table: {
//     borderRadius: 12,
//     background: Color.White,
//     marginBottom: 40,
//     "& .MuiTableCell-root": {
//       fontSize: 14,
//       color: Color.MusicDAODark
//     },
//     "& .MuiTableCell-root.MuiTableCell-head": {
//       borderBottom: `1px solid ${Color.MusicDAOGreen}`,
//     },
//     "& .MuiTableCell-head": {
//       fontWeight: "bold",
//     },
//   },
//   tableHightlight: {
//     fontWeight: 600,
//     fontSize: "16px !important",
//     color: `${Color.MusicDAOGreen} !important`,
//   }
// }));

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

const LiquidityIntervals = ['Liquidity', 'Rewards', 'Borrowable Funds', 'Utility Ratio'];
const TransactionTypes = ['All', 'Adds', 'Removes'];


export default function LiquidityPoolDetail() {
  const classes = useStyles();
  const commonClasses = priviMusicDaoPageStyles();

  const history = useHistory();

  const [liquidityType, setLiquidityType] = React.useState<string>(LiquidityIntervals[0]);
  const [transactionType, setTransactionType] = React.useState<string>(TransactionTypes[0]);

  const [liquidityConfig, setLiquidityConfig] = React.useState<any>();

  const [openAddLiquidityModal, setOpenAddLiquidityModal] = React.useState<boolean>(false);

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

  const handleOpenAddLiquidityModal = () => {
    setOpenAddLiquidityModal(true);
  }

  const handleCloseAddLiquidityModal = () => {
    setOpenAddLiquidityModal(false);
  }

  return (
    <Box className={classes.container}>
      <Box className={classes.content}>
        <Box mt={5} display="flex" flexDirection="row" className={commonClasses.backButton} onClick={() => history.goBack()}>
          <BackIcon />
          <Text ml={1} color={Color.White} bold>BACK</Text>
        </Box>
        <Box display="flex" flexDirection="column" mt={4}>
          <Box className={classes.poolTitle} display="flex" gridRowGap={26} mb={6}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <img src={require("assets/tokenImages/USDT.png")} alt="token" width={50} />
              <Box display="flex" flexDirection="column" ml={2}>
                <span className={classes.headerSecond}>USDT Liquidity Pool</span>
                <Text size={FontSize.XL} color={Color.White}>USD Tether</Text>
              </Box>
            </Box>
            <Box className={classes.poolOptions}>
              <SecondaryButton size="medium" className={classnames(commonClasses.secondaryButton, classes.manageButton)} onClick={() => history.push(`/privi-music-dao/liquidity/pool_management/${'0x12345678'}`)}>Manage Liquidity</SecondaryButton>
              <PrimaryButton size="medium" className={commonClasses.primaryButton} onClick={handleOpenAddLiquidityModal}>Add Liquidity</PrimaryButton>
            </Box>
          </Box>
          <Grid container spacing={2} direction="row">
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" className={classnames(commonClasses.card, classes.statsCard)} height="100%">
                <Text size={FontSize.L} color={Color.MusicDAOGreen} bold mb={1}>AVERAGE APR</Text>
                <Text size={FontSize.H4} bold>10%</Text>
                <Box my={1}>
                  <StyledDivider type="solid" margin={0} />
                </Box>
                <Text size={FontSize.L} color={Color.MusicDAOGreen} bold mb={1}>LIQUIDITY</Text>
                <Text size={FontSize.H4} bold>$245,522.21</Text>
                <Box display="flex" flexDirection="row" mt={1}>
                  <Box display="flex" alignItems="center" flexDirection="row" bgcolor="rgba(0, 209, 59, 0.09)" borderRadius={15} flex={0} px={1} py={0.5}>
                    <ArrowUpIcon />
                    <Text size={FontSize.L} color={Color.MusicDAOTightGreen} ml={0.5} bold>-3.2%</Text>
                  </Box>
                </Box>
                <Box my={1}>
                  <StyledDivider type="solid" margin={0} />
                </Box>
                <Text size={FontSize.L} color={Color.MusicDAOGreen} bold mb={1}>FUND AVAILABLE TO BORROW</Text>
                <Text size={FontSize.H4} bold>$245,522.21</Text>
                <Box display="flex" flexDirection="row" mt={1}>
                  <Box display="flex" alignItems="center" flexDirection="row" bgcolor="rgba(0, 209, 59, 0.09)" borderRadius={15} flex={0} px={1} py={0.5}>
                    <ArrowUpIcon />
                    <Text size={FontSize.L} color={Color.MusicDAOTightGreen} ml={0.5} bold>-3.2%</Text>
                  </Box>
                </Box>
                <Box my={1}>
                  <StyledDivider type="solid" margin={0} />
                </Box>
                <Text size={FontSize.L} color={Color.MusicDAOGreen} bold mb={1}>REWARD 24H</Text>
                <Text size={FontSize.H4} bold>$245,522.21</Text>
                <Box display="flex" flexDirection="row" mt={1}>
                  <Box display="flex" alignItems="center" flexDirection="row" bgcolor="rgba(0, 209, 59, 0.09)" borderRadius={15} flex={0} px={1} py={0.5}>
                    <ArrowUpIcon />
                    <Text size={FontSize.L} color={Color.MusicDAOTightGreen} ml={0.5} bold>-3.2%</Text>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box display="flex" flexDirection="column" className={classnames(commonClasses.card, classes.card)} height="100%">
                <Box display="flex" flexDirection="column">
                  <Box display="flex" flexDirection="row" mb={2}>
                    <Box display="flex" bgcolor="#F0F5F8" borderRadius={77} p={0.5}>
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
                  <Text size={FontSize.XXL} bold>Liquidity intervals</Text>
                </Box>
                <Box>
                  <StyledDivider type="solid" margin={2} />
                </Box>
                <Box flex={1}>
                  {liquidityConfig && <PrintChart config={liquidityConfig} canvasHeight={200} />}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box display="flex" flexDirection="column" mt={4} mb={4}>
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text size={FontSize.XXL} bold>Transactions</Text>
            <SecondaryButton className={commonClasses.showAll} size="medium" radius={29}>
              Show All
              <Box position="absolute" flexDirection="row" top={0} right={0} pr={2}>
                <ArrowLeftIcon />
              </Box>
            </SecondaryButton>
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="flex-start" mt={5}>
            <Box display="flex" flexDirection="row" alignItems="center" bgcolor={Color.MusicDAOLightGreen} borderRadius={77} p={0.5} >
              {TransactionTypes.map((item, index) => (
                <button
                  key={`transaction-button-${index}`}
                  className={`${commonClasses.groupButton} ${item === transactionType && commonClasses.selectedGroupButton}`}
                  onClick={handleChangeTransaction(item)}
                >
                  {item}
                </button>
              ))}
            </Box>
          </Box>
        </Box>
        <TableContainer className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">All</TableCell>
                <TableCell align="center">Range Min</TableCell>
                <TableCell align="center">Range Max</TableCell>
                <TableCell align="center">Total Amount</TableCell>
                <TableCell align="center">Account</TableCell>
                <TableCell align="center">Time</TableCell>
                <TableCell align="center">Token</TableCell>
                <TableCell align="center">Etherscan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Transactions.map((transaction, index) => (
                <TableRow key={`transaction-${index}`} >
                  <TableCell align="center" className={classes.tableHightlight}>
                    Add {transaction.Token}
                  </TableCell>
                  <TableCell align="center">
                    {transaction.RangeMin}k
                  </TableCell>
                  <TableCell align="center">
                    {transaction.RangeMax}k
                  </TableCell>
                  <TableCell align="center">
                    {transaction.TotalAmount}k
                  </TableCell>
                  <TableCell align="center" className={classes.tableHightlight}>
                    {transaction.Account}
                  </TableCell>
                  <TableCell align="center">
                    {transaction.Time}
                  </TableCell>
                  <TableCell align="center">
                    <img src={require(`assets/tokenImages/${transaction.Token}.png`)} width={24} alt="token" />
                  </TableCell>
                  <TableCell align="center">
                    <EtherScanIcon />
                  </TableCell>
                </TableRow>
              ))}
              {/* ) : (
                <TableRow>
                  <TableCell align="center">No members</TableCell>
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <Box height="1px" />
        <AddLiquidityModal
          open={openAddLiquidityModal}
          handleClose={handleCloseAddLiquidityModal}
        />
      </Box>
    </Box>
  )
}
