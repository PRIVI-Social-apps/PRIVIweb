import React from "react";
import { Box, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { FontSize, Color, StyledDivider, SecondaryButton } from "shared/ui-kit";
import { EtherScanIcon } from "components/PriviMusicDao/components/Icons/SvgIcons";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { ArrowLeftIcon } from "../GovernancePage/styles";
import { tradeTraxPageStyles } from "./index.styles";
import InputWithButton from "shared/ui-kit/inputs/InputWithButton";
import { Dropdown } from "shared/ui-kit/Dropdown";
import testAdImage from "assets/backgrounds/digital.jpeg";
import { ReactComponent as DropUpIcon } from "assets/icons/arrow-left.svg";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
const infoIcon = require("assets/icons/info.svg");

const Transactions = [
  { Token: 'USDT', Price: '24424,22', RangeMax: 84.3, TotalAmount: 24.4, Address: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'ETH', Price: '24424,22', RangeMax: 84.3, TotalAmount: 24.4, Address: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'BNB', Price: '24424,22', RangeMax: 84.3, TotalAmount: 24.4, Address: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'BAL', Price: '24424,22', RangeMax: 84.3, TotalAmount: 24.4, Address: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'USDT', Price: '24424,22', RangeMax: 84.3, TotalAmount: 24.4, Address: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'BNB', Price: '24424,22', RangeMax: 84.3, TotalAmount: 24.4, Address: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'USDT', Price: '24424,22', RangeMax: 84.3, TotalAmount: 24.4, Address: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'USDT', Price: '24424,22', RangeMax: 84.3, TotalAmount: 24.4, Address: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'ETH', Price: '24424,22', RangeMax: 84.3, TotalAmount: 24.4, Address: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'USDT', Price: '24424,22', RangeMax: 84.3, TotalAmount: 24.4, Address: '0xcD242...294', Time: '1 minute ago' },
  { Token: 'BNB', Price: '24424,22', RangeMax: 84.3, TotalAmount: 24.4, Address: '0xcD242...294', Time: '1 minute ago' },
];
const TransactionTypes = ['All', 'Buy', 'Sell'];

const HourLabels: any[] = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
const DayLabels: any[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const YearLabels: any[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FreeHoursChartConfig = {
  config: {
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          type: "line",
          data: [
            { x: "Jan", y: 1 },
            { x: "Feb", y: 10 },
            { x: "Mar", y: 20 },
            { x: "Apr", y: 15 },
            { x: "May", y: 13 },
            { x: "Jun", y: 10 },
          ],
          backgroundColor: "#C6F2E4",
          borderColor: "#03CD94",
          pointBorderColor: "#F2FAF6",
          pointBackgroundColor: "#03CD94",
          pointHoverBackgroundColor: "#0FCEA6",
          borderWidth: 2,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: "#F5FCF8",
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
            display: true,
            gridLines: {
              color: "#000;",
              lineWidth: 50,
            },
            ticks: {
              autoSkip: true,
              fontColor: "#6B6B6B",
              fontFamily: "Agrandir",
            },
          },
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              color: "#DAE6E5",
            },
            ticks: {
              display: false,
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
  // configurer: (config: any, ref: CanvasRenderingContext2D): object => {
  //   let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight + 300);
  //   gradient.addColorStop(1, "#c4c4c433");
  //   gradient.addColorStop(0.5, "#27e8d9b0");
  //   config.data.datasets[0].backgroundColor = gradient;

  //   return config;
  // },
};

const Periods = ['1D', '7D', 'YTD'];

export default function TradeTraxPage() {
  const classes = tradeTraxPageStyles();
  const commonClasses = priviMusicDaoPageStyles();

  const [useBalance, setUseBalance] = React.useState<number>(0.0);
  const [transactionType, setTransactionType] = React.useState<string>(TransactionTypes[0]);
  const [period, setPeriod] = React.useState<string>(Periods[0]);

  const [traxpConfig, setTraxpConfig] = React.useState<any>();

  const [tableHeaders, setTableHeaders] = React.useState<Array<CustomTableHeaderInfo>>([
    { headerName: 'All', headerAlign: 'center' },
    { headerName: 'Amount TRAX', headerAlign: 'center' },
    { headerName: 'Address', headerAlign: 'center' },
    { headerName: 'Price', headerAlign: 'center' },
    { headerName: 'Time', headerAlign: 'center' },
    { headerName: 'Token', headerAlign: 'center' },
    { headerName: 'PriviScan', headerAlign: 'center' },
  ]);
  const [tableData, setTableData] = React.useState<Array<Array<CustomTableCellInfo>>>([]);

  React.useEffect(() => {
    const newTraxpConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newTraxpConfig.config.data.labels = (period === '1D')? HourLabels : (period === '7D')? DayLabels : YearLabels;
    newTraxpConfig.config.data.datasets[0].data = (period === '1D')
      ? [10, 40, 65, 80, 120, 230, 210, 140, 165, 180, 120, 230, 110, 140, 65, 80, 120, 230, 10, 40, 65, 80, 120, 230, 10, 40, 65]
        : (period === '7D')
        ? [150, 140, 185, 90, 120, 230, 210]
        : [140, 165, 180, 120, 230, 110, 140, 65, 80, 120, 230, 10];

    setTraxpConfig(newTraxpConfig);
  }, [period]);

  React.useEffect(() => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    if (Transactions) {
      Transactions.map((transaction, index) => {
        const row: Array<CustomTableCellInfo> = [];
        row.push({
          cell: (<div style={{fontWeight: 600, color: Color.MusicDAOGreen}}>Buy {transaction.Token}</div>),
          cellAlign: 'center',
        }, {
          cell: (<>{transaction.TotalAmount} TRAX</>),
          cellAlign: 'center',
        }, {
          cell: (<div style={{fontWeight: 500, color: Color.MusicDAOGreen}}>{transaction.Address}</div>),
          cellAlign: 'center',
        }, {
          cell: (<div>{transaction.Price} USDp</div>),
          cellAlign: 'center',
        }, {
          cell: (<div>{transaction.Time}</div>),
          cellAlign: 'center',
        }, {
          cell: (<div><img src={require(`assets/tokenImages/${transaction.Token}.png`)} width={24} alt="token" /></div>),
          cellAlign: 'center',
        }, {
          cell: (<div><EtherScanIcon /></div>),
          cellAlign: 'center',
        },);
        tableData.push(row);
      });
    }
    setTableData(tableData);
  }, [Transactions]);

  const handleChangeTransaction = (type: string) => () => {
    setTransactionType(type);
  }

  const handleChangePeriod = (period: string) => () => {
    setPeriod(period);
  }

  const onUseBalanceChange = () => {
  }

  const useMaxBalanceClicked = () => {
  }

  console.log('---period---', period);
  return (
    <Box className={classes.body}>
      <Box className={classes.container}>
      <Box display="flex" flexDirection="column" mt={4} className={classes.topBox}>
        <h1>Trade Trax</h1>
        <Box display="flex" flexDirection="row" alignItems="center" className={classes.tradeInfoBox}>
          <Box>
            <h2>I have</h2>
            <Box display="flex" flexDirection="row" alignItems="center" className={classes.balanceWithSelect}>
              <InputWithButton
                value={useBalance}
                additionalNode={
                  <Text onClick={useMaxBalanceClicked} className={classes.maxButton}>Use Max</Text>
                }
                handleInputChange={onUseBalanceChange}
              />
              <Dropdown className={classes.currencyUnit}>
                <div key="closed" className={classes.dropdownItem}>
                  <img src={testAdImage} alt="" />
                  <span>Privi</span>
                </div>
                <div
                  key="opened"
                  className={classes.dropdownContent}
                >
                  <div className={classes.dropdownItem}>
                    <img src={testAdImage} alt="" />
                    <span>Privi</span>
                  </div>
                  <div className={classes.dropdownItem}>
                    <img src={testAdImage} alt="" />
                    <span>DATAp</span>
                  </div>
                </div>
              </Dropdown>
              <div className={classes.exchangeButton}>
                <DropUpIcon />
                <DropUpIcon className="ex-arrwo-right" />
              </div>
            </Box>
            <span>Balance: 4555 USDp</span>
          </Box>
          <Box display="flex" flexDirection="column" className={classes.exchangeValue}>
            <h2>I will get</h2>
            <InputWithButton
              value={useBalance}
              additionalNode={
                <Text onClick={useMaxBalanceClicked} className={classes.maxButton}>Use Max</Text>
              }
              handleInputChange={onUseBalanceChange}
            />
            <Box height={23} />
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <button className={classes.tradeButton}>Trade Now</button>
          <p className={classes.tradeDescription}>The current minimum staking period is 30 days. <img src={infoIcon} alt={"info"} /></p>
        </Box>
      </Box>

      <Grid container spacing={4} direction="row" className={classes.priceInfo}>
        <Grid item md={6}>
          <Box display="flex" flexDirection="column">
            <h1>Privi - USDT</h1>
            <Box display="flex" flexDirection="row" className={classes.priceWrapper}>
              <Box display="flex" flexDirection="column" mr={4}>
                <span className={classes.title}>Price</span>
                <h2>$34</h2>
                <span className={classes.compareGreen}>+3 (+11.5%)</span>
              </Box>
              <Box display="flex" flexDirection="column">
                <span className={classes.title}>Total Supply</span>
                <h2>$1,897,007</h2>
                <span className={classes.compareGreen}>+3787 (+1.5%)</span>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item md={6}>
          <Box display="flex" flexDirection="column">
            <h1>TRAXp- USDT</h1>
            <Box display="flex" flexDirection="row" className={classes.priceWrapper}>
              <Box display="flex" flexDirection="column" mr={4}>
                <span className={classes.title}>Price</span>
                <h2>$0,6</h2>
                <span className={classes.compareRed}>-0.1 (-0.01%)</span>
              </Box>
              <Box display="flex" flexDirection="column">
                <span className={classes.title}>Total Supply</span>
                <h2>$812,587</h2>
                <span className={classes.compareRed}>-3787 (-1.5%)</span>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box className={classes.chartContainer} display="flex" flexDirection="row" mt={8}>
        <Box width={1} mr={2} px={3.5} py={5}>
          <Box display="flex" flexDirection="row" justifyContent="space-between">
            <Box display="flex" flexDirection="row" alignItems="center">
              <Text mr={1} size={FontSize.H4}>TRAXp -</Text>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center" bgcolor="#F0F5F8" borderRadius={77} p={0.5}>
              {Periods.map((item, index) => (
                <button
                  key={`period-button-${index}`}
                  className={`${commonClasses.groupButton} ${item === period && commonClasses.selectedGroupButton}`}
                  onClick={handleChangePeriod(item)}
                >
                  {item}
                </button>
              ))}
            </Box>
          </Box>
          <Box mt={4}>
            <StyledDivider type="solid" />
          </Box>
          <Box className={classes.chartWrapper}>
            <Box display="flex" flexDirection="column" className={classes.chartInfo}>
              <Text size={FontSize.XXL}>126,487 USDp</Text>
              <Text size={FontSize.M} bold color={Color.Green}>+2.544 (+7%)</Text>
            </Box>
            {traxpConfig && <PrintChart config={traxpConfig} />}
          </Box>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" mt={8} mb={4}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text size={FontSize.XXL} bold>Transactions</Text>
          <SecondaryButton className={classes.showAll} size="medium" radius={29}>
            Show All
            <Box position="absolute" flexDirection="row" top={0} right={0} pr={2}>
              <ArrowLeftIcon />
            </Box>
          </SecondaryButton>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="flex-start" mt={3}>
          <Box display="flex" flexDirection="row" alignItems="center" bgcolor={Color.MusicDAOLightGreen} borderRadius={77} p={0.5} className={classes.periodButtons}>
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

      <div className={classes.table}>
        <CustomTable
          headers={tableHeaders}
          rows={tableData}
          placeholderText="No transactions."
        />
      </div>
      <Box height="1px" />
    </Box>
    </Box>
  )
}
