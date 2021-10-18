import { makeStyles } from "@material-ui/core";

export const homepageStyles = makeStyles(theme => ({
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
  totalBalanceBox: {
    padding: "20px 23px",
    borderRadius: 10,
    boxShadow: `0px 2px 14px rgba(0, 0, 0, 0.08)`,
    background: "#ffffff",
  },
  walletTopBox: {
    background: "linear-gradient(180deg, #F0CFDA 0%, #EFCED9 100%)",
    padding: theme.spacing(2),
    marginLeft: -theme.spacing(1),
    height: "110px",
    borderRadius: 6,
    position: "relative",
  },
  topHeaderLabel: {
    fontSize: 18,
    fontWeight: 400,
    background: `linear-gradient(270.47deg, #D66DB2 -3.25%, #BB34D1 93.45%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  headerTotalBalanceTitle: {
    color: "#707582",
    fontSize: 18,
    fontWeight: 400,
    fontFamily: "Agrandir",
  },
  headerTotalBalanceValue: {
    fontSize: 32,
    fontWeight: 400,
    color: "#181818",
  },
  headerTotalBalancePlus: {
    fontSize: 18,
    fontWeight: 400,
    color: "#65CB63",
    marginLeft: "8px",
  },
  walletTopBoxBtn: {
    height: "22px !important",
  },
  startNowSection: {
    marginRight: 10,
    padding: 10,
  },
  closeButton: {
    width: 8,
    height: 8,
    position: "absolute",
    top: 8,
    right: 10,
    cursor: "pointer",
  },
  closeIcon: {
    width: 8,
    height: 8,
  },
  header1: {
    fontSize: 18,
    fontWeight: 400,
    color: "#181818",
  },
  header2: {
    fontSize: 14,
    fontWeight: 400,
    color: "#707582",
  },
  header3: {
    fontSize: 22,
    fontWeight: 400,
    color: "#181818",
  },
  flexBoxHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    marginBottom: 32,
  },
  graphBox: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2.5),
    border: `2px solid #18181822`,
    borderRadius: theme.spacing(2),
    height: "351px",
    margin: theme.spacing(1),
    position: "relative",
    background: "white",
  },
  valueBox: {
    position: "absolute",
    left: "60px",
    top: "70px",
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
  transactionSection: {
    margin: "60px 0",
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#181818",
  },
  transactionDate: {
    width: 200,
  },
}));
