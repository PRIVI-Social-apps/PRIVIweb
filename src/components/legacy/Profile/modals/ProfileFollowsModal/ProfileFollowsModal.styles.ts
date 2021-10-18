import { makeStyles } from "@material-ui/core";

export const profileFollowsModalStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  followModalContent: {
    backgroundColor: "#ffffff",
    padding: 40,
    width: 892,
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
  modalHeader: {
    marginBottom: 20,
    fontSize: 24,
    paddingLeft: 15,
    width: "100%",
  },
  modalNoItems: {
    paddingLeft: 15,
  },
  modalScroll: {
    overflowY: "hidden",
    height: "auto",
    width: "100%",
    paddingRight: 20,
    scrollbarWidth: "none",
  },
  rowMyAction: {
    alignItems: "center",
    paddingTop: 10,
    justifyContent: "space-between",
  },
  gridProfilePhoto: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    position: "relative",
    marginTop: 5,
  },
  profilePhotoItem: {
    backgroundColor: "#ffffff",
    width: 70,
    height: 70,
    cursor: "pointer",
    borderRadius: "100%",
    position: "relative",
    zIndex: 1,
    border: "2px solid white",
    filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
  },
  gridItems: {
    paddingTop: 10,
    fontSize: 12,
  },
  nameItem: {
    cursor: "pointer",
    fontWeight: 400,
    fontSize: 18,
    textAlign: "center",
    marginTop: 12,
  },
  infoDiv: {
    display: "flex",
    fontSize: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 8,
    "& img": {
      width: 20,
      height: "auto",
      marginRight: 10,
    },
    "& ::last-child": {
      marginTop: 10,
    },
  },
  infoDivTitle: {
    color: "#99a1b3",
  },
  optionsConnectionButtonUnfollow: {
    background: "transparent",
    color: "rgb(0, 0, 0)",
    border: "1px solid rgb(153, 161, 179)",
  },
  optionsConnectionButtonRequest: {
    background: "linear-gradient(97.4deg, #ff79d1 14.43%, #db00ff 79.45%)",
  },
  optionsConnectionButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textTransform: "none",
    fontSize: 14,
    height: 42,
    border: "none",
    fontWeight: 800,
    background: "linear-gradient(97.4deg, #29e8dc 14.43%, #03eaa5 79.45%)",
    borderRadius: 12,
    width: 120,
  },
}));
