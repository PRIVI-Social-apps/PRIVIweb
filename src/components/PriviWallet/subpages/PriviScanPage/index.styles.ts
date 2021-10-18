import { makeStyles } from "@material-ui/core";

export const PriviScanPageStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(5),
    height: `calc(100vh - 80px)`,
    paddingBottom: "40px",
  },
  subContainer: {
    width: "100%",
    overflowY: "auto",
    scrollbarWidth: "none",
    height: "calc(100vh - 80px)",
    paddingBottom: "80px",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  shadowBox: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    background: `linear-gradient(272.2deg, #FF508A 0.52%, #FFCC4A 108.45%)`,
    boxShadow: `0px 2px 14px rgba(0, 0, 0, 0.08)`,
    color: "white",
  },
  walletTopBox: {
    background: "linear-gradient(180deg, #F0CFDA 0%, #EFCED9 100%)",
    padding: theme.spacing(2),
    marginLeft: -theme.spacing(1),
    height: "90px",
    borderRadius: theme.spacing(2),
  },
  topHeaderLabel: {
    background: `linear-gradient(270.47deg, #D66DB2 -3.25%, #BB34D1 93.45%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
  },
  header1: {
    fontSize: "14px",
  },
  header2: {
    fontSize: "12px",
  },
  flexBoxHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
  graphBox: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2.5),
    border: `2px solid #18181822`,
    borderRadius: theme.spacing(2),
    height: "300px",
    margin: theme.spacing(1),
    position: "relative",
    background: "white",
  },
  valueBox: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    boxShadow: `2px 2px 12px rgba(0, 0, 0, 0.1)`,
    background: "white",
  },
  graphHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  select: {
    "& > div": {
      paddingBottom: "11px",
      minWidth: "120px",
    },
  },
  inputBox: {
    padding: "8px",
    borderRadius: "4px",
    margin: "8px",
    width: theme.spacing(6),
  },
}));
