import React, { useRef, useState } from "react";
import { default as ElasticCarousel } from "react-elastic-carousel";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Carousel from "react-spring-3d-carousel";

import { Grid, makeStyles } from "@material-ui/core";

import { priviZooPageStyles } from './index.styles';
import TrendingAppCard from "./components/TrendingAppCard";
import SuggestionCard from "./components/SuggestionCard";
import PriviCard from "./components/PriviCard";
import Header from "./components/Header";
import Bottom from "./components/Bottom";
import PriviPages from "./PriviPages";

import { ChevronIconLeft } from "shared/ui-kit/Icons/chevronIconDown";
import { useAuth } from "shared/contexts/AuthContext";
import { default as SignInHeader } from "shared/ui-kit/Header/Header";
import Box from 'shared/ui-kit/Box';

const SampleData = [
  {
    name: "Privi Social",
    type: "social",
    count: "1234",
    description: "Customize your public profile and engage with other users.",
    url: "social",
    photo: require('assets/zooImages/Social.png')
  },
  {
    name: "Privi DAO",
    type: "dao",
    count: "3654",
    description: "The heartbeat of the PRIVI network.",
    url: "dao",
    photo: require('assets/zooImages/Dao.png')
  },
  {
    name: "Privi Wallet",
    type: "wallet",
    count: "7865",
    description: "Manage your tokens and send transactions.",
    url: "wallet",
    photo: require('assets/zooImages/Wallet.png')
  },
  {
    name: "Governance",
    type: "governance",
    count: "4567",
    description: "Reach consensus through collective voting mechanisms.",
    url: "governance",
    photo: require('assets/zooImages/Governance.png')
  },
  {
    name: "Music Dao",
    type: "music-dao",
    count: "6531",
    description: "DAOs for Music ecosystem.",
    url: "music-dao",
    photo: require('assets/zooImages/Music-Dao.png')
  },
  {
    name: "Privi Art",
    type: "digital-art",
    count: "9875",
    description: "Create, share and purchase Digital Art.",
    url: "digital-art",
    photo: require('assets/zooImages/Digital-Art.png')
  },
  {
    name: "Privi Music",
    type: "music",
    count: "5644",
    description: "Create, share and purchase Music.",
    url: "music",
    photo: require('assets/zooImages/Music.png')
  },
  {
    name: "Privi Data",
    type: "data",
    count: "696",
    description: "Monetize your Data as a valuable asset.",
    url: "data",
    photo: require('assets/zooImages/Data.png')
  },
  {
    name: "Pods",
    type: "pods",
    count: "6877",
    description: "With Pods, any imaginable asset can be tokenized.",
    url: "pods",
    photo: require('assets/zooImages/Pods.png')
  },
  {
    name: "Collabs",
    type: "collabs",
    count: "7425",
    description: "Suggest Collaborations between famous artists and creators.",
    url: "collabs",
    photo: require('assets/zooImages/Collabs.png')
  },
];

const COLUMNS_COUNT_BREAK_POINTS = {
  375: 1,
  900: 3,
  1200: 4,
};

const GUTTER = "16px";

const SamplePriviData = () => {
  const priviData: any[] = [];
  SampleData.map(data => {
    priviData.push({
      key: `uuid_${data.name}`,
      content: <PriviCard item={data} customWidth="240px" />,
    });
  });
  SampleData.map(data => {
    priviData.push({
      key: `uuid_${data.name}_2`,
      content: <PriviCard item={data} customWidth="240px" />,
    });
  });

  return priviData;
};

const PriviZoo = () => {
  const classes = priviZooPageStyles();
  const carouselRef = useRef<any>();

  const { isSignedin } = useAuth();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentSlider, setCurrentSlider] = useState<number>(0);
  const carouselItems = [{
    title: 'Privi Music',
    description: 'All of your favorite music in one place. Decentralized and unique.',
    imageUrl: require('assets/backgrounds/music-box-front.png'),
  }, {
    title: 'Privi Pix',
    description: 'Create, share and purchase Digital Art.',
    imageUrl: require('assets/zooImages/Digital-Art.png'),
  }, {
    title: 'Privi Trax',
    description: 'DAOs for Music ecosystem.',
    imageUrl: require('assets/zooImages/Music-Dao.png'),
  }, {
    title: 'Privi DAO',
    description: 'The heartbeat of the PRIVI network.',
    imageUrl: require('assets/zooImages/Dao.png'),
  }];

  return (
    <Box className={classes.container}>
      <Box className={classes.subContainer}>
        <Box className={classes.navigationContainer}>
          {!isSignedin ? (
            <Header />
          ) : (
            <Box width={1}>
              <SignInHeader />
            </Box>
          )}
          {!isSignedin && (
            <Box width={1}>
              <Box className={classes.contentBox} zIndex={1}>
                <Box className={classes.title}>EXPLORE</Box>
                <Box className={classes.flexBox}>
                  <Box className={classes.priviTitle}>PRIVI </Box>
                  <Box className={classes.zooTitle} ml={1}>
                    ZOO
                  </Box>
                </Box>
                <Box>EVER EXPANDING APP COLLECTION</Box>
                <Grid container spacing={3}>
                  <Grid item md={9} sm={7} xs={12}>
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
                      {carouselItems.map((item, index) => (
                        <Box className={classes.musicBox} key={`${index}_elastic_item`}>
                          <Box className={classes.flexBox} justifyContent="space-between">
                            <Box className={classes.title2}>{item.title}</Box>
                            <img
                              src={require("assets/icons/arrow_white.png")}
                              alt="_white"
                              style={{ transform: "rotate(180deg)" }}
                            />
                          </Box>
                          <Box mb={3}>{item.description}</Box>
                          <img src={item.imageUrl} width="100%" />
                        </Box>
                      ))}
                    </ElasticCarousel>
                    <Box className={classes.flexBox} justifyContent="space-between">
                      <Box className={`${classes.navIconBox} ${classes.flexBox}`} mt={2}>
                        <Box
                          style={{ transform: "rotate(90deg)" }}
                          onClick={() => {
                            carouselRef.current.goTo(currentPage - 1);
                          }}
                        >
                          <ChevronIconLeft />
                        </Box>
                        <Box
                          style={{ transform: "rotate(-90deg)" }}
                          ml={3}
                          onClick={() => {
                            carouselRef.current.goTo(currentPage + 1);
                          }}
                        >
                          <ChevronIconLeft />
                        </Box>
                      </Box>
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
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={3} sm={5} xs={12}>
                    <Box className={classes.shadowBox}>
                      <Box mb={3} ml={3} mt={1}>
                        <Box>Top #10</Box>
                        <Box className={classes.cardTitle}>
                          New
                          <br />
                          Apps
                        </Box>
                      </Box>
                      <img src={require("assets/backgrounds/group.png")} />
                    </Box>
                    <Box className={classes.shadowBox} mt={3}>
                      <Box mb={3} ml={3} mt={1}>
                        <Box>Ultimate </Box>
                        <Box className={classes.cardTitle2}>
                          DeFi <br /> Bundle
                        </Box>
                      </Box>
                      <img src={require("assets/backgrounds/tools.png")} />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <img src={require("assets/backgrounds/3d-grid.png")} style={{ marginTop: "-150px" }} />
            </Box>
          )}
        </Box>
        {!isSignedin ? (
          <Box width={1} style={{ marginBottom: 50 }}>
            <Box className={classes.flexBox} width={1} justifyContent="center">
              <Box className={classes.priviBox} mt={2}>
                <Box className={classes.title2} width={1} textAlign="center">
                  <b>Explore Privi</b> <u>Bundle</u>
                </Box>
                <Box className={classes.flexBox}>
                  <Box
                    style={{ transform: "rotate(90deg)", cursor: "pointer" }}
                    mr={2}
                    onClick={() => setCurrentSlider(prev => prev - 1)}
                  >
                    <ChevronIconLeft />
                  </Box>
                  <Box className={classes.carouselBox}>
                    <Carousel
                      slides={SamplePriviData()}
                      goToSlide={currentSlider}
                      showNavigation={false}
                      offsetRadius={3}
                      animationConfig={{ tension: 170, friction: 26 }}
                    />
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
            </Box>
            <Box className={classes.contentBox}>
              <Box className={classes.flexBox}>
                <img src={require("assets/icons/trending_icon_2.png")} width="56px" />
                <Box className={classes.title2}>Trending apps</Box>
              </Box>
              <Box className={classes.flexBox} mt={2} ml={3}>
                <Grid className={classes.cardsGrid}>
                  <ResponsiveMasonry columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}>
                    <Masonry gutter={GUTTER}>
                      {SampleData.map(item => (
                        <Box key={item.name} mr={2}>
                          {/* <TrendingAppCard item={item} /> */}
                          <PriviCard item={item} />
                        </Box>
                      ))}
                    </Masonry>
                  </ResponsiveMasonry>
                </Grid>
              </Box>
            </Box>
            {/* <Box className={classes.contentBox}>
              <Box className={classes.flexBox}>
                <img src={require("assets/icons/privi-suggestions.png")} width="56px" />
                <Box className={classes.title2}>Privi suggestions</Box>
              </Box>
              <Box className={classes.flexBox} mt={2} ml={3} style={{ display: "flex-grid" }}>
                <Grid className={classes.cardsGrid}>
                  <ResponsiveMasonry columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}>
                    <Masonry gutter={GUTTER}>
                      {SampleData.map(item => (
                        <Box key={item.name} mr={2}>
                          <SuggestionCard item={item} />
                        </Box>
                      ))}
                      {SampleData.map(item => (
                        <Box key={item.name} mr={2}>
                          <SuggestionCard item={item} />
                        </Box>
                      ))}
                    </Masonry>
                  </ResponsiveMasonry>
                </Grid>
              </Box>
            </Box> */}
            {/* <Box className={classes.contentBox}>
              <Box className={classes.flexBox}>
                <img src={require("assets/icons/new_release_app.png")} width="56px" />
                <Box className={classes.title2}>New releases</Box>
              </Box>
              <Box className={classes.flexBox} mt={2} ml={3}>
                <Grid className={classes.cardsGrid}>
                  <ResponsiveMasonry columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}>
                    <Masonry gutter={GUTTER}>
                      {SampleData.map(item => (
                        <Box key={item.name}>
                          <SuggestionCard item={item} />
                        </Box>
                      ))}
                    </Masonry>
                  </ResponsiveMasonry>
                </Grid>
              </Box>
            </Box> */}
          </Box>
        ) : (
          <PriviPages />
        )}
        <Box>
          <Bottom />
        </Box>
      </Box>
    </Box>
  );
};

export default PriviZoo;
