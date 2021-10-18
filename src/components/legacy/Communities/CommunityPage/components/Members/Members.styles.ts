import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const memberStyles = makeStyles(() => ({
  communityMembers: {
    width: "100%",
  },
  flexMembersRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    "& input": {
      width: "100%",
      border: "none",
      outline: "none",
      fontSize: 18,
      backgroundColor: Color.GrayInputBackground,
      "&::placeholder": {
        fontFamily: "Agrandir",
        fontSize: 18,
        fontWeight: 400,
        fontStyle: "normal",
        lineHeight: "18px",
        color: "#ABB3C3",
      },
    },
  },
  searchSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: 321,
    border: "1px solid #E0E4F3",
    borderRadius: 10,
    backgroundColor: Color.GrayInputBackground,
  },
  manageRoleBtnSection: {
    display: "flex",
    alignItems: "center",
  },
  membersTable: {
    marginBottom: 20,
  },
  requestMemberNum: {
    backgroundColor: "#F43E5F",
    padding: "0px 5px",
    borderRadius: "100%",
    fontSize: 14,
    fontWeight: 400,
    color: "white",
    marginRight: 40,
    marginLeft: 4,
  },
  table: {
    "& .MuiTableHead-root": {
      backgroundColor: Color.GrayInputBackground,
    },
    "& .MuiTableCell-root": {
      fontFamily: "inherit",
      border: 0,
    },
    "& .MuiTableCell-head": {
      textTransform: "uppercase",
      fontSize: 14,
      color: Color.GrayInputBorderSelected,
      fontWeight: 800,
    },
    "& .MuiTableCell-body": {
      fontSize: 14,
      color: Color.GrayDark,
    },
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
