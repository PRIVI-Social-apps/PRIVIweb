import React, { useState } from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";
import "./DigitalChart.css";

const DigitalChart = (title, config) => {
  const [daily, setDaily] = useState<number>(0);
  const [weekly, setWeekly] = useState<number>(0);
  const [monthly, setMonthly] = useState<number>(0);
  const [debt, setDebt] = useState<number>(0);

  return (
    <div className={title.includes("Fraction") ? "w-1/2 digital-chart crypto" : "w-1/2 digital-chart shared"}>
      <div className="title">
        <h6>{title}</h6>
      </div>
      <div className="mt-5 chart">
        <PrintChart config={config} />
      </div>
      <div className={"bottom-table"}>
        <div className={"returns"}>
          <div className="header">Returns</div>
          <div className="columns">
            <div className="col">
              <span>Daily</span>
              <p>{`$ ${daily}`}</p>
            </div>
            <div className="col">
              <span>Weekly</span>
              <p>{`$ ${weekly}`}</p>
            </div>
            <div className="col">
              <span>Monthly</span>
              <p>{`$ ${monthly}`}</p>
            </div>
          </div>
        </div>
        <div className={"debt"}>
          <div className="header">Debt</div>
          <div className="columns">
            <div className="col">
              <span>Debt</span>
              <p>{`$ ${debt}`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalChart;
