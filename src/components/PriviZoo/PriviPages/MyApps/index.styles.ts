import { makeStyles } from "@material-ui/core";

export const myAppsPageStyles = makeStyles(theme => ({
  contentBox: {
    padding: `0px ${theme.spacing(20)}px`,
    marginTop: theme.spacing(3),
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: `0px ${theme.spacing(10)}px`,
    },
    [theme.breakpoints.down("xs")]: {
      padding: `0px ${theme.spacing(5)}px`,
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  title2: {
    fontSize: "25px",
    fontWeight: 400,
  },
  cardsGrid: {
    display: "grid",
    gridColumnGap: "20px",
    gridRowGap: "20px",
    width: "100%",
  },
}));
