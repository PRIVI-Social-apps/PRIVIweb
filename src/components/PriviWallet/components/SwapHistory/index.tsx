import React, { useState, useEffect, useCallback } from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { swapHistoryStyles, StyledTableCell } from "./index.styles";
import Box from "shared/ui-kit/Box";
import Moment from "react-moment";
import { resImages, StyledSelectComponent } from "shared/ui-kit/Select/TokenSelect";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import URL from "shared/functions/getURL";
import { BlockchainNets } from "shared/constants/constants";

/*const txnTypeMap = {
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
};*/

export default function SwapHistory(props) {
  const classes = swapHistoryStyles();

  const [datedList, setDatedList] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortAsc, setSortAsc] = React.useState<boolean>(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (props.history && Object.keys(props.history).length > 0) {
      const historySorted = props.history;
      // Object.keys(historySorted).sort((a, b) => b.lastUpdate - a.lastUpdate);

      const sortedList = [] as any;

      Object.keys(historySorted).map(key => {
        sortedList.push({
          type: historySorted[key].action,
          token: historySorted[key].token || "",
          amount: historySorted[key].amount || "",
          date: historySorted[key].lastUpdate || "",
          id: historySorted[key].id,
          chain: historySorted[key].chainId ? BlockchainNets[historySorted[key].chainId].name : "",
        });
      });

      setDatedList(sortedList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.history]);

  const filteredtransactions = useCallback(() => {
    return datedList.filter((tx: any) => {
      if (
        new Date().getFullYear() === selectedDate?.getFullYear() &&
        new Date().getMonth() === selectedDate?.getMonth() &&
        new Date().getDate() === selectedDate?.getDate()
      )
        return true;
      return (
        selectedDate &&
        new Date(tx.date * 1000).getFullYear() >= selectedDate.getFullYear() &&
        new Date(tx.date * 1000).getMonth() >= selectedDate.getMonth() &&
        new Date(tx.date * 1000).getDate() >= selectedDate.getDate()
      );
    });
  }, [datedList, selectedDate]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const isCrypto = token => {
    if (resImages.includes(token)) return true;
    else return false;
  };

  if (datedList.length > 0)
    return (
      <Box mt={"60px"}>
        <Box display="flex" alignItems="center" justifyContent="space-between" className={classes.title}>
          <div className={classes.headerbig}>Recent Swaps</div>
          <DateInput
            width={210}
            height={45}
            format="dd.MM.yyyy"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </Box>
        <Box className={classes.tableContainer} mt="24px">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Type</StyledTableCell>
                <StyledTableCell align="center">Token</StyledTableCell>
                <StyledTableCell align="center">Amount</StyledTableCell>
                <StyledTableCell align="center">Chain</StyledTableCell>
                <StyledTableCell align="center" onClick={() => setSortAsc(!sortAsc)}>
                  <Box
                    display="flex"
                    style={{ cursor: "pointer" }}
                    justifyContent="center"
                    alignItems="center"
                  >
                    Time
                    <Box ml="12px" style={!sortAsc ? { transform: "rotate(180deg" } : {}}>
                      <svg
                        width="7"
                        height="11"
                        viewBox="0 0 7 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.06531 1.5624L4.06531 8.30805L5.34277 7.03059C5.63087 6.74248 6.11642 6.74248 6.4038 7.03059C6.54785 7.17463 6.61951 7.37208 6.61951 7.57024C6.61951 7.7684 6.54784 7.94828 6.4038 8.10989L3.84963 10.6648C3.56152 10.9529 3.07598 10.9529 2.7886 10.6648L0.216077 8.09226C-0.0720256 7.80416 -0.0720256 7.31862 0.216077 7.03123C0.504179 6.74313 0.989722 6.74313 1.2771 7.03123L2.55457 8.3087L2.55457 1.56305C2.55457 1.14917 2.89606 0.807681 3.30994 0.807681C3.72381 0.806978 4.06531 1.14852 4.06531 1.5624Z"
                          fill="#54658F"
                        />
                      </svg>
                    </Box>
                  </Box>
                </StyledTableCell>
                <StyledTableCell align="center">Explorer</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredtransactions() && filteredtransactions().length > 0 ? (
                filteredtransactions()
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .sort((a, b) => (sortAsc ? b.Date - a.Date : a.Date - b.Date))
                  .map((row, index) => (
                    <TableRow key={"trading-history-row" + index}>
                      <StyledTableCell
                        align="left"
                        style={{ maxWidth: "calc(100% / 6)", width: "calc(100% / 6)" }}
                      >
                        <Box color="#4218B5" fontSize="14px" className={classes.break}>
                          {row.type}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <img
                          src={
                            row.token && isCrypto(row.token)
                              ? require(`assets/tokenImages/${row.token}.png`)
                              : `${URL()}/wallet/getTokenPhoto/${row.token}`
                          }
                          width={24}
                          height={24}
                        />
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.amount
                          ? `${
                              row.amount > 1000000
                                ? (row.amount / 1000000).toFixed(2)
                                : row.amount > 1000
                                ? (row.amount / 1000).toFixed(2)
                                : row.amount.toFixed(6)
                            } ${row.amount > 1000000 ? "m" : row.amount > 1000 ? "k" : ""}`
                          : "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">{row.chain ?? "PRIVI"}</StyledTableCell>

                      <StyledTableCell align="center">
                        <Moment format="ddd, DD MMM YYYY - h:mm A">{row.date * 1000}</Moment>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.id && (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={"https://priviscan.io/tx/" + row.id}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.9999 0.999951L6.99995 11M16.9999 0.999951L17 6.99994M16.9999 0.999951L11 0.999939M6.99998 0.999951H1V16.9999H17V10.9999"
                                stroke="#4218B5"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </a>
                        )}
                      </StyledTableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <StyledTableCell align="center">No transactions to display</StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
        {datedList && filteredtransactions() && rowsPerPage ? (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            count={filteredtransactions().length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        ) : null}
      </Box>
    );
  else
    return (
      <div className="centered-info">
        <p>No trading history to show</p>
      </div>
    );
}

const TablePagination = ({
  rowsPerPageOptions,
  count,
  rowsPerPage,
  page,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  const classes = swapHistoryStyles();

  const [totalPages, setTotalPages] = useState<number>(2);

  useEffect(() => {
    if (count && rowsPerPage) setTotalPages(count / rowsPerPage);
  }, [count]);

  useEffect(() => {
    setTotalPages(count / rowsPerPage);
  }, [rowsPerPage]);

  return (
    <div className={classes.pagination}>
      <Box mr="16px">
        <div>Rows per page:</div>
        <StyledSelectComponent
          options={rowsPerPageOptions}
          value={rowsPerPage}
          onChange={onChangeRowsPerPage}
        />
      </Box>

      <Box mr="16px">{`${rowsPerPage * page + 1}-${
        page + 1 > totalPages ? count : (rowsPerPage * (page + 1))?.toFixed(0)
      } out of ${count}`}</Box>

      <Box mr="16px">
        <button onClick={e => onChangePage(e, page - 1)} disabled={page - 1 === -1}>
          <img src={require("assets/icons/arrow.png")} alt="back" />
        </button>
        <button onClick={e => onChangePage(e, page + 1)} disabled={page + 1 > totalPages}>
          <img src={require("assets/icons/arrow.png")} alt="back" />
        </button>
      </Box>
    </div>
  );
};
