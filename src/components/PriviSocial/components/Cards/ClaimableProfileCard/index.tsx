import { SocialPrimaryButton } from "components/PriviSocial/index.styles";
import React, { useEffect, useState } from "react";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";
import { Avatar, Color, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { claimableProfileCardStyles } from "./index.styles";

export default function ClaimableProfileCard({ item }) {
  //const user = useTypedSelector(state => state.user);

  const classes = claimableProfileCardStyles();

  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    //TODO: check if user is following
  }, []);

  const handleFollow = () => {
    //TODO: follow
    setIsFollowing(!isFollowing);
  };

  const handleClaim = () => {
    //TODO: claim
  };

  const handleShare = () => {
    //TODO: share
  };

  return (
    <div className={classes.claimableProfileCard}>
      <div
        className={classes.header}
        style={
          item?.avatar
            ? {
              backgroundImage: `url(${item?.avatar})`,
            }
            : {
              background:
                "conic-gradient(from 111.31deg at 50% 51.67%, #b1ff00 -118.12deg, #00ff15 110.62deg, #b1ff00 241.88deg, #00ff15 470.63deg)",
            }
        }
      />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        pr={"25px"}
        pl="25px"
        width="100%"
        mb={3}
        mt={"-25px"}
      >
        <Avatar url={item?.avatar ?? getRandomAvatar()} size="medium" />

        <div className={classes.actions}>
          <img
            src={require("assets/icons/share-icon.png")}
            width="16px"
            height="16px"
            alt="share"
            onClick={handleShare}
          />
          <img
            src={require("assets/icons/follow.png")}
            width="17px"
            height="16px"
            alt="follow"
            onClick={handleFollow}
          />
        </div>
      </Box>

      <Box fontSize="18px" pl="25px" pr="25px">
        {item?.user ?? item?.id}
      </Box>

      <Box width="100%" style={{ opacity: 0.1 }}>
        <StyledDivider color={Color.GrayDark} type="solid" margin={2} />
      </Box>

      <Box mt="10px" mb="10px" pl="25px" pr="25px">
        <Box display="flex" alignItems="center" flexWrap="no-wrap" mb={"12px"}>
          <img src={require("assets/icons/followers_gray.png")} width="21px" height="14px" alt="followers" />
          <Box ml={1} mr={0.5} minWidth="100px">
            Followers
          </Box>
          <Box width="100%" style={{ opacity: 0.5 }}>
            <StyledDivider color={Color.GrayDark} type="dashed" margin={2} />
          </Box>
          <Box ml={1} fontSize="22px">
            {item?.followers?.length ?? 0}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" flexWrap="no-wrap" mb={"12px"}>
          <div className={classes.fruitsContainer}>
            <img src={require("assets/emojiIcons/fruits.png")} alt="fruits" />
          </div>
          <Box ml={1} mr={0.5} minWidth={"120px"}>
            Media Fruits
          </Box>
          <Box width="100%" style={{ opacity: 0.5 }}>
            <StyledDivider color={Color.GrayDark} type="dashed" margin={2} />
          </Box>
          <Box ml={1} fontSize="22px">
            {item?.mediaFruits?.length ?? 0}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" flexWrap="no-wrap" mb={"12px"}>
          <img src={require("assets/icons/eye_gray.png")} width="21px" height="14px" alt="views" />
          <Box ml={1} mr={0.5} minWidth={"120px"}>
            Profile Views
          </Box>
          <Box width="100%" style={{ opacity: 0.5 }}>
            <StyledDivider color={Color.GrayDark} type="dashed" margin={2} />
          </Box>
          <Box ml={1} fontSize="22px">
            {item?.totalViews ?? 0}
          </Box>
        </Box>
      </Box>

      <Box width="100%" style={{ opacity: 0.1 }}>
        <StyledDivider color={Color.GrayDark} type="solid" margin={2} />
      </Box>

      <Box pl={"25px"} mb={2}>
        <SocialPrimaryButton onClick={handleClaim}>Claim Profile</SocialPrimaryButton>
      </Box>
    </div>
  );
}
