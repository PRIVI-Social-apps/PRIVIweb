import { makeStyles } from "@material-ui/core";

export const badgesProfileModalStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeModalContent: {
    width: 766,
    backgroundColor: "white",
    alignItems: "flex-start",
    maxWidth: "85vw",
    height: 642,
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    borderRadius: "16px !important",
    padding: 40,
    outline: "none",
  },
  closeButton: {
    justifySelf: "flex-end",
    alignSelf: "flex-end",
    cursor: "pointer",
  },
  flexDisplayStartCenter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 6,
    "& h3": {
      fontWeight: 400,
      fontSize: 18,
      color: "#000000",
      margin: 0,
    },
    "& button": {
      borderRadius: 10,
      fontSize: "14px",
    },
  },
  appbar: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    marginBlockEnd: 20,
  },
  appBarTabs: {
    backgroundColor: "transparent !important",
    boxShadow: "none !important",
    marginBottom: 20,
    "& .MuiTab-root": {
      minWidth: "auto !important",
      color: "#656e7e",
      textTransform: "none",
      fontFamily: "Agrandir",
      padding: 0,
      fontSize: 14,
      marginRight: 10,
      marginLeft: 10,
    },
    "& .tab": {
      minWidth: "auto !important",
      color: "#656e7e",
      textTransform: "none",
      fontFamily: "Agrandir",
      padding: 0,
      fontSize: 14,
      marginRight: 10,
      marginLeft: 10,
    },
    "& .Mui-selected": {
      minWidth: "auto !important",
      background: "linear-gradient(97.4deg, #29e8dc 14.43%, #03eaa5 79.45%)",
      "-webkit-background-clip": "text",
      backgroundClip: "text",
      "-webkit-text-fill-color": "transparent",
      textDecoration: "none",
      fontWeight: 600,
      fontSize: 14,
      textTransform: "none",
      zIndex: 100,
    },
    "& .tab.selected": {
      minWidth: "auto !important",
      background: "linear-gradient(97.4deg, #29e8dc 14.43%, #03eaa5 79.45%)",
      "-webkit-background-clip": "text",
      backgroundClip: "text",
      "-webkit-text-fill-color": "transparent",
      textDecoration: "none",
      fontWeight: 600,
      fontSize: 14,
      textTransform: "none",
      zIndex: 100,
    },
    "& .tab:hover": {
      cursor: "pointer",
    },
    "& .MuiTab-root:first-child": {
      marginLeft: 0,
    },
    "& .MuiTab-root:hover": {
      backgroundColor: "transparent !important",
    },
  },
  badgesWrap: {
    width: "calc(100% + 20px)",
    marginLeft: -10,
    marginTop: -10,
    display: "flex",
    flexWrap: "wrap",
    overflowY: "auto",
    scrollbarWidth: "none",
    justifyContent: "space-between",
    padding: 10,
    "& .badgeCard:nth-child(2n)": {
      marginRight: 0,
    },
  },
}));