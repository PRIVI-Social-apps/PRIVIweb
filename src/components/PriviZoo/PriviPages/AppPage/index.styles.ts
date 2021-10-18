import { makeStyles } from "@material-ui/core";

export const appPageStyles = makeStyles(theme => ({
  navigationContainer: {
    background: `url(${require("assets/backgrounds/Gradient_BG_Frame.png")})`,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    backgroundSize: "cover",
  },
  contentBox: {
    padding: `0px ${theme.spacing(20)}px`,
    marginTop: theme.spacing(3),
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: `0px ${theme.spacing(10)}px`,
    },
    [theme.breakpoints.down("xs")]: {
      padding: `0px ${theme.spacing(5)}px`,
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: "12px",
  },
  header2: {
    fontSize: "16px",
    color: "#707582",
  },
  title: {
    fontSize: "35px",
    fontWeight: 800,
    background: "radial-gradient(427.58% 951.54% at 39.31% -84.13%, #000000 0%, #DBDDF0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  title2: {
    fontSize: "25px",
    fontWeight: 400,
  },
  musicBox: {
    borderRadius: theme.spacing(2.5),
    boxShadow: "0px 11px 14px rgba(91, 66, 121, 0.11)",
    paddingBottom: 0,
    color: "white",
    width: "100%",
  },
  shadowBox: {
    borderRadius: theme.spacing(1),
    boxShadow: `2px 2px 12px rgba(0, 0, 0, 0.1)`,
    background: "white",
    overflow: "hidden",
    padding: theme.spacing(2),
  },
  navIconBox: {
    borderRadius: theme.spacing(3),
    boxShadow: "0px 10px 21px -9px rgba(89, 81, 143, 0.28)",
    background: "white",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    border: "1px solid #18181844",

    "& div": {
      cursor: "pointer",
    },
  },
  indexDotBox: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    borderRadius: theme.spacing(0.5),
    cursor: "pointer",
    overflow: "hidden",
    opacity: 0.5,
    border: "1px solid #18181822",

    "&.selected": {
      opacity: 1,
    },
  },
  cardsGrid: {
    display: "grid",
    gridColumnGap: "20px",
    gridRowGap: "20px",
    width: "100%",
  },
  starBox: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    background: "#EFF2F8",
  },
  descriptionBox: {
    borderTop: "1px solid #18181822",
    borderBottom: "1px solid #18181822",
    padding: `${theme.spacing(2)}px 0px`,
  },
  snsBox: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    background: "#707582",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",

    "& path": {
      fill: "white",
    },
  },
}));
