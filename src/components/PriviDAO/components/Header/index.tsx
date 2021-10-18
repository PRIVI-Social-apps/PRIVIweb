import React, { useState } from "react";

import CreateDAOModal from "components/PriviDAO/modals/CreateDAO";
import { DAOButton } from "../DAOButton/index";
import { headerStyles } from './index.styles';

export default function Header({
  type,
  handleCloseSearcher,
}: {
  type: "home" | "search";
  handleCloseSearcher?: () => void;
}) {
  const classes = headerStyles();
  const [openCreateDAOModal, setOpenCreateDAOModal] = useState<boolean>(false);
  const handleOpenCreateDAOModal = () => {
    setOpenCreateDAOModal(true);
  };
  const handleCloseCreateDAOModal = () => {
    setOpenCreateDAOModal(false);
  };

  return (
    <div className={classes.header}>
      <h2>{type === "home" ? "The heartbeat of the PRIVI network." : "Find what you are looking for"}</h2>
      <h1
        onClick={() => {
          if (handleCloseSearcher) handleCloseSearcher();
        }}
        style={{ cursor: handleCloseSearcher ? "pointer" : "inherit" }}
      >
        DAO's
      </h1>
      <h5>Find groups, businesses, creators, and individuals.</h5>
      {type === "home" && <DAOButton onClick={handleOpenCreateDAOModal}>Create a new DAO</DAOButton>}
      <CreateDAOModal
        open={openCreateDAOModal}
        handleClose={handleCloseCreateDAOModal}
        handleRefresh={() => {}}
      />
    </div>
  );
}
