import { makeStyles } from "@material-ui/core";

export const createCollabModalStyles = makeStyles(theme => ({
  modal: {
    "& .MuiDialog-paperFullWidth": {
      padding: 0,
      borderRadius: theme.spacing(2),
    },
  },
  root: {
    padding: 0,
    "& .MuiGrid-item + .MuiGrid-item": {
      borderLeft: "1px solid rgba(148, 148, 148, 0.66)",
      paddingLeft: 16,
    },
  },
  mainContent: {
    padding: 40,
  },
  paper: {
    borderRadius: theme.spacing(2.5),
  },
  exit: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: theme.spacing(2),
  },
  closeButton: {
    cursor: "pointer",
  },
  description: {
    color: "gray",
  },
  content: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      borderLeft: "none",
      padding: 0,
    },
  },
  itemContainer: {
    display: "flex",
    alignItems: "center",
    margin: "20px 0",
    width: "100%",
  },
  itemContainerVert: {
    display: "flex",
    flexDirection: "column",
    margin: "20px 0",
    width: "100%",
    "& .MuiInputBase-root": {
      borderRadius: 68,
    },
  },
  label: {
    flexDirection: "row",
    textAlign: "right",
    fontSize: "18px",
    whiteSpace: "nowrap",
    width: "20%",
    marginRight: 10,
  },
  text: {
    flexGrow: 1,
  },
  span: {
    display: "flex",
    alignItems: "center",
  },
  userImage: {
    width: 30,
    height: 30,
    minWidth: 30,
    borderRadius: 15,
    backgroundColor: "#656e7e",
    marginRight: 10,
  },
  platformImage: {
    width: 30,
    height: 30,
    backgroundColor: "rgba(0,0,0,0)",
    marginRight: 10,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: "20px",
    border: "1px solid rgba(148, 148, 148, 0.66)",
    paddingRight: "5px",
    paddingLeft: "10px",
    width: "100%",
    background: "#F7F9FE",

    "& .MuiAutocomplete-input": {
      textOverflow: "ellipsis",
      padding: "5px 10px",
      fontSize: "18px",
      marginTtop: "0px",
      border: 0,
      backgroundColor: "transparent",
      "&::placeholder": {
        color: "hsla(218, 11%, 45%, 0.3)",
        opacity: "1",
      },
    },
  },
  autocomplete: {
    fontSize: "18px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    paddingLeft: 48,
    marginTop: 40,
    "& button": {
      width: "40%",
      height: 40,
      borderRadius: 48,
      border: "1px solid #181818",
    },
  },
  input: {
    textOverflow: "ellipsis",
    padding: "5px 10px",
    fontSize: "18px",
    border: 0,
    backgroundColor: "transparent",
    width: "100%",
  },
  createHashtagButton: {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    minWidth: theme.spacing(4.5),
    marginBottom: 0,
    display: "flex",
    padding: theme.spacing(1.25),
    borderRadius: "100%",
    backgroundColor: "black",
    marginLeft: theme.spacing(1),
    cursor: "pointer",

    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  twitterBox: {
    border: "1px solid black",
    padding: "2px",
    borderRadius: "8px",
    width: "16px",
    height: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "& svg": {
      width: "100%",
      height: "100%",
    },
  },
  stepRound: {
    position: "relative",
    border: "1px solid #707582",
    width: 38,
    height: 38,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "100%",
    "& span": {
      zIndex: 1,
      color: "#707582",
      fontWeight: "bold",
    },
  },
  stepCurrent: {
    position: "absolute",
    top: 3,
    left: 3,
    width: 30,
    height: 30,
    backgroundColor: "#4218B5",
    borderRadius: "100%",
    "& + span": {
      color: "white",
    },
  },
  stepComplete: {
    position: "absolute",
    top: 3,
    left: 3,
    width: 30,
    height: 30,
    backgroundColor: "#65CB63",
    borderRadius: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  tokenSelect: {
    flex: 0,
    marginBottom: 0,
    marginLeft: 20,
    height: 40,
    minHeight: 40,
  },
  selectNetwork: {
    width: "100%",
  },
}));
