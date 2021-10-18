import React, { useState } from "react";
import Header from "shared/ui-kit/Header/Header";
import { priviDAOStyles } from './index.styles';
import HomePage from "./subpages/HomePage";
import SearchPage from "./subpages/SearchPage";

export default function PriviDAO() {
  const classes = priviDAOStyles();
  const [openSearcher, setOpenSearcher] = useState<boolean>(false);

  return (
    <div className={classes.priviDAO}>
      <Header
        openTab={openSearcher}
        handleOpenSearcher={() => {
          setOpenSearcher(true);
        }}
      />
      <div className={classes.mainContainer}>
        <div className={classes.content}>
          {!openSearcher ? (
            <HomePage />
          ) : (
            <SearchPage
              handleCloseSearcher={() => {
                setOpenSearcher(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
