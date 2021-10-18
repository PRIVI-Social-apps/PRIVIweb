import { makeStyles } from "@material-ui/core";

export const sideBarStyles = makeStyles(theme => ({
  menuItem: {
    "& span": {
      marginLeft: 12,
      color: "#565973",
    },
  },
  selected: {
    color: "#4218B5 !important",
  },
}));
