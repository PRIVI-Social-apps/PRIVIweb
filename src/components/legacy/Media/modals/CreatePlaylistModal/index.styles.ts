import { makeStyles } from "@material-ui/core";

export const createPlaylistModalStyles = makeStyles(() => ({
  root: {
    width: "600px !important",
  },
  modalContent: {
    padding: "20px 30px",
  },
  mainContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    "& h2": {
      margin: 0,
      marginBottom: 30,
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 30,
      lineHeight: "104.5%",
    },
    "& .label": {
      display: "flex",
      flexDirection: "column",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 18,
      marginBottom: 25,
      width: "100%",
      "&:first-child": {
        marginBottom: 40,
      },
      "& .selector": {
        background: "#f7f8fa",
        border: "1px solid #99a1b3",
        borderRadius: 11.36,
        padding: "20px 22px",
        color: "#6b6b6b",
        fontWeight: 400,
        fontSize: 16,
        marginTop: 8,
        "&::placeholder": {
          color: "#99a1b3",
        },
      },
    },
  },
  radio: {
    alignItems: "center",
    color: "#6b6b6b",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 16,
    marginBottom: 25,
    "& span": {
      padding: 0,
      marginRight: 9.5,
      color: "#99a1b3",
    },
  },
  price: {
    transition: "all 0.25",
    marginBottom: 35,
  },
  row: {
    display: "flex",
    "& input": {
      height: 46,
      marginRight: 12,
      outline: "none",
    },
  },
  buttons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    marginBottom: "16px",
  },
}));
