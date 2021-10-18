import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useTypedSelector } from "store/reducers/Reducer";
import { Gradient } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { getMonthName, getDayOfWeek } from "shared/functions/commonFunctions";

const useStyles = makeStyles({
  table: {
    overflowY: "auto",
    padding: "0 5px",
  },
});

const txnTypeMap = {
  Social_Token_Buying: 'Buy',
  Social_Token_Selling: "Sell",
  Social_Token_Dividend: "Div",
  Social_Token_Minting: "Buy",
  Social_Token_Burning: "Sell",

}

const parseDate = (timestampInS) => {
  let s = "";
  const date = new Date(timestampInS * 1000);
  s += getDayOfWeek(date.getDay()).substring(0, 3).toUpperCase() + ", ";
  s += date.getDate() + " ";
  s += getMonthName(date.getMonth()).substring(0, 3);
  return s;
}

const parseTime = (timestampInS) => {
  const date = new Date(timestampInS * 1000);
  let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  let mins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${hours}:${mins} ${date.getHours() >= 12 ? "PM" : "AM"}`;
}

export default function TransactionHistoryTable({ socialToken, transactionHistory }) {
  const users = useTypedSelector(state => state.usersInfoList);
  const classes = useStyles();
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "TYPE",
    },
    {
      headerName: "AMOUNT",
    },
    {
      headerName: "FROM",
    },
    {
      headerName: "DATE",
    },
    {
      headerName: "TIME",
    },
    {
      headerName: "STATUS",
    },
    {
      headerName: "PRIVISCAN",
    },
  ];


  useEffect(() => {
    const data: Array<Array<CustomTableCellInfo>> = [];
    if (transactionHistory) {
      for (let txnObj of transactionHistory) {
        const foundUser: any = users.find(u => u.address == txnObj.From);
        let name = foundUser ? foundUser.name : txnObj.From == socialToken.PoolAddress ? "Pool" : txnObj.From.substring(0, 8) + "...";
        const row = [
          {
            cell: txnObj.Type ? txnTypeMap[txnObj.Type] : '',
          },
          {
            cell: (txnObj.Amount ?? 0).toFixed(6),
          },
          {
            cell: (
              <div
                style={{
                  background: Gradient.Green,
                  color: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {name}
              </div>
            ),
          },
          {
            cell: txnObj.Date ? parseDate(txnObj.Date) : "",
          },
          {
            cell: txnObj.Date ? parseTime(txnObj.Date) : "",
          },
          {
            cell: "Confirmed",
          },
          {
            cell: <a target="_blank" rel="noopener noreferrer" href={"https://priviscan.io/tx/" + txnObj.Id}>
              <img
                style={{ verticalAlign: "middle" }}
                src={require("assets/icons/newScreen_black.svg")}
                alt="link"
              />
            </a>
          },
        ];
        data.push(row);
      }
    }
    setTableData(data);
  }, [transactionHistory]);

  return (
    <div className={classes.table}>
      <CustomTable headers={tableHeaders} rows={tableData} placeholderText="No transaction history to show" theme="green" />
    </div>
  );
}
