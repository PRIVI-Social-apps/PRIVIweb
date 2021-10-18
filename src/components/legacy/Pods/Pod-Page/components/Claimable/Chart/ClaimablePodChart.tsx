import React from "react";
import { makeStyles, createStyles } from "@material-ui/core";
import PrintChart from "shared/ui-kit/Chart/Chart";
import "./ClaimablePodChart.css";

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      fontSize: 18,
      lineHeight: '105%',
      color: '#181818'
    }
  })
);

const PrintClaimablePodChart = (config, total, token, title) => {
  return (
    <div className="mt-5">
      <div className={"chart-title"}>{title}</div>
      <div className="mt-5 profile-chart-container">
        <PrintChart config={config} />
        <div className="chart-banner">
          <div className="content">
            <div className="current">
              {total} {token ?? "6.588"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintClaimablePodChart;
