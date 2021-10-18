import React, { useState } from "react";
import Ticker from "react-ticker";
import PrintChart from "shared/ui-kit/Chart/Chart";
import URL from "shared/functions/getURL";
import { formatNumber } from "shared/functions/commonFunctions";
import "./Profile-Chart.css";

const sampleList = [
  {
    Token: "ETH",
    Name: "EThereum",
    Type: "CRYPTO",
    Price: 1800,
    ChangeRate: 0.1,
  },
  {
    Token: "PRIVI",
    Name: "PRIVI Coin",
    Type: "CRYPTO",
    Price: 0.01,
    ChangeRate: -0.05,
  },
];

const PrintTicker = tokenList => {
  const [tickerMove, setTickerMove] = useState<boolean>(true);
  return (
    <Ticker direction="toRight" move={tickerMove}>
      {({ index }) => (
        <div
          className="flex"
          onMouseOver={() => {
            setTickerMove(false);
          }}
          onMouseLeave={() => {
            setTickerMove(true);
          }}
        >
          {tokenList.map((tokenObj, index) => {
            return (
              <div key={index} className="mr-24 items-center flex ">
                <div className="flex items-center">
                  <div
                    className="token-image"
                    style={{
                      backgroundImage:
                        tokenObj.Type === "CRYPTO"
                          ? `url(${require(`assets/tokenImages/${tokenObj.Token}.png`)})`
                          : `url(${URL()}/wallet/getTokenPhoto/${tokenObj.Token})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="ml-2">
                    <span className="text-gray-700">{tokenObj.Token ?? ""}</span>
                    <span className="block text-xs text-gray-400">{tokenObj.Name ?? ""}</span>
                  </div>
                </div>
                <div className="ml20px flex flex-col .items-start">
                  <span className="font-bold text-gray-700">
                    {tokenObj.Price !== undefined ? formatNumber(tokenObj.Price, "USD", 4) : "0$"}
                  </span>
                  <span className="text-xs text-green-400">
                    {tokenObj.ChangeRate && tokenObj.ChangeRate > 0 ? "+" : ""}
                    {tokenObj.ChangeRate * 100 ?? 0}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Ticker>
  );
};

const PrintProfileChart = (config, tokenList = sampleList) => {
  let todayPrice: any = 0;
  let yesterdayPrice: any = 0;
  if (config.config) {
    const data = config.config.data.datasets[0].data;
    if (data.length) {
      todayPrice = parseFloat(data[data.length - 1].y).toFixed(3);
      yesterdayPrice = parseFloat(data[data.length - 2].y).toFixed(3);
    }
  }

  return (
    <div className="mt-5">
      {PrintTicker(tokenList)}
      <div className="mt-5 profile-chart-container" style={{height: "250px"}}>
        <PrintChart config={config} />
        <div className="chart-banner">
          <div className="title">Estimated Balance</div>
          <div className="content">
            <div className="current">{todayPrice} ETH</div>
            <div className="different">
              {yesterdayPrice} ({todayPrice - yesterdayPrice && "+"}
              {yesterdayPrice ? Math.floor(((todayPrice - yesterdayPrice) / yesterdayPrice) * 100) : 100}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintProfileChart;
