import { makeStyles } from "@material-ui/core";

export const verticalNetworkSelectStyles = makeStyles(theme => ({
  container: {
    border: "1px solid #C0C6DC",
    padding: "8px",
    paddingBottom: 0,
    borderRadius: "8px",
  },
  select: {
    width: "100%",
    "& > div": {
      paddingBottom: "11px",
    },
    "&:before": {
      display: "none",
    },
    "&:after": {
      display: "none",
    },
    "& .MuiInputBase-root": {
      borderRadius: 8,
      border: "none",
      backgroundColor: "#f7f9fe",
      color: "rgb(101, 110, 126)",
      "& .MuiSelect-select:focus": {
        background: "unset",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
        background: "unset",
      },
    },
  },
}));
