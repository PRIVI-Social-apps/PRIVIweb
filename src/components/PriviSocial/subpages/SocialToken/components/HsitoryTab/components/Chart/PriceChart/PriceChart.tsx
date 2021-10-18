import React from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";
import "./PriceChart.css";

const PrintPriceChart = (config, token) => {
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
    <div className="mt-5 profile-chart-container">
      <PrintChart config={config} canvasHeight={250} />
      <div className="chart-banner">
        <div className="content">
          <div className="current">
            {todayPrice} {token}
          </div>
          <div className="different">
            {yesterdayPrice} ({todayPrice - yesterdayPrice && "+"}
            {yesterdayPrice ? Math.floor(((todayPrice - yesterdayPrice) / yesterdayPrice) * 100) : 100}%)
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPriceChart;
