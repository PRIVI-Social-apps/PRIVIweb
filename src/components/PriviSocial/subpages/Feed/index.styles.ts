import { makeStyles, withWidth } from "@material-ui/core";

export const feedStyles = makeStyles(theme => ({
  slider: {
    width: "100%",
  },
  leftFriendContainer: {
    minWidth: 260,
    width: 260,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  topFriendContainer: {
    width: "100%",
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "block",
    },
  },
  friends: {
    padding: "24px 24px 32px",
    background: "#eff2f8",
    width: "100%",
    borderRadius: 16,
    justifyContent: "space-between",
  },
  inputSearch: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 16px 16px",
    background: "#f7f9fe",
    border: "1px solid #e0e4f3",
    boxSizing: "border-box",
    borderRadius: 10,
    "& input": {
      outline: "none",
      border: "none",
      padding: 0,
      margin: 0,
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 18,
      lineHeight: "104.5%",
      color: "#abb3c4",
      background: "transparent",
      width: "100%",
    },
    "& img": {
      width: 17,
      height: 17,
    },
  },
  createPostContainer: {
    width: "100%",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 18,
    lineHeight: "104.5%",
    color: "#abb3c4",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f7f9fe",
    border: "1px solid #e0e4f3",
    boxSizing: "border-box",
    borderRadius: 10,
    marginBottom: 40,
    paddingLeft: 16,
    cursor: "pointer",
    "& img": {
      marginRight: "8px",
    },
  },
  send: {
    background: "#abb3c4",
    borderRadius: "0px 8px 8px 0px",
    flex: "none",
    order: 2,
    flexGrow: 0,
    height: 40,
    width: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& img": {
      margin: 0,
      width: 17,
      height: 17,
    },
  },
  headerTitle: {
    [theme.breakpoints.down("md")]: {
      fontSize: "60px !important",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "40px !important",
    },
  },
}));
