import React from "react";
import clsx from "clsx";
import { useLocation } from "react-router-dom";

import { useTheme } from "@material-ui/core/styles";

import { priviZooSubPageStyles } from './index.styles';
import LeftMenuSidebar from "../components/LeftMenuSidebar";
import HomeRouter from "./HomeRouter";
import { ReactComponent as StarIcon } from "assets/icons/star-solid.svg";
import { ReactComponent as DiscoverIcon } from "assets/icons/discover.svg";
import { ReactComponent as FinaceIcon } from "assets/icons/finances.svg";
import { ReactComponent as SocialIcon } from "assets/icons/cmmunity.svg";
import { ReactComponent as InvestIcon } from "assets/icons/investment.svg";
import { ReactComponent as ProductIcon } from "assets/icons/productivity.svg";
import { ReactComponent as CategoryIcon } from "assets/icons/categories.svg";
import { ReactComponent as MediaIcon } from "assets/icons/media.svg";
import Box from 'shared/ui-kit/Box';

const LeftSideArray = [
  {
    name: "My Apps",
    icon: StarIcon,
    url: "privi-zoo/myapps/",
  },
  {
    name: "Discover",
    icon: DiscoverIcon,
    url: "privi-zoo/myapps/",
  },
  {
    name: "Media",
    icon: MediaIcon,
    url: "privi-zoo/myapps/",
  },
  {
    name: "DeFi",
    icon: FinaceIcon,
    url: "privi-zoo/myapps/",
  },
  {
    name: "Social",
    icon: SocialIcon,
    url: "privi-zoo/myapps/",
  },
  {
    name: "Investment",
    icon: InvestIcon,
    url: "privi-zoo/myapps/",
  },
  {
    name: "Productivity",
    icon: ProductIcon,
    url: "privi-zoo/myapps/",
  },
  {
    name: "All Categories",
    icon: CategoryIcon,
    url: "privi-zoo/myapps/",
  },
];

const PriviPages = () => {
  const classes = priviZooSubPageStyles();
  const [expanded, setExpanded] = React.useState(false);

  const onToggle = () => {
    setExpanded(isExpanded => !isExpanded);
  };

  return (
    <Box className={classes.root}>
      <Box
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: expanded,
          [classes.drawerClose]: !expanded,
        })}
      >
        <LeftMenuSidebar accordions={LeftSideArray} onToggle={onToggle} expanded={expanded} />
      </Box>
      <Box
        className={clsx({
          [classes.contentContainerShift]: expanded,
          [classes.contentContainer]: !expanded,
        })}
      >
        <Box
          id="homeContainer"
          className={clsx({
            [classes.homeContainerShift]: expanded,
            [classes.homeContainer]: !expanded,
          })}
        >
          <HomeRouter />
        </Box>
      </Box>
    </Box>
  );
};

export default PriviPages;
