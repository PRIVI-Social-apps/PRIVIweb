import React, { useState } from "react";
import styled from "styled-components";
import BuySocialTokenModal from "./Social-Token-Modal/modals/BuySocialTokenModal";
import { useHistory } from "react-router-dom";
import SendTokensModal from "components/legacy/Wallet/components/SendTokensModal";
import { Grid } from "@material-ui/core";

const ImageWrapper = styled.div`
  min-width: 65px;
  width: 65px;
  min-height: 65px;
  height: 65px;
  border-radius: 50%;
  background: white;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
  div {
    max-width: 64px;
    max-height: 64px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const MainInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const SocialWrapper = styled.div`
  display: block;
  margin: 30px 0;
  span {
    font-size: 14px;
    font-weight: 400;
    margin: 10px 0;
  }
`;
const SocialContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  text-align: center;
  span,
  button {
    width: 50px;
  }
`;
const Name = styled.h2`
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  margin-right: 16px;
`;
const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  text-align: left;
  color: #ffffff;
  background: black;
  border-radius: 10px;
  cursor: pointer;
  padding: 8px 16px;
`;
const Header = (props: any) => {
  const {
    isSignedIn,
    socialToken,
    community,
    user,
    openModal,
    handleOpenModal,
    handleCloseModal,
    handleRefresh,
  } = props;
  const history = useHistory();

  const [openBuyModal, setOpenBuyModal] = useState<boolean>(false);
  const [openSendModal, setOpenSendModal] = useState<boolean>(false);

  const handleOpenBuyModal = () => {
    setOpenBuyModal(true);
  };
  const handleCloseBuyModal = () => {
    setOpenBuyModal(false);
  };
  const handleOpenSendModal = () => {
    setOpenSendModal(true);
  };
  const handleCloseSendModal = () => {
    setOpenSendModal(false);
  };

  return (
    <HeaderWrapper>
      <MainInfoWrapper>
        <ImageWrapper>
          <div
            style={{
              backgroundImage: props.socialToken
                ? `url(${socialToken.Url}?${Date.now()})`
                : `url(${community.Url}?${Date.now()})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </ImageWrapper>
        <Name>{socialToken?.TokenName ?? community?.Name}</Name>
      </MainInfoWrapper>
      {socialToken && user.address && socialToken.Creator === user.address && (
        <SendTokensModal
          defaultTokenType={"SOCIAL"}
          open={openSendModal}
          handleClose={handleCloseSendModal}
          handleRefresh={handleRefresh}
        />
      )}
      {socialToken && user.address && (
        <BuySocialTokenModal
          socialToken={socialToken}
          open={openBuyModal}
          handleClose={handleCloseBuyModal}
          handleRefresh={handleRefresh}
        />
      )}
      {socialToken && (
        <Grid container direction="row" justify="flex-end">
          {user.address ? <Button onClick={handleOpenBuyModal}>Buy</Button> : null}
          {user.address && user.address === socialToken.Creator ? (
            <Button onClick={handleOpenSendModal}>Send</Button>
          ) : null}
        </Grid>
      )}
      {community && (
        <Button
          onClick={isSignedIn ? () => history.push(`/communities/${community.CommunityAddress}`) : () => null}
        >
          Community
        </Button>
      )}
    </HeaderWrapper>
  );
};

export default styled(Header)`
  display: flex;
`;
