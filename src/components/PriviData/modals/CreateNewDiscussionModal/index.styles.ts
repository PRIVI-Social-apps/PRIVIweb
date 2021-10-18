import { makeStyles } from "@material-ui/core";

export const newDiscussionModalStyles = makeStyles(theme => ({
  root: {
    background: "linear-gradient(0deg, #31305D, #31305D), linear-gradient(0deg, #343268, #343268)",
    color: "white !important",
  },
  contentBox: {
    padding: theme.spacing(1),
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: "22px",
    fontWeight: 800,
  },
  header1: {
    fontSize: "16px",
    fontWeight: 600,
  },
  hashTagBox: {
    padding: theme.spacing(1),
    background: "rgba(218, 230, 229, 0.4)",
    borderRadius: theme.spacing(1),
    border: "1px solid #DADADB",
  },
  tagBox: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    borderRadius: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(0deg, rgba(85, 84, 125, 0.42), rgba(85, 84, 125, 0.42))",
  },
  controlBox: {
    background: "#7573AB",
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  datepicker: {
    width: "100%",
    "& input": {
      color: "white",
    },
    "& svg": {
      fill: "white",
    },
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: 0,
      "& .MuiInputAdornment-positionEnd": {
        marginLeft: 0,
      },
    },
  },
  editorBox: {
    background: "rgba(38, 37, 75, 0.7)",
    "& .ql-active svg > *": {
      stroke: "white !important",
    },
    "& div:before": {
      color: "white !important",
    },
  },
}));
