import { makeStyles } from "@material-ui/core";

export const claimMusicPodStyles = makeStyles(theme => ({
  container: {
    padding: 0,
    background: "#EAE8FA",
    height: "100%",
    width: "calc(100% - 209px)",
    overflow: "auto",
  },
  containerFull: {
    width: "100%",
  },
  subContainer: {
    width: "100%",
  },
  fractionBox: {
    color: "white",
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    fontSize: "12px",
    background: "#7F6FFF",
  },
  title: {
    fontSize: 48,
    fontWeight: 800,
    color: "#081831",
  },
  description: {
    fontSize: 14,
    color: "#081831",
    opacity: 0.7,
  },
  follow: {
    fontSize: 14,
    fontWeight: 800,
    color: "#081831",
    paddingTop: 3,
    paddingLeft: 4,
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  fundsWrapper: {},
  header1: {
    fontSize: "14px",
    color: "#707582",
  },
  header2: {
    fontSize: "24px",
    color: "#181818",
    marginTop: 10,
  },
  shareIcon: {
    width: 18,
    height: 18,
    cursor: "pointer",
  },
  creatorGroup: {
    position: "relative",
    width: 78,
    height: 32,

    "& img": {
      marginLeft: -10,
    },
    "& img:first-child": {
      marginLeft: 0,
    },
  },
  creator: {
    position: "absolute",
  },
  podFund: {
    background: "#7F6FFF",
    borderRadius: 8,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    rowGap: 4,
    color: "#ffffff",
  },
  podPrice: {
    display: "flex",
    flexDirection: "column",
    rowGap: 4,
    color: "#000000",
  },
  podDescription: {
    display: "flex",
    alignItems: "center",
    rowGap: 8,
    color: "#707582",
    fontSize: 12,
    marginTop: 10,

    "& svg": {
      width: 18,
      height: 18,
    },
    "& span": {
      marginLeft: 10,
    },
  },
  chartWrapper: {
    padding: 40,
  },
  statsLine: {
    width: "calc(100% + 64px)",
    height: 162,
    marginLeft: -32,
    background: "#FBFAFE",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 40,
  },
  userList: {
    width: "100%",
    padding: "64px 32px",
  },
  userCard: {
    marginRight: 24,
    "&:last-child": {
      marginRight: 0,
    },
  },
  inviteButton: {
    cursor: "pointer",
    border: "1.5px solid #707582",
    boxSizing: "border-box",
    backdropFilter: "blur(10px)",
    borderRadius: 6,
    color: "#151414",
    fontSize: 16,
    fontWeight: 800,
    padding: "10px 20px",
    background: "transparent",
  },
  inviteInfoIcon: {
    width: 24,
    height: 24,
    marginLeft: 21,
    marginRight: 6,
  },
  inviteInfo: {
    fontSize: 14,
    color: "#707582",
  },
  tabBar: {
    background: "#FFFFFF80",
    width: "calc(100% + 64px)",
    height: 46,
    marginLeft: -32,
    paddingLeft: 60,
  },
  root: {
    display: "flex",
  },
  paper: {
    width: 267,
    marginRight: -267,
    marginLeft: -90,
    borderRadius: 10,
    boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
    position: "inherit",
  },
  socialButtons: {
    display: "flex",
    alignItems: "center",
    background: "#181818",
    border: "2px solid #ffffff",
    borderRadius: "18px",
    padding: "4px 9px 0px 9px",
    transform: "translate(0, 50%)",
    columnGap: "4px",
    position: "absolute",
    bottom: 0,
    right: "16px",
  },
  clickable: {
    cursor: "pointer",
  },
  svgBox: {
    width: theme.spacing(2),
    "& svg": {
      width: "100%",
      height: "100%",
    },
    "& path": {
      stroke: "black",
    },
  },
}));
