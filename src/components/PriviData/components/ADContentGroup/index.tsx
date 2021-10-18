import React from "react";
import classnames from "classnames";

import Box from "shared/ui-kit/Box";

import { ReactComponent as MegaPhoneIcon } from "assets/icons/megaphone.svg";
import { ReactComponent as ArrowRightIcon } from "assets/icons/arrow-right.svg";

import { ADContentGroupStyles } from "./index.styles";

const AD_CATEGORIES = [
  {
    image: "dataDao.png",
    title: 'DAO'
  },
  {
    image: "dataMusic.png",
    title: 'Music'
  },
  {
    image: "dataVideo.png",
    title: 'Video'
  },
  {
    image: "dataVideo.png",
    title: 'Artwork'
  },
  {
    image: "dataVideo.png",
    title: 'Blogs'
  },
  {
    image: "dataDATApSmall.png",
    title: 'Pods'
  },
  {
    image: "dataAppsSmall.png",
    title: 'Apps'
  },
  {
    image: "dataCollab.png",
    title: 'Collabs'
  },
  {
    image: "dataVideo.png",
    title: 'NFT'
  },
  {
    image: "dataVideo.png",
    title: 'Community'
  },
]

export default function ADContentGroup(props) {
  const classes = ADContentGroupStyles();
  return (
    <div className={classnames(classes.root, props.className)}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <div className={classes.title}>Advertise your content</div>
        <div className={classes.otherContent}>
          <span>Advertise Other Content</span>
          <MegaPhoneIcon />
        </div>
      </Box>
      <Box
        mt={5}
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        gridColumnGap={20}
        gridRowGap={20}
      >
        {AD_CATEGORIES.map((item, index) => (
          <div key={`ad-${index}`} className={classes.ADContent}>
            <div className="ad-logo">
              <img src={require(`assets/priviDataImages/${item.image}`)} alt="" />
            </div>
            <div className="ad-category-title">{item.title}</div>
            <div className={classes.ADButton}>
              <span>{item.title}</span>
              <ArrowRightIcon className="ad-button-arrow"/>
            </div>
          </div>
        ))}
      </Box>
    </div>
  );
}
