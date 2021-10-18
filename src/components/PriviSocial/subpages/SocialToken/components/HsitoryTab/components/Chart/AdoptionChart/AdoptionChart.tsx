import React from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";
import "./AdoptionChart.css";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";

const PrintAdoptionChart = (config, fundingToken, owners) => {
  const { convertTokenToUSD } = useTokenConversion();

  let todayPrice: any = 0;
  if (config.config) {
    const data = config.config.data.datasets[0].data;
    if (data.length) {
      todayPrice = parseFloat(data[data.length - 1].y).toFixed(3);
    }
  }

  return (
    <div className={"mr-5 adoption-chart"}>
      <div className="balance">{owners} Owners</div>
      <div className="usdBalance">
        {todayPrice && fundingToken ? convertTokenToUSD(fundingToken, todayPrice).toFixed(6) : ""}
      </div>
      <div className="mt-5 chart">
        <PrintChart config={config} canvasHeight={250} />
      </div>
    </div>
  );
};

export default PrintAdoptionChart;
