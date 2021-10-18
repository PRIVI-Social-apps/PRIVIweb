import { makeStyles } from "@material-ui/core";

export const freeMusicPageStyles = makeStyles(theme => ({
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
    height: "1200px",
    left: 0,
    top: 0,
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: "58px",
    fontWeight: 400,
    color: "white",
    [theme.breakpoints.down("xs")]: {
      fontSize: "40px",
      lineHeight: "52px",
    },
  },
  header1: {
    fontSize: "30px",
    fontWeight: 700,
    [theme.breakpoints.down("xs")]: {
      fontSize: "20px",
    },
  },
  header2: {
    fontSize: "26px",
    fontWeight: 400,
    lineHeight: "39px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "16px",
      lineHeight: "24px",
    },
  },
  header3: {
    fontSize: "18px",
    fontWeight: 700,
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
    },
  },
  horizontalScrollBox: {
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    overflow: "scroll",
    paddingBottom: theme.spacing(6),
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  whiteBox: {
    height: 205,
    minWidth: 257,
    borderRadius: theme.spacing(4),
    background: "white",
    boxShadow: "0px 33px 35px -18px rgba(29, 103, 84, 0.13)",
    padding: theme.spacing(3),
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      minWidth: 180,
      height: 185,
    },
  },
  percentValueBox: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
    borderRadius: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  secondButtonBox: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(3)}px`,
    borderRadius: theme.spacing(4),
    cursor: "pointer",
    border: "1px solid #7977D1",
    display: "flex",
    alignItems: "center",
  },
  graphBox: {
    background: "white",
    borderRadius: theme.spacing(4),
    padding: theme.spacing(4),
  },
  controlBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#F0F5F8",
    borderRadius: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(1),
    },
  },
  buttonBox: {
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: "#2D3047",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    [theme.breakpoints.down("xs")]: {
      fontSize: 11,
      textAlign: "center",
    },
  },
  selectedButtonBox: {
    background: "#2D3047",
    color: "white",
    fontSize: 14,
    fontWeight: 500,
    [theme.breakpoints.down("xs")]: {
      fontSize: 11,
      textAlign: "center",
    },
  },
  graphTobBox: {
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
}));
