import React, { useEffect, useState } from "react";
import Axios from "axios";

import { Grid, Slider, withStyles } from "@material-ui/core";
import { Gradient } from "shared/ui-kit";
import { useSocialTokenStyles } from "../../index";
import PerkCard from "./PerkCard";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";

const fakePerks = [
  {
    Title: "Have an Online Dinner With Me and My Band",
    Description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin quam molestie, sodales lacus quis, pulvinar felis. Morbi bibendum molestie neque, in ornare dolor mollis aliquam. Maecenas volutpat rhoncus quam non commodo. In elementum mauris at lorem laoreet cursus. ",
    Reward: { id: "2002byAnneMarie", tag: "privi" },
    RewardDescription:
      "I also have an amazing suprise for the first 5 people who redeem this. Yep, it a Lollapalooza ticket for you to enjoy :)",
    ImageURL: "https://source.unsplash.com/random/1",
    Cost: 990,
    NumShares: 1904,
    Redeems: [{ Amount: 120 }, { Amount: 15 }],
    EndDate: 1621613591841,
    Trending: true,
  },
  {
    Title: "Have an Online Dinner With Me and My Band",
    Description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin quam molestie, sodales lacus quis, pulvinar felis. Morbi bibendum molestie neque, in ornare dolor mollis aliquam. Maecenas volutpat rhoncus quam non commodo. In elementum mauris at lorem laoreet cursus. ",
    Reward: { id: "2002byAnneMarie", tag: "privi" },
    RewardDescription:
      "I also have an amazing suprise for the first 5 people who redeem this. Yep, it a Lollapalooza ticket for you to enjoy :)",
    ImageURL: "https://source.unsplash.com/random/2",
    Cost: 9910,
    NumShares: 19124,
    Redeems: [{ Amount: 120 }, { Amount: 15 }],
    EndDate: 1621627591841,
  },
  {
    Title: "Have an Online Dinner With Me and My Band",
    Description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin quam molestie, sodales lacus quis, pulvinar felis. Morbi bibendum molestie neque, in ornare dolor mollis aliquam. Maecenas volutpat rhoncus quam non commodo. In elementum mauris at lorem laoreet cursus. ",
    Reward: { id: "2002byAnneMarie", tag: "privi" },
    RewardDescription:
      "I also have an amazing suprise for the first 5 people who redeem this. Yep, it a Lollapalooza ticket for you to enjoy :)",
    ImageURL: "https://source.unsplash.com/random/3",
    Cost: 990,
    NumShares: 1924,
    Redeems: [{ Amount: 120 }, { Amount: 15 }],
    EndDate: 1621637591841,
  },
  {
    Title: "Have an Online Dinner With Me and My Band",
    Description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin quam molestie, sodales lacus quis, pulvinar felis. Morbi bibendum molestie neque, in ornare dolor mollis aliquam. Maecenas volutpat rhoncus quam non commodo. In elementum mauris at lorem laoreet cursus. ",
    Reward: { id: "2002byAnneMarie", tag: "privi" },
    RewardDescription:
      "I also have an amazing suprise for the first 5 people who redeem this. Yep, it a Lollapalooza ticket for you to enjoy :)",
    ImageURL: "https://source.unsplash.com/random/4",
    Cost: 990,
    NumShares: 1194,
    Redeems: [{ Amount: 120 }, { Amount: 15 }],
    EndDate: 1621627591841,
  },
  {
    Title: "Have an Online Dinner With Me and My Band",
    Description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin quam molestie, sodales lacus quis, pulvinar felis. Morbi bibendum molestie neque, in ornare dolor mollis aliquam. Maecenas volutpat rhoncus quam non commodo. In elementum mauris at lorem laoreet cursus. ",
    Reward: { id: "2002byAnneMarie", tag: "privi" },
    RewardDescription:
      "I also have an amazing suprise for the first 5 people who redeem this. Yep, it a Lollapalooza ticket for you to enjoy :)",
    ImageURL: "https://source.unsplash.com/random/5",
    Cost: 990,
    NumShares: 194,
    Redeems: [{ Amount: 120 }, { Amount: 15 }],
    EndDate: 1621618591841,
  },
  {
    Title: "Have an Online Dinner With Me and My Band",
    Description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin quam molestie, sodales lacus quis, pulvinar felis. Morbi bibendum molestie neque, in ornare dolor mollis aliquam. Maecenas volutpat rhoncus quam non commodo. In elementum mauris at lorem laoreet cursus. ",
    Reward: { id: "2002byAnneMarie", tag: "privi" },
    RewardDescription:
      "I also have an amazing suprise for the first 5 people who redeem this. Yep, it a Lollapalooza ticket for you to enjoy :)",
    ImageURL: "https://source.unsplash.com/random/6",
    Cost: 990,
    NumShares: 194,
    EndDate: 1621616591841,
  },
];

export default function PerksRewardsTab({ socialToken, isCreator, triggerPerks, setTriggerPerks }) {
  const classes = useSocialTokenStyles();

  const [perks, setPerks] = useState<any[]>([]);
  const [filteredPerks, setFilteredPerks] = useState<any[]>([]);

  const [totalShares, setTotalShares] = useState<number>(0);
  const [totalRedeems, setTotalRedeems] = useState<number>(0);
  const [totalValueRedeems, setTotalValueRedeems] = useState<number>(0);

  const [searchValue, setSearchValue] = useState<string>("");
  const [redeemCost, setRedeemCost] = useState<number>(5000);
  const [shares, setShares] = useState<number>(4500);

  // useEffect(() => {
  //   const newPerks = [] as any;

  //   perks.forEach(p => {
  //     if (redeemCost >= p.Cost && shares >= p.NumShares) {
  //       if (searchValue !== "") {
  //         if (p.Title.toUpperCase().includes(searchValue.toUpperCase())) {
  //           newPerks.push(p);
  //         }
  //       } else {
  //         newPerks.push(p);
  //       }
  //     }
  //   });

  //   setFilteredPerks(newPerks);
  // }, [searchValue, shares, redeemCost]);

  useEffect(() => {
    if (socialToken) {
      // Axios.get(`${URL()}/social/getPerks/${socialToken.PoolAddress}`)
      //   .then(res => {
      //     const resp = res.data;
      //     if (resp.success) {
      //       // const newPerks = resp.data; /// should be updated later
      //       const newPerks = fakePerks;
      //       setPerks(newPerks);
      //       setFilteredPerks(newPerks);
      //       if (newPerks && newPerks.length > 0) {
      //         let total = 0;
      //         let totalR = 0;
      //         let totalVR = 0;
      //         newPerks.forEach(p => {
      //           if (p.NumShares) {
      //             total = total + p.NumShares;
      //           }
      //           if (p.Redeems) {
      //             p.Redeems.forEach(r => {
      //               if (r.Amount) {
      //                 totalVR = totalVR + r.Amount;
      //                 totalR = totalR + 1;
      //               }
      //             });
      //           }
      //         });
      //         setTotalShares(total);
      //       }
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    }
  }, [socialToken, triggerPerks]);

  return (
    <Box width="100%">
      <div className={classes.infoRow}>
        <div>
          <span>🕖 On-Going Perks</span>
          <h2>
            {perks && perks.filter(p => p.EndDate && new Date(p.EndDate).getTime() > new Date().getTime())
              ? perks.filter(p => p.EndDate && new Date(p.EndDate).getTime() > new Date().getTime()).length
              : 0}
          </h2>
        </div>
        <div>
          <span>💜 Redeemed Perks</span>
          <h2>
            {perks && perks.filter(p => p.Redeems && p.Redeems.length > 0)
              ? perks.filter(p => p.Redeems && p.Redeems.length > 0).length
              : 0}
          </h2>
        </div>
        <div>
          <span>🚀 Total Shares</span>
          <h2>{totalShares}</h2>
        </div>
        <div>
          <span>💫 Tokens Redeemed</span>
          <h2>{totalRedeems}</h2>
        </div>
        <div>
          <span>💰 Total Value Redeemed</span>
          <h2>
            {socialToken.FundingToken ?? ""} {totalValueRedeems}
          </h2>
        </div>
      </div>
      <Grid container style={{ marginBottom: "70px" }}>
        <Grid item xs={12} md={4}>
          <div className={classes.inputContainer}>
            <input
              type="text"
              value={searchValue}
              placeholder="Search collections"
              onChange={e => {
                setSearchValue(e.target.value);
              }}
            />

            <img src={require("assets/icons/search_gray.png")} alt={"search"} />
          </div>
        </Grid>
        <Grid item container xs={12} md={8}>
          <Grid item xs={12} sm={6}>
            <Box className={classes.sliderBox}>
              <Box display="flex" width="210px" justifyContent={"space-between"}>
                <p>0</p>
                <p>+100k</p>
              </Box>
              <Box display="flex" alignItems="center">
                <p style={{ marginRight: "17px" }}>Redeem Cost</p>
                <MintSlider
                  min={0}
                  step={100}
                  max={10000}
                  value={redeemCost}
                  onChange={(event: any, newValue: number | number[]) => {
                    setRedeemCost(newValue as number);
                  }}
                  className={classes.slider}
                  valueLabelDisplay="on"
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className={classes.sliderBox} ml={2}>
              <Box display="flex" width="210px" justifyContent={"space-between"}>
                <p>0</p>
                <p>+100k</p>
              </Box>
              <Box display="flex" alignItems="center">
                <p style={{ marginRight: "17px" }}>Shares</p>
                <MagentaSlider
                  min={0}
                  step={100}
                  max={10000}
                  value={shares}
                  onChange={(event: any, newValue: number | number[]) => {
                    setShares(newValue as number);
                  }}
                  className={classes.slider}
                  valueLabelDisplay="on"
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      {filteredPerks && filteredPerks.length > 0 ? (
        <MasonryGrid
          gutter={"40px"}
          data={filteredPerks}
          renderItem={(item, index) => (
            <PerkCard
              perk={item}
              token={socialToken.FundingToken ?? undefined}
              isCreator={isCreator}
              key={`perk-${index}`}
            />
          )}
          columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
        />
      ) : (
        <h2>No Perks to display</h2>
      )}
    </Box>
  );
}

const COLUMNS_COUNT_BREAK_POINTS = {
  400: 1,
  900: 2,
  1440: 3,
};

const MagentaSlider = withStyles({
  root: {
    height: 8,
    borderRadius: 40,
    padding: "4px 0px",
  },
  thumb: {
    height: 14,
    width: 14,
    backgroundColor: "#fff",
    border: "none",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
  },
  track: {
    background: Gradient.Magenta,
    height: 6,
    borderRadius: 3,
  },
  rail: {
    background: "#E0E4F3",
    height: 6,
    borderRadius: 3,
  },
  valueLabel: {
    top: -18,
    "& *": {
      background: "transparent",
    },
    "& span": {
      fontFamily: "Agrandir",
      background: Gradient.Magenta,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "14px !important",
    },
  },
})(Slider);

const MintSlider = withStyles({
  root: {
    color: Gradient.Green,
    height: 8,
    borderRadius: 40,
    padding: "4px 0px",
  },
  thumb: {
    height: 14,
    width: 14,
    backgroundColor: "#fff",
    border: "none",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
  },
  track: {
    background: Gradient.Green,
    height: 6,
    borderRadius: 3,
  },
  rail: {
    background: "#E0E4F3",
    height: 6,
    borderRadius: 3,
  },
  valueLabel: {
    top: -18,
    "& *": {
      background: "transparent",
    },
    "& span": {
      fontFamily: "Agrandir",
      background: Gradient.Green,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "14px !important",
    },
  },
})(Slider);
