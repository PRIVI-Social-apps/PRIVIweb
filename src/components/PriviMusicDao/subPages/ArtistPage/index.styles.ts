import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const artistPageStyles = makeStyles(theme => ({
  content: {
    background: "linear-gradient(180.15deg, #FFFFFF 2.8%, #EEF2F6 89.51%)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "60px 168px 150px 168px",
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
    [theme.breakpoints.down('md')]: {
      padding: "42px 24px 80px 24px"
    }
  },
  gradient: {
    position: "absolute",
    width: "100%",
    height: 485,
    left: 0,
    top: 0,
    backgroundImage: `url(${require("assets/backgrounds/artist_background.png")})`,
    backgroundSize: "cover",
  },
  svgBox: {
    width: 24,
    cursor: "pointer",
    "& svg": {
      width: "100%",
      height: "100%",
    },
    "& path": {
      stroke: "black",
    },
  },
  paper: {
    width: 267,
    marginRight: -267,
    marginLeft: -90,
    borderRadius: 10,
    boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
    position: "inherit",
  },
  whiteBox: {
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(0.5)}px ${theme.spacing(3)}px`,
    background: "white",
    borderRadius: theme.spacing(4),
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "44px",
    color: "#081831",
    fontWeight: 800,
  },
  header1: {
    fontSize: 21,
    fontWeight: 800,
    color: Color.MusicDAODark,
  },
  header2: {
    fontSize: "16px",
    color: Color.MusicDAOLightBlue,
    fontWeight: 800,
  },
  header3: {
    fontSize: 14,
    fontWeight: 600,
    color: Color.MusicDAODark,
  },
  header4: {
    fontSize: 13,
    fontWeight: 500,
    color: "#707582",
  },
  vert: {
    width: 1,
    height: 30,
    background: "#000000",
    opacity: 0.1,
  }
}));
