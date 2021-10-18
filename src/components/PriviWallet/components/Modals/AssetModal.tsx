import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import URL from "shared/functions/getURL";
import { Color, Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { resImages } from "shared/ui-kit/Select/TokenSelect";

const assetModalStyles = makeStyles(theme => ({
  root: {
    width: "565px !important",
    fontSize: "14px",
    lineHeight: "104.5%",
    "& h3": {
      fontFamily: "Agrandir GrandLight",
      fontSize: "22px",
      fontWeight: 800,
      lineHeight: "140%",
      width: "254px",
      margin: 0,
      color: Color.Black,
      "& span": {
        color: Color.MusicDAODeepBlue,
      },
    },

    "& .MuiInput-root": {
      borderRadius: "56px",
      height: "56px",
      border: "1px solid #E0E4F3",
      background: Color.White,

      "& img": {
        width: "17px",
        height: "17px",
      },
    },
    "& ::-webkit-scrollbar": {
      background: "#EFF2F8 !important",
    },
    "& ::-webkit-scrollbar-thumb": {
      background: "#707582 !important",
    },
  },
  tokensList: {
    marginTop: "12px",
    height: "328px",
    maxHeight: "328px",
    overflowY: "auto",
    width: "100%",
  },
  token: {
    borderBottom: "1px solid #EFF2F8",
    padding: "10px 0px",
    marginBottom: "6px",
    cursor: "pointer",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  symbolImg: {
    width: "37px",
    height: "37px",
    borderRadius: "50%",
    border: "1px solid rgba(224, 223, 240, 0.49)",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& img": {
      width: "25px",
      height: "25px",
      borderRadius: "50%",
      objectFit: "cover",
    },
  },
  symbol: { marginLeft: "18px", color: Color.Black, fontWeight: 700 },
  name: {
    color: "#707582",
    textAlignt: "right",
    fontWeight: "normal",
  },
  tick: {
    width: "16px",
    height: "11px",
    marginLeft: "10px",
    "& svg": {
      width: "16px",
      height: "11px",
    },
  },
}));

export default function AssetModal({ open, onClose, asset, onChange, tokens, chain }) {
  const classes = assetModalStyles();

  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredTokens, setFilteredTokens] = useState<any[]>([]);

  useEffect(() => {
    if (open && tokens) {
      setFilteredTokens(tokens);
      setSearchValue("");
    }
  }, [open, tokens]);

  useEffect(() => {
    if (searchValue && searchValue !== "") {
      setFilteredTokens(
        tokens.filter(
          t =>
            t.token?.toUpperCase().includes(searchValue.toUpperCase()) ||
            t.name?.toUpperCase().includes(searchValue.toUpperCase())
        )
      );
    } else {
      setFilteredTokens(tokens);
    }
  }, [searchValue]);

  useEffect(() => {
    filteredTokens;
  }, [filteredTokens]);

  const isCrypto = token => {
    if (resImages.includes(token)) return true;
    else return false;
  };

  return (
    <Modal isOpen={open} onClose={onClose} showCloseIcon size="medium" className={classes.root}>
      <h3>
        Choose asset from <span>{chain}</span>
      </h3>
      <InputWithLabelAndTooltip
        endAdornment={<img src={require("assets/icons/search_gray.png")} alt="search" />}
        inputValue={searchValue}
        type="text"
        onInputValueChange={e => {
          setSearchValue(e.target.value);
        }}
        placeHolder="Search coin"
      />

      <div className={classes.tokensList}>
        {filteredTokens?.map((t, i) => (
          <div
            className={classes.token}
            key={`token-${i}`}
            onClick={() => {
              onChange(t.token);
              onClose();
            }}
          >
            <Box display="flex" alignItems="center">
              <div className={classes.symbolImg}>
                <img
                  src={
                    t.token && isCrypto(t.token)
                      ? require(`assets/tokenImages/${t.token}.png`)
                      : `${URL()}/wallet/getTokenPhoto/${t.token}`
                  }
                  alt={t.token}
                />
              </div>
              <div className={classes.symbol}>{t.token}</div>
            </Box>

            <Box display="flex" alignItems="center">
              <div className={classes.name}>{t.name}</div>
              <div className={classes.tick}>{asset && asset === t?.token ? <Tick /> : null}</div>
            </Box>
          </div>
        ))}
      </div>
    </Modal>
  );
}

const Tick = () => {
  return (
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.8384 2L6.83842 13L1.83832 8"
        stroke="url(#paint0_linear)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient x1="3.68448" y1="6.03332" x2="16.1702" y2="8.39078" gradientUnits="userSpaceOnUse">
          <stop stopColor="#23D0C6" />
          <stop offset="1" stopColor="#00CC8F" />
        </linearGradient>
      </defs>
    </svg>
  );
};
