import React from "react";
import classnames from "classnames";

import Box from "shared/ui-kit/Box";
import ADContentGroup from "components/PriviData/components/ADContentGroup";
import MyAdvertisements from "./components/MyAdvertisements";

import { advertisePageStyles } from "./index.styles";

export default function AdvertisePage() {
  const classes = advertisePageStyles();

  return (
    <div className={classes.root}>
      <div className={classes.mainContainer}>
        <div className={classes.header}>
          <div className={classes.headerTitle}>
            <span className="data-logo">Advertise</span>
            {` `}on Privi
            <div className="gradient-effect">
              <div className={classes.gradientImage} />
            </div>
          </div>
          <div className={classes.headerDescription}>
            Spread the word about anything Privi
          </div>
        </div>
        <div className={classes.finacingSection}>
          <div className="gradient-effect">
            <div className={classnames(classes.gradientImage, "secondary")} />
          </div>
          <div className="ad-title">
            Financing options
          </div>
          <div className={classes.finacingContent}>
            <Box display="flex" flexDirection="column" gridRowGap={5}>
              <div className="ad-value">
                255.0401
                <span className="ad-unit">DATAp</span>
              </div>
              <span className="ad-title" style={{color: '#69AEFF'}}>Balance</span>
            </Box>
            <Box display="flex" flexDirection="column" gridRowGap={5}>
              <span className="ad-value">4</span>
              <span className="ad-title" style={{color: '#69FFE4'}}> Ads Created</span>
            </Box>
            <Box display="flex" flexDirection="column" gridRowGap={5}>
              <div className="ad-value">
                42.4213
                <span className="ad-unit">DATAp</span>
              </div>
              <span className="ad-title" style={{color: '#8774FE'}}>Revenue generated</span>
            </Box>
          </div>
        </div>
        <Box mt={10}>
          <MyAdvertisements />
        </Box>
        <Box mt={10}>
          <ADContentGroup />
        </Box>
      </div>
    </div>
  );
}
