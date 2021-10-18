import { makeStyles } from "@material-ui/core";

export const createBadgeModalStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "892px !important",
    color: "#707582",
    fontSize: 18,
    "& img": {
      width: 12,
      height: 12,
      marginBottom: 10,
    },
  },
  modalTitle: {
    fontWeight: 400,
    fontSize: 22,
    lineHeight: "104.5%",
    marginBottom: 24,
  },
  infoHeaderImg: {
    width: 12,
    height: 12,
    marginLeft: 4,
    marginBottom: 0,
  },
  radio: {
    color: "#707582",
    "& *": {
      color: "#707582",
    },
  },
  radioContent: {
    "& span": {
      color: "#707582",
      fontFamily: "Agrandir",
      fontSize: 14,
    },
    "& input": {
      color: "#707582",
    },
  },
}));
