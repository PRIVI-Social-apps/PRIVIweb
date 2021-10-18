import React from 'react';

import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { Variant } from 'shared/constants/const';

import { transactionStyles } from './index.styles';

const tableHeaders: Array<CustomTableHeaderInfo> = [{
  headerName: "",
  headerAlign: "center",
  headerWidth: "16%"
}, {
  headerName: "Total value",
  headerAlign: "center",
  headerWidth: "14%"
}, {
  headerName: "Token amount",
  headerAlign: "center",
  headerWidth: "14%"
}, {
  headerName: "Token amount",
  headerAlign: "center",
  headerWidth: "14%"
}, {
  headerName: " Account",
  headerAlign: "center",
  headerWidth: "14%"
}, {
  headerName: "Time",
  headerAlign: "center",
  headerWidth: "14%"
}];

export const Transaction = () => {
  const classes = transactionStyles();
  return (
    <>
      <div className={classes.title}>Transactions</div>
      <CustomTable
        headers={tableHeaders}
        rows={[]}
        placeholderText="No transaction history to show"
        variant={Variant.Transaction}
      />
    </>
  );
}
