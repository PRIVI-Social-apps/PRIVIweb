import React from "react";

import { ReactComponent as FaceBookIcon } from "assets/snsIcons/facebook.svg";
import { ReactComponent as TwitterIcon } from "assets/snsIcons/twitter.svg";
import { ReactComponent as InstagramIcon } from "assets/snsIcons/instagram.svg";
import { ReactComponent as LinkedInIcon } from "assets/snsIcons/linkedin.svg";
import { ReactComponent as TiktokIcon } from "assets/snsIcons/tiktok.svg";
import { ReactComponent as MediaIcon } from "assets/snsIcons/media.svg";
import Box from 'shared/ui-kit/Box';
import { bottomStyles } from './index.styles';

const Bottom = () => {
  const classes = bottomStyles();

  const handleFacebookLink = () => {
    window.location.href = 'https://www.facebook.com/PRIVI-Protocol-104693631453856';
  };

  const handleTwitterLink = () => {
    window.location.href = 'http://www.twitter.com/priviprotocol';
  };

  const handleLinkedinLink = () => {
    window.location.href = 'https://www.linkedin.com/company/privi-protocol/';
  };

  const handleInstagramLink = () => {
    window.location.href = 'https://instagram.com/priviprotocol';
  };

  const handleTiktokLink = () => {
    window.location.href = 'https://vm.tiktok.com/ZMechVPv8/';
  };

  const handleMediumLink = () => {
    window.location.href = 'https://privi.medium.com/';
  };

  return (
    <Box width={1}>
      <Box className={`${classes.bottomBox} ${classes.contentBox}`}>
        <Box ml={2}>
          <Box className={classes.title2}>PRIVI</Box>
          <Box className={classes.title2} mt={3} mb={1}>
            Find us on
          </Box>
          <Box className={classes.flexBox}>
            <Box className={classes.snsBox} onClick={handleFacebookLink}>
              <FaceBookIcon />
            </Box>
            <Box className={classes.snsBox} onClick={handleTwitterLink}>
              <TwitterIcon />
            </Box>
            <Box className={classes.snsBox} onClick={handleInstagramLink}>
              <InstagramIcon />
            </Box>
          </Box>
          <Box className={classes.flexBox} mt={1}>
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
        <Box>
          <Box className={classes.title2}>Explore</Box>
          <Box className={classes.header1} mt={2}>
            Home
          </Box>
          <Box className={classes.header1} mt={1}>
            Team
          </Box>
          <Box className={classes.header1} mt={1}>
            Creators
          </Box>
          <Box className={classes.header1} mt={1}>
            Communities
          </Box>
          <Box className={classes.header1} mt={1}>
            Media
          </Box>
        </Box>
        <Box>
          <Box className={classes.title2}>Learn</Box>
          <Box className={classes.header1} mt={2}>
            Lightpaper
          </Box>
          <Box className={classes.header1} mt={1}>
            Token
          </Box>
          <Box className={classes.header1} mt={1}>
            Knowledge Hub
          </Box>
          <Box className={classes.header1} mt={1}>
            Terms & Conditions
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Bottom;
