import { makeStyles } from "@material-ui/core";

export const headerStyles = makeStyles(theme => ({
  headerBox: {
    width: "100%",
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "2px solid #18181822",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: "12px",
  },
  dotBox: {
    minWidth: theme.spacing(4),
    width: theme.spacing(4),
    height: theme.spacing(4),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "black",
    color: "white",
  },
  select: {
    "& > div": {
      paddingBottom: "11px",
      minWidth: "120px",
    },
  },
}));
