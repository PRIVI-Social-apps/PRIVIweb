import React from "react";

import { freeZoneIndicatorStyles } from './index.styles';

export default function FreeZoneIndicator({ time }) {
  const classes = freeZoneIndicatorStyles();

  return (
    <div className={classes.freeZone}>
      {time} <img src={require("assets/icons/flash.png")} alt="flash" />
    </div>
  );
}
