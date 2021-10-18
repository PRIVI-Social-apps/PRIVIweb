import React, { useState } from "react";

import axios from "axios";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import PriviScanHistory from "components/PriviWallet/components/PriviScanHistory";
import { PrimaryButton } from "shared/ui-kit";
import { ChevronIconLeft } from "shared/ui-kit/Icons";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import Box from 'shared/ui-kit/Box';
import { PriviScanPageStyles } from "./index.styles";

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

const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
    gradient.addColorStop(1, `${config.data.datasets[index].backgroundColor}33`);
    gradient.addColorStop(0.5, `${config.data.datasets[index].backgroundColor}b0`);
    config.data.datasets[index].backgroundColor = gradient;
  }

  return config;
};

const PriviScanPage = props => {
  const classes = PriviScanPageStyles();
  const userBalances = useTypedSelector(state => state.userBalances);
  const [transactionHistory, setTransactionHistory] = useState<any>();
  const [intervalTx, setIntervalTx] = useState<any>(null);
  const [page, setPage] = useState<number>(1);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [numberOfPages, setNumberOfPages] = useState<any>(1);

  // React.useEffect(() => {
  //   getTransactions(page,page+1,10);
  //   setIntervalTx(
  //     setInterval(() => {
  //       getTransactions(page,page+1,10);
  //     }, 30000)
  //   );
  //   return () => clearInterval(intervalTx);
  // }, []);

  React.useEffect(() => {
    getTransactions(page,page+1,10);
  }, [page]);

  // React.useEffect(() => {
  //   getTransactions(page,page+1,10);
  // }, [page]);

  const getTransactions = async (initialPage, finalPage, limit) => {
    setIsDataLoading(true);
    axios
      .get(`${URL()}/privi-scan/getTransactions/${initialPage}/${finalPage}/${limit}`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          console.log(resp.data);
          setTransactionHistory(resp.data);
          setNumberOfPages(Math.ceil(resp.total_length / 10));
          setIsDataLoading(false);
        }
      })
      .catch(() => {
        setIsDataLoading(false);
      });
  }

  return (
    <Box className={classes.container}>
      <Box className={classes.subContainer}>
        <Box style={{ marginTop: "16px" }}>
          <Box className={classes.flexBoxHeader}>
            <Box width={"320px"}>
              <SearchWithCreate
                searchValue={searchValue}
                handleSearchChange={e => setSearchValue(e.target.value)}
                searchPlaceholder="Search by Address / Txn Hash / Token"
              />
            </Box>
          </Box>
          <PriviScanHistory history={transactionHistory} isDataLoading={isDataLoading} />
        </Box>
        <Box className={classes.flexBox} style={{ justifyContent: "flex-end" }}>
          <PrimaryButton size="small" onClick={() => setPage(prev => prev - 1)} disabled={page === 1}>
            <ChevronIconLeft />
          </PrimaryButton>
          <InputWithLabelAndTooltip overriedClasses={classes.inputBox} type="text" inputValue={page} />
          <Box mr={page}>/ {numberOfPages} </Box>
          <PrimaryButton size="small" onClick={() => setPage(prev => prev + 1)} disabled={page === 64}>
            <Box style={{ transform: "rotate(180deg)" }}>
              <ChevronIconLeft />
            </Box>
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};

export default PriviScanPage;
