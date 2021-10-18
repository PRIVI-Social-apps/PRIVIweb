import { makeStyles } from "@material-ui/core";

export const buySellModalStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: "20px 30px",
    width: "100%",
  },
  title: {
    fontWeight: 800,
    fontSize: 22,
    color: "#181818",
    marginBottom: 8,
  },
  swapBtnSection: {
    paddingLeft: 16,
  },
  swapButton: {
    width: "100%",
    fontSize: 16,
    margin: "16px 0px",
    height: 50,
    "& img": {
      width: 14,
      height: 14,
      marginLeft: 4,
    },
  },
  squareContainer: {
    padding: "20px 0",
    display: "flex",
    alignItems: "flex-start",
    "& div": {
      flex: 1,
      position: "relative",
      marginLeft: 8,
    },
    "& > div input": {
      width: "100%",
      position: "relative",
      border: "2px solid #949bab",
      boxSizing: "border-box",
      borderRadius: 10,
      fontSize: 18,
      padding: "0px 25px",
      height: 50,
      outline: "none",
    },
  },
  squareContainerLabel: {
    fontSize: 18,
    color: "#181818",
  },
  squareContainerInput: {
    position: "relative",
    "& img": {
      position: "absolute",
      left: 5,
      top: "50%",
      transform: "translate(0, -50%)",
    },
  },
  imageInput: {
    paddingLeft: 45,
  },
  balance: {
    position: "absolute",
    top: "100%",
    left: 0,
    marginTop: 8,
    fontSize: 14,
    color: "#000000",
  },
  error: {
    color: "red",
  },
  submit: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 24,
    "& button": {
      padding: "9px 45px",
      fontSize: 16,
      height: 50,
    },
  },
}));
