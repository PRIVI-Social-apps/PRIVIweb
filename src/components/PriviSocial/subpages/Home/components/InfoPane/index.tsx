import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { CircularProgress } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import { Card, GreenText } from "components/PriviSocial/index.styles";
import Box from "shared/ui-kit/Box";
import { Header4 } from "shared/ui-kit";
import { getUsersInfoList } from "store/selectors";
import { useAuth } from "shared/contexts/AuthContext";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import BadgeHexagon from "shared/ui-kit/Badge-hexagon/Badge-hexagon";
import { homeStyles } from "../../index.styles";
import * as UserConnectionsAPI from "shared/services/API/UserConnectionsAPI";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import BadgesProfileModal from "../../modals/BadgesModal";
import ProfileFollowsModal from "../../modals/FollowingsFollowers";
import ChangeProfileBackgroundModal from '../../modals/ChangeProfileBackgroundModal/ChangeProfileBackgroundModal';
import ChangeAnonAvatarModal from '../../modals/ChangeAnonAvatarModal/ChangeAnonAvatarModal';

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.userProfile === currProps.userProfile &&
    prevProps.ownUser === currProps.ownUser &&
    prevProps.userId === currProps.userId &&
    prevProps.myBadges === currProps.myBadges
  );
};

const InfoPane = React.memo(
  ({
    userProfile,
    ownUser,
    userId,
    setStatus,
    myBadges,
    getUserStats,
  }: {
    userProfile: any;
    ownUser: boolean;
    userId: string;
    setStatus: any;
    myBadges: any[];
    getUserStats: () => void;
  }) => {
    const classes = homeStyles();

    const user = useSelector((state: RootState) => state.user);
    const users = useSelector(getUsersInfoList);
    const { isSignedin } = useAuth();

    const [isLoadingFollows, setIsLoadingFollows] = useState(false);
    const [isLoadingUser, setIsLoadingUser] = useState(false);

    const [openModalFollows, setOpenModalFollows] = useState(false);
    const [openModalChangeBG, setOpenModalChangeBG] = useState(false);
    const [openModalChangeAnonAvatar, setOpenModalChangeAnonAvatar] = useState(false);
    const [selectedListFollows, setSelectedListFollows] = useState<any[]>([]);
    const [selectedHeaderFollows, setSelectedHeaderFollows] = useState<"Followings" | "Followers">("Followers");
    const [profileBG, setProfileBG] = useState<string>("");
    const [anonAvatar, setAnonAvatar] = useState<string>("");

    useEffect(() => {
      if (user.backgroundURL) {
        setProfileBG(user.backgroundURL);
      }

      if (user.anonAvatar) {
        setAnonAvatar(user.anonAvatar);
      }
    }, [user.backgroundURL, user.anonAvatar]);

    const handleOpenModalFollows = () => {
      setOpenModalFollows(true);
    };
    const handleCloseModalFollows = () => {
      setOpenModalFollows(false);
    };

    const handleOpenModalChangeBG = () => {
      setOpenModalChangeBG(true);
    }
    const handleCloseModalChangeBG = () => {
      setOpenModalChangeBG(false);
    }

    const handleOpenModalChangeAnonAvatar = () => {
      setOpenModalChangeAnonAvatar(true);
    }
    const handleCloseModalChangeAnonAvatar = () => {
      setOpenModalChangeAnonAvatar(false);
    }

    const showFollowersList = async () => {
      if (!isSignedin) return;

      setSelectedHeaderFollows("Followers");
      handleOpenModalFollows();

      setIsLoadingFollows(true);
      const followers = (await getFollowers()) as any[];
      if (users && users.length > 0 && followers && followers.length) {
        followers.forEach((following, index) => {
          followers[index].userImageURL =
            users.find(u => u.id === following.id || u.id === following.id?.user)?.imageURL ??
            users.find(u => u.id === following.id || u.id === following.id?.user)?.url;
          followers[index].urlSlug = users
            .find(u => u.id === following.id || u.id === following.id?.user)
            ?.urlSlug?.startsWith("Px")
            ? users.find(u => u.id === following.id || u.id === following.id?.user)?.name
            : users.find(u => u.id === following.id || u.id === following.id?.user)?.urlSlug;
        });
      } else {
        setStatus({
          msg: "No follower",
          key: Math.random(),
          variant: "warning",
        });
        return;
      }
      setSelectedListFollows(followers || []);
      setIsLoadingFollows(false);
    };

    const showFollowingList = async () => {
      if (!isSignedin) return;

      setSelectedHeaderFollows("Followings");
      handleOpenModalFollows();
      setIsLoadingFollows(true);
      let following = (await getFollowing()) as any[];

      if (users && users.length > 0 && following && following.length) {
        following.forEach((followed, index) => {
          following[index].userImageURL =
            users.find(u => u.id === followed.id || u.id === followed.id?.user)?.imageURL ??
            users.find(u => u.id === followed.id || u.id === followed.id?.user)?.url;
          following[index].urlSlug = users
            .find(u => u.id === followed.id || u.id === followed.id?.user)
            ?.urlSlug?.startsWith("Px")
            ? users.find(u => u.id === followed.id || u.id === followed.id?.user)?.name
            : users.find(u => u.id === followed.id || u.id === followed.id?.user)?.urlSlug;
        });
      } else {
        setStatus({
          msg: "No following",
          key: Math.random(),
          variant: "warning",
        });
        return;
      }

      setSelectedListFollows(following);
      setIsLoadingFollows(false);
    };

    const getFollowing = async () => {
      try {
        const followings =  await UserConnectionsAPI.getFollowings(userId, ownUser);
        setSelectedListFollows(followings);
        return followings;
      } catch (error) {
        setStatus({
          msg: "Error getting followers",
          key: Math.random(),
          variant: "error",
        });
      }
    };

    const getFollowers = async () => {
      try {
        const followers = await UserConnectionsAPI.getFollowers(userId, ownUser);
        setSelectedListFollows(followers);
        return followers;
      } catch (error) {
        setStatus({
          msg: "Error getting followers",
          key: Math.random(),
          variant: "error",
        });
      }
    };

    return (
      <Card noPadding>
        <div
          className={classes.header}
          onClick={handleOpenModalChangeBG}
          style={{
            backgroundImage: profileBG ? `url(${require(`assets/backgrounds/profile/${profileBG}`)})` : "",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className={classes.avatar}
          style={{
            backgroundImage:
              userProfile.anon === false
                ? userProfile.hasPhoto && userProfile.url
                  ? `url(${userProfile.url}?${Date.now()})`
                  : "none"
                : anonAvatar && anonAvatar.length > 0
                  ? `url(${require(`assets/anonAvatars/${anonAvatar}`)})`
                  : `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`,
            cursor: ownUser ? "pointer" : "auto",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={handleOpenModalChangeAnonAvatar}
        />

        <LoadingWrapper loading={!userProfile || !userProfile.id} theme="green">
          <Box display="flex" mt={"26px"} mb={"50px"} pr={5} pl={5} justifyContent="space-between">
            <Box flex={1} mr={9}>
              <Header4 noMargin>
                {`${userProfile.name ?? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`}`}
              </Header4>
              <GreenText fontSize="14px">{`@${userProfile.urlSlug ?? userProfile.id ?? userId ?? ""
                }`}</GreenText>
              <Box mt={2} fontSize="14px">
                {userProfile.bio}
              </Box>
            </Box>
            <Box flex={1}>
              <div className={classes.statLine}>
                {isLoadingUser ? (
                  <CircularProgress style={{ color: "#B1FF00" }} />
                ) : (
                  <>
                    <div
                      onClick={showFollowersList}
                      style={{ cursor: !sessionStorage.getItem("userId") ? "auto" : "pointer" }}
                    >
                      <Box fontSize="14px" mb={1} whiteSpace="nowrap">
                        🌟 Followers
                      </Box>
                      <Box fontSize={"40px"} fontWeight="bold">
                        {userProfile.numFollowers}
                      </Box>
                    </div>
                    <div
                      onClick={showFollowingList}
                      style={{ cursor: !sessionStorage.getItem("userId") ? "auto" : "pointer" }}
                    >
                      <Box fontSize="14px" mb={1} whiteSpace="nowrap">
                        💫 Following
                      </Box>
                      <Box fontSize={"40px"} fontWeight="bold">
                        {userProfile.numFollowings}
                      </Box>
                    </div>
                  </>
                )}
              </div>
              {myBadges.length > 0 && (
                <Box>
                  <Box fontSize="14px" mb={1}>
                    💎 Badges
                  </Box>
                  <LatestBadgesGrid
                    myBadges={myBadges}
                    ownUser={ownUser}
                    userProfile={userProfile}
                    getUserStats={getUserStats}
                  />
                </Box>
              )}
            </Box>
          </Box>
          {openModalFollows && (
            <ProfileFollowsModal
              open={openModalFollows}
              onClose={handleCloseModalFollows}
              header={selectedHeaderFollows}
              list={selectedListFollows}
              refreshFollowers={getFollowers}
              refreshFollowings={getFollowing}
              isLoadingFollows={isLoadingFollows}
              number={
                selectedHeaderFollows === "Followers" ? userProfile.numFollowers : userProfile.numFollowings
              }
            />
          )}
          <ChangeProfileBackgroundModal open={openModalChangeBG} onClose={handleCloseModalChangeBG}/>
          <ChangeAnonAvatarModal open={openModalChangeAnonAvatar} onClose={handleCloseModalChangeAnonAvatar}/>
        </LoadingWrapper>
      </Card>
    );
  },
  arePropsEqual
);

const LatestBadgesGrid = ({ myBadges, userProfile, ownUser, getUserStats }) => {
  const classes = homeStyles();

  const { width } = useWindowDimensions();
  const { isSignedin } = useAuth();

  const LIMIT_CNT = width < 640 ? 5 : 10;
  const OFFSET_BADGE = width < 640 ? "90px" : "220px";

  const [openAllBadges, setOpenAllBadges] = React.useState(false);

  const handleOpenAllBadges = () => {
    if (isSignedin) setOpenAllBadges(true);
  };

  const handleCloseAllBadges = () => {
    setOpenAllBadges(false);
  };

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap" onClick={handleOpenAllBadges}>
      {myBadges.map((badge, index) => {
        if (index < LIMIT_CNT)
          return (
            <div key={index} className={classes.indexBadge}>
              <BadgeHexagon
                badge={badge}
                key={`latest-badges-${index}`}
                style={{ width: "48px", height: "48px" }}
              />
            </div>
          );
        else return null;
      })}
      {myBadges.length > LIMIT_CNT ? (
        <span className={classes.badgeMore} style={{ left: OFFSET_BADGE }}>
          {`+${myBadges.length - LIMIT_CNT}`}
        </span>
      ) : null}
      {openAllBadges && (
        <BadgesProfileModal
          open={openAllBadges}
          handleClose={() => {
            handleCloseAllBadges();
          }}
          badges={myBadges}
          userProfile={userProfile}
          handleRefresh={() => {
            getUserStats();
          }}
          ownUser={ownUser}
        />
      )}
    </Box>
  );
};

export default InfoPane;
