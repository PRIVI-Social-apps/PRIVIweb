import {
  ClickAwayListener,
  Grid,
  Grow,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { Avatar, Divider, TabNavigation } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import URL from "shared/functions/getURL";

import { ReactComponent as ShareIcon } from "assets/icons/share_filled.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import { ReactComponent as MinusIcon } from "assets/icons/minus.svg";
import { MediaPage } from "./SubPages/MediaPage";
import Investments from "./SubPages/Investments";
import Discussion from "./SubPages/Discussion";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { sumTotalViews } from "shared/functions/totalViews";
import { useTypedSelector } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useShareMedia } from "shared/contexts/ShareMediaContext";

const POSTABOPTIONS = ["Media", "Investments", "Discussions"];

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
    fontSize: "48px",
    fontWeight: 800,
    lineHeight: "50.16px",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: "14px",
    fontWeight: 400,
    color: "#707582",
  },
  header2: {
    fontSize: "30px",
    fontWeight: 400,
    color: "#181818",
  },
  header3: {
    fontSize: "14px",
    fontWeight: 400,
    color: "#707582",
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
  divider: {
    border: "1px dashed #181818 !important",
  },
  paper: {
    width: 267,
    marginRight: -267,
    marginLeft: -90,
    borderRadius: 10,
    boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
    position: "inherit",
  },
  svgBox: {
    width: theme.spacing(2),
    "& svg": {
      width: "100%",
      height: "100%",
    },
    "& path": {
      stroke: "black",
    },
  },
}));

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

export const PodPage = props => {
  const classes = useStyles();
  const params: any = useParams();
  const history = useHistory();

  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const [podMenuSelection, setPodMenuSelection] = React.useState<number>(0);
  const [currentPodsMenuOptions, setCurrentPodsMenuOptions] = React.useState<string[]>(POSTABOPTIONS);
  const [pod, setPod] = React.useState<any>();
  const [medias, setMedias] = React.useState<any>();
  const [creators, setCreators] = React.useState<any[]>([]);
  const [followed, setFollowed] = React.useState<boolean>(false);
  const [URLPodPhoto, setURLPodPhoto] = React.useState<string>("");

  const [status, setStatus] = React.useState<any>("");
  const [openShareMenu, setOpenShareMenu] = React.useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);
  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();

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

          setMedias(medias);

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

  const handleFollow = async () => {
    const body = {
      userId: user.id,
      podId: pod.PodAddress,
    };
    // follow
    if (!followed) {
      axios.post(`${URL()}/mediaPod/followMediaPod`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "follow success",
            key: Math.random(),
            variant: "success",
          });
          setFollowed(true);
          loadData(params.podAddress);
        } else {
          setStatus({
            msg: "follow failed",
            key: Math.random(),
            variant: "error",
          });
        }
      });
    }
    // unfollow
    else {
      axios.post(`${URL()}/mediaPod/unFollowMediaPod`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "unfollow success",
            key: Math.random(),
            variant: "success",
          });
          setFollowed(false);
          loadData(params.podAddress);
        } else {
          setStatus({
            msg: "unfollow failed",
            key: Math.random(),
            variant: "error",
          });
        }
      });
    }
  };

  const handleFruit = type => {
    const body = {
      userId: user.id,
      podAddress: pod.PodAddress,
      fruitId: type,
    };
    axios.post(`${URL()}/mediaPod/fruit`, body).then(res => {
      if (res.data?.success) {
        const itemCopy = { ...pod };
        itemCopy.fruits = [
          ...(itemCopy.fruits || []),
          { userId: user.id, fruitId: type, date: new Date().getTime() },
        ];
      }
    });
  };

  const showShareMenu = () => {
    setOpenShareMenu(true);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenShareMenu(false);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const handleOpenQRCodeModal = () => {
    const link = window.location.href.includes("NFT")
      ? `new-privi-pods/MediaNFT/${pod.PodAddress}`
      : `new-privi-pods/FT/${pod.PodAddress}`;
    shareMediaWithQrCode(pod.urlSlug, link);
  };

  const handleOpenShareModal = () => {
    const link = window.location.href.includes("NFT")
      ? `new-privi-pods/MediaNFT/${pod.PodAddress}`
      : `new-privi-pods/FT/${pod.PodAddress}`;
    shareMediaToSocial(pod.urlSlug, "Pod", "NEW-PRIVI-PODS", link);
  };

  return pod ? (
    <Box className={classes.container}>
      <Box className={classes.subContainer}>
        <Box className={classes.headerBox} style={{ backgroundImage: `url(${URLPodPhoto})` }}>
          <Box p={4} className={classes.backgroundBox}>
            <Grid container>
              <Grid item xs={8} style={{ paddingRight: "64px" }}>
                <Box className={classes.flexBox}>
                  <Box className={classes.fractionBox}>Fractionalised 50%</Box>
                </Box>
                <Box className={classes.title} mt={2}>
                  {pod.Name || "Untitled Pod"}
                </Box>
                <Box mt={2} className={classes.header1}>
                  {pod.Description || ""}
                </Box>
                <Box className={classes.flexBox} mt={2}>
                  {creators.map((creator, index) => (
                    <Box
                      ml={index > 1 ? "-16px" : 0}
                      key={index}
                      onClick={() => {
                        history.push(`/profile/${creator.id}`);
                      }}
                      title={creator?.name}
                      style={{ cursor: "pointer" }}
                    >
                      <Avatar
                        size="medium"
                        url={
                          creator?.imageURL
                            ? `url(${creator?.imageURL})`
                            : require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")
                        }
                      />
                    </Box>
                  ))}
                  <Box ml={2} className={classes.svgBox}>
                    <div ref={anchorShareMenuRef}>
                      <ShareIcon onClick={showShareMenu} />
                    </div>
                  </Box>
                  {openShareMenu && (
                    <Popper
                      open={openShareMenu}
                      anchorEl={anchorShareMenuRef.current}
                      transition
                      disablePortal={false}
                      style={{ position: "inherit" }}
                    >
                      {({ TransitionProps, placement }) => (
                        <Grow
                          {...TransitionProps}
                          style={{
                            transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                            position: "inherit",
                          }}
                        >
                          <Paper className={classes.paper}>
                            <ClickAwayListener onClickAway={handleCloseShareMenu}>
                              <MenuList
                                autoFocusItem={openShareMenu}
                                id="menu-list-grow"
                                onKeyDown={handleListKeyDownShareMenu}
                              >
                                <CustomMenuItem onClick={handleOpenShareModal}>
                                  <img
                                    src={require("assets/icons/butterfly.png")}
                                    alt={"spaceship"}
                                    style={{ width: 20, height: 20, marginRight: 5 }}
                                  />
                                  Share on social media
                                </CustomMenuItem>
                                <CustomMenuItem onClick={handleOpenQRCodeModal}>
                                  <img
                                    src={require("assets/icons/qrcode_small.png")}
                                    alt={"spaceship"}
                                    style={{ width: 20, height: 20, marginRight: 5 }}
                                  />
                                  Share With QR Code
                                </CustomMenuItem>
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  )}
                  <Box ml={2}>
                    <FruitSelect
                      counter1={3}
                      counter2={30}
                      counter3={123}
                      fruitObject={pod}
                      members={[]}
                      onGiveFruit={handleFruit}
                    />
                  </Box>
                  <Box ml={2} className={classes.flexBox} style={{ cursor: "pointer" }}>
                    <Box className={classes.svgBox}>{!followed ? <PlusIcon /> : <MinusIcon />}</Box>
                    <Box ml={1} onClick={handleFollow}>
                      {followed ? "Unfollow" : "Follow"}
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box height={240} p={2} overflow={"hidden"}>
                  <img
                    src={URLPodPhoto ?? require("assets/backgrounds/video.png")}
                    style={{ objectFit: "fill", borderRadius: "8px" }}
                    height="100%"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box p={4} className={classes.flexBox} style={{ background: "white", opacity: "0.8" }}>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Box className={classes.header1}>🚀 Share & Earn</Box>
              <Box className={classes.header2} mt={1}>
                80
              </Box>
              <Box className={classes.header3} mt={1}>
                Total
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className={classes.header1}>💸 Investors</Box>
              <Box className={classes.header2} mt={1}>
                200
              </Box>
              <Box className={classes.header3} mt={1}>
                Total
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className={classes.header1}>👛 Price</Box>
              <Box className={classes.header2} mt={1}>
                USDT 200
              </Box>
              <Box className={classes.header3} mt={1}>
                = $ 1.334
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className={classes.header1}>🧑‍🤝‍🧑 Investors share</Box>
              <Box className={classes.header2} mt={1}>
                $320
              </Box>
              <Box className={classes.header3} mt={1}></Box>
            </Grid>
            <Grid item xs={12}>
              <Divider className={classes.divider} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className={classes.header1}>🏦 Supply Released</Box>
              <Box className={classes.header2} mt={1}>
                500 $SCULP
              </Box>
              <Box className={classes.header3} mt={1}></Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className={classes.header1}>💰 Raised Funds</Box>
              <Box className={classes.header2} mt={1}>
                USDT 2000
              </Box>
              <Box className={classes.header3} mt={1}></Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className={classes.header1}>📈 Market Cap</Box>
              <Box className={classes.header2} mt={1}>
                USDT 10K
              </Box>
              <Box className={classes.header3} mt={1}></Box>
            </Grid>
          </Grid>
        </Box>
        <Box pb={4}>
          <Box px={4} style={{ background: "#ffffff80" }}>
            <TabNavigation
              tabs={currentPodsMenuOptions}
              currentTab={podMenuSelection}
              variant="secondary"
              onTabChange={setPodMenuSelection}
              padding={0}
              theme="black"
            />
          </Box>
          <Box px={4} pt={2}>
            {podMenuSelection === 0 && <MediaPage medias={medias} />}
            {podMenuSelection === 1 && <Investments pod={pod} />}
            {podMenuSelection === 2 && (
              <Discussion
                podId={params.podAddress}
                pod={pod}
                refreshPod={() => loadData(params.podAddress)}
              />
            )}
          </Box>
        </Box>
      </Box>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Box>
  ) : (
    <LoadingWrapper loading />
  );
};
