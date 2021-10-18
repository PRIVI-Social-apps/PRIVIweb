import { makeStyles } from "@material-ui/core";

export const sendTokensModal = makeStyles(() => ({
  root: {
    width: "800px !important",
  },
  modalContent: {
    padding: "10px 20px",
    height: "fit-content",
  },
  heading: {
    fontSize: 30,
    color: "black",
    display: "flex",
    alignItems: "center",
    "& > span": {
      marginRight: 20,
    },
    "& div .MuiInput-root::before": {
      border: "none",
    },
  },
  content: {
    "& label": {
      marginTop: 50,
      marginBottom: 24,
      textTransform: "uppercase",
      fontSize: 14,
      display: "block",
    },
  },
  radioGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  radio: {
    background: "#eff2f8",
    boxShadow: "0px 2.58537px 18.0976px rgba(0, 0, 0, 0.08)",
    borderRadius: 73.6829,
    color: "#949bab",
    fontSize: 18.0976,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    height: 53,
    outline: "none",
    boxSizing: "border-box",
  },
  active: {
    background: "#181818",
    color: "white",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    columnGap: 20,
    position: "relative",
    width: "100",
  },
  timespan: {
    marginBottom: 40,
  },
  title: {
    position: "absolute",
    left: 0,
    top: -30,
  },
  button: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  text: {
    marginLeft: 32,
    width: "calc(65% - 32px)",
  },
  autocomplete: {
    width: "100%",
    border: "1px solid rgb(224, 228, 243)",
    borderRadius: 6,
    padding: "7px 15px",
    backgroundColor: "#eff2f8",
  },
}));
