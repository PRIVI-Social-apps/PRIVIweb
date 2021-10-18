import React, { useEffect, useState } from "react";
import "./AuctionTab.css";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import { sampleAuctions } from "../../../../sampleData.js";
import AuctionsList from "./components/AuctionsList";
import { useTypedSelector } from "store/reducers/Reducer";
import AuctionCard from "./components/AuctionCard";

export default function AuctionTab() {
  const user = useTypedSelector((state) => state.user);

  const [auctions, setAuctions] = useState<any[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<any[]>([]);
  const [biddedAuctions, setBiddedAuctions] = useState<any[]>([]);

  const [tabValue, setTabValue] = useState<number>(0);
  const tabOptions = ["All", "FT", "NFT PHYSICAL", "NFT DIGITAL", "CRYPTO"];

  useEffect(() => {
    //TODO: get real auctions
    const bidded = [] as any[];
    const rest = [] as any[];

    sampleAuctions.forEach((auction) => {
      auction.Bids.forEach((bid) => {
        if (bid.User === user.id) {
          bidded.push(auction);
        } else {
          rest.push(auction);
        }
        return;
      });
    });

    setBiddedAuctions(bidded);
    setAuctions(rest);
    setFilteredAuctions(rest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //sort auctions
    let filtered = [] as any[];

    auctions.forEach((auction) => {
      if (auction.TokenType.toUpperCase() === tabOptions[tabValue]) {
        filtered.push(auction);
      }
    });

    setFilteredAuctions(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  return (
    <div className="auction-tab">
      <div className="cards">
        {biddedAuctions.map((auction, index) => {
          return (
            <AuctionCard auction={auction} key={index + "-acution-card"} />
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
        <AuctionsList auctions={auctions} />
      ) : filteredAuctions.length > 0 ? (
        <AuctionsList auctions={filteredAuctions} />
      ) : null}
    </div>
  );
}
