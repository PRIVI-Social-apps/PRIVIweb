import React, { useState, useEffect } from "react";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import { Modal, Gradient } from "shared/ui-kit";
import cls from "classnames";
import RequestAssistanceChatTab from "../CreateCommunityToken/RequestAssistance/components/ChatTab";
import { useReviewCommunityTokenStyles } from "../ReviewCommunityToken";
import ReviewCommunityTokenOffersTab from "./components/OffersTab";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

//This modal is opened when a community token is in progress and the creator has different offers
//-here they can check the offers and chat with the assistants

export default function ReviewCommunityTokenModal({ isCreator, open, handleClose, token }) {
  const classes = useReviewCommunityTokenStyles();

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
    <Modal className={classes.root} size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
      <div className={classes.appbarContainer}>
        <AppBar position="static" className={classes.appbar}>
          <Tabs
            TabIndicatorProps={{
              style: { background: Gradient.Mint, height: "3px" },
            }}
            value={menuSelection}
            className={classes.tabs}
            onChange={(e, value) => setMenuSelection(value)}
          >
            {["Offers", "Chat"].map((name, index) => (
              <Tab
                className={cls({ [classes.selectedTab]: index === menuSelection }, classes.tab)}
                label={name}
                key={name}
              />
            ))}
          </Tabs>
        </AppBar>
      </div>
      {menuSelection === 0 ? (
        <ReviewCommunityTokenOffersTab
          communityToken={communityToken}
          setCommunityToken={setCommunityToken}
        />
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
