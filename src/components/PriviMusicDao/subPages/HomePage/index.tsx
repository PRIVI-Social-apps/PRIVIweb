import React from "react";
import Carousel from "react-spring-3d-carousel";
import { useHistory } from "react-router-dom";

import { Box, Grid, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";

import {
  Color,
  FontSize,
  Gradient,
  HeaderBold1,
  PrimaryButton,
  SecondaryButton,
  StyledDivider,
} from "shared/ui-kit";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";
import TrendingSongCard from "components/PriviMusicDao/components/TrendingSongCard";
import ArtistCard from "components/PriviMusicDao/components/ArtistCard";
import { ChevronIconLeft } from "shared/ui-kit/Icons/chevronIconDown";
import { ArrowLeftIcon } from "../GovernancePage/styles";
import PodCard from "components/PriviMusicDao/components/Cards/PodCard";
import VoteCard from "components/PriviMusicDao/components/Cards/VoteCard";

const useStyles = makeStyles(theme => ({
  contentBox: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: `0 ${theme.spacing(21)}px`,
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    width: "100%",
    paddingBottom: theme.spacing(5),
    [theme.breakpoints.down("md")]: {
      padding: `0 ${theme.spacing(4)}px`,
      paddingBottom: theme.spacing(10),
    },
  },
  gradientBox: {
    width: "100%",
    height: 600,
    [theme.breakpoints.down("sm")]: {
      height: 800,
    },
  },
  musicBox1: {
    position: "absolute",
    top: -90,
    right: 300,
    opacity: 0.7,
    [theme.breakpoints.down("sm")]: {
      top: -60,
      right: 150,
      width: 120,
    },
  },
  musicBox2: {
    position: "absolute",
    top: 20,
    right: 80,
    [theme.breakpoints.down("sm")]: {
      right: 50,
      width: 200,
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header: {
    color: `${Color.White} !important`,
    margin: 0,
    fontSize: 58,
    "& span": {
      fontWeight: 400,
    },
  },
  headerTitle: {
    fontSize: "26px !important",
  },
  bgLinearGreen: {
    background: "linear-gradient(140.41deg, #2DE0AA 6.28%, #00ABBF 103.2%)",
    borderRadius: 20,
  },
  bgLinearOrange: {
    background: "linear-gradient(131.53deg, #FFD914 -6.52%, #F1A025 58.06%)",
    borderRadius: 20,
  },
  bgLinearBlue: {
    background: "linear-gradient(140.41deg, #7BB3E8 6.28%, #6A86E8 103.2%)",
    borderRadius: 20,
  },
  stakingValue: {
    fontSize: "26px !important",
    "& span": {
      opacity: 0.4,
    },
  },
  stakingTitle: {
    textTransform: "uppercase",
  },
  carouselBox: {
    width: "1000px",
    height: "400px",

    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: `0px ${theme.spacing(10)}px`,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      margin: `0px ${theme.spacing(5)}px`,
    },
  },
  arrowBox: {
    display: "flex",
    alignItems: "center",
    background: "white",
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    borderRadius: theme.spacing(4),
    boxShadow: "0px 10px 21px -9px rgba(105, 105, 105, 0.15)",
  },
  whiteBox: {
    position: "relative",
    borderRadius: theme.spacing(2.5),
    padding: theme.spacing(4),
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const Trendings = [
  {
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
    title: "Black Hole (Dan D’Lion Remix",
    description: "1,234,589 times uploaded",
  },
  {
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
    title: "Black Hole (Dan D’Lion Remix",
    description: "1,234,589 times uploaded",
  },
  {
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
    title: "Black Hole (Dan D’Lion Remix",
    description: "1,234,589 times uploaded",
  },
  {
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
    title: "Black Hole (Dan D’Lion Remix",
    description: "1,234,589 times uploaded",
  },
];

const Songs = [
  {
    startDate: new Date(1625848525045),
    endDate: new Date(1626885300000),
    possibleAnswers: ["Not so much", "Maybe", "Who knows"],
    question: "One of the obvious benefits of buying art is it lets you financially support",
    description:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
  },
  {
    startDate: new Date(1625848525045),
    endDate: new Date(1625848555555),
    votes: [
      {
        userAddress: "Px24ddc552-dfa0-4ee3-81f2-6ad9f8eacc87",
        answer: "Maybe",
      },
    ],
    possibleAnswers: ["Not so much", "Maybe", "Who knows"],
    question: "One of the obvious benefits of buying art is it lets you financially support",
    description:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
  },
  {
    possibleAnswers: ["Not so much", "Maybe", "Who knows"],
    question: "One of the obvious benefits of buying art is it lets you financially support",
    description:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
  },
];

const Artists = [
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
];

const SampleArtistsData = () => {
  const artistData: any[] = [];
  Artists.map((data, index) => {
    artistData.push({
      key: `uuid_${data.name}_${index}`,
      content: <ArtistCard data={data} customSize={{ width: 350 }} />,
    });
  });
  Artists.map((data, index) => {
    artistData.push({
      key: `uuid_${data.name}_2_${index}`,
      content: <ArtistCard data={data} customSize={{ width: 350 }} />,
    });
  });

  return artistData;
};

export default function HomePage() {
  const commonClasses = priviMusicDaoPageStyles();
  const classes = useStyles();

  const history = useHistory();

  const isSmallScreen = useMediaQuery("(max-width:375px)");
  const isMidScreen = useMediaQuery("(max-width:500px)");
  const isLargeScreen = useMediaQuery("(max-width:850px)");
  const isMobile = useMediaQuery("(max-width:750px)");
  const isTablet = useMediaQuery("(max-width:1050px)");
  const isPC = useMediaQuery("(max-width:1650px)");

  const [trendingSongs, setTrendingSongs] = React.useState(Trendings);
  const [songs, setSongs] = React.useState(Songs);

  const [currentSlider, setCurrentSlider] = React.useState<number>(0);

  const getStatsBar = () => {
    if (isSmallScreen) {
      return (
        <Box display="flex" flexDirection="column" justifyContent="space-between" mt={4}>
          <Box display="flex" flexDirection="column" mt={2} mr={3}>
            <Text className={classes.stakingValue}>
              8,5732 <span>Privi</span>
            </Text>
            <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
              Claimable songs
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" mt={2} mr={3}>
            <Text className={classes.stakingValue}>7,923</Text>
            <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
              Pods
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" mt={2} mr={3}>
            <Text className={classes.stakingValue}>
              49,983 <span>hrs</span>
            </Text>
            <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
              verified artists
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" mt={2} mr={3}>
            <Text className={classes.stakingValue}>
              76.594 <span>TRAX</span>
            </Text>
            <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
              Staked trax
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" mt={2} mr={3}>
            <Text className={classes.stakingValue}>76.594</Text>
            <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
              songs uploaded
            </Text>
          </Box>
        </Box>
      );
    } else if (isMidScreen) {
      return (
        <>
          <Box display="flex" flexDirection="row" justifyContent="space-between" mt={4}>
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>
                8,5732 <span>Privi</span>
              </Text>
              <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
                Claimable songs
              </Text>
            </Box>
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>7,923</Text>
              <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
                Pods
              </Text>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="space-between" mt={2}>
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>
                49,983 <span>hrs</span>
              </Text>
              <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
                verified artists
              </Text>
            </Box>
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>
                76.594 <span>TRAX</span>
              </Text>
              <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
                Staked trax
              </Text>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" mt={2} mr={3}>
            <Text className={classes.stakingValue}>76.594</Text>
            <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
              songs uploaded
            </Text>
          </Box>
        </>
      );
    } else if (isLargeScreen) {
      return (
        <>
          <Box display="flex" flexDirection="row" justifyContent="space-between" mt={4}>
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>
                8,5732 <span>Privi</span>
              </Text>
              <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
                Claimable songs
              </Text>
            </Box>
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>7,923</Text>
              <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
                Pods
              </Text>
            </Box>
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>
                49,983 <span>hrs</span>
              </Text>
              <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
                verified artists
              </Text>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="space-between" mt={2}>
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>
                76.594 <span>TRAX</span>
              </Text>
              <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
                Staked trax
              </Text>
            </Box>
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>76.594</Text>
              <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
                songs uploaded
              </Text>
            </Box>
          </Box>
        </>
      );
    } else {
      return (
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Box display="flex" flexDirection="column" mt={2} mr={3}>
            <Text className={classes.stakingValue}>
              8,5732 <span>Privi</span>
            </Text>
            <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
              Claimable songs
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" mt={2} mr={3}>
            <Text className={classes.stakingValue}>7,923</Text>
            <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
              Pods
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" mt={2} mr={3}>
            <Text className={classes.stakingValue}>
              49,983 <span>hrs</span>
            </Text>
            <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
              verified artists
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" mt={2} mr={3}>
            <Text className={classes.stakingValue}>
              76.594 <span>TRAX</span>
            </Text>
            <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
              Staked trax
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" mt={2} mr={3}>
            <Text className={classes.stakingValue}>76.594</Text>
            <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
              songs uploaded
            </Text>
          </Box>
        </Box>
      );
    }
  };

  return (
    <Box position="relative">
      <img src={require("assets/musicDAOImages/background.png")} className={classes.gradientBox} />
      <img src={require("assets/musicDAOImages/music-green2.png")} className={classes.musicBox1} />
      <img src={require("assets/musicDAOImages/music-green1.png")} className={classes.musicBox2} />
      <Box className={classes.contentBox}>
        <HeaderBold1 className={classes.header}>
          Music <span>DAO</span>
        </HeaderBold1>
        <Text className={classes.headerTitle} color={Color.White} bold>
          Stake & get content, governance rights & increasing profits.
        </Text>
        <Text className={classes.headerTitle} color={Color.White}>
          Enjoy endless hours of content by staking PRIVI coins.
        </Text>
        <Box display="flex" flexDirection="row" mt={4} mb={16}>
          {/* <PrimaryButton size="medium" className={commonClasses.primaryButton}>
            Stake Privi Coins
          </PrimaryButton>
          <SecondaryButton size="medium" className={commonClasses.secondaryButton}>
            How It Works
          </SecondaryButton> */}
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              position="relative"
              display="flex"
              flexDirection="column"
              height="100%"
              width="100%"
              px={5}
              pt={10}
              pb={7}
              className={classes.bgLinearGreen}
            >
              <Box position="absolute" top={-85} left={-45} width={200}>
                <img src={require("assets/musicDAOImages/music-green.png")} width="100%" alt="calc" />
              </Box>
              <Box display="flex" flexDirection="column" flex={1}>
                <Text size={FontSize.XXL} color={Color.White} bold mb={1}>
                  Get Free Music through Staking
                </Text>
                <Text size={FontSize.XL} color={Color.White}>
                  Buy shares and sell them with massive profit.
                </Text>
              </Box>
              <Box display="flex" flexDirection="row" justifyContent="center" mt={2.5} px={3}>
                <PrimaryButton
                  size="medium"
                  onClick={() => {
                    history.push("/privi-music-dao/liquidity");
                  }}
                  style={{ width: "100%" }}
                  isRounded
                >
                  Start Now
                </PrimaryButton>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              position="relative"
              display="flex"
              flexDirection="column"
              height="100%"
              width="100%"
              px={5}
              pt={10}
              pb={7}
              className={classes.bgLinearBlue}
            >
              <Box position="absolute" top={-40} left={20} width={120}>
                <img src={require("assets/musicDAOImages/invest.png")} width="100%" alt="calc" />
              </Box>
              <Box display="flex" flexDirection="column" flex={1}>
                <Text size={FontSize.XXL} color={Color.White} bold mb={1}>
                  Invest in &nbsp;Music Pods
                </Text>
                <Text size={FontSize.XL} color={Color.White}>
                  Blockchain crowdfunding contract to fund collaborations with other artists.
                </Text>
              </Box>
              <Box display="flex" flexDirection="row" justifyContent="center" mt={2.5} px={3}>
                <PrimaryButton
                  size="medium"
                  onClick={() => {
                    history.push("/privi-music-dao/claimable-music");
                  }}
                  style={{ width: "100%" }}
                  isRounded
                >
                  Start Now
                </PrimaryButton>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              position="relative"
              display="flex"
              flexDirection="column"
              height="100%"
              width="100%"
              px={5}
              pt={10}
              pb={7}
              className={classes.bgLinearOrange}
            >
              <Box position="absolute" top={-65} left={5} width={180}>
                <img src={require("assets/musicDAOImages/music.png")} width="100%" alt="calc" />
              </Box>
              <Box display="flex" flexDirection="column" flex={1}>
                <Text size={FontSize.XXL} color={Color.White} bold mb={1}>
                  High Yield Options
                </Text>
                <Text size={FontSize.XL} color={Color.White}>
                  Buy shares and sell them with massive profit.
                </Text>
              </Box>
              <Box display="flex" flexDirection="row" justifyContent="center" mt={2.5} px={3}>
                <PrimaryButton
                  size="medium"
                  onClick={() => {
                    history.push("/privi-music-dao/high-yield");
                  }}
                  style={{ width: "100%" }}
                  isRounded
                >
                  Start Now
                </PrimaryButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box className={classes.whiteBox} mt={3}>
          <Box
            style={{
              background: `url(${require("assets/musicDAOImages/Vector.png")})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <Box display="flex" flexDirection="column" flex={1}>
            <Text size={FontSize.XXL} color={Color.Black} bold mb={1}>
              Privi Music App
            </Text>
            <Text size={FontSize.XL} color={Color.MusicDAOLightBlue}>
              All of your favorite music in one place. Decentralized and unique.
            </Text>
          </Box>
          <PrimaryButton size="medium" style={{ background: Gradient.Green1 }} isRounded>
            Start Listening
          </PrimaryButton>
        </Box>
        <Box mt={5} mb={5}>
          <Text size={FontSize.XXL} color={Color.MusicDAODark} bold mb={1}>
            Get started with Privi Finance
          </Text>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              position="relative"
              display="flex"
              flexDirection="column"
              height="100%"
              px={5}
              pt={17}
              pb={7}
              style={{ background: "#CBE3F0", borderRadius: "20px" }}
            >
              <Box position="absolute" top={0} left={0} width={200}>
                <img src={require("assets/musicDAOImages/reward.png")} width="100%" alt="calc" />
              </Box>
              <Box display="flex" flexDirection="column" flex={1}>
                <Text size={FontSize.XXL} color={Color.MusicDAODark} bold mb={1}>
                  Get TRAX token
                </Text>
                <Text size={FontSize.XL} color={Color.MusicDAODark}>
                  Enjoy the features of Privi Music through TRAX Coin.
                </Text>
              </Box>
              <Box display="flex" flexDirection="row" justifyContent="center" mt={2.5} px={3}>
                <PrimaryButton
                  size="medium"
                  onClick={() => {
                    history.push("/privi-music-dao/liquidity");
                  }}
                  style={{ width: "100%" }}
                  isRounded
                >
                  Trade TRAX
                </PrimaryButton>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              position="relative"
              display="flex"
              flexDirection="column"
              height="100%"
              px={5}
              pt={17}
              pb={7}
              style={{ background: "#DAE6E5", borderRadius: "20px" }}
            >
              <Box position="absolute" top={0} left={0} width={200}>
                <img src={require("assets/musicDAOImages/calculator_stack.png")} width="100%" alt="calc" />
              </Box>
              <Box display="flex" flexDirection="column" flex={1}>
                <Text size={FontSize.XXL} color={Color.MusicDAODark} bold mb={1}>
                  Earn wih liquidity pools
                </Text>
                <Text size={FontSize.XL} color={Color.MusicDAODark}>
                  Provide liqudity to intervals of music to optimise your rewards
                </Text>
              </Box>
              <Box display="flex" flexDirection="row" justifyContent="center" mt={2.5} px={3}>
                <PrimaryButton
                  size="medium"
                  onClick={() => {
                    history.push("/privi-music-dao/claimable-music");
                  }}
                  style={{ width: "100%" }}
                  isRounded
                >
                  Explore Liquidituy
                </PrimaryButton>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              position="relative"
              display="flex"
              flexDirection="column"
              height="100%"
              px={5}
              pt={17}
              pb={7}
              style={{ background: "#E0D0FF", borderRadius: "20px" }}
            >
              <Box position="absolute" top={0} left={0} width={200}>
                <img src={require("assets/musicDAOImages/yield.png")} width="100%" alt="calc" />
              </Box>
              <Box display="flex" flexDirection="column" flex={1}>
                <Text size={FontSize.XXL} color={Color.MusicDAODark} bold mb={1}>
                  High Yeld Options
                </Text>
                <Text size={FontSize.XL} color={Color.MusicDAODark}>
                  Buy shares and sell them with massive profit.
                </Text>
              </Box>
              <Box display="flex" flexDirection="row" justifyContent="center" mt={2.5} px={3}>
                <PrimaryButton
                  size="medium"
                  onClick={() => {
                    history.push("/privi-music-dao/claimable-music");
                  }}
                  style={{ width: "100%" }}
                  isRounded
                >
                  Learn More
                </PrimaryButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box display="flex" flexDirection="column" mt={11}>
          <Text size={FontSize.XXL} bold>
            Music DAO Stats
          </Text>
          {getStatsBar()}
        </Box>
        <Box mt={5} mb={7}>
          <StyledDivider type="solid" />
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Text size={FontSize.XXL} bold>
            Trending Songs
          </Text>
          <SecondaryButton
            className={commonClasses.showAll}
            size="medium"
            radius={29}
            onClick={() => history.push("/privi-music-dao/trending_songs")}
          >
            Show All
            <Box position="absolute" flexDirection="row" top={0} right={0} pr={2}>
              <ArrowLeftIcon />
            </Box>
          </SecondaryButton>
        </Box>
        <Box className={classes.flexBox} mt={2}>
          {trendingSongs
            .filter((_, index) => (isMobile ? index < 1 : isTablet ? index < 2 : isPC ? index < 3 : true))
            .map((song, index) => (
              <Box
                key={`trending-song-${index}`}
                ml={index > 0 ? 2 : 0}
                width={
                  isMobile
                    ? "100%"
                    : isTablet
                    ? "calc(50% - 8px)"
                    : isPC
                    ? "calc(33.33% - 10px)"
                    : "calc(25% - 12px)"
                }
              >
                <TrendingSongCard data={song} />
              </Box>
            ))}
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          mt={8}
          mb={4}
        >
          <Text size={FontSize.XXL} bold>
            Top artists
          </Text>
          <SecondaryButton
            className={commonClasses.showAll}
            size="medium"
            radius={29}
            onClick={() => history.push("/privi-music-dao/artists")}
          >
            Show All
            <Box position="absolute" flexDirection="row" top={0} right={0} pr={2}>
              <ArrowLeftIcon />
            </Box>
          </SecondaryButton>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box className={classes.carouselBox}>
            <Carousel
              slides={SampleArtistsData()}
              goToSlide={currentSlider}
              showNavigation={false}
              offsetRadius={3}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="center">
          <Box className={classes.arrowBox} mt={2}>
            <Box
              style={{ transform: "rotate(90deg)", cursor: "pointer" }}
              mr={2}
              onClick={() => setCurrentSlider(prev => prev - 1)}
            >
              <ChevronIconLeft />
            </Box>
            <Box
              style={{ transform: "rotate(-90deg)", cursor: "pointer" }}
              ml={2}
              onClick={() => setCurrentSlider(prev => prev + 1)}
            >
              <ChevronIconLeft />
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          mt={4}
        >
          <Text size={FontSize.XXL} bold>
            Trending pods
          </Text>
          <SecondaryButton
            className={commonClasses.showAll}
            size="medium"
            radius={29}
            onClick={() => history.push("/privi-music-dao/pods")}
          >
            Show All
            <Box position="absolute" flexDirection="row" top={0} right={0} pr={2}>
              <ArrowLeftIcon />
            </Box>
          </SecondaryButton>
        </Box>
        <Box className={classes.flexBox} mt={2}>
          {trendingSongs
            .filter((_, index) => (isMobile ? index < 1 : isTablet ? index < 2 : isPC ? index < 3 : true))
            .map((song, index) => (
              <Box
                key={`trending-pod-${index}`}
                ml={index > 0 ? 2 : 0}
                width={
                  isMobile
                    ? "100%"
                    : isTablet
                    ? "calc(50% - 8px)"
                    : isPC
                    ? "calc(33.33% - 10px)"
                    : "calc(25% - 12px)"
                }
              >
                <PodCard pod={{ ...song, Name: "My Awesome New Music Album" }} />
              </Box>
            ))}
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          mt={5}
          mb={5}
        >
          <Text size={FontSize.XXL} bold>
            Recent polls
          </Text>
          <SecondaryButton
            className={commonClasses.showAll}
            size="medium"
            radius={29}
            onClick={() => history.push("/privi-music-dao/governance/votes")}
          >
            Show All
            <Box position="absolute" flexDirection="row" top={0} right={0} pr={2}>
              <ArrowLeftIcon />
            </Box>
          </SecondaryButton>
        </Box>
        <Box className={classes.flexBox} mt={2} alignItems="stretch !important">
          {songs
            .filter((_, index) => (isMobile ? index < 1 : isTablet ? index < 2 : isPC ? index < 3 : true))
            .map((song, index) => (
              <Box
                key={`vote-card-${index}`}
                ml={index > 0 ? 2 : 0}
                width={
                  isMobile
                    ? "100%"
                    : isTablet
                    ? "calc(50% - 8px)"
                    : isPC
                    ? "calc(33.33% - 10px)"
                    : "calc(25% - 12px)"
                }
              >
                <VoteCard item={song} />
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
}
