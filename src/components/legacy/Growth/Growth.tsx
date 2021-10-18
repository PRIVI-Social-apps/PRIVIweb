import "./Growth.css";
import React, { useState } from "react";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import Buttons from "shared/ui-kit/Buttons/Buttons";
import SearchButton from "shared/ui-kit/Buttons/SearchButton";
import SettingsButton from "shared/ui-kit/Buttons/SettingsButton";
import Sidebar from "./Sidebar/Sidebar";
import NewsTutorials from "./components/News/NewsTutorials";
import Vote from "./components/Vote/Vote";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import ExchangeLend from "./components/ExchangeLend/ExchangeLend";
import MyActivity from "./components/MyActivity/MyActivity";
import ComingSoonModal from "shared/ui-kit/Modal/Modals/ComingSoonModal";

const growthMenuOptions = [
  "News and Tutorials",
  "Leaderboard",
  "Exchange/Lend",
  "Predict",
  "My Activity",
];

const Growth = () => {
  // HOOKS
  const [growthMenuSelection, setGrowthMenuSelection] = useState<number>(0);
  const [exchangeOption, setExchangeOption] = useState<string>("Exchange");

  const handleChangeTabs = (value) => {
    setGrowthMenuSelection(value);

    if ((value = 0)) {
      setOpenModalComingSoon(false);
    } else {
      setOpenModalComingSoon(true);
    }
  };

  const [openModalComingSoon, setOpenModalComingSoon] = useState<boolean>(
    false
  );

  const handleCloseModalComingSoon = () => {
    //setOpenModalComingSoon(false);
  };

  return (
    <div className="growth-page">
      <div
        className={
          growthMenuSelection === 0
            ? "content-wrapper content-wrapper-sidebar"
            : "content-wrapper"
        }
      >
        <div className="header-wrapper">
        </div>
        <div className="appbar-container">
          <AppBar position="static" className="appBarTabsToken">
            <Tabs
              TabIndicatorProps={{
                style: { background: "#64c89e", height: "3px" },
              }}
              value={growthMenuSelection}
              className="tabsToken"
              onChange={(e, value) => handleChangeTabs(value)}
            >
              {growthMenuOptions.map((name) => {
                return <Tab label={name} key={name} />;
              })}
            </Tabs>
          </AppBar>
        </div>
        <div className="content">
          {growthMenuSelection === 0 ? (
            <NewsTutorials />
          ) : growthMenuSelection === 1 ? (
            <>
              <Leaderboard />
              <ComingSoonModal
                height={"83%"}
                marginTop={160}
                open={openModalComingSoon}
                handleClose={handleCloseModalComingSoon}
              />
            </>
          ) : growthMenuSelection === 2 ? (
            <>
              <ExchangeLend
                exchangeOption={exchangeOption}
                setExchangeOption={setExchangeOption}
              />
              <ComingSoonModal
                height={"83%"}
                marginTop={160}
                open={openModalComingSoon}
                handleClose={handleCloseModalComingSoon}
              />
            </>
          ) : growthMenuSelection === 3 ? (
            <>
              <Vote />
              {/* <ComingSoonModal
                height={"83%"}
                marginTop={160}
                open={openModalComingSoon}
                handleClose={handleCloseModalComingSoon}
              /> */}
            </>
          ) : (
            <>
              <MyActivity />
              <ComingSoonModal
                height={"83%"}
                marginTop={160}
                open={openModalComingSoon}
                handleClose={handleCloseModalComingSoon}
              />
            </>
          )}
        </div>
      </div>
      {growthMenuSelection === 0 ? (
        <div className="sidebar">
          <div className="header">
            <h4>Overall stats</h4>
            <div className="buttons">
              <SearchButton />
              <SettingsButton />
            </div>
          </div>
          <Sidebar />
        </div>
      ) : null}
    </div>
  );
};

export default Growth;
