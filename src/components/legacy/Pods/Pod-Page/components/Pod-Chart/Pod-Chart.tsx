import React from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";
import "./Pod-Chart.css";

const PrintPodChart = (title, subtitle, config) => {
  return (
    <div className="mr-5 chart">
      <p className="text-gray-700 text-lg font-bold">{title}</p>
      <span>{subtitle}</span>
      <div className="mt-5">
        <PrintChart config={config} />
      </div>
    </div>
  );
};

export default PrintPodChart;
