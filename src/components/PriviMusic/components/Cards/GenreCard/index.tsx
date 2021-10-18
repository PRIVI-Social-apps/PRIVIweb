import React from "react";

import { genreCardStyles } from "./index.styles";
import { genresMock } from "../../../mockData";
import URL from "shared/functions/getURL";

export default function GenreCard({ item, size }) {
  const classes = genreCardStyles();

  let imageUrl = encodeURI(`${URL()}/genres/${item.genres.replace("/", " ")}.jpeg`);

  return (
    <div
      className={classes.card}
      onClick={() => {}}
      style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
    >
      {size === "large" ? (
        <div className={classes.filter}>
          <div className={classes.name}>{item.genres}</div>
        </div>
      ) : (
        <div className={classes.smallfilter}>
          <div className={classes.smallname}>{item.genres}</div>
        </div>
      )}
    </div>
  );
}
