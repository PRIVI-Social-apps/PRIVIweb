import "./ProjectCard.css";
import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedUser } from "store/actions/SelectedUser";
import { CheckCircle } from "shared/ui-kit/Icons";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";

const User = React.memo((props: any) => {
  const { reacted, handleUpVote, handleReact } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  return (
    <div className={props.className}>
      <div
        className="row cursor-pointer"
        onClick={() => {
          if (props.project.Creator) {
            history.push(`/profile/${props.project.Creator}`);
            dispatch(setSelectedUser(props.project.Creator));
          }
        }}
      >
        <div className="image-wrapper">
          <div
            className="user-image"
            style={{
              backgroundImage:
                props.project.userImageURL && props.project.userImageURL.length > 0
                  ? `url(${props.project.userImageURL})`
                  : `url(${getRandomAvatar()})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
            }}
          />
          <div className="online-indicator" />
        </div>

        <div className="info-block">
          <h4>{props.project.userName}</h4>
          <div className="info-wrapper">
            <p>@{props.project.userSlug}</p>
            {/*<CheckCircle />
            <div className="level-icon">
              <span>level 1</span>
            </div>*/}
          </div>
        </div>
      </div>
    </div>
  );
});

export default styled(User)`
  margin: 0;
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .info-block {
    font-family: Agrandir;
    h4 {
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 23px;
      text-align: left;
      margin: 0;
    }
    .info-wrapper {
      display: flex;
      flex-direction: row;
      font-size: 14px;
      margin: 4.25px 0 0;
      p {
        margin: 0;
        font-weight: 700;
        line-height: 15px;
        background: linear-gradient(97.4deg, #ff79d1 14.43%, #db00ff 79.45%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      svg {
        margin-left: 2.5px;
        font-weight: 200;
      }
      .level-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 2.5px;
        color: #99a1b3;
        font-size: 11px;
        text-align: center;
        width: 52px;
        height: 16px;
        border: 1px solid #99a1b3;
        box-sizing: border-box;
        border-radius: 38.6667px;
        padding-top: 2px;
      }
    }
  }
  .image-wrapper {
    position: relative;
    margin: 10px;

    .online-indicator {
      position: absolute;
      background: linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%);
      border: 2px solid #ffffff;
      border-radius: 50%;
      z-index: 10;
      bottom: 0;
      right: 0px;
      width: 14.5px;
      height: 14.5px;
    }
  }
  .user-image {
    border: 2px solid #ffffff;
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
`;
