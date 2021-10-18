import { makeStyles } from "@material-ui/core";

export const podsPageStyles = makeStyles(theme => ({
  content: {
    background: "linear-gradient(180.15deg, #FFFFFF 2.8%, #EEF2F6 89.51%)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "60px 168px 150px 168px",
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
  },
  gradient: {
    position: "absolute",
    width: "100%",
    left: 0,
    top: 0,
  },
  green1: {
    position: "absolute",
    width: "132px",
    left: "20%",
    top: "150px",
  },
  green2: {
    position: "absolute",
    right: "20%",
    top: "-50px",
    transform: "matrix(-0.81, -0.59, -0.59, 0.81, 0, 0)",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: "58px",
    color: "white",
  },
  header1: {
    fontSize: "30px",
    fontWeight: 700,
  },
  header2: {
    fontSize: "26px",
    fontWeight: 600,
  },
  header3: {
    fontSize: "18px",
    fontWeight: 700,
  },
  whiteBox: {
    borderRadius: theme.spacing(4),
    background: "white",
    boxShadow: "0px 33px 35px -18px rgba(29, 103, 84, 0.13)",
    padding: theme.spacing(3),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
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
    background: "#F0F5F8",
    borderRadius: theme.spacing(4),
  },
  buttonBox: {
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: "#2D3047",
    cursor: "pointer",
  },
  selectedButtonBox: {
    background: "#2D3047",
    color: "white",
  },
}));
