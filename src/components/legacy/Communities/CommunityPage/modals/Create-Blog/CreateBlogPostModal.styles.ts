import { makeStyles } from "@material-ui/core";

export const createBlogPostModalStyles = makeStyles(() => ({
  root: {
    width: "892px !important",
  },
  modalContent: {
    padding: 30,
  },
  titleCommunitiesModal: {
    fontSize: 24,
    fontWeight: 800,
    color: "rgb(8, 24, 49)",
  },
  subTitleCommunitiesModal: {
    fontSize: 22,
    fontWeight: 800,
    marginTop: 8,
  },
  flexRowInputsCommunitiesModal: {
    display: "flex",
  },
  firstRowPost: {
    marginTop: 45,
    marginBottom: 20,
  },
  gridSecondRowCreatePost: {
    marginBottom: 16,
  },
  infoHeaderCommunitiesModal: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 18,
    lineHeight: "104.5%",
    color: "#181818",
    display: "flex",
    alignItems: "center",
  },
  infoIconCommunitiesModal: {
    verticalAlign: "top",
    marginLeft: 2,
    width: 12,
    height: 12,
    transform: "translateY(-5px)",
  },
  hashTagBox: {
    marginRight: 8,
    border: `1px solid #888`,
    borderRadius: 16,
    padding: `5px 8px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    cursor: "pointer",
  },
  buttonGroup: {
    marginTop: 16
  }
}));
