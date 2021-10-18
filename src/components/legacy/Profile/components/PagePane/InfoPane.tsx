import React, { useRef } from "react";
import { useSelector } from "react-redux";
import classnames from "classnames";
import Axios from "axios";
import { useHistory } from "react-router-dom";

import { createStyles, makeStyles, Fade, Tooltip, CircularProgress } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import { getUser, getUsersInfoList } from "store/selectors";
import IndividualBadgeModal from "../Badge-hexagon/IndividualBadgeModal";
import BadgesProfileModal from "../../modals/Badges-Modal/BadgesProfileModal";
import ProfileEditModal from "../../modals/ProfileEditModal/ProfileEditModal";
import ChangeAnonAvatarModal from "../../modals/Change-anon-avatar/ChangeAnonAvatarModal";
import { AirdropTokensModal } from "../../modals/AirdropTokensModal/AirdropTokensModal";
import ProfileFollowsModal from "../../modals/ProfileFollowsModal/ProfileFollowsModal";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { useAuth } from "shared/contexts/AuthContext";
import BadgeHexagon from "shared/ui-kit/Badge-hexagon/Badge-hexagon";
import * as UserConnectionsAPI from "shared/services/API/UserConnectionsAPI";

import URL from "shared/functions/getURL";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import CreateSocialTokenModal from "components/legacy/Profile/modals/CreateSocialTokenModal";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const infoIcon = require("assets/icons/info.svg");
const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const BLOCK_SIZE_BYTES = 12; // 128 bit
const SHARED_SECRET = "gUjXn2r5u8x/A?D(G+KbPeShVmYp3s6v";

const theme = createMuiTheme({
  shape: {
    borderRadius: 20,
  },
});

const useStyles = makeStyles(() =>
  createStyles({
    optionsConnectionButton: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 18,
      height: 42,
      border: "none",
      fontStyle: "normal",
      fontWeight: "bold",
      background: "linear-gradient(97.4deg, #29e8dc 14.43%, #03eaa5 79.45%)",
      borderRadius: 11,
      width: 148,
    },
    unfollow: {
      background: "transparent",
      color: "rgb(0, 0, 0)",
      border: "1px solid rgb(153, 161, 179)",
    },
    request: {
      background: "linear-gradient(97.4deg, #ff79d1 14.43%, #db00ff 79.45%)",
    },
    downloadLink: {
      backgroundColor: "#181818",
      color: "white",
      fontSize: 16,
      fontWeight: 700,
      height: 40,
      cursor: "pointer",
      padding: "0 16px",
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      borderRadius: "10px",
      marginRight: "16px",
    },
  })
);

const InfoPane = React.memo(
  (props: any) => {
    const {
      ownUser,
      userProfile,
      myBadges,
      idUrl,
      userURLProfileImg,
      userId,
      userStats,
      onProfilePhotoChange,
      setStatus,
      getBasicInfo,
      setUserSelector,
      onImportModalCall,
      isFollowed,
      setIsFollowed,
      getUserStats,
    } = props;
    const classes = useStyles();
    const history = useHistory();
    const userSelector = useSelector(getUser);
    const users = useSelector(getUsersInfoList);
    const { width } = useWindowDimensions();
    const { isSignedin } = useAuth();

    const inputRef = useRef<any>();
    const [openModalChangeAvatar, setOpenModalChangeAvatar] = React.useState(false);
    const [openAllBadges, setOpenAllBadges] = React.useState(false);
    const [openModalCreateSocialToken, setOpenModalCreateSocialToken] = React.useState(false);
    const [openModalAirdropTokens, setOpenModalAirdropTokens] = React.useState(false);
    const [openModalEdit, setOpenModalEdit] = React.useState(false);

    const [selectedListFollows, setSelectedListFollows] = React.useState<any[]>([]);
    const [selectedHeaderFollows, setSelectedHeaderFollows] = React.useState("");
    const [openModalFollows, setOpenModalFollows] = React.useState(false);
    const [isLoadingFollows, setIsLoadingFollows] = React.useState(false);
    const [isLoadingUser, setIsLoadingUser] = React.useState(false);

    const [openBadgeModal, setOpenBadgeModal] = React.useState(false);
    const [selectedBadge, setSelectedBadge] = React.useState();

    const handleOpenModalChangeAvatar = () => {
      setOpenModalChangeAvatar(true);
    };

    const handleCloseModalChangeAvatar = () => {
      setOpenModalChangeAvatar(false);
    };

    //Profile Photo Post
    const fileInputProfilePhoto = e => {
      e.preventDefault();
      const files = e.target.files;
      if (files.length) {
        handleFileProfilePhoto(files);
      }
    };

    const handleFileProfilePhoto = files => {
      for (let i = 0; i < files.length; i++) {
        if (validateFile(files[i])) {
          onProfilePhotoChange(files[i]);
        } else {
          files[i]["invalid"] = true;
        }
      }
    };

    const validateFile = file => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
      if (validTypes.indexOf(file.type) === -1) {
        return false;
      }
      return true;
    };

    const handleOpenAllBadges = () => {
      if (isSignedin) setOpenAllBadges(true);
    };

    const handleCloseAllBadges = () => {
      setOpenAllBadges(false);
    };

    const handleOpenModalEdit = () => {
      setOpenModalEdit(true);
    };

    const handleCloseModalEdit = () => {
      setOpenModalEdit(false);
    };

    const LatestBadgesGrid = () => {
      const LIMIT_CNT = width < 640 ? 5 : 10;
      const OFFSET = width < 640 ? 18 : 20;
      const OFFSET_BADGE = width < 640 ? "90px" : "220px";

      return (
        <div className="badges-grid">
          {myBadges.map((badge, index) => {
            if (index < LIMIT_CNT)
              return (
                <div key={index} className="indexBadge" style={{ left: `${OFFSET * index}px` }}>
                  <BadgeHexagon
                    badge={badge}
                    key={`latest-badges-${index}`}
                    style={{ width: "53px", height: "60px" }}
                    onClickBadge={() => {
                      setSelectedBadge(badge);
                      setOpenBadgeModal(true);
                    }}
                  />
                </div>
              );
            else return null;
          })}
          {myBadges.length > LIMIT_CNT ? (
            <span className="badgeMore" style={{ left: OFFSET_BADGE }} onClick={handleOpenAllBadges}>
              {`+${myBadges.length - LIMIT_CNT}`}
            </span>
          ) : null}
          <BadgesProfileModal
            open={openAllBadges}
            handleClose={handleCloseAllBadges}
            badges={myBadges}
            userProfile={userProfile}
            handleRefresh={() => {
              getUserStats();
            }}
            ownUser={ownUser}
          />
          {openBadgeModal && (
            <IndividualBadgeModal
              badge={selectedBadge}
              open={openBadgeModal}
              handleClose={() => setOpenBadgeModal(false)}
            />
          )}
        </div>
      );
    };

    const handleOpenCreateSocialToken = () => {
      setOpenModalCreateSocialToken(true);
    };

    const handleCloseCreateSocialToken = () => {
      setOpenModalCreateSocialToken(false);
    };

    const handleOpenAirdropTokens = () => {
      setOpenModalAirdropTokens(true);
    };

    const handleCloseAirdropTokens = () => {
      setOpenModalAirdropTokens(false);
    };

    const getFollowing = async () => {
      try {
        return await UserConnectionsAPI.getFollowings(userId, ownUser);
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
        return await UserConnectionsAPI.getFollowers(userId, ownUser);
      } catch (error) {
        setStatus({
          msg: "Error getting followers",
          key: Math.random(),
          variant: "error",
        });
      }
    };

    const showFollowersList = async () => {
      if (!isSignedin) return;
      setIsLoadingFollows(true);
      const followers = (await getFollowers()) as any[];
      if (users && users.length > 0 && followers && followers.length) {
        followers.forEach((following, index) => {
          followers[index].userImageURL = users[users.findIndex(u => u.id === following.id.user)].imageURL;
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
      setSelectedHeaderFollows("Followers");
      handleOpenModalFollows();
      setIsLoadingFollows(false);
    };

    const showFollowingList = async () => {
      if (!isSignedin) return;
      setIsLoadingFollows(true);
      let following = (await getFollowing()) as any[];

      if (users && users.length > 0 && following && following.length) {
        following.forEach((followed, index) => {
          following[index].userImageURL = users[users.findIndex(u => u.id === followed.id)]?.imageURL;
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
      setSelectedHeaderFollows("Followings");
      handleOpenModalFollows();
      setIsLoadingFollows(false);
    };

    const handleOpenModalFollows = () => {
      setOpenModalFollows(true);
    };

    const handleCloseModalFollows = () => {
      setOpenModalFollows(false);
      getBasicInfo(userId, ownUser);
    };

    const toggleAnonymousMode = anonBool => {
      const body = {
        userId: userId,
        anonMode: anonBool,
      };

      setIsLoadingUser(true);
      Axios.post(`${URL()}/user/changeAnonMode`, body)
        .then(response => {
          if (response.data.success) {
            //update redux user aswell
            const user = { ...userSelector };
            user.anon = anonBool;
            setUserSelector(user);
          } else {
            console.log("User change anon mode failed");
          }
          setIsLoadingUser(false);
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error handling anonymous mode update",
            key: Math.random(),
            variant: "error",
          });
          setIsLoadingUser(false);
        });
    };

    const handleFollow = () => {
      // follow
      if (isFollowed === 0) {
        const body = {
          userToFollow: idUrl,
        };
        Axios.post(`${URL()}/user/connections/followUser`, body).then(res => {
          const resp = res.data;
          if (resp.success) {
            // Note: triggered in BE
            //updateTask(userSelector.id, "Follow 5 people");
            setStatus({
              msg: "Follow success",
              key: Math.random(),
              variant: "success",
            });
            setIsFollowed(1);
          } else {
            setStatus({
              msg: "Follow failed",
              key: Math.random(),
              variant: "error",
            });
          }
        });
      }
      // unfollow
      else if (isFollowed === 2) {
        const body = {
          userToUnFollow: idUrl,
        };
        Axios.post(`${URL()}/user/connections/unFollowUser`, body).then(res => {
          const resp = res.data;
          if (resp.success) {
            setStatus({
              msg: "Unfollow success",
              key: Math.random(),
              variant: "success",
            });
            setIsFollowed(0);
          } else {
            setStatus({
              msg: "Unfollow failed",
              key: Math.random(),
              variant: "error",
            });
          }
        });
      }
    };

    const encrypt = (text, secret) => {
      const iv = crypto.randomBytes(BLOCK_SIZE_BYTES);
      const cipher = crypto.createCipheriv(ALGORITHM, secret, iv);
      let ciphertext = cipher.update(text, "utf8", "base64");
      ciphertext += cipher.final("base64");
      return {
        ciphertext,
        iv: iv.toString("base64"),
        tag: cipher.getAuthTag().toString("base64"),
      };
    };

    const getDownloadLink = () => {
      const userToken = sessionStorage.getItem("token");
      if (!userToken) {
        return `privi://visithouse?id=${userSelector.id}`;
      }
      try {
        const { ciphertext, iv, tag } = encrypt(userToken, SHARED_SECRET);
        let res = `privi://visithouse?id=${userSelector.id}?session=${ciphertext}$${iv}$${tag}`;
        return res;
      } catch (err) {
        console.log("--err", err);
        return `privi://visithouse?id=${userSelector.id}`;
      }
    };

    return (
      <div className="top-content">
        <div className="user-info">
          <LoadingWrapper loading={isLoadingUser}>
            <>
              {width < 640 && isSignedin && (
                <div className="mobile-top-buttons">
                  {ownUser ? (
                    <PrimaryButton size="medium" onClick={handleOpenModalEdit}>
                      Edit Profile
                    </PrimaryButton>
                  ) : null}
                  {ownUser ? (
                    <PrimaryButton size="medium" onClick={handleOpenCreateSocialToken}>
                      Create Social Token
                    </PrimaryButton>
                  ) : null}
                </div>
              )}
              <div className="user-profile">
                <div>
                  <div className="avatar-container">
                    <div
                      className="avatar"
                      style={{
                        backgroundImage: ownUser
                          ? !userSelector.anon
                            ? userSelector.hasPhoto
                              ? userURLProfileImg
                                ? `url(${userURLProfileImg})`
                                : "none"
                              : "none"
                            : userSelector.anonAvatar && userSelector.anonAvatar.length > 0
                              ? `url(${require(`assets/anonAvatars/${userSelector.anonAvatar}`)})`
                              : `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`
                          : userProfile.anon === false
                            ? userProfile.hasPhoto && userProfile.url
                              ? `url(${userProfile.url}?${Date.now()})`
                              : "none"
                            : userProfile.anonAvatar && userProfile.anonAvatar.length > 0
                              ? `url(${require(`assets/anonAvatars/${userProfile.anonAvatar}`)})`
                              : `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`,
                        cursor: ownUser ? "pointer" : "auto",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      onClick={
                        ownUser && isSignedin
                          ? () => {
                            if (userSelector.anon === false) {
                              if (inputRef && inputRef.current) {
                                inputRef.current.click();
                              }
                            } else handleOpenModalChangeAvatar();
                          }
                          : undefined
                      }
                    >
                      <span className={ownUser || userProfile.connected ? "online" : "offline"} />
                    </div>
                    <InputWithLabelAndTooltip
                      onInputValueChange={fileInputProfilePhoto}
                      hidden
                      type="file"
                      style={{
                        display: "none",
                      }}
                      reference={inputRef}
                    />
                  </div>
                  <div className="info">
                    <div className="main-info">
                      <div className="name">
                        <h2>
                          {ownUser
                            ? `${userSelector.firstName || ""} ${userSelector.lastName || ""}`
                            : `${userProfile.firstName || ""} ${userProfile.lastName || ""}`}
                        </h2>
                      </div>
                      <div className="name">
                        <h4>
                          {`@${ownUser
                            ? userSelector.urlSlug ?? userSelector.id ?? idUrl ?? ""
                            : userProfile.urlSlug ?? userProfile.id ?? idUrl ?? ""
                            }`}
                        </h4>
                        <div>
                          {(ownUser && userSelector.verified) || userProfile.verified ? (
                            <img
                              className="verifiedLabel"
                              src={require("assets/icons/verified_mint.png")}
                              alt={"check"}
                            />
                          ) : null}
                          <span className="profileLevel">
                            level {ownUser ? userSelector.level ?? 1 : userProfile.level ?? 1}
                          </span>
                        </div>
                      </div>
                      {width >= 1024 && <p className="bio">{ownUser ? userSelector.bio : userProfile.bio}</p>}
                    </div>
                  </div>
                </div>
                {width < 1024 && <p className="mobile-bio">{ownUser ? userSelector.bio : userProfile.bio}</p>}
              </div>
              <div className="profileStatus">
                <div className="statLine">
                  {isLoadingFollows || isLoadingUser ? (
                    <CircularProgress style={{ color: "#27e8d9" }} />
                  ) : (
                    <>
                      <div
                        onClick={showFollowersList}
                        style={{ cursor: !sessionStorage.getItem("userId") ? "auto" : "pointer" }}
                      >
                        <div className="label">🌟 Followers</div>
                        <div className="content">
                          {ownUser ? userSelector.numFollowers : userProfile.numFollowers}
                        </div>
                      </div>
                      <div
                        onClick={showFollowingList}
                        style={{ cursor: !sessionStorage.getItem("userId") ? "auto" : "pointer" }}
                      >
                        <div className="label">💫 Following</div>
                        <div className="content">
                          {ownUser ? userSelector.numFollowings : userProfile.numFollowings}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {myBadges.length > 0 ? (
                  <div className="profile-badges">
                    <p className="label">💎 Badges</p>
                    <LatestBadgesGrid />
                  </div>
                ) : null}
              </div>
              {width > 640 && isSignedin && (
                <div className="profile-social-token profileStatus">
                  {props.socialToken && Object.keys(props.socialToken).length > 0 && (
                    <div className="statLine">
                      <div>
                        <div className="label">👛 Social Token</div>
                        <div className="content" style={{ alignItems: "center" }}>
                          <div
                            className={"token-image"}
                            style={{
                              backgroundImage: props.socialToken.HasPhoto
                                ? `url(${URL()}/social/getPhoto/${props.socialToken.TokenSymbol})`
                                : "none",
                            }}
                          />
                          {props.socialToken.TokenSymbol ?? ""}
                          {(props.socialToken.FundingToken || props.socialToken.Price) && (
                            <div className="label" style={{ margin: 0 }}>{`(${props.socialToken.FundingToken ?? ""
                              } ${props.socialToken.Price ?? ""})`}</div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="label">
                          💰 Token Holders <span onClick={() => { }}>See all</span>
                        </div>
                        <div className="content">
                          {props.socialToken.HoldersInfo ? props.socialToken.HoldersInfo.length : "0"}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="top-buttons">
                    {/* {ownUser && props.socialToken && Object.keys(props.socialToken).length > 0 && ( */}
                    <PrimaryButton onClick={handleOpenAirdropTokens} size="medium">
                      Airdrop Tokens
                    </PrimaryButton>
                    {/* )} */}
                    {!ownUser && props.socialToken && Object.keys(props.socialToken).length > 0 && (
                      <PrimaryButton size="medium" onClick={() => { }}>
                        Buy
                      </PrimaryButton>
                    )}
                    {!ownUser && props.socialToken && Object.keys(props.socialToken).length > 0 && (
                      <SecondaryButton size="medium" onClick={() => { }}>
                        Sell
                      </SecondaryButton>
                    )}
                    {props.socialToken && Object.keys(props.socialToken).length > 0 && (
                      <SecondaryButton
                        size="medium"
                        onClick={() =>
                          history.push(
                            `/profile/${window.location.href.split("/")[5]}/socialToken/${props.socialToken.TokenSymbol
                            }`
                          )
                        }
                      >
                        Token Details
                      </SecondaryButton>
                    )}
                    <a href={getDownloadLink()} className={classes.downloadLink}>
                      Visit House
                    </a>
                    {ownUser && (!props.socialToken || Object.keys(props.socialToken).length <= 0) && (
                      <PrimaryButton size="medium" onClick={handleOpenCreateSocialToken}>
                        Create Social Token
                      </PrimaryButton>
                    )}
                    {ownUser && (
                      <SecondaryButton size="medium" onClick={handleOpenModalEdit}>
                        Edit Profile
                      </SecondaryButton>
                    )}
                    {!ownUser && sessionStorage.getItem("userId") && (
                      <PrimaryButton
                        size="medium"
                        className={classnames(
                          classes.optionsConnectionButton,
                          isFollowed === 1 && classes.request,
                          isFollowed === 2 && classes.unfollow
                        )}
                        onClick={handleFollow}
                        disabled={isFollowed === 1 || !sessionStorage.getItem("userId")}
                      >
                        {isFollowed === 0 && "Follow"}
                        {isFollowed === 1 && "Requested"}
                        {isFollowed === 2 && "Unfollow"}
                      </PrimaryButton>
                    )}
                  </div>
                </div>
              )}
            </>
          </LoadingWrapper>
        </div>
        {/* this should be moved to new UI */}
        {/* {ownUser ? (
          <div className="actions">
            <div className="anon-mode">
              <div
                className={classnames('option-buttons', !userSelector.anon ? "selected" : "unSelected")}
                onClick={() => {
                  toggleAnonymousMode(!userSelector.anon);
                }}
              >
                <div className="switch" />
              </div>
              <div className="private-title">
                <span>
                  Private mode
                </span>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltip"
                  title={`While using the PRIVI network, you have the option to share your data or not. When you see an advertisement, you earn PRIVI data coins. This part of the system at this time is not functional, any ad you see is simply as an example. To learn more about PRIVI Data and how you can make money off our data, head to our Medium or ask our Community in either PRIVI Communities or Governance`}
                >
                  <img className="icon" src={infoIcon} alt="info" />
                </Tooltip>
              </div>
            </div>
            <div className="sidebar-label">
              <h3 onClick={handleDisplaySidebar}>Sidebar</h3>
            </div>
            <SideBar
              visibleState={displaySidebar}
              toggleSidebar={handleDisplaySidebar}
              getAllInfoProfile={getAllInfoProfile}
            />
          </div>
        ) : null} */}
        <div className="stats">
          <div className="title">
            My Stats
            <div>
              <img className="icon" src={infoIcon} alt="info" />
              <span>Hover a stat title to know more about it</span>
            </div>
          </div>
          <div>
            <div className="statsLine">
              <LoadingWrapper loading={isLoadingUser}>
                <div>
                  <StatInfo
                    value={
                      ownUser
                        ? isNaN(userSelector.trustScore)
                          ? "50%"
                          : userSelector.trustScore * 100 + "%"
                        : isNaN(userProfile.trustScore)
                          ? "50%"
                          : userProfile.trustScore * 100 + "%"
                    }
                    label={`🤝 Trust`}
                    tooltipInfo={
                      "A measure of financial trustworthiness, Trust Scores quantify transaction history data on individuals and Pods within the system"
                    }
                  />
                  <StatInfo
                    value={
                      ownUser
                        ? isNaN(userSelector.endorsementScore)
                          ? "50%"
                          : userSelector.endorsementScore * 100 + "%"
                        : isNaN(userProfile.endorsementScore)
                          ? "50%"
                          : userProfile.endorsementScore * 100 + "%"
                    }
                    label={`⚔️ Endorsement`}
                    tooltipInfo={
                      "A measure of financial trustworthiness, Endorsement Scores quantify the endorsements (and their trust scores) of individuals and/or Pods"
                    }
                  />
                  <StatInfo
                    value={userStats ? userStats.myMediasCount : 0}
                    label="📹 Media"
                    tooltipInfo={"Media info"}
                  />
                  <StatInfo
                    value={
                      ownUser
                        ? userSelector.awards && userSelector.awards.length
                          ? userSelector.awards.length
                          : "0"
                        : userProfile.awards && userProfile.awards.length
                          ? userProfile.awards.length
                          : "0"
                    }
                    label="🥇 Awards"
                    tooltipInfo={
                      "Awards received in discussion, posts and other publications by other users."
                    }
                  />
                  <StatInfo
                    value={userStats ? userStats.myCommunitiesCount : 0}
                    label="👽 Community"
                    tooltipInfo={"Community info"}
                  />
                  <StatInfo
                    value={
                      ownUser
                        ? userSelector.creds && userSelector.creds > 0
                          ? userSelector.creds
                          : 0
                        : userProfile.creds && userProfile.creds > 0
                          ? userProfile.creds
                          : 0
                    }
                    label="💰 Creds"
                    tooltipInfo={"Creds received in discussion, posts and other publications by other users."}
                  />
                  <StatInfo
                    value={userStats ? userStats.myFTPodsCount ?? 0 + userStats.myDigitalPodsCount ?? 0 : 0}
                    label="📈 Investments"
                    tooltipInfo={"Investments info."}
                  />
                  <StatInfo
                    value={userStats ? userStats.myDigitalPodsCounts : 0}
                    label="💊 Pod"
                    tooltipInfo={"Pod info"}
                  />
                </div>
              </LoadingWrapper>
            </div>
          </div>
        </div>
        <ChangeAnonAvatarModal open={openModalChangeAvatar} onClose={handleCloseModalChangeAvatar} />
        <ProfileEditModal
          open={openModalEdit}
          onCloseModal={handleCloseModalEdit}
          toggleAnonymousMode={toggleAnonymousMode}
        />
        <CreateSocialTokenModal
          open={openModalCreateSocialToken}
          handleRefresh={() => { }}
          handleClose={handleCloseCreateSocialToken}
          user={userSelector}
        />
        {/* <CreateImportSocialTokenModal
          onImportModalCall={onImportModalCall}
          user={userSelector}
          handleRefresh={() => {}}
          handleClose={handleCloseCreateSocialToken}
          open={openModalCreateSocialToken}
        /> */}
        <AirdropTokensModal
          socialToken={userStats && userStats.mySocialTokensCount < 1}
          open={openModalAirdropTokens}
          handleClose={handleCloseAirdropTokens}
          variant="profile"
        />
        <MuiThemeProvider theme={theme}>
          <ProfileFollowsModal
            open={openModalFollows}
            header={selectedHeaderFollows}
            user={userSelector}
            onClose={handleCloseModalFollows}
            list={selectedListFollows}
            refreshFollowers={showFollowersList}
            refreshFollowings={showFollowingList}
            ownUser={ownUser}
          />
        </MuiThemeProvider>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.ownUser === nextProps.ownUser &&
    prevProps.userProfile === nextProps.userProfile &&
    prevProps.myBadges === nextProps.myBadges &&
    prevProps.idUrl === nextProps.idUrl &&
    prevProps.userURLProfileImg === nextProps.userURLProfileImg &&
    prevProps.userId === nextProps.userId &&
    prevProps.myMedia === nextProps.myMedia &&
    prevProps.myCommunities === nextProps.myCommunities &&
    prevProps.podList === nextProps.podList &&
    prevProps.isFollowed === nextProps.isFollowed &&
    prevProps.userStats === nextProps.userStats
);

const StatInfo = ({ value, label, tooltipInfo }) => (
  <div className="statInfo">
    <Tooltip
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      arrow
      className="tooltip"
      title={tooltipInfo || ""}
    >
      <div className="label">{label}</div>
    </Tooltip>
    <div className="content">{value}</div>
  </div>
);

export default InfoPane;
