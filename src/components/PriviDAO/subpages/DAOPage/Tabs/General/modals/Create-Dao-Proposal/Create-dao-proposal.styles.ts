import { makeStyles } from "@material-ui/core";

export const createDaoProposalModalStyles = makeStyles(() => ({
  rootDark: {
    width: "620px !important",
  },
  maxWidth: {
    width: "100%",
    "& *": {
      width: "100% !important",
    },
  },
  removePodButtonProject: {
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    color: "white",
    backgroundColor: "transparent",
    marginLeft: 16,
  },
}));
