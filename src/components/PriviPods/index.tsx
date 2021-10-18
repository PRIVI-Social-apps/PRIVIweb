import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { Hidden } from '@material-ui/core';

import Header from "shared/ui-kit/Header/Header";

import Sidebar from "./components/Sidebar";
import { priviPodsPageStyles } from './index.styles';
import PriviPodRouter from "./PriviPodRouter";

export default function PriviPods() {
  const classes = priviPodsPageStyles();
  const history = useHistory();

  return (
    <div className={classes.priviPods}>
      <Header />
      <div className={classes.contentContainer}>
        <Sidebar />
        <div className={classes.mainContainer}>
          {/* <Hidden mdDown>
            <div className={classes.arrows}>
              <button
                onClick={() => {
                  history.goBack();
                }}
                disabled={history.length === 0}
              >
                <img src={require(`assets/icons/${"arrow"}.png`)} />
              </button>

              <button
                onClick={() => {
                  history.goForward();
                }}
                disabled={history.length === 0}
              >
                <img src={require(`assets/icons/${"arrow"}.png`)} />
              </button>
            </div>
          </Hidden> */}
          <PriviPodRouter />
        </div>
      </div>
    </div>
  );
}
