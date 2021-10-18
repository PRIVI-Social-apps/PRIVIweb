import { makeStyles } from "@material-ui/core";

export const createThreadModalStyles = makeStyles(() => ({
  root: {
    width: "640px !important",
  },
  hashtagLabel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
    background: "rgba(255, 255, 255, 0.16)",
    color: "white",
    fontSize: 14,
    fontWeight: 600,
    padding: "10px 20px 8px",
    marginRight: 10,
  },
  hashtagLabelMain: {
    background: "#ffffff",
    color: "#1A1B1C",
  },
}));
