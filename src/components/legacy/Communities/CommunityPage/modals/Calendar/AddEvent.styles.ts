import { makeStyles } from "@material-ui/core";

export const addEventModalStyles = makeStyles(() => ({
  root: {
    width: "450px !important",
  },
  modalContent: {
    "& h4": {
      fontSize: 18,
      fontWeight: 800,
      display: "flex",
      justifyContent: "center",
    },
  },
  infoHeaderCreatePod: {
    fontSize: 18,
    fontWeight: 400,
    color: "black",
  },
  addBtn: {
    marginTop: 20,
    display: "flex",
    justifyContent: "flex-end",
  },
}));
