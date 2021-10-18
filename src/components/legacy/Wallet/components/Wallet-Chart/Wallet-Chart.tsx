import React, { useState } from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";
import "./Wallet-Chart.css";
import { formatNumber } from "shared/functions/commonFunctions";

const PrintWalletChart = (title, config, balanceInfo) => {
  const [daily, setDaily] = useState<number>(0);
  const [weekly, setWeekly] = useState<number>(0);
  const [monthly, setMonthly] = useState<number>(0);
  const [debt, setDebt] = useState<number>(0);

  return (
    <div
      className={
        title.includes("Crypto")
          ? "w-1/4 mr-5 wallet-chart crypto"
          : title.includes("NFT")
          ? "w-1/4 mr-5 wallet-chart nft"
          : title.includes("FT")
          ? "w-1/4 mr-5 wallet-chart ft"
          : "w-1/4 mr-5 wallet-chart social"
      }
    >
      <div className="title">
        <h6>Estimated Balance </h6>
        <div className={"name"}>
          {title.includes("NFT") || title.includes("MEIDA")
            ? "NFT 🏆"
            : title.includes("FT")
            ? "FT 👘"
            : title.includes("Crypto")
            ? "Crypto 💸"
            : "Social 📸"}
        </div>
      </div>
      <div className="balance">{`${formatNumber(balanceInfo.balanceInETH ?? 0, "ETH", 6)}`}</div>
      <div className="usdBalance">{`${formatNumber(balanceInfo.balanceInUSD ?? 0, "USD", 4)}`}</div>
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

export default PrintWalletChart;
