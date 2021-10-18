import React from "react";

type TopUserProps = {
  index: number,
  user: any
};

export default function TopUser({index, user}: TopUserProps) {
  return (
    <div className="top-user">
      <div className="bubble">
        <div
          className="image"
          style={{
            backgroundImage: user.imageURL.length > 0 ? `url(${user.imageURL})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="number">{index + 1}</div>
      </div>
      <div className="column">
        <p>{user.name.length ? user.name : ""}</p>
        <span>{user.points}</span>
      </div>
    </div>
  );
}
