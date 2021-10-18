import React from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";
import "./ArtistPageChart.css";

const PrintArtistPageChart = (config, total, token, title) => {
  return (
    <div className="mt-5">
      <div className={"chart-title"}>{title}</div>
      <div className="mt-5 profile-chart-container">
        <PrintChart config={config} />
        <div className="chart-banner">
          <div className="content">
            <div className="current">
              {total} {token ?? ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintArtistPageChart;
