import { makeStyles } from "@material-ui/core";

export const changeAnonAvatarModalStyles = makeStyles(() => ({
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
  closeButton: {
    display: "flex",
    justifyContent: "flex-end",
    cursor: "pointer",
  },
  avatarList: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 15,
    "&:hover": {
      cursor: "pointer",
    },
  },
  avatarSelected: {
    border: "5px solid #64c89e",
    width: 80,
    height: 80,
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
  },
  footerSection: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));
