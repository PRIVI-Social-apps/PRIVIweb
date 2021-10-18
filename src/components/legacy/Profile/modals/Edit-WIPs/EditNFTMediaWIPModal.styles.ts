import { makeStyles } from "@material-ui/core";

export const editNFTMediaWIPModalStyles = makeStyles(() => ({
  modalContent: {
    padding: 30,
  },
  cardsOptions: {
    display: "flex",
    marginTop: -13,
    alignItems: "flex-start",
    marginBottom: 50,
  },
  tabHeaderPodMedia: {
    width: "auto",
    marginRight: 30,
  },
  tabHeaderPodMediaSelected: {
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 14,
    height: "auto",
    background: "-webkit-linear-gradient(97.4deg, #29e8dc 14.43%, #03eaa5 79.45%)",
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
    margin: 0,
    fontFamily: "Agrandir",
    color: "#29e8dc",
    borderBottom: "3px solid #29e8dc",
    cursor: "pointer",
  },
  tabHeaderPodMediaUnselected: {
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 14,
    height: "auto",
    color: "#99a1b3",
    fontFamily: "Agrandir",
    margin: 0,
    cursor: "pointer",
  },
  tabHeaderPodMediaLine: {
    background: "linear-gradient(97.4deg, #29e8dc 14.43%, #03eaa5 79.45%) left bottom #777 no-repeat",
    backgroundSize: "100% 5px",
  },
  flexCenterCenterRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));
