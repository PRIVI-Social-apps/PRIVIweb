import { makeStyles } from "@material-ui/core";

export const voteSubPageStyles = makeStyles(theme => ({
  content: {
    backgroundColor: "#26254B",
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
    width: 363,
    height: 485,
    left: 521,
    top: -240,
    transform: "rotate(44deg)",
    filter: "blur(120px)",
    background:
      "linear-gradient(156.41deg, #FA18FF 11.7%, rgba(255, 255, 255, 0) 57.03%), radial-gradient(108.54% 138.74% at 86.8% 29.83%, rgba(238, 238, 238, 0) 0%, rgba(167, 54, 255, 0.096) 26.8%, rgba(14, 0, 255, 0.212) 73.32%, rgba(112, 0, 255, 0.384) 100%)",
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    alignItem: "center",
    marginBottom: 48,
  },
  sortSection: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 24,
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
  pagination: {
    display: "flex",
    justifyContent: "center",
    "& > *": {
      marginTop: theme.spacing(2),
    },
    "& > nav > ul > li > button": {
      color: "#ffffff",
      fontSize: 14,
      fontWeight: 600,
      "&.MuiPaginationItem-page.Mui-selected": {
        opacity: 0.38,
      },
    },
    "& > nav > ul > li > div": {
      color: "#ffffff !important",
      fontSize: 14,
      fontWeight: 600,
    },
  },
  discussionBtn: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: "#BA50FC",
    borderRadius: 46,
    fontFamily: "Agrandir",
    fontSize: 14,
    fontWeight: 600,
  }
}));
