import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "shared/ui-kit/Box";

interface IStyleProps {
  checked?: boolean;
}

const useStyles = makeStyles(theme => ({
  container: {
    position: "relative",
    borderRadius: theme.spacing(2),
    height: theme.spacing(4),
    boxShadow: "2px 2px 12px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    width: theme.spacing(14),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(0.5),
  },
  checkedBox: (props: IStyleProps) => ({
    position: "absolute",
    left: 0,
    top: 0,
    width: theme.spacing(7),
    borderRadius: theme.spacing(2),
    background: props.checked ? "#29e8dc" : "none",
    color: props.checked ? "white" : "black",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  unCheckedBox: (props: IStyleProps) => ({
    position: "absolute",
    right: 0,
    top: 0,
    width: theme.spacing(7),
    borderRadius: theme.spacing(2),
    background: props.checked ? "none" : "#cccccc",
    color: props.checked ? "black" : "white",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
}));

const CustomSwich = props => {
  const classes = useStyles({ checked: props.checked });

  return (
    <Box className={classes.container} onClick={props.onChange}>
      <Box className={classes.checkedBox}>
        <Box>Yes</Box>
      </Box>
      <Box className={classes.unCheckedBox}>
        <Box>No</Box>
      </Box>
    </Box>
  );
};

export default CustomSwich;
