import React from "react";

type OwnerRowProps = {
  user: any;
};

export default function OwnerRow({ user }: OwnerRowProps) {
  return (
    <div className="user-row">
      <div
        className="user-image"
        style={{
          backgroundImage: user.imageURL && user.imageURL.length > 0 ? `url(${user.imageURL})` : "none",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <span>{user.name}</span>
    </div>
  );
}
