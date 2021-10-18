import { makeStyles } from "@material-ui/core";

export const buyNFTModalStyles = makeStyles(theme => ({
  modal: {
    padding: "25px 20px",
    width: "545px !important",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    "& h2": {
      margin: 0,
      marginBottom: 64,
      color: "#181818",
      fontSize: 22,
    },
  },
  nftInfo: {
    display: "flex",
    alignItems: "center",
    "& img": {
      width: 75,
      height: 75,
      borderRadius: 6,
      marginRight: 26,
    },
    "& h2": {
      margin: 0,
      flex: 1,
    },
  },
  flexCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    "& h5": {
      fontSize: 18,
      color: "#181818",
      margin: 0,
    },
    "& div": {
      fontSize: 14,
      color: "#707582",
    },
  },
  divider: {
    marginTop: 20,
    marginBottom: 26,
    width: "100%",
    height: 1,
    opacity: 0.1,
    background: "#181818",
  },
  nftDesc: {
    fontSize: 14,
    color: "#707582",
    marginBottom: 26,
  },
  actionButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 32,
  },
  primary: {
    background: "#1b1b1b",
    borderRadius: "4px !important",
  },
  secondary: {
    background: "#ffffff",
    border: "1px solid #cbcbcb !important",
    borderRadius: "4px !important",
  },
}));
