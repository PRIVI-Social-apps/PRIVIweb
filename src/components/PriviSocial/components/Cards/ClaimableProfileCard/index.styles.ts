import { makeStyles } from "@material-ui/core";

export const claimableProfileCardStyles = makeStyles(theme => ({
  claimableProfileCard: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderRadius: 19.3,
    position: "relative",
    boxShadow: "0px 1.93264px 11.5959px rgba(0, 0, 0, 0.1)",
    color: "#707582",
    "& img.image": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  header: {
    borderRadius: "19.3px 19.3px 0px 0px",
    height: 156.54,
    width: "100%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  actions: {
    background: "#181818",
    border: "1.93264px solid #ffffff",
    borderRadius: 17.3938,
    display: "flex",
    alignItems: "center",
    height: 30,
    padding: "0px 14px",
    width: 74,
    justifyContent: "space-between",
    "& img": {
      cursor: "pointer",
    },
  },
  fruitsContainer: {
    borderRadius: "50%",
    padding: 4,
    width: 24,
    height: 24,
    background: "#707582",
    boxShadow: "0px 1.19599px 4.78395px rgba(0, 0, 0, 0.12)",
    "& img": {
      width: 16,
      height: 16,
    },
  },
}));
