import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Grid } from "@material-ui/core";

import SaluteItem from "./components/SaluteItem";
import { dashboardStyles } from './Dashboard.styles';
import { Card, TitleGrandLight } from "../../index.styles";
import URL from "shared/functions/getURL";
import { RootState } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Color, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import PrintChart from "shared/ui-kit/Chart/Chart";
import GraphComponent from "./components/GraphComponent";

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
                    backgroundColor: "transparent",
                    borderColor: "#579bf47c",
                    lineTension: 0,
                  },
                ],
              },

              options: {
                responsive: true,
                maintainAspectRatio: false,
                chartArea: {
                  backgroundColor: "transparent",
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
                  backgroundColor: "transparent",
                  bodyFontSize: 15,
                  bodyFontColor: "#579bf47c",
                },
              },
            },
            configurer: (config: any, ref: CanvasRenderingContext2D): object => {
              let gradient = ref.createLinearGradient(0, 0, ref.canvas.clientHeight, 0);
              gradient.addColorStop(-0.0909, "#00BFFF");
              gradient.addColorStop(0.5617, "#8D2EFF");
              gradient.addColorStop(1.1256, "#FF00C1");

              config.data.datasets[0].backgroundColor = gradient;

              return config;
            },
          }}
        />
      </div>
    );
  } else return null;
};

export default function Dashboard(props) {
  const classes = dashboardStyles();
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [loadingInfo, setLoadingInfo] = useState<boolean>(false);
  const [comments, setComments] = useState<number>(0);
  const [commentsMonth, setCommentsMonth] = useState<number>(0);
  const [conversationsMonth, setConversationsMonth] = useState<number>(0);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [styledDate, setStyledDate] = useState<string>("");
  const [weeklyPerc, setWeeklyPerc] = useState<number>(0);
  const [selectedSalutes, setSelectedSalutes] = useState<number>(1);
  const [salutes, setSalutes] = useState<any[]>([]);
  const [creds, setCreds] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (props.community && props.community.CommunityAddress) {
      setComments(props.community.counters?.commentsCounter || 0);
      setCommentsMonth(props.community.counters?.commentsMonthCounter || 0);
      setConversationsMonth(props.community.counters?.conversationsCounter || 0);

      getDashboardInfo();

      getVolumeData();
      getStyledDate();
      getSalutes();
      getTransactions();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.community, users]);

  const getDashboardInfo = () => {
    setLoadingInfo(true);
    axios
      .get(`${URL()}/community/getDashboardInfo/${props.community.id}`)
      .then(res => {
        const resp = res.data;
        setLoadingInfo(false);
        if (resp.success) {
          setCommentsMonth(resp.data.messages || 0);
          setConversationsMonth(resp.data.conversations || 0);
        }
      })
      .catch(error => {
        console.log(error);
        setLoadingInfo(false);
      });
  };

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
    if (users && users.length > 0) {
      const s = props.community.Salutes ?? [];
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

      const c = props.community.Creds ?? [];
      users.forEach(user => {
        c.forEach((cred, index) => {
          if (user.id === cred.Id) {
            cred[index].userData = {
              name: user.name,
              imageURL: user.imageURL,
            };
          }
        });
      });

      setSalutes(s);
      setCreds(c);
    }
  };

  const getTransactions = () => {
    const config = {
      params: {
        communityAddress: props.community.CommunityAddress,
      },
    };
    axios
      .get(`${URL()}/community/getCommunityTransactions`, config)
      .then(res => {
        const resp = res.data;
        const newTokenTransacations: any[] = [];
        if (resp.success) {
          const communityTransactions: any[] = resp.data;
          communityTransactions.forEach(txnObj => {
            newTokenTransacations.push({...txnObj, date: txnObj.Date});
          });
        }
        setTransactions(newTokenTransacations);
      })
      .catch(() => {
        setTransactions([]);
      });
  }

  if (props.community)
    return (
      <>
        <LoadingWrapper loading={loadingInfo} theme="dark">
          <Box width="100%" color="white" fontSize="18px">
            <TitleGrandLight disableUppercase mb={5} bold fontSize="30px">
              DAO Dashboard
            </TitleGrandLight>
            <Grid container spacing={3} wrap="wrap" direction="row">
              <Grid item sm={12} md={6} style={{ height: "fit-content" }}>
                <Grid container spacing={3} direction="column">
                  {props.community.TokenSymbol && props.community.TokenSymbol !== "" ? (
                    <Grid item sm={12} md={12} style={{ height: "fit-content" }}>
                      <Card noMargin>
                        <Box display="flex" alignItems="center" mb={3}>
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              background: "linear-gradient(151.11deg, #4CAA30 6.74%, #59C4EB 90.8%)",
                              backgroundImage:
                                props.community.TokenSymbol !== ""
                                  ? `url(${URL()}/wallet/getTokenPhoto/${props.community.TokenSymbol})`
                                  : "none",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <Box display="flex" flexDirection="column" ml={1}>
                            <Box fontWeight={800}>Token</Box>
                            <Box mt={1} fontFamily="Agrandir GrandLight">
                              {props.community.TokenSymbol}
                            </Box>
                          </Box>
                        </Box>

                        <Box display="flex" alignItems="center">
                          <Box display="flex" flexDirection="column" mr={6}>
                            <Box fontWeight={800}>Supply</Box>
                            <Box color="#D810D6" mt={1}>
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
                                : 0}
                            </Box>
                          </Box>
                          <Box display="flex" flexDirection="column" mr={6}>
                            <Box fontWeight={800}>Price</Box>
                            <Box color="#D810D6" mt={1}>
                              {`${
                                props.community.Price !== undefined
                                  ? `${props.community.Price.toFixed(4)} ${props.community.FundingToken}`
                                  : "N/A"
                              }`}
                            </Box>
                          </Box>
                          <Box display="flex" flexDirection="column">
                            <Box fontWeight={800}>MCAP</Box>
                            <Box color="#D810D6" mt={1}>
                              {`${
                                props.community.MCAP !== undefined ? props.community.MCAP.toFixed(4) : "N/A"
                              } ${props.community.FundingToken}`}
                            </Box>
                          </Box>
                        </Box>

                        {volumeData && volumeData.length > 0 && (
                          <Box mt={3} fontSize="11px">
                            Volume last 7 days
                          </Box>
                        )}
                        <Graph volumeData={volumeData} />
                      </Card>
                    </Grid>
                  ) : null}

                  {transactions && (
                    <Grid item sm={12} md={12} style={{ height: "fit-content" }}>
                      <Card noMargin>
                        <GraphComponent
                          data={transactions}
                          total={transactions.length}
                          dataName={"transactions"}
                        />
                      </Card>
                    </Grid>
                  )}
                  <Grid item sm={12} md={12} style={{ height: "fit-content" }}>
                    <Card noMargin>
                      <Box fontSize="30px" mb={3}>
                        Weekly reward progress
                      </Box>
                      <Box width="100%">
                        <StyledDivider color={Color.White} type="solid" />
                      </Box>
                      <Box display="flex" mb={3} mt={3}>
                        <Box display="flex" flexDirection="column" mr={6}>
                          <Box fontWeight={800}>Rewards</Box>
                          <Box color="#D810D6" mt={1}>
                            {props.community.Rewards ? props.community.Rewards : "N/A"}
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" mr={6}>
                          <Box fontWeight={800}>APY</Box>
                          <Box color="#D810D6" mt={1}>
                            {`${props.community.APY ? (props.community.APY * 100).toFixed(0) : "N/A"}%`}
                          </Box>
                        </Box>
                      </Box>

                      <Box fontWeight={800} mb={1}>
                        {`Distributed in ${styledDate}`}
                      </Box>
                      <Box className={classes.barContainer}>
                        <Box className={classes.bar} style={{ width: `${weeklyPerc}%` }} />
                      </Box>

                      <Box display="flex" mt={3}>
                        <Box display="flex" flexDirection="column" mr={6}>
                          <Box fontWeight={800}>Average balance this week.</Box>
                          <Box color="#D810D6" mt={1}>
                            {props.community.AverageWeek ? props.community.AverageWeek : "N/A"}
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" mr={6}>
                          <Box fontWeight={800}>Average balance last four weeks.</Box>
                          <Box color="#D810D6" mt={1}>
                            {props.community.AverageFourWeeks ? props.community.AverageFourWeeks : "N/A"}
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item sm={12} md={6} style={{ height: "fit-content" }}>
                <Grid container spacing={3} direction="column">
                  <Grid container item sm={12} md={12} style={{ height: "fit-content" }}>
                    <Card noMargin>
                      <Grid container spacing={1} direction="row">
                        <Grid item sm={12} md={6} style={{ height: "fit-content" }}>
                          <Box fontWeight={800}>Conversations this month</Box>
                          <Box color="#D810D6" mt={1}>
                            {conversationsMonth}
                          </Box>
                        </Grid>
                        <Grid item sm={12} md={6} style={{ height: "fit-content" }}>
                          <Box fontWeight={800}>Total volume this month</Box>
                          <Box color="#D810D6" mt={1}>
                            {props.community.MonthVolume ? props.community.MonthVolume : "N/A"}{" "}
                            {props.community.FundingToken}
                          </Box>
                        </Grid>
                        <Grid item sm={12} md={6} style={{ height: "fit-content" }}>
                          <Box fontWeight={800}>Comments this month</Box>
                          <Box color="#D810D6" mt={1}>
                            {commentsMonth}
                          </Box>
                        </Grid>
                        <Grid item sm={12} md={6} style={{ height: "fit-content" }}>
                          <Box fontWeight={800}>Comments</Box>
                          <Box color="#D810D6" mt={1}>
                            {comments}
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>

                  {props.community.Members && (
                    <Grid item sm={12} md={12} style={{ height: "fit-content" }}>
                      <Card noMargin>
                        <GraphComponent
                          data={props.community.Members}
                          total={props.community.Members.length}
                          dataName={"members"}
                        />
                      </Card>
                    </Grid>
                  )}

                  <Grid item sm={12} md={12} style={{ height: "fit-content" }}>
                    <Card noMargin>
                      <Box display="flex" alignItems="center" fontSize="30px" mb={3}>
                        <Box
                          color={selectedSalutes === 1 ? "white" : "#A4A4A4"}
                          style={{ cursor: "pointer" }}
                          mr={3}
                          onClick={() => {
                            setSelectedSalutes(1);
                          }}
                        >
                          Salutes
                        </Box>
                        <Box
                          style={{ cursor: "pointer" }}
                          color={selectedSalutes === 2 ? "white" : "#A4A4A4"}
                          onClick={() => {
                            setSelectedSalutes(2);
                          }}
                        >
                          Latest cred
                        </Box>
                      </Box>

                      <Box width="100%">
                        <StyledDivider color={Color.White} type="solid" />
                      </Box>

                      <Box display="flex" mt={3}>
                        <Box display="flex" flexDirection="column" mr={6}>
                          <Box fontWeight={800}>Awards this week</Box>
                          <Box color="#D810D6" mt={1}>
                            {props.community.AwardsWeek ? props.community.AwardsWeek : "N/A"}
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" mr={6}>
                          <Box fontWeight={800}>Creds this week</Box>
                          <Box color="#D810D6" mt={1}>
                            {props.community.CredWeek ? props.community.CredWeek : "N/A"}
                          </Box>
                        </Box>
                      </Box>

                      <Box width="100%" mt={2}>
                        {selectedSalutes === 1 && salutes.length > 0
                          ? salutes.map((salute, index) => {
                              return <SaluteItem item={salute} key={`salute-${index}`} />;
                            })
                          : creds.length > 0
                          ? creds.map((salute, index) => {
                              return <SaluteItem item={salute} key={`salute-${index}`} cred={true} />;
                            })
                          : null}
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </LoadingWrapper>
      </>
    );
  else return null;
}
