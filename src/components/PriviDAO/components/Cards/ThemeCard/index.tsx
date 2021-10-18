import React from "react";
import styles from "./index.module.css";
import { themeCardStyles } from './index.styles';

export default function ThemeCard({ theme }) {
  const classes = themeCardStyles();

  return (
    <div className={classes.card}>
      <div
        className="image"
        style={{
          backgroundImage: theme.Url && theme.Url !== "" ? `url(${theme.Url})` : "none",
        }}
      />
      <h5>{theme.Name}</h5>
    </div>
  );
}
