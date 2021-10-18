import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "store/reducers/Reducer";
import { individualBadgeModalStyles } from "./index.styles";
import { GridItem, OnlineSpot, OwnerWrapper, ProfileLabel, UserName, UserPicture } from "./Owners";
import URL from "shared/functions/getURL";

import placeholderBadge from "assets/icons/badge.png";
import { Modal } from "shared/ui-kit";
import { Box } from "@material-ui/core";
import { GreenText } from "components/PriviSocial/index.styles";

export default function IndividualBadgeModal({ badge, open, handleClose }) {
  const classes = individualBadgeModalStyles();
  //store
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);
  //hooks
  const [badgeOwnersList, setBadgeOwnersList] = useState<any>([]);
  const [badgeFriends, setBadgeFriends] = useState<number>(0);

  useEffect(() => {
    if (user && users && users.length > 0) {
      if (!badge.tokenData) {
        axios.get(`${URL()}/social/getTokenInfo/${badge.Symbol}`).then(res => {
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
      } else {
        const owners = badge.tokenData.Holders ?? [];
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, users]);

  return (
    <Modal size="medium" showCloseIcon isOpen={open} onClose={handleClose} className={classes.root}>
      <Box display="flex" alignItems="center" mb={3}>
        <div className={classes.hexagonSection}>
          <img className={classes.tokenImage} src={(badge && badge.url) ?? placeholderBadge} alt="hexagon" />
        </div>
        <Box display="flex" alignItems="center" margin={"0 0 0 8px"}>
          <h5>{badge.Name}</h5>
          <div className={classes.badgeTitleType}>{badge.Type && badge.Type.toUpperCase()}</div>
        </Box>
      </Box>

      <Box mb={5}>
        <h3>About this badge</h3>
        <p>{badge.Description}</p>
      </Box>

      <Box display="flex" alignItems="center" mb={5}>
        <Box mr={"64px"}>
          <Box># of badges</Box>
          <Box mt={1} fontSize="18px">
            {badge.numberOfBadges ?? 0}
          </Box>
        </Box>
        <Box mr={"64px"}>
          <Box>Level</Box>
          <Box mt={1} fontSize="18px">
            {badge.level ?? 0}
          </Box>
        </Box>
        <Box mr={"64px"}>
          <Box>Friends</Box>
          <Box mt={1} fontSize="18px">
            {badgeFriends}
          </Box>
        </Box>
      </Box>

      <h4>{`Badge owners (${badgeOwnersList.length})`}</h4>

      <Box display="flex" mt={2} flexWrap="wrap">
        {badgeOwnersList.length > 0 &&
          badgeOwnersList.map((owner, index) => (
            <GridItem key={`Item - ${index + 1}`} item xs={12} md={6}>
              <OwnerWrapper>
                <UserPicture imageUrl={owner.imageURL}>{owner.online ? <OnlineSpot /> : null}</UserPicture>
                <div>
                  <UserName>{owner.name}</UserName>
                  <div className={classes.socialContent}>
                    <GreenText fontSize="14px">@{owner.urlSlug}</GreenText>
                    {owner.verified ? (
                      <img
                        className="verifiedLabel"
                        src={require("assets/icons/verified_green_gradient.png")}
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
      </Box>
    </Modal>
  );
}
