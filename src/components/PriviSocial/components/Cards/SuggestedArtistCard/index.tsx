import { SocialSecondaryButton } from "components/PriviSocial/index.styles";
import React from "react";
import { useHistory } from 'react-router';
import Box from "shared/ui-kit/Box";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { suggestedArtistCardStyles } from "./index.styles";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";

export default function SuggestedArtistCard({ item }) {
  const { isUserFollowed, followUser, unfollowUser } = useUserConnections();
  const classes = suggestedArtistCardStyles();
  const history = useHistory();

  const handleFollow = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isUserFollowed(item.id)) {
      unfollowUser(item.id);
    } else {
      followUser(item.id);
    }
  };
  return (
    <div
      className={classes.suggestedArtistCard}
      onClick={() => history.push(`/privi-social/${item.id}`)}
      style={
        item?.anon || item?.url || item?.imageURL
          ? {
              backgroundImage:
                item?.anon && item?.anonAvatar
                  ? `url(${require(`assets/anonAvatars/${item.anonAvatar}`)})`
                  : item?.hasPhoto
                  ? `url(${item?.url ?? item?.imageURL})`
                  : "none",
            }
          : {
              backgroundImage: `url(${getRandomAvatarForUserIdWithMemoization(item?.id)})`,
            }
      }
    >
      <div className={classes.gradient}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <h4>{item.name ?? item.firstName ?? "Artist Name"}</h4>
          <SocialSecondaryButton onClick={handleFollow}>
            {isUserFollowed(item.id) ? "Unfollow" : "Follow"}
          </SocialSecondaryButton>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <h4>🌟 Collections</h4>
            <Box mt={1}>{item.myMediasCount ? item.myMediasCount : 0}</Box>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <h4>🌟 Followers</h4>
            <Box mt={1}>{item.numFollowers ? item.numFollowers : 0}</Box>
          </Box>
        </Box>
      </div>
    </div>
  );
}
