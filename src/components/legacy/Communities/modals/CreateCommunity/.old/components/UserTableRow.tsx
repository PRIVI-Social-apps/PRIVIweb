import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { TableCell, TableRow } from "@material-ui/core";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import { setSelectedUser } from "store/actions/SelectedUser";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      fontFamily: "Agrandir",
      fontSize: "10px",
      color: "#656E7E",
      border: "none",
      fontWeight: "bold",
    },
    body: {
      fontSize: "14px",
      fontFamily: "Agrandir",
      border: "none",
      color: "#656E7E",
    },
  })
)(TableCell);

export default function UserTableRow(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const [status, setStatus] = useState<any>();

  const validateInfo = () => {
    if (!props.offerObj.token || props.offerObj.token === "") {
      setStatus({
        msg: "Token field invalid. Please select a value.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!props.offerObj.amount || props.offerObj.amount <= 0) {
      setStatus({
        msg: "Amount field invalid. Value should be higher than 0",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      !(
        new Date(props.offerObj.paymentDate).getTime() ||
        new Date(props.offerObj.paymentDate).getTime() === 0 ||
        new Date(props.offerObj.paymentDate).getTime() <= new Date().getTime()
      )
    ) {
      setStatus({
        msg: "Payment date field invalid. Date should be at least a day after today",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  };

  const handleRequest = () => {
    if (validateInfo()) {
      props.addOffer(props.offerObj);
    }
  };

  return (
    <>
      <TableRow key={props.row.id}>
        <StyledTableCell align="center" style={{ display: "flex", justifyContent: "flex-start" }}>
          <div
            className="user-image"
            style={{
              backgroundImage: `url(${props.row.imageUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
              marginBottom: "10px",
            }}
            onClick={() => {
              history.push(`/profile/${props.row.id}`);
              dispatch(setSelectedUser(props.row.id));
            }}
          />
          <span
            style={{
              cursor: "pointer",
              color: "black",
              marginTop: "5px",
              marginLeft: "8px",
              width: "100px",
            }}
            onClick={() => {
              history.push(`/profile/${props.row.id}`);
              dispatch(setSelectedUser(props.row.id));
            }}
          >
            {props.row.firstName}
          </span>
        </StyledTableCell>
        <StyledTableCell align="center">{props.row.assistances ?? 0}</StyledTableCell>
        <StyledTableCell align="center">{`${props.row.rate ?? 0}%`}</StyledTableCell>
        <StyledTableCell align="center">{props.row.level ?? 1}</StyledTableCell>
        <StyledTableCell align="right" style={{ padding: 0 }}>
          {props.offerIndex == -1 ? (
            <button
              onClick={handleRequest}
              style={{
                margin: 0,
                background: "linear-gradient(97.4deg, #29E8DC 14.43%, #03EAA5 79.45%)",
              }}
              disabled={props.disabled}
            >
              Request support
            </button>
          ) : (
            <button disabled>Saved Offer</button>
          )}
        </StyledTableCell>
      </TableRow>

      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus(undefined)}
        />
      )}
    </>
  );
}
