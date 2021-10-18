import React from "react";

import { titleStyles } from './index.styles';
import Box from 'shared/ui-kit/Box';


export type TitleProps = {
  title: string;
  handleHeightFixed?: () => void;
  heightFixed?: boolean;
};

export default function Title({ title, handleHeightFixed, heightFixed }: TitleProps) {
  const classes = titleStyles();

  return (
    <div className={classes.title}>
      <Box display="flex" alignItems="center">
        <img src={require("assets/icons3d/SuperToroid-Iridescent.png")} alt="" />
        <h4>{title}</h4>
      </Box>
      {heightFixed !== undefined && handleHeightFixed && (
        <span onClick={handleHeightFixed}>{heightFixed ? "VIEW ALL" : "HIDE"}</span>
      )}
    </div>
  );
}
