import { makeStyles } from "@material-ui/core";

export const historyCardStyles = makeStyles(theme => ({
  card: {
    backgroundColor: (isActiveCard) => isActiveCard ? "#ffffff" : "#F4F8FC",
    borderRadius: theme.spacing(2.5),
    padding: `${theme.spacing(6)}px 0`,
    border: "1px solid #D6DAE3",
    boxShadow: "0px 15px 16px -11px rgba(0, 0, 0, 0.02)",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #00000022",
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
  },
  header1: {
    fontSize: "20px",
    fontWeight: 600,
  },
  header2: {
    fontSize: "14px",
    fontWeight: 600,
  },
}));
