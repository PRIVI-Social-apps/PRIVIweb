import { makeStyles } from "@material-ui/core";

export const inviteProposalModalStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  autoCompleteInput: {
    "& .MuiInputBase-root": {
      paddingRight: 0,
      fontSize: 14,

      "&::before": {
        borderBottom: "none",
      },
    },
  },
  communityItem: {
    borderBottom: "1px solid #EFF2F8",
    padding: 10,
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
  userItem: {
    borderBottom: "1px dashed #E0E4F3",
    padding: "16px 16px",
  },
  userItemCenter: {
    borderLeft: "1px solid #E0E4F3",
    borderRight: "1px solid #E0E4F3",
  },
  infoImg: {
    width: 15,
    height: 15,
    marginLeft: 5,
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
}));

export const useAutocompleteStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  listbox: {
    maxHeight: 168,
  },
  option: {
    height: 52,
  },
}));
