import { makeStyles } from "@material-ui/core";

export const discoverStyles = makeStyles(theme => ({
  content: {
    width: "100%",
  },
  gradientImg: {
    position: "absolute",
    width: "80%",
    top: 0,
  },
  order: {
    marginLeft: 16,
    backgroundColor: "white",
    borderRadius: 44,
    border: "1px solid #C0C6DC",
    paddingLeft: 16,
    paddingRight: 16,
    minWidth: 170,
    "& .MuiSelect-select": {
      "&:focus": {
        backgroundColor: "transparent",
      },
    },
  },
  mainImage: {
    width: "100%",
  },
  sideImage: {},
  filterContainer: {},
  "@media (max-width: 780px)": {
    sideImage: {
      display: "none",
    },
    filterContainer: {
      justifyContent: "center",
      marginBottom: 10,
      "& > div": {
        marginTop: 10,
      },
    },
  },
}));
