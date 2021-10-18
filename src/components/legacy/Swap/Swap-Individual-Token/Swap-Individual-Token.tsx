import React, { useEffect, useState } from "react";
import "./Swap-Individual-Token.css";
import "../Swap-Main.css";
import HeaderSwap from "../components/Header-Swap/Header-Swap";
import Graph from "shared/ui-kit/Page-components/Graph";
import AddLiquiditySwapModal from "../components/Add-Liquidity-Swap-Modal/Add-Liquidity-Swap-Modal";

import axios from "axios";
import URL from "shared/functions/getURL";
import { trackPromise } from "react-promise-tracker";
import { formatNumber } from "shared/functions/commonFunctions";
import SwapModal from "../components/Swap-Modal/Swap-Modal";
const plusSquareIcon = require("assets/icons/plus_square_icon.png");

const SwapIndividualToken = React.memo((props: any) => {

  const [poolToken, setPoolToken] = useState<string>("");
  const [otherLiquidityPools, setOtherLiquidityPools] = useState<any[]>([]);
  const [otherTokensList, setOtherTokensList] = useState<string[]>([]);
  const [liquidityPool, setLiquidityPool] = useState<any>({});
  const [liquidityState, setLiquidtyState] = useState<string>("");
  const [totalLiquidity, setTotalLiquidity] = useState<Number>(0);
  const [totalReward, setTotalReward] = useState<Number>(0);
  const [numTransactions, setNumTransactons] = useState<Number>(0);

  const [liquidityHistory, setLiquidityHistory] = useState<any[]>([]);
  const [rewardHistory, setRewardHistory] = useState<any[]>([]);

  const [poolBalances, setPoolBalances] = useState<any>({});

  const [openModalAddLiquidity, setOpenModalAddLiquidity] = useState<boolean>(
    false
  );
  const handleOpenModalAddLiquidity = () => {
    setOpenModalAddLiquidity(true);
  };
  const handleCloseModalAddLiquidity = () => {
    setOpenModalAddLiquidity(false);
  };
  const [openModalSwap, setOpenModalSwap] = useState<boolean>(false);
  const handleOpenModalSwap = () => {
    setOpenModalSwap(true);
  };
  const handleCloseModalSwap = () => {
    setOpenModalSwap(false);
  };

  const loadData = () => {
    // get pool data
    trackPromise(
      axios
        .get(`${URL()}/liquidityPool/getLiquidityPool/${poolToken}`)
        .then((res) => {
          const resp = res.data;
          let newLiquidityState = "";
          if (resp.success) {
            const pool = resp.data;
            setLiquidityPool(pool);
            if (pool.IsProtected) newLiquidityState = "PROTECTED";
            else newLiquidityState = pool.State;
            setLiquidtyState(newLiquidityState);
            setTotalLiquidity(pool.LiquidityInUSD);
            setTotalReward(pool.RewardedAmountInUSD);
          }
        })
    );
    // get other pools data
    const config = {
      params: {
        poolToken: poolToken
      }
    }
    trackPromise(
      axios
        .get(`${URL()}/liquidityPool/getOtherLiquidityPools`, config)
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            const data = resp.data;
            setOtherLiquidityPools(data);
            const newPoolBalances = {};
            const tokensList = [] as any;
            data.forEach((pool) => {
              tokensList.push(pool.PoolToken);
              newPoolBalances[pool.PoolToken] = pool.Liquidity;
            });
            setOtherTokensList(tokensList);
          }
        })
    );
    // get liquidity history
    trackPromise(
      axios
        .get(`${URL()}/liquidityPool/getLiquidityHistory/${poolToken}`)
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            const newLiquidityHistory: any[] = [];
            resp.data.forEach((obj) => {
              newLiquidityHistory.push({
                x: new Date(obj.date).toString(),
                y: obj.liquidity,
              });
            });
            setLiquidityHistory(newLiquidityHistory);
          }
        })
    );
    // get reward history
    trackPromise(
      axios
        .get(`${URL()}/liquidityPool/getRewardHistory/${poolToken}`)
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            const newRewardHistory: any[] = [];
            resp.data.forEach((obj) => {
              newRewardHistory.push({
                x: new Date(obj.date).toString(),
                y: obj.reward,
              });
            });
            setRewardHistory(newRewardHistory);
          }
        })
    );
  };

  useEffect(() => {
    if (poolToken) {
      loadData();
    }
  }, [poolToken]);

  useEffect(() => {
    let pathName = window.location.href;
    let idUrl = pathName.split("/")[6];
    setPoolToken(idUrl);
  }, []);

  return (
    <div className="swapIndividualPage">
      <HeaderSwap title={poolToken} />
      <div className="subHeaderSwapMain">
        <div className="firstRowSubHeaderSwapMain">
          <div className="firstColumnSubHeaderSwapIndividual">
            <div className="columnValuesSubHeaderSwapMain">
              <div className="headerFirstRowSubHeaderSwapMain">
                Total liquidity
              </div>
              <div className="mainValueFirstRowSubHeaderSwapMain">
                {formatNumber(totalLiquidity, "USD", 4)}
              </div>
            </div>
            <div className="columnValuesSubHeaderSwapMain">
              <div className="headerFirstRowSubHeaderSwapMain">
                Total rewards paid
              </div>
              <div className="valueFirstRowSubHeaderSwapMain">
                {formatNumber(totalReward, "USD", 4)}
              </div>
            </div>
            <div className="columnValuesSubHeaderSwapMain">
              <div className="headerFirstRowSubHeaderSwapMain">
                Transactions
              </div>
              <div className="valueFirstRowSubHeaderSwapMain">
                {numTransactions}
              </div>
            </div>
          </div>

          <div className="secondColumnSubHeaderSwapIndividual">
            <button
              className="buttonSubHeaderSwapMain addLiquidityButtonSubHeaderSwapMain"
              onClick={() => handleOpenModalAddLiquidity()}
            >
              <img
                src={plusSquareIcon}
                className="addLiquidityIconSwap"
                alt={"plus"}
              />
              Add Liquidity
            </button>
            <button
              className="buttonSubHeaderSwapMain swapButtonSubHeaderSwapMain"
              onClick={() => handleOpenModalSwap()}
            >
              Swap
            </button>
          </div>
        </div>
        <div className="secondRowSubHeaderSwapMain">
          <div className="paperGraphPriviSwapMain">
            <div className="headerLabelGraph">Total liquidity</div>
            <div className="subheaderLabelGraph">
              Liquidity {formatNumber(totalLiquidity, "USD", 4)}
            </div>
            <div className="graphPriviSwap">
              <Graph data={liquidityHistory} type={""} />
            </div>
          </div>
          <div className="paperGraphPriviSwapMain">
            <div className="headerLabelGraph">Rewards</div>
            <div className="subheaderLabelGraph">
              Total reward {formatNumber(totalReward, "USD", 4)}
            </div>
            <div className="graphPriviSwap">
              <Graph data={rewardHistory} type={""} />
            </div>
          </div>
          <div className="papersValuesPriviSwapMainDiv">
            <div className="paperValuesPriviSwapMain marginBottomPaperValues">
              <div className="headerLabelPaperValues">Acumulated rewards</div>
              <div className="valueLabelPaperValues">237 PRIVI</div>
            </div>
            <div className="paperValuesPriviSwapMain">
              <div className="headerLabelPaperValues">Swap fee</div>
              <div className="valueLabelPaperValues">1%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bodySwapIndividual">
        <div className="labelTitleSwapIndividual">Liquidity Pairs</div>
        <div>
          <div className="headerTableAllTokensSwapIndividual">
            <div className="smallColTableSwapIndividual"></div>
            <div className="mediumColTableSwapIndividual">TOKEN</div>
            <div className="mediumColTableSwapIndividual">LIQUIDITY</div>
            <div className="mediumColTableSwapIndividual">VOLUME (24H)</div>
            <div className="mediumColTableSwapIndividual">
              LIQUIDITY PROVIDERS
          </div>
            <div className="smallColTableSwapIndividual">FEES (24H)</div>
            <div className="bigColTableSwapIndividual"></div>
          </div>
          {otherLiquidityPools.map((item, i) => {
            if (item.PoolToken != poolToken)
              return (
                <BodyTableAllTokensSwapMain
                  key={i}
                  liquidityPool={item}
                  poolToken={poolToken}
                  poolBalances={poolBalances}
                  loadData={loadData}
                />
              );
          })}
        </div>
      </div>

      <AddLiquiditySwapModal
        token={poolToken}
        open={openModalAddLiquidity}
        handleClose={handleCloseModalAddLiquidity}
        handleRefresh={loadData}
      />
      <SwapModal
        open={openModalSwap}
        handleClose={handleCloseModalSwap}
        handleRefresh={loadData}
        tokenFrom={poolToken}
        tokens={otherTokensList}
        poolBalances={poolBalances}
      />
    </div>
  );
});



const BodyTableAllTokensSwapMain = (props: any) => {
  const [openModalSwap, setOpenModalSwap] = useState<boolean>(false);
  const handleOpenModalSwap = () => {
    setOpenModalSwap(true);
  };
  const handleCloseModalSwap = () => {
    setOpenModalSwap(false);
  };

  return (
    <div className="bodyTableAllTokensSwapIndividual">
      <div className="smallColTableSwapIndividual icons-overlap">
        <img
          src={require(`assets/tokenImages/${props.liquidityPool.PoolToken}.png`)}
          className="iconTokenSwapIndividual"
          alt={`${props.liquidityPool.PoolToken}`}
        />
        <img
          src={require(`assets/tokenImages/${props.poolToken}.png`)}
          className="iconTokenSwapIndividual"
          alt={`${props.poolToken}`}
        />
      </div>
      <div className="mediumColTableSwapIndividual">
        {props.poolToken}/{props.liquidityPool.PoolToken}
      </div>
      <div className="mediumColTableSwapIndividual">
        {formatNumber(props.liquidityPool.LiquidityInUSD, "USD", 4)}
      </div>
      <div className="mediumColTableSwapIndividual">
        {props.liquidityPool.PairData ? formatNumber(props.liquidityPool.PairData.DailyAccumulatedVolumeInUSD ?? 0, "USD", 4) :
          formatNumber(0, "USD", 4)}
      </div>
      <div className="mediumColTableSwapIndividual">
        {props.liquidityPool.NumProviders}
      </div>
      <div className="smallColTableSwapIndividual">
        {props.liquidityPool.PairData ? formatNumber(props.liquidityPool.PairData.DailyAccumulatedFeeInUSD ?? 0, "USD", 4) :
          formatNumber(0, "USD", 4)}
      </div>
      <div className="bigColTableSwapIndividual alignTableRightSwapIndividual">
        <button
          className="swapButtonTableSwapIndividual"
          onClick={handleOpenModalSwap}
        >
          Swap
        </button>
        <SwapModal
          open={openModalSwap}
          handleClose={handleCloseModalSwap}
          handleRefresh={props.loadData}
          tokenTo={props.liquidityPool.PoolToken}
          tokenFrom={props.poolToken}
          poolBalances={props.poolBalances}
        />
      </div>
    </div>
  );
};

export default SwapIndividualToken;
