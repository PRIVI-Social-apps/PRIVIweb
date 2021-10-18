import { makeStyles } from "@material-ui/core";

export const threadModalStyles = makeStyles(() => ({
  root: {
    width: "892px !important",
  },
  modalContent: {
    padding: 30,
  },
  paper: {
    width: 267,
    marginRight: -267,
    marginLeft: -90,
    borderRadius: 10,
    boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
    position: "inherit",
  },
  threadCard: {},
  threadTitle: {
    "& h3": {
      color: "#181818",
      fontSize: 24,
      fontWeight: 700,
      marginBottom: 20,
      marginTop: 0,
    },
    "& h4": {
      color: "#181818",
      fontSize: 18,
      fontWeight: 400,
      marginBottom: 20,
    },
  },
  userWrapper: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    cursor: "pointer",
    marginTop: 20,
  },
  creatorInfo: {
    display: 'flex'
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "column",
    marginRight: "15px",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.12))',
    border: '3px solid #ffffff',
    backgroundColor: 'white'
  },
  threadInfo: {
    alignItems: "flex-start",
    marginLeft: 16,
  },
  creator: {
    display: "flex",
    flexDirection: "column",
    fontSize: 18,
    fontWeight: 800

  },
  info: {
    display: 'flex',
    alignItems: 'center',
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "18px",
    color: "#181818",
    "& svg": {
      wifth: 14,
      height: 14,
      marginLeft: 3,
      marginRight: 7,
    },
  },
  level: {
    border: "1px solid #949bab",
    borderRadius: 35,
    padding: "2px 6px 0",
    fontSize: 11,
    color: "#949bab",
    width: 52,
  },
  creatorAlias: {
    color: '#db00ff',
    fontFamily: 'Agrandir',
    fontWeight: 400,
    fontSize: 14,
  },
  shareWrapper: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    cursor: "pointer",
  },
  threadContent: {
    cursor: "auto",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
  },
  threadMarginBottom: {
    marginBottom: 20,
  },
  imagesWallPost: {
    display: "flex",
    alignItems: "center",
    overflowX: "auto",
    scrollbarWidth: "none",
    padding: "15px 0",
    justifyContent: "space-between",
  },
  descriptionImageWallPost: {
    minWidth: 200,
    marginRight: 15,
    width: "50%",
    maxWidth: 455,
    height: 200,
  },
  hashtag: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    lineHeight: "120%",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    color: "#707582",
    border: "1.42652px solid #707582",
    boxSizing: "border-box",
    borderRadius: 51.3548,
    padding: "5px 16px",
    marginRight: 10,
  },
  threadTags: {
    marginTop: 20,
    marginBottom: 20,
    display: "flex",
  },
  bottom: {
    paddingBottom: 30,
    display: "flex",
    justifyContent: "space-between",
  },
  commentButtonWrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: 20,
  },
  comment: {
    height: 40,
    padding: "12px 18px",
    background: "#F7F9FE",
    fontSize: 14,
    border: "1px solid #707582",
    boxSizing: "border-box",
    borderRadius: 6,
    width: "100%",
    marginRight: 15,
  },
  responsesWallPost: {
    backgroundColor: "rgb(238, 241, 244)",
    paddingBottom: 10,
    paddingTop: 10,
  },
  responseComponent: {
    display: "flex",
    width: "calc(100%)",
    flexDirection: "column",
  },
  userInfoThread: {
    display: "flex",
    alignItems: "center",
  },
  userImage: {
    borderRadius: "100%",
    position: "relative",
    border: "2px solid #ffffff",
    boxSizing: "content-box",
    boxShadow: "0px 2px 8px rgb(0 0 0 / 20%)",
  },
  message: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 15,
    paddingTop: 16,
    "& p": {
      color: "#707582",
    }
  },
  responseDate: {
    color: "#707582",
    paddingTop: 16
  }
}));
