import { makeStyles } from "@material-ui/core";

export const submitProposalModalStyles = makeStyles(() => ({
  root: {
    width: "700px !important",
  },
  inputContainer: {
    border: "1px solid #FFFFFF",
    boxSizing: "border-box",
    borderRadius: 0,
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "120%",
    color: "white",
    padding: "18.5px 18px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    height: "56px",
    justifyContent: "space-between",
    background: "rgba(255, 255, 255, 0.16)",
    "& input": {
      padding: 0,
      fontFamily: "Agrandir",
      width: 300,
      color: "white",
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
      border: "1px solid #FFFFFF",
      color: "white",
      borderRadius: 0,
      height: "56px",
      background: "rgba(255, 255, 255, 0.16)",
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
