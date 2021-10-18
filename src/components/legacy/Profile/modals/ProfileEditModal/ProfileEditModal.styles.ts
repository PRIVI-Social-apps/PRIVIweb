import { makeStyles } from "@material-ui/core";

export const profileEditModalStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "800px !important",
  },
  modalEditFullDiv: {
    overflow: "auto",
    width: "100%",
    height: "100%",
  },
  content: {
    width: "100%",
    height: "100%",
    minHeight: 676,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  textFieldEdit: {
    outline: "none",
    height: "auto",
    borderRadius: 8,
    backgroundColor: "#f7f9fe",
    border: "1px solid #e0e4f3",
    marginTop: 8,
    color: "rgb(112,117,130)",
    fontSize: 14,
    fontWeight: 400,
    padding: 16,
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  textAreaEdit: {
    width: "100%",
    border: "1px solid #e0e4f3",
    borderRadius: "8px",
    height: "80px",
    padding: "16px",
    backgroundColor: "#f7f9fe",
    outline: "none",
    color: "rgb(112,117,130)",
    fontSize: 14,
    fontWeight: 400,
    marginTop: 8,
  },
  infoHeaderEdit: {
    fontSize: 18,
    fontWeight: 400,
    color: "#181818",
  },
  infoIconEdit: {
    width: 12,
    height: 12,
    marginLeft: 3,
    marginTop: -3,
  },
  flexRowInputs: {
    display: "flex",
  },
  snackBar: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  selected: {
    textAlign: "center",
    fontSize: "16px",
    fontWeight: 700,
    textTransform: "capitalize",
    width: "auto",
    minWidth: "auto",
    padding: "0",
    marginRight: 24,
    color: "#03EAA5",
    minHeight: 17,
    height: 17,
  },
  activeItem: {
    textAlign: "center",
    fontSize: "16px",
    fontWeight: 700,
    textTransform: "capitalize",
    color: "#707582",
    width: "auto",
    minWidth: "auto",
    padding: "10px 0",
    marginRight: 24,
    minHeight: 17,
    height: 17,
  },
  closeButton: {
    position: "absolute",
    top: 24,
    right: 40,
    cursor: "pointer",
  },
  socialFields: {
    "& > div": {
      position: "relative",
      "& > img": {
        position: "absolute",
        right: 0,
        bottom: 0,
      },
    },
  },
  tabWrapper: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "40px",

    "& .MuiAppBar-root": {
      width: "auto",
    },
    "& .anon-mode": {
      display: "flex",
      columnGap: 8,
      alignItems: "center",
      marginLeft: "40px",
    },
    "& .option-buttons": {
      borderRadius: 20,
      width: 40,
      height: 24,
      padding: 2,
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    },
    "& .private-title": {
      fontWeight: "bold",
      fontSize: "13px",
      color: "#707582",
      position: "relative",
    },

    "& .option-buttons.selected": {
      justifyContent: "flex-end",
      background: "linear-gradient(97.4deg, #23d0c6 73.68%, #00cc8f 85.96%)",
    },

    "& .option-buttons.unSelected": {
      background: "#e2e8ee",
      justifyContent: "flex-start",
    },

    "& .option-buttons .switch": {
      width: 20,
      height: 20,
      borderRadius: "100%",
      background: "#ffffff",
      boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.15), 0px 3px 1px rgba(0, 0, 0, 0.06)",
    },
    "& .tooltip": {
      marginLeft: 3,
    },
  },
  editButton: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "16px",
    "& button": {
      width: "fit-content",
    },
  },
}));
