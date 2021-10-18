import React from 'react';

import Box from "shared/ui-kit/Box";

import adImage from "assets/backgrounds/digital.jpeg";
import { ReactComponent as ArrowRightIcon } from "assets/icons/arrow-right.svg";

import { AdvertiseCardStyles } from './index.styles';

export const AdvertiseCard = ({ handleClick }) => {
  const classes = AdvertiseCardStyles();

  return (
    <div className={classes.root} onClick={() => handleClick && handleClick()}>
      <div className={classes.title}>
        <span>My app promotion</span>
        <ArrowRightIcon />
      </div>
      <img src={adImage} className={classes.adImage} alt="" />
      <Box mt={1} display="flex" flexDirection="column">
        <div className={classes.cardInfo}>
          <div className="ad-title">
            Targeted
            <br />
            people
          </div>
          <div className="ad-value">214 255</div>
        </div>
        <div className={classes.cardInfo}>
          <div className="ad-title">
            Revenue
            <br />
            generated
          </div>
          <div className="ad-value">
            245.4422
            <span className="ad-unit">DATAp</span>
          </div>
        </div>
        <div className={classes.cardInfo}>
          <div className="ad-title">Ad viewers</div>
          <div>
            <div className="ad-value">500</div>
          </div>
        </div>
      </Box>
    </div>
  )
}
