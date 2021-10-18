import React, { useState } from "react";
import classnames from "classnames";

import Box from "shared/ui-kit/Box";
import ADContentGroup from "components/PriviData/components/ADContentGroup";

import imageDATApBig from "assets/priviDataImages/dataDATApBig.png";
import imageDATApSmall from "assets/priviDataImages/dataDATApSmall.png";
import imageCross from "assets/priviDataImages/dataCross.png";
import imageAppsBig from "assets/priviDataImages/dataAppsBig.png";
import imageUser from "assets/priviDataImages/dataUser.png";
import imageMegaphone from "assets/priviDataImages/dataMegaphone.png";

import { homePageStyles } from "./index.styles";
import PrintAdStatsChart from "components/PriviData/components/AdStatsChart";
import AdStatsChartConfig from "components/PriviData/components/AdStatsChart/configs/AdStatsConfig";

export default function HomePage() {
  const classes = homePageStyles();
  const [helpStep, setHelpStep] = useState(0);
  return (
    <div className={classes.root}>
      <div className={classes.mainContainer}>
        <div className={classes.header}>
          <div className={classes.headerTitle}>
            <span className="data-logo">Data</span>
            {` `}Dashboard
            <div className="gradient-effect">
              <div className={classes.gradientImage} />
            </div>
            <img src={imageDATApSmall} alt="" className="header-left-logo" />
            <img src={imageCross} alt="" className="header-right-logo" />
          </div>
          <div className={classes.headerDescription}>
            Spread the word about anything Privi
          </div>
        </div>
        <div className={classes.cardGroup}>
          <div className={classes.startCard}>
            <img src={imageDATApBig} alt="" className="card-logo" />
            <div>
              <div className={classes.cardTitle}>
                Promote Your Content
                <br />
                With Anyone
              </div>
              <div className={classes.cardDescription}>
                Use DATAp coins to share anything you want with the people you choose.
              </div>
            </div>
            <Box className={classes.cardButtons} display="flex" gridColumnGap={8} alignItems="center">
              <div className="button-start-data">Start Now</div>
              <div className="button-get-data">Get DATAp</div>
            </Box>
          </div>
          <div className={classes.stackCard}>
            <img src={imageAppsBig} alt="" className="card-logo" />
            <div>
              <div className={classes.cardTitle}>
                Stake DATAp,
                <br />
                earn rewards
              </div>
              <div className={classes.cardDescription}>
                Get rewards,for staking
                <br />
                DATAp coin on Privi.
              </div>
            </div>
            <Box className={classes.cardButtons} display="flex" gridColumnGap={8} alignItems="center">
              <div className="button-stack-data">Try now</div>
            </Box>
          </div>
          <div className={classes.finacingCard}>
            <div className="gradient-effect">
              <div className={classes.gradientImage} />
            </div>
            <div>
              <span className="card-logo">Financing options</span>
              <Box display="flex" alignItems="center" gridColumnGap={10}>
                <img src={imageUser} alt="" />
                <div className={classes.cardTitle}>
                  Self
                  <br />
                  <Box fontWeight={400}>Financed</Box>
                </div>
              </Box>
              <div className={classes.cardDescription}>
                Short desctiption of self financing Short desctiption of self financing Short desctiption of self financing
              </div>
            </div>
          </div>
          <div className={classes.helpCard}>
            <div className="gradient-effect">
              <div className={classnames(classes.gradientImage, "secondary")} />
            </div>
            <div>
              <span className="card-logo">How it works</span>
              <Box display="flex" alignItems="center" gridColumnGap={10}>
                <img src={imageMegaphone} width={65} height={65} alt="" />
                <div className={classes.cardTitle}>
                  Promote
                  <br />
                  <Box fontWeight={400}>anything</Box>
                </div>
              </Box>
              <div className={classes.cardDescription}>
                Really, it could be anything: music, videos, tokens, credit pools, communities... you name it.
              </div>
            </div>
            <div className={classes.helpStepGroup}>
              {[0,1,2,3].map(step => (
                <div
                  key={`help-step-${step}`}
                  className={classnames(classes.helpStep, step === helpStep && 'selected')}
                  onClick={() => setHelpStep(step)}
                />
              ))}
            </div>
          </div>
        </div>
        <Box mt={10}>
          <ADContentGroup />
        </Box>
        <Box mt={8}>
          <div className={classes.subTitle}>Ad Stats</div>
        </Box>
        <Box mb={8}>
          {PrintAdStatsChart(AdStatsChartConfig)}
        </Box>
      </div>
    </div>
  );
}
