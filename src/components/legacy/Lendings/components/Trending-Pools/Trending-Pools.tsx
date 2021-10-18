import React, { useState } from "react";
import "./Trending-Pools.css";
import PoolCard from "../Pool-Card/Pool-Card";
import Ticker from "react-ticker";

const trendingIcon = require("assets/icons/flame_blue.png");

const TrendingPools = (props: any) => {
  const [tickerMove, setTickerMove] = useState<boolean>(false);

  return (
    <div className="trendingPools">
      <div className="headerTrendingPools">
        <img src={trendingIcon} className="trendingIconPools" alt="trending" />
        <div className="trendingLabelPools">
          Trending {props.tabsPriviCredit}
        </div>
      </div>

      {props.trendingCreditPoolsList.length > 0 ? (
        <Ticker direction="toLeft" move={tickerMove}>
          {({ index }) => (
            <div
              onMouseOver={() => {
                setTickerMove(false);
              }}
              onMouseLeave={() => {
                setTickerMove(true);
              }}
              className={"rowTrendingPoolsItems"}
            >
              {props.trendingCreditPoolsList.map((item, i) => {
                return <PoolCard key={i} trending={true} pool={item} />;
              })}
            </div>
          )}
        </Ticker>
      ) : (
        <div className="no-pods">No credit pools to show</div>
      )}
    </div>
  );
};

export default TrendingPools;
