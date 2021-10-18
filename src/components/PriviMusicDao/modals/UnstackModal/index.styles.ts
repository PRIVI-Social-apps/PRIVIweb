import { makeStyles } from "@material-ui/core";

export const unstackModalStyles = makeStyles(theme => ({
  contentBox: {
    padding: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      padding: `${theme.spacing(1)}px 0px`
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#2D3047",
  },
  header2: {
    fontSize: "16px",
    color: "#54658F",
    opacity: 0.9,
    fontWeight: 600,
  },
  header3: {
    fontSize: "18px",
    color: "#54658F",
    fontWeight: 700,
  },
  header4: {
    fontSize: "28px",
    color: "#2D3047",
    fontWeight: 800,
  },
  controlBox: {
    background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
    borderRadius: theme.spacing(1.5),
    padding: `${theme.spacing(3)}px ${theme.spacing(3)}px`,
  },
  borderBox: {
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: "#2D3047",
    cursor: "pointer",
    border: "1px solid #7BCBB7",
    background: "rgba(218, 230, 229, 0.4)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noBorderBox: {
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    border: "1px solid #7BCBB7",
  },
  buttonGroup: {
    display: "flex",
    alignItems: "center",
    padding: '0px 40px',
    columnGap: 20,
    "& > button": {
      width: '100%',
      marginLeft: '0 !important',
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'column',
      padding: '0',
      rowGap: 10,
    },
  }
}));
