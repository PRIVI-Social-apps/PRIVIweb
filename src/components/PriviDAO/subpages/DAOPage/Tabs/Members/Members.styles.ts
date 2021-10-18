import { makeStyles } from "@material-ui/core/styles";

export const memberStyles = makeStyles(() => ({
  communityMembers: {
    width: "100%",
  },
  flexMembersRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    "& input": {
      width: "100%",
      border: "none",
      outline: "none",
      fontSize: 14,
      color: "#FFFFFF",
      backgroundColor: "transparent",
      "&::placeholder": {
        fontFamily: "Agrandir",
        fontSize: 14,
        fontWeight: 400,
        fontStyle: "normal",
        lineHeight: "18px",
        color: "#FFFFFF",
      },
    },
  },
  searchSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: 321,
    border: "1.5px solid #FFFFFF",
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  manageRoleBtnSection: {
    display: "flex",
    alignItems: "center",
    "& button": {
      marginTop: "0px !important",
      marginLeft: "24px",
    },
  },
  membersTable: {
    marginBottom: 20,
  },
  requestMemberNum: {
    backgroundColor: "#D10869",
    borderRadius: "100%",
    fontSize: 10,
    fontWeight: 400,
    color: "white",
    marginRight: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "16px",
    height: "16px",
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 25,
    backgroundColor: "#656e7e",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    cursor: "pointer",
    border: "2px solid #ffffff",
    boxShadow: "0px 2px 8px rgb(0 0 0 / 20%)",
  },
  backBtn: {
    cursor: "pointer",
  },
  ejectMember: {
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  manageBtn: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#ccb9b9",
    },
  },
}));
