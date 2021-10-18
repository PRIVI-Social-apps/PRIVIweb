import React, { useEffect } from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseCircleSolid } from "assets/icons/times-circle-solid.svg";

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      fontFamily: "Agrandir",
      fontSize: "10px",
      color: "#656E7E",
      border: "none",
      fontWeight: "bold",
      backgroundColor: "#e3e9ef",
    },
    body: {
      fontSize: "14px",
      fontFamily: "Agrandir",
      border: "none",
      color: "#656E7E",
      backgroundColor: "#e3e9ef",
    },
  })
)(TableCell);

export default function OfferTableRow(props) {
  const chatIcon = require("assets/icons/message_darkblue.png");

  return (
    <TableRow key={props.row.id}>
      <StyledTableCell align="left" style={{ width: "30px" }}>
        <div
          className="user-image"
          style={{
            backgroundImage: props.user ? `url(${props.user.imageUrl})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
          }}
        />
      </StyledTableCell>
      <StyledTableCell align="left">
        <span
          style={{
            cursor: "pointer",
          }}
        >
          {props.user ? props.user.firstName : ""}
        </span>
      </StyledTableCell>
      <StyledTableCell align="left">{props.row.status}</StyledTableCell>
      <StyledTableCell align="left">{props.row.token}</StyledTableCell>
      <StyledTableCell align="left">{props.row.amount}</StyledTableCell>
      <StyledTableCell align="left">
        {`${new Date(props.row.paymentDate).getDate() < 10
          ? `0${new Date(props.row.paymentDate).getDate()}`
          : new Date(props.row.paymentDate).getDate()
          }/${new Date(props.row.paymentDate).getMonth() + 1 < 10
            ? `0${new Date(props.row.paymentDate).getMonth() + 1}`
            : new Date(props.row.paymentDate).getMonth() + 1
          }/${new Date(props.row.paymentDate).getFullYear()}`}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.row.status !== "accepted" ? (
          <div style={{ cursor: "pointer" }} onClick={() => props.removeOffer()}>
            <SvgIcon><CloseCircleSolid /></SvgIcon>
          </div>
        ) : null}
      </StyledTableCell>
    </TableRow>
  );
}
