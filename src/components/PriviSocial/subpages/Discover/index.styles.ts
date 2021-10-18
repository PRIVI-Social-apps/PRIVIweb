import { makeStyles } from "@material-ui/core";

export const discoverStyles = makeStyles(theme => ({
  slider: {
    width: "100%",
    maxWidth: 515,
    marginRight: 32,
  },
  inputSearch: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "19.5px 19.5px 17.5px",
    background: "#f7f9fe",
    border: "1px solid #e0e4f3",
    boxSizing: "border-box",
    borderRadius: 10,
    height: 56,
    width: "100%",
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
      "&::placeholder": {
        color: "#abb3c4",
      },
    },
    "& img": {
      width: 17,
      height: 17,
    },
  },
  title: {
    "& h4": {
      margin: 0,
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: 28,
      lineHeight: "40px",
      color: "#707582",
    },
    "& span": {
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: 11,
      textTransform: "uppercase",
      color: "#707582",
      cursor: "pointer",
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
  horizontalFilterBox: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-end",
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  verticalFilterBox: {
    width: "100%",
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
}));
