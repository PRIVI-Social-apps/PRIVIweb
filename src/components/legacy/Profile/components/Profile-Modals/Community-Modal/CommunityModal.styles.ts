import { makeStyles } from "@material-ui/core";

export const communityModalStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 40,
    width: 892,
    borderRadius: 16,
    maxWidth: "85vw",
    maxHeight: "85vh",
    overflow: "auto",
    outline: "none",
  },
  closeButton: {
    display: "flex",
    justifyContent: "flex-end",
    cursor: "pointer",
  },
}));
