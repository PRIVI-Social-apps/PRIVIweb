import React, { useState, useEffect } from "react";
import axios from "axios";
import URL from "shared/functions/getURL";
import TradingHistory from "shared/ui-kit/Page-components/TradingHistory";
import "shared/ui-kit/Modal/Modals/Modal.css";
import "./Investments.css";
import InvestModal from "../../modals/mediaPod/InvestModal";
import BuySellModal from "../../modals/mediaPod/BuySellModal";
import podChartConfig from "../Pod-Chart/Pod-Chart-Config";
import PrintPodChart from "../Pod-Chart/Pod-Chart";
import { formatNumber } from "shared/functions/commonFunctions";
import RadialChart from "./RadialChart";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { PrimaryButton } from "shared/ui-kit";
import { Box, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

export default function Investments(props) {
  const [modalType, setModalType] = useState<string>("sell");
  const [lastPrice, setLastPrice] = useState<number>(0);
  // used for graphs and displaying data
  const [transactions, setTransactions] = useState<any[]>([]);

  const [priceChart, setPriceChart] = useState<any>(podChartConfig(" " + props.pod.FundingToken));
  const [supplyChart, setSupplyChart] = useState<any>(podChartConfig(" " + props.pod.TokenSymbol));

  const [isChartLoading, setIsChartLoading] = useState<boolean>(false);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState<boolean>(false);

  const [marketCap, setMarketCap] = useState<string>("TKN");

  const [openInvest, setOpenInvest] = useState<boolean>(false);
  const [openBuySellModal, setOpenBuySellModal] = useState<boolean>(false);
  const handleOpenInvest = () => {
    setOpenInvest(true);
  };
  const handleCloseInvest = () => {
    setOpenInvest(false);
  };
  const handleOpenBuySellModal = type => {
    setModalType(type);
    setOpenBuySellModal(true);
  };
  const handleCloseBuySellModal = () => {
    setOpenBuySellModal(false);
  };
  const dummyData = [
    { name: "Pod owners", data: 80 },
    { name: "Investor shares", data: 10 },
    { name: "Share & Earn", data: 10 },
  ];

  useEffect(() => {
    if (props.pod.PodAddress) {
      loadData();
    }
  }, [props.pod.PodAddress]);

  const loadData = () => {
    const config = {
      params: {
        PodAddress: props.pod.PodAddress,
      },
    };
    // get pod price history for graph
    axios
      .get(`${URL()}/mediaPod/getPriceHistory`, config)
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          const data = resp.data;
          let graphData: any[] = [];
          let labels: string[] = [];
          data.forEach(point => {
            graphData.push({
              x: point.date,
              y: point.price,
            });
            labels.push(
              new Date(point.date).toLocaleString("eu", {
                day: "numeric",
                month: "numeric",
              })
            );
            const newPriceChart = { ...priceChart };
            newPriceChart.config.data.labels = labels;
            newPriceChart.config.data.datasets[0].data = graphData;
            setPriceChart(newPriceChart);
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
    // get pod supply history for graph
    axios
      .get(`${URL()}/mediaPod/getSupplyHistory`, config)
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          const data = resp.data;
          let graphData: any[] = [];
          let labels: string[] = [];
          data.forEach(point => {
            graphData.push({
              x: point.date,
              y: point.supply,
            });
            labels.push(
              new Date(point.date).toLocaleString("eu", {
                day: "numeric",
                month: "numeric",
              })
            );
          });
          const newSupplyChart = { ...supplyChart };
          newSupplyChart.config.data.labels = labels;
          newSupplyChart.config.data.datasets[0].data = graphData;
          setSupplyChart(newSupplyChart);
        }
      })
      .catch(error => {
        console.log(error);
      });
    // get pod transactions
    axios
      .get(`${URL()}/mediaPod/getMediaPodTransactions`, config)
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          const data = resp.data;
          setTransactions(data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const raisedFunds = props?.pod?.RaisedFunds ?? 0;
  const fundingTarget = props?.pod?.FundingTarget ?? 0;
  const investing = props?.pod?.Status != "FORMATION" && raisedFunds < fundingTarget;
  const buySell = props?.pod?.Status != "FORMATION" && raisedFunds >= fundingTarget;

  if (props.pod && props.pod.PodAddress)
    return (
      <div className="investments">
        <div className="buttons">
          {investing && (
            <PrimaryButton size="medium" className="invest" onClick={handleOpenInvest}>
              {" "}
              Invest{" "}
            </PrimaryButton>
          )}
          {buySell && (
            <PrimaryButton size="medium" onClick={() => handleOpenBuySellModal("buy")}>
              Buy
            </PrimaryButton>
          )}
          {buySell && (
            <PrimaryButton size="medium" onClick={() => handleOpenBuySellModal("sell")}>
              Sell
            </PrimaryButton>
          )}
          <InvestModal
            open={openInvest}
            handleClose={handleCloseInvest}
            handleRefresh={props.handleRefresh}
            pod={props.pod}
          />
          <BuySellModal
            open={openBuySellModal}
            handleClose={handleCloseBuySellModal}
            handleRefresh={props.handleRefresh}
            pod={props.pod}
            modalType={modalType}
            changeModalType={val => setModalType(val)}
          />
        </div>
        <div className="charts-wrapper">
          <div className="charts-metrics">
            <div className="market-cap">
              <h4>Market Cap</h4>
              <div className="market-cap-data">
                <RadioGroup
                  className="market-cap-data-currency"
                  value={marketCap}
                  onChange={e => {
                    setMarketCap(e.target.value);
                  }}
                >
                  {["TKN", "USD"].map((value, index) => (
                    <FormControlLabel
                      key={`value-${index}`}
                      value={value}
                      control={<Radio />}
                      label={
                        <Box
                          fontFamily="Agrandir"
                          fontSize={14}
                          color={value === marketCap ? "#7986CB" : "#707582"}
                        >
                          {value}
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
                <div className="market-cap-data-info">$28.034,908</div>
              </div>
            </div>
            <div className="investors-share">
              <div className="investors-share-title">
                <h4>Investors Share</h4>
                <h1>10%</h1>
              </div>
              <p>Shares in Graphics</p>
              <div className="investors-share-chart">
                <RadialChart list={dummyData} />
                <div className="investors-share-chart-description">
                  {dummyData.map((data, index) => (
                    <div className="investors_chart_data" key={`data-${index}`}>
                      <div
                        className="colorBox"
                        style={{
                          background: data.name.toUpperCase().includes("POD")
                            ? "linear-gradient(180deg, #8987E7 0%, rgba(137, 135, 231, 0) 100%)"
                            : data.name.toUpperCase().includes("INVESTOR")
                            ? "linear-gradient(180deg, #FFC71B 0%, rgba(255, 199, 27, 0) 100%)"
                            : "linear-gradient(180deg, #27E8D9 0%, rgba(39, 232, 217, 0) 100%)",
                        }}
                      />
                      {data.name}
                      <span>{`${data.data.toFixed(0)}%`}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="charts">
            <LoadingWrapper loading={isChartLoading}>
              <>
                {PrintPodChart(
                  "Price History",
                  `Last Price: ${formatNumber(lastPrice, props.pod.FundingToken, 4)}`,
                  priceChart
                )}
                {PrintPodChart(
                  "Supply History",
                  `Total Liquidity: ${formatNumber(props.pod.SupplyReleased ?? 0, props.pod.TokenSymbol, 4)}`,
                  supplyChart
                )}
              </>
            </LoadingWrapper>
          </div>
        </div>

        <div className="lower-section">
          <div className="trading-history">
            <div className="title">
              <h3>Transaction History</h3>
            </div>
            <LoadingWrapper loading={isTransactionsLoading}>
              <div className="content">
                <TradingHistory history={transactions} address={props.pod.PodAddress} />
              </div>
            </LoadingWrapper>
          </div>
        </div>
      </div>
    );
  else return <p>Error displaying pod data</p>;
}
