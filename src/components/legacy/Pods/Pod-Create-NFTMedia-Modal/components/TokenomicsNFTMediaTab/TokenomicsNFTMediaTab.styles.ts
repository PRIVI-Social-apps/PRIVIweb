import { makeStyles } from "@material-ui/core";

export const tokenomicsNFTMediaTabStyles = makeStyles(() => ({
  tokenomicsTab: {
    margin: 0,
    padding: 0,
    width: "100%",
    flexGrow: 1,
  },
  flexRowInputs: {
    display: "flex",
    marginTop: 16,
  },
  infoHeaderCreatePod: {
    fontSize: 18,
    fontWeight: 400,
    color: "black",
  },
  tooltipHeaderInfo: {
    verticalAlign: "top",
    marginLeft: 2,
    width: 14,
    height: 14,
    transform: "translateY(-5px)",
  },
  textAreaCreatePod: {
    fontFamily: "Agrandir",
    width: "100%",
    height: 140,
    paddingTop: 17,
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    border: "1px solid #b6b6b6",
    marginTop: 8,
    color: "rgb(101, 110, 126)",
    fontSize: 14,
    fontWeight: 400,
    paddingLeft: 20,
    textTransform: "none",
    outline: "none",
    "&::placeholder": {
      color: "rgba(101, 110, 126, 0.5)",
      fontSize: 14,
      fontWeight: 400,
      textTransform: "none",
    },
  },
  divCreatorInput: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  imageCreatePodDiv: {
    position: "relative",
    marginTop: 8,
  },
  imageCreatePod: {
    width: "100%",
    height: "calc(200px - 17px) !important",
    borderRadius: 16,
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 80,
    fontSize: 18,
    cursor: "pointer",
    color: "rgb(100, 200, 158)",
  },
  dragImageHereCreatePod: {
    borderRadius: 16,
    width: "100%",
    height: 200,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginBottom: 20,
    background: "#f6f6f6",
    border: "1px dashed #b6b6b6",
    boxSizing: "border-box",
    marginTop: 8,
  },
  dragImageHereIcon: {
    width: 40,
    height: 32,
    marginBottom: 16,
  },
  dragImageHereLabelImgTitleDesc: {
    fontWeight: 400,
    color: "#99a1b3",
    fontSize: 18,
  },
  dragImageHereLabelImgTitleSubDesc: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
    color: "#949bab",
    "& span": {
      color: "#29e8dc",
    },
  },
  optionButtons: {
    display: "flex",
    alignContent: "space-between",
    alignSelf: "flex-start",
    backgroundColor: "transparent",
  },
  plotSection: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonCreatePodRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 32,
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
  selectorFormControlCreatePod: {
    width: "100%",
  },
  selectCreatePod: {
    fontStyle: "normal",
    backgroundColor: "transparent",
    fontWeight: 800,
    fontSize: 18,
    color: "#181818",
    border: "none",
  },
}));
