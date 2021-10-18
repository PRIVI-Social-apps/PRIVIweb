import { makeStyles } from "@material-ui/core";

export const socialTokenModalStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  socialModalContent: {
    backgroundColor: "#ffffff",
    padding: 40,
    width: 768,
    borderRadius: 16,
    maxWidth: "85vw",
    maxHeight: "85vh",
    outline: "none",
  },
  closeButton: {
    display: "flex",
    justifyContent: "flex-end",
    cursor: "pointer",
  },
}));
