import React, { useState } from "react";
import "./TokenCard.css";
import URL from "shared/functions/getURL";
import { limitOfDecimals, randomNumber } from "shared/helpers/utils";

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

export default function TokenCard(props) {
  const [tokenImageId, setTokenImageId] = useState<number>(randomNumber(1, 25));

  if (props.token && props.token.Type) {
    let rateOfChange = props.rateOfChange;
    let colorRate = rateOfChange < 0 ? "#F43E5F" : "#65CB63";

    return (
      <div className="token-card">
        <div
          className="token-image"
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
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="col">
          <div className="token-type">
            {`${
              props.token.Type.includes("NFT") || props.token.Type.includes("MEDIA")
                ? "🏆 NFT"
                : props.token.Type.includes("FT")
                ? "👘 FT"
                : props.token.Type.includes("CRYPTO")
                ? "💸 Crypto"
                : "📸 Social"
            }`}
          </div>
          <p>
            {props.token.Token.length > 19 ? props.token.Token.substring(0, 18) + ".." : props.token.Token}
          </p>
          <div className={"small-text"}>Balance</div>
          <div className={"balance"}>
            {Number.isFinite(props.token.Balance)
              ? limitOfDecimals(props.token.Balance)
              : props.token.Balance}
          </div>
        </div>
        <div className="col right">
          <div className="chain">
            <div className={"small-text"}>Chain</div>
            <div className="content">
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
          </div>
          <span style={{ color: colorRate }}>{`${
            props.rateOfChange > 0 ? "+" : props.rateOfChange === 0 ? "" : "-"
          }${(props.rateOfChange * 100).toFixed(4)}%`}</span>
        </div>
      </div>
    );
  } else return null;
}
