import { makeStyles } from "@material-ui/core";

export const mediaCardStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(4),
    background: "white",
    borderRadius: theme.spacing(2),
    position: "relative",
    overflowX: "hidden",
  },
  fractionBox: {
    color: "white",
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    fontSize: "12px",
    background: "#7F6FFF",
  },
  title: {
    fontSize: "26px",
    fontWeight: 800,
    textOverflow: "ellipsis",
    overflowX: "hidden",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: "12px",
    color: "grey",
  },
  header2: {
    fontSize: "16px",
    fontWeight: 400,
  },
  header3: {
    fontSize: "18px",
    fontWeight: 800,
    color: "black",
  },
  moreBox: {
    marginLeft: -theme.spacing(2),
    background: "white",
    borderRadius: theme.spacing(2),
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
  },
  typeBox: {
    display: "flex",
    alignItems: "center",
    background: "white",
    borderRadius: theme.spacing(2),
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,

    "& img": {
      width: "20px",
    },
  },
  radialLabelBox: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: theme.spacing(1),
  },
  menuBox: {
    position: "absolute",
    top: theme.spacing(4),
    right: theme.spacing(4),
    cursor: "pointer",
  },
}));
