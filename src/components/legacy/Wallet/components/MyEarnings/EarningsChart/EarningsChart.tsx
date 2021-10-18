import React from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";
import "./EarningsChart.css";

const PrintEarningsChart = config => {
  return (
    <div className="mt-5 chart">
      <PrintChart config={config} />
    </div>
  );
};

export default PrintEarningsChart;
