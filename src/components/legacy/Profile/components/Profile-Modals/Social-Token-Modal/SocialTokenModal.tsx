import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import Modal from "@material-ui/core/Modal";

import URL from "shared/functions/getURL";
import { sumTotalViews } from "shared/functions/totalViews";
import { RootState } from "store/reducers/Reducer";
import Template from "../template-modal/Template";
import { socialTokenModalStyles } from "./SocialTokenModal.styles";

const SocialTokenModal = (props: any) => {
  const history = useHistory();
  const classes = socialTokenModalStyles();

  //store
  const users = useSelector((state: RootState) => state.usersInfoList);
  const user = useSelector((state: RootState) => state.user);
  //hooks
  const [socialToken, setSocialToken] = useState<any>({});
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, [users, props.socialToken, props.open]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const loadData = () => {
    if (props.socialToken && props.open) {
      let url = window.location.href.split("/");
      let username = url[5];
      let tokenHash = url[6];
      let tokenSymbol = url[7];

      if (!tokenHash || !tokenSymbol) {
        history.push("/profile/" + username + "/token/" + props.socialToken.TokenSymbol);
      }

      //load token data
      axios.get(`${URL()}/social/getSocialToken/${props.socialToken.TokenSymbol}`).then(res => {
        const resp = res.data;
        if (resp.success) {
          sumTotalViews(props.socialToken);

          const newSocialToken = resp.data;
          const holdersInfo = newSocialToken.HoldersInfo ?? [];
          const newOwners: any[] = [];

          if (holdersInfo.length > 0) {
            holdersInfo.forEach(holderInfo => {
              const foundUser = users.find(u => u.address == holderInfo.Address);
              if (foundUser) {
                newOwners.push({
                  imageURL: foundUser.imageUrl,
                  name: foundUser.name,
                  urlSlug: foundUser.urlSlug,
                  verified: foundUser.verified,
                  level: foundUser.level,
                  online: true,
                });
              }
            });
          }
          newSocialToken.owners = newOwners;
          setSocialToken(newSocialToken);
        }
      });
    }
  };

  const handleClose = () => {
    let url = window.location.href.split("/");
    let username = url[5];
    let tokenHash = url[6];
    let tokenSymbol = url[7];

    if (tokenHash === "token" && tokenSymbol) {
      history.push("/profile/" + username);
    }

    props.handleClose();
  };

  if (socialToken && Object.keys(socialToken).length !== 0 && socialToken.constructor === Object) {
    return (
      <Modal open={props.open} onClose={handleClose} className={classes.root}>
        <div className={classes.socialModalContent}>
          <div className={classes.closeButton} onClick={handleClose}>
            <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
          </div>
          <Template
            modalType="socialToken"
            socialToken={socialToken}
            user={user}
            openModal={openModal}
            handleOpenModal={handleOpenModal}
            handleCloseModal={handleCloseModal}
            handleRefresh={loadData}
          />
        </div>
      </Modal>
    );
  } else {
    return null;
  }
};

export default styled(SocialTokenModal)`
  .modal {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-content {
    padding: 35px 35px 35px 35px;
    position: relative;
    z-index: 2;
    height: 100%;
    min-width: 380px;
    width: 768px;
    background: #ffffff;
    transition: all 0.25s ease;
    overflow-y: auto;
    scrollbar-width: none;
    max-height: calc(100vh - 150px - 20px);
    display: flex;
    flex-direction: column;
    margin-top: -35px;
    opacity: 1;
  }
`;
