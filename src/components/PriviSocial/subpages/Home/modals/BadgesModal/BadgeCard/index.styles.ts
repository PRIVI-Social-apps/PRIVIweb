import { makeStyles } from "@material-ui/core";

export const badgeCardStyles = makeStyles(theme => ({
  badgeCard: {
    display: "flex",
    background: "#ffffff",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: 24,
    padding: "24px 0px 16px 0px",
    width: "calc(50% - 12px)",
    justifyContent: "space-between",
    flexDirection: "column",
    marginBottom: 24,
    marginRight: 24,
    marginTop: 30,
    height: "fit-content",
    cursor: "pointer",
    position: "relative",
    color: "#707582",
    fontSize: 14,

    "&:nth-child(2n)": {
      marginRight: 0,
    },

    "& .hex.normal": {
      height: "calc(100% - 6px)",
      margin: "3px",
    },
  },
  badgeImage: {
    alignSelf: "flex-end",
    position: "absolute",
    top: "-30px",
    right: "24px",
    width: "56px",
  },
  cardHeader: {
    padding: "0px 24px",
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    display: "flex",
    alignItems: "center",
    marginBottom: 8,
    "& span": {
      fontWeight: 800,
      fontSize: 14,
      lineHeight: "104.5%",
      marginRight: 6,
    },
  },
  cardTitleIsLocked: {
    cursor: "pointer",
    position: "relative",
    right: 0,
    bottom: 0,
    "& svg": {
      height: 12,
      width: 9.33,
    },
  },
  cardStats: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    margin: "0px 0px 12px",
  },
  fruitsContainer: {
    width: 24.5,
    height: 24.5,
    borderRadius: "50%",
    marginRight: "4.5px",
    border: "1px solid #707582",
    padding: 0,
    filter: "drop-shadow(0px 1.23767px 4.95068px rgba(0, 0, 0, 0.12))",
    "& *": {
      width: 24,
      height: 24,
      margin: 0,
      padding: 0,
    },
  },
  cardStatsActions: {
    display: "flex",
    alignItems: "center",
    marginLeft: 12,
    "& span": {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      "& img": {
        width: 12,
      },
    },
    "& span:first-child img": {
      marginRight: 10,
    },
  },
  badge: {
    fontSize: 11,
    lineHeight: "104.5%",
    textAlign: "center",
    border: "1px solid #707582",
    boxSizing: "border-box",
    borderRadius: 36,
    padding: "7px 12px 6px",
  },
  info: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid hsla(0, 0%, 0%, 0.05)",
    borderBottom: "1px solid hsla(0, 0%, 0%, 0.05)",
    padding: "16px 24px 8px 24px",
  },
  infoCreator: {
    display: "flex",
    alignItems: "center",
  },
  infoCreatorName: {
    fontWeight: 400,
    lineHeight: "120%",
    margin: 0,
    marginLeft: "8px",
  },
  totalSupply: {
    fontWeight: 400,
    lineHeight: "120%",
    textAlign: "right",
    "& span": {
      marginLeft: 5,
    },
  },
  infoBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px 0px",
    "& div": {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "120%",
      "& span": {
        margin: "0px 5px",
      },
    },
  },
}));
