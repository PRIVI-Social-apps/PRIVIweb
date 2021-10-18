import { makeStyles } from "@material-ui/core";

export const voteCardStyles = makeStyles(theme => ({
  card: {
    background: "#ffffff",
    borderRadius: theme.spacing(2.5),
    boxShadow: "0px 30px 35px -12px rgba(29, 103, 84, 0.03)",
    cursor: "pointer",
    position: "relative",
    minHeight: 470,
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
}));
