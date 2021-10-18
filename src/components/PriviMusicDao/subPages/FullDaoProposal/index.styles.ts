import { makeStyles } from "@material-ui/core";

export const fullProposalPageStyles = makeStyles(theme => ({
  headerImage: {
    [theme.breakpoints.down("sm")]: {
      height: 700,
    },
  },
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    alignItem: "center",
    fontSize: 22,
    fontWeight: 600,
    zIndex: 1,
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
  },
  header1: {
    fontSize: 31,
    fontWeight: 600,
    color: "#2D3047",
    [theme.breakpoints.down("xs")]: {
      fontSize: 20,
    },
  },
  header2: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#2D3047",
    opacity: 0.8,
  },
  header3: {
    fontSize: "14px",
    fontWeight: 600,
  },
  header4: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#54658F",
  },
  header5: {
    fontSize: "14px",
    fontWeight: 500,
  },
  blackBox: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    background: "rgba(218, 230, 229, 0.4)",
    border: "1px solid #7BCBB7",
    borderRadius: theme.spacing(4),
  },
  greyBox: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    background: "#DAE6E5",
    borderRadius: theme.spacing(4),
  },
  answerBox: {
    position: "absolute",
    left: theme.spacing(3),
    top: 0,
    transform: "translateY(45%)",
  },
  dateBox: {
    fontSize: "14px",
    color: "#788BA2",
  },
  messageBox: {
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    background: "linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8",
    borderRadius: theme.spacing(1),
  },
}));
