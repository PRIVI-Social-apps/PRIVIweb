import React from "react";
import { Header, About, Owners } from "../index";

const Template = (props: any) => {
  const {
    modalType,
    socialToken,
    community,
    user,
    openModal,
    isSignedIn,
    handleOpenModal,
    handleCloseModal,
    handleRefresh,
    communityCreatorsList,
    communityOwnersList,
  } = props;

  return (
    <div>
      <Header
        isSignedIn={isSignedIn}
        modalType={modalType}
        socialToken={socialToken}
        community={community}
        user={user}
        openModal={openModal}
        handleOpenModal={handleOpenModal}
        handleCloseModal={handleCloseModal}
        handleRefresh={handleRefresh}
      />
      <About socialToken={socialToken} community={community} />
      <Owners
        socialToken={socialToken}
        community={community}
        communityCreatorsList={communityCreatorsList}
        communityOwnersList={communityOwnersList}
      />
    </div>
  );
};

export default Template;
