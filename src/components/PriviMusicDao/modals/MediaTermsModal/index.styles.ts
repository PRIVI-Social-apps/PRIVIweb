import { makeStyles } from "@material-ui/core";

export const mediaTermsModalStyles = makeStyles(theme => ({
  cardOptions: {
    padding: `0 ${theme.spacing(10)}px`,
  },
  buttonsMediaTerms: {
    marginTop: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  buttonsMediaTermsBorder: {
    borderBottom: "1.5px solid #707582",
    width: "100%",
  },
  borderRoundBox: {
    padding: theme.spacing(0.25),
    border: "1px solid #707582",
    borderRadius: "50%",
    cursor: "pointer",
  },
  mediaTermButton: {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#707582",
    fontSize: "14px",
    borderRadius: "50%",
  },
  mediaTermButtonSelected: {
    background: "#65CB63",
    color: "white",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#2D3047",
  },
  uploadBox: {
    background: "#F0F5F5",
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(5)}px ${theme.spacing(5)}px`,
  },
  controlBox: {
    background: "#F0F5F5",
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  datepicker: {
    width: "100%",
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: 0,
      "& .MuiInputAdornment-positionEnd": {
        marginLeft: 0,
      },
    },
  },
  calendarImage: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  radioBox: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  inputBox: {
    background: "#F0F5F5",
    borderRadius: theme.spacing(1),
  },
  tokenTypeButton: {
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    border: "1px solid #54658F",
    borderRadius: theme.spacing(4),
    fontSize: "14px",
    fontWeight: 500,
    color: "#54658F",
  },
  tokenTypeButtonSelected: {
    background: "black",
    color: "white",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  footerLeft: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "space-between",
      width: "100%",
    },
  },
  footerRight: {
    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(2),
      width: "100%",
      "& button": {
        width: "100%",
      },
    },
  },
}));
