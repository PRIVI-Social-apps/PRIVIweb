import React, { useState } from "react";
import styled from "styled-components";
import { Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const Title = styled.h3`
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  cursor: pointer;

  &.active {
    border-bottom: 2px solid;
  }
`;
const TitlesWrapper = styled.div`
  display: flex;
  //justify-content: space-around;
`;
export const OwnerWrapper = styled.div`
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #99a1b3;
  padding: 20px;
  margin: 15px 15px 0 0;

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
export const GridItem = styled(Grid)``;
const NoUsers = styled.div`
  margin-left: 40px;
  margin-top: 15px;
  font-size: 22px;
`;

const VerifiedLabel = styled.div`
  width: 21px;
  height: 21px;
  margin: 0 10px;
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
}
`;

export const SocialLabel = styled.div`
  margin-right: 10px;
  background: radial-gradient(rgba(255, 121, 209, 1), rgba(219, 0, 255, 1));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 14px;
  font-weight: 800;
  flex: 1;
`;

const Owners = (props: any) => {
  const { socialToken, community, communityOwnersList, communityCreatorsList } = props;
  const [list, setList] = useState(communityCreatorsList);
  const [isActive, setIsActive] = useState("creators");
  const history = useHistory();
  const count = socialToken && socialToken?.owners?.length;
  const handleToggleLists = e => {
    if (e?.target?.id) {
      setIsActive(e?.target?.id);
      return e?.target?.id === "owners" ? setList(communityOwnersList) : setList(communityCreatorsList);
    }
    return false;
  };
  return (
    <div className={props.className}>
      {socialToken && <Title id="social-owners">Social Token Owners ({count})</Title>}
      {community && (
        <TitlesWrapper>
          <Title
            id="creators"
            className={`hovered ${isActive === "creators" ? "active" : ""}`}
            onClick={e => handleToggleLists(e)}
            style={{ marginLeft: "40px" }}
          >
            Community Creators
          </Title>
        </TitlesWrapper>
      )}
      {/* list for social tokens  */}
      {socialToken && (
        <Grid container>
          {socialToken?.owners.map(({ name, imageURL, urlSlug, verified, level, online, id }, index) => (
            <GridItem key={`Item - ${index + 1}`} item xs={12} md={6}>
              <OwnerWrapper>
                <UserPicture imageUrl={imageURL}>{online ? <OnlineSpot /> : null}</UserPicture>
                <div>
                  <UserName>{name}</UserName>
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
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
          ))}
        </Grid>
      )}
      {/* lists for communities  */}
      {community &&
        (list && list?.length ? (
          list?.map(({ name, imageURL, id, urlSlug }, index) => (
            <GridItem key={`${name} - ${index + 1}`} item xs={6}>
              <OwnerWrapper
                onClick={() => {
                  history.push(`/profile/${id}`);
                }}
              >
                <UserPicture imageUrl={imageURL}>
                  <OnlineSpot />
                </UserPicture>
                <div>
                  <UserName>{name}</UserName>
                  <div style={{ display: "flex" }}>
                    <SocialLabel>{urlSlug}</SocialLabel>
                    <img
                      className="verifiedLabel"
                      src={require("assets/icons/profileVerified.svg")}
                      alt={"check"}
                    />
                    <ProfileLabel>level 1</ProfileLabel>
                  </div>
                </div>
              </OwnerWrapper>
            </GridItem>
          ))
        ) : (
          <NoUsers>No users to show</NoUsers>
        ))}
    </div>
  );
};

export default styled(Owners)``;
