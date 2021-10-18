import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const songsTabStyles = makeStyles(() => ({
  button: {
    width: "100% !important",
    background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
    color: `${Color.MusicDAODark} !important`,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px 0px",
    border: "1px dashed #788BA2",
    "& svg": {
      marginRight: 12,
    },
  },
  title: {
    fontFamily: "Agrandir GrandLight",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "18px",
    lineHeight: "130%",
    color: "#2D3047",
    marginBottom: "36px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#2D3047",
    opacity: 0.9,
    fontFamily: "Montserrat",
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "8px",
  },
  input: {
    background: "rgba(218, 230, 229, 0.4)",
    border: "1px solid #DADADB",
    borderRadius: 8,
    height: 45,
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
  },
  card: {
    background: "linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8",
    border: "1px solid rgba(84, 101, 143, 0.2)",
    borderRadius: 17,
    padding: "22px 24px",
  },
  removeButton: {
    background: "#EFDDDD !important",
    color: "#F43E5F !important",
    textTransform: "uppercase",
    border: "none !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& svg": {
      marginRight: 8,
    },
  },
  editButton: {
    background: "#DDE6EF !important",
    color: "#54658F !important",
    textTransform: "uppercase",
    border: "none !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& svg": {
      marginRight: 8,
    },
  },
}));
