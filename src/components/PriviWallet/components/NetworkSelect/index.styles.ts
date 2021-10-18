import { makeStyles } from "@material-ui/core";

export const networkSelectStyles = makeStyles(theme => ({
  select: {
    width: "100%",
    "& > div": {
      paddingBottom: "11px",
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
  }
}));
