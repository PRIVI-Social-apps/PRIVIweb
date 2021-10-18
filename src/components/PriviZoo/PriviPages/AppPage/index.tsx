import React, { useRef, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { default as ElasticCarousel } from "react-elastic-carousel";
import { useHistory, useParams } from "react-router-dom";
import Moment from "react-moment";

import { Grid } from "@material-ui/core";
import { Pagination, Rating } from "@material-ui/lab";

import { appPageStyles } from "./index.styles";
import PriviCard from "components/PriviZoo/components/PriviCard";
import { ChevronIconLeft as ChevronIconDown } from "shared/ui-kit/Icons/chevronIconDown";
import { ChevronIconLeft } from "shared/ui-kit/Icons";
import { Avatar, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

import { ReactComponent as PlusIcon } from "assets/icons/plus-solid.svg";
import { ReactComponent as StarIcon } from "assets/icons/star-regular.svg";
import { ReactComponent as StarSolidIcon } from "assets/icons/star-solid.svg";
import { ReactComponent as FaceBookIcon } from "assets/snsIcons/facebook.svg";
import { ReactComponent as TwitterIcon } from "assets/snsIcons/twitter.svg";
import { ReactComponent as InstagramIcon } from "assets/snsIcons/instagram.svg";
import { ReactComponent as LinkedInIcon } from "assets/snsIcons/linkedin.svg";
import { ReactComponent as TiktokIcon } from "assets/snsIcons/tiktok.svg";
import { ReactComponent as MediaIcon } from "assets/snsIcons/media.svg";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";

import { useSelector } from "react-redux";
import { getUser, getUsersInfoList } from "store/selectors";
import Axios from "axios";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const SampleData = [
  {
    name: "Privi Social",
    type: "social",
    count: "1234",
    description: "Customize your public profile and engage with other users.",
    url: "/privi-social",
    appUrl: "social",
    photo: require("assets/zooImages/Social.png"),
  },
  {
    name: "Privi DAO",
    type: "dao",
    count: "3654",
    description: "The heartbeat of the PRIVI network.",
    url: "/privi-dao",
    appUrl: "dao",
    photo: require("assets/zooImages/Dao.png"),
  },
  {
    name: "Privi Wallet",
    type: "wallet",
    count: "7865",
    description: "Manage your tokens and send transactions.",
    url: "/privi-wallet",
    appUrl: "wallet",
    photo: require("assets/zooImages/Wallet.png"),
  },
  {
    name: "Governance",
    type: "governance",
    count: "4567",
    description: "Reach consensus through collective voting mechanisms.",
    url: "/governance",
    appUrl: "governance",
    photo: require("assets/zooImages/Governance.png"),
  },
  {
    name: "Music Dao",
    type: "music-dao",
    count: "6531",
    description: "DAOs for Music ecosystem.",
    url: "/privi-music-dao",
    appUrl: "music-dao",
    photo: require("assets/zooImages/Music-Dao.png"),
  },
  {
    name: "Privi Art",
    type: "digital-art",
    count: "9875",
    description: "Create, share and purchase Digital Art.",
    url: "/privi-digital-art",
    appUrl: "digital-art",
    photo: require("assets/zooImages/Digital-Art.png"),
  },
  {
    name: "Privi Music",
    type: "music",
    count: "5644",
    description: "Create, share and purchase Music.",
    url: "/privi-music",
    appUrl: "music",
    photo: require("assets/zooImages/Music.png"),
  },
  {
    name: "Privi Data",
    type: "data",
    count: "696",
    description: "Monetize your Data as a valuable asset.",
    url: "/privi-data-new",
    appUrl: "data",
    photo: require("assets/zooImages/Data.png"),
  },
  {
    name: "Pods",
    type: "pods",
    count: "6877",
    description: "With Pods, any imaginable asset can be tokenized.",
    url: "/new-privi-pods",
    appUrl: "pods",
    photo: require("assets/zooImages/Pods.png"),
  },
  {
    name: "Collabs",
    type: "collabs",
    count: "7425",
    description: "Suggest Collaborations between famous artists and creators.",
    url: "/privi-collab",
    appUrl: "collabs",
    photo: require("assets/zooImages/Collabs.png"),
  },
];

const COLUMNS_COUNT_BREAK_POINTS = {
  375: 1,
  900: 3,
  1200: 4,
};

const GUTTER = "16px";

const PAGE_SIZE = 4;

const AppPage = ({ match }) => {
  const classes = appPageStyles();
  const carouselRef = useRef<any>();
  const history = useHistory();
  const userSelector = useSelector(getUser);
  const usersInfoList = useSelector(getUsersInfoList);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState<string>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rate, setRate] = useState<number>(5);

  const [currentApp, setCurrentApp] = useState<any>(null);

  React.useEffect(() => {
    if (match.params?.appId) {
      setCurrentApp(SampleData.find(data => data.type === match.params.appId));
    }
  }, [match.params?.appId]);

  React.useEffect(() => {
    if (currentApp) {
      setLoadingComments(true);
      Axios.get(`${URL()}/priviZoo/getComments/${currentApp.name}`)
        .then(res => {
          setComments(res.data.data);
          setLoadingComments(false);
        })
        .catch(_ => setLoadingComments(false));
    }
  }, [currentApp]);

  const addComment = () => {
    const body = {
      userId: userSelector.id,
      comment: comment,
      rate: rate,
    };
    Axios.post(`${URL()}/priviZoo/addComment/${currentApp.name}`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        setComment("");
        setComments(prev => [{ ...body, date: new Date().getTime() }, ...prev]);
      }
    });
  };

  const goApp = () => {
    if (currentApp.url) {
      history.push(
        `${currentApp.type == "social" ? `${currentApp.url}/${userSelector?.urlSlug}` : currentApp.url}`
      );
    }
  };

  const getCommentBox = item => {
    return (
      <Box width={1} key={item} mb={1} style={{ borderBottom: "1px solid #18181822" }}>
        <Box className={classes.flexBox} justifyContent="space-between">
          <Box className={classes.flexBox}>
            <Avatar
              size="medium"
              url={
                usersInfoList.find(user => user.id === item.userId)?.imageUrl ??
                require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")
              }
              alt=""
            />
            <Box mx={2}>{usersInfoList.find(user => user.id === item.userId)?.urlSlug}</Box>
            <Rating value={item.rate || 5} precision={0.5} disabled />
            <Box ml={2}>
              <b>{item.rate || 5}</b>
            </Box>
          </Box>
          <Moment format="DD.MM.YYYY">{item.date}</Moment>
        </Box>
        <Box className={classes.starBox} my={2}>
          {item.comment}
        </Box>
      </Box>
    );
  };

  const handleFacebookLink = () => {
    window.location.href = "https://www.facebook.com/PRIVI-Protocol-104693631453856";
  };

  const handleTwitterLink = () => {
    window.location.href = "http://www.twitter.com/priviprotocol";
  };

  const handleLinkedinLink = () => {
    window.location.href = "https://www.linkedin.com/company/privi-protocol/";
  };

  const handleInstagramLink = () => {
    window.location.href = "https://instagram.com/priviprotocol";
  };

  const handleTiktokLink = () => {
    window.location.href = "https://vm.tiktok.com/ZMechVPv8/";
  };

  const handleMediumLink = () => {
    window.location.href = "https://privi.medium.com/";
  };

  return (
    <Box width={1} pb={3}>
      <Box className={classes.navigationContainer}>
        <Box className={`${classes.flexBox} ${classes.contentBox}`} justifyContent="space-between" width={1}>
          <Box
            className={classes.flexBox}
            style={{ cursor: "pointer" }}
            onClick={() => {
              history.goBack();
            }}
          >
            <Box mr={3}>
              <ChevronIconLeft />
            </Box>
            <span className={classes.header2}>Back</span>
          </Box>
          <img src={require("assets/icons/upload.png")} />
        </Box>
        <Box className={`${classes.flexBox} ${classes.contentBox}`} justifyContent="space-between">
          <Box className={classes.title}>{currentApp?.name}</Box>
          <Box className={classes.flexBox}>
            <PrimaryButton size="medium" onClick={goApp}>
              Open App
            </PrimaryButton>
            {/* <SecondaryButton size="medium" onClick={() => { }}>
              <Box className={classes.flexBox}>
                <PlusIcon style={{ width: "16px", marginRight: "8px" }} />
                Add to My Apps
              </Box>
            </SecondaryButton> */}
          </Box>
        </Box>
        <Box className={classes.contentBox}>
          <ElasticCarousel
            isRTL={false}
            itemsToShow={1}
            pagination={false}
            showArrows={false}
            ref={carouselRef}
            onChange={(_, pageIndex) => {
              if (pageIndex !== currentPage) {
                setCurrentPage(pageIndex);
              }
            }}
          >
            {[1, 2, 3, 4].map(item => (
              <Box className={classes.musicBox} key={`${item}_elastic_item`}>
                <img src={currentApp?.photo} width="100%" height="100%" />
              </Box>
            ))}
          </ElasticCarousel>
          <Box
            className={classes.flexBox}
            justifyContent="space-between"
            style={{ background: "white" }}
            pt={1}
          >
            <Box className={classes.flexBox}>
              {[1, 2, 3, 4].map(item => (
                <Box
                  className={`${classes.indexDotBox} ${item === currentPage + 1 ? "selected" : ""}`}
                  key={item}
                  ml={1}
                  onClick={() => {
                    if (item !== currentPage + 1) {
                      carouselRef.current.goTo(item - 1);
                    }
                  }}
                >
                  <img
                    src={require("assets/backgrounds/music_app_back.png")}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              ))}
            </Box>
            <Box className={`${classes.navIconBox} ${classes.flexBox}`}>
              <Box
                style={{ transform: "rotate(90deg)" }}
                onClick={() => {
                  carouselRef.current.goTo(currentPage - 1);
                }}
              >
                <ChevronIconDown />
              </Box>
              <Box
                style={{ transform: "rotate(-90deg)" }}
                ml={3}
                onClick={() => {
                  carouselRef.current.goTo(currentPage + 1);
                }}
              >
                <ChevronIconDown />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Grid container spacing={2} className={classes.contentBox}>
        <Grid item xs={12} sm={6}>
          <Box className={classes.title2}>Stats</Box>
          <Box className={classes.flexBox}>
            <Box className={classes.starBox} width={1} mr={1}>
              <Rating
                disabled={true}
                value={4}
                precision={0.5}
                icon={<StarSolidIcon style={{ width: "25px", color: "black" }} />}
                emptyIcon={<StarIcon style={{ width: "25px" }} />}
              />
              <Box className={classes.flexBox} mt={1}>
                <Box mr={1}>
                  <b>4.5</b>
                </Box>
                <Box className={classes.header2}>155 Ratings</Box>
              </Box>
            </Box>
            <Box className={classes.starBox} width={1} ml={1}>
              <img src={require("assets/icons/profile-icon.png")} />
              <Box className={classes.flexBox} mt={1}>
                <Box mr={1}>
                  <b>24 555</b>
                </Box>
                <Box className={classes.header2}>Users</Box>
              </Box>
            </Box>
          </Box>
          <Box className={classes.descriptionBox} mt={3}>
            <Box className={classes.title2}>About {currentApp?.name}</Box>
            <Box mt={1} className={classes.header2}>
              {currentApp?.description}
            </Box>
          </Box>
          <Box mt={3}>
            <Box className={classes.title2}>Social platforms</Box>
            <Box mt={1} className={classes.flexBox}>
              <Box className={classes.snsBox} onClick={handleFacebookLink}>
                <FaceBookIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleTwitterLink}>
                <TwitterIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleInstagramLink}>
                <InstagramIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleLinkedinLink}>
                <LinkedInIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleTiktokLink}>
                <TiktokIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleMediumLink}>
                <MediaIcon />
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className={classes.title2}>User feedback</Box>
          <Box className={classes.starBox} width={1}>
            <Box
              className={classes.flexBox}
              style={{ borderBottom: "1px solid #18181822", paddingBottom: "16px" }}
            >
              <Avatar
                size="medium"
                url={
                  usersInfoList.find(user => user.id === userSelector.id)?.imageUrl ??
                  require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")
                }
                alt=""
              />
              <InputWithLabelAndTooltip
                overriedClasses=""
                inputValue={comment}
                onInputValueChange={e => setComment(e.target.value)}
                placeHolder="Add a comment..."
                style={{ margin: 0, marginLeft: "8px" }}
                type="text"
              />
            </Box>
            <Box className={classes.flexBox} justifyContent="space-between" mt={2}>
              <Box>
                <Box className={classes.header1}>Rate your experience:</Box>
                <Box className={classes.flexBox} mt={1}>
                  <Rating value={rate} precision={0.5} onChange={(e, v) => setRate(v || 0)} />
                  <Box ml={2}>
                    <b>{rate}</b>
                  </Box>
                </Box>
              </Box>
              <PrimaryButton size="medium" onClick={addComment}>
                Post
              </PrimaryButton>
            </Box>
          </Box>
          <Box className={classes.flexBox} justifyContent="space-between" mt={3}>
            <Box className={classes.title2}>All comments</Box>
            <Box>{comments.length} comments</Box>
          </Box>
          <LoadingWrapper loading={loadingComments}>
            {comments.length > 0 && (
              <>
                <Box className={classes.shadowBox} mt={2}>
                  {comments
                    .filter(
                      (_, index) => index >= (pageNumber - 1) * PAGE_SIZE && index < pageNumber * PAGE_SIZE
                    )
                    .map(item => getCommentBox(item))}
                </Box>
                <Box className={classes.flexBox} justifyContent="flex-end" mt={2}>
                  <Pagination
                    count={
                      comments.length - (comments.length % PAGE_SIZE) + (comments.length % 6 > 0 ? 1 : 0)
                    }
                    variant="outlined"
                    shape="rounded"
                    boundaryCount={1}
                    siblingCount={1}
                  />
                </Box>
              </>
            )}
          </LoadingWrapper>
        </Grid>
      </Grid>
      <Box width={1}>
        <Box className={classes.contentBox}>
          <Box className={classes.flexBox}>
            <img src={require("assets/icons/trending_icon_2.png")} width="56px" />
            <Box className={classes.title2}>Similar apps</Box>
          </Box>
          <Box className={classes.flexBox} mt={2} ml={3}>
            <Grid className={classes.cardsGrid}>
              <ResponsiveMasonry columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}>
                <Masonry gutter={GUTTER}>
                  {SampleData.filter(data => data.type !== match.params.appId).map(item => (
                    <Box
                      key={item.name}
                      mr={2}
                      onClick={() => {
                        history.push(`/privi-zoo/${item.appUrl}`);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <PriviCard item={item} />
                    </Box>
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppPage;
