import { makeStyles } from "@material-ui/core";

export const proposalSubPageStyles = makeStyles(theme => ({
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
    padding: "60px 168px 50px 168px",
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      padding: "60px 12px 50px 12px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "60px 16px 50px 16px",
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
  headerTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    alignItem: "center",
    marginBottom: 48,
    zIndex: 1,
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
  },
  headerBack: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    cursor: "pointer",
  },
  headerMainTitle: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 52,
    color: '#ffffff',
    lineHeight: "120%",
    [theme.breakpoints.down("xs")]: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center'
    },
  },
  headerButtonSection: {
    [theme.breakpoints.down("xs")]: {
      display: 'flex',
      width: '100%',
      justifyContent: 'flex-end'
    },
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
    marginTop: 24,
    marginBottom: 24,
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginTop: 0,
    },
  },
  filterPopMenu: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#ffffff",
    marginLeft: 32,
    marginRight: 16
  },
  header2: {
    fontSize: "14px",
    fontWeight: 600,
    color: "white",
  },
  voteCards: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "calc(100% + 20px)",
    marginLeft: -10,
    marginTop: -10,
    marginBottom: 38,
    flexWrap: "wrap",
    padding: "10px 5px",
    "& > div": {
      width: "100%",
    },
  },
  selectedButtonBox: {
    background: "#2D3047",
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: "pointer",
  },
  buttonBox: {
    background: "rgba(85, 84, 125, 0.42)",
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    "& > *": {
      marginTop: theme.spacing(2),
    },
    "& > nav > ul > li > button": {
      color: "#2D3047",
      fontSize: 14,
      fontWeight: 600,
      "&.MuiPaginationItem-page.Mui-selected": {
        opacity: 0.38,
      },
    },
    "& > nav > ul > li > div": {
      color: "#2D3047 !important",
      fontSize: 14,
      fontWeight: 600,
    },
  },
}));
