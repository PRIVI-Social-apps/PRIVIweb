import { makeStyles } from "@material-ui/core";
import React from "react";

import Header from "shared/ui-kit/Header/Header";

import { priviMusicDaoPageStyles } from "./index.styles";
import PriviMusicDaoRouter from "./PriviMusicDaoRouter";

const useStyles = makeStyles(theme => ({
  container: {
    [theme.breakpoints.down('xs')]: {
      height: "calc(100% - 54px)"
    },
  }
}));

export default function PriviMusicDao() {
  const privateClasses = useStyles();
  const classes = priviMusicDaoPageStyles();

  return (
    <div className={classes.priviMusicDao}>
      <Header />
      <div className={`${classes.mainContainer} ${privateClasses.container}`}>
        <div className={classes.content}>
          <PriviMusicDaoRouter />
        </div>
      </div>
    </div>
  );
}
