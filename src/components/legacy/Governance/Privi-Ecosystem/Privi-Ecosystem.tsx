import React, { useState, useRef, useEffect } from "react";
import "./Privi-Ecosystem.css";
import Grid from "@material-ui/core/Grid";

import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import { trackPromise } from "react-promise-tracker";

import PageDiscussion from "shared/ui-kit/Forum/PageDiscussion";
import ModalNewTopic from "shared/ui-kit/Forum/ModalNewTopic";

import StakeModal from "../modals/StakeModal";
import UnstakeModal from "../modals/UnstakeModal";

import { getBlockchainNode3URL } from "shared/functions/getBlockchainURLs";
import { formatNumber } from "shared/functions/commonFunctions";
import governanceChartConfig from "../Governance-Chart/Governance-Chart-Config";
import PrintGovernanceChart from "../Governance-Chart/Governance-Chart";

const issuesIcon = require("assets/icons/info_square_icon_blue.png");
const chatIcon = require("assets/icons/message_blue.png");
const optionsIcon = require("assets/icons/atom_proposals_icon.png");

const issuesIconWhite = require("assets/icons/info_square_icon_white.png");
const chatIconWhite = require("assets/icons/message_white.png");

const numOfDecimals = 7;

const optionsIconWhite = require("assets/icons/atom_icon_white.png");

const PriviEcosystem = () => {
  const [stakedAmount, setStakedAmount] = useState<number>(0); // get it from
  const stakingInfoRef = useRef<any>({}); // StakedAmount, Multiplier, LastUpdate

  const [lastDayStakedAmount, setLastDayStakedAmount] = useState<number>(0);
  const [lastWeekStakedAmount, setLastWeekStakedAmount] = useState<number>(0);
  const [lastMonthStakedAmount, setLastMonthStakedAmount] = useState<number>(0);
  const [dailyReturn, setDailyReturn] = useState<Number>(0);
  const [weeklyReturn, setWeeklyReturn] = useState<Number>(0);
  const [monthlyReturn, setMonthlyReturn] = useState<Number>(0);

  const [members, setMembers] = useState<number>(0);

  const [returnChart, setReturnChart] = useState<any>(
    governanceChartConfig("PRIVI")
  );
  const [stakeChart, setStakeChart] = useState<any>(
    governanceChartConfig("PRIVI")
  );

  const firstStakeDateRef = useRef<number>(0); // in ms

  const user = useTypedSelector((state) => state.user);

  const peiRef = useRef();
  const pedRef = useRef();
  const pepRef = useRef();

  // load data from backend
  const loadData = () => {
    if (!user.id) return;
    // get staked amount and firstStakeDate for the return % graph
    const config = {
      params: {
        userId: user.id,
        token: "PRIVI",
      },
    };
    trackPromise(
      axios.get(`${URL()}/stake/getUserStakedInfo`, config).then((res) => {
        const resp = res.data;
        if (resp.success) {
          const data = resp.data;
          setLastDayStakedAmount(data.LastDayStakedAmount ?? 0);
          setLastWeekStakedAmount(data.LastWeekStakedAmount ?? 0);
          setLastMonthStakedAmount(data.LastMonthStakedAmount ?? 0);
          if (data.StakedAmount != undefined) setStakedAmount(data.StakedAmount);
          firstStakeDateRef.current = data.InitialStakingDate ?? 0;
          loadLineData();
        }
      })
    );
    // get staked amount history for Graph
    trackPromise(
      axios.get(`${URL()}/stake/getStakedHistory/PRIVI`).then((res) => {
        const resp = res.data;
        if (resp.success) {
          const data = resp.data;
          const graphData: any[] = [];
          data.forEach((obj) => {
            graphData.push({
              x: obj.date,
              y: obj.amount,
            });
          });
          const formattedGraphData = graphData.slice(-30);
          const labels = formattedGraphData.map((point) =>
            new Date(point.x).toLocaleString("eu", {
              day: "numeric",
              month: "numeric",
            })
          );
          const newStakeChart = { ...stakeChart };
          newStakeChart.config.data.labels = labels;
          newStakeChart.config.data.datasets[0].data = formattedGraphData;
          setStakeChart(newStakeChart);
        }
      })
    );
    // get staked amount history
    trackPromise(
      axios.get(`${URL()}/stake/getTotalMembers/PRIVI`).then((res) => {
        const resp = res.data;
        if (resp.success) {
          setMembers(resp.data);
        }
      })
    );
    // get stakedInfo from blockchain
    const config2 = {
      params: {
        Address: user.id,
        Token: "PRIVI",
      },
    };
    trackPromise(
      axios
        .get(
          `${getBlockchainNode3URL()}/api/PriviGovernance/getUserStakingInfo`,
          config2
        )
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            const output = resp.output;
            stakingInfoRef.current = resp.output;
            setStakedAmount(output.StakedAmount);
          }
        })
    );
  };

  // set correct daily, weekly, monthly returns
  useEffect(() => {
    if (lastDayStakedAmount > 0) {
      const newDailyReturn =
        Math.max(
          0,
          (stakedAmount - lastDayStakedAmount) / lastDayStakedAmount
        ) * 100;
      setDailyReturn(newDailyReturn);
    }
    if (lastWeekStakedAmount > 0) {
      const newWeeklyReturn =
        Math.max(
          0,
          (stakedAmount - lastWeekStakedAmount) / lastWeekStakedAmount
        ) * 100;
      setWeeklyReturn(newWeeklyReturn);
    }
    if (lastMonthStakedAmount > 0) {
      const newMonthyReturn =
        Math.max(
          0,
          (stakedAmount - lastMonthStakedAmount) / lastMonthStakedAmount
        ) * 100;
      setMonthlyReturn(newMonthyReturn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakedAmount]);

  // each second calculate new staked amount
  const updateStakedAmount = () => {
    const stakingInfo = stakingInfoRef.current;
    if (
      stakingInfo.StakedAmount &&
      stakingInfo.Multiplier &&
      stakingInfo.LastUpdate
    ) {
      const currTime = Math.floor(Date.now() / 1000);
      const newStakedAmount = Math.max(
        0,
        stakingInfo.StakedAmount *
        Math.pow(stakingInfo.Multiplier, currTime - stakingInfo.LastUpdate)
      );
      setStakedAmount(newStakedAmount);
    }
  };

  // currTime and iniTime should be in seconds
  const calculateReturnPct = (currTime, iniTime) => {
    return (Math.pow(1.000000007716, currTime - iniTime) - 1) * 100;
  };

  // each second refresh the last point
  const updateLineData = () => {
    const firstStakeDate = firstStakeDateRef.current; // ms
    const currTime = Date.now(); // ms
    const newReturnChart = { ...returnChart };
    if (firstStakeDate) {
      const iniTimeInSec = Math.floor(firstStakeDate / 1000); // s
      const currIterTimeInSec = Math.floor(currTime / 1000); // s
      if (currIterTimeInSec > iniTimeInSec) {
        const returnPct = calculateReturnPct(currIterTimeInSec, iniTimeInSec);
        const n = returnChart.config.data.datasets[0].data.length;
        // newReturnChart.config.data.datasets[0].data[n - 1].x = currTime;
        // newReturnChart.config.data.datasets[0].data[n - 1].y = returnPct;
      }
      // setReturnChart(newReturnChart);
    }
  };

  // add the initial 30 points (each one seprated by 1 hour)
  const loadLineData = () => {
    const firstStakeDate = firstStakeDateRef.current; // ms
    const currTime = Date.now(); // ms
    const graphData: any[] = [];
    if (firstStakeDate) {
      for (let i = 0; i < 30; i += 1) {
        const currIterTime = currTime - (30 - i) * 3600 * 1000; // ms
        const iniTimeInSec = Math.floor(firstStakeDate / 1000); // s
        const currIterTimeInSec = Math.floor(currIterTime / 1000); // s
        if (currIterTimeInSec > iniTimeInSec) {
          const returnPct = calculateReturnPct(currIterTimeInSec, iniTimeInSec);
          graphData.push({
            x: currIterTime,
            y: returnPct,
          });
        }
      }
      const formattedGraphData = graphData.slice(-30);
      const labels = formattedGraphData.map((point) =>
        new Date(point.x).toLocaleString("eu", {
          day: "numeric",
          month: "numeric",
        })
      );
      const newReturnChart = { ...returnChart };
      newReturnChart.config.data.labels = labels;
      newReturnChart.config.data.datasets[0].data = formattedGraphData;
      setReturnChart(newReturnChart);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      loadData();
      // update staked amount balance each sec
      const interval1 = setInterval(() => {
        updateStakedAmount();
      }, 1000);
      // fetch data for returnsLine each hour
      const interval2 = setInterval(() => {
        loadLineData();
      }, 3600 * 1000);
      // update returnsLine each sec
      // const interval3 = setInterval(() => {
      //   updateLineData();
      // }, 1000);
      return () => {
        clearInterval(interval1);
        clearInterval(interval2);
        // clearInterval(interval3);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const [openNewPei, setOpenNewPei] = useState<boolean>(false);

  const handleOpenNewPei = () => {
    setOpenNewPei(true);
  };

  const handleCloseNewPei = () => {
    setOpenNewPei(false);
  };

  const [openNewPed, setOpenNewPed] = useState<boolean>(false);

  const handleOpenNewPed = () => {
    setOpenNewPed(true);
  };

  const handleCloseNewPed = () => {
    setOpenNewPed(false);
  };

  const [openNewPep, setOpenNewPep] = useState<boolean>(false);

  const handleOpenNewPep = () => {
    setOpenNewPep(true);
  };

  const handleCloseNewPep = () => {
    setOpenNewPep(false);
  };

  const [openStake, setOpenStake] = useState<boolean>(false);
  const [openUnStake, setOpenUnStake] = useState<boolean>(false);

  const handleOpenStake = () => {
    setOpenStake(true);
  };

  const handleCloseStake = () => {
    setOpenStake(false);
  };

  const handleOpenUnStake = () => {
    setOpenUnStake(true);
  };

  const handleCloseUnStake = () => {
    setOpenUnStake(false);
  };

  return (
    <div className="priviEcosystem">
      <div className="headerPriviEcosytem">
        <div className="firstRowPriviEcosytem">
          <div className="firstColumnPriviEcosystem">
            <div className="headerFirstRowPriviEcosystem">
              Your staked balance
            </div>
            <div className="mainValueFirstRowPriviEcosystem">
              {formatNumber(stakedAmount, "PRIVI", numOfDecimals)}
            </div>
          </div>
          <div className="secondColumnPriviEcosystem">
            <div className="columnValuesPriviEcosystem">
              <div className="headerFirstRowPriviEcosystem">Daily returns</div>
              <div className="valueFirstRowPriviEcosystem">
                {formatNumber(dailyReturn, "% PRIVI", numOfDecimals)}
              </div>
            </div>
            <div className="columnValuesPriviEcosystem">
              <div className="headerFirstRowPriviEcosystem">Weekly returns</div>
              <div className="valueFirstRowPriviEcosystem">
                {formatNumber(weeklyReturn, "% PRIVI", numOfDecimals)}
              </div>
            </div>
            <div className="columnValuesPriviEcosystem">
              <div className="headerFirstRowPriviEcosystem">
                Monthly returns
              </div>
              <div className="valueFirstRowPriviEcosystem">
                {formatNumber(monthlyReturn, "% PRIVI", numOfDecimals)}
              </div>
            </div>
          </div>
          <div className="thirdColumnPriviEcosystem">
            <button
              className="buttonBlackPriviEcosystem stakeButtonPriviEcosystem"
              onClick={handleOpenStake}
            >
              + Stake
            </button>
            <StakeModal
              open={openStake}
              handleClose={handleCloseStake}
              handleRefresh={loadData}
              tokenToUse={"PRIVI"}
            />
            <button
              className="buttonBlackPriviEcosystem unstakeButtonPriviEcosystem"
              onClick={handleOpenUnStake}
            >
              - &nbsp; Unstake
            </button>
            <UnstakeModal
              open={openUnStake}
              handleClose={handleCloseUnStake}
              handleRefresh={loadData}
              onStake={stakedAmount}
              type="Ecosystem"
              tokenToUse={"PRIVI"}
            />
          </div>
        </div>
        <div className="secondRowPriviEcosytem">
          <div className="governanceUpdatesGraphPriviEcosystem">
            <div
              className="headerLabelGraph"
              style={{
                color: "white",
                marginBottom: "45px",
              }}
            >
              Governance updates
            </div>
            <div className="rowGovernanceUpdates">
              <div className="labelRowGovernanceUpdates">
                <img
                  src={issuesIconWhite}
                  className="iconRowGovernanceUpdates"
                  alt={"issues"}
                />
                New issues
              </div>
              <div className="valueRowGovernanceUpdates">24</div>
            </div>
            <div className="rowGovernanceUpdates">
              <div className="labelRowGovernanceUpdates">
                <img
                  src={chatIconWhite}
                  className="iconRowGovernanceUpdates"
                  alt={"chat bubble"}
                />
                New discussions
              </div>
              <div className="valueRowGovernanceUpdates">12</div>
            </div>
            <div
              className="rowGovernanceUpdates"
              style={{
                border: "0",
              }}
            >
              <div className="labelRowGovernanceUpdates">
                <img
                  src={optionsIconWhite}
                  className="iconRowGovernanceUpdates"
                  alt={"options"}
                />
                New proposals
              </div>
              <div className="valueRowGovernanceUpdates">3</div>
            </div>
          </div>
          {PrintGovernanceChart("Return History", returnChart)}
          {PrintGovernanceChart("Stake History", stakeChart)}
        </div>
      </div>
      <Grid
        container
        className="gridBodyPriviEcosystem"
        spacing={2}
        direction="row"
        alignItems="center"
        justify="flex-start"
      >
        <Grid item xs={4}>
          <div className="bodyHeaderPriviEcosystem">
            <div className="labelBodyPriviEcosystem">
              <img
                src={issuesIcon}
                className="iconLabelBodyPriviEcosystem"
                alt={"issues"}
              />
              Issues
            </div>
            <div className="buttonBodyPriviEcosystem">
              <button
                onClick={handleOpenNewPei}
                className="createButtonIssuesProposals"
              >
                + Create
              </button>
              <ModalNewTopic
                open={openNewPei}
                handleClose={handleCloseNewPei}
                postType="pei"
                linkId={null}
                pageDiscussionRef={peiRef}
              />
            </div>
          </div>

          <div className="paperBodyPriviEcosystem">
            <PageDiscussion
              postType="pei"
              linkId={null}
              pageDiscussionRef={peiRef}
            />
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className="bodyHeaderPriviEcosystem">
            <div className="labelBodyPriviEcosystem">
              <img
                src={chatIcon}
                className="iconLabelBodyPriviEcosystem"
                alt={"chat bubble"}
              />
              Discussions
            </div>
            <div className="buttonBodyPriviEcosystem">
              <button
                onClick={handleOpenNewPed}
                className="createButtonIssuesProposals"
              >
                + Create
              </button>
              <ModalNewTopic
                open={openNewPed}
                handleClose={handleCloseNewPed}
                postType="ped"
                linkId={null}
                pageDiscussionRef={pedRef}
              />
            </div>
          </div>
          <div className="paperBodyPriviEcosystem">
            <PageDiscussion
              postType="ped"
              linkId={null}
              pageDiscussionRef={pedRef}
            />
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className="bodyHeaderPriviEcosystem">
            <div className="labelBodyPriviEcosystem">
              <img
                src={optionsIcon}
                className="iconLabelBodyPriviEcosystem"
                alt={"otpions"}
              />
              Proposals
            </div>
            <div className="buttonBodyPriviEcosystem">
              <button
                onClick={handleOpenNewPep}
                className="createButtonIssuesProposals"
              >
                + Create
              </button>
              <ModalNewTopic
                open={openNewPep}
                handleClose={handleCloseNewPep}
                postType="ft"
                linkId={null}
                pageDiscussionRef={pepRef}
              />
            </div>
          </div>
          <div className="paperBodyPriviEcosystem">
            <PageDiscussion
              postType="pep"
              linkId={null}
              pageDiscussionRef={pepRef}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default PriviEcosystem;
