import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useTypedSelector } from "store/reducers/Reducer";
import { Gradient } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Box from "shared/ui-kit/Box";
import { getMonthName, getDayOfWeek, formatNumber } from "shared/functions/commonFunctions";

const useStyles = makeStyles({
  table: {
    overflowY: "auto",
    padding: "0 5px",
  },
});

const parseDate = (timestampInS) => {
  let s = "";
  const date = new Date(timestampInS * 1000);
  s += getMonthName(date.getMonth()) + " ";
  s += date.getDate() + ", ";
  s += date.getFullYear();
  return s;
}

export default function TransactionUserHistoryTable({ socialToken, transactionHistory }) {

  const users = useTypedSelector(state => state.usersInfoList);
  const classes = useStyles();
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);


  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "FROM",
    },
    {
      headerName: "AMOUNT",
    },
    {
      headerName: "DATE",
    },
  ];

  useEffect(() => {
    const data: Array<Array<CustomTableCellInfo>> = [];
    if (transactionHistory) {
      for (let txnObj of transactionHistory) {
        let foundUser: any = users.find(u => u.address == txnObj.From);
        const row = [
          {
            cell: (
              <Box display="flex" alignItems="center">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    marginRight: "15px",
                  }}
                >
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
                        txnObj.From == socialToken.PoolAddress ? socialToken.imageURL :
                          foundUser?.imageURL
                            ? `url(${foundUser.imageURL})`
                            : "none",
                    }}
                  />
                  {foundUser && (
                    <div
                      style={{
                        background: Gradient.Green,
                        border: "1px solid #FFFFFF",
                        width: "9.5px",
                        height: "9.5px",
                        borderRadius: "50%",
                        marginLeft: "-12px",
                        marginTop: "-12px",
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    background: Gradient.Green,
                    color: "transparent",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {txnObj.From == socialToken.PoolAddress ? "Pool" :
                    foundUser
                      ? foundUser.urlSlug && !foundUser.urlSlug.includes("Px")
                        ? foundUser.urlSlug
                        : foundUser.name
                      : "Unknown"}
                </div>
              </Box>
            ),
          },
          {
            cell: formatNumber(txnObj.Amount, txnObj.Token, 4),
          },
          {
            cell: txnObj.Date ? parseDate(txnObj.Date) : '',
          },
        ];
        data.push(row);
      }
    }
    setTableData(data);
  }, [transactionHistory]);



  return (
    <div className={classes.table}>
      <CustomTable
        headers={tableHeaders}
        rows={tableData}
        placeholderText="No transaction history to show"
        theme="green"
      />
    </div>
  );
}
