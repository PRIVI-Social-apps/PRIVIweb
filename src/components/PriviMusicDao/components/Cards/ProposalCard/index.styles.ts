import { makeStyles } from "@material-ui/core";

export const proposalCardStyles = makeStyles(theme => ({
  card: {
    background: "#ffffff",
    borderRadius: theme.spacing(2.5),
    minHeight: 537,
    position: "relative",
    cursor: "pointer",
    boxShadow: "0px 30px 35px -12px rgba(29, 103, 84, 0.03)",
    [theme.breakpoints.down("sm")]: {
      minWidth: 340,
      maxWidth: 340,
    },
  },
  content: {
    padding: "27px 30px 0px 30px",
  },
  footer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
    height: "fit-content",
    padding: "28px 30px",
    borderBottomLeftRadius: theme.spacing(2.5),
    borderBottomRightRadius: theme.spacing(2.5),
  },
  nameSection: {
    display: "flex",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
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
  name: {
    fontSize: "14px",
    fontWeight: 600,
  },
}));
