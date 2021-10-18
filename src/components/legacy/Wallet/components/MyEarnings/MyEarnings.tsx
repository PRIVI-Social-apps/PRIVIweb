import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import {
  makeStyles,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import styled from "styled-components";

import "./MyEarnings.css";
import { useTypedSelector } from "store/reducers/Reducer";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import PrintTypeGraph from "./TypeGraph/TypeGraph";
import EarningsChartConfig from "./EarningsChart/config/EarningsChartConfig";
import PrintEarningsChart from "./EarningsChart/EarningsChart";
import URL from "shared/functions/getURL";
import { formatNumber, getDayOfWeek, getMonthName } from "shared/functions/commonFunctions";
import SendContribution from "./modals/SendContributionModal";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { ChevronIconLeft } from "shared/ui-kit/Icons";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Box from 'shared/ui-kit/Box';

// ---------- from MyEarningsNew -----------
const useStyles = makeStyles(() => ({
  formControl: {
    width: "100%",
  },
  select: {
    minWidth: 150,
    "& .MuiInputBase-root": {
      height: 40,
      borderRadius: 6,
      border: "1px solid #C0C6DC",
      background: "white",
      "&:focus": {
        borderRadius: 6,
        background: "white",
      },
      "& .MuiSelect-select": {
        paddingLeft: 14,
      },
    },
  },
  radioGroup: {
    flexDirection: "row",
    "& label": {
      marginRight: 20,
      "& .MuiIconButton-label": {
        color: "black",
      },
    },
  },
  historyTable: {
    maxHeight: 325,
    marginTop: 30,
  },
}));

const Card = styled.div`
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  padding: 26px 15px 20px 15px;
  margin-bottom: 34px;
`;

const CardTitle = styled.span`
  font-weight: 700;
  font-size: 18px;
`;

interface TextProps {
  color?: string;
  size?: number;
  weight?: number | string;
}

const Text = styled.span<TextProps>`
  color: ${props => props.color || "#707582"};
  font-size: ${props => props.size || "14"}px;
  font-weight: ${props => props.weight || "normal"};
`;

const Button = styled.button`
  background: #181818;
  border: 1.5px solid #181818;
  backdrop-filter: blur(10px);
  border-radius: 6px;
  width: 100%;
  font-weight: bold;
  font-size: 16px;
  height: 40px;
`;

// ---------------------------

const formatDate = timestamp => {
  const date = new Date(timestamp);
  let s = "";
  s += getDayOfWeek(date.getDay()).substring(0, 3).toUpperCase();
  s += ", " + date.getDate() + " " + getMonthName(date.getMonth()).substring(0, 3);
  return s;
};

const truncate = (word: string, length: number) =>
  word.length > length ? `${word.substr(0, length + 1)}...` : word;

const intervals = ["Last week", "Last month", "Last year", "All data"];

const MyEarnings = () => {
  const styles = useStyles();
  //store
  const user = useTypedSelector(state => state.user);

  //hooks
  const history = useHistory();

  const [rateOfChange, setRateOfChange] = useState<any>({});
  const [transactions, setTransactions] = useState<any[]>([]); // only transactions
  const [userMediaStreamings, setUserMediaStreamings] = useState<any[]>([]); // only streamings
  const [allTransactions, setAllTransactions] = useState<any[]>([]); // transactions + streamings
  const [userMedias, setUserMedias] = useState<any[]>([]); // user creted medias

  const [monthsList, setMonthsList] = useState<string[]>([]);

  const [earnMonth, setEarnMonth] = useState<string>("");
  const [earnCurrency, setEarnCurrency] = useState<string>("ETH");
  const [earnValue, setEarnValue] = useState<number>(0);

  const [salesMonth, setSalesMonth] = useState<string>("");
  const [salesCurrency, setSalesCurrency] = useState<string>("ETH");
  const [earningsChart, setEarningsChart] = useState<any>(EarningsChartConfig);
  const [salesHistory, setSalesHistory] = useState<any[]>([]);

  const [mediasInterval, setMediasInterval] = useState<string>(intervals[0]);
  const [soldMedias, setSoldMedias] = useState<number>(0); // total sold media
  const [totalMedias, setTotalMedias] = useState<number>(0); // total user created media
  const [typesData, setTypesData] = useState<any[]>([]); // media types

  const [openContribution, setOpenContribution] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [isMediaStreamingLoading, setIsMediaStreamingLoading] = useState(false);
  const [isRateLoading, setIsRateLoading] = useState(false);

  const handleOpenContribution = () => {
    setOpenContribution(true);
  };

  const handleCloseContribution = () => {
    setOpenContribution(false);
  };

  // initialise data
  useEffect(() => {
    loadData();
  }, [user.id, user.address]);

  const loadData = () => {
    if (user.address && user.id) {
      // get all txn from backend
      const config = {
        params: {
          userAddress: user.address,
          page: "myEarning",
        },
      };
      axios
        .get(`${URL()}/wallet/getTransactions`, config)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            setTransactions(resp.data);
          }
        })
        .catch(() => {
          setTransactions([]);
        });

      // get rate of change
      setIsRateLoading(true);
      axios
        .get(`${URL()}/wallet/getCryptosRateAsMap`)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            setRateOfChange(resp.data);
          }
          setIsRateLoading(false);
        })
        .catch(() => {
          setIsRateLoading(false);
        });

      // get user medias
      const config2 = {
        params: {
          userId: user.id,
        },
      };
      setIsMediaLoading(true);
      axios
        .get(`${URL()}/media/getUserMedias`, config2)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            setUserMedias(resp.data);
          }
          setIsMediaLoading(false);
        })
        .catch(() => {
          setIsMediaLoading(false);
        });

      // get user media streamings
      const config3 = {
        params: {
          userId: user.id,
          userAddress: user.address,
        },
      };
      setIsMediaStreamingLoading(true);
      axios
        .get(`${URL()}/media/getUserMediaStreaming`, config3)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            setUserMediaStreamings(resp.data);
          }
          setIsMediaStreamingLoading(false);
        })
        .catch(() => {
          setIsMediaStreamingLoading(false);
        });
    }
  };

  // set all transactions
  useEffect(() => {
    let newAllTransactions: any[] = [];
    // transactions
    transactions.forEach(txnObj => {
      const date = txnObj.Date ? txnObj.Date * 1000 : 0;
      const foundMedia: any = userMedias.find(media => media.MediaSymbol == txnObj.Token);
      let name = "-";
      let price = "-";
      if (foundMedia) {
        name = foundMedia.MediaName;
        // view
        if (txnObj.Type.toLowerCase().includes("view")) {
          // pod media
          if (foundMedia.Price) price = foundMedia.Price;
          // simple media
          if (foundMedia.ViewConditions && foundMedia.ViewConditions.Price)
            price = foundMedia.ViewConditions.Price;
        }
        // buy
        else {
          // pod media
          if (foundMedia.Price) price = foundMedia.Price;
          // simple media
          if (foundMedia.NftConditions && foundMedia.NftConditions.Price)
            price = foundMedia.NftConditions.Price;
        }
      }
      newAllTransactions.push({
        MediaName: name,
        To: txnObj.To && txnObj.To.length > 10 ? txnObj.To.substring(0, 10) + "..." : "",
        Date: date,
        DateString: formatDate(date),
        Amount: txnObj.Amount ?? 0,
        Price: price,
        Token: txnObj.Token ?? "",
        Id: txnObj.Id,
        Type: txnObj.Type,
      });
    });
    // media streaming
    const nowInS = Math.floor(Date.now() / 1000);
    userMediaStreamings.forEach(streamingObj => {
      if (streamingObj.StartingDate >= Date.now()) {
        const amountPerSec = streamingObj.AmountPerPeriod ?? 0 / streamingObj.Frequency ?? 1;
        const diffInS = Math.min(
          nowInS - streamingObj.StartingDate,
          streamingObj.EndingDate - streamingObj.StartingDate
        );
        const amount = diffInS * amountPerSec;
        newAllTransactions.push({
          MediaName: "-",
          To: user.address && user.address.length > 10 ? user.address.substring(0, 10) + "..." : "",
          Date: streamingObj.StartingDate * 1000,
          DateString: formatDate(streamingObj.StartingDate * 1000),
          Amount: amount,
          Price: amountPerSec + "/s",
          Token: streamingObj.StreamingToken ?? "",
          Type: "Streaming",
        });
      }
    });
    // sort by date
    newAllTransactions = newAllTransactions.sort((a, b) => b.Date - a.Date);
    setAllTransactions(newAllTransactions);
  }, [transactions, userMediaStreamings, userMedias]);

  // change month list according to txns
  useEffect(() => {
    if (allTransactions.length > 0) {
      const newMonthList: string[] = [];
      // get first month
      const firstTimestamp = allTransactions[allTransactions.length - 1].Date;
      const firstDate = new Date(firstTimestamp);
      const lastTimestamp = allTransactions[0].Date;
      if (firstTimestamp && lastTimestamp) {
        let currDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
        let currTimestamp = currDate.getTime();
        while (currTimestamp < lastTimestamp) {
          newMonthList.push(`${getMonthName(currDate.getMonth())} ${currDate.getFullYear()}`);
          currDate = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1);
          currTimestamp = currDate.getTime();
        }
      }
      setMonthsList(newMonthList);
      if (newMonthList.length > 0) {
        setSalesMonth(newMonthList[0]);
        setEarnMonth(newMonthList[0]);
      }
    }
  }, [allTransactions]);

  // update graph according to month selection and currency
  useEffect(() => {
    const saleMonthIndex = monthsList.findIndex(eM => eM == salesMonth);
    const saleMonthTimestamp = Date.parse(salesMonth);
    if (saleMonthIndex != -1) {
      const nextEarnMonthTimestamp =
        saleMonthIndex == monthsList.length - 1 ? Infinity : Date.parse(monthsList[saleMonthIndex + 1]);
      // create accumulator for each day of the month
      const dayAccumulator: number[] = [];
      const saleMonthDate = new Date(saleMonthTimestamp);
      const lastDayOfMonthDate = new Date(saleMonthDate.getFullYear(), saleMonthDate.getMonth() + 1, 0);
      const lastDay = lastDayOfMonthDate.getDate();
      for (let i = 0; i < lastDay; i++) dayAccumulator.push(0);
      // accumulate day value
      allTransactions.forEach(txnObj => {
        const txnTimestamp = txnObj.Date;
        if (txnTimestamp && txnTimestamp >= saleMonthTimestamp && txnTimestamp <= nextEarnMonthTimestamp) {
          const txnDateObj = new Date(txnTimestamp);
          const date = txnDateObj.getDate();
          if (date < dayAccumulator.length) {
            const rate = rateOfChange[txnObj.Token] ?? 1;
            const ethRate = salesCurrency == "ETH" ? rateOfChange["ETH"] : 1;
            dayAccumulator[date - 1] += (txnObj.Amount * rate) / ethRate;
          }
        }
      });
      // set graph data
      const graphData: any[] = [];
      dayAccumulator.forEach((val, index) => {
        const currDate = new Date(saleMonthDate.getFullYear(), saleMonthDate.getMonth(), index + 1);
        graphData.push({
          x: currDate,
          y: val,
        });
      });
      const formattedGraphData = graphData.slice(-30);
      const labels = formattedGraphData.map(point =>
        new Date(point.x).toLocaleString("eu", {
          day: "numeric",
          month: "numeric",
        })
      );
      const newEarningChart = { ...earningsChart };
      newEarningChart.config.data.labels = labels;
      newEarningChart.config.data.datasets[0].data = formattedGraphData;
      setEarningsChart(newEarningChart);
    }
  }, [salesCurrency, salesMonth, allTransactions]);

  // change txn history when sale month changed
  useEffect(() => {
    const saleMonthIndex = monthsList.findIndex(eM => eM == salesMonth);
    const saleMonthTimestamp = Date.parse(salesMonth);
    if (saleMonthIndex != -1) {
      const nextEarnMonthTimestamp =
        saleMonthIndex == monthsList.length - 1 ? Infinity : Date.parse(monthsList[saleMonthIndex + 1]);
      const newSalesHistory: any[] = [];
      allTransactions.forEach(txnObj => {
        const date = txnObj.Date;
        if (date && date >= saleMonthTimestamp && date <= nextEarnMonthTimestamp) {
          newSalesHistory.push(txnObj);
        }
      });
      setSalesHistory(newSalesHistory);
    }
  }, [salesMonth, allTransactions, userMedias]);

  // change earnValue accordingly
  useEffect(() => {
    const earnMonthIndex = monthsList.findIndex(eM => eM == earnMonth);
    const earnMonthTimestamp = Date.parse(earnMonth);
    if (earnMonthIndex != -1) {
      const nextEarnMonthTimestamp =
        earnMonthIndex == monthsList.length - 1 ? Infinity : Date.parse(monthsList[earnMonthIndex + 1]);
      let newEarnVal = 0;
      allTransactions.forEach(txnObj => {
        const date = txnObj.Date;
        if (date && date >= earnMonthTimestamp && date <= nextEarnMonthTimestamp) {
          const amount = txnObj.Amount ?? 0;
          const token = txnObj.Token ?? "";
          const rate = rateOfChange[token] ?? 1;
          newEarnVal += amount * rate; // usd
        }
      });
      if (earnCurrency == "ETH") newEarnVal = newEarnVal / rateOfChange["ETH"]; // eth
      setEarnValue(newEarnVal);
    }
  }, [earnCurrency, earnMonth, allTransactions]);

  // change type data when user medias changed
  useEffect(() => {
    // filter by given interval
    const now = Date.now();
    let minTimestamp = 0;
    switch (mediasInterval) {
      case intervals[0]: // one week behind
        minTimestamp = now - 1000 * 3600 * 24 * 7;
        break;
      case intervals[1]:
        minTimestamp = now - 1000 * 3600 * 24 * 30;
        break;
      case intervals[2]:
        minTimestamp = now - 1000 * 3600 * 24 * 365;
        break;
    }
    minTimestamp /= 1000; // to sec
    const filteredUserMedias = userMedias.filter(media => media.ReleaseDate >= minTimestamp); // filter medias by interval

    // calculate total and typesData
    let totalCreated = 0;
    const mediaSold = {};
    const mediaTypes = {};
    filteredUserMedias.forEach(media => {
      mediaSold[media.MediaSymbol] = false;
      const type = media.Type;
      if (type) {
        totalCreated++;
        if (!mediaTypes[type]) mediaTypes[type] = 1;
        else mediaTypes[type]++;
      }
    });
    const newTypesData: any[] = [];
    let type: any = "";
    let total: any = 0;
    for ([type, total] of Object.entries(mediaTypes)) {
      newTypesData.push({
        type: type,
        total: total,
      });
    }
    // calculate sold ones
    let totalSold = 0;
    allTransactions.forEach(txn => {
      // TODO: include more sell types
      if (txn.Date > minTimestamp && txn.Type.toLowerCase().includes("sell-to")) {
        if (mediaSold[txn.Token] != undefined) mediaSold[txn.Token] = true;
      }
    });
    for (let sold of Object.values(mediaSold)) if (sold) totalSold++;
    setTypesData(newTypesData);
    setTotalMedias(totalCreated);
    setSoldMedias(totalSold);
  }, [userMedias, allTransactions, mediasInterval]);

  const tableHeaders: Array<CustomTableHeaderInfo> = [{
      headerName: "Media",
      headerWidth: "80px"
    }, {
      headerName: "DATE"
    }, {
      headerName: "TO"
    }, {
      headerName: "QUANTITY",
      headerAlign: "right",
    }, {
      headerName: "PRICE",
      headerAlign: "right",
    }, {
      headerName: "TOKEN",
      headerAlign: "center",
    }, {
      headerName: "PRIVISCAN",
      headerAlign: "center",
    }
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (salesHistory && salesHistory.length) {
      data = salesHistory.map((row) => {
        return [{
          cell: (
            <div style={{
                fontWeight: "bold",
                minWidth: 80,
                width: 80,
              }}
            >
              {row.MediaName}
            </div>
          )
        }, {
          cell: row.DateString
        }, {
          cell: truncate(row.To, 10)
        }, {
          cell: row.Amount,
          cellAlign: "right",
        }, {
          cell: row.Price,
          cellAlign: "right",
        }, {
          cell: row.Token,
          cellAlign: "center",
        }, {
          cell: (
            row.Id ? (
              <a
                className="bridge_text"
                target="_blank"
                rel="noopener noreferrer"
                href={"https://priviscan.io/tx/" + row.Id}
              >
                <img src={require("assets/icons/newScreen.svg")} alt="link" />
              </a>
            ) : null
          ),
          cellAlign: "center",
        }];
      });
    }

    setTableData(data);
  }, [salesHistory]);

  return (
    <div className="my-earnings">
      <div className="backButton" onClick={() => history.goBack()}>
        <ChevronIconLeft />
        Back
      </div>
      <div className={"page-title"}>
        <h2>
          <span>{`My wallets /`}</span>
          <b>{`My earnings`}</b>
        </h2>
      </div>
      <div className={"content"}>
        <div className={"row"}>
          {/*---- TOP LEFT CONTENT BOX ----*/}
          <div className={"content-box"}>
            <div className={"header"}>
              <h5>Monthly earn</h5>
            </div>
            <LoadingWrapper
              loading={
                transactions.length === 0 || isMediaLoading || isMediaStreamingLoading || isRateLoading
              }
            >
              <>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Box width={1}>
                    <FormControl className={styles.formControl}>
                      <RadioGroup
                        className={styles.radioGroup}
                        value={earnCurrency}
                        onChange={e => setEarnCurrency(e.target.value as string)}
                      >
                        <FormControlLabel value="ETH" control={<Radio />} label="ETH" />
                        <FormControlLabel value="USD" control={<Radio />} label="USD" />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                  {monthsList && monthsList.length > 0 ? (
                    <Box>
                      <FormControl className={`${styles.select} ${styles.formControl}`}>
                        <Select value={earnMonth} onChange={e => setEarnMonth(e.target.value as string)}>
                          {monthsList.map((month, index) => (
                            <MenuItem key={`select-month-${index}`} value={month}>
                              {month}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  ) : null}
                </Box>
                <Box display="flex" flexDirection="row" justifyContent="flex-end" my={2}>
                  <Text size={43}>{formatNumber(earnValue, earnCurrency, 4)}</Text>
                </Box>
                <Box mt={2}>
                  <Text color="black">Contribute To A Community</Text>
                </Box>
                <Box mt={2} mb={3}>
                  <Text>
                    Show your appreciation! You can share part of your earnings with a community of your
                    choice.
                  </Text>
                </Box>
                <Button onClick={handleOpenContribution}>Send Contribution</Button>
              </>
            </LoadingWrapper>
          </div>
          {/*---- TOP RIGHT CONTENT BOX ----*/}
          <div className={"content-box"}>
            <div className={"header"}>
              <h5>Sales – Historic</h5>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box width={1}>
                  <FormControl className={styles.formControl}>
                    <RadioGroup
                      className={styles.radioGroup}
                      value={salesCurrency}
                      onChange={e => setSalesCurrency(e.target.value as string)}
                    >
                      <Box display="flex" flexDirection="row" alignItems="center">
                        <Box width={1}>
                          <FormControlLabel value="ETH" control={<Radio />} label="ETH" />
                        </Box>
                        <Box width={1}>
                          <FormControlLabel value="USD" control={<Radio />} label="USD" />
                        </Box>
                      </Box>
                    </RadioGroup>
                  </FormControl>
                </Box>
                <Box width={1}>
                  <FormControl className={`${styles.select} ${styles.formControl}`}>
                    <Select value={salesMonth} onChange={e => setSalesMonth(e.target.value as string)}>
                      {monthsList.map((month, index) => (
                        <MenuItem key={`select-month-${index}`} value={month}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </div>
            <LoadingWrapper loading={!earningsChart}>{PrintEarningsChart(earningsChart)}</LoadingWrapper>
          </div>
        </div>
        <div className={"row"} style={{ marginBottom: 15, paddingBottom: 20 }}>
          {/*---- BOTTOM LEFT CONTENT BOX ----*/}
          <div className={"content-box"}>
            <div className={"header"}>
              <h5>All my media sold</h5>
              <StyledSelect
                disableUnderline
                value={mediasInterval}
                onChange={e => setMediasInterval(e.target.value as string)}
              >
                {intervals.map(month => (
                  <StyledMenuItem key={month} value={month}>
                    {month}
                  </StyledMenuItem>
                ))}
              </StyledSelect>
            </div>
            <h6>AMOUNT</h6>
            {totalMedias > 0 && (
              <div className={"labels"}>
                <label></label>
                <label>
                  {soldMedias}
                  <span>sold</span>
                </label>
                <label>
                  {totalMedias}
                  <span>total contents</span>
                </label>
              </div>
            )}
            {totalMedias > 0 ? (
              <div className={"bar-container"}>
                <div
                  className="color-bar"
                  style={{
                    width: `${(soldMedias / totalMedias) * 100}%`,
                  }}
                />
                <div className="pointer" />
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>No data available</div>
            )}
            <h6>TYPE</h6>
            {typesData.length > 0 ? (
              <PrintTypeGraph typesData={typesData} />
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>No data available</div>
            )}
          </div>
          {/*---- BOTTOM RIGHT CONTENT BOX ----*/}
          <div className={"content-box"}>
            <div className={"header"}>
              <h5>Sales history</h5>
            </div>
            <LoadingWrapper loading={transactions.length === 0 || isMediaLoading}>
              <div className={"table"}>
                <CustomTable
                  headers={tableHeaders}
                  rows={tableData}
                  placeholderText="No data available"
                />
              </div>
            </LoadingWrapper>
          </div>
        </div>
      </div>
      <SendContribution open={openContribution} handleClose={handleCloseContribution} />
    </div>
  );
};

export default MyEarnings;
