import { makeStyles } from "@material-ui/core";

export const proposalDetailPageStyles = makeStyles(theme => ({
  content: {
    backgroundColor: "#26254B",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "60px 168px 150px 168px",
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
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
  proposalDetailBox: {
    background: "#31305c",
    boxShadow: "0px 30px 35px -12px rgba(29, 103, 84, 0.03)",
    borderRadius: 4,
  },
  detailHeaderBox: {
    borderRadius: 4,
    padding: theme.spacing(5),
    background: "#282754",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    alignItem: "center",
  },
  headerTitleContent: {
    fontSize: 22,
    fontWeight: 600,
    color: '#E0DFF0'
  },
  header1: {
    fontSize: 31,
    fontWeight: 600,
    color: "#ffffff",
  },
  header2: {
    fontSize: 16,
    fontWeight: 500,
    color: "#ffffff",
  },
  header3: {
    fontSize: 14,
    fontWeight: 500,
    color: "#ffffff",
  },
  blackBox: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    background: "rgba(38, 37, 75, 0.7)",
    border: "1px solid rgba(78, 76, 132, 0.8)",
    borderRadius: theme.spacing(1),
  },
  greyBox: {
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    background: "#7573AB",
    borderRadius: theme.spacing(1),
  },
}));
