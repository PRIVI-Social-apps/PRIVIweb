import { makeStyles } from "@material-ui/core";

export const priviDigitalArtStyles = makeStyles(theme => ({
  priviDigitalArt: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",

    "& .header-container": {
      borderBottom: "none",
    },
  },
  mainContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    maxHeight: "calc(100vh)",
    maxWidth: "calc(100vw)",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    background: "#9EACF2",
  },
  content: {
    display: "flex",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    "&::-webkit-scrollbar": {
      width: 10,
    },
    "&::-webkit-scrollbar-thumb": {
      width: 20,
      background: "rgba(238, 241, 244, 1)",
    },
  },
}));
