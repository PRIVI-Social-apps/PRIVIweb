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
import { Avatar } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { ReactComponent as ShareIcon } from "assets/icons/share_filled.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import { ReactComponent as MinusIcon } from "assets/icons/minus.svg";
import { MediaPage } from "./SubPages/MediaPage";
import Investments from "./SubPages/Investments";
import Discussion from "./SubPages/Discussion";
import { useHistory, useParams } from "react-router-dom";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useTypedSelector } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { musicDaoGetPod, musicDaoFollowPod, musicDaoUnfollowPod, musicDaoFruitPod } from "shared/services/API"
import { formatNumber } from "shared/functions/commonFunctions";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";


const POSTABOPTIONS = ["Media", "Investments", "Chat"];

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
  tagBox: {
    background: "rgba(175, 172, 215, 0.3)",
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    borderRadius: theme.spacing(0.5),
  },
  tabBox: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    borderRadius: theme.spacing(4),
    color: "black",
    cursor: "pointer",
  },
  selectedTabBox: {
    background: "black",
    color: "white",
  },
}));

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

export const PodDetailsPage = () => {
  const classes = useStyles();
  const params: any = useParams();
  const history = useHistory();

  const user = useTypedSelector(state => state.user);
  const { convertTokenToUSD } = useTokenConversion();
  const { showAlertMessage } = useAlertMessage();

  const [podMenuSelection, setPodMenuSelection] = React.useState<number>(0);
  const [pod, setPod] = React.useState<any>();
  const [followed, setFollowed] = React.useState<boolean>(false);

  const [openShareMenu, setOpenShareMenu] = React.useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);
  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();

  React.useEffect(() => {
    loadData();
  }, [params]);

  const getRandomImageUrl = () => {
    return require(`assets/podImages/${Math.floor(Math.random() * 15 + 1)}.png`);
  };

  const loadData = async () => {
    const podAddress = params.podAddress;
    if (podAddress) {
      try {
        const resp = await musicDaoGetPod(podAddress);
        if (resp?.success) {
          const podData = resp.data;
          // let p = podData.Posts;
          // if (users && users.length > 0 && p && typeof p[Symbol.iterator] === "function") {
          //   p.forEach((post, index) => {
          //     if (users.some(user => user.id === post.createdBy)) {
          //       const thisUser = users[users.findIndex(user => user.id === post.createdBy)];
          //       p[index].userImageURL = thisUser.imageURL;
          //       p[index].userName = thisUser.name;
          //     }
          //   });
          //   podData.Posts = p;
          // }
          // const responsePosts = await axios.get(`${URL()}/pod/wall/getPodPosts/${podAddress}`);
          // podData.PostsArray = responsePosts.data.data;
          setPod(podData);
          // check if user already followed the pod
          const followers: any[] = podData.Followers ?? [];
          setFollowed(followers.find(followerData => followerData.id == user.id) != undefined);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFollow = async () => {
    if (!followed) {
      musicDaoFollowPod(user.id, pod.PodAddress).then(resp => {
        if (resp.success) {
          showAlertMessage(`followed`, { variant: "success" });
          setFollowed(true);
        } else {
          showAlertMessage(`follow failed`, { variant: "error" });
        }
      });
    }
    else {
      musicDaoUnfollowPod(user.id, pod.PodAddress).then(resp => {
        if (resp.success) {
          showAlertMessage(`unfollowed`, { variant: "success" });
          setFollowed(false);
        } else {
          showAlertMessage(`unfollow failed`, { variant: "error" });
        }
      });
    }
  };

  const handleFruit = type => {
    musicDaoFruitPod(user.id, pod.PodAddress, type).then(res => {
      if (res.success) {
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
        <Box className={classes.headerBox} style={{ backgroundImage: `url(${pod?.url ? pod.url : getRandomImageUrl()})` }}>
          <Box px={21} py={4} className={classes.backgroundBox}>
            <Grid container>
              <Grid item xs={8} style={{ paddingRight: "64px" }}>
                <Box className={classes.flexBox}>
                  <Box className={classes.fractionBox}>Fractionalised 50%</Box>
                </Box>
                <Box className={classes.title} mt={2}>
                  {pod.Name || "Untitled Pod"}
                </Box>
                <Box className={classes.flexBox}>
                  <Box className={classes.tagBox}>pop</Box>
                  <Box className={classes.tagBox} ml={1}>
                    electro
                  </Box>
                </Box>
                <Box mt={2} className={classes.header1}>
                  {pod.Description}
                </Box>
                <Box className={classes.flexBox} mt={2}>
                  {pod.CreatorsData.map((creator, index) => (
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
                          creator?.imageUrl
                            ? `url(${creator?.imageUrl})`
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
                    <FruitSelect counter1={3} counter2={30} counter3={123} fruitObject={{}} members={[]} onGiveFruit={handleFruit} />
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
                    src={pod.url ?? require("assets/backgrounds/video.png")}
                    style={{ objectFit: "fill", borderRadius: "8px" }}
                    height="100%"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box
          px={21}
          py={2}
          className={classes.flexBox}
          style={{ background: "white", opacity: "0.8" }}
          justifyContent="space-between"
        >
          <Box>
            <Box className={classes.header1}>Price</Box>
            <Box className={classes.header2} mt={1}>
              {formatNumber(convertTokenToUSD(pod.FundingToken, pod?.Price ?? 0), "USD", 4)}
            </Box>
          </Box>
          <Box>
            <Box className={classes.header1}>Interest Rate</Box>
            <Box className={classes.header2} mt={1}>
              {(pod?.InvestorDividend ?? 0) * 100}%
            </Box>
          </Box>
          <Box>
            <Box className={classes.header1}>Raised Funds</Box>
            <Box className={classes.header2} mt={1}>
              {formatNumber(convertTokenToUSD(pod.FundingToken, pod?.RaisedFunds ?? 0), "USD", 4)}
            </Box>
          </Box>
          <Box>
            <Box className={classes.header1}>Market Cap</Box>
            <Box className={classes.header2} mt={1}>
              {formatNumber((pod?.SupplyReleased ?? 0) * convertTokenToUSD(pod.FundingToken, pod?.Price ?? 0), "USD", 4)}
            </Box>
            <Box className={classes.header3} mt={1}></Box>
          </Box>
          <Box>
            <Box className={classes.header1}>Supply Released</Box>
            <Box className={classes.header2} mt={1}>
              {formatNumber(pod?.SupplyReleased ?? 0, pod.TokenSymbol, 4)}
            </Box>
            <Box className={classes.header3} mt={1}></Box>
          </Box>
          <Box>
            <Box className={classes.header1}>Share & Earn</Box>
            <Box className={classes.header2} mt={1}>
              {pod?.SharingPercent ?? 0}%
            </Box>
            <Box className={classes.header3} mt={1}></Box>
          </Box>
          <Box>
            <Box className={classes.header1}>Revenue</Box>
            <Box className={classes.header2} mt={1}>
              --
            </Box>
            <Box className={classes.header3} mt={1}></Box>
          </Box>
        </Box>
        <Box px={21} style={{ borderBottom: "1px solid #00000022" }} py={1}>
          <Box className={classes.flexBox}>
            {POSTABOPTIONS.map((item, index) => (
              <Box
                className={`${classes.tabBox} ${podMenuSelection === index ? classes.selectedTabBox : ""}`}
                onClick={() => setPodMenuSelection(index)}
              >
                {item}
              </Box>
            ))}
          </Box>
        </Box>
        <Box px={21} pb={4}>
          <Box pt={2}>
            {podMenuSelection === 0 && <MediaPage medias={pod.Medias} />}
            {podMenuSelection === 1 && <Investments pod={pod} handleRefresh={loadData} />}
            {podMenuSelection === 2 && <Discussion
              podId={params.podAddress}
              pod={pod}
              refreshPod={() => loadData()}
            />
            }
          </Box>
        </Box>
      </Box>
    </Box>
  ) : (
    <LoadingWrapper loading />
  );
};
