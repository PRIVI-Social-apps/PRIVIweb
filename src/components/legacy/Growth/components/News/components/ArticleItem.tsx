import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./ArticleItem.css";
import { useTypedSelector } from "../../../../../../store/reducers/Reducer";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as WallPaperSolid } from "assets/icons/newspaper-regular.svg";
import { ReactComponent as UserGraduateSolid } from "assets/icons/user-graduate-solid.svg";

export default function ArticleItem(props) {
  //store
  const users = useTypedSelector((state) => state.usersInfoList);

  //hoooks
  const history = useHistory();
  const [creatorInfo, setCreatorInfo] = useState<any>({
    name: "",
    imageURL: "",
  });
  const [days, setDays] = useState<number>(0);

  useEffect(() => {
    if (props.item.Date) {
      let time = new Date().getTime() - new Date(props.item.Date).getTime();
      setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.item && props.item.Creator) {
      if (props.item.Creator !== "PRIVI") {
        users.forEach((user) => {
          if (user.id === props.item.Creator) {
            setCreatorInfo({ name: user.name, imageURL: user.imageURL });
            return;
          }
        });
      } else {
        let creator = {
          name: "PRIVI",
          imageURL: `${require(`assets/tokenImages/PRIVI.png`)}`,
        };
        setCreatorInfo(creator);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  return (
    <div
      className="article-item cursor-pointer"
      onClick={() => {
        history.push(`/growth/articles/${props.item.Id}`);
      }}
    >
      <div
        className="article-image"
        style={{
          backgroundImage:
            props.item.ImageURL && props.item.ImageURL.length > 0
              ? `url(${props.item.ImageURL})`
              : props.item.Creator === "PRIVI" &&
                props.item.Tutorials &&
                props.item.Tutorials[0].Image
                ? `url(${require(`assets/tutorialImages/${props.item.Tutorials[0].Image}.png`)})`
                : "none",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="right">
        <div className="row">
          <h3>
            {props.item.Title
              ? props.item.Title
              : props.item.Creator === "PRIVI" &&
                props.item.Tutorials &&
                props.item.Tutorials[0].Title
                ? props.item.Tutorials[0].Title
                : ""}
          </h3>
          <span>
            {days > 0 ? `${days} day${days > 1 ? "s" : ""} ago` : "Today"}
          </span>
        </div>
        <div className="row">
          <div className="user">
            <div
              className="user-image"
              style={{
                backgroundImage:
                  creatorInfo.imageURL && creatorInfo.imageURL.length > 0
                    ? `url(${creatorInfo.imageURL})`
                    : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <p>{creatorInfo.name ? creatorInfo.name : ""}</p>
          </div>
          <p>
            {props.item.Creator === "PRIVI" && !props.item.descriptionArray ? (
              <SvgIcon><UserGraduateSolid /></SvgIcon>
            ) : (
              <SvgIcon><WallPaperSolid /></SvgIcon>
            )}
            {props.item.Creator === "PRIVI" && !props.item.descriptionArray
              ? "Tutorial"
              : "News"}
          </p>
        </div>
      </div>
    </div>
  );
}
