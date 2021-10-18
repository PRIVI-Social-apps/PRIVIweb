import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  withStyles,
} from "@material-ui/core";

import { useTypedSelector } from "store/reducers/Reducer";
import { ReactComponent as ShareIcon } from "assets/icons/share_filled.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus-small.svg";
import { ReactComponent as MinusIcon } from "assets/icons/minus.svg";
import { ReactComponent as QuestionIcon } from "assets/icons/question-circle.svg";

import { Avatar, TabNavigation } from "shared/ui-kit";
import { Carousel } from "shared/ui-kit/Carousel";
import Box from "shared/ui-kit/Box";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import URL from "shared/functions/getURL";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { ReactComponent as InfoIcon } from "assets/icons/info.svg";
import { sumTotalViews } from "shared/functions/totalViews";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";
import UserCard from "components/PriviPods/components/UserCard";
import Stats from "components/PriviPods/components/Claimable/Stats";
import ClaimableChat from "components/PriviPods/components/Claimable/Chat";
import DistributionProposals from "components/PriviPods/components/Claimable/DistributionProposals";
import { claimMusicPodStyles } from "./index.styles";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const POSTABOPTIONS = ["Stats", "Chat", "Distribution Proposals"];

const getRandomAvatarNumber = () => {
  const random = Math.floor(Math.random() * 99) + 1;
  if (random < 10) {
    return `00${random}`;
  }

  return `0${random}`;
};

const ClaimMusicPod = props => {
  const classes = claimMusicPodStyles();
  const params: any = useParams();

  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const [podMenuSelection, setPodMenuSelection] = React.useState<number>(0);
  const [currentPodsMenuOptions, setCurrentPodsMenuOptions] = React.useState<string[]>(POSTABOPTIONS);
  const [pod, setPod] = useState<any>();
  const [medias, setMedias] = useState<any>();
  const [creators, setCreators] = useState<any[]>([]);
  const [followed, setFollowed] = useState<boolean>(false);
  const [URLPodPhoto, setURLPodPhoto] = useState<string>("");
  const [trigger, setTrigger] = useState<boolean>(false);
  const [isClaimablePodLoading, setIsClaimablePodLoading] = useState<boolean>(false);

  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();

  const location = useLocation();

  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);

  const [status, setStatus] = React.useState<any>("");

  const CustomMenuItem = withStyles({
    root: {
      fontSize: "14px",
      fontFamily: "Agrandir",
    },
  })(MenuItem);

  useEffect(() => {
    if (params.podAddress) {
      console.log("=================", location);
      loadData(params.podAddress);
    }
  }, [params]);

  const getRandomImageUrl = () => {
    return require(`assets/podImages/${Math.floor(Math.random() * 15 + 1)}.png`);
  };

  const loadData = async podAddress => {
    if (isClaimablePodLoading) {
      return;
    }
    if (podAddress && podAddress.length > 0) {
      try {
        setIsClaimablePodLoading(true);
        const response = await axios.get(`${URL()}/claimableSongs/getClaimablePod/${podAddress}`);
        const resp = response.data;
        if (resp.success) {
          const podData = resp.data;
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
          arts.push({ url: podData.artist_image });
          let creator = users.find(userItem => userItem.id === podData.CreatorAddress);
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

          setURLPodPhoto(podData.album_image ? podData.album_image : getRandomImageUrl());

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
        setIsClaimablePodLoading(false);
      } catch (error) {
        console.log(error);
        setIsClaimablePodLoading(false);
      }
    }
  };

  const handleToggleShareMenu = e => {
    e.stopPropagation();
    e.preventDefault();

    setOpenShareMenu(prevShareMenuOpen => !prevShareMenuOpen);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenShareMenu(false);
  };

  const handleOpenShareModal = () => {
    shareMediaToSocial(pod.id || pod.urlSlug, "Pod", props.type);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const handleOpenQRCodeModal = () => {
    const link = `new-privi-pods/claim-music/${pod.PodAddress}`
    shareMediaWithQrCode(pod.id || pod.urlSlug, link);
  };

  const handleFollow = async () => {
    const body = {
      userId: user.id,
      songId: params.podAddress,
    };
    // follow
    if (!followed) {
      axios.post(`${URL()}/ClaimableSongs/followSong`, body).then(res => {
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
      axios.post(`${URL()}/ClaimableSongs/unFollowSong`, body).then(res => {
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
    axios
      .post(`${URL()}/ClaimableSongs/fruit`, body).then(res => {
        if (res.data?.success) {
          const itemCopy = { ...pod };
          itemCopy.fruits = [
            ...(itemCopy.fruits || []),
            { userId: user.id, fruitId: type, date: new Date().getTime() },
          ];
        }
      });
  };

  return pod ? (
    <Box className={`${classes.container} ${location.pathname.includes("privi-music-dao") && classes.containerFull}`}>
      <Box className={classes.subContainer}>
        <Box display="flex" justifyContent="space-between" gridColumnGap={50}
          style={{
            backgroundImage: `url(${require(`assets/backgrounds/claimable_song_bg.png`)})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: 40,
          }}
        >
          <div>
            <Box className={classes.flexBox}>
              <Box className={classes.fractionBox}>Fractionalised 50%</Box>
            </Box>
            <Box className={classes.title} mt={2}>
              {pod.song_name || "Untitled Pod"}
            </Box>
            <Box className={classes.description} mt={2}>
              {pod.Description ?? pod.description ?? "Pod description"}
            </Box>
            <Box display="flex" alignItems="flex-start" mt={5} gridColumnGap={24}>
              <Box className={classes.flexBox} mt={2}>
                <Box className={classes.creatorGroup}>
                  {creators.length > 1
                    ? (
                      creators.slice(0, 3).map((creator, index) => (
                        <Box key={index} className={classes.creator} style={{ left: `${index * 20}px` }}>
                          <Avatar
                            size="small"
                            url={
                              creator?.url
                                ? creator?.url
                                : require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")
                            }
                            alt=""
                          />
                        </Box>
                      )))
                    : (
                      [1, 2, 3].map((key) =>
                        <Avatar size="small" url={require(`assets/anonAvatars/ToyFaces_Colored_BG_${getRandomAvatarNumber()}.jpg`)} key={key} />
                      )
                    )
                  }
                </Box>
                <div
                  style={{ cursor: "pointer", marginLeft: '16px', height: '18px' }}
                  onClick={handleToggleShareMenu}
                  ref={anchorShareMenuRef}
                >
                  <ShareIcon className={classes.shareIcon} />
                </div>
                <Box ml={2}>
                  <FruitSelect counter1={3} counter2={30} counter3={123} fruitObject={pod} members={[]} onGiveFruit={handleFruit} />
                </Box>
                <Box ml={2} className={classes.flexBox} style={{ cursor: "pointer" }}>
                  <Box className={classes.svgBox}>{!followed ? <PlusIcon /> : <MinusIcon />}</Box>
                  <Box ml={1} onClick={handleFollow}>
                    {followed ? "Unfollow" : "Follow"}
                  </Box>
                </Box>
              </Box>
              <Box className={classes.fundsWrapper} mt={2}>
                <Box className={classes.flexBox} gridColumnGap={30}>
                  <Box className={classes.podFund}>
                    <Box fontSize={14}>🤑 Funds Raised</Box>
                    <Box fontSize={24}>{pod.priceToken ?? "pUSD"} {pod.funds ?? "0"}</Box>
                  </Box>
                  <Box className={classes.podPrice}>
                    <Box fontSize={14}>💰 Price</Box>
                    <Box fontSize={24}>{pod.priceToken ?? "pUSD"} {pod.price ?? "0"} / per second</Box>
                  </Box>
                </Box>
                <Box className={classes.podDescription}>
                  <InfoIcon />
                  <span>All Artist Must Verify Their Profiles in Order to Claim Funds</span>
                </Box>
              </Box>
            </Box>
          </div>
          <Box height={286} width={286} minWidth={286} overflow={"hidden"}>
            <img src={pod.album_image} style={{ objectFit: "cover" }} width="100%" height="100%" />
          </Box>
        </Box>
        <Box className={classes.statsLine}>
          <div>
            <Box className={classes.header1}>📈 Owner Share</Box>
            <Box className={classes.header2}>
              {pod.priceToken ?? "pUSD"} {pod.ownerShare ?? "N/A"}
            </Box>
          </div>
          <div>
            <Box className={classes.header1}>📊 Artists Share</Box>
            <Box className={classes.header2}>
              {pod.priceToken ?? "pUSD"} {pod.artistsShare ?? "N/A"}
            </Box>
          </div>
          <div>
            <Box className={classes.header1}>🎧 Reproductions</Box>
            <Box className={classes.header2}>{pod.reproductions ?? "N/A"}</Box>
          </div>
          <div>
            <Box className={classes.header1}>🍒 Fruits</Box>
            <Box className={classes.header2}>N/A</Box>
          </div>
          <div>
            <Box className={classes.header1}>🚀 Sharing Share</Box>
            <Box className={classes.header2}>
              {pod.token ?? "pUSD"} {pod.sharingShare ?? "N/A"}
            </Box>
          </div>
        </Box>
        <Box className={classes.userList}>
          <Carousel>
            {Array.from({ length: 10 }).map((item, index) => (
              <UserCard key={index} className={classes.userCard} />
            ))}
          </Carousel>
          <Box mt={3} display="flex" alignItems="center">
            <button className={classes.inviteButton}>Invite New People</button>
            <QuestionIcon className={classes.inviteInfoIcon} />
            <span className={classes.inviteInfo}>
              You can invite new people to be part of this Pod such as music technicians , record labels or
              whoever you want.
            </span>
          </Box>
        </Box>
        <Box className={classes.tabBar}>
          <TabNavigation
            tabs={currentPodsMenuOptions}
            currentTab={podMenuSelection}
            variant="secondary"
            onTabChange={setPodMenuSelection}
            padding={0}
          />
        </Box>
        <Box mt={2} className={classes.chartWrapper} mb={12}>
          {podMenuSelection === 0 && (
            <Stats pod={pod} refreshPod={() => setTrigger(!trigger)} trigger={trigger} />
          )}
          {podMenuSelection === 1 && (
            <ClaimableChat pod={pod} refreshPod={() => setTrigger(!trigger)} trigger={trigger} />
          )}
          {podMenuSelection === 2 && (
            <DistributionProposals pod={pod} refreshPod={() => setTrigger(!trigger)} trigger={trigger} />
          )}
        </Box>
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
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Box>
  ) : (
    <LoadingWrapper loading />
  );
};

export default ClaimMusicPod;
