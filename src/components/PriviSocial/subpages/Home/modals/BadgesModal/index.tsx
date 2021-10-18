import React, { useEffect, useState } from "react";
import { Modal, TabNavigation } from "shared/ui-kit";
import CreateBadgeModal from "../CreateBadgeModal";
import BadgeCard from "./BadgeCard";
import { badgesProfileModalStyles } from "./index.styles";
import { SocialPrimaryButton } from "components/PriviSocial/index.styles";
import Box from "shared/ui-kit/Box";

const filterOptions = ["all", "privi_badges", "super_rare", "rare", "newbie"];

export default function BadgesProfileModal({
  open,
  handleClose,
  badges,
  userProfile,
  handleRefresh,
  ownUser,
}) {
  const classes = badgesProfileModalStyles();

  const [filteredBadges, setFilteredBadges] = useState<any[]>([]);

  const [tabsBadgeValue, setTabsBadgeValue] = useState<number>(0);

  const [openModalCreateBadge, setOpenModalCreateBadge] = useState<boolean>(false);
  const tabsBadge = ["All Badges", "PRIVI", "Super rare", "Rare", "Newbie"];

  const handleOpenModalCreateBadge = () => {
    setOpenModalCreateBadge(true);
  };
  const handleCloseModalCreateBadge = () => {
    setOpenModalCreateBadge(false);
  };

  useEffect(() => {
    if (badges) {
      const newFilteredBadges = badges.filter(badge => {
        return tabsBadgeValue == 0 || (badge.Type && badge.Type == filterOptions[tabsBadgeValue]);
      });
      setFilteredBadges(newFilteredBadges);
    }
  }, [tabsBadgeValue]);

  return (
    <Modal size={"medium"} showCloseIcon isOpen={open} onClose={handleClose} className={classes.root}>
      <Box mt="8px" mb="12px" display="flex" alignItems="center" justifyContent="space-between">
        <h5>{`${ownUser ? "My" : ""} Badges`}</h5>
        <SocialPrimaryButton onClick={handleOpenModalCreateBadge}>Create New</SocialPrimaryButton>
      </Box>

      <Box mb={3}>
        <TabNavigation
          theme="green"
          tabs={tabsBadge}
          currentTab={tabsBadgeValue}
          variant="primary"
          onTabChange={setTabsBadgeValue}
        />

        <CreateBadgeModal
          handleRefresh={handleRefresh}
          open={openModalCreateBadge}
          onCloseModal={handleCloseModalCreateBadge}
        />
      </Box>

      <div className={classes.badgesWrap}>
        {filteredBadges && filteredBadges.length > 0 ? (
          filteredBadges.map((badge, index) => {
            return <BadgeCard item={badge} userProfile={userProfile} />;
          })
        ) : (
          <p style={{ marginTop: 0 }}>No badges to show</p>
        )}
      </div>
    </Modal>
  );
}
