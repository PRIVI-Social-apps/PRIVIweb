import { makeStyles } from "@material-ui/core";

export const individualBadgeModalStyles = makeStyles(theme => ({
  root: {
    width: "893px !important",
    color: "#707582",
    fontSize: 14,
    "& *": {
      color: "#707582",
    },
    "& h5": {
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: 18,
      lineHeight: "104.5%",
      margin: 0,
    },
    "& h4": {
      margin: 0,
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 18,
      lineHeight: "104.5%",
    },
    "& h3": {
      margin: 0,
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 22,
      lineHeight: "104.5%",
    },
    "& p": {
      marginTop: 8,
      marginBottom: 0,
      fontSize: 14,
      lineHeight: "120%",
    },
  },
  hexagonSection: {
    width: 64,
    height: 64,
    minWidth: 64,
    minHeight: 64,
    background: "#ff79d1",
    "& -webkit-clip-path": "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
    boxShadow: "0px 0px 6px #fd70d5",
  },
  tokenImage: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
    margin: 0,
    borderRadius: 0,
  },
  badgeTitleType: {
    border: "1px solid #707582",
    boxSizing: "border-box",
    borderRadius: 36,
    padding: "7px 12px 6px 12px",
    color: "#707582",
    display: "inline-block",
    marginLeft: 10,
    textTransform: "uppercase",
    fontSize: 11,
  },
  socialContent: {
    display: "flex",
    alignItems: "center",
    "& img": {
      width: 18,
      height: 18,
    },
  },
}));
