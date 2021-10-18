import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import SwapModal from "./Swap-Modal/Swap-Modal";
import AddLiquiditySwapModal from "./Add-Liquidity-Swap-Modal/Add-Liquidity-Swap-Modal";

import { formatNumber } from "shared/functions/commonFunctions";

const plusSquareIcon = require("assets/icons/plus_square_icon.png");

const BodyTableAllTokensSwapMain = (props: any) => {
  // HOOKS
  const [openModalSwap, setOpenModalSwap] = useState<boolean>(false);
  const [openModalAddLiquidity, setOpenModalAddLiquidity] = useState<boolean>(
    false
  );

  // FUNCTIONS
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

  const history = useHistory();

  return (
    <div className="bodyTableAllTokensSwapMain">
      <div className="smallColTableSwapMain">
        <img
          src={require(`assets/tokenImages/${props.liquidityPool.PoolToken}.png`)}
          onClick={() => {
            history.push(`/privi-swap/token/${props.liquidityPool.PoolToken}`);
          }}
          className="iconTokenSwapMain pointerCursorSwapMain"
          alt={props.liquidityPool.PoolAddress}
        />
      </div>
      <div
        className="mediumColTableSwapMain pointerCursorSwapMain"
        onClick={() => {
          history.push(`/privi-swap/token/${props.liquidityPool.PoolToken}`);
        }}
      >
        {props.liquidityPool.PoolToken}
      </div>
      <div className="mediumColTableSwapMain">
        {props.liquidityPool.Liquidity
          ? formatNumber(props.liquidityPool.Liquidity, "", 4)
          : 0}
      </div>
      <div className="mediumColTableSwapMain">
        {props.liquidityPool.LiquidityInUSD
          ? formatNumber(props.liquidityPool.Liquidity, "USD", 4)
          : "$ 0"}
      </div>
      <div className="mediumColTableSwapMain">
        {props.liquidityPool.Providers
          ? Object.keys(props.liquidityPool.Providers).length
          : 0}
      </div>
      <div className="bigColTableSwapMain alignTableRightSwapMain">
        <button
          className="addLiquidityButtonTableSwapIndividual"
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
          disabled={props.liquidityState === "PROTECTED"}
          token={props.liquidityPool.PoolToken}
          open={openModalAddLiquidity}
          handleClose={handleCloseModalAddLiquidity}
          handleRefresh={props.handleRefresh}
        />
        <button
          className="buttonSubHeaderSwapMain swapButtonSubHeaderSwapMain"
          disabled={props.liquidityState !== "LISTED"}
          onClick={handleOpenModalSwap}
        >
          Swap
        </button>
        <SwapModal
          open={openModalSwap}
          handleClose={handleCloseModalSwap}
          tokenFrom={props.liquidityPool.PoolToken}
          tokens={props.tokens.filter(
            (token) => token != props.liquidityPool.PoolToken
          )} // pass all tokens except tokenFrom
          poolBalances={props.poolBalances}
          handleRefresh={props.handleRefresh}
        />
      </div>
    </div>
  );
};

export default BodyTableAllTokensSwapMain;
