import { makeStyles } from "@material-ui/core";
import { Gradient } from "shared/ui-kit";

export const useClosenessDegreeModalStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "597px !important",
    color: "#181818",
    "& h3": {
      marginTop: 24,
      marginBottom: 28,
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: 18,
      lineHeight: "104.5%",
    },
  },
  urlSlug: {
    fontSize: 14,
    marginTop: 4,
    background: Gradient.Magenta,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  slider: {
    widht: "100%",
  },
}));
