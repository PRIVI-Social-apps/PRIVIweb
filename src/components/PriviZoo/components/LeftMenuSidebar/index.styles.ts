import { makeStyles } from "@material-ui/core";

export const leftMenuSidebarStyles = makeStyles(theme => ({
  listItem: {
    padding: theme.spacing(0),
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2) !important",
    },
    "&:hover span": {
      color: `${theme.palette.primary.main} !important`,
    },
    "&:hover a": {
      color: `${theme.palette.primary.main} !important`,
    },
  },
  listItemNormal: {
    backgroundColor: "rgba(1,1,1,0)",
  },
  listItemSelected: {
    color: theme.palette.primary.main,
  },
  menuBox: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    padding: theme.spacing(2),
  },
  menuTextNormal: {
    color: "black",
    textDecoration: "none !important",
    transition: "0.35s",
  },
  menuText: {},
  menuTextHide: {
    display: "none",
  },
  menuTextSelected: {
    color: theme.palette.primary.main,
  },
  whiteText: {
    color: "white",
  },
  primaryText: {
    color: theme.palette.primary.main,
    fontWeight: 700,
  },
  hide: {
    display: "none",
  },
}));
