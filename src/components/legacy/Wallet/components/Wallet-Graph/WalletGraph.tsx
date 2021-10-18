import React, { useEffect, useState } from "react";
import {
  StyledMenuItem,
  StyledSelect,
} from "shared/ui-kit/Styled-components/StyledComponents";
import RadialChart from "./RadialChart";
import "./WalletGraph.css";

const periodOptions = ['Last week'];

const PrintWalletGraph = (
  cryptoBalance,
  nftBalance,
  ftBalance,
  socialBalance,
) => {
  const [balancesList, setBalancesList] = useState<any[]>([]);
  const [period, setPeriod] = useState<string>(periodOptions[0]);

  useEffect(() => {
    const bList = [] as any;
    const total = cryptoBalance + nftBalance + ftBalance + socialBalance;
    [cryptoBalance, nftBalance, ftBalance, socialBalance].forEach(
      (balance, index) => {
        bList.push({
          name:
            index === 0
              ? `Crypto 💸`
              : index === 1
                ? "NFT 🏆"
                : index === 2
                  ? "FT 👘"
                  : "Social 📸",
          balance: (balance / total) * 100,
        });
      }
    );
    bList.sort((a, b) => b.balance - a.balance);
    setBalancesList(bList);
  }, [cryptoBalance, nftBalance, ftBalance, socialBalance]);

  return (
    <div className={"wallet-graph"}>
      <div className={"title"}>
        All my assets
        <StyledSelect
          disableUnderline
          value={period}
          onChange={(e) => setPeriod(e.target.value as string)}
        >
          {["Last week"].map((option) => (
            <StyledMenuItem key={option} value={option}>
              {option}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </div>
      <div className={"content"}>
        <RadialChart list={balancesList} />
        <div className={"legend"}>
          {balancesList.map((balance, index) => (
            <div className="row" key={`balance-${index}`}>
              <span>
                <div
                  className={"colorBox"}
                  style={{
                    background: balance.name.toUpperCase().includes("CRYPTO")
                      ? "linear-gradient(180deg, #8987E7 0%, rgba(137, 135, 231, 0) 100%)"
                      : balance.name.toUpperCase().includes("NFT")
                        ? "linear-gradient(180deg, #559AF4 0%, rgba(85, 154, 244, 0) 100%)"
                        : balance.name.toUpperCase().includes("FT")
                          ? "linear-gradient(180deg, #FFC71B 0%, rgba(255, 199, 27, 0) 100%)"
                          : "linear-gradient(180deg, #27E8D9 0%, rgba(39, 232, 217, 0) 100%)",
                  }}
                />
                {balance.name}
              </span>
              <span>{`${balance.balance.toFixed(0)}%`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrintWalletGraph;
