import React, { useEffect, useState } from "react";
import Ticker from "react-ticker";
import { useDispatch } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import { Slider } from "@material-ui/core";
//import axios from 'axios';
//import URL from 'shared/functions/getURL';
//import Tooltip from '@material-ui/core/Tooltip';
import InsurancePoolCard from "./InsurancePool-Card/InsurancePoolCard";
import { sampleInsurancePoolsData } from "../sampleData";
import {
  setPoolsList,
  setPoolsLoading,
  setTrendingPoolsList,
  setTrendingPoolsLoading,
} from "store/actions/InsuranceManager";
import { useTypedSelector } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import "./InsurancePools.css";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

export default function InsurancePools() {
  const dispatch = useDispatch();

  const poolsList = useTypedSelector(state => state.poolsList.list);
  const [tickerMove, setTickerMove] = useState<boolean>(false);
  const trendingPoolsList = useTypedSelector(state => state.trendingPoolsList.list);
  const trendingPoolsLoading = useTypedSelector(state => state.trendingPoolsLoading.bool);
  const poolsLoading = useTypedSelector(state => state.poolsLoading.bool);

  const [poolsFullList, setPoolsFullList] = useState<any[]>([]);

  const [disableClick, setDisableClick] = useState<boolean>(true);

  //filters
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [popularity, setPopularity] = useState<number>(100);
  const [apr, setApr] = useState<number>(100);
  const [trustScore, setTrustScore] = useState<number>(100);
  const [endorsementScore, setEndorsementScore] = useState<number>(100);

  const followers_max = () => {
    if (poolsFullList.length > 0) {
      let limit = poolsFullList[0].followers;
      poolsFullList.forEach((pool: any, index: number) => {
        if (pool.Followers.length > limit) limit = pool.Followers.length;
      });
      return limit;
    } else return 1;
  };

  const handlePopularityChange = (event, newValue) => {
    setPopularity(newValue);
  };

  const handleAprChange = (event, newValue) => {
    setApr(newValue);
  };

  const handleTrustScoreChange = (event, newValue) => {
    setTrustScore(newValue);
  };

  const handleEndorsementScoreChange = (event, newValue) => {
    setEndorsementScore(newValue);
  };

  const StyledSlider = withStyles({
    root: {
      color: "#45CFEA",
    },
    thumb: {
      color: "white",
      border: "2px #45CFEA solid",
    },
    valueLabel: {
      color: "#45CFEA",
      fontFamily: "Agrandir",
    },
  })(Slider);

  useEffect(() => {
    loadPoolsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPoolsData = async () => {
    dispatch(setTrendingPoolsLoading(true));
    dispatch(setPoolsLoading(true));
    setDisableClick(true);

    //TODO: get real data
    dispatch(await setPoolsList(sampleInsurancePoolsData));
    dispatch(await setTrendingPoolsList(sampleInsurancePoolsData));
    setPoolsFullList(sampleInsurancePoolsData);

    dispatch(setTrendingPoolsLoading(false));
    dispatch(setPoolsLoading(false));
    setDisableClick(false);
  };

  useEffect(() => {
    poolFilterFunctions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popularity, apr, trustScore, endorsementScore, searchValue]);

  const poolFilterFunctions = () => {
    let poolsToFilter = [...poolsFullList];
    let poolsFilteredList: any[] = [];

    dispatch(setPoolsLoading(true));
    //1. filter by slider user input
    if (poolsToFilter.length > 0) {
      poolsToFilter.forEach((value: any, index: number) => {
        if (
          Number(value.PodEndorsementScore * 100) <= endorsementScore &&
          Number(value.PodTrustScore * 100) <= trustScore &&
          Number(value.APR * 100) <= apr &&
          Number((value.Followers.length / followers_max()) * 100) <= popularity
        ) {
          if (
            //1. filter by search
            searchValue.length > 0 &&
            value.insurer_name &&
            value.insurer_name.toUpperCase().includes(searchValue.toUpperCase())
          ) {
            poolsFilteredList.push(value);
          } else if (searchValue === "") {
            poolsFilteredList.push(value);
          }
        }
      });
    }

    dispatch(setPoolsList(poolsFilteredList));
    dispatch(setPoolsLoading(false));
  };

  return (
    <div className="pools">
      <div className="trending">
        <div className="title">
          <img src={require("assets/icons/flame_blue.png")} alt={"flame"} />
          <h3>Trending Pools</h3>
        </div>
        <LoadingWrapper loading={trendingPoolsLoading}>
          {trendingPoolsList.length > 0 ? (
            <Ticker direction="toLeft" move={tickerMove}>
              {({ index }) => (
                <div
                  onMouseOver={() => {
                    setTickerMove(false);
                  }}
                  onMouseLeave={() => {
                    setTickerMove(true);
                  }}
                  className={"pool-cards"}
                >
                  {trendingPoolsList.map(pool => {
                    return (
                      <InsurancePoolCard
                        pool={pool}
                        key={`${pool.Id}-trending`}
                        disableClick={disableClick}
                        trending={true}
                      />
                    );
                  })}
                </div>
              )}
            </Ticker>
          ) : (
            <div>No pools to show</div>
          )}
        </LoadingWrapper>
      </div>
      <div className="all">
        <div className="title">
          <h3>Insurance Pools</h3>
        </div>
        <div className="pools-container">
          <div className="pool-cards">
            <LoadingWrapper loading={poolsLoading}>
              {poolsList.length > 0 ? (
                poolsList.map(pool => {
                  return (
                    <InsurancePoolCard
                      pool={pool}
                      key={`${pool.Id}-trending`}
                      disableClick={disableClick}
                      trending={false}
                    />
                  );
                })
              ) : (
                <div>No pools to show</div>
              )}
            </LoadingWrapper>
          </div>
          <div className="filters">
            <h4>Filter Insurances</h4>
            <label>
              <img src={require("assets/icons/search_right_blue.png")} alt={"search"} />
              <InputWithLabelAndTooltip
                type='text'
                placeHolder="Search by name"
                inputValue={searchValue}
                onInputValueChange={e => setSearchValue(e.target.value)}
              />
            </label>
            <div className="slider">
              <div className="labels">
                <p>Popularity</p>
                <p>{popularity}%</p>
              </div>
              <StyledSlider
                defaultValue={popularity}
                valueLabelDisplay="auto"
                step={1}
                max={100}
                aria-labelledby="continuous-slider"
                onChangeCommitted={handlePopularityChange}
              />
            </div>
            <div className="slider">
              <div className="labels">
                <p>% APR</p>
                <p>{apr}%</p>
              </div>
              <StyledSlider
                defaultValue={apr}
                valueLabelDisplay="auto"
                step={1}
                max={100}
                aria-labelledby="continuous-slider"
                onChangeCommitted={handleAprChange}
              />
            </div>
            <div className="slider">
              <div className="labels">
                <p>Trust</p>
                <p>{trustScore}%</p>
              </div>
              <StyledSlider
                defaultValue={trustScore}
                valueLabelDisplay="auto"
                step={1}
                max={100}
                aria-labelledby="continuous-slider"
                onChangeCommitted={handleTrustScoreChange}
              />
            </div>
            <div className="slider">
              <div className="labels">
                <p>Endorsement Score</p>
                <p>{endorsementScore}%</p>
              </div>
              <StyledSlider
                defaultValue={endorsementScore}
                valueLabelDisplay="auto"
                step={1}
                max={100}
                aria-labelledby="continuous-slider"
                onChangeCommitted={handleEndorsementScoreChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
