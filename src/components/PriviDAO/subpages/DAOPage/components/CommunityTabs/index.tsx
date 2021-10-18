import React from "react";
import cls from "classnames";

import { communityTabsStyles } from './index.styles';

const CommunityTabs = () => {
  const classes = communityTabsStyles();

  return (
    <div className={classes.tabs}>
      <div className={cls(classes.tab, classes.active)}>General</div>
      <div className={classes.tab}>Discussion</div>
      <div className={classes.tab}>Dashboard</div>
      <div className={classes.tab}>Payments</div>
      <div className={classes.tab}>Projects</div>
      <div className={classes.tab}>Treasury</div>
      <div className={classes.tab}>Members</div>
      <div className={classes.tab}>Jarr</div>
      <div className={classes.tab}>Vesting and Taxation</div>
    </div>
  );
};

export default CommunityTabs;
