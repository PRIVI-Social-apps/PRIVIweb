import "./Profile.css";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, editUser } from "store/actions/User";
import { setSelectedUser } from "store/actions/SelectedUser";
import { socket } from "components/Login/Auth";
import axios from "axios";
import URL from "shared/functions/getURL";
import MyFeed from "./components/MyFeed/MyFeed";
import MyWall from "./components/MyWall/MyWall";
import MyProfile from "./components/PagePane/MyProfile";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import SocialTokenModal from "./components/Profile-Modals/Social-Token-Modal/SocialTokenModal";
import { getUser, getUsersInfoList } from "store/selectors/user";
import { sumTotalViews } from "shared/functions/totalViews";
import InfoPane from "./components/PagePane/InfoPane";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";
import { TabNavigation } from "shared/ui-kit";
import { getFollowers } from "shared/services/API/UserConnectionsAPI";

const Profile = (props: any) => {
  const params: any = useParams();
  const [userId, setUserId] = React.useState<any>();
  const [ownUser, setOwnUser] = React.useState<boolean>(true);

  // STORE
  const dispatch = useDispatch();
  const history = useHistory();

  const allUsers = useSelector(getUsersInfoList);
  const userSelector = useSelector(getUser);

  // HOOKS
  const [userProfile, setUserProfile] = useState<any>({});
  const [userAddress, setUserAddress] = useState<any>();
  const [userURLProfileImg, setUserURLProfileImg] = useState<any>("");

  const [status, setStatus] = useState<any>("");

  //tabs
  const profileMenuOptions = ["Profile", "Wall", "Feed"];
  const [profileMenuSelection, setProfileMenuSelection] = useState<number>(0);

  const [myBadges, setMyBadges] = useState<any[]>([]);
  const [myStats, setMyStats] = useState<any>(null);
  const [socialToken, setSocialToken] = useState<any>({});
  //wall and followers
  const [isFollowed, setIsFollowed] = useState<number>(0);

  //modals
  const [openModalCreateNew, setOpenModalCreateNew] = useState<boolean>(false);
  const [externalBadge, setExternalBadge] = useState(null);
  const [externalToken, setExternalToken] = useState<any>(null);
  const [openModalBadge, setOpenModalBadge] = useState<boolean>(false);
  const [openModalToken, setOpenModalToken] = useState<boolean>(false);

  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userId !== props.id && props.id) {
      setUserId(props.id);
      setOwnUser(props.id === sessionStorage.getItem("userId"));
    } else if (!props.id && userId !== params.id && params.id) {
      setUserId(params.id);
      setOwnUser(params.id === sessionStorage.getItem("userId"));
    }
  }, [params.id, props.id]);

  useEffect(() => {
    if (userId && userId.length > 0) {
      axios
        .get(`${URL()}/user/checkIfUserExists/${userId}`)
        .then(response => {
          if (response.data.success) {
            sumTotalViews({
              userId: userId,
              ProfileAddress: true,
            });
          }
        })
        .catch(error => {
          setStatus({
            msg: "Error check if user exists",
            key: Math.random(),
            variant: "error",
          });
        });

      // BasicInfo
      getBasicInfo(userId, ownUser);
    }
    setProfileMenuSelection(0);
  }, [userId]);

  useEffect(() => {
    if (userId && userId.length > 0 && !ownUser) {
      if (socket) {
        socket.on("user_connect_status", connectStatus => {
          if (connectStatus.userId === userId) {
            let setterUser: any = { ...userProfile };
            setterUser.connected = connectStatus.connected;
            setUserProfile(setterUser);
          }
        });
      }
    }
  }, [userId, userProfile]);

  useEffect(() => {
    if (userId) {
      getUserStats();
    }
  }, [userId]);

  const getUserStats = () => {
    setIsDataLoading(true);
    axios
      .get(`${URL()}/user/getUserCounters/${userId}`)
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          const { badges, ...others } = resp.data;
          setMyBadges(badges);
          setMyStats(others);
        } else {
          setStatus({
            msg: "Error getting user stats",
            key: Math.random(),
            variant: "error",
          });
        }
        setIsDataLoading(false);
      })
      .catch(_ => {
        setStatus({
          msg: "Error getting user stats",
          key: Math.random(),
          variant: "error",
        });
        setIsDataLoading(false);
      });
  };

  // FUNCTIONS
  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  //modal functions
  const handleCloseModalBadge = () => {
    setOpenModalBadge(false);
  };

  const onImportModalCall = () => {
    handleCloseModalCreateNew();
  };

  const handleCloseModalToken = () => {
    setOpenModalToken(false);
  };

  const handleOpenModalCreateNew = () => {
    setOpenModalCreateNew(true);
  };

  const handleCloseModalCreateNew = () => {
    setOpenModalCreateNew(false);
  };

  const setUserSelector = setterUser => {
    if (setterUser.id) {
      dispatch(setUser(setterUser));
    }
  };

  // show badge/token modal when navigated directly by url
  const triggerExternalModals = (badges, socialTokens) => {
    let url = window.location.href.split("/");
    let urlHash = url[6];
    let urlSymbol = url[7];

    if (urlHash === "badge" && urlSymbol) {
      let badge = badges.filter(badge => {
        return badge.Symbol === urlSymbol;
      });
      if (badge[0] && badge[0].Symbol) {
        setExternalBadge(badge[0]);
        setOpenModalBadge(true);
      } else {
        setStatus({
          msg: "Badge '" + urlSymbol + "' not found in current user.",
          key: Math.random(),
          variant: "error",
        });
      }
    }

    if (urlHash === "token" && urlSymbol) {
      let token = socialTokens.filter(token => {
        return token.TokenSymbol === urlSymbol;
      });
      if (token[0] && token[0].TokenSymbol) {
        setExternalToken(token[0]);
        setOpenModalToken(true);
      } else {
        setStatus({
          msg: "Token '" + urlSymbol + "' not found in current user.",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  const getBasicInfo = async (userId: string, ownUser: boolean) => {
    if (userId) {
      try {
        const response = await axios.get(`${URL()}/user/getBasicInfo/${userId}`);
        if (response.data.success) {
          let data = response.data.data;
          let nameSplit = data.name.split(" ");
          let lastNameArray = nameSplit.filter((_, i) => {
            return i !== 0;
          });
          let firstName = nameSplit[0];
          let lastName = "";
          for (let i = 0; i < lastNameArray.length; i++) {
            if (lastNameArray.length === i + 1) {
              lastName = lastName + lastNameArray[i];
            } else {
              lastName = lastName + lastNameArray[i] + " ";
            }
          }

          if (ownUser) {
            let setterUser: any = { ...userSelector };
            setterUser.firstName = firstName;
            setterUser.lastName = lastName;
            setterUser.endorsementScore = data.endorsementScore;
            setterUser.trustScore = data.trustScore;
            setterUser.numFollowers = data.numFollowers;
            setterUser.numFollowings = data.numFollowings;
            setterUser.bio = data.bio;
            setterUser.level = data.level;
            setterUser.isLevelUp = data.isLevelUp;
            setterUser.instagram = data.instagram;
            setterUser.twitter = data.twitter;
            setterUser.facebook = data.facebook;
            setterUser.hasPhoto = data.hasPhoto;
            setterUser.verified = data.verified;
            setterUser.anon = data.anon;
            setterUser.anonAvatar = data.anonAvatar;
            setterUser.creds = data.creds;
            setterUser.urlSlug = data.urlSlug ?? data.id;
            setterUser.connected = data.connected ?? false;
            setterUser.badges = data.badges ?? [];

            setUserAddress(data.address);
            setUserSelector(setterUser);
            setUserProfile(setterUser);
          } else {
            let user: any = {};
            user.firstName = firstName;
            user.lastName = lastName;
            user.endorsementScore = data.endorsementScore;
            user.trustScore = data.trustScore;
            user.creds = data.creds;
            user.awards = data.awards;
            user.numFollowers = data.numFollowers;
            user.numFollowings = data.numFollowings;
            user.bio = data.bio;
            user.level = data.level;
            user.isLevelUp = data.isLevelUp;
            user.instagram = data.instagram;
            user.twitter = data.twitter;
            user.facebook = data.facebook;
            user.hasPhoto = data.hasPhoto;
            user.verified = data.verified;
            user.anon = data.anon;
            user.anonAvatar = data.anonAvatar;
            user.urlSlug = data.urlSlug ?? data.id;
            user.connected = data.connected ?? false;
            user.badges = data.badges ?? [];

            setUserAddress(data.address);
            setSelectedUser(user);
            setUserProfile(user);

            const currentUserId = sessionStorage.getItem("userId");
            const followers = await getFollowers(userId, ownUser);

            if (followers) {
              followers.forEach(followerData => {
                if (followerData.id === currentUserId) {
                  setIsFollowed(followerData.isFollowing);
                }
              });
            }
          }

          if (data.url) {
            setUserURLProfileImg(data.url + "?" + Date.now());
          }
        }
      } catch (error) {
        setStatus({
          msg: "Error getting basic info",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  const onProfilePhotoChange = (file: any) => {
    const formData = new FormData();
    formData.append("image", file, sessionStorage.getItem("userId") ?? "");
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(`${URL()}/user/changeProfilePhoto`, formData, config)
      .then(res => {
        let setterUser: any = { ...userSelector };
        setterUser.hasPhoto = true;
        setUserSelector(setterUser);

        if (res.data) {
          setUserURLProfileImg(res.data.data + "?" + Date.now());
        }
      })
      .catch(error => {
        setStatus({
          msg: "Error change user profile photo",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  const ProfileTabs = () => {
    return (
      <div className="appbar-container">
        <TabNavigation
          tabs={profileMenuOptions}
          currentTab={profileMenuSelection}
          variant="primary"
          onTabChange={setProfileMenuSelection}
          padding={0}
        />
      </div>
    );
  };

  return (
    <div className={"profilePage"} id="profile-infite-scroll">
      <InfoPane
        ownUser={ownUser}
        userProfile={userProfile}
        myBadges={myBadges}
        idUrl={userId}
        userURLProfileImg={userURLProfileImg}
        userId={userId}
        userStats={myStats}
        getUserStats={getUserStats}
        onProfilePhotoChange={onProfilePhotoChange}
        setStatus={setStatus}
        getBasicInfo={getBasicInfo}
        setUserSelector={setUserSelector}
        onImportModalCall={onImportModalCall}
        isFollowed={isFollowed}
        setIsFollowed={setIsFollowed}
        socialToken={socialToken}
      />

      {/* <CreateWallet /> */}
      <ProfileTabs />
      <div className="cardContent">
        {profileMenuSelection === 0 ? (
          <LoadingWrapper loading={isDataLoading}>
            <MyProfile
              allUsers={allUsers}
              ownUser={ownUser}
              userAddress={userAddress}
              userId={userId}
              userProfile={userProfile}
              onImportModalCall={onImportModalCall}
              setStatus={setStatus}
              userStats={myStats}
              setUserStats={setMyStats}
              setSocialToken={setSocialToken}
            />
          </LoadingWrapper>
        ) : profileMenuSelection === 1 ? (
          <MyWall userId={userId} />
        ) : ownUser ? (
          <MyFeed userId={userId} />
        ) : null}
      </div>
      {openModalToken ? (
        <SocialTokenModal
          className="socialTokenModal"
          socialToken={externalToken}
          chain={externalToken.chain}
          open={openModalToken}
          handleClose={handleCloseModalToken}
        />
      ) : null}
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
};

export default Profile;
