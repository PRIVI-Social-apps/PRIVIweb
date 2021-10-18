import { makeStyles } from "@material-ui/core";

export const priviZooPageStyles = makeStyles(theme => ({
  container: {
    height: `calc(100vh)`,
  },
  subContainer: {
    width: "100%",
    overflowY: "auto",
    scrollbarWidth: "none",
    height: "calc(100vh)",
  },
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
    "& .rec-carousel-item": {
      height: "100%",

      "& .rec-item-wrapper": {
        height: "100%",
      }
    }
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: "12px",
  },
  title: {
    fontSize: "35px",
    fontWeight: 800,
    background: "radial-gradient(427.58% 951.54% at 39.31% -84.13%, #000000 0%, #DBDDF0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  priviTitle: {
    fontSize: "35px",
    fontWeight: 800,
    background: "linear-gradient(106.63deg, #9067FF 38.5%, #4319B6 160.38%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  zooTitle: {
    fontSize: "35px",
    fontWeight: 800,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background:
      "radial-gradient(22.09% 70.3% at 21.73% 0%, #C930FF 0%, rgba(197, 33, 255, 0) 100%), linear-gradient(93.82deg, #9067FF 12.26%, #0500FF 38.25%)",
  },
  musicBox: {
    background: "linear-gradient(97.4deg, #8F66FF 14.43%, #4218B5 79.45%)",
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2.5),
    boxShadow: "0px 11px 14px rgba(91, 66, 121, 0.11)",
    paddingBottom: 0,
    color: "white",
    width: "100%",
    height: "100%",
  },
  shadowBox: {
    borderRadius: theme.spacing(1),
    boxShadow: `2px 2px 12px rgba(0, 0, 0, 0.1)`,
    background: "white",
    overflow: "hidden",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",

    "& img": {
      width: theme.spacing(15),
    },
  },
  cardTitle: {
    background: "linear-gradient(237.02deg, #906CF1 30.32%, #E27E96 107.17%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "25px",
    fontWeight: 800,
  },
  cardTitle2: {
    color: "#673FDB",
    fontSize: "25px",
    fontWeight: 800,
  },
  title2: {
    fontSize: "25px",
    fontWeight: 400,
  },
  navIconBox: {
    borderRadius: theme.spacing(3),
    boxShadow: "0px 10px 21px -9px rgba(89, 81, 143, 0.28)",
    background: "white",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,

    "& div": {
      cursor: "pointer",
    },
  },
  indexDotBox: {
    width: theme.spacing(1.5),
    height: theme.spacing(1.5),
    background: "none",
    border: "1px solid #4218B5",
    borderRadius: "50%",
    cursor: "pointer",

    "&.selected": {
      background: "#4218B5",
    },
  },
  cardsGrid: {
    display: "grid",
    gridColumnGap: "20px",
    gridRowGap: "20px",
    width: "100%",
  },
  priviBox: {
    borderRadius: theme.spacing(1),
    boxShadow: `2px 2px 12px rgba(0, 0, 0, 0.1)`,
    background: "white",
    padding: theme.spacing(2),

    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: `0px ${theme.spacing(10)}px`,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      margin: `0px ${theme.spacing(5)}px`,
    },
  },
  carouselBox: {
    width: "700px",
    height: "400px",

    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: `0px ${theme.spacing(10)}px`,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      margin: `0px ${theme.spacing(5)}px`,
    },
  },
}));
