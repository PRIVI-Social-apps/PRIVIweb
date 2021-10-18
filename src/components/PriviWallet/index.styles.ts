import { makeStyles } from "@material-ui/core";

export const priviWalletStyles = makeStyles(theme => ({
  priviWallet: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#FFFFFF",
  },
  headerContainer: {
    background: "#FFFFFF",
    width: "100%",
    zIndex: 1,
    "& > div": {
      borderBottom: "1px #1717172a solid",
      "& > div": {
        paddingLeft: "35px !important",
        paddingRight: "22px !important",
      },
      "& > div > div:first-child > div:last-child": {
        background: "#FFFFFF",
        border: "1px solid #E0E4F3",
        boxSizing: "border-box",
        borderRadius: "63px",
        width: "384px",
      },
      "& > div > div:first-child > img": {
        marginRight: "62px",
      },
      "& > div > div:last-child > div:nth-child(2) > button": {
        borderRadius: "48px",
        height: "40px",
        "&:last-child": {
          background: "#181818 !important",
          border: "none",
        },
      },
    },
  },
  content: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    maxHeight: "calc(100vh)",
    overflow: "hidden",
    marginTop: -104,
    paddingTop: 104,
    background: "#E5E5E5",
    paddingBottom: 40,
    "&::-webkit-scrollbar": {
      width: 10,
    },
    "&::-webkit-scrollbar-thumb": {
      width: 20,
      background: "rgba(238, 241, 244, 1)",
    },
  },
  mainContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    maxHeight: "calc(100vh - 94px)",
    maxWidth: "calc(100vw)",
  },
}));
