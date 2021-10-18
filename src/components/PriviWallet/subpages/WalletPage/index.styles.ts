import { makeStyles, Theme, createStyles } from "@material-ui/core";

export const walletPageStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    paper: {
      width: 320,
      marginTop: 80,
      marginLeft: -300,
      borderRadius: 10,
      boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
      position: "inherit",
    },
    menuList: {
      maxHeight: 200,
      overflowY: "auto",
    },
    container: {
      padding: theme.spacing(5),
      height: `calc(100vh - 80px)`,
      paddingBottom: "40px",
    },
    subContainer: {
      width: "100%",
      overflowY: "auto",
      scrollbarWidth: "none",
      height: "calc(100vh - 80px)",
      paddingBottom: "80px",
    },
    walletName: {
      fontSize: 32,
      fontWeight: 800,
      color: '#181818'
    },
    title: {
      fontSize: 32,
      fontWeight: 400,
      color: '#181818'
    },
    flexBox: {
      display: "flex",
      alignItems: "center",
    },
    backPage: {
      display: "flex",
      alignItems: "center",
      color: "#23D0C6",
      cursor: "pointer",
      fontWeight: 400,
      fontSize: 14,
      marginBottom: 16
    },
    shadowBox: {
      padding: '13px 30px',
      borderRadius: 10,
      boxShadow: `0px 2px 14px rgba(0, 0, 0, 0.08)`,
      background: "#ffffff",
    },
    walletShadowBox: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(2),
      borderRadius: 10,
      boxShadow: `0px 2px 14px rgba(0, 0, 0, 0.08)`,
      background: "white",
      height: 103,
      minWidth: 400
    },
    icon: {
      background: "#ffffff",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
      borderRadius: "50%",
      width: "65px",
      height: "65px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    walletTopBox: {
      background: "linear-gradient(180deg, #F0CFDA 0%, #EFCED9 100%)",
      padding: theme.spacing(2),
      marginLeft: -theme.spacing(1),
      height: "110px",
      borderRadius: 6,
      position: 'relative'
    },
    inputBox: {
      border: "none",
    },
    topHeaderLabel: {
      background: `linear-gradient(270.47deg, #D66DB2 -3.25%, #BB34D1 93.45%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: 18,
      fontWeight: 400,
      lineHeight: '120%'
    },
    header1: {
      fontSize: "14px",
    },
    header2: {
      fontSize: "12px",
      fontWeight: 700,
      color: '#707582'
    },
    flexBoxHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
    cardsGrid: {
      display: "grid",
      gridColumnGap: "20px",
      gridRowGap: "20px",
      width: "100%",
    },
    balance: {
      marginTop: theme.spacing(0.5),
      fontSize: "18px",
      fontWeight: 400,
      color: "#707582",
    },
    addressBox: {
      maxWidth: theme.spacing(30),
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontSize: 18,
      fontWeight: 400,
      color: '#707582'
    },
    slideLeft: {
      transform: "rotate(180deg)",
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    optionButton: {
      borderRadius: theme.spacing(2),
      border: "1px solid black",
      background: "transparent",
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      color: "black",
      padding: '0px 20px'
    },
    selected: {
      background: "black",
      color: "white",
    },
    slideRight: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    graphBox: {
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(2.5),
      border: `2px solid #18181822`,
      borderRadius: theme.spacing(2),
      height: "300px",
      margin: theme.spacing(1),
      position: "relative",
      background: "white",
    },
    graphHeader: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0px 16px",
    },
    select: {
      "& > div": {
        paddingBottom: "11px",
        minWidth: "120px",
      },
    },
    closeIcon: {
      width: 8,
      height: 8,
    },
    closeButton: {
      width: 8,
      height: 8,
      position: 'absolute',
      top: 8,
      right: 10,
      cursor: 'pointer'
    },
    startNowSection: {
      marginRight: 10,
      padding: 15
    },
  })
);
