import React, { useState, useEffect } from "react";
import { Modal } from "@material-ui/core";
import axios from "axios";
import URL from "shared/functions/getURL";
import "./CreateSocialTokenCommunity.css";

import CreateSocialTokenTab from "./components/createSocialTokenTab";
import CreateCommunityTab from "./components/createCommunityTab";

// ---------------------------------------------------
const infoIcon = require("assets/icons/info_icon.png");

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.open == currProps.open;
};
const CreateSocialTokenCommunity = React.memo((props: any) => {
  const [tokenObjList, setTokenObjList] = useState<any[]>([]);
  const [socialTokenOrCommunity, setSocialTokenOrCommunity] = useState<boolean>(
    true
  );

  // get token list from backend
  useEffect(() => {
    if (props.open === true) {
      axios.get(`${URL()}/wallet/getCryptosRateAsList`).then((res) => {
        const resp = res.data;
        if (resp.success) {
          const tokenObjList: any[] = [];
          const data = resp.data;
          data.forEach((rateObj) => {
            tokenObjList.push({ token: rateObj.token, name: rateObj.name });
          });
          setTokenObjList(tokenObjList);
        }
      });
    }
  }, [props.open]);

  //MODAL
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal modalCreateModal"
    >
      <div className="modal-content create-social-token-modal create-community-modal modalCreatePodFullDiv modalCreatePadding">
        <div className="exit" onClick={props.handleClose}>
          <img
            src={require("assets/icons/x_darkblue.png")}
            alt={"x"}
          />
        </div>

        <div className="cards-options">
          <button
            className={socialTokenOrCommunity ? "selected" : "unselected"}
            onClick={() => setSocialTokenOrCommunity(true)}
          >
            Social Token
            <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
          </button>
          <button
            className={!socialTokenOrCommunity ? "selected" : "unselected"}
            onClick={() => setSocialTokenOrCommunity(false)}
          >
            Community
            <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
          </button>
        </div>

        <h2>{`Create ${
          socialTokenOrCommunity ? "Social token" : "Community"
        }`}</h2>

        {socialTokenOrCommunity ? (
          <CreateSocialTokenTab
            tokenObjList={tokenObjList}
            handleRefresh={props.handleRefresh}
            handleClose={props.handleClose}
          />
        ) : (
          <CreateCommunityTab
            tokenObjList={tokenObjList}
            handleRefresh={props.handleRefresh}
            handleClose={props.handleClose}
          />
        )}
      </div>
    </Modal>
  );
}, arePropsEqual);

export default CreateSocialTokenCommunity;
