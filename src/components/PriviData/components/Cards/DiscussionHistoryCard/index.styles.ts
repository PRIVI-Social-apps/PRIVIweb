import { makeStyles } from "@material-ui/core";

export const discussionHistoryCardStyles = makeStyles(theme => ({
  content: {
    background: "#26254B",
    padding: '16px 35px 50px 35px',
    width: "100%",
    borderRadius: 12,
    marginBottom: 15,
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
  replyDate: {
    fontSize: 12,
    fontWeight: 500,
    color: '#788BA2'
  }
}));
