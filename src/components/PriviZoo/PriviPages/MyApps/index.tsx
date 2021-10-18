import React from "react";
import { useHistory } from "react-router-dom";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { Grid } from "@material-ui/core";

import { myAppsPageStyles } from './index.styles';
import { SecondaryButton } from "shared/ui-kit";
import PriviCard from "components/PriviZoo/components/PriviCard";
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

const MyApps = () => {
  const classes = myAppsPageStyles();
  const history = useHistory();

  return (
    <Box className={classes.contentBox}>
      <Box className={classes.flexBox} justifyContent="space-between">
        <Box className={classes.title2}>My apps</Box>
        <SecondaryButton size="small" onClick={() => { }}>
          Edit
        </SecondaryButton>
      </Box>
      <Box className={classes.flexBox} mt={2} ml={3} mb={4}>
        <Grid className={classes.cardsGrid}>
          <ResponsiveMasonry columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}>
            <Masonry gutter={GUTTER}>
              {SampleData.map(item => (
                <Box
                  key={item.name}
                  mr={2}
                  onClick={() => {
                    history.push(`/privi-zoo/${item.url}`);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <PriviCard item={item} hideAvatar showMark />
                </Box>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </Grid>
      </Box>
    </Box>
  );
};

export default MyApps;
