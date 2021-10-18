import { makeStyles } from "@material-ui/core";

export const socialTokenCardStyles = makeStyles(theme => ({
  socialTokenCard: {
    background: "#eff2f8",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: 16,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    color: "#707582",
    fontSize: 14,
    h4: {
      margin: 0,
      color: "#707582",
      fontSize: 16,
    },
  },
  tokenImageContainer: {
    background: "#ffffff",
    width: 121,
    height: 121,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    "& img": {
      objectFit: "cover",
      borderRadius: "50%",
      width: 58,
      height: 58,
    },
  },
}));
