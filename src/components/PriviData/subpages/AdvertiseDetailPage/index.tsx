import React from "react";
import { useHistory } from 'react-router';
import classnames from "classnames";

import Box from "shared/ui-kit/Box";
import { ReactComponent as BackIcon } from "assets/icons/longBackArrow.svg";
import imageCollab from "assets/priviDataImages/dataCollab.png"
import testAdImage from "assets/backgrounds/digital.jpeg";

import { advertiseDetailPageStyles } from "./index.styles";

export default function AdvertiseDetailPage() {
  const classes = advertiseDetailPageStyles();
  const history = useHistory();

  const handleBackLink = () => {
    history.push('/privi-data-new/advertise/');
  }

  return (
    <div className={classes.root}>
      <div className={classes.mainContainer}>
        <div className={classes.header}>
          <div className={classes.backLink} onClick={handleBackLink}>
            <BackIcon />
            <span>Back</span>
          </div>
          <div className={classes.audianceButton}>
            Target New Audience
          </div>
          <div className="gradient-effect">
            <div className={classnames(classes.gradientImage, "secondary")} />
          </div>
        </div>
        <div className={classes.adContent}>
          <div className={classes.adContentHeader}>
            <span>My app promotion</span>
            <Box display="flex" gridColumnGap={5} alignItems="center">
              <img width="38" height="38" src={imageCollab} alt="" />
              <span className="collabs">Collabs</span>
            </Box>
          </div>
          <Box mt={4} display="flex" gridColumnGap={20}>
            <Box display="flex" flexDirection="column" gridRowGap={25} flex={4}>
              <span className="ad-title">Ad Image</span>
              <img className={classes.adImage} src={testAdImage} alt="ad-image" />
            </Box>
            <Box display="flex" flexDirection="column" gridRowGap={25} flex={3}>
              <span className="ad-title">Ad message</span>
              <div className="ad-image">
                Hey guys check this awesome community I’m part of.
              </div>
            </Box>
          </Box>
          <Box
            mt={10}
            display="flex"
            flexWrap="wrap"
            gridRowGap={30}
            className={classes.adInfoGroup}
          >
            <Box display="flex" flexDirection="column" gridRowGap={5}>
              <span className="ad-value">214 255</span>
              <span className="ad-field">Targeted people</span>
            </Box>
            <Box display="flex" flexDirection="column" gridRowGap={5}>
              <div>
                <span className="ad-value">42.4213</span>
                <span className="ad-unit">DATAp</span>
              </div>
              <span className="ad-field">Revenue generated</span>
            </Box>
            <Box display="flex" flexDirection="column" gridRowGap={5}>
              <div>
                <span className="ad-value">500</span>
              </div>
              <span className="ad-field"> Ad viewers</span>
            </Box>
            <Box display="flex" flexDirection="column" gridRowGap={5}>
              <span className="ad-value">24,52%</span>
              <span className="ad-field">Accepted</span>
            </Box>
            <Box display="flex" flexDirection="column" gridRowGap={5}>
              <span className="ad-value">76,48%</span>
              <span className="ad-field">Rejected</span>
            </Box>
          </Box>
        </div>
        <div className={classes.viewerListContainer}>
          <Box display="flex" justifyContent="space-between">
            <span className={classes.viewerListTitle}>Ad Viewers</span>
            <Box display="flex" alignItems="center" gridColumnGap={10}>
              <div className={classnames(classes.viewButton, "selected")}>All</div>
              <div className={classes.viewButton}>Accepted</div>
              <div className={classes.viewButton}>Rejected</div>
            </Box>
          </Box>
          <Box mt={3} display="flex" flexDirection="column">
            {Array(10).fill(0).map((item, index) => (
              <Box
                key={`view-${index}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                className={classes.viewerItem}
              >
                <Box display="flex" alignItems="center">
                  <img src={testAdImage} className="viwer-image" alt="viewer-img" />
                  <span className="viewer-name">Sabrina Spellman</span>
                  <span className="viewer-user-id">@Us3rNxtb00t</span>
                </Box>
                <span className="viewer-status">Accepted</span>
              </Box>
            ))}
          </Box>
        </div>
      </div>
    </div>
  );
}
