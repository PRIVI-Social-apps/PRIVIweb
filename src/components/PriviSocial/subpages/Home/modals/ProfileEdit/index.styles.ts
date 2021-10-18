import { makeStyles } from "@material-ui/core";

export const profileEditModalStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "800px !important",
  },
  content: {
    width: "100%",
    height: "100%",
    minHeight: 676,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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
