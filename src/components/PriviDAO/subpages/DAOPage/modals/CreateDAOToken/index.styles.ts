import { makeStyles } from "@material-ui/core";
import { Gradient } from "shared/ui-kit";

export const useCreateDAOTokenStyles = makeStyles(() => ({
  root: {
    width: "auto !important",
    "& > svg": {},
  },
  content: {
    width: "640px",
    display: "flex",
    flexDirection: "column",
    "& label": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      display: "flex",
      alignItems: "center",
      color: "white",
      "& img": {
        marginLeft: "4px",
        width: "12px",
        height: "12px",
      },
    },
  },
  stepsBorder: {
    borderBottom: "1.5px solid #707582",
    width: "80%",
    marginLeft: "10%",
    marginTop: "18px",
    marginBottom: "-18px",
  },
  steps: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "40px",
    "& div": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "calc(100% / 4)",
      color: "white",
      fontWeight: "normal",
      fontSize: "14px",
    },

    "& button": {
      background: "rgba(63, 63, 64, 1)",
      boxSizing: "border-box",
      color: "white",
      marginBlockEnd: "12px",
      width: "34px",
      height: "34px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      borderRadius: "50%",
      fontSize: "14px",
      fontWeight: "normal",
    },
  },
  selected: {
    fontSize: "14px",
    lineHeight: "120%",

    "& button": {
      background: Gradient.BlueMagenta,
      color: "white",
      border: "none",
    },
  },

  radioGroup: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    marginBottom: "45px",
    alignItems: "center",
    justifyContent: "space-between",
    "& *": {
      fontFamily: "Agrandir",
      color: "white",
    },
  },

  infoMessage: {
    margin: "-20px 0px 25px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "16px 23px 17px 17px",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    color: "#707582",
    borderRadius: "6px",
    border: "1px solid #E0E4F3",
    "& img": {
      marginRight: "16px",
      width: "18px",
      height: "18px",
    },
    "& p": {
      margin: 0,
    },
  },
}));
