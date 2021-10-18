import React from "react";
import { createStyles, TableCell, TableHead, TableRow, withStyles } from "@material-ui/core";


export default function SongsRowHeader() {
  return (
    <TableHead>
      <StyledTableRow>
        <StyledTableCell align="left">TITLE</StyledTableCell>
        <StyledTableCell align="center">PRICE</StyledTableCell>
        <StyledTableCell align="center">VIEWS</StyledTableCell>
        <StyledTableCell align="center">DURATION</StyledTableCell>
        <StyledTableCell></StyledTableCell>
      </StyledTableRow>
    </TableHead>
  );
}

const StyledTableCell = withStyles(() =>
  createStyles({
    head: {
      fontFamily: "Agrandir",
      fontSize: "14px",
      color: "#181818",
      fontWeight: 800,
      borderBottom: "1px solid #EFF2F",
      padding: 16,
    },
  })
)(TableCell);

const StyledTableRow = withStyles(() =>
  createStyles({
    head: {
      background: "transparent",
    },
  })
)(TableRow);
