import { makeStyles } from "@material-ui/core";

export const collabsTabStyles = makeStyles(() => ({
  inputContainer: {
    background: "rgba(255, 255, 255, 0.4)",
    border: "1px solid #DADADB",
    boxSizing: "border-box",
    borderRadius: "48px",
    height: "56px",
    width: "100%",
    padding: "14px 20px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& img": {
      width: "17px",
      height: "17px",
    },
  },
  addRound: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#65CB63",
    width: "29px",
    height: "29px",
    marginLeft: "12px",
    "& svg": {
      width: "10px",
      height: "10px",
    },
  },
  addButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "6px 15px 6px 6px",
    margin: "50px 0px 0px",
    background: "#F0F5F8",
    borderRadius: "41px",
    color: "#2D3047",
    fontSize: "14px",
    fontWeight: 800,
    "& svg": {
      marginRight: "10px",
      width: "10px",
      height: "10px",
    },
  },

  userTile: {
    padding: "20px 0px",
    color: "#404658",
    fontFamily: "Montserrat",
    fontSize: "16px",
    borderBottom: "1px solid #00000021",
  },
}));

export const useAutocompleteStyles = makeStyles(() => ({
  root: {
    width: "100%",
  },
}));
