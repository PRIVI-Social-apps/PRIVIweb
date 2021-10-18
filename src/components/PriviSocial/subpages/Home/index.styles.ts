import { makeStyles } from "@material-ui/core";
import { Gradient } from "shared/ui-kit";

export const homeStyles = makeStyles(theme => ({
  home: {
    minHeight: "calc(100vh - 96px)",
    color: "#707582",
    "& h2": {
      color: "#707582 !important",
    },
  },
  navigation: {
    marginBottom: 28,
    fontSize: 14,
    display: "flex",
  },
  tabCard: {
    marginRight: 80,
    color: "#707582",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 8,
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      marginRight: 10,
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: 0,
    },
  },
  tabCardSelected: {
    background: "#eff2f8",
    borderRadius: 8,
  },
  subTab: {
    marginRight: 11,
    borderRadius: 24,
    padding: "11px 0px",
    display: "flex",
    justifyContent: "center",
    width: 110,
    fontWeight: 800,
    fontSize: 14,
    lineHeight: "18px",
    backdropFilter: "blur(10px)",
    cursor: "pointer",
    background: "transparent",
    border: "1.5px solid #707582",
    color: "#707582",
    "&:last-child": {
      marginRight: 0,
    },
  },
  subTabSelected: {
    marginRight: 11,
    borderRadius: 24,
    padding: "11px 0px",
    display: "flex",
    justifyContent: "center",
    width: 110,
    fontWeight: 800,
    fontSize: 14,
    lineHeight: "18px",
    backdropFilter: "blur(10px)",
    cursor: "pointer",
    color: "#ffffff",
    background: "#707582",
  },
  header: {
    height: 215,
    borderRadius: "16px 16px 0px 0px",
    background:
      "conic-gradient( from 111.31deg at 50% 51.67%, #b1ff00 -118.12deg, #00ff15 110.62deg, #b1ff00 241.88deg, #00ff15 470.63deg)",
    cursor: 'pointer'
  },
  avatar: {
    border: "4px solid #ffffff",
    marginLeft: 40,
    marginTop: -80,
    width: 160,
    height: 160,
    borderRadius: "50%",
  },
  statLine: {
    display: "flex",
    alignItems: "center",
    color: "#707582",
    justifyContent: "space-between",
  },
  indexBadge: {
    "& .hex": {
      marginRight: 0,
    },
    width: 40,
    "&:not(:last-child)": {
      marginRight: -25,
    },
  },
  badgeMore: {
    cursor: "pointer",
    marginLeft: 10,
    zIndex: 2,
    background: Gradient.Green,
    color: "white",
    borderRadius: 10,
    padding: "4px 8px",
  },
}));
