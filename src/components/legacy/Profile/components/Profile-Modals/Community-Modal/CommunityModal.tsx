import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { Modal } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import Template from "../template-modal/Template";
import { communityModalStyles } from "./CommunityModal.styles";

const CommunityModal = props => {
  const classes = communityModalStyles();
  //store
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  //hooks
  const [communityOwnersList, setCommunityOwnersList] = useState<any>([]);
  const [communityCreatorsList, setCommunityCreatorsList] = useState<any>([]);

  //use effect
  useEffect(() => {
    //load owners data
    if (props.community && props.community.CommunityAddress && props.open) {
      const creator = props.community.Creator;
      const newCreators = [] as any;
      const newOwners = [] as any;
      let owners = [] as any;

      if (props.community.tokenData && props.community.tokenData.Holders) {
        owners = props.community.tokenData.Holders;
      } else {
        owners = [];
      }

      if (owners.length > 0) {
        owners.forEach(owner => {
          if (users.some(user => user.id === owner)) {
            const thisUser = users[users.findIndex(user => user.id === owner)];
            newOwners.push({
              imageURL: thisUser.imageURL,
              name: thisUser.name,
              urlSlug: thisUser.urlSlug,
            });
          }
        });
      }

      if (creator.length > 0) {
        if (users.some(user => user.id === creator)) {
          const thisUser = users[users.findIndex(user => user.id === creator)];
          newCreators.push({
            id: thisUser.id,
            imageURL: thisUser.imageURL,
            name: thisUser.name,
            urlSlug: thisUser.urlSlug,
          });
        }
      }

      setCommunityOwnersList(newOwners);
      setCommunityCreatorsList(newCreators);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, users, props.open]);

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  return (
    <Modal open={props.open} onClose={props.handleClose} className={classes.root}>
      <div className={classes.modalContent}>
        <div className={classes.closeButton} onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <Template
          modalType="community"
          community={props.community}
          user={user}
          isSignedIn={isSignedIn}
          communityCreatorsList={communityCreatorsList}
          communityOwnersList={communityOwnersList}
        />
      </div>
    </Modal>
  );
};

export default styled(CommunityModal)`
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
    opacity: 1;
  }
`;
