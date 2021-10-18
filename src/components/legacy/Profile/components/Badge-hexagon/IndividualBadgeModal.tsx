import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "store/reducers/Reducer";
import { individualBadgeModalStyles } from "./IndividualBadgeModal.styles";
import {
  GridItem,
  OnlineSpot,
  OwnerWrapper,
  ProfileLabel,
  SocialLabel,
  UserName,
  UserPicture,
} from "../Profile-Modals/Owners";
import URL from "shared/functions/getURL";

import placeholderBadge from "assets/icons/badge.png";

export default function IndividualBadgeModal(props) {
  const classes = individualBadgeModalStyles();
  //store
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);
  //hooks
  const [badgeOwnersList, setBadgeOwnersList] = useState<any>([]);
  const [badgeFriends, setBadgeFriends] = useState<number>(0);

  useEffect(() => {
    if (user && users && users.length > 0 && props.open) {
      axios.get(`${URL()}/social/getTokenInfo/${props.badge.Symbol}`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const data = resp.data;

          const owners = (data && data.Holders) ?? [];
          const newOwners = [] as any;

          if (owners.length > 0) {
            owners.forEach(owner => {
              if (users.some(user => user.id === owner)) {
                const thisUser = users[users.findIndex(user => user.id === owner)];
                newOwners.push({
                  imageURL: thisUser.imageURL,
                  name: thisUser.name,
                  urlSlug: thisUser.urlSlug,
                  level: thisUser.level,
                  verified: thisUser.verified,
                  online: true,
                  //TODO: get user online
                });
              }
            });
          }

          setBadgeOwnersList(newOwners);

          axios.get(`${URL()}/user/getFriends/${user.id}`).then(res => {
            const resp = res.data;
            if (resp.success) {
              const data = resp.data;
              let friends = 0;

              data.friends.forEach(friend => {
                if (owners.includes(friend)) {
                  friends++;
                }
              });

              setBadgeFriends(friends);
            }
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, users, props.open]);

  const handleClose = () => {
    props.handleClose();
  };

  return (
    <Modal open={props.open} onClose={handleClose} className={classes.root}>
      <div className={classes.badgeModalContent}>
        <div className={classes.closeButton} onClick={handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className={classes.badgeModalHeader}>
          <div className={classes.hexagonSection}>
            <img
              className={classes.tokenImage}
              src={(props.badge && props.badge.url) ?? placeholderBadge}
              alt="hexagon"
            />
          </div>
          <div className={classes.badgeTitle}>
            <h2>{props.badge.Name}</h2>
            <div className={classes.badgeTitleType}>{props.badge.Type && props.badge.Type.toUpperCase()}</div>
          </div>
        </div>
        <div className={classes.badgeModalBody}>
          <div className={classes.badgeModalBodyTitle}>
            <h3>About this badge</h3>
            <p>{props.badge.Description}</p>
          </div>

          <div className={classes.badgeModalBodyInfo}>
            <div>
              <span># of badges</span>
              <h5>1</h5>
            </div>
            <div>
              <span>Level</span>
              <h5>1</h5>
            </div>
            <div>
              <span>Friends</span>
              <h5>{badgeFriends}</h5>
            </div>
          </div>

          <div>
            <h3>{`Badge owners (${badgeOwnersList.length})`}</h3>
            <div className={classes.badgeOwnerList}>
              {badgeOwnersList.length > 0 &&
                badgeOwnersList.map((owner, index) => (
                  <GridItem key={`Item - ${index + 1}`} item xs={12} md={6}>
                    <OwnerWrapper>
                      <UserPicture imageUrl={owner.imageURL}>
                        {owner.online ? <OnlineSpot /> : null}
                      </UserPicture>
                      <div>
                        <UserName>{owner.name}</UserName>
                        <div className={classes.socialContent}>
                          <SocialLabel>@{owner.urlSlug}</SocialLabel>
                          {owner.verified ? (
                            <img
                              className="verifiedLabel"
                              src={require("assets/icons/verified_mint.png")}
                              alt={"check"}
                            />
                          ) : null}
                          <ProfileLabel>level {owner.level}</ProfileLabel>
                        </div>
                      </div>
                    </OwnerWrapper>
                  </GridItem>
                ))}
              {badgeOwnersList.length === 0 && <div>No users to show</div>}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
