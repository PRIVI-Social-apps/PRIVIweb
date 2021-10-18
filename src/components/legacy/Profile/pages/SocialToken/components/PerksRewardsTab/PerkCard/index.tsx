import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Gradient, SecondaryButton, PrimaryButton } from "shared/ui-kit";
import SocialTokenContext from "components/legacy/Profile/pages/SocialToken/context";
import RedeemModal from "components/legacy/Profile/pages/SocialToken/modals/RedeemModal";
import AddRewardsModal from "components/legacy/Profile/pages/SocialToken/modals/AddRewardsModal";
import CreateBadgeModal from "components/legacy/Profile/modals/Create-badge/CreateBadgeModal";
import Box from 'shared/ui-kit/Box';

export const useStyles = makeStyles(theme => ({
  card: {
    position: "relative",
    background: "#FFFFFF",
    width: "100%",
    boxShadow: " 0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    "& h4": {
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "18px",
      color: "#181818",
      margin: "0px 0px 17px",
    },
    "& h6": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "22px",
      color: "#181818",
      margin: 0,
    },
    "& span": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      color: "#707582",
      marginBottom: "9px",
    },
    "& button": {
      margin: "0px !important",
    },
  },
  trendingLabel: {
    position: "absolute",
    top: 22,
    left: 22,
    color: "#FFFFFF",
    fontSize: "14.5px",
    background: Gradient.Magenta,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: "36px",
    padding: "7px 14px 6px",
  },
  header: {
    borderTopLeftRadius: "14px",
    borderTopRightRadius: "14px",
    height: "145px",
    width: "100%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  content: {
    width: "100%",
    padding: "22px 22px 25px",
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
        <h4>{perk.Title ?? "Perk Title"}</h4>
        <div>
          <span>🏆 Rewards</span>
          <h6>{`${token ?? ""} ${perk.Cost ?? "N/A"}`}</h6>
        </div>
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
            <span>⏰ Ends</span>
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
        <Box display="flex" width="100%" justifyContent="space-between" marginTop="15px">
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
