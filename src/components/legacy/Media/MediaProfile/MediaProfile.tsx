import "./MediaProfile.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import URL from "shared/functions/getURL";
import { Fade, Tooltip } from "@material-ui/core";
import ConnectModal from "shared/ui-kit/Modal/Modals/ConnectModal";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useTypedSelector } from "store/reducers/Reducer";
import MediaCard from "components/legacy/Media/components/Cards/MediaCard/MediaCard";
import { PrimaryButton } from "shared/ui-kit";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const infoIconWhite = require("assets/icons/info_white.png");
const infoIcon = require("assets/icons/info.svg");

const MediaProfile = () => {
  let pathName = window.location.href;
  let idUrl = pathName.split("/")[5];

  const [openConnect, setOpenConnect] = useState<boolean>(false);
  const [mediaUser, setMediaUser] = useState<any>({});
  const [media, setMedia] = useState<any[]>([]);
  const state = useTypedSelector(state => state);
  const [loadingCards, setLoadingCards] = useState<boolean>(false);
  const [randomAvatar, setRandomAvatar] = useState<string>("001");

  const [status, setStatus] = useState<any>("");

  useEffect(() => {
    if (idUrl) {
      if (idUrl.includes("?eth")) idUrl = idUrl.replace("?eth", "");
      //get random number for anon avatar
      const random = Math.floor(Math.random() * 118 + 1);
      const avatarName = require(`assets/anonAvatars/ToyFaces_Colored_BG_${random < 10 ? "00" : random < 100 ? "0" : ""
        }${random}.jpg`);
      setRandomAvatar(avatarName);
      setLoadingCards(true);
      axios
        .get(`${URL()}/user/getUserMediaInfo/${idUrl}`)
        .then(response => {
          if (response.data.success) {
            let data = response.data.data;

            let user = { ...data } ?? {};
            let likes = 0;

            const catalog = [] as any;

            data.catalog.forEach((media, index) => {
              const mediaCopy = media;

              mediaCopy.eth = true;
              mediaCopy.mediaProfile = true;
              mediaCopy.tag = data.tag;
              mediaCopy.randomAvatar = avatarName;
              mediaCopy.Type = media.type;

              if (mediaCopy.price && mediaCopy.price.includes("($")) {
                //separate price from usd price
                let price = mediaCopy.price.split("(")[0];
                let usdPrice = "(" + mediaCopy.price.split("(")[1];

                mediaCopy.price = price;
                mediaCopy.usdPrice = usdPrice;
              }

              catalog.push(mediaCopy);
            });

            user.totalLikes = likes;

            if (!user.followers) {
              user.followers = 0;
            }

            setMediaUser(user);
            setMedia(catalog);
          }
          setLoadingCards(false);
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error getting user info",
            key: Math.random(),
            variant: "error",
          });
          setLoadingCards(false);
        });
    }
  }, [idUrl]);

  const handleCloseConnect = () => {
    setOpenConnect(false);
    let connectedAccount = state.user.ethAccount;
    let connectedAccountState = state.user.ethType;

    // check that connected account is same as profile address
    if (connectedAccount && connectedAccount.length > 0 && connectedAccountState === "injected") {
      let addressProfile = window.location.hash.split("/profile/")[1];
      if (addressProfile && addressProfile.length > 0) {
        if (addressProfile === connectedAccount) {
          //TODO: register user with Metamask
        }
      }
    }
  };

  const handleClaim = () => {
    setOpenConnect(true);
  };

  const onFollowExternalUser = async username => {
    const body = {
      user: state.user.id,
      userToFollow: mediaUser.user,
    };
    axios
      .post(`${URL()}/user/connections/followExternalUser`, body)
      .then(response => {
        if (response.data.success) {
          let followers = mediaUser.followers;
          if (mediaUser.followers.find(follower => follower.user === state.user.id)) {
            followers = followers.filter(follower => follower.user !== state.user.id);
          } else {
            followers.push({
              user: state.user.id,
            });
          }
          setMediaUser({
            ...mediaUser,
            followers,
          });
        }
      })
      .catch(error => {
        console.log(error);
        setStatus({
          msg: "Error getting user info",
          key: Math.random(),
          variant: "error",
        });
        setLoadingCards(false);
      });
  };

  return (
    <div className={"profilePage mediaProfile"}>
      {/*----- INFO USER -----*/}
      <div className="user-info">
        <div className="avatar-container">
          <div
            className="avatar"
            style={{
              backgroundImage: `url(${randomAvatar})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
        <div className="info">
          <div className="main-info">
            <div className="name">
              <h2>{`${mediaUser.user ?? mediaUser.user}`}</h2>
              <div className="verifiedLabel">
                <img src={require("assets/icons/check.png")} alt={"check"} />
              </div>
              <button className="user-follower-btn" onClick={onFollowExternalUser}>
                {mediaUser.followers && mediaUser.followers.find(follower => follower.user === state.user.id)
                  ? "Unfollow"
                  : "Follow"}
              </button>
            </div>
            <h4>{`@${mediaUser.user ?? ""}`}</h4>
          </div>

          <div className="follow-pills">
            <div>
              <h4>{mediaUser.followers ? mediaUser.followers.length : 0} </h4>
              <h5>
                Followers
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltip"
                  title={`Number of followers`}
                >
                  <img className="icon" src={infoIconWhite} alt="info" />
                </Tooltip>
              </h5>
            </div>
            <div>
              <h4>{mediaUser.totalLikes ?? 0}</h4>
              <h5>
                Credits
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltip"
                  title={`Total of likes from user's media`}
                >
                  <img className="icon" src={infoIconWhite} alt="info" />
                </Tooltip>
              </h5>
            </div>
          </div>
        </div>
      </div>
      <div className="label-container">
        <div className="label">
          Featured
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            className="tooltip"
            title={"Media from this user"}
          >
            <img className="icon" src={infoIcon} alt="info" />
          </Tooltip>
        </div>

        <PrimaryButton size="medium" onClick={handleClaim}>
          Claim profile
        </PrimaryButton>
      </div>
      {/*------ PROFILE CARDS -------*/}
      <LoadingWrapper loading={loadingCards}>
        <div className="profile-cards">
          {media && media.length > 0 ? (
            <MasonryGrid
              data={media}
              renderItem={(item, index) => (
                <MediaCard media={item} dimensions={item.dimensions} key={`card-${index}`} />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
            />
          ) : (
            <div className="noItemsCardsGrid">No items to show</div>
          )}
        </div>
      </LoadingWrapper>
      {openConnect && <ConnectModal open={openConnect} handleClose={handleCloseConnect} />}
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
};

const COLUMNS_COUNT_BREAK_POINTS = { 1400: 4, 1000: 3, 650: 2 };

export default MediaProfile;
