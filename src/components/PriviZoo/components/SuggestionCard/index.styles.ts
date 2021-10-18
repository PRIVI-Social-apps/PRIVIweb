import { makeStyles } from "@material-ui/core";

export const suggestionCardStyles = makeStyles(theme => ({
  container: {
    position: "relative",
    borderRadius: theme.spacing(2),
    minHeight: "250px",

    "& img": {
      borderRadius: theme.spacing(2),
    },
  },
  header1: {
    fontSize: "20px",
  },
  header2: {
    fontSize: "12px",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rateIcon: {
    marginRight: "4px",
    width: "12px",
    height: "12px",
  },
  emptyRateIcon: {
    marginRight: "4px",
    width: "12px",
    height: "12px",
  },
}));
