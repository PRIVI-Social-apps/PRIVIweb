import { makeStyles } from "@material-ui/core";

export const placeBuyingOfferModalStyles = makeStyles(theme => ({
  modal: {
    padding: "25px 20px",
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
  nftInfoHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    color: "#181818",
    paddingBottom: 3,
  },
  divider: {
    width: "100%",
    height: 1,
    opacity: 0.1,
    background: "#181818",
  },
  nftInfo: {
    display: "flex",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
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
    alignItems: "flex-end",
    "& h5": {
      fontSize: 18,
      color: "#181818",
      margin: 0,
    },
    "& span": {
      fontSize: 14,
      color: "#707582",
    },
  },
  offerInputWrapper: {
    padding: "16px 0",
    display: "flex",
    alignItems: "center",
    "& span": {
      flex: 1,
      fontSize: 14,
      color: "#181818",
    },
  },
  inputPrice: {
    marginRight: 18,
  },
  tokenSelect: {},
  nftDesc: {
    fontSize: 14,
    color: "#707582",
    marginTop: 26,
    marginBottom: 26,
  },
  actionButtons: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 32,
    "& button": {
      padding: "0 26px",
    },
  },
  primary: {
    background: "#1b1b1b",
    borderRadius: "4px !important",
  },
  borderBox: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: theme.spacing(1),
    height: "50px",
    color: "#2D3047",
    cursor: "pointer",
    border: "1px solid #E0E4F3",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));
