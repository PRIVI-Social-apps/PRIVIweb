import React from "react";

import Rating from "@material-ui/lab/Rating";

import { ReactComponent as SubStratIcon } from "assets/icons/substrat_card.svg";
import { ReactComponent as StarIcon } from "assets/icons/star-regular.svg";
import { ReactComponent as StarSolidIcon } from "assets/icons/star-solid.svg";
import { ReactComponent as PriviIcon } from "assets/icons/privi_wallet_card.svg";
import { ReactComponent as GovernanceIcon } from "assets/icons/governance_card.svg";
import { ReactComponent as DefiIcon } from "assets/icons/defi_card.svg";
import { Avatar } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { trendingAppCardStyles } from "./index.styles";

const TrendingAppCard = ({ item }) => {
  const classes = trendingAppCardStyles();

  const getIcon = () => {
    if (item.type === "community") {
      return <SubStratIcon />;
    } else if (item.type === "wallet") {
      return <PriviIcon />;
    } else if (item.type === "governance") {
      return <GovernanceIcon />;
    }

    return <DefiIcon />;
  };

  const getBackground = () => {
    if (item.type === "community") {
      return "radial-gradient(131.72% 246.6% at 83.97% 6.8%, rgba(238, 238, 238, 0) 0%, rgba(255, 231, 144, 0.24) 25.93%, #FE7373 62.54%, rgba(88, 156, 195, 0.990456) 79.69%, rgba(4, 2, 7, 0.96) 100%)";
    } else if (item.type === "wallet") {
      return "linear-gradient(30.26deg, #FFFFFF 1.75%, rgba(255, 255, 255, 0) 43.13%), radial-gradient(110.1% 139.79% at 91.09% 47.07%, rgba(238, 238, 238, 0) 7.23%, #8C83DF 47.2%, rgba(0, 0, 255, 0.39) 56.64%, rgba(0, 0, 255, 0.4) 77.84%)";
    } else if (item.type === "governance") {
      return "linear-gradient(155.54deg, #FF00B8 12%, rgba(255, 255, 255, 0) 57.18%), radial-gradient(105.17% 140.02% at 87.21% 29.18%, rgba(238, 238, 238, 0) 0%, rgba(255, 231, 144, 0.096) 26.8%, rgba(254, 115, 115, 0.4) 73.32%, rgba(88, 156, 195, 0.396183) 79.69%, rgba(4, 2, 7, 0.384) 100%)";
    }

    return "linear-gradient(156.41deg, #8FFF00 11.7%, rgba(255, 255, 255, 0) 57.03%), radial-gradient(108.54% 138.74% at 86.8% 29.83%, rgba(238, 238, 238, 0) 0%, rgba(226, 255, 144, 0.096) 26.8%, rgba(228, 254, 115, 0.4) 73.32%, rgba(204, 255, 0, 0.384) 100%)";
  };

  return (
    <Box
      className={classes.container}
      style={{
        background: getBackground(),
      }}
    >
      {getIcon()}
      <Box className={classes.header1} mt={4}>
        {item.name}
      </Box>
      <Box className={classes.header2} mt={1}>
        {item.description}
      </Box>
      <Box className={`${classes.flexBox} ${classes.bottomBox}`} mt={2} pt={2}>
        <Box className={classes.flexBox}>
          <Avatar size="medium" url={require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")} alt="" />
          <Box className={classes.shadowBox} ml={-1}>
            {item.count}
          </Box>
        </Box>
        <Rating
          disabled={true}
          value={4}
          icon={<StarSolidIcon style={{ width: "12px", color: "black" }} />}
          emptyIcon={<StarIcon style={{ width: "12px" }} />}
        />
      </Box>
    </Box>
  );
};

export default TrendingAppCard;
