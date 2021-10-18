import { makeStyles } from "@material-ui/core/styles";
import { Gradient } from "shared/ui-kit";

export const generalStyles = makeStyles(() => ({
  general: {
    width: "100%",
    color: "white",
  },
  contributionCards: {
    display: "grid",
    gridColumnGap: "20px",
    gridEowGap: "20px",
    padding: "0px",
  },
  generalColumnContainer: {
    display: "flex",
    overflowX: "auto",
    marginBottom: "62px",
    paddingBottom: "10px",
  },
  generalColumnItem: {
    marginRight: "20px",
    minWidth: "320px",
  },
  viewAll: {
    cursor: "pointer",
    fontSize: "23px",
    background: Gradient.BlueMagenta,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
}));
