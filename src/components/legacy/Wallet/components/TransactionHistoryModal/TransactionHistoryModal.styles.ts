import { withStyles, Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";

export const transactionHistoryModalStyles = makeStyles(() => ({
  modalContent: {
    padding: "10px 20px",
  },
  title: {
    marginBottom: 10,
    "& h3": {
      fontSize: 30,
      fontWeight: 400,
      margin: 10,
      color: "#181818",
    },
  },
  table: {
    width: "100%",
    display: "flex",
    overflowY: "auto",
    scrollbarWidth: "none",
    maxHeight: 625,
    "& .MuiTable-root": {
      width: "100%",
    },
    "& .MuiTableBody-root .MuiTableRow-root": {
      height: 58,
    },
    "& a": {
      color: "#45cfea",
    },
  },
  cellType: {
    color: "#23d0c6",
    border: "2px solid #23d0c6",
    borderRadius: 50,
    padding: "10px 15px",
    marginLeft: -10,
  },
  externalLink: {
    verticalAlign: "middle",
  },
  centeredInfo: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      fontFamily: "Agrandir",
      fontSize: "14px",
      lineHeight: "5px",
      backgroundColor: "#F7F9FE",
      border: "none",
      color: "black",
    },
    body: {
      fontSize: "14px",
      fontFamily: "Agrandir",
      border: "none",
      color: "#949BAB",
      backgroundColor: "transparent",
      verticalAlign: "bottom",
    },
    sizeSmall: {
      padding: 10,
    },
    externalLink: {
      verticalAlign: "middle",
    },
  })
)(TableCell);
