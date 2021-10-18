import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const managerPageStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(5),
    height: `calc(100vh - 80px)`,
    paddingBottom: "40px",
    [theme.breakpoints.down("md")]: {
      padding: "45px 24px 100px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "45px 17px 67px",
    },
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "linear-gradient(250.77deg, #FFFFFF 5.09%, rgba(255, 255, 255, 0) 171.95%)",
    boxShadow: "0px 6px 36px -11px rgba(0, 0, 0, 0.02)",
    borderRadius: "12px",
    padding: "18px",
    width: "100%",
    marginRight: "12px",
    "& > div": {
      display: "flex",
      flexDirection: "column",
      "& button": {
        width: "188px",
        marginLeft: "0px !important",
      },
      "& button:first-child": {
        background: "#4218B5",
        marginBottom: "7px",
      },
    },
  },

  headerTotalBalanceTitle: {
    color: "#4218B5",
    fontSize: 18,
    fontWeight: 400,
    fontFamily: "Agrandir",
    marginBottom: "10px",
  },
  headerTotalBalanceValue: {
    fontSize: 32,
    fontWeight: 900,
    color: Color.MusicDAODark,
    fontFamily: "Agrandir GrandLight",
  },
  walletTopBox: {
    background: "linear-gradient(135.85deg, #785CEA 24.63%, #5434D0 81.37%)",
    padding: theme.spacing(2),
    height: "110px",
    borderRadius: "12px",
    position: "relative",
    width: "443px",
    "& button": {
      border: "none",
    },
  },
  startNowSection: {
    padding: 10,
  },
  topHeaderLabel: {
    fontFamily: "Agrandir GrandLight",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: 400,
    lineHeight: "120%",
  },
  flexBoxHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    marginBottom: 32,
  },
  cardsGrid: {
    display: "grid",
    gridColumnGap: "20px",
    gridRowGap: "20px",
    width: "100%",
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
  manageWalletSection: {
    marginTop: 40,
  },
  manageWalletTitle: {
    fontFamily: "Agrandir GrandLight",
    fontSize: 22,
    fontWeight: 800,
    color: Color.MusicDAODark,
    marginBottom: "26px",
  },
}));
