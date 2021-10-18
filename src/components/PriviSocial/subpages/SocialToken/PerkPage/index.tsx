import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";

import { Grid, makeStyles } from "@material-ui/core";

import SocialTokenContext from "../context";
import { Divider, Gradient, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import PerkOpinions from "./components/Opinions";
import PerkComments from "./components/Comments";
import PerkCost from "./components/Cost";
import URL from "shared/functions/getURL";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import RedeemModal from "../modals/RedeemModal";
import AddRewardsModal from "../modals/AddRewardsModal";
import CreateBadgeModal from "components/PriviSocial/subpages/SocialToken/modals/Create-badge/CreateBadgeModal";
import Box from 'shared/ui-kit/Box';
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    padding: "0px 120px 20px",
    overflowY: "auto",
    maxHeight: "calc(100vh - 82px)",
    "& > section": {
      padding: "20px 0px",
      width: "100%",
    },
    "& label": {
      fontSize: "18px",
      lineHeight: "120%",
      color: "#707582",
      marginBottom: "12px",
    },
    "& p": {
      fontSize: "14px",
      lineHeight: "120%",
      color: "#949BAB",
      marginBottom: "12px",
      margin: "12px 4px ",
    },
    "& button": {
      display: "flex",
      alignItems: "center",
      width: "100%",
      justifyContent: "center",
      marginLeft: "0px !important",
      "& img": {
        marginRight: "6px",
        width: "15.75px",
        heighgt: "15.35px",
      },
    },
    "& h6": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "22px",
      lineHeight: "104.5%",
      color: "#181818",
      margin: "10px 0px 0px 0px",
    },
    "& span": {
      fontSize: "14px",
      cursor: "inherit",
      color: "#707582",
    },
  },
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "calc(100% + 240px)",
    marginLeft: "-120px",
    padding: "40px 120px",
    marginBottom: "48px",
    "& span": {
      marginBottom: "20px",
      color: "white",
      fontSize: "14px",
      cursor: "pointer",
    },
    "& div": {
      top: 22,
      left: 22,
      color: "#FFFFFF",
      fontSize: "14.5px",
      background: Gradient.Magenta,
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
      borderRadius: "36px",
      padding: "7px 14px 6px",
      marginBottom: "16px",
    },
    "& h2": {
      margin: 0,
      fontWeight: "normal",
      fontSize: "40px",
      color: "white",
    },
  },

  mediaSection: {
    borderTop: "1px dashed #6f748033",
    borderBottom: "1px solid #6f748033",
    marginBottom: "60px",
    display: "flex",
    padding: "20px 0px",
    "& h5": {
      fontWeight: "bold",
      lineHeight: "104.5%",
      color: "#181818",
      margin: 0,
    },
    "& h6": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "21px",
      lineHeight: "104.5%",
      color: "#181818",
      "& span": {
        cursor: "inherit",
        color: "#707582",
        margin: "0px 0px 0px 5px",
      },
    },
    "& span": {
      cursor: "pointer",
      color: "transparent",
      background: Gradient.Mint,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginTop: "5px",
      fontSize: "14px",
    },
  },
  mediaPhoto: {
    marginRight: "30px",
    borderRadius: "50%",
    height: "145px",
    width: "145px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#F7F9FE",
  },

  label: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "22px",
    color: "#181818",
    marginBottom: "25px",
    marginTop: "40px",
  },

  buttons: {
    width: "100%",
    display: "flex",
    "& button": {
      width: "100%",
      marginBottom: "0px !important",
      "&:last-child": {
        marginLeft: "16px !important",
      },
    },
  },
}));
export default function PerkPage({ isCreator, token }) {
  const classes = useStyles();
  const history = useHistory();

  const { selectedPerk, setSelectedPerk } = useContext(SocialTokenContext);
  const { convertTokenToUSD } = useTokenConversion();

  const [reward, setReward] = useState<any>({});

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openError, setOpenError] = useState(false);

  const [openRedeemModal, setOpenRedeemModal] = useState<boolean>(false);
  const [openCreateBadgeModal, setOpenCreateBadgeModal] = useState<boolean>(false);
  const [openAddRewardsModal, setOpenAddRewardsModal] = useState<boolean>(false);
  const handleOpenRedeemModal = () => {
    setOpenRedeemModal(true);
  };
  const handleOpenCreateBadgeModal = () => {
    setOpenCreateBadgeModal(true);
  };
  const handleOpenAddRewardsModal = () => {
    setOpenAddRewardsModal(true);
  };
  const handleCloseRedeemModal = () => {
    setOpenRedeemModal(false);
  };
  const handleCloseCreateBadgeModal = () => {
    setOpenCreateBadgeModal(false);
  };
  const handleCloseAddRewardsModal = () => {
    setOpenAddRewardsModal(false);
  };

  const handleShare = () => {
    //TODO: SHARE
  };

  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 3000);
  };
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  useEffect(() => {
    console.log(selectedPerk);
    if (selectedPerk.Reward && selectedPerk.Reward.id && selectedPerk.Reward.tag) {
      Axios.get(`${URL()}/media/getMedia/${selectedPerk.Reward.id}/${selectedPerk.Reward.tag}`)
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
                m.price = `${m.ViewConditions.ViewingToken.toUpperCase()} ${m.ViewConditions.Price}${
                  m.ViewConditions.ViewingType === "DYNAMIC" ? "/per sec" : ""
                }`;
                m.usdPrice = `${convertTokenToUSD(
                  m.ViewConditions.ViewingToken.toUpperCase(),
                  m.ViewConditions.Price
                ).toFixed(6)}${m.ViewConditions.ViewingType === "STREAMING" ? "/per sec" : ""}`;
              } else if (m.PaymentType === "FIXED" && m.FundingToken) {
                m.price = `${m.FundingToken.toUpperCase() ?? ""} ${m.Price && m.Price !== 0 ? m.Price : ""}`;
                m.usdPrice = `${convertTokenToUSD(m.FundingToken.toUpperCase(), m.Price).toFixed(6)}`;
              } else if (m.PaymentType === "DYNAMIC" && m.FundingToken) {
                m.price = `${m.FundingToken.toUpperCase() ?? ""} ${
                  m.PricePerSecond && m.PricePerSecond !== 0 ? m.PricePerSecond + "/per sec." : ""
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

            setReward(m);
            console.log(m);
          } else {
            setErrorMsg("Error displaying Media data");
            handleClickError();

            setReward({
              MediaName: "",
              ImageUrl: "",
              price: "",
            });
          }
        })
        .catch(err => {
          console.log(err);
          setErrorMsg("Error displaying Media data");
          handleClickError();
        });
    }
  }, [selectedPerk]);

  const gotoMedia = () => {
    if (reward)
      history.push(`/media/${reward.MediaSymbol ? reward.MediaSymbol.replace(/\s/g, "") : reward.id}`);
  };

  return (
    <div className={classes.root}>
      <div
        className={classes.header}
        style={{
          backgroundImage:
            selectedPerk.ImageURL && selectedPerk.ImageURL !== "" ? `url(${selectedPerk.ImageURL})` : "none",
        }}
      >
        <span onClick={() => setSelectedPerk(null)}>{`< back`}</span>
        {selectedPerk.Trending && <div>🔥 Trending Perk</div>}
        <h2>{selectedPerk.Title ?? ""}</h2>
      </div>
      <Grid container spacing={3} direction="row" alignItems="flex-start" justify="flex-start">
        <Grid item xs={12} md={8}>
          <section>
            <label>⚽ Perk</label>
            <p>{selectedPerk.Description ?? ""}</p>
          </section>
          <section>
            <label>🏆 Reward</label>
            <p>{selectedPerk.RewardDescription ?? ""}</p>
          </section>
          {reward && (
            <section className={classes.mediaSection}>
              <div
                className={classes.mediaPhoto}
                style={{
                  backgroundImage:
                    reward.ImageUrl && reward.ImageUrl !== "" ? `url(${reward.ImageUrl})` : "none",
                }}
              />
              <Box display="flex" flexDirection="column" justifyContent="space-between">
                <h5>{reward.MediaName ?? reward.Title ?? reward.Name ?? reward.Symbol ?? ""}</h5>
                <h6>
                  {reward.price ?? "ETH N/A"} <span>{`$(${reward.usdPrice ?? "N/A"})`}</span>
                </h6>
                <span onClick={gotoMedia}>View NFT Details</span>
              </Box>
            </section>
          )}
          <PerkOpinions />
          <PerkComments />
        </Grid>
        <Grid item xs={12} md={4}>
          <PerkCost />
          <Box display="flex" marginTop="30px" marginBottom={"22px"}>
            <Box marginRight="48px">
              <span>🚀 Shares</span>
              <h6>{selectedPerk.NumShares ?? 0}</h6>
            </Box>
            <Box>
              <span>🕖 Times Redeemed</span>
              <h6>{selectedPerk.Redeems ? selectedPerk.Redeems.length : 0}</h6>
            </Box>
          </Box>
          <Divider />
          {!isCreator && (
            <PrimaryButton size="medium" onClick={handleOpenRedeemModal}>
              Redeem
            </PrimaryButton>
          )}
          {!isCreator && (
            <SecondaryButton size="medium" onClick={handleShare}>
              <img src={require("assets/icons/share_dark.png")} alt="share" />
              Share
            </SecondaryButton>
          )}
          {isCreator && (
            <div className={classes.buttons}>
              <SecondaryButton size="medium" onClick={handleOpenCreateBadgeModal}>
                Create Badge
              </SecondaryButton>
              <SecondaryButton size="medium" onClick={handleOpenAddRewardsModal}>
                Add Rewards
              </SecondaryButton>
            </div>
          )}
        </Grid>
      </Grid>
      {!isCreator && (
        <RedeemModal
          perk={selectedPerk}
          open={openRedeemModal}
          handleClose={handleCloseRedeemModal}
          token={token}
        />
      )}
      {isCreator && (
        <AddRewardsModal
          perk={selectedPerk}
          open={openAddRewardsModal}
          handleClose={handleCloseAddRewardsModal}
        />
      )}
      {isCreator && (
        <CreateBadgeModal
          handleRefresh={() => {}}
          open={openCreateBadgeModal}
          onCloseModal={handleCloseCreateBadgeModal}
        />
      )}

      {openError && (
        <AlertMessage
          key={Math.random()}
          message={errorMsg}
          variant="error"
          onClose={handleCloseError}
        />
      )}
    </div>
  );
}
