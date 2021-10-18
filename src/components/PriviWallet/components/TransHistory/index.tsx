import React, { useCallback, useEffect, useState } from "react";
import Moment from "react-moment";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as WalletAPIProvider from "shared/services/API/WalletAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { transHistoryStyles, StyledTableCell, StyledTableCellColor } from "./index.styles";
import Box from "shared/ui-kit/Box";
import { useTypedSelector } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { Color } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import URL from "shared/functions/getURL";
import { resImages, StyledSelectComponent } from "shared/ui-kit/Select/TokenSelect";

const TransHistory = ({ filter }: { filter?: boolean }) => {
  const user = useTypedSelector(state => state.user);

  const classes = transHistoryStyles();
  const { showAlertMessage } = useAlertMessage();

  const [transactions, setTransactions] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
  const [searchValue, setSearchValue] = React.useState<string>("");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [seeAll, setSeeAll] = React.useState<boolean>(false);
  const [sortAsc, setSortAsc] = React.useState<boolean>(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setLoading(true);
    const fetchTransactions = async () => {
      try {
        const txs = await WalletAPIProvider.getTransactions(user.address);
        setLoading(false);
        setTransactions(txs);
      } catch (e) {
        showAlertMessage(e.message || "Fetching transaction failed", { variant: "error" });
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredtransactions = useCallback(() => {
    return transactions.filter((tx: any) => {
      if (
        (!searchValue || searchValue === "") &&
        new Date().getFullYear() === selectedDate?.getFullYear() &&
        new Date().getMonth() === selectedDate?.getMonth() &&
        new Date().getDate() === selectedDate?.getDate()
      )
        return true;
      return (
        (searchValue &&
          (tx.Id?.toUpperCase().includes(searchValue.toUpperCase()) ||
            tx.From?.toUpperCase().includes(searchValue.toUpperCase()) ||
            tx.To?.toUpperCase().includes(searchValue.toUpperCase()) ||
            tx.Token?.toUpperCase().includes(searchValue.toUpperCase()))) ||
        (selectedDate &&
          new Date(tx.Date * 1000).getFullYear() >= selectedDate.getFullYear() &&
          new Date(tx.Date * 1000).getMonth() >= selectedDate.getMonth() &&
          new Date(tx.Date * 1000).getDate() >= selectedDate.getDate())
      );
    });
  }, [transactions, searchValue, selectedDate]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const isCrypto = token => {
    if (resImages.includes(token)) return true;
    else return false;
  };

  return (
    <Box mt={"60px"}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <div className={classes.headerbig}>{filter ? "Recent transactions" : `Transactions`}</div>
        {filter ? (
          <Box display="flex" className={classes.inputs}>
            <InputWithLabelAndTooltip
              endAdornment={<img src={require("assets/icons/search.png")} alt="search" width="17px" />}
              inputValue={searchValue}
              onInputValueChange={e => {
                setSearchValue(e.target.value);
              }}
              type="text"
              placeHolder="Search by Address / Txn Hash / Token"
            />

            <DateInput
              width={210}
              height={45}
              format="dd.MM.yyyy"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </Box>
        ) : (
          <button
            style={seeAll ? { paddingLeft: "20px" } : {}}
            className={classes.seeAll}
            onClick={() => {
              setSeeAll(!seeAll);
            }}
          >
            {seeAll ? "Hide" : `Show All`}
            {!seeAll && (
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.24515 10.9386C8.436 10.9386 8.60676 10.8658 8.75743 10.7201L13.4809 6.00419C13.6366 5.85854 13.7145 5.68025 13.7145 5.46931C13.7145 5.26339 13.6366 5.0851 13.4809 4.93443L8.78003 0.241071C8.69465 0.155692 8.60802 0.0941685 8.52012 0.0565011C8.43223 0.0188337 8.34058 0 8.24515 0C8.04426 0 7.87601 0.0652902 7.74041 0.195871C7.60481 0.326451 7.537 0.492188 7.537 0.69308C7.537 0.793527 7.55458 0.887695 7.58974 0.975586C7.6249 1.06348 7.67512 1.14007 7.74041 1.20536L9.34504 2.83259L11.5564 4.8545L9.87992 4.75363L1.06574 4.75363C0.854806 4.75363 0.681536 4.82017 0.545933 4.95326C0.410331 5.08636 0.342529 5.25837 0.342529 5.46931C0.342529 5.68527 0.410331 5.85979 0.545933 5.99289C0.681536 6.12598 0.854806 6.19252 1.06574 6.19252L9.87992 6.19252L11.5628 6.09264L9.34504 8.11356L7.74041 9.74079C7.67512 9.80608 7.6249 9.88267 7.58974 9.97056C7.55458 10.0585 7.537 10.1526 7.537 10.2531C7.537 10.4489 7.60481 10.6122 7.74041 10.7427C7.87601 10.8733 8.04426 10.9386 8.24515 10.9386Z"
                  fill={Color.MusicDAODark}
                />
              </svg>
            )}
          </button>
        )}
      </Box>
      <Box className={classes.tableContainer} mt="24px">
        <Table aria-label="customized table">
          <TableHead>
            {!filter ? (
              <TableRow>
                <StyledTableCell align="left">Type</StyledTableCell>
                <StyledTableCell align="center">Token</StyledTableCell>
                <StyledTableCell align="center">Amount</StyledTableCell>
                <StyledTableCell align="center">Chain</StyledTableCell>
                <StyledTableCell align="center" onClick={() => setSortAsc(!sortAsc)}>
                  <Box
                    display="flex"
                    style={{ cursor: filter ? "inherit" : "pointer" }}
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
            ) : (
              <TableRow>
                <StyledTableCell align="left">Txn ID</StyledTableCell>
                <StyledTableCell align="left">Type</StyledTableCell>
                <StyledTableCell align="left">Time</StyledTableCell>
                <StyledTableCell align="center">Sender</StyledTableCell>
                <StyledTableCell align="center">Receiver</StyledTableCell>
                <StyledTableCell align="center">Amount</StyledTableCell>
                <StyledTableCell align="center">Token</StyledTableCell>
                <StyledTableCell align="center">Explorer</StyledTableCell>
              </TableRow>
            )}
          </TableHead>

          <TableBody>
            <LoadingWrapper loading={loading}>
              {filteredtransactions() && filteredtransactions().length > 0 ? (
                filteredtransactions()
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .sort((a, b) => (sortAsc ? b.Date - a.Date : a.Date - b.Date))
                  .map((row, index) =>
                    !filter ? (
                      <TableRow key={"trading-history-row" + index}>
                        <StyledTableCell
                          align="left"
                          style={{ maxWidth: "calc(100% / 6)", width: "calc(100% / 6)" }}
                        >
                          <Box color="#4218B5" fontSize="14px" className={classes.break}>
                            {row.Type}
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <img
                            src={
                              row.Token && isCrypto(row.Token)
                                ? require(`assets/tokenImages/${row.Token}.png`)
                                : `${URL()}/wallet/getTokenPhoto/${row.Token}`
                            }
                            width={24}
                            height={24}
                          />
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.Amount
                            ? `${
                                row.Amount > 1000000
                                  ? (row.Amount / 1000000).toFixed(2)
                                  : row.Amount > 1000
                                  ? (row.Amount / 1000).toFixed(2)
                                  : row.Amount.toFixed(6)
                              } ${row.Amount > 1000000 ? "m" : row.Amount > 1000 ? "k" : ""}`
                            : "N/A"}
                        </StyledTableCell>
                        <StyledTableCell align="center">{row.Chain ?? "PRIVI"}</StyledTableCell>
                        <StyledTableCell align="center">
                          <Moment format="ddd, DD MMM-h:mm A">{row.Date * 1000}</Moment>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.Id && (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={"https://priviscan.io/tx/" + row.Id}
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
                    ) : (
                      <TableRow>
                        <StyledTableCellColor align="left">
                          <Box color="#4218B5" fontSize="14px" className={classes.ellipsis}>
                            {row.Id}
                          </Box>
                        </StyledTableCellColor>
                        <StyledTableCellColor
                          align="left"
                          style={{ maxWidth: "calc(100% / 6)", width: "calc(100% / 6)" }}
                        >
                          <Box className={classes.break}>{row.Type}</Box>
                        </StyledTableCellColor>
                        <StyledTableCellColor align="left">
                          <Moment format="DD/MM/YYYY - h:mm a">{row.Date * 1000}</Moment>
                        </StyledTableCellColor>
                        <StyledTableCellColor align="center">
                          <Box color="#4218B5" fontSize="14px">
                            {row.From
                              ? row.From.length > 12
                                ? `${row.From.slice(0, 6)}...${row.From.slice(
                                    row.From.length - 7,
                                    row.From.length - 1
                                  )}`
                                : row.From
                              : "N/A"}
                          </Box>
                        </StyledTableCellColor>
                        <StyledTableCellColor align="center">
                          <Box color="#4218B5" fontSize="14px">
                            {row.To
                              ? row.To.length > 12
                                ? `${row.To.slice(0, 6)}...${row.To.slice(
                                    row.To.length - 7,
                                    row.To.length - 1
                                  )}`
                                : row.To
                              : "N/A"}
                          </Box>
                        </StyledTableCellColor>
                        <StyledTableCellColor align="center">
                          {row.Amount
                            ? `${
                                row.Amount > 1000000
                                  ? (row.Amount / 1000000).toFixed(2)
                                  : row.Amount > 1000
                                  ? (row.Amount / 1000).toFixed(2)
                                  : row.Amount.toFixed(6)
                              } ${row.Amount > 1000000 ? "m" : row.Amount > 1000 ? "k" : ""}`
                            : "N/A"}
                        </StyledTableCellColor>
                        <StyledTableCellColor align="center">
                          <img
                            src={
                              row.Token && isCrypto(row.Token)
                                ? require(`assets/tokenImages/${row.Token}.png`)
                                : `${URL()}/wallet/getTokenPhoto/${row.Token}`
                            }
                            width={24}
                            height={24}
                          />
                        </StyledTableCellColor>
                        <StyledTableCellColor align="center">
                          {row.Id && (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={"https://priviscan.io/tx/" + row.Id}
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
                        </StyledTableCellColor>
                      </TableRow>
                    )
                  )
              ) : (
                <TableRow>
                  <StyledTableCellColor align="center">No transactions to display</StyledTableCellColor>
                </TableRow>
              )}
            </LoadingWrapper>
          </TableBody>
        </Table>
      </Box>
      {/* {(seeAll || filter) && filteredtransactions() && rowsPerPage ? (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={filteredtransactions().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      ) : null} */}
    </Box>
  );
};

export default TransHistory;

const TablePagination = ({
  rowsPerPageOptions,
  count,
  rowsPerPage,
  page,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  const classes = transHistoryStyles();

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
