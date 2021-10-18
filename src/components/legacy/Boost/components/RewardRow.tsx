import React from "react";

type RewardRowProps = {
  reward: any;
  foundUser: any;
};

export default function RewardRow({ reward, foundUser }: RewardRowProps) {
  return (
    <div className="reward-row">
      <div className="row">
        <div
          className="image"
          style={{
            backgroundImage: foundUser ? `url(${reward.imageURL})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {`${reward.name} just won ${reward.points} points`}
      </div>
      <img src={require("assets/icons/points_green.png")} alt="star badge" title={reward.reason} />
    </div>
  );
}
