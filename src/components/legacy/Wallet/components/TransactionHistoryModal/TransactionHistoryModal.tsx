import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { transactionHistoryModalStyles, StyledTableCell } from "./TransactionHistoryModal.styles";
import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Modal } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.open === currProps.open;
};

const TransactionHistoryModal = React.memo((props: any) => {
  const classes = transactionHistoryModalStyles();
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  useEffect(() => {
    if (props.open && props.user && props.user.address) {
      const config = {
        params: {
          userAddress: props.user.address,
        },
      };
      setIsDataLoading(true);
      axios
        .get(`${URL()}/wallet/getTransactions`, config)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            console.log("getTransactions", resp.data);
            setTransactionHistory(resp.data);
          }
          setIsDataLoading(false);
        })
        .catch(() => {
          setIsDataLoading(false);
        });
    }
  }, [props.open, props.user]);

  const tableHeaders: Array<CustomTableHeaderInfo> = [{
      headerName: "EVENT"
    }, {
      headerName: "DATE"
    }, {
      headerName: "FROM"
    }, {
      headerName: "TO"
    }, {
      headerName: "QUANTITY",
      headerAlign: "right",
    }, {
      headerName: "TOKEN",
      headerAlign: "center",
    }, {
      headerName: "LINK",
      headerAlign: "center",
    }
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);
  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (transactionHistory && transactionHistory.length) {
      data = transactionHistory.map((txn) => {
        let from = txn.From === "" ? "0x0000000000000000000000000000000000000000" : txn.From;
        let to = txn.To === "" ? "0x0000000000000000000000000000000000000000" : txn.To;
        let date = txn.Date < 16148612430 ? Number(`${txn.Date}000`) : txn.Date;
        return [{
          cell: (
            <span style={{
              color: "#23d0c6",
              border: "2px solid #23d0c6",
              borderRadius: 50,
              padding: "10px 15px",
              marginLeft: -10
            }}>
              {txn.Type.substring(0, 10)}
            </span>
          )
        }, {
          cell: new Date(date).toUTCString()
        }, {
          cell: `${from.substring(0, 6)}...${from.substring(from.length - 6, from.length)}`
        }, {
          cell: `${to.substring(0, 6)}...${to.substring(to.length - 6, to.length)}`
        }, {
          cell: Number(txn.Amount.toString()).toFixed(6),
          cellAlign: "right"
        }, {
          cell: txn.Token,
          cellAlign: "center"
        }, {
          cell: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={"https://priviscan.io/tx/" + txn.Id}
            >
              <img
                style={{verticalAlign: "middle"}}
                src={require("assets/icons/newScreen.svg")}
                alt="link"
              />
            </a>
          ),
          cellAlign: "center"
        }];
      });
    }

    setTableData(data);
  }, [transactionHistory]);

  return (
    <Modal size="medium" isOpen={props.open} onClose={props.handleClose} showCloseIcon>
      <div className={classes.modalContent}>
        <div className={classes.title}>
          <h3>My Transaction History</h3>
        </div>
        <div className={classes.table}>
          <LoadingWrapper loading={isDataLoading}>
            <>
              <CustomTable
                headers={tableHeaders}
                rows={tableData}
                placeholderText="No transaction history to show"
              />
            </>
          </LoadingWrapper>
        </div>
      </div>
    </Modal>
  );
}, arePropsEqual);

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(TransactionHistoryModal);
