import { makeStyles } from "@material-ui/core";

export const createClaimablePodModalStyles = makeStyles(() => ({
  root: {
    width: "654px !important",
    backgroundColor: "#EAE8FA !important",
    boxShadow: "0px 2px 14px rgba(0, 0, 0, 0.08)",
    borderRadius: 14,

    "& .dragImageHereImgTitleDesc": {
      backgroundColor: "#FFF",
      "& span": {
        color: "#627EEA",
      },
    },
  },
  modalContent: {
    padding: "20px 10px",
  },
  mainTitle: {
    marginTop: 0,
    fontSize: 22,
    fontWeight: 800,
  },
  label: {
    fontSize: 18,
    fontWeight: 400,
    marginTop: 10,
    marginBottom: 10,
  },
  warning: {
    display: "flex",
    alignItems: "center",
    color: "#707582",
    marginTop: 16,
    "& img": {
      marginRight: 8,
    },
  },
  songList: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #eff2f8",
    borderBottom: "1px solid #eff2f8",
    padding: "15px 0 12px 0",
    "& span": {
      display: "flex",
      alignItems: "center",
    },
  },
  songInfo: {
    display: "flex",
    flexDirection: "column",
    "& h6": {
      marginTop: 0,
      marginBottom: 8,
      fontWeight: 800,
      fontSize: 14,
      color: "#181818",
    },
    "& span": {
      fontWeight: 400,
      fontSize: 11,
      color: "#707582",
    },
  },
  failRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 8,
    fontSize: 14,
    // color: "#65cb63",
    color: "#f43e5f",
    "& img": {
      marginRight: 8,
    },
  },
  loaderSpinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  blockchainDropdown: {
    "& .MuiInputBase-root": {
      backgroundColor: "#EAE8FA",
      borderColor: "#7F6FFF",
    },
  },
  priceContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "5px 10px 5px 10px",
    border: "1px solid rgba(114, 127, 154, 1)",
    borderRadius: 6,
    backgroundColor: "#FFF",
    "& h1": {
      fontSize: 14,
      fontWeight: 800,
      lineHeight: "14.63px",
      marginLeft: 10,
      marginRight: 10,
    },
    "& h2": {
      fontSize: 14,
      fontWeight: 400,
      color: "rgba(112, 117, 130, 1)",
      lineHeight: "16.8px",
      margin: 0,
    },
  },
  verticalDivide: {
    width: 1,
    height: 20,
    marginRight: 8.5,
    backgroundColor: "rgba(153, 161, 179, 1)",
  },
  priviFreeZone: {
    background: "linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%)",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: 6,
    padding: 24,
    color: "white",
    fontWeight: 800,
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    margin: "0 12px",
    "& p": {
      fontSize: 14,
      fontWeight: 400,
      color: "white",
      marginTop: 8,
      marginBottom: 0,
    },
  },
  fire: {
    minWidth: 44,
    height: 44,
    background: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatar: {
    borderRadius: "50%",
  },
  avatarWrapper: {
    display: "flex",
    alignItems: "center",
    "& span": {
      marginLeft: 10,
    },
  },
  actionButtons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: -10,
    "& button": {
      padding: "4px 26px",
      height: 40,
    },
  },
  songName: {
    fontSize: 18,
    fontWeight: 800,
  },
  songInfoSection: {
    margin: "12px 0",
    padding: "12px 0",
    display: "flex",
    flexDirection: "column",
    borderTop: "1px solid #eff2f8",
    borderBottom: "1px solid #eff2f8",
    "& h3": {
      fontSize: 18,
      fontWeight: 400,
      color: "#181818",
      marginBottom: 8,
    },
  },
  dashLine: {
    width: "100%",
    borderTop: "1px dashed #181818",
    height: 0,
    marginBottom: 8,
    opacity: 0.3,
  },
  detailInfo: {
    fontSize: 11,
    color: "#707582",
    lineHeight: "150%",
    "& b": {
      fontWeight: 800,
    },
  },
  successRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 8,
    fontSize: 14,
    color: "#65cb63",
    "& img": {
      marginRight: 8,
    },
  },
}));
