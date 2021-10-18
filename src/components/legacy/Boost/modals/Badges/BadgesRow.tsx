import React, { useState } from "react";
import IndividualBadgeModal from "./IndividualBadgeModal";

type BadgeRowProps = {
  badge: any;
};

export default function BadgeRow({ badge }: BadgeRowProps) {
  const [openBadgeModal, setOpenBadgeModal] = useState<boolean>(false);
  const handleOpenBadgeModal = () => {
    setOpenBadgeModal(true);
  };
  const handleCloseBadgeModal = () => {
    setOpenBadgeModal(false);
  };

  return (
    <div>
      <div className="badge-row clickable" onClick={handleOpenBadgeModal}>
        <div className="left">
          <img className="hex" src={badge.Url ? `${badge.Url}?${Date.now()}` : "none"} alt="hexagon" />
          <span>{badge.Name}</span>
        </div>
        <span>{`Level ${badge.Level ?? 1}`}</span>
      </div>
      <IndividualBadgeModal badge={badge} open={openBadgeModal} handleClose={handleCloseBadgeModal} />
    </div>
  );
}
