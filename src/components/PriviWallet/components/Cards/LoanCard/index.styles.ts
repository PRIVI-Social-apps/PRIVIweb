import { makeStyles } from "@material-ui/core";
import { Color, Gradient } from "shared/ui-kit";

export const loanCardStyles = makeStyles(theme => ({
  loanCard: {
    background: "#ffffff",
    boxShadow: "0px 6px 36px -11px rgba(0, 0, 0, 0.02)",
    borderRadius: theme.spacing(0.5),
    padding: "22px 32px 14px",
    alignItems: "center",
    width: "100%",
    fontFamily: "Montserrat",
    color: Color.Black,
    lineHeight: "104.5%",
  },
  paybackBox: {
    background: "linear-gradient(97.4deg, rgba(35, 208, 198, 0.2) 14.43%, rgba(0, 204, 143, 0.2) 85.96%)",
    borderRadius: "6px",
    padding: "6px 10px",
    "& span": {
      background: Gradient.Mint,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "14px",
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    marginBottom: "32px",
    borderBottom: "1px dashed #1717171e",
    paddingBottom: "12px",
  },
  header1: {
    fontSize: "16px",
    fontWeight: 400,
    marginBottom: "7px",
    color: "#707582",
  },
  header2: {
    fontFamily: "Agrandir GrandLight",
    fontSize: "16px",
    fontWeight: 800,
    color: Color.MusicDAODark,
    marginBottom: "32px",
  },
  header3: {
    fontFamily: "Agrandir GrandLight",
    fontSize: "16px",
    fontWeight: 400,
    color: Color.MusicDAODark,
  },
  red: {
    color: "#F43E5F !important",
  },
  collateralBox: {
    marginTop: "26px",
    width: "calc(100% + 40px)",
    marginLeft: "-20px",
    borderRadius: "6px",
    background: "rgba(244, 62, 95, 0.2)",
    padding: "10px 19px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Agrandir",
  },
}));
