import { Modal } from '@material-ui/core';
import React from 'react';
import { useSelector } from "react-redux";
import { TwitterShareButton, FacebookShareButton } from "react-share";
import './PrizeModals.css';
import axios from "axios";
import URL from "shared/functions/getURL";
import { RootState } from "store/reducers/Reducer";

export default function LevelUpModal(props) {

  const user = useSelector((state: RootState) => state.user);

  const handleClose = () =>{
    
    let body={
      isLevelUp: false,
      userId: user.id
    }

    axios
    .post(`${URL()}/user/updateNewLevel`, body)
    .then((response) => {
      props.handleClose();
    })
    .catch((error) => {
      props.handleClose();
      console.log(error);
    });
  }

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className={'modal-content w50 prize-modal'}>
        <div className="exit" onClick={handleClose}>
          <img
            src={require('assets/icons/x_darkblue.png')}
            alt={'x'}
          />
        </div>
        <div className="hex-result">
          <h1>{props.level}</h1>
        </div>
        <h2>Congratulations</h2>
        <span>You managed to gain a level up</span>
        <button onClick={handleClose}>Proceed</button>
        <div className="row">
        <div className="share-box">
          <FacebookShareButton
              quote={"Check out my new PRIVI Level " + props.level + "\n\n"}
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
              title={"Check out my new PRIVI Level " + props.level + "\n\n"}
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
    </Modal>
  );
}
