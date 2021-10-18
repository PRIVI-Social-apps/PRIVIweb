import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useTypedSelector } from "store/reducers/Reducer";
import { Gradient } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Box from 'shared/ui-kit/Box';

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "Octover",
  "November",
  "December",
];

const useStyles = makeStyles({
  table: {
    overflowY: "auto",
    padding: "0 5px",
  },
});

export default function AirdropHistoryTable({ airdropHistory }) {
  const users = useTypedSelector(state => state.usersInfoList);

  const classes = useStyles();

  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (airdropHistory && airdropHistory.length > 0 && users && users.length > 0) {
      const h = [...airdropHistory];

      h.forEach((txn, index) => {
        h[index].user = users.find(u => u.address === txn.From);

        let dateNum = txn.Date < 16148612430 ? Number(`${txn.Date}000`) : txn.Date;
        h[index].date = `${new Date(dateNum).getDate()} ${months[new Date(dateNum).getMonth()]}, ${new Date(
          dateNum
        ).getFullYear()}`;
        let hours =
          new Date(dateNum).getHours() < 10
            ? `0${new Date(dateNum).getHours()}`
            : new Date(dateNum).getHours() > 12
              ? new Date(dateNum).getHours() - 12
              : new Date(dateNum).getHours();
        let mins =
          new Date(dateNum).getMinutes() < 10
            ? `0${new Date(dateNum).getMinutes()}`
            : new Date(dateNum).getMinutes();

        h[index].time = `${hours}:${mins} ${new Date(dateNum).getHours() >= 12 && new Date(dateNum).getHours() < 0 ? "PM GMT" : "AM GMT"
          }`;
      });

      setHistory(h);
    }
  }, [airdropHistory, users]);

  const tableHeaders: Array<CustomTableHeaderInfo> = [{
    headerName: "FROM"
  }, {
    headerName: "AMOUNT"
  }, {
    headerName: "PRICE"
  }, {
    headerName: "DATE"
  }, {
    headerName: "TIME"
  }
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (history && history.length) {
      data = history.map((txn) => {
        return [{
          cell: (
            <Box display="flex" alignItems="center">
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                marginRight: "15px"
              }}>
                <div
                  style={{
                    filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
                    border: "1.5px solid #FFFFFF",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage:
                      txn.user && txn.user.imageURL && txn.user.imageURL !== ""
                        ? `url(${txn.user.imageURL})`
                        : "none",
                  }}
                />
                {txn.user && txn.user.online &&
                  <div style={{
                    background: Gradient.Mint,
                    border: "1px solid #FFFFFF",
                    width: "9.5px",
                    height: "9.5px",
                    borderRadius: "50%",
                    marginLeft: "-12px",
                    marginTop: "-12px",
                  }} />}
              </div>
              <div style={{
                background: Gradient.Mint,
                color: "transparent",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {txn.user
                  ? txn.user.urlSlug && !txn.user.urlSlug.includes("Px")
                    ? txn.user.urlSlug
                    : txn.user.name
                  : "User"}
              </div>
            </Box>
          )
        }, {
          cell: txn.Amount ?? ""
        }, {
          cell: `$ ${Number(txn.Price.toString()).toFixed(6)}`
        }, {
          cell: txn.date
        }, {
          cell: txn.time
        }];
      });
    }

    setTableData(data);
  }, [history]);

  return (
    <div className={classes.table}>
      <CustomTable
        headers={tableHeaders}
        rows={tableData}
        placeholderText="No airdrop history to show"
      />
    </div>
  );
}
