import "./Swap-Main.css";
import React, { useEffect, useState } from "react";
import { sampleGraphData } from "../Wallet/sampleData";
import Graph from "shared/ui-kit/Page-components/Graph";
// import HeaderSwap from "./components/Header-Swap/Header-Swap";
import SwapModal from "./components/Swap-Modal/Swap-Modal";
import AddLiquiditySwapModal from "./components/Add-Liquidity-Swap-Modal/Add-Liquidity-Swap-Modal";
import BodyTableAllTokensSwapMain from "./components/BodyTableAllTokensSwapMain";

import axios from "axios";
import URL from "shared/functions/getURL";
import { trackPromise } from "react-promise-tracker";

import { formatNumber } from "shared/functions/commonFunctions";
import { connect } from 'react-redux';

const plusSquareIcon = require("assets/icons/plus_square_icon.png");


const arePropsEqual = (prevProps, currProps) => prevProps.user === currProps.user;

const SwapMain = React.memo((props: any) => {
  // HOOKS
  const [openModalSwap, setOpenModalSwap] = useState<boolean>(false);
  const [openModalAddLiquidity, setOpenModalAddLiquidity] = useState<boolean>(
    false
  );
  const [liquidityPools, setLiquidityPools] = useState<any[]>([]);

  const [poolBalances, setPoolBalances] = useState<any>({});
  const [liquidityStates, setLiquidityStates] = useState<any>({}); // PROPOSED, LISTED, PROTECTED

  const [totalLiquidity, setTotalLiquidity] = useState<Number>(0);
  const [totalReward, setTotalReward] = useState<Number>(0);
  const [tokenList, setTokenList] = useState<String[]>([]);
  const [
    mostSwappedLiquidityPool,
    setMostSwappedLiquidityPool,
  ] = useState<String>("");

  // FUNCTIONS
  const loadData = () => {
    // get liquidity pools and values for fields
    trackPromise(
      axios.get(`${URL()}/liquidityPool/getLiquidityPools`).then((res) => {
        const resp = res.data;
        let newTotalLiquidity = 0; // total liquidity
        let newTotalReward = 0; // total reward
        const newTokenList: string[] = []; // list of liquidity tokens
        let newMostSwapped = ""; // most swapped token
        let numSwapped = 0;
        const newLiquidityStates = {};
        const newPoolBalances = {};

        const newLiquidityPools = resp.data; // array of liquidity pool objs
        if (resp.success) {
          if (newLiquidityPools.length > 0) {
            newMostSwapped = newLiquidityPools[0].PoolToken;
            numSwapped = newLiquidityPools[0].Swaps
              ? Object.keys(newLiquidityPools[0].Swaps).length
              : 0;
          }
          newLiquidityPools.forEach((pool) => {
            newPoolBalances[pool.PoolToken] = pool.Liquidity ?? 0;
            newTotalLiquidity += pool.LiquidityInUSD ?? 0;
            newTotalReward += pool.RewardedAmountInUSD ?? 0;
            if (pool.Swaps && Object.keys(pool.Swaps).length > numSwapped) {
              newMostSwapped = pool.PoolToken;
              numSwapped = Object.keys(pool.Swaps).length;
            }
            newTokenList.push(pool.PoolToken);
            if (pool.IsProtected)
              newLiquidityStates[pool.PoolToken] = "PROTECTED";
            else newLiquidityStates[pool.PoolToken] = pool.State;
          });
        }
        setPoolBalances(newPoolBalances);
        setLiquidityPools(newLiquidityPools);
        setMostSwappedLiquidityPool(newMostSwapped);
        setTotalLiquidity(newTotalLiquidity);
        setTotalReward(newTotalReward);
        setTokenList(newTokenList);
        setLiquidityStates(newLiquidityStates);
      })
    );
  };

  useEffect(() => {
    loadData();
  }, [props.user]);

  const handleOpenModalAddLiquidity = () => {
    setOpenModalAddLiquidity(true);
  };

  const handleOpenModalSwap = () => {
    setOpenModalSwap(true);
  };

  const handleCloseModalAddLiquidity = () => {
    setOpenModalAddLiquidity(false);
  };

  const handleCloseModalSwap = () => {
    setOpenModalSwap(false);
  };

  return (
    <div className="swapMainPage">
      <div className="swap-content">
        <div className="subHeaderSwapMain">
          <div className="firstRowSubHeaderSwapMain">
            <div className="firstColumnSubHeaderSwapMain">
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
                  {formatNumber(totalReward, "USD", 4)} PRIVI
              </div>
              </div>
              <div className="columnValuesSubHeaderSwapMain">
                <div className="headerFirstRowSubHeaderSwapMain">Assets</div>
                <div className="valueFirstRowSubHeaderSwapMain">
                  {liquidityPools.length}
                </div>
              </div>
            </div>
            <div className="secondColumnSubHeaderSwapMain">
              <div className="headerFirstRowSubHeaderSwapMain">
                Most swapped assets
            </div>
              <div className="valueFirstRowSubHeaderSwapMain">
                {mostSwappedLiquidityPool.length > 0
                  ? mostSwappedLiquidityPool
                  : "N/A"}
              </div>
            </div>
            <div className="thirdColumnSubHeaderSwapMain">
              <button
                className="buttonSubHeaderSwapMain addLiquidityButtonSubHeaderSwapMain"
                onClick={handleOpenModalAddLiquidity}
              >
                <img
                  src={plusSquareIcon}
                  className="addLiquidityIconSwap"
                  alt={"plus"}
                />
              Add Liquidity
            </button>
              <AddLiquiditySwapModal
                tokens={tokenList}
                open={openModalAddLiquidity}
                handleClose={handleCloseModalAddLiquidity}
                handleRefresh={loadData}
              />
              <button
                className="buttonSubHeaderSwapMain swapButtonSubHeaderSwapMain"
                onClick={handleOpenModalSwap}
              >
                Swap
            </button>
              <SwapModal
                liquidityStates={liquidityStates}
                tokens={tokenList}
                poolBalances={poolBalances}
                open={openModalSwap}
                handleClose={handleCloseModalSwap}
                handleRefresh={loadData}
              />
            </div>
          </div>
          <div className="secondRowSubHeaderSwapMain">
            <div className="paperGraphPriviSwapMain">
              <div className="headerLabelGraph">Total liquidity</div>
              <div className="subheaderLabelGraph">Liquidity 450,000 PRIVI</div>
              <div className="graphPriviSwap">
                <Graph data={sampleGraphData} type={""} />
              </div>
            </div>
            <div className="paperGraphPriviSwapMain">
              <div className="headerLabelGraph">Rewards</div>
              <div className="subheaderLabelGraph">Total reward 25,834 PRIVI</div>
              <div className="graphPriviSwap">
                <Graph data={sampleGraphData} type={""} />
              </div>
            </div>
            <div className="papersValuesPriviSwapMainDiv">
              <div className="paperValuesPriviSwapMain marginBottomPaperValues">
                <div className="headerLabelPaperValues">Return type</div>
                <div className="valueLabelPaperValues">Fixed</div>
              </div>
              <div className="paperValuesPriviSwapMain">
                <div className="headerLabelPaperValues">Return</div>
                <div className="valueLabelPaperValues">2%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bodySwapMain">
          <div className="labelTitleSwapMain">Token list</div>
          {liquidityPools.length > 0 ?
            (<div>
              <div className="headerTableAllTokensSwapMain">
                <div className="smallColTableSwapMain"></div>
                <div className="mediumColTableSwapMain">TOKEN</div>
                <div className="mediumColTableSwapMain">AMOUNT</div>
                <div className="mediumColTableSwapMain">LIQUIDITY</div>
                <div className="mediumColTableSwapMain">LIQUIDITY PROVIDERS</div>
                <div className="bigColTableSwapMain"></div>
              </div>
              {liquidityPools.map((item, i) => {
                return (
                  <BodyTableAllTokensSwapMain
                    key={`row-${i}`}
                    liquidityState={liquidityStates[item.PoolToken]}
                    liquidityPool={item}
                    handleRefresh={loadData}
                    poolBalances={poolBalances}
                    tokens={tokenList}
                  />
                );
              })}
            </div>) :
            (<p>No tokens to show</p>)
          }
        </div>
      </div>
    </div>
  );
}, arePropsEqual);

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userBalances: state.userBalances
  }
}

export default connect(mapStateToProps)(SwapMain);

