import React, { useState, useEffect } from "react";
import Moment from "react-moment";

import { withStyles, Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  Grid,
  Button,
  Modal,
  Fade,
  Backdrop,
} from "@material-ui/core";

import Box from 'shared/ui-kit/Box';
import { CircularLoadingIndicator } from "shared/ui-kit";

const txnTypeMap = {
  PRIVI_credit_creation: "Creation",
  PRIVI_credit_deposit: "Lent",
  PRIVI_credit_borrowing: "Borrowed",
  PRIVI_credit_collateral: "Collateral",
  PRIVI_credit_interest: "Interest",
  PRIVI_credit_withdraw: "Withdraw",
  PRIVI_credit_modified: "Modified",
  PRIVI_risk_taking: "Assume Risk",

  NFT_Pod_Selling: "Sell",
  NFT_Pod_Buying: "Buy",

  POD_Minting: "Mint",
  POD_Buying: "Buy",
};

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      fontFamily: "Agrandir",
      fontSize: "14px",
      color: "white",
      border: "none",
      fontWeight: "bold",
    },
    body: {
      fontSize: "14px",
      fontFamily: "Agrandir",
      borderBottom: "1px solid #18181822",
      background: "white",
      color: "#656E7E",
    },
  })
)(TableCell);

const useStyles = makeStyles({
  date: {
    color: "rgba(101, 110, 126, 0.7)",
  },
  externalLink: {
    verticalAlign: "middle",
  },
  topHeaderLabel: {
    background: `linear-gradient(97.4deg, #23D0C6 14.43%, #00CC8F 85.96%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  container: {
    borderRadius: "8px",
    overflow: "hidden",
  },
});

export const shortenHash = (str: string)  => {
  if (str) {
      const part1 = str.slice(0, 6);
      const part2 = str.slice(str.length - 4);
      return `${part1}...${part2}`;
  }
}

const convertDate = (value) => {
  const date = new Date(value * 1000);
  const minutes = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const seconds = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; //months from 1-12
  const year = date.getUTCFullYear();
  return `${minutes}:${seconds} - ${day}/${month}/${year}`;
}

export default function PriviScanHistory(props) {
  const classes = useStyles();

  const [datedList, setDatedList] = useState<any>();
  const [selectedHistory, setSelectedHistory] = useState<any>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (props.history && props.history.length > 0) {
      const historySorted = [...props.history];
      console.log({historySorted});
      historySorted.sort((a, b) => b.tx.Date - a.tx.Date);
      setDatedList(historySorted);
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.history]);

  const handleCloseModal = () => {
    setOpenModal(false);
  }

  const handleClickHistory = (history) => {
    setSelectedHistory(history);
    setOpenModal(true);
  }

    return (
      <div className={classes.container}>
        <Table aria-label="customized table">
          <TableHead style={{ background: "#25AE9E", color: "white" }}>
            <TableRow>
              <StyledTableCell>TXN ID</StyledTableCell>
              <StyledTableCell>TYPE</StyledTableCell>
              <StyledTableCell>SENDER</StyledTableCell>
              <StyledTableCell>RECEIVER</StyledTableCell>
              <StyledTableCell>VALUE</StyledTableCell>
              <StyledTableCell>TOKEN</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.isDataLoading ? <CircularLoadingIndicator /> :
              !datedList ? 
              <div className="centered-info">
                <p>No trading history to show</p>
              </div> :
              datedList && datedList.map((row, index) => (
                <TableRow key={"trading-history-row" + index} onClick={()=>handleClickHistory(row)}>
                  <StyledTableCell
                    style={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      maxWidth: "80px",
                    }}
                  >
                    {row.tx.Type}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      maxWidth: "80px",
                    }}
                  >
                    {row.tx.Type}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box className={classes.topHeaderLabel}>{shortenHash(row.tx.From)}</Box>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box className={classes.topHeaderLabel}>{shortenHash(row.tx.To)}</Box>
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.tx.Amount}</StyledTableCell>
                  <StyledTableCell align="left">
                    <img src={require(`assets/tokenImages/${row.tx.Token}.png`)} width={24} height={24} />
                  </StyledTableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openModal}
          onClose={handleCloseModal}
          closeAfterTransition
        >
          <Table aria-label="customized table">
            <TableHead style={{ background: "#25AE9E", color: "white" }}>
              <TableRow>
                <StyledTableCell>TXN ID</StyledTableCell>
                <StyledTableCell>TYPE</StyledTableCell>
                <StyledTableCell>SENDER</StyledTableCell>
                <StyledTableCell>RECEIVER</StyledTableCell>
                <StyledTableCell>VALUE</StyledTableCell>
                <StyledTableCell>TOKEN</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                selectedHistory && selectedHistory.txs.map((row, index) => (
                  <TableRow key={"trading-history-row" + index}>
                    <StyledTableCell
                      style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: "80px",
                      }}
                    >
                      {row.Type}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: "80px",
                      }}
                    >
                      {row.Type}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Box className={classes.topHeaderLabel}>{shortenHash(row.From)}</Box>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Box className={classes.topHeaderLabel}>{shortenHash(row.To)}</Box>
                    </StyledTableCell>
                    <StyledTableCell align="left">{row.Amount}</StyledTableCell>
                    <StyledTableCell align="left">
                      <img src={require(`assets/tokenImages/${row.Token}.png`)} width={24} height={24} />
                    </StyledTableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </Modal>
      </div>
    );
}
