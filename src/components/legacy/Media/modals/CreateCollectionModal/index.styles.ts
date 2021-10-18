import { makeStyles } from "@material-ui/core";

export const createCollectionModalStyles = makeStyles(() => ({
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
      "& input": {
        background: "#f7f8fa",
        border: "1px solid #99a1b3",
        borderRadius: 11.36,
        padding: "20px 22px",
        color: "#6b6b6b",
        fontWeight: 400,
        fontSize: 16,
        marginTop: 8,
        outline: "none",
        "&::placeholder": {
          color: "#99a1b3",
        },
      },
      "& textarea": {
        height: "calc(154px - 2 * 20px)",
        background: "#f7f8fa",
        border: "1px solid #99a1b3",
        borderRadius: 11.36,
        padding: "20px 22px",
        color: "#6b6b6b",
        fontWeight: 400,
        fontSize: 16,
        marginTop: 8,
        outline: "none",
        "&::placeholder": {
          color: "#99a1b3",
        },
      },
    },
  },
  mediaTypes: {
    width: "100%",
    marginTop: 20,
    display: "flex",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  mediaButton: {
    fontStyle: "normal",
    border: "2px solid #99a1b3",
    boxSizing: "border-box",
    borderRadius: 57,
    padding: "5px 15px",
    backgroundColor: "white",
    color: "#99a1b3",
    flexGrow: 1,
    textAlign: "center",
    margin: 0,
    marginRight: 15,
    marginBottom: 15,
    height: 50,
    whiteSpace: "nowrap",
    "& selected": {
      backgroundColor: "black",
      borderColor: "black",
      color: "white",
    },
    "&:last-child": {
      flexGrow: 0.1,
    },
  },
  selected: {
    backgroundColor: "black",
    borderColor: "black",
    color: "white",
  },
  more: {
    border: "2px solid #99a1b3",
    boxSizing: "border-box",
    borderRadius: 57,
    backgroundColor: "white",
    color: "#99a1b3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    minWidth: 50,
    height: 50,
    margin: 0,
    padding: 0,
    "& img": {
      height: 24,
      width: 5.75,
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
