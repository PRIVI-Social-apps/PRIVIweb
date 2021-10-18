import { makeStyles } from "@material-ui/core";

export const saluteModalStyles = makeStyles(theme => ({
  contentBox: {
    padding: theme.spacing(1),
    color: "#2D3047",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: "18px",
    fontWeight: 600,
  },
  header2: {
    fontSize: "16px",
    fontWeight: 600,    
    color: '#2D3047aa'
  },
}));
