import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const BTCPageStyles = makeStyles(theme => ({
  content: {
    padding: "68px 48px 100px",
    overflowY: "auto",
    width: "100%",
    height: "calc(100vh - 104px)",
    [theme.breakpoints.down("md")]: {
      padding: "45px 24px 100px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "45px 17px 67px",
    },
  },

  header: {
    marginBottom: "24px",
    fontFamily: "Agrandir GrandLight",
    fontWeight: 800,
    fontSize: "22px",
    lineHeight: "28.6px",
    color: Color.MusicDAODark,
  },
}));
