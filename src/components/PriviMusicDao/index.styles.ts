import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const priviMusicDaoPageStyles = makeStyles(theme => ({
  priviMusicDao: {
    height: "100vh",
    width: "100%",
  },
  mainContainer: {
    display: "flex",
    width: "100%",
    height: "calc(100% - 104px)",
  },
  content: {
    display: "flex",
    width: "100%",
    height: "100%",
    overflow: "auto",
    flexDirection: "column",
    background: "linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8",
    "& ::-webkit-scrollbar": {
      width: 10,
    },
    "& ::-webkit-scrollbar-thumb": {
      width: 20,
      background: "rgba(238, 241, 244, 1)",
    },
  },
  card: {
    background: Color.White,
    boxShadow: "0px 25px 36px -11px rgba(0, 0, 0, 0.02)",
    borderRadius: 20,
  },
  primaryButton: {
    backgroundColor: `${Color.MusicDAODark} !important`,
    borderRadius: 15,
  },
  secondaryButton: {
    color: `${Color.MusicDAODark} !important`,
    backgroundColor: `transparent !important`,
    border: `1px solid ${Color.MusicDAODark} !important`,
  },
  showAll: {
    width: "170px !important",
    border: `1px solid ${Color.MusicDAODark} !important`,
    backgroundColor: "transparent !important",
    fontSize: "14px !important",
    color: `${Color.MusicDAODark} !important`,
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      width: "120px !important",
    },
  },
  backButton: {
    cursor: "pointer",
  },
  select: {
    "& .MuiSelect-root": {
      paddingRight: 12,
    },
  },
  showButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none !important",
    backgroundColor: "transparent !important",
  },
  showButtonSelected: {
    backgroundColor: "white !important",
  },
  headerTitle: {
    fontSize: 58,
    fontWeight: 400,
    marginBlock: 0,
    marginBottom: 26,
    color: Color.White,
    "& span": {
      fontWeight: 800,
    },
  },
  headerSubTitle: {
    fontSize: 26,
    fontWeight: 400,
    marginBlock: 0,
    marginBottom: 26,
    lineHeight: "39px",
    color: Color.White,
    textAlign: "center",
    "& span": {
      fontWeight: 800,
    },
  },
  outlineSelect: {
    background: Color.White,
    border: "1px solid rgba(64, 70, 88, 0.1)",
    borderRadius: 44,
    paddingLeft: 20,
    paddingRight: 20,
    height: 40,
  },
  groupButton: {
    background: "transparent",
    border: "none",
    borderRadius: 60,
    fontSize: 14,
    color: Color.GrayDark,
    padding: "8px 16px",
    "& + &": {
      marginLeft: 4,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  selectedGroupButton: {
    background: Color.MusicDAODark,
    color: Color.White,
  },
  sidebarFooter: {
    background: "linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)",
    boxShadow: "0px -2px 2px rgba(101, 203, 99, 0.8)",
    height: 150,
    paddingLeft: 24,
    paddingRight: 24,
  },
  bodyFooter: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));
