import { Modal } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./PrizeModals.css";
import URL from "shared/functions/getURL";
import { TwitterShareButton, FacebookShareButton } from "react-share";
import placeholderBadge from "assets/icons/badge.png";
import axios from "axios";
import { RootState } from "store/reducers/Reducer";

export default function NewBadgeModal(props) {
  const [badge, setBadge] = useState<any>(null);
  const [photoLoaded, setPhotoLoaded] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    loadBadge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLoadingFailed = (event) => {
    setPhotoLoaded(false);
    event.target.src = placeholderBadge;
  };

  const handleClose = () => {
    let body = {
      badgeId: badge.Symbol,
      userId: user.id,
    };

    axios
      .post(`${URL()}/user/updateNewBadge`, body)
      .then((response) => {
        props.handleClose();
      })
      .catch((error) => {
        props.handleClose();
        console.log(error);
      });
  };

  const loadBadge = () => {
    let badge = props.badge;

    // if(badge){
    //   let badgeSymbol = badge.Symbol;
    //   trackPromise(
    //     axios
    //     .get(`${URL()}/user/badges/getBadgeBySymbol/${badgeSymbol}`)
    //     .then((res) => {
    //       const resp = res.data;
    //       if (resp.success) {
    setBadge(badge);
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     })
    //   );
    // }
  };

  if (badge && badge.Symbol) {
    return (
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className="modal"
      >
        <div className={"modal-content w50 prize-modal"}>
          <div className="exit" onClick={handleClose}>
            <img
              src={require("assets/icons/x_darkblue.png")}
              alt={"x"}
            />
          </div>
          <img
            className="hex"
            src={`${badge.Url}?${Date.now()}`}
            alt="hexagon-content"
            onLoad={() => setPhotoLoaded(true)}
            onError={setLoadingFailed}
          />
          <h2>Congratulations</h2>
          <span>You’ve collected a new badge!</span>
          <span>{badge.Symbol}</span>
          <span>{badge.Description}</span>
          <button onClick={handleClose}>Proceed</button>
          <div className="row">
            <div className="share-box">
              <FacebookShareButton
                quote={
                  "Check out my new PRIVI Badge!" +
                  "\n\n" +
                  badge.Name +
                  "\n" +
                  badge.Description +
                  "\n\n"
                }
                url={window.location.href}
                hashtag="PRIVI"
              >
                <img
                  src={require("assets/snsIcons/facebook_hexagon.png")}
                  alt={"facebook hexagon"}
                />
              </FacebookShareButton>
              Share on Facebook
            </div>
            <div className="share-box">
              <TwitterShareButton
                title={
                  "Check out my new PRIVI Badge!" +
                  "\n\n" +
                  badge.Name +
                  "\n" +
                  badge.Description +
                  "\n\n"
                }
                url={window.location.href}
                hashtags={["PRIVI"]}
              >
                <img
                  src={require("assets/snsIcons/twitter_hexagon.png")}
                  alt={"twitter hexagon"}
                />
              </TwitterShareButton>
              Share on Twitter
            </div>
          </div>
        </div>
      </Modal>
    );
  } else {
    return null;
  }
}
