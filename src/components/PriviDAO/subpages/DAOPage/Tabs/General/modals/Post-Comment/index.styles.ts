import { makeStyles } from "@material-ui/core";
import { Gradient } from "shared/ui-kit";

export const postCommentModalStyles = makeStyles(() => ({
  modalContant: {
    color: "white",
    fontSIze: "18px",
  },
  podImage: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    height: "100%",
  },
  header: {
    height: 218,
  },
  gradient: {
    background: "white",
    fontWeight: 800,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: 14,
  },
  gradientGreen: {
    background: Gradient.BlueMagenta,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: 14,
    cursor: "pointer",
  },
  verified: {
    width: 19,
    height: 19,
    marginLeft: 8,
    marginRight: 8,
  },
  level: {
    border: "1px solid white",
    borderRadius: 35,
    padding: "3px 7px 0",
    fontSize: 11,
    color: "white",
  },
  input: {
    color: "white",
    fontSize: 14,
    paddingLeft: 26,
    paddingTop: 16,
    border: "1px solid #FFFFFF",
    background: "rgba(255, 255, 255, 0.12)",
    resize: "none",
    width: "100%",
    marginTop: 8,
  },
  label: {
    "& img": {
      marginLeft: 5,
      height: 16,
    },
  },
  messageBox: {
    maxHeight: "250px",
    overflow: "auto",
    padding: "10px",
    border: "1px solid rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    marginTop: "16px",
  },
  messageItem: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: 8,
    borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
  },
  name: {
    fontSize: "16px",
  },
  message: {
    fontSize: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "20px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "-2px 7px 15px -9px rgb(148 148 148 / 66%)",
  },
}));
