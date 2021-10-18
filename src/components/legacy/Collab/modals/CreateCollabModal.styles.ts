import { makeStyles } from "@material-ui/core";

export const createCollabModalStyles = makeStyles(theme => ({
  modal: {
    "& .MuiDialog-paperFullWidth": {
      padding: theme.spacing(2.5),
      borderRadius: theme.spacing(2),
    },
  },
  root: {
    padding: 20,
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
    borderLeft: `1px solid hsla(218, 11%, 45%, 0.3)`,
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
  label: {
    flexDirection: "row",
    textAlign: "right",
    fontSize: "22px",
    whiteSpace: "nowrap",
    width: "20%",
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
    alignItems: "center",
    marginLeft: "10px",
    borderRadius: "20px",
    border: "1px solid rgba(148, 148, 148, 0.66)",
    paddingRight: "5px",
    paddingLeft: "10px",
    width: "100%",

    "& .MuiAutocomplete-input": {
      textOverflow: "ellipsis",
      padding: "5px 10px",
      fontSize: "22px",
      marginTtop: "0px",
      border: 0,
      backgroundColor: "transparent",
      color: "#45cfea",
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
    justifyContent: "space-between",
    paddingLeft: 48,
    marginTop: 40,
  },
  input: {
    textOverflow: "ellipsis",
    padding: "5px 10px",
    fontSize: "22px",
    border: 0,
    backgroundColor: "transparent",
    color: "#45cfea",
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
}));
