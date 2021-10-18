import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Grid, makeStyles } from "@material-ui/core";

import GraphComponent from "./components/GraphComponent";
import PrintChart from "shared/ui-kit/Chart/Chart";
import SaluteItem from "./components/SaluteItem";
import "./Dashboard.css";
import URL from "shared/functions/getURL";
import { RootState } from "store/reducers/Reducer";
import {trackPromise} from "react-promise-tracker";
import axios from "axios";

const Box = props => {
  return (
    <div className="box">
      <span>{props.title}</span>
      <h3>
        {props.decimal ? props.content.toFixed(2) : props.content}
        {props.token ? <span>{props.token}</span> : ""}
      </h3>
    </div>
  );
};

const Graph = props => {
  if (props.volumeData.length > 0) {
    return (
      <div className="volume-graph">
        <PrintChart
          config={{
            config: {
              data: {
                labels: props.volumeData.map(item => item.x),
                datasets: [
                  {
                    type: "line",
                    data: props.volumeData.map(item => item.y),
                    fill: true,
                    backgroundColor: "#46D2ED",
                    borderColor: "#46D2ED",
                    lineTension: 0,
                  },
                ],
              },

              options: {
                responsive: true,
                maintainAspectRatio: false,
                chartArea: {
                  backgroundColor: "#F7F9FECC",
                },
                elements: {
                  point: {
                    radius: 0,
                    hitRadius: 5,
                    hoverRadius: 5,
                  },
                },

                legend: {
                  display: false,
                },

                layout: {
                  padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  },
                },

                scales: {
                  xAxes: [
                    {
                      display: false,
                    },
                  ],
                  yAxes: [
                    {
                      display: false,
                    },
                  ],
                },

                tooltips: {
                  mode: "label",
                  intersect: false,
                  callbacks: {
                    //This removes the tooltip title
                    title: function () {},
                    label: function (tooltipItem, data) {
                      return `${tooltipItem.yLabel.toFixed(4)}`;
                    },
                  },
                  //this removes legend color
                  displayColors: false,
                  yPadding: 10,
                  xPadding: 10,
                  position: "nearest",
                  caretSize: 10,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  bodyFontSize: 15,
                  bodyFontColor: "#303030",
                },
              },
            },
            configurer: (config: any, ref: CanvasRenderingContext2D): object => {
              let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
              gradient.addColorStop(0, "#46D2EDFF");
              gradient.addColorStop(1, "#46D2ED00");
              config.data.datasets[0].backgroundColor = gradient;

              return config;
            },
          }}
        />
      </div>
    );
  } else return null;
};

const useStyles = makeStyles(theme => ({
  box: {
    backgroundColor: "white",
    boxShadow: "-2px 7px 25px -9px rgb(148 148 148 / 66%)",
    borderRadius: theme.spacing(2.5),
    padding: theme.spacing(4),
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [comments, setComments] = useState<number>(0);
  const [commentsMonth, setCommentsMonth] = useState<number>(0);
  const [conversationsMonth, setConversationsMonth] = useState<number>(0);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [styledDate, setStyledDate] = useState<string>("");
  const [weeklyPerc, setWeeklyPerc] = useState<number>(0);
  const [selectedSalutes, setSelectedSalutes] = useState<number>(1);
  const [salutesScrollable, setSalutesScrollable] = useState<boolean>(false);
  const [salutes, setSalutes] = useState<any[]>([]);

  useEffect(() => {
    if (props.community && props.community.CommunityAddress) {
      setComments(props.community.counters?.commentsCounter || 0);
      setCommentsMonth(props.community.counters?.commentsMonthCounter || 0);
      setConversationsMonth(props.community.counters?.conversationsCounter || 0);

      getDashboardInfo()

      getVolumeData();
      getStyledDate();
      getSalutes();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.community, users]);

  const getDashboardInfo = () => {
    trackPromise(
      axios.get(`${URL()}/community/getDashboardInfo/${props.community.id}`)
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            setCommentsMonth(resp.data.messages || 0);
            setConversationsMonth(resp.data.conversations || 0);
          }
        })
        .catch((error) => {
          console.log(error);
        })
    );
  }

  const getVolumeData = () => {
    if (props.community.VolumeData) {
      let sevenDaysList = [] as any;

      //make a list with the last 7 days
      for (let i = 0; i <= 6; i++) {
        sevenDaysList.push({
          x: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 6 + i),
          y: 0,
        });
      }

      //update list adding followers gained each day
      sevenDaysList.forEach((date, index) => {
        props.community.VolumeData.forEach(volumeData => {
          if (
            new Date(date.x).getFullYear() === new Date(volumeData.x).getFullYear() &&
            new Date(date.x).getMonth() === new Date(volumeData.x).getMonth() &&
            new Date(date.x).getDate() === new Date(volumeData.x).getDate()
          ) {
            sevenDaysList[index].y = sevenDaysList[index].y + volumeData.y;
          }
        });
      });

      setVolumeData(sevenDaysList);
    }
  };

  const getStyledDate = () => {
    if (props.community.Date) {
      const date = new Date(new Date().getTime() - new Date(props.community.Date).getTime());
      setStyledDate(`${date.getDate()}d ${date.getHours()}h ${date.getMinutes()}min`);
    }
    const today = new Date().getDay() === 0 ? 7 : new Date().getDay();
    setWeeklyPerc((today / 7) * 100);
  };

  const getSalutes = () => {
    if (users && users.length > 0 && props.community.Salutes && props.community.Salutes.length > 0) {
      const s = [...props.community.Salutes] as any;
      users.forEach(user => {
        s.forEach((salute, index) => {
          if (user.id === salute.Id) {
            salute[index].userData = {
              name: user.name,
              imageURL: user.imageURL,
            };
          }
        });
      });

      setSalutes(s);
    }
  };

  if (props.community)
    return (
      <div className="dashboard">
        <Grid container className="top" spacing={2}>
          {props.community.TokenSymbol && props.community.TokenSymbol !== "" ? (
            <Grid item sm={12} md={6} className="left">
              <div className="top-row">
                <div
                  className="token-image"
                  style={{
                    backgroundImage:
                      props.community.TokenSymbol !== ""
                        ? `url(${URL()}/wallet/getTokenPhoto/${props.community.TokenSymbol})`
                        : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div>
                  <span>Awards this week</span>
                  <p className="token-symbol">{props.community.TokenSymbol}</p>
                </div>
              </div>
              <div className="bottom-row">
                <div>
                  <span>Supply</span>
                  <p>
                    {props.community.SupplyReleased
                      ? `${
                          props.community.SupplyReleased > 1000000
                            ? (props.community.SupplyReleased / 1000000).toFixed(1)
                            : props.community.SupplyReleased > 1000
                            ? (props.community.SupplyReleased / 1000).toFixed(1)
                            : props.community.SupplyReleased.toFixed(1)
                        } ${
                          props.community.SupplyReleased > 1000000
                            ? "M"
                            : props.community.SupplyReleased > 1000
                            ? "K"
                            : ""
                        }`
                      : null}
                  </p>
                </div>
                <div>
                  <span>Price</span>
                  <p>{`${
                    props.community.Price !== undefined
                      ? `${props.community.Price.toFixed(4)} ${props.community.FundingToken}`
                      : "N/A"
                  }`}</p>
                </div>
                <div>
                  <span>MCAP</span>
                  <p>{`${props.community.MCAP !== undefined ? props.community.MCAP.toFixed(4) : "N/A"} ${
                    props.community.FundingToken
                  }`}</p>
                </div>
              </div>
              <span className="days-span">{"Volume last 7 days"}</span>
              <Graph volumeData={volumeData} />
            </Grid>
          ) : null}
          {props.community.TokenSymbol && props.community.TokenSymbol !== "" ? (
            <Grid container item sm={12} md={6} className="right">
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <div className={classes.box}>
                    <span>Conversations this month</span>
                    <h3>{conversationsMonth}</h3>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.box}>
                    <span>Comments this month</span>
                    <h3>{commentsMonth}</h3>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.box}>
                    <span>Total volume this month</span>
                    <h3>
                      {props.community.MonthVolume ? props.community.MonthVolume : "N/A"}{" "}
                      {props.community.FundingToken}
                    </h3>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.box}>
                    <span>Comments</span>
                    <h3>{comments}</h3>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid item sm={12} md={6} className="right">
              <div className="row">
                <Box
                  title="Conversations this month"
                  content={conversationsMonth}
                  token={false}
                  decimal={false}
                />
                <Box title="Comments this month" content={commentsMonth} token={false} decimal={false} />
                <Box
                  title="Total volume this month"
                  content={props.community.MonthVolume ? props.community.MonthVolume : "N/A"}
                  token={props.community.FundingToken}
                  decimal={false}
                />
                <Box title="Comments" content={comments} token={false} decimal={false} />
              </div>
            </Grid>
          )}
        </Grid>
        <div className="graphs">
          {props.community.TransactionsData && props.community.Transacions ? (
            <GraphComponent
              data={props.community.TransactionsData}
              total={props.community.Transacions}
              dataName={"transactions"}
            />
          ) : null}
          {props.community.MembersData && props.community.Members ? (
            <GraphComponent
              data={props.community.MembersData}
              total={props.community.Members}
              dataName={"members"}
            />
          ) : null}
        </div>
        <Grid container className="bottom" spacing={2}>
          <Grid item xs={6} className="box">
            <p style={{ fontSize: 18, fontWeight: 400 }}>Weekly reward progress</p>
            <div className="row">
              <div className="element">
                <span>Rewards</span>
                <h3>{props.community.Rewards ? props.community.Rewards : "N/A"}</h3>
              </div>
              <div className="element">
                <span>APY</span>
                <p>{`${props.community.APY ? (props.community.APY * 100).toFixed(0) : "N/A"}%`}</p>
              </div>
            </div>
            <span className="distributed-time">{`Distributed in ${styledDate}`}</span>
            <div className="bar-container">
              <div className="bar" style={{ width: `${weeklyPerc}%` }} />
            </div>
            <div className="bottom">
              <div className="element">
                <p style={{ paddingBottom: 0 }}>
                  {props.community.AverageWeek ? props.community.AverageWeek : "N/A"}
                </p>
                <span>Average balance this week</span>
              </div>
              <div className="element">
                <p style={{ paddingBottom: 0 }}>
                  {props.community.AverageFourWeeks ? props.community.AverageFourWeeks : "N/A"}
                </p>
                <span>Average balance last four weeks</span>
              </div>
            </div>
          </Grid>
          <Grid item xs={6} className="box">
            <div className="header">
              <div className="tabs">
                <p
                  className={selectedSalutes === 1 ? "selected clickable" : "clickable"}
                  onClick={() => {
                    setSelectedSalutes(1);
                  }}
                >
                  Salutes
                </p>
                <p
                  className={selectedSalutes === 2 ? "selected cursor-pointer" : "clickable cursor-pointer"}
                  onClick={() => {
                    setSelectedSalutes(2);
                  }}
                >
                  Latest cred
                </p>
              </div>
            </div>
            <div className="row">
              <div className="element">
                <span>Awards this week</span>
                <h3>{props.community.AwardsWeek ? props.community.AwardsWeek : "N/A"}</h3>
              </div>
              <div className="element">
                <span>Creds this week</span>
                <h3>{props.community.CredWeek ? props.community.CredWeek : "N/A"}</h3>
              </div>
            </div>
            <div className={salutesScrollable ? "salutes scrollable" : "salutes"}>
              {selectedSalutes === 1 && salutes.length > 0
                ? salutes.map((salute, index) => {
                    return <SaluteItem item={salute} key={`salute-${index}`} />;
                  })
                : null}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  else return null;
}
