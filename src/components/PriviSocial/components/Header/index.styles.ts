import { makeStyles } from "@material-ui/core";

export const headerStyles = makeStyles(theme => ({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 40px",
    width: "100%",
    height: 96,
    background: "#eff2f8",
    [theme.breakpoints.down("sm")]: {
      padding: "24px 12px 24px 24px",
    },
  },
  navigation: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
  },
  route: {
    marginRight: 24,
    paddingRight: 24,
    borderRight: "1px solid #e0e4f3",
    fontSize: 18,
    lineHeight: "22px",
    display: "flex",
    alignItems: "center",
    height: 23,
    color: "#707582",
    cursor: "pointer",
    "&:last-child": {
      border: "none",
      margin: 0,
      padding: 0,
    },
  },
  routeSelected: {
    fontWeight: 800,
  },
  rightWrapper: {
    display: "flex",
    alignItems: "center",
  },
  icons: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    marginLeft: 8,
    cursor: "pointer",
    width: 48,
    height: 48,
    borderRadius: "50%",
    filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
    border: "2px solid #ffffff",
  },
  menuContent: {
    marginTop: 10,
    width: 180,
    marginRight: 20,
    padding: 16,
    background: "#f7f9fe",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: 8,
  },
  menuItem: {
    fontWeight: 400,
    fontStyle: "normal",
    fontSize: 14,
    lineHeight: "24px",
    display: "flex",
    alignItems: "center",
    color: "#707582",
    cursor: "pointer",
    marginBottom: 8,
    "&:last-child": {
      margin: 0,
    },
  },
  itemSelected: {
    fontWeight: 800,
  },
}));
