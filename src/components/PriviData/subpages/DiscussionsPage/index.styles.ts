import { makeStyles } from "@material-ui/core";
import { Gradient } from "shared/ui-kit";

export const discussionsPageStyles = makeStyles(theme => ({
  content: {
    background: "#222145",
    height: `calc(100vh - 104px)`,
    paddingBottom: "80px",
  },
  subContent: {
    width: "100%",
    overflowY: "auto",
    scrollbarWidth: "none",
    padding: "60px 168px 150px 168px",
    height: "calc(100vh - 80px)",
    paddingBottom: "80px",
  },
  gradient: {
    position: "absolute",
    width: 363,
    height: 485,
    left: 521,
    top: -240,
    transform: "rotate(44deg)",
    filter: "blur(120px)",
    background:
      "linear-gradient(156.41deg, #FA18FF 11.7%, rgba(255, 255, 255, 0) 57.03%), radial-gradient(108.54% 138.74% at 86.8% 29.83%, rgba(238, 238, 238, 0) 0%, rgba(167, 54, 255, 0.096) 26.8%, rgba(14, 0, 255, 0.212) 73.32%, rgba(112, 0, 255, 0.384) 100%)",
  },
  title: {
    fontSize: "44px",
    fontWeight: 800,
    lineHeight: "120%",
    background: Gradient.Magenta,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  header1: {
    fontSize: "22px",
    fontWeight: 800,
    color: "white",
  },
  header2: {
    fontSize: "14px",
    fontWeight: 600,
    color: "white",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  selectedButtonBox: {
    background: "linear-gradient(0deg, #BA50FC, #BA50FC), #7977D1",
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: "pointer",
  },
  buttonBox: {
    background: "rgba(85, 84, 125, 0.42)",
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    "& > *": {
      marginTop: theme.spacing(2),
    },
    "& > nav > ul > li > button": {
      color: "#ffffff",
      fontSize: 14,
      fontWeight: 600,
      "&.MuiPaginationItem-page.Mui-selected": {
        opacity: 0.38,
      },
    },
    "& > nav > ul > li > div": {
      color: "#ffffff !important",
      fontSize: 14,
      fontWeight: 600,
    },
  },
}));
