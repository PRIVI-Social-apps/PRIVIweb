import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const playerStyles = makeStyles(theme => ({
  player: {
    height: 120,
    width: "100%",
    background: "#181818",
    maxHeight: 120,
  },
  songInfo: {
    display: "flex",
    alignItems: "center",
    "& img": {
      marginLeft: 12,
      cursor: "pointer",
      width: 40,
    },
  },
  albumImage: {
    width: 72,
    height: 72,
    minWidth: 72,
    marginRight: 8,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    [theme.breakpoints.down("xs")]: {
      width: 64,
      height: 64,
      minWidth: 64,
    }
  },
  title: {
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: 14,
    lineHeight: "104.5%",
    display: "flex",
    alignItems: "center",
    color: "#ffffff",
  },
  artist: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: "120%",
    display: "flex",
    alignItems: "center",
    color: "#ffffff",
    marginTop: 4,
  },
  controls: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "70%",
    justifyContent: "space-between",
    "& button": {
      backgroundColor: "transparent",
      padding: 0,
      height: "auto",
      borderRadius: 0,
      margin: "0px 10px",
      width: "fit-content",
    },
    "& button img": {
      height: 12,
    },
    "& button:nth-child(3) img": {
      height: 30,
    },
    "& button:nth-child(4) img": {
      transform: "rotate(180deg)",
    },
  },
  spent: {
    padding: "12px 16px 8px",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 18,
    lineHeight: "104.5%",
    background: "#ffffff",
    borderRadius: 6,
    marginLeft: 40,
    textAlign: "center",
    color: "#181818",
  },
  tracking: {
    width: "100%",
    "& div": {
      margin: "0px 5px",
    },
  },
  track: {
    width: "100%",
    flexGrow: 1,
  },
  trackMobile: {
    marginBottom: 10,
    width: "100%",
    flexGrow: 1,
  },
  controlsRight: {
    display: "flex",
    alignItems: "center",
    width: 150,
    "& > img": {
      cursor: "pointer",
      marginRight: 10,
    },
  },
  free: {
    background: "linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)",
    borderRadius: 54,
    padding: "8px 16px",
    marginLeft: 16,
  },
  pointer: {
    cursor: "pointer",
  },
  fruitIcon: {
    background: 'transparent',
    color: 'black',
    height: "unset",
    padding: 0,
  },
  paper: {
    background: Color.White,
    boxShadow: "0px 47px 65px -11px rgba(36, 46, 60, 0.21)",
    borderRadius: 12,
    "& .MuiListItem-root.MuiMenuItem-root > svg": {
      marginRight: 12,
    }
  },
  homeButton: {
    background: "linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)",
    borderRadius: "24px !important",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& svg": {
      marginRight: 12,
    }
  }
}));
