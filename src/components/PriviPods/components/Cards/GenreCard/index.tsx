import React from "react";

import { genreCardStyles } from './index.styles';
import { genresMock } from "../../../mockData";

export default function GenreCard({ item }) {
  const classes = genreCardStyles();

  let imageUrl;
  if (item.ImageUrl) {
    imageUrl = item.ImageUrl;
  } else {
    const len = genresMock.length;
    const index = Math.floor(Math.random() * len);
    imageUrl = genresMock[index].ImageUrl;
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
