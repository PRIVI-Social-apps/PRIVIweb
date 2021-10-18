import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";
import PrintClaimablePodChart from "../Chart/ClaimablePodChart";
import ClaimablePodChartConfig from "../Chart/ClaimablePodChartConfig";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { Gradient } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Box from 'shared/ui-kit/Box';

const useStyles = makeStyles(() =>
  createStyles({
    statsContent: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },

    graphs: {
      display: "flex",
      width: "100%",
      marginBottom: "78px",
      "& > div": {
        width: "50%",
        "&:first-child": {
          marginRight: "40px",
        },
      },
    },

    table: {
      "& img": {
        width: "16px",
        height: "16px",
      },
    },
    address: {
      background: Gradient.Mint,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    userSlug: {
      marginTop: "2px",
      background: Gradient.Magenta,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    userImage: {
      border: "2px solid #FFFFFF",
      width: "48px",
      height: "48px",
      minHeight: "48px",
      minWidth: "48px",
      borderRadius: "24px",
      marginRight: "18px",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
  })
);

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/*const transactionsMock = [
  {
    Date: new Date().getTime() - 10000,
    From: "0x0ea6451b47fdb705dc52316b40e99b8a871b165d",
    Played: 116,
    Revenue: 1.23,
    Id: "",
  },
  {
    Date: new Date().getTime(),
    From: "0x964DE4135F6D8079D4e23048b887317547C7deBF",
    Played: 46,
    Revenue: 1.23,
    Id: "",
  },
  {
    Date: new Date().getTime() - 52000000,
    From: "0x9eba16f9c9e6f98246968ac575e3837c00a596c2",
    Played: 526,
    Revenue: 1.23,
    Id: "",
  },
  {
    Date: new Date().getTime() - 20000000,
    From: "0x04f32a8eb65d2559c631eb964adc6fa23a13778a",
    Played: 1547,
    Revenue: 1.23,
    Id: "",
  },
];*/

export default function Stats({ pod, trigger, refreshPod }) {
  const classes = useStyles();

  const usersList = useSelector((state: RootState) => state.usersInfoList);

  const [reproductionsData, setReproductionsData] = useState<any>(ClaimablePodChartConfig(undefined));
  const [fundsRaisedData, setFundsRaisedData] = useState<any>(ClaimablePodChartConfig("pUSD"));

  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);

  useEffect(() => {
    //TODO: get history
    if (usersList && usersList.length > 0) {
      const history = [...transactionHistory];
      history.forEach((txn, index) => {
        history[index].from = txn.From === "" ? "0x0000000000000000000000000000000000000000" : txn.From;

        history[index].from = usersList.find(u => u.address === txn.From);
        history[index].randomAvatar = require(`assets/anonAvatars/ToyFaces_Colored_BG_${Math.floor(
          Math.random() * 118 + 1
        )
          .toString()
          .padStart(3, "0")}.jpg`);

        let dateNum = txn.Date < 16148612430 ? Number(`${txn.Date}000`) : txn.Date;

        history[index].date = `${days[new Date(dateNum).getDay()]}, ${new Date(dateNum).getDate()} ${
          months[new Date(dateNum).getMonth()]
        }`;

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

        history[index].time = `${hours}:${mins} ${
          new Date(dateNum).getHours() >= 12 && new Date(dateNum).getHours() < 0 ? "PM" : "AM"
        }`;

        let playedHours = Math.floor(txn.Played / 3600);
        let playedMinutes = Math.floor((playedHours > 0 ? txn.Played - playedHours : txn.Played) / 60);
        let playedSeconds = (txn.Played - playedMinutes * 60).toFixed(0);

        history[index].playedTime = `${playedHours > 0 ? `${playedHours}h` : ""} ${
          playedMinutes > 0 ? `${playedMinutes}m` : ""
        } ${playedSeconds}s`;
      });

      history.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());

      setTransactionHistory(history);
    }
  }, [usersList]);

  const tableHeaders: Array<CustomTableHeaderInfo> = [{
      headerName: "USER"
    }, {
      headerName: "ADDRESS"
    }, {
      headerName: "DATE"
    }, {
      headerName: "TIME"
    }, {
      headerName: "PLAYED TIME"
    }, {
      headerName: "REVENUE",
      headerAlign: "center",
    }, {
      headerName: "PRIVISCAN",
      headerAlign: "center",
    }
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (transactionHistory && transactionHistory.length) {
      data = transactionHistory.map((txn) => {
        return [{
          cell: (
            <Box display="flex" alignItems="center">
              <div
                className={classes.userImage}
                style={{
                  backgroundImage:
                    txn.from && txn.from.imageURL && txn.from.imageURL.length > 0
                      ? `url(${txn.from.imageURL})`
                      : txn.randomAvatar
                      ? `url(${txn.randomAvatar})`
                      : "none",
                }}
              />
              <Box display="flex" flexDirection="column">
                <Box color="#181818">
                  {txn.from && txn.from.firstName ? txn.from.firstName : "User"}
                </Box>
                <div className={classes.userSlug}>
                  @{txn.from && txn.from.urlSlug ? txn.from.urlSlug : "User"}
                </div>
              </Box>
            </Box>
          )
        }, {
          cell: (
            txn.from && txn.from.address
              ? txn.from.address.length > 12
                ? `${txn.from.address.slice(0, 6)}...${txn.from.address.slice(
                    txn.from.address.length - 7,
                    txn.from.address.length - 1
                  )}`
                : txn.from.address
              : txn.From
              ? txn.From.length > 12
                ? `${txn.From.slice(0, 6)}...${txn.From.slice(
                    txn.From.length - 7,
                    txn.From.length - 1
                  )}`
                : txn.From
              : "N/A"
          )
        }, {
          cell: txn.date ?? "N/A",
        }, {
          cell: txn.time ?? "N/A",
        }, {
          cell: txn.playedTime ?? "N/A",
        }, {
          cell: `${txn.Token ?? "ETH"} ${txn.Revenue ?? "N/A"}`,
          cellAlign: "center",
        }, {
          cell: (
            <a
              className="bridge_text"
              target="_blank"
              rel="noopener noreferrer"
              href={"https://priviscan.io/tx/" + txn.Id}
            >
              <img src={require("assets/icons/newScreen_black.svg")} alt="link" style={{width: "16px", height: "16px"}} />
            </a>
          ),
          cellAlign: "center",
        }];
      });
    }

    setTableData(data);
  }, [transactionHistory]);

  return (
    <div className={classes.statsContent}>
      <div className={classes.graphs}>
        {PrintClaimablePodChart(reproductionsData, pod.reproductions, undefined, "Reproductions")}
        {PrintClaimablePodChart(fundsRaisedData, pod.fundsRaised, "pUSD", "Funds Raised")}
      </div>

      <CustomTable
        headers={tableHeaders}
        rows={tableData}
        placeholderText="No transaction history to show"
      />
    </div>
  );
}
