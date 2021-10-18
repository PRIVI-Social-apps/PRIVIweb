import { makeStyles } from "@material-ui/core";

export const newVoteModalStyles = makeStyles(theme => ({
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
  header2: {
    fontSize: "14px",
    color: '#54658F',
    fontWeight: 600,
  },
  controlBox: {
    background: "#DAE6E5",
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  datepicker: {
    width: "100%",
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: 0,
      "& .MuiInputAdornment-positionEnd": {
        marginLeft: 0,
      },
    },
  },
}));
