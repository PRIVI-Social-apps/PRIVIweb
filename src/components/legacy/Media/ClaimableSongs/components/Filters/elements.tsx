import { Gradient, TabNavigation } from "shared/ui-kit";
import { createStyles, makeStyles, Slider, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";

const useStyles = makeStyles(() =>
  createStyles({
    filters: {
      width: "100%",
      display: "flex",
      alignItems: "flex-start",
      overflowY: "hidden",
      padding: "10px 5px 10px 0px",
      marginTop: -10,
      marginBottom: 28,
    },

    fakeButton: {
      marginLeft: 9,
      background: "#ffffff",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
      borderRadius: 10,
      padding: "14px 18px 8px",
      minWidth: 320,

      "& > span": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 14,
        marginTop: 4.5,
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        background: Gradient.Magenta,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        "& img": {
          marginLeft: 7,
        },
      },

      "& > div": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 18,
        "& span": {
          margin: 0,
          background: Gradient.Red,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: 22,
        },
      },

      "&:last-child": {
        minWidth: 198,
        cursor: "pointer",
        "& span": {
          marginTop: 0,
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: 18,
          background: Gradient.Mint,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
      },
    },
    tabBox: {
      minWidth: 0,
      marginTop: "40px",
      position: "static",
      backgroundColor: "transparent",
      boxShadow: "none",
      textTransform: "none",
      borderRadius: 0,
    },
    tabItem: {
      minWidth: 0,
      fontFamily: "Agrandir",
      height: "auto",
      textTransform: "inherit",
      lineHeight: "18px",
      fontSize: "14px",
      fontWeight: "bold",
      marginRight: "25px",
      "&.Mui-selected": {
        "& span": {
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          background: Gradient.Mint,
        },
      },
      "& span": {
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        background: "#ABB3C4",
      },
    },

    selectors: {
      marginTop: "34px",
      width: "100%",
      display: "flex",
      alignItems: "center",
    },
    selector: {
      width: "30%",
      background: "#FFFFFF",
      border: "1px solid #C0C6DC",
      boxSizing: "border-box",
      borderRadius: "6px",
      height: "40px",
      marginRight: "15px",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      lineHeight: "104.5%",
      color: "#181818",
      padding: "0px 16px",
      "&:disabled": {
        opacity: 0.3,
      },
      "&:last-child": {
        margin: 0,
      },
    },

    sliders: {
      marginTop: "46px",
      maxWidth: "calc(100vw - 72px * 2)",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "84px",
    },
    sliderContainer: {
      display: "flex",
      alignItems: "flex-end",
      marginRight: "48px",
      width: "calc(100% / 3)",
      "& span": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        color: "#707582",
      },
      "&:last-child": {
        marginRight: "0 !important",
      },
    },
    column: {
      marginLeft: "24px",
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    row: { display: "flex", justifyContent: "space-between" },
    slider: {
      width: "100%",
    },
    mintPill: {
      padding: "6px 11px",
      height: "28px",
      background: Gradient.Mint,
      borderRadius: "14px",
      color: "white !important",
      fontSize: "11px",
    },
  })
);

export const ClaimableSongsSearchBar = ({ filters, onFiltersChange }) => {
  const classes = useStyles();

  const [searchValue, setSearchValue] = useState(filters.searchValue);

  useEffect(() => {
    onFiltersChange({
      searchValue,
    });
  }, [searchValue, onFiltersChange]);

  const handleAddHours = () => { };

  const handleGetPriviCredit = () => { };

  return (
    <div className={classes.filters}>
      <SearchWithCreate
        handleSearchChange={e => setSearchValue(e.target.value)}
        searchValue={searchValue}
        searchPlaceholder="Search by artist, name or tag" />
      <div className={classes.fakeButton}>
        <div>
          🔥 Privi Free Zone: <span>5 hours left</span>
        </div>
        <span onClick={handleAddHours}>
          add some more? <img src={require("assets/icons/arrow_purple.png")} alt={"arrow"} />
        </span>
      </div>
      <div className={classes.fakeButton} onClick={handleGetPriviCredit}>
        <span>Get Privi Credit for higher rated songs</span>
      </div>
    </div>
  );
};

export const ClaimableSongsAppBar = ({ filters, onFiltersChange }) => {
  const [tabValue, setTabValue] = useState(filters.tabValue ?? 0);

  useEffect(() => {
    onFiltersChange({
      tabValue,
    });
  }, [tabValue, onFiltersChange]);

  return (
    <TabNavigation
      tabs={["All", "Verified", "Claimed", "Not Claimed"]}
      currentTab={tabValue}
      variant="primary"
      onTabChange={setTabValue}
    />
  );
};

export const ClaimableSongsSelectors = ({ filters, onFiltersChange, artistFilters }) => {
  const classes = useStyles();

  const [selector1Value, setSelector1Value] = useState(
    artistFilters ? filters.genreValue ?? "Choose Genre" : filters.artistValue ?? "Choose Artist"
  );
  const [selector2Value, setSelector2Value] = useState(filters.albumValue ?? "Choose Album");
  const [selector3Value, setSelector3Value] = useState(filters.bitRateValue ?? "Choose Bitrate");

  useEffect(() => {
    if (artistFilters) {
      onFiltersChange({
        selector1Value,
        selector3Value,
      });
    } else {
      onFiltersChange({
        selector1Value,
        selector2Value,
        selector3Value,
      });
    }
  }, [selector1Value, selector2Value, selector3Value, onFiltersChange]);

  return (
    <div className={classes.selectors}>
      <StyledSelect
        disableUnderline
        value={selector1Value}
        className={classes.selector}
        onChange={v => {
          const newValue: any = v.target.value;
          if (newValue !== "Choose Genre" && newValue !== "Choose Artist") setSelector1Value(newValue);
        }}
        placeholder={artistFilters ? "Choose Genre" : "Choose Artist"}
      >
        {[artistFilters ? "Choose Genre" : "Choose Artist"].map((item, i) => {
          return (
            <StyledMenuItem key={i} value={item}>
              {item}
            </StyledMenuItem>
          );
        })}
      </StyledSelect>
      {!artistFilters && (
        <StyledSelect
          disableUnderline
          value={selector2Value}
          className={classes.selector}
          onChange={v => {
            const newValue: any = v.target.value;
            if (newValue !== "Choose Album") setSelector2Value(newValue);
          }}
          placeholder={"Choose Album"}
          disabled={true}
        >
          {["Choose Album"].map((item, i) => {
            return (
              <StyledMenuItem key={i} value={item}>
                {item}
              </StyledMenuItem>
            );
          })}
        </StyledSelect>
      )}
      <StyledSelect
        disableUnderline
        value={selector3Value}
        className={classes.selector}
        onChange={v => {
          const newValue: any = v.target.value;
          if (newValue !== "Choose Bitrate") setSelector3Value(newValue);
        }}
        placeholder={"Choose Bitrate"}
      >
        {["Choose Bitrate"].map((item, i) => {
          return (
            <StyledMenuItem key={i} value={item}>
              {item}
            </StyledMenuItem>
          );
        })}
      </StyledSelect>
    </div>
  );
};

export const ClaimableSongsSliders = ({ filters, onFiltersChange }) => {
  const classes = useStyles();

  const [reproductions, setReproductions] = useState(filters.reproductionsNumber ?? 4500);
  const [priceRate, setPriceRate] = useState(filters.priceRateNumber ?? 4500);
  const [likes, setLikes] = useState(filters.likesNumber ?? 4500);

  useEffect(() => {
    onFiltersChange({
      reproductions,
      priceRate,
      likes,
    });
  }, [reproductions, priceRate, likes, onFiltersChange]);

  return (
    <div className={classes.sliders}>
      <div className={classes.sliderContainer}>
        <span>Number of reproductions</span>
        <div className={classes.column}>
          <div className={classes.row}>
            <span>0</span> <span>+100k</span>
          </div>
          <MagentaSlider
            min={0}
            step={100}
            max={10000}
            value={reproductions}
            onChange={(event: any, newValue: number | number[]) => {
              setReproductions(newValue as number);
            }}
            className={classes.slider}
            valueLabelDisplay="auto"
          />
        </div>
      </div>
      <div className={classes.sliderContainer}>
        <span>Price rate</span>
        <div className={classes.column}>
          <div className={classes.row}>
            <span className={classes.mintPill}>Privi Free Zone</span> <span>+100k pUSD</span>
          </div>
          <MintSlider
            min={0}
            step={100}
            max={10000}
            value={priceRate}
            onChange={(event: any, newValue: number | number[]) => {
              setPriceRate(newValue as number);
            }}
            className={classes.slider}
            valueLabelDisplay="auto"
          />
        </div>
      </div>
      <div className={classes.sliderContainer}>
        <span>Likes</span>
        <div className={classes.column}>
          <div className={classes.row}>
            <span>0</span> <span>+100k</span>
          </div>
          <MagentaSlider
            min={0}
            step={100}
            max={10000}
            value={likes}
            onChange={(event: any, newValue: number | number[]) => {
              setLikes(newValue as number);
            }}
            className={classes.slider}
            valueLabelDisplay="on"
          />
        </div>
      </div>
    </div>
  );
};

const MagentaSlider = withStyles({
  root: {
    height: 6,
    borderRadius: 3,
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
    top: 30,
    "& *": {
      background: "transparent",
    },
    "& span": {
      fontFamily: "Agrandir",
      background: Gradient.Magenta,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
  },
})(Slider);

const MintSlider = withStyles({
  root: {
    color: "#52af77",
    height: 6,
    borderRadius: 3,
  },
  thumb: {
    height: 14,
    width: 14,
    backgroundColor: "#fff",
    border: "none",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
  },
  track: {
    background: Gradient.Mint,
    height: 6,
    borderRadius: 3,
  },
  rail: {
    background: "#E0E4F3",
    height: 6,
    borderRadius: 3,
  },
  valueLabel: {
    top: 30,
    "& *": {
      background: "transparent",
    },
    "& span": {
      fontFamily: "Agrandir",
      background: Gradient.Mint,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
  },
})(Slider);
