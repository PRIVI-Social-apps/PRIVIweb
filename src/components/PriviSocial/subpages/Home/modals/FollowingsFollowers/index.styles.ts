import { makeStyles } from "@material-ui/core";

export const profileFollowsModalStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "597px !important",
    fontSize: "16px",
    "& h3": {
      color: "#707582",
      margin: "18px 0px 16px",
      fontSize: 18,
    },
    "& h4": {
      color: "#000000",
      margin: 0,
      fontSize: "16px",
    },
    "& button": {
      borderRadius: 20,
      padding: "4px 12px 4px 10px",
      minHeight: 0,
      minWidth: 0,
      margin: 0,
      width: "auto",
      height: "auto",
      fontSize: 14,
      border: "none",
    },
  },

  filterPill: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "7px 14px 6px",
    borderRadius: 36,
    marginRight: 8,
    background: "#EFF2F8",
    fontSize: "14px",
    fontWeight: 800,
    color: "#707582",
    cursor: "pointer",
  },
  filterPillSelected: {
    color: "white !important",
    background:
      "conic-gradient(from 111.31deg at 50% 51.67%, #B1FF00 -118.12deg, #00FF15 110.62deg, #B1FF00 241.88deg, #00FF15 470.63deg) !important",
  },
  usersList: {
    maxHeight: "300px",
    overflowY: "auto",
  },
  slider: {
    width: "100%",
  },

  optionsConnectionButtonUnfollow: {
    background: "#707582",
    color: "white",
  },
  optionsConnectionButtonRequest: {
    background: "#EFF2F8",
    color: "#707582",
  },
  optionsConnectionButton: {
    background:
      "conic-gradient(from 111.31deg at 50% 51.67%, #B1FF00 -118.12deg, #00FF15 110.62deg, #B1FF00 241.88deg, #00FF15 470.63deg)",
    color: "white",
  },
}));
