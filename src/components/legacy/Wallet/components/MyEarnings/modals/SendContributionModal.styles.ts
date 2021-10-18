import { makeStyles } from "@material-ui/core";

export const sendContributionModalStyles = makeStyles(() => ({
  root: {
    width: "540px !important",
  },
  modalContent: {
    padding: "10px 20px",
    "& h4": {
      fontWeight: 400,
      fontSize: 22,
      margin: 0,
    },
    "& h5": {
      fontWeight: 400,
      fontSize: 18,
      marginTop: 0,
      marginBottom: 4,
    },
  },
  autoCompleteRoot: {
    fontFamily: "Agrandir",
    paddingLeft: 20,
    paddingRight: 16,
    height: 46,
    width: "100%",
    display: "flex",
    marginTop: 10,
    alignItems: "center",
    background: "#F7F9FE",
    border: "1px solid #E0E4F3",
    borderRadius: 8,
    color: "#707582",
  },
  autoCompleteInput: {
    "& .MuiInputBase-root": {
      paddingRight: 0,
      fontSize: 14,
    },
  },
  communityItem: {
    borderBottom: "1px solid #EFF2F8",
    "& span": {
      fontSize: 14,
    },
  },
  textColorGrey: {
    color: "#707582",
  },
  textBold: {
    fontWeight: 800,
  },
  formControlInput: {
    width: "100%",
    "& div.MuiOutlinedInput-root": {
      background: "#F7F9FE",
      border: "1px solid #E0E4F3",
      borderRadius: 8,
      color: "#707582",
      height: 47,
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    },
  },
}));
