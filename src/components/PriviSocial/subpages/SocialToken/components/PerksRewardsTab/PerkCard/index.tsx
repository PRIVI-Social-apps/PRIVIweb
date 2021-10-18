import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Gradient, SecondaryButton, PrimaryButton } from "shared/ui-kit";
import SocialTokenContext from "components/PriviSocial/subpages/SocialToken/context";
import RedeemModal from "components/PriviSocial/subpages/SocialToken/modals/RedeemModal";
import AddRewardsModal from "components/PriviSocial/subpages/SocialToken/modals/AddRewardsModal";
import CreateBadgeModal from "components/PriviSocial/subpages/SocialToken/modals/Create-badge/CreateBadgeModal";
import Box from "shared/ui-kit/Box";

export const useStyles = makeStyles(theme => ({
  card: {
    position: "relative",
    background: "#FFFFFF",
    width: "100%",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    "& h4": {
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "24px",
      lineHeight: "30px",
      color: "#707582",
      margin: 0,
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      width: "50%",
      overflow: "hidden",
    },
    "& h6": {
      fontWeight: 800,
      fontSize: "20px",
      color: "#707582",
      lineHeight: 1.3,
      margin: 0,
    },
    "& span": {
      fontSize: "14px !important",
      lineHeight: "18px",
      marginBottom: "4px",
    },
    "& button": {
      margin: "0px !important",
      background: '#707582',
      borderRadius: '6px',
      color: '#FFFFFF',
      fontSize: '14px',
      fontWeight: 800,
      height: '32px',
      lineHeight: '32px'
    },
  },
  trendingLabel: {
    position: "absolute",
    top: 16,
    left: 16,
    color: "#181818",
    fontSize: "14.5px",
    lineHeight: "16px",
    fontWeight: 800,
    background: Gradient.Green,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: "36px",
    padding: "7px 14px",
  },
  header: {
    borderTopLeftRadius: "24px",
    borderTopRightRadius: "24px",
    height: "269px",
    width: "100%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  content: {
    width: "100%",
    padding: "24px 16px",
  },
  redeemInfo: {
    fontSize: "16px !important",
    lineHeight: 1.3,
    fontWeight: 800,
    margin: "0px !important",
  },
  redeemTotal: {
    fontSize: "16px !important",
    lineHeight: 1.3,
    fontWeight: 800,
    margin: "0px !important",
  },
}));

export default function PerkCard({ perk, token, isCreator }) {
  const classes = useStyles();

  const { setSelectedPerk } = useContext(SocialTokenContext);

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

  const handleLearnMore = () => {
    setSelectedPerk({ ...perk, Token: token });
  };

  return (
    <div className={classes.card}>
      <div
        className={classes.header}
        style={{ backgroundImage: perk.ImageURL && perk.ImageURL !== "" ? `url(${perk.ImageURL})` : "none" }}
      />
      {perk.Trending && <div className={classes.trendingLabel}>🔥 Trending Perk</div>}
      <div className={classes.content}>
        <Box display="flex" width="100%" justifyContent="space-between" alignItems="center" marginBottom={3}>
          <h4>{perk.Title ?? "Perk Title"}</h4>
          <Box display="flex" alignItems="center">
            <span className={classes.redeemInfo}>3 Redeemed / </span>
            <span className={classes.redeemTotal}>15</span>
          </Box>
        </Box>
        <Box display="flex" width="100%" justifyContent="space-between">
          <div>
            <span>🤑 Redeem cost</span>
            <h6>{`${token ?? ""} ${perk.Cost ?? "N/A"}`}</h6>
          </div>
          <div>
            <span>🚀 Shares</span>
            <h6>{perk.NumShares ?? 0}</h6>
          </div>
          <div>
            <span>⏰ Ends on</span>
            <h6>
              {perk.EndDate &&
                `${
                  new Date(perk.EndDate).getDate() < 10
                    ? `0${new Date(perk.EndDate).getDate()}`
                    : new Date(perk.EndDate).getDate()
                }.
              ${
                new Date(perk.EndDate).getMonth() + 1 < 10
                  ? `0${new Date(perk.EndDate).getMonth() + 1}`
                  : new Date(perk.EndDate).getMonth() + 1
              }.
              ${new Date(perk.EndDate).getFullYear()}`}
            </h6>
          </div>
        </Box>
        <Box display="flex" width="100%" justifyContent="space-between" marginTop={2}>
          {!isCreator ? (
            <PrimaryButton size="medium" onClick={handleOpenRedeemModal}>
              Redeem
            </PrimaryButton>
          ) : (
            <SecondaryButton size="medium" onClick={handleOpenCreateBadgeModal}>
              Create Badge
            </SecondaryButton>
          )}
          {!isCreator ? (
            <SecondaryButton size="medium" onClick={handleLearnMore}>
              Learn More
            </SecondaryButton>
          ) : (
            <SecondaryButton size="medium" onClick={handleOpenAddRewardsModal}>
              Add Rewards
            </SecondaryButton>
          )}
        </Box>
        {!isCreator && (
          <RedeemModal
            perk={perk}
            open={openRedeemModal}
            handleClose={handleCloseRedeemModal}
            token={token}
          />
        )}
        {isCreator && (
          <AddRewardsModal perk={perk} open={openAddRewardsModal} handleClose={handleCloseAddRewardsModal} />
        )}
        {isCreator && (
          <CreateBadgeModal
            handleRefresh={() => {}}
            open={openCreateBadgeModal}
            onCloseModal={handleCloseCreateBadgeModal}
          />
        )}
      </div>
    </div>
  );
}
