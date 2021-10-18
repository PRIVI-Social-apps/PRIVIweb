import { Modal } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import "./IndividualBadgeModal.css";
import URL from "shared/functions/getURL";
import { TwitterShareButton, FacebookShareButton } from "react-share";
import placeholderBadge from "assets/icons/badge.png";

export default function IndividualBadgeModal(props) {
  //store
  const users = useSelector((state: RootState) => state.usersInfoList);

  //hooks
  const [badgeOwnersList, setBadgeOwnersList] = useState<any>([]);

  const [photoLoaded, setPhotoLoaded] = useState<boolean>(false);
  //use effect
  useEffect(() => {
    const owners = [] as any;

    //TODO: load real data
    // users.forEach((u) => {
    //   props.badge.owners.forEach((owner) => {
    //     if (u.id === owner) {
    //       owners.push({
    //        name: u.name,
    //         imageURL: u.imageURL,
    //     }); //add to owners list
    //     }
    //   });
    // });

    setBadgeOwnersList(owners); //filtered list is global list by default
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //functions

  const setLoadingFailed = event => {
    setPhotoLoaded(false);
    event.target.src = placeholderBadge;
  };

  //page components
  const OwnerRow = props => {
    return (
      <div className="user-row">
        <div
          className="user-image"
          style={{
            backgroundImage: props.user.imageURL.length > 0 ? `url(${props.user.imageURL})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <span>{props.user.name}</span>
      </div>
    );
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-content badge-modal">
        <div className="left">
          <div>
            <img
              className="hex"
              src={props.badge.url}
              alt="hexagon-photo"
              onLoad={() => setPhotoLoaded(true)}
              onError={setLoadingFailed}
            />
          </div>
          <div className="share-buttons">
            <div className="share-box">
              <FacebookShareButton
                quote={
                  "Check out my new PRIVI Badge!" +
                  "\n\n" +
                  props.badge.Name +
                  "\n" +
                  props.badge.Description +
                  "\n\n"
                }
                url={window.location.href}
                hashtag="PRIVI"
              >
                <img src={require("assets/snsIcons/facebook_hexagon.png")} alt={"facebook hexagon"} />
              </FacebookShareButton>
              Share on Facebook
            </div>
            <div className="share-box">
              <TwitterShareButton
                title={
                  "Check out my new PRIVI Badge!" +
                  "\n\n" +
                  props.badge.Name +
                  "\n" +
                  props.badge.Description +
                  "\n\n"
                }
                url={window.location.href}
                hashtags={["PRIVI"]}
              >
                <img src={require("assets/snsIcons/twitter_hexagon.png")} alt={"twitter hexagon"} />
              </TwitterShareButton>
              Share on Twitter
            </div>
          </div>
        </div>
        <div className="right">
          <div className="exit" onClick={props.handleClose}>
            <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
          </div>
          <div className="header">
            <h2>{props.badge.Name}</h2>
            {/* <div className="level">{`LVL ${props.badge.level}`}</div> */}
          </div>
          <div className="type">{props.badge.Type && props.badge.Type.toUpperCase()}</div>
          <div className="fake-appbar">
            <p>About this badge</p>
          </div>
          <p>{props.badge.Description}</p>
          <div className="row">
            <div className="column">
              <span># of badges</span>
              <h5>1</h5>
            </div>
            <div className="column">
              <span>Level</span>
              <h5>1</h5>
            </div>
            <div className="column">
              <span>Friends</span>
              <h5>{}</h5>
            </div>
          </div>
          <div className="fake-appbar">
            <p>{`Badge owners (${badgeOwnersList.length})`}</p>
          </div>
          <div className="users-list">
            {badgeOwnersList.length > 0 ? (
              badgeOwnersList.map((user, index) => {
                return <OwnerRow user={user} key={`badge-owner-${index}`} />;
              })
            ) : (
              <div>No users to show</div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
