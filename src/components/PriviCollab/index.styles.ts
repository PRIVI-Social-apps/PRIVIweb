import { makeStyles } from "@material-ui/core";

export const useCommonStyles = makeStyles(() => ({
  button: {
    color: "white",
    fontSize: "16px !important",
    borderRadius: "44px !important",
  },
  brownButton: {
    backgroundColor: "#FF8E3C !important",
  },
  greenButton: {
    backgroundColor: "#65CB63 !important",
  },
  bgGradient: {
    background: "linear-gradient(50.01deg, #FF8E3C 23.9%, #FF3C5F 182.56%)",
  },
}));

export const priviCollabPageStyles = makeStyles(theme => ({
  priviData: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  mainContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    maxHeight: "calc(100vh - 104px)",
  },
  content: {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    maxHeight: "calc(100vh - 104px)",
    overflow: "scroll",
    background: "linear-gradient(0deg, #F4F1EF, #F4F1EF), #E0F9FD",
    "&::-webkit-scrollbar": {
      width: 10,
    },
    "&::-webkit-scrollbar-thumb": {
      width: 20,
      background: "rgba(238, 241, 244, 1)",
    },
  },
}));
