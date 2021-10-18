import { makeStyles } from "@material-ui/core";

export const previewCreatedPostStyles = makeStyles(() => ({
  postPreviewContainer: {
    display: "flex",
    flexDirection: "column",
    "& h2": {
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: 40,
      lineHeight: "104.5%",
      color: "#181818",
      margin: "0px 0px 30px",
    },
    "& h3": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 30,
      lineHeight: "104.5%",
      color: "#181818",
      margin: "0px 0px 50px",
    },
  },
  previewTitle: {
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 22,
    color: "#181818",
    marginBottom: 70,
  },
  previewImage: {
    height: 290,
    width: "100%",
    borderRadius: 14,
    marginBottom: 40,
  },
  content: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "120%",
    color: "#707582",
    marginBottom: 40,
  },
  hashtag: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "7px 12px 6px",
    height: 28,
    background: "#181818",
    borderRadius: 36,
    color: "white",
    fontSize: 14.5,
    marginRight: 8,
  },
}));
