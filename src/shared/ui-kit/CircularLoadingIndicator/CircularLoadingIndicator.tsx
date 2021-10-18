import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";
import { Color } from "../../constants/const";

export const CircularLoadingIndicator = ({ theme }: { theme?: "dark" | "light" | "green" }) => (
  <CircularProgress
    style={{
      color: theme && theme === "dark" ? "#7EDA5E" : theme && theme === "green" ? "#B1FF00" : Color.Mint,
    }}
  />
);
