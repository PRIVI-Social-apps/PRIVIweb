import React from "react";

import PrintChart from "shared/ui-kit/Chart/Chart";
import { datapChartStyles } from './DATApChart.styles';

const PrintDATApChart = config => {
  const classes = datapChartStyles();

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
    <div className={classes.root}>
      <div className={classes.datapChartContainer}>
        <PrintChart config={config} />
        <div className={classes.chartBanner}>
          <div className={classes.content}>
            <div className={classes.current}>{todayPrice} USDp</div>
            <div className={classes.different}>
              {yesterdayPrice} ({todayPrice - yesterdayPrice && "+"}
              {yesterdayPrice ? Math.floor(((todayPrice - yesterdayPrice) / yesterdayPrice) * 100) : 100}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintDATApChart;
