import { Modal } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getStyledTime } from "shared/functions/getStyledTime";
import IndividualBadgeModal from "../Badges/IndividualBadgeModal";
import { TwitterShareButton, FacebookShareButton } from "react-share";
import "./TaskModal.css";
import {trackPromise} from "react-promise-tracker";
import axios from 'axios';
import URL from "shared/functions/getURL";
import placeholderBadge from 'assets/icons/badge.png';

export default function TaskModal(props) {
  const [ongoing, setOngoing] = useState<boolean>(false);
  const [durationWidth, setDurationWidth] = useState<number>(0);
  const [openBadgeModal, setOpenBadgeModal] = useState<boolean>(false);
  const [badgeObj, setBadgeObj] = useState<any>(null);

  const [photoLoaded, setPhotoLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadBadge();

    //set ongoing
    if (props.task.EndDate) {
      setOngoing(new Date(props.task.EndDate).getTime() > new Date().getTime());
      if (new Date(props.task.EndDate).getTime() > new Date().getTime()) {
        //set duration bar width
        setDurationWidth(
          ((new Date(props.task.EndDate).getTime() - new Date().getTime()) /
            (new Date(props.task.EndDate).getTime() -
              new Date(props.task.StartDate).getTime())) *
            100
        );
      }
    } else setOngoing(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.task]);

  const loadBadge = () => {
    let badgeSymbol = props.task.RewardBadges;

    if (badgeSymbol) {
      trackPromise(
        axios
          .get(`${URL()}/user/badges/getBadgeBySymbol/${badgeSymbol}`)
          .then((res) => {
            const resp = res.data;
            if (resp.success) {
              setBadgeObj(resp.data);
            }
          })
          .catch((error) => {
            console.log(error);
          })
      );
    }
  };

  const handleOpenBadgeModal = () => {
    setOpenBadgeModal(true);
  };
  const handleCloseBadgeModal = () => {
    setOpenBadgeModal(false);
  };

  const setLoadingFailed = (event) => {
    setPhotoLoaded(false);
    event.target.src = placeholderBadge
  }


  if (props.task)
    return (
      <>
        <Modal
          open={props.open}
          onClose={props.handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          className="modal"
        >
          <div className="modal-content w50 task-modal">
            <div className="exit" onClick={props.handleClose}>
              <img
                src={require("assets/icons/x_darkblue.png")}
                alt={"x"}
              />
            </div>
            <div className="task">
              <div className="top">
                <div
                  className={`header ${
                    props.task.Info
                      ? "info"
                      : ongoing
                      ? "ongoing"
                      : props.task.Completed
                      ? "completed"
                      : ""
                  }`}
                >
                  {ongoing ? (
                    <div className="ongoing-sign">ONGOING</div>
                  ) : props.task.Completed ? (
                    <div className="ongoing-sign">COMPLETED</div>
                  ) : null}
                  <div className="row">
                  <div className="share-box">
                    <FacebookShareButton
                      quote={"Check out my new PRIVI Task " + props.task.Title + "\n\n" + props.task.Description + "\n\n"}
                      url={window.location.href}
                      hashtag="PRIVI"
                    >
                      <img
                        src={require('assets/snsIcons/facebook_hexagon.png')}
                        alt={'facebook hexagon'}
                      />
                    </FacebookShareButton>
                    Share on Facebook
                  </div>
                  <div className="share-box">
                  <TwitterShareButton
                    title={"Check out my new PRIVI Task " + props.task.Title + "\n\n" + props.task.Description + "\n\n"}
                    url={window.location.href}
                    hashtags={["PRIVI"]}
                  >
                    <img
                      src={require('assets/snsIcons/twitter_hexagon.png')}
                      alt={'twitter hexagon'}
                    />
                  </TwitterShareButton>
                  Share on Twitter
                </div>
                </div>
                </div>

                {!props.task.Info && props.task.TokenImage ? (
                  <div
                    className="image"
                    style={{
                      backgroundImage: props.task.TokenImage
                        ? `url(${require(`assets/tokenImages/${props.task.TokenImage}.png`)})`
                        : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ) : null}
                <p className="title">{props.task.Title}</p>
                <div className="level">{`LVL ${props.task.Level}`}</div>
                <p className="desc">{props.task.Description}</p>
                <div className="row">
                  <div className="column">
                    <span>Points reward</span>
                    <p>{props.task.RewardPoints}</p>
                  </div>
                  {props.task.RewardBadges &&
                  props.task.RewardBadges.length > 0 ? (
                    <div className="column">
                      <span>Badge reward</span>
                      <div className="badges">
                        {props.task.RewardBadges.map((badge, index) => {
                          return (
                            <div key={index}>
                             
                              <div
                                style={{ cursor: "pointer" }}
                                className="hex"
                                key={`badge-${index}`}
                                onClick={handleOpenBadgeModal}
                              >
                                <img
                                   className="hex"
                                    src={`${URL()}/user/badges/getPhoto/${badge}`}
                                    alt="hexagon-photo"
                                    onLoad={() => setPhotoLoaded(true)}
                                    onError={setLoadingFailed}
                                  />
                              </div>
                        
                              <IndividualBadgeModal
                                badge={badgeObj}
                                open={openBadgeModal}
                                handleClose={handleCloseBadgeModal}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="bottom">
                {ongoing && props.task.EndDate ? (
                  <div className="column">
                    <div className="row">
                      <img
                        src={require("assets/icons/clock_green.png")}
                        alt={"clock"}
                      />
                      <span>
                        {getStyledTime(new Date(), props.task.EndDate, false)}
                      </span>
                    </div>
                    <div className="bar-container">
                      <div
                        className="color-bar"
                        style={{ width: `${durationWidth}%` }}
                      />
                    </div>
                  </div>
                ) : null}

                {props.task.UsersData && props.task.UsersData.length > 0 ? (
                  <div className="users-container">
                    <span>People on this task</span>
                    <div className="users">
                      {props.task.UsersData.map((user, index) => {
                        return (
                          <div className="user" key={`user-${index}`}>
                            <div
                              className="user-image"
                              style={{
                                backgroundImage:
                                  user.userImageURL.length > 0
                                    ? `url(${user.userImageURL})`
                                    : "none",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                            <span>{user.userName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  else return null;
}
