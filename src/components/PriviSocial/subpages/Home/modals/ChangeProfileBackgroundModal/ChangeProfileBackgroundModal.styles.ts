import { makeStyles } from "@material-ui/core";

export const changeProfileBackgroundModalStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#ffffff",
    padding: 40,
    width: "65%",
    borderRadius: 16,
    maxWidth: "85vw",
    maxHeight: "85vh",
    overflow: "auto",
    outline: "none",
  },
  avatarList: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 220,
    height: 220,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 15,
    "&:hover": {
      cursor: "pointer",
    },
  },
  avatarSelected: {
    border: "5px solid #64c89e",
    width: 220,
    height: 220,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 15,
    "&:hover": {
      cursor: "pointer",
    },
  },
  headerSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& h3": {
      fontSize: 32,
      fontWeight: 800,
      fontFamily: 'Agrandir'
    }
  },
  footerSection: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 16
  },
}));
