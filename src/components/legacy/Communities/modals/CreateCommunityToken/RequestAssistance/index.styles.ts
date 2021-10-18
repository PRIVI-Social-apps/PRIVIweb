import { makeStyles } from "@material-ui/core";
import { Gradient } from "shared/ui-kit";

export const requesetAssistanceModalStyles = makeStyles(() => ({
  appbarContainer: {
    width: "100%",
    marginBottom: "20px",
  },
  appbar: {
    marginLeft: 0,
    backgroundColor: "transparent !important",
    boxShadow: "none !important",
  },
  tabs: {
    marginLeft: 0,
    backgroundColor: "transparent !important",
    boxShadow: "none !important",
  },
  tab: {
    whiteSpace: "inherit",
    marginLeft: 0,
    color: "#abb3c4",
    boxShadow: "none !important",
    fontWeight: "bold",
    fontSize: "22px",
    fontFamily: "Agrandir",
    textTransform: "none",
    padding: "0px",
    minHeight: "auto !important",
    minWidth: "auto !important",
    marginRight: "38px",
  },
  selectedTab: {
    color: "transparent",
    background: Gradient.Mint,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  content: {
    width: "600px",
    display: "flex",
    flexDirection: "column",
    "& h5": {
      margin: "0px 0px 16px",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "18px",
      color: "#181818",
    },
    "& label": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      display: "flex",
      alignItems: "center",
      color: "#181818",
      "& img": {
        marginLeft: "8px",
      },
    },
    "& .MuiOutlinedInput-root": {
      width: "100%",
    },
    "& .MuiFormControl-root": {
      marginTop: "8px",
      width: "100%",
      marginBottom: "50px",
    },
  },
  buttons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "45px",
    "& button": {
      fontSize: "16px",
      "& img": {
        width: "12px",
      },
    },
  },
}));
