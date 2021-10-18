import { makeStyles } from "@material-ui/core";

export const modifyRulesModalStyles = makeStyles(theme => ({
  root: {
    width: "640px !important",
  },
  maxWidth: {
    width: "100%",
    "& *": {
      width: "100% !important",
    },
  },
  alertMessage: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));
