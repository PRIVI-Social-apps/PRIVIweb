import { makeStyles } from "@material-ui/core";

export const createThreadModalStyles = makeStyles(() => ({
  root: {},
  modalContant: {
    padding: 30,
  },
  titleCommunitiesModal: {
    fontSize: 24,
    fontWeight: 800,
    color: "rgb(8, 24, 49)",
  },
  firstRowPost: {
    marginTop: 24,
    marginBottom: 16,
  },
  gridSecondRowCreatePost: {
    marginBottom: 24,
  },
  flexRowInputs: {
    display: "flex",
    marginBottom: 8,
  },
  infoHeaderCreatePod: {
    fontSize: 18,
    fontWeight: 400,
    color: "#181818",
  },
  tooltipHeaderInfo: {
    verticalAlign: "top",
    marginLeft: 2,
    width: 14,
    height: 14,
    transform: "translateY(-5px)",
  },
  hashtagsRowCreatePod: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap-reverse",
  },
  textFieldCreatePod: {
    background: "#f7f9fe",
    border: "1px solid #e0e4f3",
    boxSizing: "border-box",
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-between",
    padding: 15,
    height: 46,
    marginTop: 8,
    width: "100%",
    outline: "none",
    color: "#181818",
  },
  hashtagLabel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
    background: "#ffffff",
    boxShadow: "2px 2px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: 51.4576,
    color: "#4f4f4f",
    fontSize: 14,
    fontWeight: 600,
    padding: "10.0056px 20.0113px 8.57627px",
    marginRight: 10,
  },
  hashtagLabelMain: {
    height: "auto",
    background: "#ffffff",
    boxShadow: "2px 2px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: 51.4576,
    color: "#4f4f4f",
    padding: "10.0056px 20.0113px 8.57627px",
  },
}));
