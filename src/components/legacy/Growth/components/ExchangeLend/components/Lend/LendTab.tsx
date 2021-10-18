import React, { useEffect, useState } from "react";
import "./LendTab.css";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import { sampleLendings } from "../../../../sampleData.js";
import LendingsList from "./components/LendingsList";
import LendingCard from "./components/LendingCard";
import { useTypedSelector } from "store/reducers/Reducer";

export default function LendTab() {
  const user = useTypedSelector((state) => state.user);

  const [userLendings, setUserLendings] = useState<any[]>([]);
  const [lendings, setLendings] = useState<any[]>([]);
  const [filteredLendings, setFilteredLendings] = useState<any[]>([]);

  const [tabValue, setTabValue] = useState<number>(0);
  const tabOptions = ["All", "FT", "NFT PHYSICAL", "NFT DIGITAL", "CRYPTO"];

  useEffect(() => {
    //TODO: get real lendings
    const fromUser = [] as any[];
    const rest = [] as any[];

    sampleLendings.forEach((lending) => {
      lending.Offers.forEach((offer) => {
        if (offer.User === user.id) {
          fromUser.push(lending);
        } else {
          rest.push(lending);
        }
        return;
      });
    });

    setUserLendings(fromUser);
    setLendings(rest);
    setFilteredLendings(rest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //sort lendings
    let filtered = [] as any[];

    lendings.forEach((lending) => {
      if (lending.TokenType.toUpperCase() === tabOptions[tabValue]) {
        filtered.push(lending);
      }
    });

    setFilteredLendings(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  return (
    <div className="lend-tab">
      <div className="cards">
        {userLendings.map((lending, index) => {
          return (
            <LendingCard lending={lending} key={index + "-lending-card"} />
          );
        })}
      </div>
      <AppBar position="static" className="appBarTabsToken">
        <Tabs
          TabIndicatorProps={{
            style: { background: "#64c89e", height: "3px" },
          }}
          value={tabValue}
          className="tabsToken"
          onChange={(event, newValue) => {
            setTabValue(newValue);
          }}
        >
          {tabOptions.map((name) => {
            return <Tab label={name} key={name} />;
          })}
        </Tabs>
      </AppBar>
      {tabValue === 0 ? (
        <LendingsList lendings={lendings} />
      ) : filteredLendings.length > 0 ? (
        <LendingsList lendings={filteredLendings} />
      ) : null}
    </div>
  );
}
