import React, { useEffect, useState } from "react";
import "./ProfileCard.css";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ArrowForwardIcon } from "assets/icons/long-arrow-alt-right-solid.svg"

const heartempty = require("assets/icons/heart.png");

const ProfileCardETH = React.memo((props: any) => {
  const [creatorInfo, setCreatorInfo] = useState<any>({});
  const users = useSelector((state: RootState) => state.usersInfoList);
  const loggedUser = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (users && loggedUser) {
      const newCreatorInfo: any = {};
      if (users.some((user) => user.id === loggedUser.id)) {
        newCreatorInfo.name =
          users[users.findIndex((user) => user.id === loggedUser.id)].name;
        newCreatorInfo.imageUrl =
          users[users.findIndex((user) => user.id === loggedUser.id)].imageURL;
      } else if (props.item.Creator === "PRIVI") {
        newCreatorInfo.name = "PRIVI";
        newCreatorInfo.imageUrl = require("assets/logos/PRIVILOGO.png");
      }
      setCreatorInfo(newCreatorInfo);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, loggedUser]);

  return (
    <div className="profile-card">
      {props.type === "Social Token" ? (
        <div
          className="card-image"
          style={{
            cursor: props.type !== "Media" ? "pointer" : "auto",
          }}
          onClick={() => { }}
        >
          <div
            className={"token-image"}
            style={{
              backgroundImage: `url(${props.item.ImageUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
      ) : (
        <img
          className="card-img"
          src={props.item.ImageUrl}
          style={{ cursor: props.type !== "Media" ? "pointer" : "auto" }}
          alt={"card"}
        />
      )}
      <div className="tags">
        <div>Chain: Ethereum</div>
        <div>
          <div
            onClick={() => { }}
            style={{
              fontSize: 12,
              padding: "5px 9px",
              backgroundColor: "rgb(101 110 126 / 24%)",
              cursor: "pointer",
              marginRight: 9,
              color: "black",
            }}
          >
            <img
              style={{ height: 18, verticalAlign: "middle" }}
              src={heartempty}
              alt={"heart"}
            ></img>
            0 Likes
          </div>
          {props.type === `Social Token` || props.type === "Community" ? (
            <div>{props.type}</div>
          ) : null}
        </div>
      </div>

      <p>{props.item.TokenName}</p>
      <div>
        <div className="info" onClick={() => { }}>
          <span>
            {props.userProfile.currency === "EUR"
              ? "€"
              : props.userProfile.currency === "USD"
                ? "$"
                : "£"}
            {` 0`}
          </span>
          <div>
            <div className="right">
              <span>24h change</span>
              <span
                className="change"
                style={{
                  backgroundColor:
                    props.item.DailyChange > 0
                      ? "#64c89e"
                      : props.item.DailyChange < 0
                        ? "#c76b64"
                        : "auto",
                }}
              >
                {props.item.DailyChange > 0 ? (
                  <div style={{ transform: 'rotate(-45deg)' }}><ArrowForwardIcon /></div>
                ) : props.item.DailyChange < 0 ? (
                  <div style={{ transform: 'rotate(45deg)' }}><ArrowForwardIcon /></div>
                ) : (
                  ""
                )}
                {props.item.DailyChange > 0 ? ` +` : ` `}
                <p>
                  {props.item.DailyChange !== undefined
                    ? props.item.DailyChange.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })
                    : null}
                </p>
                {"%"}
              </span>
            </div>
          </div>
        </div>
        <div
          className="user"
          style={{
            cursor:
              props.type !== "Social Token" && props.type !== "Media"
                ? "pointer"
                : "auto",
          }}
        >
          <div
            className="user-image"
            style={{
              backgroundImage:
                creatorInfo.imageUrl && creatorInfo.imageUrl.length > 0
                  ? `url(${creatorInfo.imageUrl})`
                  : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <span>{creatorInfo.name}</span>
        </div>
      </div>
    </div>
  );
});

export default ProfileCardETH;
