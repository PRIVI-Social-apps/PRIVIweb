import { makeStyles } from "@material-ui/core";

export const bottomStyles = makeStyles(theme => ({
  contentBox: {
    padding: `0px ${theme.spacing(20)}px`,
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
  header1: {
    fontSize: "12px",
  },
  title: {
    fontSize: "35px",
    fontWeight: 800,
    background: "radial-gradient(427.58% 951.54% at 39.31% -84.13%, #000000 0%, #DBDDF0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  title2: {
    fontSize: "25px",
    fontWeight: 400,
  },
  bottomBox: {
    background: "#F7F8FB",
    borderTop: "1px solid #18181822",
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  snsBox: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    background: "#D9F66F",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
}));
