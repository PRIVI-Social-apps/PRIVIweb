import { makeStyles } from "@material-ui/core";

export const podCardStyles = makeStyles(theme => ({
  podCard: {
    background: "#ffffff",
    borderRadius: theme.spacing(2),
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },

  podImageContent: {
    height: "264px",
    borderRadius: theme.spacing(2),
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    left: theme.spacing(2),
  },

  podImage: {
    width: "100%",
    height: "100%",
    borderRadius: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  playButtonBox: {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    borderRadius: "18px",
    background: "#7f6fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: "100%",
    border: "2px solid #ffffff",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    position: "absolute",
    bottom: 0,
    left: theme.spacing(2),
    transform: "translate(0, 50%)",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  podStatus: {
    background: "linear-gradient(97.4deg, #ff79d1 14.43%, #db00ff 79.45%)",
    borderRadius: theme.spacing(3),
    padding: "8px 18px",
    fontWeight: "bold",
    fontSize: "14px",
    color: "white",
    textTransform: "capitalize",
  },

  userGroup: {
    borderRadius: "50%",
    width: theme.spacing(4),
    height: theme.spacing(4),
  },

  podInfo: {
    marginTop: "264px",
    padding: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
    flexGrow: 1,
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "column",
  },

  podInfoName: {
    fontWeight: 700,
    fontSize: "20px",
    color: "black",
    marginTop: theme.spacing(2),
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",

    "&:hover": {
      cursor: "pointer",
    },
  },

  podMainInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: `0 ${theme.spacing(2)}px`,
    marginTop: theme.spacing(1),

    "& span": {
      fontSize: "14px",
      fontWeight: 600,
      color: "#2D3047",
    },

    "& p": {
      fontSize: "18px",
      fontWeight: 800,
      color: "#65CB63",
      margin: 0,
    },
  },

  podMainInfoContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    "& div": {
      display: "flex",
      flexDirection: "column",
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    "& div": {
      fontSize: "14px",
      color: "#707582",
    },
  },
  divider: {
    width: "100%",
    height: "1px",
    background: "#000",
    opacity: 0.05,
    margin: "16px 0",
  },
  socialButtons: {
    display: "flex",
    alignItems: "center",
    background: "#FEECD7",
    border: "2px solid #ffffff",
    borderRadius: "32px",
    transform: "translate(0, 50%)",
    columnGap: "4px",
    position: "absolute",
    bottom: 0,
    right: "16px",
  },
  clickable: {
    cursor: "pointer",
  },
}));
