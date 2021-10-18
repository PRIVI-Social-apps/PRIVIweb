import { makeStyles } from "@material-ui/core";

export const badgesProfileModalStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "766px !important",
    "& h5": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 18,
      color: "#707582",
      margin: 0,
    },
  },
  badgesWrap: {
    width: "100%",
    marginLeft: -10,
    marginTop: -10,
    display: "flex",
    flexWrap: "wrap",
    overflowY: "auto",
    scrollbarWidth: "none",
    justifyContent: "space-between",
    padding: 10,
  },
}));
