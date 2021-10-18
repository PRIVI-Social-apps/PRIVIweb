import { makeStyles } from "@material-ui/core";

export const claimableProfileStyles = makeStyles(theme => ({
  content: {
    width: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 104px)",
    maxHeight: "calc(100vh - 104px)",
    position: "relative",
    [theme.breakpoints.down("md")]: {
      padding: "0px 30px 80px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0px 20px 80px",
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
