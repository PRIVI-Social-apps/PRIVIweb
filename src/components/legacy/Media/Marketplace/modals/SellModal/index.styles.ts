import { makeStyles } from "@material-ui/core";

export const sellModalStyles = makeStyles(() => ({
  root: {
    width: "600px !important",
  },
  modalContent: {
    padding: "20px 30px",
  },
  appbarContainer: {
    marginTop: 22,
  },
  mediaAndPriceSelect: {
    margin: "36px 0px 10px 0px",
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    borderRadius: 10,
    padding: "12px 18px 10px 10px",
    background: "#f7f9fe",
    border: "1px solid #e0e4f3",
    boxSizing: "border-box",
    fontWeight: 400,
    height: 45,
    marginTop: 4,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& img": {
      width: 17,
      height: 17,
    },
  },
  row: {
    alignItems: "flex-end",
    display: "flex",
    marginBottom: 15,
  },
  selectorWithToken: {
    background: "#ffffff",
    border: "1px solid #c0c6dc",
    boxSizing: "border-box",
    borderRadius: 6,
    height: 40,
    margin: 0,
    alignSelf: "flex-end",
    marginLeft: 10,
  },
  dateHourSelect: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
    "& input": {
      padding: 0,
      height: "auto",
      margin: 0,
    },
    "& .col:first-child": {
      marginRight: 32,
    },
    "& .col": {
      width: "50%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  mediaDisplay: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0px",
    borderTop: "1px solid #eff2f8",
    borderBottom: "1px solid #eff2f8",
    marginTop: 30,
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
  },
  avatarSection: {
    width: 40,
    height: 40,
    backgroundColor: "#f2f2f2",
    marginRight: 20,
    borderRadius: 6,
  },
  buttons: {
    marginTop: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  alertMessageSection: {
    width: "100%",
    "& > * + *": {
      marginTop: 16,
    },
  },
}));
