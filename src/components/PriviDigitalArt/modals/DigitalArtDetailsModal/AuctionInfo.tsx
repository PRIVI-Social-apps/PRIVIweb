import * as React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "date-fns";

import { useStyles } from "./index.styles";
import {
  Avatar,
  FontSize,
  Header4,
  PrimaryButton,
  SecondaryButton,
  StyledDivider,
  Text,
} from "shared/ui-kit";
import { RootState } from "store/reducers/Reducer";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Box from 'shared/ui-kit/Box';

const Info = [
  { From: "Some_user", Price: "ETH 1.256", Date: "April 23, 2021", Time: "12:09pm" },
  { From: "Some_user", Price: "ETH 1.256", Date: "April 23, 2021", Time: "12:09pm" },
  { From: "Some_user", Price: "ETH 1.256", Date: "April 23, 2021", Time: "12:09pm" },
  { From: "Some_user", Price: "ETH 1.256", Date: "April 23, 2021", Time: "12:09pm" },
  { From: "Some_user", Price: "ETH 1.256", Date: "April 23, 2021", Time: "12:09pm" },
];

export const OfferTable = ({ offers }) => {
  const classes = useStyles();
  const usersList = useSelector((state: RootState) => state.usersInfoList);
  const getUserInfo = (address: string) => usersList.find(u => u.address === address);

  const tableHeaders: Array<CustomTableHeaderInfo> = [{
      headerName: "FROM"
    }, {
      headerName: "PRICE"
    }, {
      headerName: "DATE"
    }, {
      headerName: "TIME"
    }
  ];
  const [tableData, setTableData] = React.useState<Array<Array<CustomTableCellInfo>>>([]);
  React.useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (offers && offers.length) {
      data = offers.map((row) => {
        return [{
          cell: (
            <Box display="flex" flexDirection="row" alignItems="center">
              <Avatar size="medium" url={getUserInfo(row.bidderAddress)?.imageUrl || ""} />
              <Text ml={1.5}>{getUserInfo(row.bidderAddress)?.name}</Text>
            </Box>
          )
        }, {
          cell: row.price
        }, {
          cell: format(new Date(row.date), "MMMM dd, yyyy")
        }, {
          cell: format(new Date(row.date), "p")
        }];
      });
    }

    setTableData(data);
  }, [offers]);

  return (
    <div className={classes.table}>
      <CustomTable
        headers={tableHeaders}
        rows={tableData}
        placeholderText="No auctions"
      />
    </div>
  );
};

const AuctionInfo = ({ media }) => {
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);
  const classes = useStyles();
  const [auctionEnded, setAuctionEnded] = React.useState<boolean>(false);
  const { convertTokenToUSD } = useTokenConversion();
  const [timeFrame, setTimeFrame] = React.useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!media || !media.Auctions) return null;
      const currentDate = new Date().getTime() / 1000;
      const diff = media.Auctions.EndTime >= currentDate ? media.Auctions.EndTime - currentDate : 0;
      setTimeFrame({
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        mins: Math.floor(((diff % 86400) % 3600) / 60),
        secs: Math.floor(((diff % 86400) % 3600) % 60),
      });
      if (diff === 0) {
        setAuctionEnded(true);
        clearInterval(interval);
      } else {
        setAuctionEnded(false);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [media]);

  const auctions = media.Auctions;
  const bidHistory = media.BidHistory || [];
  const isOwner = media.Auctions.Owner === user.address;

  const getDateDiff = (time: number) => {
    const currentDate = new Date().getTime() / 1000;
    const diff = currentDate >= time ? currentDate - time : time - currentDate;
    const days = Math.floor(diff / 86400);
    if (days > 0) return `${days} day${days > 1 ? "s" : ""}.`;
    const hours = Math.floor((diff % 86400) / 3600);
    if (hours > 0) return `${hours} hr${hours > 1 ? "s" : ""}.`;
    const mins = Math.floor(((diff % 86400) % 3600) / 60);
    if (mins > 0) return `${mins} min${mins > 1 ? "s" : ""}.`;
    const secs = Math.floor(((diff % 86400) % 3600) % 60);
    if (secs > 0) return `${secs} sec${secs > 1 ? "s" : ""}.`;
    return "Just Now";
  };

  const gotoAuctionPage = () => {
    history.push(`/media/auctions/${media.MediaSymbol ?? media.id}`);
  };

  const topBidPrice = React.useMemo(() => {
    if (bidHistory.length === 0) return "N/A";
    return Math.max(...bidHistory.map(history => parseInt(history.price)));
  }, [bidHistory]);

  const tabOptions = ["Auction Info", "Price History", "Ownership History", "Proof of authenticity"];

  return (
    <div style={{minHeight: 400}}>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box display="flex" flexDirection="column">
          <Text mb={1}>🤑 Initial price</Text>
          <Header4 noMargin>{`${auctions.TokenSymbol} ${auctions.ReservePrice || 0}`}</Header4>
          <Text mt={1} size={FontSize.S}>
            ${convertTokenToUSD(auctions.TokenSymbol, auctions.ReservePrice || 0)}
          </Text>
        </Box>
        <Box display="flex" flexDirection="column">
          <Text mb={1}>🔥 Top bid</Text>
          <Header4 noMargin>{`${auctions.TokenSymbol} ${topBidPrice}`}</Header4>
          {topBidPrice !== "N/A" && (
            <Text mt={1} size={FontSize.S}>
              ${convertTokenToUSD(auctions.TokenSymbol, topBidPrice)}
            </Text>
          )}
        </Box>
        <Box display="flex" flexDirection="column">
          <Text mb={1}>⏳ {!auctionEnded ? "Auction Ending In" : "Auction Ended"}</Text>
          {!auctionEnded && (
            <Header4 noMargin>{`${String(timeFrame.days).padStart(2, "0")}d ${String(
              timeFrame.hours
            ).padStart(2, "0")}h ${String(timeFrame.mins).padStart(2, "0")}m ${String(
              timeFrame.secs
            ).padStart(2, "0")}s`}</Header4>
          )}
        </Box>
      </Box>
      <StyledDivider type="dashed" margin={3} />
      <Box display="flex" flexDirection="row" alignItems="center">
        <img
          src={require(`assets/tokenImages/${auctions.TokenSymbol}.png`)}
          width={18}
          height={18}
          alt="token"
        />
        <Text ml={1.5}>
          Bidding token is <b>{auctions.TokenSymbol}</b>
        </Text>
      </Box>
      <StyledDivider type="dashed" margin={3} />
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Box display="flex" flexDirection="row" alignItems="center">
          <img src={require("assets/icons/calendar_icon.png")} />
          <Text ml={1}>
            Started <b>{getDateDiff(auctions.StartTime)} ago</b> (
            {format(new Date(auctions.StartTime * 1000), "PPpp")})
          </Text>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          <img src={require("assets/icons/clock_gray.png")} />
          {auctionEnded ? (
            <Text ml={1}>Ended already</Text>
          ) : (
            <Text ml={1}>
              Ends in <b>{getDateDiff(auctions.EndTime)}</b> (
              {format(new Date(auctions.EndTime * 1000), "PPpp")})
            </Text>
          )}
        </Box>
      </Box>
      <StyledDivider type="solid" margin={3} />
      <Text size={FontSize.XL}>{`👋 Total offers: ${bidHistory.length}`}</Text>
      <OfferTable offers={bidHistory} />
      <Box mt={3} display="flex" flexDirection="row" justifyContent="space-between">
        <SecondaryButton size="medium" className={classes.transparentBtn}>Cancel</SecondaryButton>
        <SecondaryButton size="medium" className={classes.transparentBtn} onClick={gotoAuctionPage}>
          Auction Page
        </SecondaryButton>
        {!isOwner && <PrimaryButton size="medium" className={classes.primaryBtn}>Make offer</PrimaryButton>}
      </Box>
    </div>
  );
};

export default AuctionInfo;
