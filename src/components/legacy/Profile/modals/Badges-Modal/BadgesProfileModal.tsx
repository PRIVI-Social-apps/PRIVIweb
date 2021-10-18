import React, { useEffect, useState } from "react";
import { TabNavigation } from "shared/ui-kit";
import { Modal } from "@material-ui/core";
import CreateBadgeModal from "../Create-badge/CreateBadgeModal";
import BadgeCard from "./BadgeCard";
import { badgesProfileModalStyles } from "./BadgesProfileModal.styles";
import { PrimaryButton } from "shared/ui-kit";

const filterOptions = ["all", "privi_badges", "super_rare", "rare", "newbie"];

export default function BadgesProfileModal(props) {
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
    if (props.open && props.badges) {
      const newFilteredBadges = props.badges.filter(badge => {
        return tabsBadgeValue == 0 || (badge.Type && badge.Type == filterOptions[tabsBadgeValue]);
      });
      setFilteredBadges(newFilteredBadges);
    }
  }, [props.open, props.badges, tabsBadgeValue]);

  return (
    <Modal open={props.open} onClose={props.handleClose} className={classes.root}>
      <div className={classes.badgeModalContent}>
        <div className={classes.closeButton} onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>

        <div className={classes.flexDisplayStartCenter}>
          <h3>{`${props.ownUser ? "My" : ""} Badges`}</h3>
          <PrimaryButton size="medium" onClick={handleOpenModalCreateBadge}>Create New</PrimaryButton>
        </div>

        <div className={classes.appbar}>
          <TabNavigation
            tabs={tabsBadge}
            currentTab={tabsBadgeValue}
            variant="primary"
            onTabChange={setTabsBadgeValue}
          />

          <CreateBadgeModal
            handleRefresh={props.handleRefresh}
            open={openModalCreateBadge}
            onCloseModal={handleCloseModalCreateBadge}
          />
        </div>

        <div className={classes.badgesWrap}>
          {filteredBadges && filteredBadges.length > 0 ? (
            filteredBadges.map((badge, index) => {
              return <BadgeCard item={badge} userProfile={props.userProfile} />;
            })
          ) : (
            <p style={{ marginTop: 0 }}>No badges to show</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
