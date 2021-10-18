import { makeStyles } from "@material-ui/core";

export const submitProposalModalStyles = makeStyles(() => ({
  root: {
    width: "700px !important",
  },
  inputContainer: {
    border: "1px solid #C0C6DC",
    boxSizing: "border-box",
    borderRadius: 6,
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "120%",
    color: "#181818",
    padding: "18.5px 18px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    height: 45,
    justifyContent: "space-between",
    "& input": {
      padding: 0,
      fontFamily: "Agrandir",
      width: 300,
    },
    "& img": {
      width: 17,
      height: 17,
    },
  },
  userImage: {
    width: 30,
    height: 30,
    minWidth: 30,
    borderRadius: 15,
    backgroundColor: "#656e7e",
    marginRight: 10,
  },
  formControlInput: {
    width: "100%",
    "& div.MuiOutlinedInput-root": {
      fontFamily: "Agrandir",
      border: "1px solid #C0C6DC",
      borderRadius: 6,
      color: "#707582",
      height: 40,
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    },
  },
}));

export const useAutoCompleteStyles = makeStyles({
  root: {
    width: "100%",
  },
  listbox: {
    maxHeight: 168,
  },
  option: {
    height: 52,
  },
});
