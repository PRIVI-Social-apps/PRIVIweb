import "./PodModal.css";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppBar, Modal, Tabs, Tab } from '@material-ui/core';
import URL from "shared/functions/getURL";
import { RootState } from "store/reducers/Reducer";
import { TwitterShareButton, FacebookShareButton } from "react-share";
import placeholderBadge from "assets/icons/badge.png";
import axios from "axios";
import { Grid } from "@material-ui/core";
import styled from "styled-components";
import { PrimaryButton, TabNavigation } from "shared/ui-kit";

export const OwnerWrapper = styled.div`
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #99a1b3;
  padding: 20px;
  margin: 3px 3px 0 3px;

  &:hover {
    cursor: pointer;
  }
`;

export const UserPicture = styled.div<{ imageUrl: string }>`
  background-size: cover;
  height: 56px;
  width: 56px;
  min-width: 56px;
  min-height: 56px;
  border-radius: 50%;
  margin-right: 15px;
  background-color: #5a5a5a;
  background-image: url(${({ imageUrl }) => imageUrl});
  filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2)) !important;
  border: 2px solid white;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

export const OnlineSpot = styled.span`
  background: linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%);
  width: 15px;
  height: 15px;
  border: 2px solid #ffffff;
  box-sizing: border-box;
  filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2));
  border-radius: 50%;
`;

export const UserName = styled.h5`
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  font-family: "Agrandir";
`;

export const SocialLabel = styled.div`
  margin-right: 10px;
  background: radial-gradient(rgba(255, 121, 209, 1), rgba(219, 0, 255, 1));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 14px;
  font-weight: 800;
  flex:1;
`;

export const ProfileLabel = styled.div`
  border: 1px solid #949bab;
  border-radius: 35px;
  font-size: 11px;
  color: #949bab;
  margin-left: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px 1px;
  width: 55px;
`;

export const GridItem = styled(Grid)``;

export default function PodModal(props) {
  //store
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  //hooks
  const [podOwnersList, setPodOwnersList] = useState<any>([]);
  const [podCreatorsList, setPodCreatorsList] = useState<any>([]);

  const [podsSelection, setPodsSelection] = useState<number>(0);
  const podsOptions = ['Pod Owners', 'Pod Creators'];

  const [photoLoaded, setPhotoLoaded] = useState<boolean>(false);
  const history = useHistory();

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token")
  };

  //use effect
  useEffect(() => {
    //load owners data
    if (props.pod && props.pod.PodAddress && props.open) {
      const creator = props.pod.Creator;
      const newCreators = [] as any;
      const newOwners = [] as any;
      let owners = [] as any;

      if (props.pod.tokenData && props.pod.tokenData.Holders) {
        owners = props.pod.tokenData.Holders
      } else {
        owners = []
      };

      if (owners.length > 0) {
        owners.forEach((owner) => {
          if (users.some((user) => user.id === owner)) {
            const thisUser =
              users[users.findIndex((user) => user.id === owner)];
            newOwners.push({
              imageURL: thisUser.imageURL,
              name: thisUser.name,
              urlSlug:thisUser.urlSlug,
              verified:thisUser.verified,
              level:thisUser.level
            });
          }
        });
      }

      if (creator.length > 0) {
        if (users.some((user) => user.id === creator)) {
          const thisUser =
            users[users.findIndex((user) => user.id === creator)];
          newCreators.push({
            imageURL: thisUser.imageURL,
            name: thisUser.name,
            urlSlug:thisUser.urlSlug,
            verified:thisUser.verified,
            level:thisUser.level
          });
        }
      }

      setPodOwnersList(newOwners);
      setPodCreatorsList(newCreators);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, users, props.open]);

  //functions

  const setLoadingFailed = (event) => {
    setPhotoLoaded(false);
    event.target.src = placeholderBadge;
  };

  const handleOpenPage = () => {
    if (props.pod.type.includes("NFT")) {
      history.push(`/privi-pods/MediaNFT/${props.pod.PodAddress}`);
    } else if (props.pod.type === "FT") {
      history.push(`/privi-pods/FT/${props.pod.PodAddress}`);
    }
  };

  //page components
  const OwnerRow = (props) => {
    return (
      <div className="user-row">
        <div
          className="user-image"
          style={{
            backgroundImage:
              props.user.imageURL.length > 0
                ? `url(${props.user.imageURL})`
                : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <span>{props.user.name}</span>
      </div>
    );
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-content badge-modal">
        <div className="left" style={{ height: "100%",backgroundColor:'#fff' }}>
          <div style={{ display: "inline-grid", justifyItems: "center" }}>
            <img
              className="podImage"
              src={props.pod.type === "FT" ? `${URL()}/pod/FT/getPhoto/${props.pod.PodAddress}` :
                `${URL()}/pod/NFT/getPhoto/${props.pod.PodAddress}`}
              alt=""
              onLoad={() => setPhotoLoaded(true)}
              onError={setLoadingFailed}
            />
            {isSignedIn() ?
              <PrimaryButton size="medium" onClick={handleOpenPage}>Pod</PrimaryButton>
              : null}
          </div>
          <div className="share-buttons">
            <div className="share-box">
              <FacebookShareButton
                quote={
                  "Check out this PRIVI Pod!" +
                  "\n\n" +
                  props.pod.Name +
                  "\n" +
                  props.pod.Description +
                  "\n\n"
                }
                url={window.location.href}
                hashtag="PRIVI"
              >
                <img
                  src={require("assets/icons/socialFacebook.svg")}
                  alt={"facebook hexagon"}
                />
              </FacebookShareButton>
              Share on Facebook
            </div>
            <div className="share-box">
              <TwitterShareButton
                title={
                  "Check out this PRIVI Pod!" +
                  "\n\n" +
                  props.pod.Name +
                  "\n" +
                  props.pod.Description +
                  "\n\n"
                }
                url={window.location.href}
                hashtags={["PRIVI"]}
              >
                <img
                  src={require("assets/snsIcons/twitter.png")}
                  alt={"twitter hexagon"}
                />
              </TwitterShareButton>
              Share on Twitter
            </div>
          </div>
        </div>
        <div className="right">
          <div className="exit" onClick={props.handleClose}>
            <img
              src={require("assets/icons/x_darkblue.png")}
              alt={"x"}
            />
          </div>
          <div className="header" style={{ display: "inline" }}>
            <h2>{props.pod.Name}</h2>
            <p style={{ margin: 0 }}>{`@${props.pod.urlSlug}`}</p>
          </div>
          <div className="type">
            {props.pod.type && props.pod.type.toUpperCase()}
          </div>
          <div className="fake-appbar">
            <p>About this Pod</p>
          </div>
          <p>{props.pod.Description.slice(0, 700)}{props.pod.Description.length > 700 ? "..." : null}</p>
          <TabNavigation
            tabs={podsOptions}
            currentTab={podsSelection}
            variant="primary"
            onTabChange={setPodsSelection}
          />
          <div className="badges-list">
            {podsSelection === 0 ? (
              <div className="users-list">
                <Grid container>
                  {podOwnersList.length > 0 ? (
                      podOwnersList.map(({ name, imageURL, urlSlug, verified, level, online, id }, index) => (
                        <GridItem key={`Item - ${index + 1}`} item xs={12} md={12}>
                          <OwnerWrapper>
                            <UserPicture imageUrl={imageURL}>
                              {online ? <OnlineSpot /> : null}
                            </UserPicture>
                            <div>
                              <UserName>{name}</UserName>
                              <div style={{ display: "flex", alignItems:'flex-end' }}>
                                <SocialLabel>@{urlSlug}</SocialLabel>
                                {verified ? (
                                  <img
                                    className="verifiedLabel"
                                    src={require("assets/icons/verified_mint.png")}
                                    alt={"check"}
                                  />
                                ) : null}
                                <ProfileLabel>level {level}</ProfileLabel>
                              </div>
                            </div>
                          </OwnerWrapper>
                        </GridItem>
                        // return <OwnerRow user={user} key={`pod-owner-${index}`} />;
                      ))
                  ) : (
                    <div>No users to show</div>
                  )}
                </Grid>
              </div>
            ) : (
              <div className="users-list">
                {podCreatorsList.length > 0 ? (
                  podCreatorsList.map(({ name, imageURL, urlSlug, verified, level, online, id }, index) => (
                    <GridItem key={`Item - ${index + 1}`} item xs={12} md={12}>
                        <OwnerWrapper>
                          <UserPicture imageUrl={imageURL}>
                            {online ? <OnlineSpot /> : null}
                          </UserPicture>
                          <div>
                            <UserName>{name}</UserName>
                            <div style={{ display: "flex", alignItems:'flex-end' }}>
                              <SocialLabel>@{urlSlug}</SocialLabel>
                              {verified ? (
                                <img
                                  className="verifiedLabel"
                                  src={require("assets/icons/verified_mint.png")}
                                  alt={"check"}
                                />
                              ) : null}
                              <ProfileLabel>level {level}</ProfileLabel>
                            </div>
                          </div>
                        </OwnerWrapper>
                      </GridItem>
                    //return <OwnerRow user={user} key={`pod-creator-${index}`} />;
                  ))
                ) : (
                  <div>No users to show</div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </Modal>
  );
}
