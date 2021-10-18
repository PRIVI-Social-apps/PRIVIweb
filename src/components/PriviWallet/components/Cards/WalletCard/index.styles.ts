import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const walletCardStyles = makeStyles(theme => ({
  walletTile: {
    background: "#ffffff",
    boxShadow: "0px 2px 14px rgba(0, 0, 0, 0.08)",
    borderRadius: "12px",
    marginBottom: "12px",
    padding: "20px 30px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    flexWrap: "wrap",
    "& > div": {
      [theme.breakpoints.down("md")]: {
        width: "50%",
        alignItems: "flex-start",
        marginRight: 0,
        marginBottom: "8px",
        "&:last-child": {
          marginTop: "8px",
          flexDirection: "row",
          width: "100%",
          "& button": {
            width: "100%",
            marginTop: "0 !important",
            "&:first-child": {
              marginRight: "7px",
            },
          },
        },
      },
    },
  },
  icon: {
    background: "#ffffff",
    boxShadow: "0px 4px 12px -5px rgba(0, 0, 0, 0.25)",
    borderRadius: "50%",
    width: "58px",
    height: "58px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Montserrat",
  },
  title: {
    fontSize: "16px",
    color: Color.MusicDAODark,
    fontWeight: 600,
    lineHeight: "120%",
    marginBottom: "10px",
  },
  divider: {
    background: "#EFF2F8",
    width: "1px",
    height: "80px",
    margin: "0px 20px",
    [theme.breakpoints.down("md")]: {
      display: "none",
      margin: 0,
      width: 0,
    },
  },
  label: {
    marginBottom: "6px",
    color: "#707582",
    fontSize: "12px",
    lineHeight: "104.5%",
    fontWeight: 500,
  },
  balance: {
    color: Color.MusicDAODark,
    fontFamily: "Agrandir GrandLight",
    fontSize: "16px",
    fontWeight: 800,
  },
  address: {
    color: "#707582",
    fontFamily: "Agrandir",
    fontSize: "15px",
    lineHeight: "120%",
    textDecorationLine: "underline",
    marginRight: "11px",
  },
  buttons: {
    "& button": {
      marginLeft: "0px !important",
      "&:last-child": {
        marginTop: "9px",
        color: "#707582",
      },
    },
  },
}));
