import { makeStyles } from "@material-ui/core";

export const createPodModalStyles = makeStyles(() => ({
  root: {},
  headerCreatePod: {
    fontFamily: "Agrandir GrandLight",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "22px",
    lineHeight: "130%",
    color: "#2D3047",
    marginBottom: "35px",
    textAlign: "center",
    "& span": {
      color: "#7F6FFF",
      marginLeft: "10px",
    },
  },
  warningScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& img:first-child": {
      marginTop: 20,
    },
    "& h3": {
      marginTop: 22,
      marginBottom: 14,
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: 22,
      textAlign: "center",
      color: "#2D3047",
      fontFamily: "Agrandir GrandLight",
    },
    "& p": {
      fontStyle: "normal",
      fontSize: 16,
      fontWeight: 500,
      lineHeight: "160%",
      textAlign: "center",
      color: "#54658F",
      marginTop: 0,
      marginBottom: "18px",
    },
    "& path:first-child": {
      fill: "#FF8E3C",
    },
    "& path:nth-child(2)": {
      stroke: "#FF8E3C",
    },
    "& button": {
      height: "59px",
      borderRadius: "48px",
      padding: "20px 60px",
      fontFamily: "Montserrat",
      fontWeight: 800,
      lineHeight: "20px",
      border: "none",
      maxWidth: "auto",
      color: "#FFFFFF",
      background: "#2D3047",
    },
  },
  warningContainer: {
    background: "rgba(231, 218, 175, 0.3)",
    borderRadius: "49px",
    height: "39px",
    width: "39px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "11px",
  },
  modalContent: {
    padding: "20px 30px",
    display: "flex",
    flexDirection: "column",
  },
  cardsOptions: {
    height: "48px",
    padding: "16.5px 14px",
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    marginBottom: 40,
    background: "#F0F5F8",
    borderRadius: "68px",
  },

  tabHeaderPodMedia: {
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 14,
    fontFamily: "Montserrat",
    cursor: "pointer",
    marginRight: "25px",
    color: "#181818",
    padding: "10px 17px",
    "&:last-child": {
      marginRight: 0,
    },
  },
  tabHeaderPodMediaSelected: {
    color: "#FFFFFF",
    background: "#2D3047",
    borderRadius: "77px",
  },
  tooltipHeaderInfo: {
    width: 14,
    height: 14,
    margin: 0,
    marginLeft: 3,
    transform: "translateY(-1px)",
  },
  flexCenterCenterRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  popper: {
    maxWidth: 131,
    fontFamily: "Agrandir",
    fontSize: 11,
  },
  popperArrow: {
    "&::before": {
      borderColor: "#EFF2F8",
      backgroundColor: "#EFF2F8",
    },
  },
  tooltip: {
    padding: "22px 9px",
    borderColor: "#EFF2F8",
    backgroundColor: "#EFF2F8",
    color: "#707582",
    fontFamily: "Agrandir",
    fontSize: 11,
    textAlign: "center",
  },
  buttons: {
    justifyContent: "space-between",
    width: "100%",
    marginTop: "24px",
    "& button": {
      height: "59px",
      borderRadius: "48px",
      padding: "20px 60px",
      fontFamily: "Montserrat",
      fontWeight: 800,
      lineHeight: "20px",
      border: "none",
      maxWidth: "auto",
      "&:first-child": {
        background: "#FFFFFF",
        color: "#2D3047",
        border: "1px solid #2D3047",
      },
      "&:last-child": {
        color: "#FFFFFF",
        background: "#2D3047",
      },
    },
  },
}));
