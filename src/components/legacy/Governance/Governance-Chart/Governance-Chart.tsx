import React from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";
import "./Governance-Chart.css";

const PrintGovernanceChart = (title, config) => {
  return (
    <div className="w-1/4 mr-5 governance">
      <span className="text-gray-700 text-lg font-bold">{title}</span>
      <div className="mt-5">
        <PrintChart config={config} />
      </div>
    </div>
  );
};

export default PrintGovernanceChart;
