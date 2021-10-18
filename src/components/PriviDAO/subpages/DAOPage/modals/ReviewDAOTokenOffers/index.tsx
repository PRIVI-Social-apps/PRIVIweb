import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import { Modal } from "shared/ui-kit";
import RequestAssistanceChatTab from "../CreateDAOToken/RequestAssistance/components/ChatTab";
import { useReviewDAOTokenStyles } from "../ReviewDAOToken";
import ReviewDAOTokenOffersTab from "./components/OffersTab";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

//This modal is opened when a community token is in progress and the creator has different offers
//-here they can check the offers and chat with the assistants

export default function ReviewDAOTokenOffersModal({ isCreator, open, handleClose, token }) {
  const classes = useReviewDAOTokenStyles();

  const [menuSelection, setMenuSelection] = useState<number>(0);

  const [communityToken, setCommunityToken] = useState<any>();

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    if (token) {
      setCommunityToken(token);
    }
  }, [token]);

  const handleClickSuccess = () => {
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
    }, 3000);
  };
  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 3000);
  };
  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  return (
    <Modal
      className={classes.root}
      size="medium"
      isOpen={open}
      onClose={handleClose}
      showCloseIcon
      theme="dark"
    >
      <Box display="flex" alignItems="center" mb={3}>
        {["Offers", "Chat"].map((name, index) => (
          <Box
            color={index === menuSelection ? "white" : "#707582"}
            fontSize="30px"
            key={name}
            onClick={() => setMenuSelection(index)}
            mr={3}
            style={{ cursor: "pointer" }}
          >
            {name}
          </Box>
        ))}
      </Box>

      {menuSelection === 0 ? (
        <ReviewDAOTokenOffersTab communityToken={communityToken} setCommunityToken={setCommunityToken} />
      ) : (
        <RequestAssistanceChatTab
          communityToken={communityToken}
          setCommunityToken={setCommunityToken}
          isCreator={isCreator}
        />
      )}

      {openSuccess && (
        <AlertMessage
          key={Math.random()}
          message={successMsg}
          variant="success"
          onClose={handleCloseSuccess}
        />
      )}
      {openError && (
        <AlertMessage
          key={Math.random()}
          message={errorMsg}
          variant="error"
          onClose={handleCloseError}
        />
      )}
    </Modal>
  );
}
