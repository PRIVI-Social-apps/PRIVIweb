import { makeStyles } from "@material-ui/core";
import { Gradient } from "shared/ui-kit";

export const calculatorPagePageStyles = makeStyles(theme => ({
  content: {
    background: "linear-gradient(180.15deg, #FFFFFF 2.8%, #EEF2F6 89.51%)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "60px 168px 150px 168px",
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
    [theme.breakpoints.down("md")]: {
      padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    },
  },
  gradient: {
    position: "absolute",
    width: "100%",
    left: 0,
    top: 0,
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  stackBox: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      flexDirection: "column",
    },
  },
  arrowBox: {
    marginTop: theme.spacing(7),
    marginRight: theme.spacing(3),
    maxWidth: "120px",
    maxHeight: "100px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: -theme.spacing(6),
      marginBottom: theme.spacing(7),
      marginRight: theme.spacing(0),
      transform: "rotate(90deg)",
    },
  },
  headerTitle: {
    fontSize: "30px",
    fontWeight: 800,
    color: "#2D3047",
  },
  header1: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#54658F",
  },
  header2: {
    fontSize: "20px",
    fontWeight: 500,
    color: "#54658F",
  },
  header3: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#54658F",
  },
  header4: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#54658F",
    opacity: 0.8,
  },
  whiteBox: {
    borderRadius: theme.spacing(4),
    background: "white",
    boxShadow: "0px 33px 35px -18px rgba(29, 103, 84, 0.13)",
    padding: `${theme.spacing(3)}px ${theme.spacing(6)}px`,
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },
  borderBox: {
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: "#2D3047",
    cursor: "pointer",
    border: "1px solid #7BCBB7",
    background: "rgba(218, 230, 229, 0.4)",
  },
  noBorderBox: {
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: "#2D3047",
    background: "rgba(218, 230, 229, 0.4)",
  },
  colorText: {
    fontSize: "20px",
    background: Gradient.Green1,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  stakingValue: {
    fontSize: "26px !important",
    "& span": {
      opacity: 0.4,
    },
  },
  stakingTitle: {
    textTransform: "uppercase",
    fontSize: 16,
    fontWeight: 600,
  },
  secondButtonBox: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(3)}px`,
    borderRadius: theme.spacing(4),
    cursor: "pointer",
    border: "1px solid #65CB63",
    display: "flex",
    alignItems: "center",
  },
}));
