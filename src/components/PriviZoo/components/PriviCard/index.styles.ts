import { makeStyles } from "@material-ui/core";

export const priviCardStyles = makeStyles(theme => ({
  container: {
    position: "relative",
    borderRadius: theme.spacing(2),
    boxShadow: "0px 15.4491px 60.249px -12.3592px rgba(0, 0, 0, 0.36)",
    border: "1px solid #E9E9E9",
    minHeight: "340px",
    overflow: "hidden",
    background: "white",
  },
  topImg: {
    width: "100%",
    height: "150px",
    objectFit: `cover`,
  },
  header1: {
    fontSize: "20px",
  },
  header2: {
    fontSize: "12px",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomBox: {
    borderTop: "1px solid #18181822",
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: theme.spacing(2),
  },
  shadowBox: {
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "16px",
    color: "black",
    fontSize: "10px",
    padding: theme.spacing(0.5),
    background: "white",
  },
  rateIcon: {
    marginRight: "4px",
    width: "12px",
    height: "12px",
  },
  emptyRateIcon: {
    marginRight: "4px",
    width: "12px",
    height: "12px",
  },
}));
