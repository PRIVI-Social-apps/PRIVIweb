import { makeStyles } from "@material-ui/core";
import React from "react";
import { Gradient } from "shared/constants/const";

const useStyles = makeStyles(theme => ({
  switch: {
    background: "#F7F8FA",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    height: "40px",
    padding: "3px",
    cursor: "pointer",
    transition: "all 0.25s",
    width: "fit-content",
    "& button": {
      borderRadius: "17px",
      height: "100%",
      transition: "all 0.25s",
      padding: "0",
      margin: "0",
    },
  },
}));

const CustomSwitchLabels = ({
  checked,
  onChange,
  disabled = false,
  theme,
  options = ["Yes", "No"],
}: {
  checked: boolean;
  onChange: any;
  disabled?: boolean;
  theme?: "dark" | "light" | "green";
  options?: string[];
}) => {
  const classes = useStyles();
  return (
    <div className={classes.switch} onClick={!disabled ? onChange : null}>
      <button
        style={{
          background: !checked
            ? "transparent"
            : theme && theme === "dark"
            ? Gradient.BlueMagenta
            : theme && theme === "green"
            ? Gradient.Green
            : Gradient.Mint,
          color: !checked ? "#707582" : "#181818",
          padding: !checked ? "0px 12px" : "0px 16px",
        }}
      >
        {options[0]}
      </button>
      <button
        style={{
          background: checked
            ? "transparent"
            : theme && theme === "dark"
            ? Gradient.BlueMagenta
            : theme && theme === "green"
            ? Gradient.Green
            : Gradient.Mint,
          color: checked ? "#707582" : "#181818",
          padding: checked ? "0px 10px" : "0px 16px",
        }}
      >
        {options[1]}
      </button>
    </div>
  );
};

export default CustomSwitchLabels;
