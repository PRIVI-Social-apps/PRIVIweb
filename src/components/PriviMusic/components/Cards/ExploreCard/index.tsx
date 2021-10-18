import React from "react";

import { exploreCardStyles } from './index.styles';
import { exploreMock } from "../../../mockData";

export default function ExploreCard({ item }) {
  const classes = exploreCardStyles();

  let imageUrl;
  if (item.ImageUrl) {
    imageUrl = item.ImageUrl;
  } else {
    const len = exploreMock.length;
    const index = Math.floor(Math.random() * len);
    imageUrl = exploreMock[index].ImageUrl;
  }
  return (
    <div
      className={classes.card}
      onClick={() => {}}
      style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
    >
      <div className={classes.filter}>
        <div className={classes.name}>{item.Name}</div>
      </div>
    </div>
  );
}
