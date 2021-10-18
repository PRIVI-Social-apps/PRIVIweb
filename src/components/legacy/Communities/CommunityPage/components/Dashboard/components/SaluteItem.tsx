import React from "react";

export default function SaluteItem(props) {
  if (props.item)
    return (
      <div className={"salute"}>
        <div
          className="user-image"
          style={{
            backgroundImage:
              props.item.userData &&
              props.item.userData.imageURL &&
              props.item.userData.imageURL.length > 0
                ? `url(${props.item.userData.imageURL})`
                : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "30px",
          }}
        />
        <div className="badge-image">
          <div
            className="badge"
            style={{
              backgroundImage: `url(${require("assets/icons/star_outline_white.png")})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
        <p>{`${
          props.item.userData && props.item.userData.name
            ? props.item.userData.name
            : ""
        } ${props.item.Action}`}</p>
      </div>
    );
  else return null;
}
