import React, { useEffect, useState } from "react";

import { treasuryTokenModalStyles } from "./TreasuryTokenModal.styles";
import URL from "shared/functions/getURL";
import { Modal } from "shared/ui-kit";
import { Box } from "@material-ui/core";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { Text } from "components/PriviDAO/subpages/DAOPage/index.styles";

const TreasuryTokenModal = (props: any) => {
  const classes = treasuryTokenModalStyles();
  const [sortedTransactions, setSortedTransactions] = useState<any[]>([]);

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    { headerAlign: "center", headerName: "Event" },
    { headerAlign: "center", headerName: "Quantity" },
    { headerAlign: "center", headerName: "Transaction" },
    { headerAlign: "center", headerName: "Date" },
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);
  useEffect(() => {
    const data: Array<Array<CustomTableCellInfo>> = sortedTransactions.map(transaction => {
      return [
        {
          cellAlign: "center",
          cell: transaction.EventType ?? "unkwnown",
        },
        { cellAlign: "center", cell: transaction.Amount },
        { cellAlign: "center", cell: transaction.Id },
        {
          cellAlign: "center",
          cell: styledDate(transaction.Date),
        },
      ];
    });
    setTableData(data);
  }, [sortedTransactions]);

  useEffect(() => {
    if (props.transactions && props.transactions.length > 0) {
      const eventsList = [...props.transactions];
      eventsList.sort((a, b) => a.Date - b.Date);
      setSortedTransactions(eventsList);
    }
  }, [props.transactions]);

  const styledDate = date => {
    const d = new Date(date * 1000); // because blockchain store Date field in seconds instead of ms
    return `${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}.${
      d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
    }.${d.getFullYear()}`;
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      className={classes.root}
      theme="dark"
    >
      <Box display="flex" alignItems="center">
        <div
          className={classes.photoTreasury}
          style={{
            backgroundImage: props.balanceObj.Token
              ? props.balanceObj.Type === "CRYPTO"
                ? `url(${require(`assets/tokenImages/${props.balanceObj.Token}.png`)})`
                : `url(${URL()}/wallet/getTokenPhoto/${props.balanceObj.Token})`
              : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box display="flex" flexDirection="column" ml={2} fontSize="18px">
          <Box fontFamily="Agrandir GrandLight" mb={0.5}>{`${props.balanceObj.Token} TOKEN`}</Box>
          <Box fontWeight={800} mb={0.5}>
            Quantity
          </Box>
          <Box color="#D10869">{`${props.balanceObj.Amount}`}</Box>
        </Box>
      </Box>

      <Box mt={3}>
        <CustomTable theme="dark" headers={tableHeaders} rows={tableData} placeholderText="No transaction" />
      </Box>
    </Modal>
  );
};

export default TreasuryTokenModal;
