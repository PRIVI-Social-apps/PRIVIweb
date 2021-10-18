import { makeStyles } from "@material-ui/core";

export const daoPageHeaderStyles = makeStyles(theme => ({
  wrapper: {
    width: "100%",
    paddingBottom: "96px",
  },
  topInfo: {
    display: "flex",
    justifyContent: "space-between",
    height: 264,
    background: "linear-gradient(102.54deg, #00bfff -9.09%, #8d2eff 56.17%, #ff00c1 112.56%)",
    padding: "40px 80px 40px 25px",
    paddingLeft: "calc(25% + 40px)",
    color: "white",
    "& > div": {
      width: "calc(100% / 4)",
    },
    "& p": {
      fontFamily: "Agrandir GrandLight",
      fontStyle: "normal",
      fontWeight: "normal",
      display: "flex",
      alignItems: "center",
      letterSpacing: "0.04em",
      color: "#ffffff",
      margin: 0,
      fontSize: 14,
      lineHeight: "18px",
    },
    "& img": {
      width: 24,
      height: 24,
      borderRadius: "50%",
      marginRight: 16,
    },
  },
  creators: {
    display: "flex",
    alignItems: "center",
    marginBlockEnd: "24px",
    "& img": {
      objectFit: "cover",
      marginRight: -8,
      borderRadius: "50%",
      height: 48,
      width: 48,
      filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
      backgroundColor: "white",
    },
  },
  creatorsCounter: {
    background: "rgba(0, 0, 0, 0.3)",
    width: 32,
    height: 32,
    fontWeight: 800,
    fontSize: 12,
    color: "white",
  },
  title: {
    fontFamily: "Agrandir GrandLight",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 18,
    lineHeight: "23px",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    letterSpacing: "0.04em",
    color: "#ffffff",
    margin: "0px 0px 8px",
  },
  subtitle: {
    fontFamily: "Agrandir GrandLight",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 18,
    lineHeight: "23px",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    letterSpacing: "0.04em",
    color: "#ffffff",
    margin: "0px 0px 8px",
  },
  imageAndButtons: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "calc(-264px + 40px)",
    padding: "0px 80px",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "calc(25% - 40px)",
    padding: "0px 0px 16px",
    background: "#1a1b1c",
    color: "white",
    "& h5": {
      marginTop: "16px",
      fontSize: 14,
      marginBottom: 0,
    },
    "& h6": {
      marginTop: "16px",
      fontWeight: 400,
      marginBottom: 0,
      fontSize: 14,
    },
  },
  daoImage: {
    height: 288,
    width: "100%",
  },
  creatorAvatar: {
    display: "flex",
    border: "2px solid #FFFFFF",
    width: "48px",
    height: "48px",
    borderRadius: "24px",
    filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
  },
  fruitsContainer: {
    width: "70px",
    height: "70px",
    "& > div": {
      width: "70px !important",
      height: "70px !important",
      "& > div": {
        width: "70px !important",
        height: "70px !important",
        justifyContent: "center",
        padding: "12px",
        "& img": {
          margin: 0,
          width: "100%",
          height: "100%",
        },
      },
    },
  },
}));