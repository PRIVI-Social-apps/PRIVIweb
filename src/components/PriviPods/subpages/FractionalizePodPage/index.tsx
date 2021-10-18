import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { Avatar, PrimaryButton, SecondaryButton, Variant } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";

import { ReactComponent as ShareIcon } from "assets/icons/share_filled.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import { ReactComponent as HeartIcon } from "assets/icons/heart.svg";
import { useParams } from "react-router-dom";
import axios from "axios";
import { sumTotalViews } from "shared/functions/totalViews";
import { useTypedSelector } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";
import PrintChart from "shared/ui-kit/Chart/Chart";
import BuyFraction from "components/PriviPods/modals/BuyFraction";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Moment from "react-moment";
import CreateOffer from "components/PriviPods/modals/CreateOffer";

const YearLabels: any[] = ["1W", "1M", "6M", "YTD", "1Y", "5Y", "MAX"];

const FreeHoursChartConfig = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: "bar",
          label: "",
          data: [] as any[],
          pointRadius: 0,
          backgroundColor: "#F9E373",
          borderColor: "#F9E373",
          pointBackgroundColor: "#F9E373",
          hoverBackgroundColor: "#F9E373",
          borderJoinStyle: "round",
          borderCapStyle: "round",
          borderWidth: 3,
          cubicInterpolationMode: "monotone",
          lineTension: 0.0,
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
          top: 10,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            offset: false,
            display: true,
            gridLines: {
              display: false,
              drawBorder: false,
              drawOnChartArea: true,
            },
            ticks: {
              beginAtZero: true,
              fontColor: "#6B6B6B",
              fontFamily: "Agrandir",
            },
            position: "top",
          },
        ],
        yAxes: [
          {
            display: false,
            gridLines: {
              color: "#EFF2F8",
            },
            ticks: {
              display: true,
              beginAtZero: true,
            },
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
            return `$${tooltipItem.yLabel.toFixed(4)}`;
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

      plugins: {
        datalabels: {
          display: function (context) {
            return context.dataset.data[context.dataIndex] !== 0;
          },
        },
      },
    },
  },
};

const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
    gradient.addColorStop(1, `${config.data.datasets[index].backgroundColor}33`);
    gradient.addColorStop(0.5, `${config.data.datasets[index].backgroundColor}b0`);
    config.data.datasets[index].backgroundColor = gradient;
  }

  return config;
};

const RadialConfig = {
  config: {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [] as any,
          backgroundColor: [] as any,
          hoverOffset: 0,
          labels: [] as any,
        },
      ],
    },
    options: {
      cutoutPercentage: 80,
      animation: false,
      rotation: Math.PI / 2,
      tooltips: { enabled: false },
    },
  },
};

const OFFERTABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: "TOKEN",
    headerAlign: "center",
  },
  {
    headerName: "SYMBOL",
    headerAlign: "center",
  },
  {
    headerName: "PRICE",
    headerAlign: "center",
  },
  {
    headerName: "AMOUNT",
    headerAlign: "center",
  },
];

const TRADINGTABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: "TYPE",
    headerAlign: "center",
  },
  {
    headerName: "TOKEN",
    headerAlign: "center",
  },
  {
    headerName: "PRICE",
    headerAlign: "center",
  },
  {
    headerName: "FROM",
    headerAlign: "center",
  },
  {
    headerName: "TO",
    headerAlign: "center",
  },
  {
    headerName: "DATE",
    headerAlign: "center",
  },
];

const txnTypeMap = {
  PRIVI_credit_creation: "Creation",
  PRIVI_credit_deposit: "Lent",
  PRIVI_credit_borrowing: "Borrowed",
  PRIVI_credit_collateral: "Collateral",
  PRIVI_credit_interest: "Interest",
  PRIVI_credit_withdraw: "Withdraw",
  PRIVI_credit_modified: "Modified",
  PRIVI_risk_taking: "Assume Risk",

  NFT_Pod_Selling: "Sell",
  NFT_Pod_Buying: "Buy",

  POD_Minting: "Mint",
  POD_Buying: "Buy",
};

const useStyles = makeStyles(theme => ({
  container: {
    background: "#EAE8FA",
    height: `calc(100vh - 80px)`,
    paddingBottom: "40px",
  },
  subContainer: {
    width: "100%",
    overflowY: "auto",
    scrollbarWidth: "none",
    height: "calc(100vh - 80px)",
    paddingBottom: "80px",
  },
  fractionBox: {
    color: "white",
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    fontSize: "12px",
    background: "#7F6FFF",
  },
  title: {
    fontSize: "26px",
    fontWeight: 800,
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: "12px",
    color: "grey",
  },
  header2: {
    fontSize: "16px",
    fontWeight: 400,
  },
  header3: {
    fontSize: "16px",
    fontWeight: 800,
  },
  svgBox: {
    width: theme.spacing(3),
    "& svg": {
      width: "100%",
      height: "100%",
    },
    "& path": {
      stroke: "black",
    },
  },
  colorBox: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: theme.spacing(0.5),
  },
  graphBox: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2.5),
    border: `2px solid #18181822`,
    borderRadius: theme.spacing(2),
    position: "relative",
    background: "white",
    boxShadow: "0px 2px 14px rgba(0, 0, 0, 0.08)",
  },
  graphHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBox: {
    backgroundSize: "cover",
    backgroundRepeat: "none",
  },
  backgroundBox: {
    backgroundSize: "cover",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(60px)",
  },
}));

export const FractionalizePodPage = props => {
  const classes = useStyles();
  const params: any = useParams();

  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const [pod, setPod] = React.useState<any>();
  const [creators, setCreators] = React.useState<any[]>([]);
  const [followed, setFollowed] = React.useState<boolean>(false);
  const [URLPodPhoto, setURLPodPhoto] = React.useState<string>("");

  const [rewardConfig, setRewardConfig] = React.useState<any>();
  const [ownershipConfig, setOwnershipConfig] = React.useState<any>();
  const [stakingRadialConfig, setStakingRadialConfig] = React.useState<any>();

  const [openBuyFraction, setOpenBuyFraction] = React.useState<boolean>(false);
  const [openSellFration, setOpenSellFraction] = React.useState<boolean>(false);

  const [offerList, setOfferList] = React.useState<any[]>([]);

  React.useEffect(() => {
    const newRewardConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newRewardConfig.configurer = configurer;
    newRewardConfig.config.data.labels = YearLabels;
    newRewardConfig.config.data.datasets[0].data = [10, 40, 65, 80, 120, 59, 350];
    newRewardConfig.config.data.datasets[0].backgroundColor = "#0FCEA6";
    newRewardConfig.config.data.datasets[0].borderColor = "#0FCEA6";
    newRewardConfig.config.data.datasets[0].pointBackgroundColor = "#0FCEA6";
    newRewardConfig.config.data.datasets[0].hoverBackgroundColor = "#0FCEA6";
    newRewardConfig.config.data.datasets[0].type = "line";
    newRewardConfig.config.options.scales.xAxes[0].offset = false;
    newRewardConfig.config.options.scales.yAxes[0].ticks.display = false;
    setRewardConfig(newRewardConfig);

    const newOwnershipConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newOwnershipConfig.configurer = configurer;
    newOwnershipConfig.config.data.labels = YearLabels;
    newOwnershipConfig.config.data.datasets[0].data = [10, 128, 65, 75, 120, 230, 350];
    newOwnershipConfig.config.data.datasets[0].backgroundColor = "#559AF4";
    newOwnershipConfig.config.data.datasets[0].borderColor = "#559AF4";
    newOwnershipConfig.config.data.datasets[0].pointBackgroundColor = "#559AF4";
    newOwnershipConfig.config.data.datasets[0].hoverBackgroundColor = "#559AF4";
    newOwnershipConfig.config.data.datasets[0].type = "line";
    newOwnershipConfig.config.options.scales.xAxes[0].offset = false;
    newOwnershipConfig.config.options.scales.yAxes[0].ticks.display = false;
    setOwnershipConfig(newOwnershipConfig);

    const newStakingRadial = JSON.parse(JSON.stringify(RadialConfig));
    newStakingRadial.config.data.datasets[0].labels = [
      "Creator Fraction",
      "Fractions For Sale",
      "Sold Fractions",
    ];
    newStakingRadial.config.data.datasets[0].data = [50, 25, 25];
    newStakingRadial.config.data.datasets[0].backgroundColor = ["#0FCEA6", "#FF78D3", "#F9E373"];
    setStakingRadialConfig(newStakingRadial);

    const sortedList = [] as any;
    const object = {
      type: txnTypeMap["PRIVI_credit_creation"],
      Token: "BNB",
      quantity: 152.25,
      from: "0xeec9...82f8",
      to: "0xeec9...82f8",
      date: new Date(),
      id: "test",
      chain: "Substrate",
      price: "45",
      status: "Pending",
    };
    sortedList.push(object);
    sortedList.push(object);
    sortedList.push(object);
    sortedList.push(object);
    sortedList.push(object);

    setOfferList(sortedList);
  }, []);

  React.useEffect(() => {
    if (params.podAddress) {
      loadData(params.podAddress);
    }
  }, [params]);

  const getRandomImageUrl = () => {
    return require(`assets/podImages/${Math.floor(Math.random() * 15 + 1)}.png`);
  };

  const loadData = async podAddress => {
    if (podAddress && podAddress.length > 0) {
      try {
        const response = await axios.get(`${URL()}/mediaPod/getMediaPod/${podAddress}`);
        const resp = response.data;
        if (resp.success) {
          const podData = resp.data.mediaPod;
          const medias = resp.data.medias;

          sumTotalViews(podData, true);
          let podCopy = { ...podData };
          let p = podCopy.Posts;

          if (users && users.length > 0 && p && typeof p[Symbol.iterator] === "function") {
            p.forEach((post, index) => {
              if (users.some(user => user.id === post.createdBy)) {
                const thisUser = users[users.findIndex(user => user.id === post.createdBy)];
                p[index].userImageURL = thisUser.imageURL;
                p[index].userName = thisUser.name;
              }
            });
            podCopy.Posts = p;
          }

          const responsePosts = await axios.get(`${URL()}/pod/wall/getPodPosts/${podAddress}`);
          podCopy.PostsArray = responsePosts.data.data;

          setPod(podCopy);

          let arts: any[] = [] as any;
          let creator = users.find(userItem => userItem.id === podCopy.Creator);
          arts.push(creator);

          for (let media of medias) {
            let creator = users.find(userItem => userItem.id === media.Creator);
            if (
              arts &&
              arts.length > 0 &&
              arts.findIndex(art => art && art.id && art.id === creator) !== -1
            ) {
              arts.push(creator);
            }

            if (media && media.Collabs && media.Collabs !== {}) {
              let collabs: any[] = [];
              for (const [key, value] of Object.entries(media.Collabs)) {
                collabs.push(key);
              }

              for (let collab of collabs) {
                let usr = users.find(userItem => userItem.id === collab);
                if (usr && arts.findIndex(art => art.id === creator) !== -1) {
                  arts.push(usr);
                }
              }
            }
          }
          setCreators(arts);

          if (podData.HasPhoto && podData.HasPhoto === true) {
            setURLPodPhoto(podData.Url ?? getRandomImageUrl());
          }

          // check if user already followed the pod
          const followers: any[] = podData.Followers ?? [];
          if (followers) {
            let followed = false;
            followers.forEach(followerData => {
              if (followerData.id === user.id) {
                followed = true;
              }
            });
            setFollowed(followed);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getOffersTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    offerList.map(item => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: <img src={require(`assets/tokenImages/${item.Token}.png`)} width={24} height={24} />,
        cellAlign: "center",
      });
      row.push({
        cell: <Box>{item.Token}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Box>{item.price}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Box>{item.quantity}</Box>,
        cellAlign: "center",
      });
      tableData.push(row);
    });

    return tableData;
  };

  const getTradingTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    offerList.map(item => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: <Box>{item.type}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <img src={require(`assets/tokenImages/${item.Token}.png`)} width={24} height={24} />,
        cellAlign: "center",
      });
      row.push({
        cell: <Box>{item.price}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Box color="#7F6FFF">{item.from}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Box color="#7F6FFF">{item.to}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Moment fromNow>{item.Date}</Moment>,
        cellAlign: "center",
      });
      tableData.push(row);
    });

    return tableData;
  };

  return pod ? (
    <Box className={classes.container}>
      <Box className={classes.subContainer}>
        <Box className={classes.headerBox} style={{ backgroundImage: `url(${URLPodPhoto})` }}>
          <Box p={4} className={classes.backgroundBox}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Box className={classes.flexBox}>
                  <Box className={classes.fractionBox}>Fractionalised 50%</Box>
                </Box>
                <Box className={classes.title} mt={2}>
                  {pod.Name || "Untitled Pod"}
                </Box>
                <Box mt={2}>{pod.Description || ""}</Box>
                <Box className={classes.flexBox} mt={2}>
                  {creators && (
                    <Box className={classes.flexBox}>
                      {creators
                        .filter(item => item.id === pod.Creator)
                        .map((creator, index) => (
                          <Box className={classes.flexBox}>
                            <Box className={classes.header1} mr={1}>
                              Main owner
                            </Box>
                            <Box ml={index > 1 ? "-16px" : 0} key={index}>
                              <Avatar
                                size="medium"
                                url={
                                  creator?.imageURL
                                    ? `url(${creator?.imageURL})`
                                    : require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")
                                }
                                alt=""
                              />
                            </Box>
                          </Box>
                        ))}
                      {creators
                        .filter(item => item.id !== pod.Creator)
                        .map((creator, index) => (
                          <Box className={classes.flexBox} ml={3}>
                            <Box className={classes.header1} mr={1}>
                              Creators
                            </Box>
                            <Box ml={index > 1 ? "-16px" : 0} key={index}>
                              <Avatar
                                size="small"
                                url={
                                  creator?.imageURL
                                    ? `url(${creator?.imageURL})`
                                    : require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")
                                }
                                alt=""
                              />
                            </Box>
                          </Box>
                        ))}
                    </Box>
                  )}
                  <Box ml={4} className={classes.svgBox}>
                    <ShareIcon />
                  </Box>
                  <Box ml={2} className={classes.svgBox}>
                    <HeartIcon />
                  </Box>
                  <Box ml={2} className={classes.flexBox} style={{ cursor: "pointer" }}>
                    <Box className={classes.svgBox}>
                      <PlusIcon />
                    </Box>
                    <Box ml={1}>{followed ? "Unfollow" : "Follow"}</Box>
                  </Box>
                </Box>
                <Box mt={1}>
                  <Box my={1}>Ownership Distribution</Box>
                  <Box className={classes.flexBox} alignItems="flex-start">
                    <Box>
                      {stakingRadialConfig && <PrintChart config={stakingRadialConfig} canvasHeight={150} />}
                    </Box>
                    <Box ml={2}>
                      {stakingRadialConfig &&
                        stakingRadialConfig.config.data.datasets[0].labels.map((item, index) => (
                          <Box
                            className={classes.flexBox}
                            mb={2}
                            key={"labels-" + index}
                            justifyContent="space-between"
                          >
                            <Box className={classes.flexBox}>
                              <Box
                                className={classes.colorBox}
                                style={{
                                  background:
                                    stakingRadialConfig.config.data.datasets[0].backgroundColor[index],
                                }}
                              />
                              <Box className={classes.header2} ml={1}>
                                {item}
                              </Box>
                            </Box>
                            <Box className={classes.header1} ml={3}>
                              ${stakingRadialConfig.config.data.datasets[0].data[index]}
                            </Box>
                          </Box>
                        ))}
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box height={240} py={2} overflow={"hidden"}>
                  <img
                    src={URLPodPhoto ?? require("assets/backgrounds/video.png")}
                    style={{ objectFit: "fill", borderRadius: "8px" }}
                    height="100%"
                  />
                </Box>
                <Box mt={3}>
                  <Box>About Collection Name</Box>
                  <Box className={classes.header1} mt={1}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus i....
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box p={4} className={classes.flexBox} width={1} style={{ background: "white" }}>
          <Box>
            <Box className={classes.header1}>Interest Rate</Box>
            <Box className={classes.header3}>1%</Box>
          </Box>
          <Box ml={4}>
            <Box className={classes.header1}>Creator Royalty</Box>
            <Box className={classes.header3}>0.45%</Box>
          </Box>
          <Box ml={4}>
            <Box className={classes.header1}>Fraction Price</Box>
            <Box className={classes.header3}>ETH 0.05456</Box>
          </Box>
          <Box ml={4}>
            <Box className={classes.header1}>Buy Back Price</Box>
            <Box className={classes.header3}>ETH 20</Box>
          </Box>
        </Box>
        <Box mt={3} px={4}>
          <Box className={classes.flexBox} justifyContent="flex-end" px={2}>
            <SecondaryButton size="small" onClick={() => setOpenSellFraction(true)}>
              Sell
            </SecondaryButton>
            <PrimaryButton size="small" onClick={() => setOpenBuyFraction(true)}>
              Buy
            </PrimaryButton>
          </Box>
        </Box>
        <Box p={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box className={classes.graphBox} height="400px">
                <Box className={classes.graphHeader}>
                  <Box className={classes.header1} mb={1}>
                    Fraction Price (1%)
                  </Box>
                </Box>
                <Box
                  className={classes.flexBox}
                  justifyContent="space-between"
                  pb={1}
                  style={{ borderBottom: "1px solid #18181822" }}
                >
                  <Box className={classes.flexBox} alignItems="flex-end">
                    <Box className={classes.header3}>ETH 2.5887</Box>
                    <Box className={classes.header1} color="black" ml={1}>
                      per fraction
                    </Box>
                  </Box>
                  <Box className={classes.header3} color="#65CB63">
                    +17%
                  </Box>
                </Box>
                <Box height={1} style={{ background: "rgba(39, 232, 217, 0.05)" }} borderRadius={16}>
                  {rewardConfig && <PrintChart config={rewardConfig} />}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className={classes.graphBox} height="400px">
                <Box className={classes.graphHeader}>
                  <Box className={classes.header1} mb={1}>
                    Shared Ownership History
                  </Box>
                </Box>
                <Box
                  className={classes.flexBox}
                  justifyContent="space-between"
                  pb={1}
                  style={{ borderBottom: "1px solid #18181822" }}
                >
                  <Box className={classes.flexBox} alignItems="flex-end">
                    <Box className={classes.header3}>95.6</Box>
                    <Box className={classes.header1} color="black" ml={1}>
                      fractions
                    </Box>
                  </Box>
                  <Box className={classes.header3} color="#65CB63">
                    +57%
                  </Box>
                </Box>
                <Box height={1} style={{ background: "#E2EAED22" }} borderRadius={16}>
                  {ownershipConfig && <PrintChart config={ownershipConfig} />}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box px={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box className={classes.flexBox} mb={1}>
                <Box className={classes.header3}>Buying Offers</Box>
                <Box className={classes.header1} ml={2} style={{ cursor: "pointer", color: "#7F6FFF" }}>
                  VIEW ALL
                </Box>
              </Box>
              <CustomTable
                headers={OFFERTABLEHEADER}
                rows={getOffersTableData()}
                variant={Variant.Tertiary}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className={classes.flexBox} mb={1}>
                <Box className={classes.header3}>Selling Offers</Box>
                <Box className={classes.header1} ml={2} style={{ cursor: "pointer", color: "#7F6FFF" }}>
                  VIEW ALL
                </Box>
              </Box>
              <CustomTable
                headers={OFFERTABLEHEADER}
                rows={getOffersTableData()}
                variant={Variant.Tertiary}
              />
            </Grid>
          </Grid>
        </Box>
        <Box p={4}>
          <Box className={classes.flexBox} mb={1}>
            <Box className={classes.header3}>Trading History</Box>
            <Box className={classes.header1} ml={2} style={{ cursor: "pointer", color: "#7F6FFF" }}>
              VIEW ALL
            </Box>
          </Box>
          <CustomTable headers={TRADINGTABLEHEADER} rows={getTradingTableData()} variant={Variant.Tertiary} />
        </Box>
      </Box>
      {openBuyFraction && (
        <BuyFraction open={openBuyFraction} handleClose={() => setOpenBuyFraction(false)} pod={pod} />
      )}
      {openSellFration && (
        <CreateOffer open={openSellFration} handleClose={() => setOpenSellFraction(false)} media={pod} />
      )}
    </Box>
  ) : (
    <LoadingWrapper loading />
  );
};
