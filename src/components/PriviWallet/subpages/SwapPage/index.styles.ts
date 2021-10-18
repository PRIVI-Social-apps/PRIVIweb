import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const swapPageStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "30px 52px 60px",
    height: `calc(100vh - 104px)`,
    overflowY: "auto",
    [theme.breakpoints.down("md")]: {
      padding: "45px 24px 100px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "45px 17px 67px",
    },
  },
  types: {
    alignSelf: "center",
    width: "fit-content",
    background: "rgba(255, 255, 255, 0.4)",
    borderRadius: "20px",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& div:first-child img": {
      transform: "rotate(6.56deg)",
      width: "30.41px",
      height: "30.41px",
      marginRight: "10.31px",
    },
    "& div:last-child img": {
      transform: "rotate(-10.64deg)",
      width: "18.82px",
      height: "26.06px",
      marginRight: "10.69px",
    },
  },
  type: {
    cursor: "pointer",
    padding: "14px 30px 14px 20px",
    display: "flex",
    alignItems: "center",
    borderRadius: "16px",
    background: "transparent",
    "& *": {
      color: Color.MusicDAOLightBlue,
    },
    "& img": {
      filter: "grayscale(100%)",
    },
  },
  typeSelected: {
    background: "#FFFFFF",
    "& img": {
      filter: "none",
    },
    "& div div:first-child": {
      color: Color.MusicDAODark,
    },
  },
  header1: {
    fontSize: "14px",
    fontWeight: 800,
    lineHeight: "120%",
    fontFamily: "Agrandir GrandLight",
    color: Color.MusicDAODark,
    marginBottom: "4px",
  },
  header2: {
    fontWeight: 500,
    fontFamily: "Montserrat",
    color: Color.MusicDAOLightBlue,
    fontSize: "12px",
  },
  blueBox: {
    flexGrow: 1,
    display: "flex",
    height: "calc(100% - 20px - 53px)",
    flexDirection: "column",
    background: "#4218B5",
    color: Color.White,
    boxShadow: "0px 6px 36px -11px rgba(0, 0, 0, 0.02)",
    borderRadius: "20px",
    "& h3": {
      marginTop: 0,
      fontFamily: "Agrandir GrandLight",
      fontSize: "21px",
      fontWeight: 800,
      lineHeight: "120%",
      marginBottom: "16px",
    },
    "& .MuiInput-root": {
      "&:not(.Mui-disabled)": {
        background: "rgba(247, 249, 254, 0.8)",
        border: "1px solid #EBEBEB",
      },
    },
  },
  swapBox: {
    background: "#FFFFFF",
    border: "1px solid #FFFFFF",
    boxSizing: "border-box",
    boxShadow: "0px 9px 36px -11px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    flexGrow: 1,
    "& > div": {
      width: "100%",
      height: "100%",
    },
  },
  divider: {
    width: "80%",
    opacity: "0.05",
    marginTop: "28px",
    marginBottom: "28px",
    height: "1px",
    background: "#000000",
  },
  walletLabel: {
    color: "#707582",
    fontFamily: "Montserrat",
    fontSize: "14px",
    fontWeight: 500,
    marginRight: "4px",
  },
  walletButton: {
    color: Color.White,
    fontSize: "14px",
    width: "fit-content",
    padding: "9px 22px",
    background: "linear-gradient(45.49deg, #8F66FF -18.05%, #4218B5 113.67%)",
    borderRadius: "8px",
    "& span": {
      marginLeft: "7px",
      opacity: 0.9,
    },
  },

  buttonSwap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "50%",
    background: "#4218B5",
    boxSizing: "border-box",
    margin: "0px -20px 0px -20px",
    padding: "0px 12px",
    height: "40px",
    minWidth: "40px",
    width: "40px",

    "& img": {
      height: "10px",

      "&:last-child": {
        marginLeft: "4px",
        transform: "rotate(180deg)",
      },
    },
  },
  initButton: {
    width: "100%",
    marginTop: "20px",
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
    height: "53px",
    maxHeight: "53px",
    borderRadius: "12px",
    fontWeight: "normal",
    "& img": {
      transform: "rotate(180deg)",
      wiidth: "4px",
    },
  },
  dividerWhite: {
    background: "#FFFFFF",
    opacity: 0.21,
    width: "100%",
    height: "1px",
    bmarginTop: "12px",
    marginBottom: "12px",
  },
  networkBox: {
    background: "rgba(255, 255, 255, 0.12)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "36px",
    width: "100%",
    color: Color.White,
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "104.5%",
    "& img": {
      height: "18px",
      width: "18px",
      borderRadius: "50%",
      marginRight: "8px",
    },
    "&:first-child": {
      marginBottom: "7px",
    },
    "&:last-child": {
      marginTop: "7px",
    },
    "& svg:first-child": {
      marginRight: "1px",
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  borderBox: {
    flexGrow: 1,
    width: "100%",
    border: "1px solid #FFFFFF",
    boxShadow: "0px 9px 36px -11px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    background: "white",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: "20px 28px 40px",
  },
  buttons: {
    "& button": {
      width: "182px",
      marginBottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  },
  stepsBorder: {
    borderBottom: "0.858716px solid #9897B8",
    width: "calc(100% - 25px)",
    marginLeft: "10px",
    marginTop: "18px",
    marginBottom: "-18px",
  },
  steps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "22px",
    "& div": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "calc(100% / 4)",
      color: "#54658F",
      fontWeight: "normal",
      fontSize: "14px",
    },

    "& button": {
      background: "#E5E5E5",
      border: "0.858716px solid #9897B8",
      boxSizing: "border-box",
      color: "#9897B8",
      marginBlockEnd: "12px",
      width: "40.36px",
      height: "40.36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      borderRadius: "50%",
      fontSize: "14px",
      fontWeight: "normal",
    },

    "& div:first-child": {
      alignItems: "flex-start",

      "& button": {
        marginLeft: "10px",
      },
    },

    "& div:nth-child(2)": {
      marginRight: "8%",
    },

    "& div:last-child": {
      alignItems: "flex-end",
      "& button": {
        marginRight: "15px",
      },
      "& span": {
        marginRight: "15px",
      },
    },
  },
  selectedStep: {
    fontSize: "14px",
    lineHeight: "120%",
    color: `${Color.Black} !important`,

    "& button": {
      background: "#4218B5",
      color: "white",
      border: "none",
    },
  },
  tokenImage: {
    width: 37,
    height: 37,
    marginRight: 18,
    borderRadius: "50%",
  },
  completeImg: {
    filter: "drop-shadow(0px 14.7484px 19.0457px rgba(15, 0, 106, 0.18))",
    transform: "rotate(-13.94deg)",
    width: "98px",
    height: "98px",
    marginBottom: "-25px",
  },

  shadowBox: {
    background: "rgba(63, 215, 206, 0.1)",
    border: "1px solid rgba(63, 215, 206, 0.1)",
    boxSizing: "border-box",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
  },
}));
