import React, { useState, useEffect } from "react";
import Moment from "react-moment";

import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";

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

export default function TransactionHistory(props) {
  const [datedList, setDatedList] = useState<any[]>([]);

  useEffect(() => {
    if (props.history && props.history.length > 0) {
      const historySorted = [...props.history];
      historySorted.sort((a, b) => b.Date - a.Date);

      const sortedList = [] as any;

      historySorted.forEach(elem => {
        let time = "";
        if (elem.Date) {
          const date = new Date(elem.Date * 1000);
          const minutes = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
          const seconds = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
          const day = date.getUTCDate();
          const month = date.getUTCMonth() + 1; //months from 1-12
          const year = date.getUTCFullYear();
          time = `${minutes}:${seconds} - ${day}/${month}/${year}`;
        }

        sortedList.push({
          type: txnTypeMap[elem.Type] ?? elem.Type,
          token: elem.Token || "",
          amount: elem.Amount || "",
          amountUSD: elem.AmountUSD || "",
          quantity: elem.Quantity || "",
          from: elem.From || "",
          to: elem.To || "",
          date: elem.Date || "",
          status: elem.Status || "",
          address: (elem.To = props.address ? elem.To : elem.From),
          time: time || "",
          id: elem.Id,
        });
      });

      setDatedList(sortedList);
    } else {
      const sortedList = [] as any;
      const object = {
        type: txnTypeMap["PRIVI_credit_creation"],
        Token: "BNB",
        quantity: 152.25,
        date: new Date(),
        id: "test",
        chain: "Substrate",
      };
      sortedList.push(object);
      sortedList.push(object);
      sortedList.push(object);
      sortedList.push(object);
      sortedList.push(object);
      sortedList.push(object);

      setDatedList(sortedList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.history]);

  const tableHeaders: Array<CustomTableHeaderInfo> = [{
      headerName: "TYPE"
    }, {
      headerName: "TOKEN"
    }, {
      headerName: "QUANTITY"
    }, {
      headerName: "CHAIN"
    }, {
      headerName: "DATE"
    }, {
      headerName: "TIME"
    }, {
      headerName: ""
    }
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (datedList && datedList.length) {
      data = datedList.map((row) => {
        return [{
          cell: (
            <div style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              maxWidth: "80px"
            }}>
              {row.type}
            </div>
          )
        }, {
          cell: <img src={require(`assets/tokenImages/${row.Token}.png`)} width={24} height={24} />
        }, {
          cell: row.quantity
        }, {
          cell: row.chain
        }, {
          cell: <Moment format="ddd, DD MMM">{row.Date}</Moment>
        }, {
          cell: <Moment format="h:mm A">{row.Date}</Moment>
        }, {
          cell: (
            row.id && (
              <a target="_blank" rel="noopener noreferrer" href={"https://priviscan.io/tx/" + row.id}>
                <img
                  style={{verticalAlign: "middle"}}
                  src={require("assets/icons/newScreen_black.svg")}
                  alt="link"
                />
              </a>
            )
          )
        }];
      });
    }

    setTableData(data);
  }, [datedList]);

  return (
    <CustomTable
      headers={tableHeaders}
      rows={tableData}
      placeholderText="No trading history to show"
    />
  );
}
