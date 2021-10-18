import React from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";
import "./Profile-Chart.css";

const PrintProfileChart = config => {
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
      <div className="mt-5 social-profile-chart-container" style={{ height: "250px" }}>
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
