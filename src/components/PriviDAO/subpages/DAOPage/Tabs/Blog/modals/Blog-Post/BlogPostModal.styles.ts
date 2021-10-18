import { makeStyles } from "@material-ui/core";

export const blogPostModalStyles = makeStyles(() => ({
  root: {
    width: "640px !important",
    "& p": {
      margin: 0,
      color: "white",
    },
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    backgroundColor: "white",
  },
  commentButtonWrapper: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    jusitfyContent: "space-between",
    padding: "16px",
    background: "rgba(255, 255, 255, 0.16)",
    border: "1px solid #FFFFFF",
    "& input": {
      fontSize: "14px",
      width: "100%",
      background: "transparent",
      color: "white",
      border: "none",
      outline: "none",
    },
    "& button": {
      background: "transparent",
      width: "auto",
      minWidth: "auto",
      borderRadius: 0,
      height: "auto",
      padding: "0px 10px 0px 0px",
    },
  },
  postImage: {
    width: "100%",
    height: "auto",
    borderRadius: "14px",
  },
  reactPlayer: {
    height: 180,
    borderRadius: "14px",
    transform: "none",
    width: "100% !important",
    cursor: "pointer",
    "& video": {
      borderRadius: "14px",
      height: "auto",
    },
  },
  reactPlayerModal: {},
}));
