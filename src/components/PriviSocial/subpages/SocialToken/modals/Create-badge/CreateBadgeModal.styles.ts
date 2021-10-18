import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const createBadgeModalStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeModalContent: {
    backgroundColor: "white",
    padding: "42px 40px",
    boxSizing: "border-box",
    overflow: "auto",
    width: 860,
    left: 290,
    maxWidth: "85vw",
    maxHeight: "85vh",
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
  },
  closeButton: {
    justifySelf: "flex-end",
    alignSelf: "flex-end",
    cursor: "pointer",
  },
  modalTitle: {
    fontWeight: 400,
    fontSize: 22,
    lineHeight: 1.05,
    color: "#707582",
    marginBottom: 24,
  },
  inputHeaderSection: {
    display: "flex",
    marginTop: 0,
    marginBottom: 10,
  },
  infoHeaderTitle: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 18,
    lineHeight: "1.05",
    color: "#707582",
  },
  infoHeaderImg: {
    width: 12,
    height: 12,
    marginLeft: 3,
    marginTop: -3,
  },
  infoInputSection: {
    width: "calc(100% - 24px)",
    height: 46,
    backgroundColor: "#F7F9FE",
    borderRadius: 8,
    border: "1px solid #E0E4F3",
    marginTop: 8,
    color: "rgb(101, 110, 126)",
    fontSize: 14,
    fontWeight: 400,
    paddingLeft: 20,
    marginBottom: 19,
    outline: "none",
    "& ::placeholder": {
      color: "#ABB3C3",
      fontSize: 14,
      fontWeight: 400,
    },
  },
  inputHeaderSectionForBadgeType: {
    display: "flex",
    marginBottom: 10,
  },
  badgeTypeRadio: {
    display: "flex",
    marginLeft: -13,
    alignItems: "center",
    "& span": {
      color: Color.GrayDark,
    },
  },
  modalFooterSection: {
    display: "flex",
    alignItems: "end",
    justifyContent: "flex-end",
    marginTop: "50px",
    "& button": {
      fontFamily: "Agrandir",
      fontWeight: 800,
      fontSize: 16,
      lineHeight: 1,
      color: "#ffffff",
      borderRadius: 10,
      padding: "1px 50px",
      background: '#707582'
    },
  },
  loaderCreateBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));
