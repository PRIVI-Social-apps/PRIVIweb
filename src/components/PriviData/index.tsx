import React from "react";

import Header from "shared/ui-kit/Header/Header";
import { priviDataStyles } from './index.styles';
import PriviDataRouter from './PriviDataRouter';



export default function PriviData() {
  const classes = priviDataStyles();

  return (
    <div className={classes.priviData}>
      <Header />
      <div className={classes.mainContainer}>
        <div className={classes.content}>
          <PriviDataRouter />
        </div>
      </div>
    </div>
  );
}
