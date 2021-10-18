import { makeStyles } from "@material-ui/core";

export const wallFeedCardStyles = makeStyles(theme => ({
  wallItem: {
    display: "flex",
    flexDirection: "column",
    background: "#eff2f8",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: 16,
    width: "100%",
    fontSize: 14,
    color: "#707582",
    padding: 24,
    cursor: "pointer",
    h3: {
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: 14,
      lineHeight: "21px",
      margin: "0px 0px 8px",
    },
  },
  desc: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    "& p": {
      margin: 0,
      width: "100%",
      fontSize: 14,
      textAlign: "left",
      fontStyle: "normal",
      fontWeight: "normal",
      lineHeight: "21px",
      overflow: "hidden",
    },
    "& span": {
      cursor: "pointer",
      color: "#b1ff00",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: 14,
      lineHeight: "21px",
      marginTop: "-21px",
    },
  },
  shareButton: {
    marginLeft: 16,
    height: "auto",
    padding: 0,
    minHeight: 0,
    width: "auto",
    minWidth: 0,
    borderRadius: 0,
  },
  shareImg: {
    width: 19,
  },

  fruitsContainer: {
    background: "#707582",
    boxShadow: "0px 1.4852px 5.94081px rgba(0, 0, 0, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    width: 30,
    height: 30,
    padding: 10,
  },
  readMore: {
    fontWeight: 800,
  },
  postImage: {
    width: "100%",
    height: "auto",
    borderRadius: "14px",
  },
}));
