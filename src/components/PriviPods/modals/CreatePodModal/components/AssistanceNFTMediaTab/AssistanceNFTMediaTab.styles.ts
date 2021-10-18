import { makeStyles } from "@material-ui/core";

export const assistanceNFTMediaTabStyles = makeStyles(() => ({
  createNFTPodAssistance: {
    width: "100%",
    flexGrow: 1,
  },
  rowTitlePodAssistanceLeft: {
    width: "50%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerCreatePod: {
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 22,
    color: "#181818",
    marginBottom: 18,
  },
  rowTitlePodAssistanceRight: {
    display: "flex",
    alignItems: "center",
  },
  tooltipHeaderInfo: {
    verticalAlign: "top",
    marginLeft: 2,
    width: 14,
    height: 14,
    transform: "translateY(-5px)",
  },
  optionButtonsAssistance: {
    marginLeft: 20,
  },
  textButtonMediaFirst: {
    width: 34,
    backgroundColor: "transparent",
    color: "#ffffff",
    height: 34,
    margin: "3px 0px 3px 3px",
    padding: 0,
    borderRadius: "50%",
    cursor: "pointer",
  },
  textButtonMediaFirstSelected: {
    background: "black",
  },
  textButtonMediaSecond: {
    width: 34,
    backgroundColor: "transparent",
    color: "#ffffff",
    height: 34,
    margin: "3px 3px 3px 0px",
    padding: 0,
    borderRadius: "50%",
    cursor: "pointer",
  },
  textButtonMediaSecondSelected: {
    background: "linear-gradient(97.4deg, #29e8dc 14.43%, #03eaa5 79.45%)",
  },
  flexRowInputs: {
    display: "flex",
  },
  flexRowStartCenterAssistance: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  infoHeaderCreatePod: {
    fontSize: 18,
    fontWeight: 400,
    color: "black",
  },
  dropdown: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  textFieldCreatePod: {
    background: "#f7f8fa",
    border: "1px solid #99a1b3",
    borderRadius: 10,
    height: 48,
    width: "100%",
    padding: "0px 10px",
    outline: "none",
    marginTop: 8,
  },
  selector: {
    marginTop: 8,
    background: "#f7f8fa",
    border: "1px solid #99a1b3",
    boxSizing: "border-box",
    borderRadius: 10,
    height: 50,
    padding: "1px 2px 1px 20px",
    width: "100%",
  },
  buttonCreatePodRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 32,
  },
  datePicker: {
    width: "100%",
    "& .MuiInput-root::before": {
      border: "none",
    },
  },
  tableWrapper: {
    paddingTop: 20,
  },
}));
