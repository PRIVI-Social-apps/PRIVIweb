import { makeStyles } from "@material-ui/core";

export const cardsStyles = makeStyles(theme => ({
  cards: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
    height: "fit-content",
    "& > div": {
      width: "100%",
      height: "fit-content",
    },
  },
}));
