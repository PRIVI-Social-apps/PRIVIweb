import { makeStyles } from "@material-ui/core";
import { Color, Gradient } from "shared/ui-kit";

export const sendTokensStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "30px 52px 60px",
    height: `calc(100vh - 104px)`,
    overflowY: "auto",
    "& > div:nth-child(2)": {
      maxWidth: "750px",
      alignSelf: "center",
    },
    [theme.breakpoints.down("md")]: {
      padding: "45px 24px 100px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "45px 17px 67px",
    },
  },
  types: {
    alignSelf: "center",
    width: "fit-content",
    background: "rgba(255, 255, 255, 0.4)",
    borderRadius: "20px",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& div:first-child img": {
      transform: "rotate(34.36deg)",
      width: "32.18px",
      height: "32.18px",
      marginRight: "10.31px",
    },
    "& div:last-child img": {
      transform: "rotate(-10.22deg)",
      width: "25.65px",
      height: "34.5px",
      marginRight: "10.69px",
    },
  },
  type: {
    cursor: "pointer",
    padding: "14px 30px 14px 20px",
    display: "flex",
    alignItems: "center",
    borderRadius: "16px",
    background: "transparent",
    "& *": {
      color: Color.MusicDAOLightBlue,
    },
    "& img": {
      filter: "grayscale(100%)",
    },
  },
  typeSelected: {
    background: "#FFFFFF",
    "& img": {
      filter: "none",
    },
    "& div div:first-child": {
      color: Color.MusicDAODark,
    },
  },
  header1: {
    fontSize: "14px",
    fontWeight: 800,
    lineHeight: "120%",
    fontFamily: "Agrandir GrandLight",
    color: Color.MusicDAODark,
    marginBottom: "4px",
  },
  header2: {
    fontWeight: 500,
    fontFamily: "Montserrat",
    color: Color.MusicDAOLightBlue,
    fontSize: "12px",
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: Color.Black,
    lineHeight: "104.5%",
    marginBottom: "12px",
    fontFamily: "Agrandir GrandLight",
  },
  typesBox: {
    background: "#F0F5F8",
    width: "fit-content",
    borderRadius: "68px",
    padding: "3.5px",
    marginBottom: "40px",
  },
  typeBox: {
    padding: "16px 24px",
    color: "#707582",
    borderRadius: "77px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "Montserrat",
    "&:first-child": {
      textTransform: "capitalize",
    },
    "&:last-child": {
      textTransform: "capitalize",
    },
  },
  selectedTypeBox: {
    background: Color.Black,
    color: Color.White,
  },

  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  flexBox: {
    display: "flex",
  },
  borderBox: {
    border: "2px solid #E0E4F3",
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(2),
    background: "white",
  },
  selected: {
    border: "2px solid #23D0C6",
  },
  gridientTextBox: {
    background: Gradient.Mint,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "12px",
  },
  shadowBox: {
    boxShadow: `0px 6px 36px -11px rgba(0, 0, 0, 0.02)`,
    background: "white",
    borderRadius: "12px",
    padding: "40px 38px 80px",

    "& .MuiInputBase-root": {
      height: "45px",
      maxHeight: "45px",
      minHeight: "45px",
      fontFamily: "Montserrat",
      background: "#F6F9FE",
      border: "1px solid #DADADB",
      borderRadius: "8px",
      "& *": {
        fontSize: "14px",
        border: "none",
      },
    },
    "& .MuiGrid-container .MuiGrid-item:first-child": {
      "& .MuiInputBase-root": {
        background: "#FFFFFF",
        border: "1px solid #E0DFF0",
      },
    },
    "& .MuiGrid-container .MuiGrid-item:nth-child(2)": {
      "& .MuiInputBase-root": {
        background: "#FFFFFF",
        border: "1px solid #E0DFF0",
      },
    },
  },
  autocomplete: {
    width: "100%",
    border: "1px solid rgb(224, 228, 243)",
    borderRadius: 6,
    padding: "7px 15px",
    backgroundColor: "#eff2f8",
  },
}));
