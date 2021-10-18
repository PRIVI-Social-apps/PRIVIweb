import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { AppBar, Tab, Tabs } from "@material-ui/core";
import { RootState } from "store/reducers/Reducer";
import UsersGraph from "./components/UsersGraph";
import StatsGraph from "./components/StatsGraph";
import Task from "./components/Task";
import ClaimModal from "./modals/Claim/ClaimModal";
import PointsModal from "./modals/Points-and-Level/PointsModal";
import UserPointsModal from "./modals/Points-and-Level/UserPointsModal";
import BadgesModal from "./modals/Badges/BadgesModal";
import LevelUpModal from "./modals/Prize/LevelUpModal";
import NewBadgeModal from "./modals/Prize/NewBadgeModal";
import IndividualBadgeModal from "./modals/Badges/IndividualBadgeModal";
import "./Boost.css";
import placeholderBadge from 'assets/icons/badge.png';
import { trackPromise } from "react-promise-tracker";
import URL from "shared/functions/getURL";
import axios from "axios";
import BoostThirdBox from "./components/BoostThirdBox";
import TopUser from "./components/TopUser";

const taskOptions = ["All", "Ongoing", "Finished"];

export default function Boost() {
  //store
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);
  const userBalances = useSelector((state: RootState) => state.userBalances);
  //hooks
  const ref = useRef<HTMLHeadingElement>(null);
  const [tasks, setTasks] = useState<any[]>();
  const [userData, setUserData] = useState<any>();
  const [totalData, setTotalData] = useState<any>();
  const [ongoingTasks, setOngoingTasks] = useState<any[]>([]);
  const [finishedTasks, setFinishedTasks] = useState<any[]>([]);
  const [tasksSelection, setTasksSelection] = useState<number>(0);
  const statsOptions = ["Your Stats", "Global"];
  const [top3, setTop3] = useState<any[]>([]);
  const [rank, setRank] = useState<number>(0);
  const [ranking, setRanking] = useState<any>([])
  const [badges, setBadges] = useState<any[]>([]);
  const [remaining, setRemaining] = useState<number>(0);
  const [badgesToday, setBadgesToday] = useState<any[]>([]);
  const [totalBadges, setTotalBadges] = useState<number>(0);
  const [statsSelection, setStatsSelection] = useState<number>(0);
  const [pointsNextLevel, setPointsNextLevel] = useState<number>(0);
  const [statsGraphWidth, setStatsGraphWidth] = useState<number>(0);
  const [statsButtonSelection, setStatsButtonSelection] = useState<number>(0);
  //triggers to open the new badge / level up modals
  const [newBadge, setNewBadge] = useState({});
  const [triggerLevelUp, setTriggerLevelUp] = useState<boolean>(false);
  const [triggerNewBadge, setTriggerNewBadge] = useState<boolean>(false);
  //modal controllers and functions
  const [photoLoaded, setPhotoLoaded] = useState<boolean>(false);
  const [openBadgeModal, setOpenBadgeModal] = useState<boolean>(false);
  const [openClaimModal, setOpenClaimModal] = useState<boolean>(false);
  const [openPointsModal, setOpenPointsModal] = useState<boolean>(false);
  const [openBadgesModal, setOpenBadgesModal] = useState<boolean>(false);
  const [openUserPointsModal, setOpenUserPointsModal] = useState<boolean>(false);
  const [openSeeAllModal, setOpenSeeAllModal] = useState<boolean>(false);

  const handleOpenClaimModal = () => {
    setOpenClaimModal(true);
  };
  const handleOpenPointsModal = () => {
    setOpenPointsModal(true);
  };
  const handleOpenUserPointsModal = () => {
    setOpenUserPointsModal(true);
  };
  const handleOpenBadgesModal = () => {
    setOpenBadgesModal(true);
  };
  const handleCloseClaimModal = () => {
    setOpenClaimModal(false);
  };
  const handleClosePointsModal = () => {
    setOpenPointsModal(false);
  };
  const handleCloseUserPointsModal = () => {
    setOpenUserPointsModal(false);
  };
  const handleOpenBadgeModal = () => {
    setOpenBadgeModal(true);
  };
  const handleCloseBadgeModal = () => {
    setOpenBadgeModal(false);
  };
  const handleOpenSeeAllModal = () => {
    setOpenSeeAllModal(true);
  };
  const handleCloseSeeAllModal = () => {
    setOpenSeeAllModal(false);
  };

  //load data the first time
  useEffect(() => {
    if (user && user.id) {
      loadData();
    }
    if (ref.current) {
      setStatsGraphWidth(ref.current.offsetWidth);
    }
  }, [user, userBalances]);

  //resize graph
  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setStatsGraphWidth(ref.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  const loadData = () => {
    getUserScores();
    getStatisticsData();
    getTasksData();
    getBadgesInfo();
  };

  //getter functions
  const getUserScores = () => {
    trackPromise(
      axios
        .get(`${URL()}/user/getUserScores/${user.id}`)
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            const badgesToday = resp.data.badgesToday;
            const level = resp.data.level;
            const points = resp.data.points;
            const pointsWonToday = resp.data.pointsWonToday;
            const pointsNextLevel = resp.data.levelPoints[level];
            const remainingPoints = pointsNextLevel - points;
            const pointsScores = {
              points: points,
              pointsWonToday: pointsWonToday,
            };

            setPointsNextLevel(pointsNextLevel);
            setRemaining(remainingPoints);
            setUserData(pointsScores);
            setBadgesToday(badgesToday);
          }
        })
        .catch((error) => {
          console.log(error);
        })
    );
  };

  const getStatisticsData = () => {
    trackPromise(
      axios
        .get(`${URL()}/user/getStatistics/${user.id}`)
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            const totalLevelUsers = resp.data.totalLevelUsers;
            const totalPointsToday = resp.data.totalPointsToday;
            const totalBadgesToday = resp.data.totalBadgesToday;
            const usersLevelData = resp.data.usersLevelData;
            const levelPoints = resp.data.levelPoints;
            const ranking = resp.data.ranking;
            const history = resp.data.history;

            const pointsScores = {
              totalLevelUsers: totalLevelUsers,
              totalPointsToday: totalPointsToday,
              totalBadgesToday: totalBadgesToday,
              usersLevelData: usersLevelData,
              levelPoints: levelPoints,
              ranking: ranking,
              history: history,
            };
            setGraphs(pointsScores);
            setTotalData(pointsScores);
          }
        })
        .catch((error) => {
          console.log(error);
        })
    );
  };


  const setGraphs = (pointsScores) => {
    //RANKING DATA
    const t3 = [] as any[];

    setRanking(pointsScores.ranking.reverse());

    pointsScores.ranking.map((ranking, index) => {
      if (user.id === ranking.user) {
        //set rank
        setRank(index);
      }
      //add top 3 users
      if (index < 3) {
        t3.push({
          id: ranking.user,
          points: ranking.points,
          name: "",
          imageURL: "",
        });
      }
    });
    //set top3 users info
    if (users && users.length > 0) {
      users.forEach((user) => {
        t3.forEach((t3User, index) => {
          if (t3User.id === user.id) {
            t3[index]["name"] = user.name;
            t3[index]["imageURL"] = user.imageURL;
          }
        });
      });
    }
    setTop3(t3);
  };

  const getTasksData = () => {
    trackPromise(
      axios
        .get(`${URL()}/tasks/getTasks/${user.id}`)
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            const allTasks = [...resp.data];
            const ongoing = [] as any[];
            const finished = [] as any[];

            allTasks.forEach((task) => {
              if (task.EndDate && task.StartDate) {
                if (new Date(task.EndDate).getTime() > new Date().getTime()) {
                  ongoing.push(task);
                } else {
                  finished.push(task);
                }
              } else if (task.Completed === false) {
                ongoing.push(task);
              } else {
                finished.push(task);
              }
            });
            setTasks(allTasks);
            setOngoingTasks(ongoing);
            setFinishedTasks(finished);
          }
        })
        .catch((error) => {
          console.log(error);
        })
    );
  };

  const getBadgesInfo = () => {
    trackPromise(
      axios
        .get(`${URL()}/user/badges/getAllBadges`)
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            const data = resp.data;
            setTotalBadges(data.length);

            const newUserBadges: any = [];
            data.forEach((badge) => {
              if (badge.Symbol && userBalances[badge.Symbol] && userBalances[badge.Symbol].Balance) newUserBadges.push(badge);
            })
            setBadges(newUserBadges);
          } else {
            setTotalBadges(0);
            setBadges([]);
          }
        })
        .catch((error) => {
          console.log(error);
        })
    );
  }


  const setLoadingFailed = (event) => {
    setPhotoLoaded(false);
    event.target.src = placeholderBadge
  }

  if (userData && totalData)
    return (
      <div className="boost-page">
        <div className="content">
          {/* Overview */}
          {userData && totalData ?
            (<div className="overview">
              <div className="column">
                <span>Your level</span>
                <h1>{user.level}</h1>
              </div>
              <div className="right">
                <div className="top">
                  <div className="row">
                    <div className="column">
                      <span>Points</span>
                      <h4>
                        {userData.points}/{pointsNextLevel}
                      </h4>
                    </div>
                    <div className="column">
                      <span>Remaining to level up</span>
                      <h4>{remaining}</h4>
                    </div>
                    <div className="column">
                      <span>Points won today</span>
                      <h4>{userData.pointsWonToday}</h4>
                    </div>
                    <div className="column">
                      <span>Badges won</span>
                      <div className="badges">
                        {badges.map((badge, index) => {
                          return (
                            <div key={index}>
                              <div style={{ cursor: "pointer" }} className="hex" key={`badge-${index}`} onClick={handleOpenBadgeModal}>
                                <img
                                  className="hex"
                                  src={`${badge.Url}?${Date.now()}`}
                                  alt="hexagon-photo"
                                  onLoad={() => setPhotoLoaded(true)}
                                  onError={setLoadingFailed}
                                />
                              </div>
                              <IndividualBadgeModal
                                badgeSymbol={badge.Symbol}
                                open={openBadgeModal}
                                handleClose={handleCloseBadgeModal}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <button onClick={handleOpenClaimModal}>Claim</button>
                </div>
                <ClaimModal
                  open={openClaimModal}
                  handleClose={handleCloseClaimModal}
                />
                <div className="bar-container">
                  <div
                    className="bar-color"
                    style={{
                      width: `${(userData.points / pointsNextLevel) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>)
            : null
          }
          <div className="boxes">
            {/*First*/}
            {userData && totalData ?
              (<div className="box first-box">
                <div className="top">
                  <div
                    className="column clickable cursor-pointer"
                    onClick={handleOpenUserPointsModal}
                  >
                    <h1>{userData.points}</h1>
                    <span>Level points</span>
                  </div>
                  <UserPointsModal
                    open={openUserPointsModal}
                    handleClose={handleCloseUserPointsModal}
                  />
                  <div className="column clickable cursor-pointer" onClick={handleOpenBadgesModal}>
                    <div className="row">
                      <h1>{badges.length}</h1>
                      <div className="column">
                        <h5>/{totalBadges}</h5>
                        <div className="row badges">
                          {badges.map((badge, index) => {
                            if (index < 4)
                              return (
                                <div key={index}>

                                  <div style={{ cursor: "pointer" }} className="hex" key={`badge-${index}`} onClick={handleOpenBadgeModal}>
                                    <img
                                      className="hex"
                                      src={`${badge.Url}?${Date.now()}`}
                                      alt="hexagon-photo"
                                      onLoad={() => setPhotoLoaded(true)}
                                      onError={setLoadingFailed}
                                    />
                                  </div>
                                  <IndividualBadgeModal
                                    badge={badge.badgeId}
                                    open={openBadgeModal}
                                    handleClose={handleCloseBadgeModal}
                                  />
                                </div>
                              )
                          })}
                          {badges.length > 4 ? (<button className="seeMoreButton" onClick={handleOpenSeeAllModal}>{`+${badges.length - 4} more`}</button>) : null}
                        </div>
                      </div>
                    </div>
                    <span>Badges collected</span>
                  </div>
                  <BadgesModal
                    open={openSeeAllModal}
                    handleClose={handleCloseSeeAllModal}
                    badges={badges}
                  />
                  <div className="column">
                    <h1>#{rank}</h1>
                    <span>Your current rank</span>
                  </div>
                </div>
                <div className="bottom">
                  <div className="column">
                    <p>Number of users per level</p>
                    <UsersGraph data={totalData.usersLevelData} />
                  </div>
                  <div className="row">
                    <div className="column">
                      <span>{`Lvl ${user.level} users`}</span>
                      <h4>{totalData.totalLevelUsers}</h4>
                    </div>
                    <div className="column">
                      <span>Points today</span>
                      <h4>{totalData.totalPointsToday}</h4>
                    </div>
                    <div className="column">
                      <span>Badges today</span>
                      <h4>{totalData.totalBadgesToday}</h4>
                    </div>
                  </div>
                </div>
              </div>)
              : null
            }
            {/*Second*/}
            {userData && totalData ?
              (<div className="box second-box" ref={ref}>
                <div className="top">
                  <AppBar position="static" className="appbar">
                    <Tabs
                      TabIndicatorProps={{
                        style: { background: "#64c89e", height: "3px" },
                      }}
                      value={statsSelection}
                      onChange={(e, value) => setStatsSelection(value)}
                    >
                      {statsOptions.map((name) => {
                        return <Tab label={name} key={name} />;
                      })}
                    </Tabs>
                  </AppBar>
                  <div className="buttons">
                    <button
                      className={statsButtonSelection === 0 ? "selected" : undefined}
                      onClick={() => {
                        setStatsButtonSelection(0);
                      }}
                    >
                      GLOBAL
                  </button>
                    <button
                      className={statsButtonSelection === 1 ? "selected" : undefined}
                      onClick={() => {
                        setStatsButtonSelection(1);
                      }}
                    >
                      FRIENDS
                  </button>
                    <button
                      className={statsButtonSelection === 2 ? "selected" : undefined}
                      onClick={() => {
                        setStatsButtonSelection(2);
                      }}
                    >
                      COMPARE
                  </button>
                  </div>
                </div>
                <StatsGraph
                  data1={[38, 41, 39, 39, 39, 57]}
                  data2={[28, 31, 36, 30, 49, 37]}
                  width={statsGraphWidth > 0 ? statsGraphWidth - 40 : undefined}
                />
                <div className="bottom clickable cursor-pointer" onClick={handleOpenPointsModal}>
                  {top3.map((user, index) => (
                    <TopUser user={user} index={index} key={index} />
                  ))}
                </div>
                <PointsModal
                  open={openPointsModal}
                  handleClose={handleClosePointsModal}
                  ranking={ranking}
                />
              </div>)
              : null
            }
            {/*ThirdBox*/}
            <BoostThirdBox />
          </div>
          <div className="tasks-title">
            <h3>Tasks</h3>
          </div>
          <AppBar position="static" className="appbar">
            <Tabs
              TabIndicatorProps={{
                style: { background: "#64c89e", height: "3px" },
              }}
              value={tasksSelection}
              onChange={(e, value) => setTasksSelection(value)}
            >
              {taskOptions.map((name) => {
                let n = 0;
                switch (name) {
                  case "All":
                    n = ongoingTasks.length + finishedTasks.length;
                    break;
                  case "Ongoing":
                    n = ongoingTasks.length;
                    break;
                  case "Finished":
                    n = finishedTasks.length;
                    break;
                }
                return <Tab label={`${name} (${n})`} key={name} />;
              })}
            </Tabs>
          </AppBar>
          {tasks && tasks.length > 0 ? (
            <div className="tasks">
              {tasksSelection === 0
                ? tasks.map((task, index) => {
                  return <Task task={task} key={`task${index}`} />;
                })
                : tasksSelection === 1
                  ? ongoingTasks.map((task, index) => {
                    return <Task task={task} key={`ongoing-task${index}`} />;
                  })
                  : finishedTasks.map((task, index) => {
                    return <Task task={task} key={`finished-task${index}`} />;
                  })}
            </div>
          ) : null}

        </div>
        <LevelUpModal
          level={user.level}
          open={triggerLevelUp}
          handleClose={() => setTriggerLevelUp(false)}
        />
        <NewBadgeModal
          badge={newBadge}
          open={triggerNewBadge}
          handleClose={() => setTriggerNewBadge(false)}
        />
      </div>
    );
  else return null;
}
