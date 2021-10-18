import React from "react";
import placeholderBadge from "assets/icons/badge.png";
import URL from "shared/functions/getURL";

type RewardBadgeProps = {
  badge: string;
};

export default function RewardBadge({ badge }: RewardBadgeProps) {
  const setLoadingFailed = (event) => {
    event.target.src = placeholderBadge;
  };

  return (
    <div
      style={{ cursor: "pointer" }}
      className="hex"
    >
      <img
        className="hex"
        src={`${URL()}/user/badges/getPhoto/${badge}`}
        alt="hexagon content"
        onError={setLoadingFailed}
      />
    </div>
  );
}
