import { makeStyles } from "@material-ui/core";

export const requesetAssistanceModalStyles = makeStyles(() => ({
  content: {
    width: "640px",
    display: "flex",
    flexDirection: "column",
    "& label": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      display: "flex",
      alignItems: "center",
      color: "white",
      "& img": {
        marginLeft: "4px",
      },
    },
    "& .MuiOutlinedInput-root": {
      width: "100%",
    },
    "& .MuiFormControl-root": {
      marginTop: "8px",
      width: "100%",
      marginBottom: "24px",
    },
  },
}));
