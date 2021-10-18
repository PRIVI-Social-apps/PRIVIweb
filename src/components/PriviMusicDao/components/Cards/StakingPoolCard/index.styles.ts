import { makeStyles } from "@material-ui/core";

export const stakingPoolCardStyles = makeStyles(theme => ({
  card: {
    background: "white",
    borderRadius: theme.spacing(4),
    padding: theme.spacing(4),
    minWidth: theme.spacing(30)
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  tokenImg: {
    position: "absolute",
    top: 0,
    left: 0,
    transform: 'translateY(-25%)',
    width: theme.spacing(5),
  },
  header1: {
    fontSize: "18px",
    fontWeight: 700,
  },
  header2: {
    fontSize: "14px",
    fontWeight: 600,
  },
  header3: {
    fontSize: "14px",
    fontWeight: 500,
  },
}));
