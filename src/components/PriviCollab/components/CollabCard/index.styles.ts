import { makeStyles } from "@material-ui/core";

export const collabCardStyles = makeStyles(theme => ({
  container: {
    background: "#FFFFFF",
    boxShadow: "0px 1.44256px 8.65535px rgba(0, 0, 0, 0.04)",
    borderRadius: 12,
    paddingTop: 24,
    paddingBottom: 18,
    paddingLeft: 18,
    paddingRight: 18,
    overflow: "hidden",
  },
  highlight: {
    color: "#FF801A !important",
    backgroundImage: "linear-gradient(97.4deg, #FF7B1C 14.43%, #FFB800 85.96%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  highlightBlue: {
    color: "#0089EC !important",
  },
  avatarContainer: {
    "& div + div": {
      marginLeft: "-8px !important",
    },
    "& > div div": {
      border: "2px solid white",
    },
  },
  iconButton: {
    borderRadius: "100% !important",
  },
  acceptLabel: {
    background: "#FF933C",
    borderRadius: 52,
    padding: "8px 6px",
    width: "fit-content",

    "& span": {
      marginLeft: 4,
    },
  },
  completion: {
    padding: "15px 24px",
    background: "linear-gradient(50.01deg, #FF8E3C 23.9%, #FF3C5F 182.56%)",
    marginLeft: -18,
    marginRight: -18,
    marginBottom: -18,
  },
}));
