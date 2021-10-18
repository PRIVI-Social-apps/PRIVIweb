import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const transactionPageStyles = makeStyles(theme => ({
  container: {
    padding: "43px 53px 76px 33px",
    height: `calc(100vh - 104px)`,
    maxHeight: `calc(100vh - 104px)`,
    minHeight: `calc(100vh - 104px)`,
    lineHeight: "104.5%",
    overflowY: "auto",
    [theme.breakpoints.down("md")]: {
      padding: "45px 24px 100px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "45px 17px 67px",
    },
  },
  whiteBox: {
    background: "#FFFFFF",
    boxShadow: "0px 6px 36px -11px rgba(0, 0, 0, 0.02)",
    borderRadius: "12px",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  blueHeader: {
    color: "#4218B5",
    fontSize: "18px",
  },
  balance: {
    fontFamily: "Agrandir GrandLight",
    fontSize: "32px",
    lineHeight: "120%",
    color: Color.MusicDAODark,
    fontWeight: 800,
    overflowWrap: "break-word",
  },
  txnRow: {
    display: "flex",
    justifyContent: "space-between",
  },

  header1: {
    fontSize: "20px",
    fontWeight: 400,
    color: Color.Black,
    fontFamily: "Agrandir",
  },
  header2: {
    fontSize: "16px",
    fontWeight: 800,
    color: Color.MusicDAODark,
    fontFamily: "Agrandir GrandLight",
  },
  header3: {
    fontSize: "14px",
    fontWeight: 400,
    color: "#707582",
    fontFamily: "Montserrat",
  },
  divider: {
    background: "#0000000d",
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
    height: "1px",
  },

  timeFilters: {
    display: "flex",
    alignItems: "center",
    padding: 0,
    borderRadius: "8px",
    border: "1px solid #F0F5F8",
  },
  timeFilter: {
    cursor: "pointer",
    padding: "10px 12px",
    color: "#181818",
    fontFamily: "Montserrat",
    fontSize: "14px",
    fontWeight: 500,
  },
  selectedTimeFilter: {
    backgroundColor: Color.MusicDAODark,
    borderRadius: "8px",
    color: "#FFFFFF",
    fontWeight: 600,
  },
}));
