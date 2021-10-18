import React from "react";
import { Box, Grid, makeStyles, TableContainer, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { FontSize, Color, StyledDivider, SecondaryButton, PrimaryButton } from "shared/ui-kit";
import PoolCard from "components/PriviMusicDao/components/PoolCard";
import { ArrowUpIcon, EtherScanIcon } from "components/PriviMusicDao/components/Icons/SvgIcons";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { ArrowLeftIcon, BackIcon } from "../GovernancePage/styles";
import { useHistory } from "react-router-dom";
import AddLiquidityModal from "components/PriviMusicDao/modals/AddLiquidity";

const useStyles = makeStyles((theme) => ({
  container: {
    background: "linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #F0F5F8 96.61%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)",
    height: "100%",
    padding: "30px 45px",
  },
  table: {
    borderRadius: 12,
    background: Color.White,
    marginBottom: 40,
    "& .MuiTableCell-root": {
      fontSize: 14,
      color: Color.MusicDAODark
    },
    "& .MuiTableCell-root.MuiTableCell-head": {
      borderBottom: `1px solid ${Color.MusicDAOGreen}`,
    },
    "& .MuiTableCell-head": {
      fontWeight: "bold",
    },
  },
  tableHightlight: {
    fontWeight: 600,
    fontSize: "16px !important",
    color: `${Color.MusicDAOGreen} !important`,
  }
}));

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


export default function LiquidityPosition() {
  const classes = useStyles();
  const commonClasses = priviMusicDaoPageStyles();

  const history = useHistory();

  const [liquidityType, setLiquidityType] = React.useState<string>(LiquidityIntervals[0]);
  const [transactionType, setTransactionType] = React.useState<string>(TransactionTypes[0]);

  const [liquidityConfig, setLiquidityConfig] = React.useState<any>();

  const [openAddLiquidityModal, setOpenAddLiquidityModal] = React.useState<boolean>(false);

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
      <Box mt={5} display="flex" flexDirection="row" className={commonClasses.backButton} onClick={() => history.goBack()}>
        <BackIcon />
        <Text ml={1} color={Color.White} bold>BACK</Text>
      </Box>
      <Box display="flex" flexDirection="column" mt={4}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mb={6}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <img src={require("assets/tokenImages/USDT.png")} alt="token" width={50} />
            <Box display="flex" flexDirection="column" ml={2}>
              <Text size={FontSize.H3} color={Color.White} bold>USDT Liquidity Position</Text>
              <Text size={FontSize.XL} color={Color.White}>$ 1.456 USD Tether</Text>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center">
            <SecondaryButton size="medium" className={commonClasses.secondaryButton}>Unstake</SecondaryButton>
            <PrimaryButton size="medium" className={commonClasses.primaryButton}>Borrow</PrimaryButton>
          </Box>
        </Box>
      </Box>
      <Box className={commonClasses.card} px={4} py={4} mb={4}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" px={2}>
          <Text>Pool</Text>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Text mr={2} bold>USDT</Text>
            <img src={require("assets/tokenImages/USDT.png")} alt="token" width={28} />
          </Box>
        </Box>
        <StyledDivider type="solid" margin={2} />
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" px={2}>
          <Text>Liquidity</Text>
          <Text bold>$ 1.456</Text>
        </Box>
        <StyledDivider type="solid" margin={2} />
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" px={2}>
          <Text>Interval</Text>
          <Text bold>12-24hours</Text>
        </Box>
        <StyledDivider type="solid" margin={2} />
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" px={2}>
          <Text>Date</Text>
          <Text bold>23/06/2021</Text>
        </Box>
        <StyledDivider type="solid" margin={2} />
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" px={2}>
          <Text>Rewards Accumulated</Text>
          <Text bold>245 USDT</Text>
        </Box>
      </Box>
      <Text size={FontSize.XXL} bold>Borrowed Liquidity Positions</Text>
      <Box display="flex" flexDirection="row" justifyContent="space-between" mt={3}>
        <Box className={commonClasses.card} width={"48%"} px={4} py={4}>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" px={2}>
            <Text>Borrowed funds</Text>
            <Text bold>$ 1.456</Text>
          </Box>
          <StyledDivider type="solid" margin={2} />
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" px={2}>
            <Text>Date</Text>
            <Text bold>23/06/2021</Text>
          </Box>
          <StyledDivider type="solid" margin={2} />
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" px={2}>
            <Text>Amount to repay</Text>
            <Text bold>245 USDT</Text>
          </Box>
          <StyledDivider type="solid" margin={2} />
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" px={2}>
            <Text>Time to repay</Text>
            <Text bold>20 Days, 22h 12m 10s</Text>
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="flex-end" mt={3}>
            <PrimaryButton size="medium" className={commonClasses.primaryButton}>Repay</PrimaryButton>
          </Box>
        </Box>
        <Box className={commonClasses.card} width={"48%"} px={4} py={4}>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" px={2}>
            <Text>Borrowed funds</Text>
            <Text bold>$ 1.456</Text>
          </Box>
          <StyledDivider type="solid" margin={2} />
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" px={2}>
            <Text>Date</Text>
            <Text bold>23/06/2021</Text>
          </Box>
          <StyledDivider type="solid" margin={2} />
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" px={2}>
            <Text>Amount to repay</Text>
            <Text bold>245 USDT</Text>
          </Box>
          <StyledDivider type="solid" margin={2} />
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" px={2}>
            <Text>Time to repay</Text>
            <Text bold>20 Days, 22h 12m 10s</Text>
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="flex-end" mt={3}>
            <PrimaryButton size="medium" className={commonClasses.primaryButton}>Repay</PrimaryButton>
          </Box>
        </Box>
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
        <Box display="flex" flexDirection="row" mt={5}>
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
  )
}
