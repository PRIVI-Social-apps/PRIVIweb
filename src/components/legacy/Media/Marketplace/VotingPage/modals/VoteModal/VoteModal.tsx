import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { PrimaryButton, SecondaryButton, Modal } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';

const useStyles = makeStyles(theme => ({
  exit: {
    position: "relative",
    top: 0,
    right: "calc(-100% + 14px)",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "32px",
  },
  confetti: {
    width: "50px",
    marginTop: "15px",
  },
  title: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "30px",
    textAlign: "center",
    color: "#181818",
    margin: "32px 0px 15px",
  },
  text: {
    margin: "0px 0px 60px",
    fontSize: "18px",
    textAlign: "center",
    color: "#707582",
  },
}));

export const VoteModal = ({ open, onClose, points, onExploreCategories }) => {
  const classes = useStyles();

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon>
      <div className={classes.modalContent}>
        <img src={require("assets/icons/confetti.png")} alt="confetti" />
        <h1 className={classes.title}>Congratulations!</h1>
        <p className={classes.text}>
          Your vote was subbmited.
          <br />
          You earned <b>{points} points.</b>
        </p>
        <Box display="flex" flexDirection="row">
          <SecondaryButton
            size="medium"
            onClick={onExploreCategories}
            style={{ marginBottom: 0, width: "80%", height: "auto", lineHeight: "18px", padding: "8px" }}
          >
            Explore Categories
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            onClick={onClose}
            style={{ width: "80%", height: "auto", lineHeight: "18px", padding: "8px" }}
          >
            View more Medias
          </PrimaryButton>
        </Box>
      </div>
    </Modal>
  );
};
