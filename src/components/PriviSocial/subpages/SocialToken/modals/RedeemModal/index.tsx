import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import { createStyles, makeStyles } from "@material-ui/core";

import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { Modal, PrimaryButton, Gradient, SecondaryButton, Color } from "shared/ui-kit";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import Box from 'shared/ui-kit/Box';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "auto !important",
    },
    content: {
      width: "610px",
      display: "flex",
      flexDirection: "column",
      "& > section": {
        padding: "20px 0px",
        width: "100%",
      },
      "& h3": {
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "22px",
        margin: "-50px 0px 28px",
      },
      "& h4": {
        fontWeight: 800,
        fontSize: "40px",
        color: Color.GrayDark,
        margin: 0,
      },
      "& h5": {
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "18px",
        color: Color.GrayDark,
        margin: "0px 0px 10px",
      },
      "& h6": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "21px",
        color: Color.GrayDark,
        margin: "0px 0px 4px",
        "& span": {
          color: "#707582 !important",
          cursor: "inherit",
          WebkitBackgroundClip: "inherit",
          background: "transparent",
        },
      },
      "& p": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        color: "#949BAB",
      },
      "& span": {
        fontSize: "14px",
        cursor: "pointer",
        color: "transparent",
        background: Gradient.Mint,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
      "& label": {
        width: "100%",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        color: "#707582",
        marginBottom: "16px",
      },
    },
    mediaPhoto: {
      marginRight: "20px",
      borderRadius: "50%",
      height: "74px",
      width: "74px",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "#F7F9FE",
    },

    first: {
      borderTop: "1px solid #6f748033",
      borderBottom: "1px dashed #6f748033",
    },
    last: {
      borderTop: "1px solid #6f748033",
    },
    buttons: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginTop: "28px",
      "& button": {
        margin: "0px !important",
      },
    },
  })
);

export default function RedeemModal({ open, handleClose, perk, token }) {
  //REDUX
  const users = useTypedSelector(state => state.usersInfoList);

  //HOOKS
  const classes = useStyles();
  const history = useHistory();
  const { convertTokenToUSD } = useTokenConversion();

  const [status, setStatus] = useState<any>("");

  const [rewardMedia, setRewardMedia] = useState<any>({});

  useEffect(() => {
    if (perk.Reward && perk.Reward.id && perk.Reward.tag) {
      Axios.get(`${URL()}/media/getMedia/${perk.Reward.id}/${perk.Reward.tag}`)
        .then(async response => {
          let data: any = response.data;
          if (data.success) {
            let m = data.data;

            m.ImageUrl = m.HasPhoto
              ? `${URL()}/media/getMediaMainPhoto/${m.MediaSymbol.replace(/\s/g, "")}`
              : undefined;

            if (!m.price) {
              if (
                m.QuickCreation &&
                m.ViewConditions &&
                m.ViewConditions.Price > 0 &&
                m.ViewConditions.ViewingToken
              ) {
                m.price = `${m.ViewConditions.ViewingToken.toUpperCase()} ${m.ViewConditions.Price}${m.ViewConditions.ViewingType === "DYNAMIC" ? "/per sec" : ""
                  }`;
                m.usdPrice = `${convertTokenToUSD(
                  m.ViewConditions.ViewingToken.toUpperCase(),
                  m.ViewConditions.Price
                ).toFixed(6)}${m.ViewConditions.ViewingType === "STREAMING" ? "/per sec" : ""}`;
              } else if (m.PaymentType === "FIXED" && m.FundingToken) {
                m.price = `${m.FundingToken.toUpperCase() ?? ""} ${m.Price && m.Price !== 0 ? m.Price : ""}`;
                m.usdPrice = `${convertTokenToUSD(m.FundingToken.toUpperCase(), m.Price).toFixed(6)}`;
              } else if (m.PaymentType === "DYNAMIC" && m.FundingToken) {
                m.price = `${m.FundingToken.toUpperCase() ?? ""} ${m.PricePerSecond && m.PricePerSecond !== 0 ? m.PricePerSecond + "/per sec." : ""
                  }`;
                m.usdPrice = `${convertTokenToUSD(m.FundingToken.toUpperCase(), m.PricePerSecond).toFixed(
                  6
                )} /per sec.`;
              } else {
                m.price = "";
                m.usdPrice = "";
              }
            } else {
              if (m.price && m.price.includes("($")) {
                //separate price from usd price
                let price = m.price.split("(")[0];
                let usdPrice = "(" + m.price.split("(")[1];

                m.price = price;
                m.usdPrice = usdPrice;
              }
            }

            setRewardMedia(m);
          } else {
            setStatus({
              msg: "Error displaying Media data",
              key: Math.random(),
              variant: "error",
            });

            setRewardMedia({
              MediaName: "",
              ImageUrl: "",
              price: "",
            });
          }
        })
        .catch(err => {
          setStatus({
            msg: "Error displaying Media data",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  }, [perk]);

  const gotoMedia = () => {
    if (rewardMedia)
      history.push(
        `/media/${rewardMedia.MediaSymbol ? rewardMedia.MediaSymbol.replace(/\s/g, "") : rewardMedia.id}`
      );
  };

  const handleRedeem = () => {
    //TODO: accept
    setStatus({
      msg: "Proposal accepted",
      key: Math.random(),
      variant: "success",
    });
    handleClose();
  };

  if (open && perk)
    return (
      <Modal className={classes.root} size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
        <div>
          <div className={classes.content}>
            <h3>Redeem Tokens</h3>

            <section className={classes.first}>
              <label>⚽ Perk</label>
              <p>{perk.Description ?? "Perk content"}</p>
            </section>

            <section>
              <label>🏆 Reward</label>
              {rewardMedia && (
                <Box display="flex" width="100%">
                  <div
                    className={classes.mediaPhoto}
                    style={{
                      backgroundImage:
                        rewardMedia.ImageUrl && rewardMedia.ImageUrl !== ""
                          ? `url(${rewardMedia.ImageUrl})`
                          : "none",
                    }}
                  />
                  <div>
                    <h5>{rewardMedia.MediaName ?? rewardMedia.title ?? rewardMedia.name ?? "Media name"}</h5>
                    <h6>
                      {rewardMedia.price ?? "ETH N/A"} <span>{`$(${rewardMedia.usdPrice ?? "N/A"})`}</span>
                    </h6>
                    <span onClick={gotoMedia}>View NFT Details</span>
                  </div>
                </Box>
              )}
            </section>

            <section className={classes.last}>
              <label>🤑 You are about to redeem</label>
              <h4>{`${perk.Cost ?? "N/A"} ${token ?? ""}`}</h4>
            </section>

            <div className={classes.buttons}>
              <SecondaryButton onClick={handleClose} size="medium">
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={handleRedeem} size="medium">
                Confirm
              </PrimaryButton>
            </div>
          </div>
          {status && (
            <AlertMessage
              key={status.key}
              message={status.msg}
              variant={status.variant}
              onClose={() => setStatus(undefined)}
            />
          )}
        </div>
      </Modal>
    );
  else return null;
}
