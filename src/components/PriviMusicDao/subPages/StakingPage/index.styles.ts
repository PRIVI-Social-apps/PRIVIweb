import { makeStyles } from "@material-ui/core";

export const stakingPageStyles = makeStyles(theme => ({
  container: {
    background: "linear-gradient(180.15deg, #FFFFFF 2.8%, #EEF2F6 89.51%)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
  },
  content: {
    width: "100%",
    maxWidth: 1440,
    padding: "20px 50px",
    zIndex: 1,
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      padding: "20px 30px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: 20,
    },
  },
  gradient: {
    position: "absolute",
    width: "100%",
    height: 1200,
    left: 0,
    top: 0,
  },
  image1: {
    position: "absolute",
    left: "28%",
    top: 50,
    [theme.breakpoints.down("sm")]: {
      left: "24%",
    },
    [theme.breakpoints.down("xs")]: {
      left: "15%",
    },
  },
  image2: {
    position: "absolute",
    left: "20%",
    top: 250,
    [theme.breakpoints.down("sm")]: {
      left: "15%",
    },
    [theme.breakpoints.down("xs")]: {
      left: "10%",
      top: 200,
    },
  },
  image3: {
    position: "absolute",
    right: "28%",
    top: 80,
    [theme.breakpoints.down("sm")]: {
      right: "20%",
    },
    [theme.breakpoints.down("xs")]: {
      right: "10%",
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  buttonsBox: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
    "& button": {
      width: "200px",
      margin: theme.spacing(1),
    },
  },
  headerTitle: {
    fontSize: 58,
    fontWeight: 800,
    color: "white",
    [theme.breakpoints.down("sm")]: {
      fontSize: 52,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 40,
    },
  },
  header1: {
    fontSize: "30px",
    fontWeight: 700,
    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
    },
  },
  header2: {
    fontSize: 26,
    fontWeight: 600,
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: 26,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  header3: {
    fontSize: "21px",
    fontWeight: 700,
    [theme.breakpoints.down("sm")]: {
      fontSize: 15,
      textAlign: "center",
    },
  },
  header4: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#54658F",
  },
  whiteBox: {
    borderRadius: theme.spacing(4),
    background: "white",
    boxShadow: "0px 33px 35px -18px rgba(29, 103, 84, 0.13)",
    padding: theme.spacing(3),
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  percentValueBox: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
    borderRadius: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    },
  },
  secondButtonBox: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(3)}px`,
    borderRadius: theme.spacing(4),
    cursor: "pointer",
    border: "1px solid #65CB63",
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
    background: "#F0F5F8",
    borderRadius: theme.spacing(4),
  },
  buttonBox: {
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: "#2D3047",
    cursor: "pointer",
    fontSize: 14,
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  selectedButtonBox: {
    background: "#2D3047",
    color: "white",
  },
  statsGroup: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: 20,
    rowGap: 15,
    [theme.breakpoints.down("xs")]: {
      columnGap: 12,
    },
    "& > div": {
      flex: 1,
      height: 205,
    },
  },
}));
