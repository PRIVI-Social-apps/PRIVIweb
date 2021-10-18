import { makeStyles } from "@material-ui/core";

export const podCardStyles = makeStyles(theme => ({
  podCard: {
    background: "#ffffff",
    borderRadius: theme.spacing(2),
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },

  podImageContent: {
    height: "264px",
    borderTopLeftRadius: theme.spacing(2),
    borderTopRightRadius: theme.spacing(2),
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
  },

  podImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: theme.spacing(2),
    borderTopRightRadius: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  playButtonBox: {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    borderRadius: "18px",
    background: "#7f6fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: "100%",
    border: "2px solid #ffffff",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    position: "absolute",
    bottom: 0,
    left: theme.spacing(2),
    transform: "translate(0, 50%)",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  topRightBox: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
  },

  podStatus: {
    background: "linear-gradient(97.4deg, #ff79d1 14.43%, #db00ff 79.45%)",
    borderRadius: theme.spacing(3),
    padding: "8px 18px",
    fontWeight: "bold",
    fontSize: "14px",
    color: "white",
    textTransform: "capitalize",
  },

  userGroup: {
    borderRadius: "50%",
    width: theme.spacing(4),
    height: theme.spacing(4),
  },

  podInfo: {
    marginTop: "264px",
    padding: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
    flexGrow: 1,
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "column",
  },

  podInfoName: {
    fontWeight: 800,
    fontSize: "18px",
    color: "black",
    marginTop: "5px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",

    "&:hover": {
      cursor: "pointer",
    },
  },

  podMainInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: `0 ${theme.spacing(2)}px`,
    marginTop: theme.spacing(2.5),

    "& span": {
      fontSize: "14px",
      color: "#707582",
    },

    "& p": {
      fontSize: "18px",
      fontWeight: 800,
      color: "#231d25",
      margin: 0,
    },
  },

  podMainInfoContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    "& div": {
      display: "flex",
      flexDirection: "column",
    },
  },

  divider: {
    width: "100%",
    height: "1px",
    background: "#000",
    opacity: 0.05,
    margin: "16px 0",
    "&.secondary": {
      margin: 0,
      marginTop: 16,
    }
  },

  claimPodContent: {
    width: "100%",
  },

  claimButton: {
    background: "#181818",
    padding: "10px 0",
    borderRadius: 10,
    cursor: "pointer",
    textAlign: "center",

    "& span": {
      letterSpacing: "-0.02em",
      textTransform: "capitalize",
      fontWeight: 800,
      fontSize: theme.spacing(2),
      lineHeight: "21px",
      color: " #ffffff",
    },
  },

  fundInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },

  fundValue: {
    display: "flex",
    flexDirection: "column",
    rowGap: "5px",

    "& span": {
      fontSize: "12px",
      lineHeight: `${theme.spacing(2)}px`,
      color: "#7f6fff",
    },

    "& p": {
      fontWeight: 800,
      fontSize: "12px",
      lineHeight: `${theme.spacing(2)}px`,
      color: "#7f6fff",
    },
    "&.secondary": {
      "& span": {
        color: '#2D3047'
      },
      "& p": {
        fontSize: 16,
        color: '#65CB63'
      }
    }
  },

  fundType: {
    border: "1px solid #707582",
    borderRadius: "14px",
    height: "22px",
    padding: "6px 8px",
    display: "flex",
    alignItems: "center",

    "& p": {
      marginLeft: "6px",
      color: "#181818",
      fontSize: "10px",
      lineHeight: "11px",
    },
  },
  fundTypeSecondary: {
    display: 'flex',
    alignItems: 'center',
    background: '#DAE6E5',
    borderRadius: 14,
    padding: '6px 8px',
    height: 29,
    "& p": {
      marginLeft: "6px",
      color: "#181818",
      fontSize: "10px",
      lineHeight: "10px",
    },
    "& svg": {
      width: 17,
      height: 17
    }
  },
  fundMark: {
    width: theme.spacing(1),
    height: theme.spacing(1),
    background: "#181818",
    borderRadius: "1px",
  },

  flexBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: theme.spacing(2),
  },

  fractionBox: {
    color: "white",
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    fontSize: "12px",
    background: "#7F6FFF",
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
}));
