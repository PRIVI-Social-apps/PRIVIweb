import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const BTCtoPriviStyles = makeStyles(theme => ({
  blueBox: {
    display: "flex",
    alignItems: "center",
    padding: "50px 32px 48px 8px",
    borderRadius: "20px",
    width: "100%",
    background: "linear-gradient(139.22deg, #785CEA 34.7%, #5434D0 82.76%)",
    [theme.breakpoints.down("md")]: {
      padding: "50px 14px 56px 0px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "42px 14px 60px",
    },

    "& label": {
      fontFamily: "Agrandir GrandLight",
      color: Color.White,
      fontWeight: 800,
      fontize: "16px",
      lineHeight: "120%",
    },

    "& .MuiInputBase-root": {
      marginTop: "10.12px",
      background: "#F7F9FE",
      border: "2px solid #CACACA",
      boxSizing: "border-box",
      borderRadius: "8px",
      color: "#181818",
      fontFamily: "Agrandir",
      fontSize: "16px",
      height: "56px",
      width: "100%",
      paddingLeft: "13.3px",
      paddingRight: "14.79px",
    },
  },
  moneyTree: {
    marginRight: "16px",
    marginTop: "-11px",
    width: "193.39px",
    height: "231.67px",
    [theme.breakpoints.down("sm")]: {
      marginRight: "12.26px",
      marginTop: "0px",
      width: "113.74px",
      height: "136.26px",
      marginBottom: "18.14px",
    },
    [theme.breakpoints.down("xs")]: {
      display: "none",
      width: 0,
    },
  },
  input: {
    "& img": {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
    },

    "& .MuiInputBase-root": {
      marginTop: "10.12px",
      background: "#F7F9FE",
      border: "2px solid #CACACA",
      boxSizing: "border-box",
      borderRadius: "8px",
      color: "#181818",
      fontFamily: "Agrandir",
      fontSize: "16px",
    },
  },
  select: {
    minHeight: "56px !important",
    height: "56px",
    marginTop: "10.12px",
    background: "#F7F9FE",
    border: "2px solid #CACACA",
    boxSizing: "border-box",
    borderRadius: "8px",
    fontWeight: 800,
    color: "#181818",
    fontFamily: "Agrandir",
    fontSize: "14px",
  },
  info: {
    color: Color.White,
    lineHeight: "120%",
    fontFamily: "Montserrat",
    "& > div:first-child": {
      fontSize: "14px",
      fontWeight: 500,
      opacity: 0.7,

      "& svg": {
        marginLeft: "3px",
        width: "12px",
        height: "12px",
      },
    },
    "& > div:last-child": {
      fontSize: "16px",
      fontWeight: 600,
    },
  },
}));
