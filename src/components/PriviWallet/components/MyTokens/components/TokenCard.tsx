import React, { useState } from "react";
import { limitOfDecimals, randomNumber } from "shared/helpers/utils";
import { makeStyles } from "@material-ui/core";
import Box from "shared/ui-kit/Box";
import { Color } from "shared/ui-kit";

const TOKENASSETICON = [
  require("assets/tokenImages/Badge_Token_Logo.svg"),
  require("assets/tokenImages/Badge_Token_Logo1.svg"),
  require("assets/tokenImages/Badge_Token_Logo2.svg"),
  require("assets/tokenImages/Badge_Token_Logo3.svg"),
  require("assets/tokenImages/Badge_Token_Logo4.svg"),
  require("assets/tokenImages/Community_Token_Logo.svg"),
  require("assets/tokenImages/Component_53.svg"),
  require("assets/tokenImages/Component_54.svg"),
  require("assets/tokenImages/Component_55.svg"),
  require("assets/tokenImages/Component_56.svg"),
  require("assets/tokenImages/Crypto_Token_Logo.svg"),
  require("assets/tokenImages/Crypto_Token_Logo1.svg"),
  require("assets/tokenImages/Crypto_Token_Logo2.svg"),
  require("assets/tokenImages/Crypto_Token_Logo3.svg"),
  require("assets/tokenImages/Crypto_Token_Logo4.svg"),
  require("assets/tokenImages/Pod_Token_Logo.svg"),
  require("assets/tokenImages/Pod_Token_Logo1.svg"),
  require("assets/tokenImages/Pod_Token_Logo2.svg"),
  require("assets/tokenImages/Pod_Token_Logo3.svg"),
  require("assets/tokenImages/Social_Token_Logo1.svg"),
  require("assets/tokenImages/Social_Token_Logo2.svg"),
  require("assets/tokenImages/Social_Token_Logo3.svg"),
  require("assets/tokenImages/Social_Token_Logo4.svg"),
  require("assets/tokenImages/Social_Token_Logo12.svg"),
];

const useStyles = makeStyles(theme => ({
  tokenCard: {
    width: "100%",
    height: "auto",
    minHeight: "194px",
    display: "flex",
    background: "#ffffff",
    boxShadow: "0px 8px 9px -11px rgba(0, 0, 0, 0.35), 0px 6px 36px -11px rgba(0, 0, 0, 0.02)",
    borderRadius: "12px",
    padding: "15px 12px 24px",
  },
  tokenImage: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  title: {
    display: "flex",
    alignItems: "center",
    color: Color.MusicDAODark,
    fontFamily: "Montserrat",
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "120%",
    marginBottom: "4px",
    "& svg": {
      marginLeft: "2px",
      height: "9px",
    },
  },
  type: {
    display: "flex",
    alignItems: "center",
    fontFamily: "Montserrat",
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: "104.2%",
    color: "#707582",
    textTransform: "uppercase",
    background: "#EFF2F8",
    borderRadius: "4px",
    padding: "2px 8px",
    width: "fit-content",
  },
  divider: {
    width: "116px",
    background: "#EFF2F8",
    marginTop: "16px",
    marginBottom: "16px",
    height: "1px",
  },
  balanceTitle: {
    display: "flex",
    alignItems: "center",
    color: "#707582",
    fontFamily: "Montserrat",
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: "120%",
    marginBottom: "5px",
  },
  balance: {
    fontFamily: "Agrandir GrandLight",
    fontWeight: 800,
    marginBottom: "5px",
    color: Color.MusicDAODark,
    fontSize: "16px",
    lineHeight: "104.5%",
  },
  rate: {
    fontSize: "12px",
  },
  chain: {
    display: "flex",
    alignItems: "center",
    color: "#000000",
    fontSize: "11px",
    marginLeft: "8px",
    "& img": {
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      marginRight: "5px",
    },
  },
}));

export default function TokenCard(props) {
  const [tokenImageId, setTokenImageId] = useState<number>(randomNumber(1, 25));

  const classes = useStyles();

  if (props.token && props.token.Type) {
    let rateOfChange = props.rateOfChange;
    let colorRate = rateOfChange < 0 ? "#F43E5F" : "#65CB63";

    return (
      <div className={classes.tokenCard}>
        <div
          className={classes.tokenImage}
          style={{
            backgroundImage:
              props.token.Chain === "PRIVI"
                ? // privi wallet
                  props.token.Type === "CRYPTO"
                  ? props.token.Token === "LINK"
                    ? `url(${require(`assets/tokenImages/LNK.png`)})`
                    : props.token.Token
                    ? `url(${require(`assets/tokenImages/${props.token.Token}.png`)})`
                    : `url(${TOKENASSETICON[tokenImageId]})`
                  : `url(${TOKENASSETICON[tokenImageId]})`
                : // eth wallet
                props.token.ImageUrl
                ? `url(${props.token.ImageUrl})`
                : `url(${TOKENASSETICON[tokenImageId]})`,
          }}
        />
        <Box ml="12px" display="flex" flexDirection="column">
          <Box display="flex" flexDirection="column">
            <div className={classes.title}>
              {props.token.Token}{" "}
              <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7.10713" cy="3.53571" r="3.53571" fill="#FFC71B" />
                <circle
                  cx="4.53571"
                  cy="5.46412"
                  r="3.85714"
                  fill="#FFC71B"
                  stroke="white"
                  stroke-width="0.642857"
                />
              </svg>
            </div>
            <div className={classes.type}>
              {`${
                props.token.Type.includes("NFT") || props.token.Type.includes("MEDIA")
                  ? "NFT 🏆"
                  : props.token.Type.includes("FT")
                  ? "FT 👘"
                  : props.token.Type.includes("CRYPTO")
                  ? "CRYPTO 💸"
                  : "SOCIAL 📸"
              }`}
            </div>
          </Box>

          <div className={classes.divider} />

          <Box display="flex" flexDirection="column">
            <div className={classes.balanceTitle}>Balance</div>
            <div className={classes.balance}>
              {Number.isFinite(props.token.Balance)
                ? limitOfDecimals(props.token.Balance)
                : props.token.Balance}
            </div>
            <div style={{ color: colorRate }} className={classes.rate}>{`${
              props.rateOfChange > 0 ? "+" : props.rateOfChange === 0 ? "" : "-"
            }${(props.rateOfChange * 100).toFixed(4)}%`}</div>
          </Box>

          <div className={classes.divider} />

          <Box display="flex" fontSize="11px" color="#707582">
            Chain:
            <div className={classes.chain}>
              {props.token.Chain === "PRIVI" || props.token.Chain === "Ethereum" ? (
                <img
                  src={require(`assets/tokenImages/${props.token.Chain === "PRIVI" ? "PRIVI" : "ETH"}.png`)}
                  alt={props.token.Chain}
                />
              ) : props.token.Chain === "SUBS" ? (
                <img src={require(`assets/tokenImages/polkadot.svg`)} alt={props.token.Chain} />
              ) : null}
              {props.token.Chain}
            </div>
          </Box>
        </Box>
      </div>
    );
  } else return null;
}
