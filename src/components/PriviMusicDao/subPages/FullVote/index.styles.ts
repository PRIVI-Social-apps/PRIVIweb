import { makeStyles } from "@material-ui/core";

export const fullVotePageStyles = makeStyles(theme => ({  
  content: {
    background: "linear-gradient(180.15deg, #FFFFFF 2.8%, #EEF2F6 89.51%)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "60px 168px 150px 168px",
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      padding: "60px 12px 50px 12px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "60px 12px 50px 12px",
    },
  },
  gradient: {
    position: "absolute",
    width: "100%",
    left: 0,
    top: 0,
  },
  proposalDetailBox: {
    borderRadius: theme.spacing(0.5),
    background: "white",
    boxShadow: "0px 30px 35px -12px rgba(29, 103, 84, 0.03)",
  },
  detailHeaderBox: {
    padding: theme.spacing(5),
    background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#2D3047",
  },
  header1: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#54658F",
  },
  header2: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#2D3047",
  },
  header3: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#2D3047",
  },
  header4: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#65CB63",
  },
  dateBox: {
    fontSize: "14px",
    color: "#788BA2",
  },
  blackBox: {
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    background: "linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8",
    borderRadius: theme.spacing(1),
  },
  greenBox: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
    borderRadius: theme.spacing(4),
    border: "1px solid #65CB63",
  },
}));
