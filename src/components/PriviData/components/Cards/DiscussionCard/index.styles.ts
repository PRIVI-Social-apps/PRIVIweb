import { makeStyles } from "@material-ui/core";

export const discussionCardStyles = makeStyles(theme => ({
  content: {
    background: "rgba(52, 50, 104, 0.4)",
    padding: theme.spacing(3),
    width: "100%",
  },
  title: {
    fontSize: "14px",
    fontWeight: 600,
    color: "white",
  },
  subtitle: {
    fontSize: "13px",
    fontWeight: 500,
    color: "white",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  avatarBox: {
    position: "relative",
  },
  online: {
    width: theme.spacing(1),
    height: theme.spacing(1),
    background: "#57C74C",
    border: "1px solid #343268",
    borderRadius: theme.spacing(0.5),
    position: "absolute",
    top: 0,
    left: 0,
  },
  buttonBox: {
    background: "rgba(140, 138, 172, 0.4)",
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: "pointer",
  },
}));
