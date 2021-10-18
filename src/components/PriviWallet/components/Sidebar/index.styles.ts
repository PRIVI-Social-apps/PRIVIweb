import { createStyles, makeStyles } from "@material-ui/core";

export const priviWalletSidebarStyles = makeStyles(theme =>
  createStyles({
    content: {
      background: "#FAFBFB",
      height: "100%",
      justifyContent: "space-between",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      paddingTop: "60px",
      "& ul": {
        padding: "0px",
        marginBottom: "40px",
        marginTop: "10px",
      },
    },
    options: {
      paddingLeft: "25px",
      paddingRight: "22px",
    },
    link: {
      cursor: "pointer",
      fontSize: "13px",
      lineHeight: "190%",
      padding: "4px 8px",
      display: "flex",
      alignItems: "center",
      color: "#54658F",
      textDecoration: "none",
      width: "fit-content",
      marginBottom: "17px",
      "& svg": {
        marginRight: "10px",
        width: "12.47",
      },
      "&:nth-child(5)": {
        borderBottom: "1px solid #0000000d",
        paddingBottom: "22px",
        marginBottom: "22px",
        width: "100%",
      },
    },
    linkSelected: {
      background: "rgba(66, 24, 181, 0.05)",
      borderRadius: "8px",
      color: "#4218B5",
    },
  })
);
