import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableRow, AppBar } from "@material-ui/core";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import { format } from "date-fns";
import { PrimaryButton, SecondaryButton, Modal, grid, Divider, Header3, TabNavigation } from "shared/ui-kit";
import TabPanel from "shared/ui-kit/Page-components/TabPanel";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import MainPageContext from "components/legacy/Media/context";
import styles from "./index.module.scss";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CalendarToday } from "assets/icons/calendar-regular.svg";
import { ReactComponent as QueryBuilder } from "assets/icons/clock-regular.svg";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";

const Plot = createPlotlyComponent(Plotly);

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      fontFamily: "Agrandir",
      fontSize: "16px",
      color: "#000",
      backgroundColor: "#fff",
      border: "none",
      fontWeight: 400,
      width: "100/6%",
    },
    body: {
      fontSize: "14px",
      fontFamily: "Agrandir",
      border: "none",
      color: "#656E7E",
    },
  })
)(TableCell);

const offers = [
  {
    UserId: "1",
    ImageUrl: "/static/media/ToyFaces_Colored_BG_111.3261520d.jpg",
    Name: "Alejo Acosta",
    Price: "1.256",
    Wallet: "ETH",
    Date: "April 23, 2021",
    Time: "12:09pm",
  },
  {
    UserId: "1",
    ImageUrl: "/static/media/ToyFaces_Colored_BG_111.3261520d.jpg",
    Name: "Alejo Acosta",
    Price: "1.256",
    Wallet: "ETH",
    Date: "April 23, 2021",
    Time: "12:09pm",
  },
];

type PlaceBidDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  makeOffer: () => void;
  media?: any;
};

export const OfferTable = offers => {
  const { offers: data } = offers;
  const usersList = useSelector((state: RootState) => state.usersInfoList);
  const getUserInfo = (address: string) => usersList.find(u => u.address === address);

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "From",
      headerWidth: "35%",
    }, {
      headerName: "Price",
      headerWidth: "20%",
    }, {
      headerName: "Date",
      headerWidth: "25%",
    }, {
      headerName: "Time",
      headerWidth: "20%",
    },
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    let rows: Array<Array<CustomTableCellInfo>> = [];
    if (data && data.length) {
      rows = data.map((row) => {
        return [{
          cell: (
            <div style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              padding: "9px 0",
            }}>
              <a href={`/profile/${getUserInfo(row.bidderAddress)?.id}`} style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "#23d0c6",
              }}>
                <img src={getUserInfo(row.bidderAddress)?.imageUrl} alt="user avatar" style={{
                  width: "32px",
                  height: "32px",
                  marginRight: "15px",
                  borderRadius: "50%"
                }}/>
                {getUserInfo(row.bidderAddress)?.name}
              </a>
            </div>
          ),
        }, {
          cell: row.price
        }, {
          cell: format(new Date(row.date), "MMMM dd, yyyy")
        }, {
          cell: format(new Date(row.date), "p")
        }];
      });
    }

    setTableData(rows);
  }, [data]);

  return (
    <CustomTable
      headers={tableHeaders}
      rows={tableData}
      placeholderText="No members"
    />
  );
};

export const PlaceBidDetailModal: React.FunctionComponent<PlaceBidDetailModalProps> = ({
  isOpen,
  onClose,
  makeOffer,
  media = null
}) => {
  const [tabsValue, setTabsValue] = useState<number>(0);
  const { convertTokenToUSD } = useTokenConversion();
  let { selectedMedia } = React.useContext(MainPageContext);
  let isFromMainPage = true;
  if (!selectedMedia) {
    selectedMedia = media; // coming from auction individual page
    isFromMainPage = false;
  }
  const user = useSelector((state: RootState) => state.user);
  const history = useHistory();
  const [timeFrame, setTimeFrame] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!selectedMedia || !selectedMedia.Auctions) return null;
      const currentDate = new Date().getTime() / 1000;
      const diff = auctions.EndTime >= currentDate ? auctions.EndTime - currentDate : 0;
      setTimeFrame({
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        mins: Math.floor(((diff % 86400) % 3600) / 60),
        secs: Math.floor(((diff % 86400) % 3600) % 60),
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!selectedMedia || !selectedMedia.Auctions || !user) return null;
  const auctions = selectedMedia.Auctions;
  const bidHistory = selectedMedia.BidHistory || [];
  const isOwner = selectedMedia.Auctions.Owner === user.address;

  const getTopBidPrice = () => {
    if (bidHistory.length === 0) return "N/A";
    return Math.max(...bidHistory.map(history => parseInt(history.price)));
  };

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
    history.push(`/media/auctions/${selectedMedia.MediaSymbol}`);
  }

  const topBidPrice = getTopBidPrice();
  const tabOptions = ["Auction Info", "Price History", "Ownership History", "Proof of authenticity"];

  return (
    <Modal size="medium" isOpen={isOpen} onClose={onClose} showCloseIcon>
      <ModalHeader>
        <div className={styles.title}>Details</div>
      </ModalHeader>
      <div className={styles.appbar}>
        <TabNavigation
          tabs={tabOptions}
          currentTab={tabsValue}
          variant="primary"
          onTabChange={setTabsValue}
        />
      </div>

      <TabPanel value={tabsValue} index={0}>
        <div className={styles.auctionInfo}>
          <div className={styles.bidStatus}>
            <div className={styles.topBid}>
              <div className={styles.auctionTitle}>🤑 Initial price</div>
              <span>{`${auctions.TokenSymbol} ${auctions.ReservePrice}`}</span>
              <div className={styles.hint}>
                ${convertTokenToUSD(auctions.TokenSymbol, auctions.ReservePrice)}
              </div>
            </div>
            <div className={styles.topBid}>
              <div className={styles.auctionTitle}>🔥 Top bid</div>
              <span>{`${auctions.TokenSymbol} ${topBidPrice}`}</span>
              {topBidPrice !== "N/A" && (
                <div className={styles.hint}>${convertTokenToUSD(auctions.TokenSymbol, topBidPrice)}</div>
              )}
            </div>
            <div className={styles.auctionEnding}>
              <div className={styles.auctionTitle}>⏳ Auction Ending In</div>
              <div className={styles.auctionDateCount}>
                <div>
                  <span>{String(timeFrame.days).padStart(2, "0")}</span>
                  <div className={styles.hint}>Days</div>
                </div>
                <div>
                  <span>{String(timeFrame.hours).padStart(2, "0")}</span>
                  <div className={styles.hint}>Hours</div>
                </div>
                <div>
                  <span>{String(timeFrame.mins).padStart(2, "0")}</span>
                  <div className={styles.hint}>Minutes</div>
                </div>
                <div>
                  <span>{String(timeFrame.secs).padStart(2, "0")}</span>
                  <div className={styles.hint}>Seconds</div>
                </div>
              </div>
            </div>
          </div>
          <hr className={styles.dividerDashed} />
          <div className={styles.biddingToken}>
            <img
              className={styles.tokenImage}
              src={require(`assets/tokenImages/${auctions.TokenSymbol}.png`)}
              alt="Etherum"
            />
            {`Bidding token is ${auctions.TokenSymbol}`}
          </div>
          <hr className={styles.dividerDashed} />
          <div className={styles.auctionDates}>
            <div>
              <SvgIcon><CalendarToday /></SvgIcon>
              {`Started ${getDateDiff(auctions.StartTime)} ago (${format(
                new Date(auctions.StartTime * 1000),
                "PPpp"
              )})`}
            </div>
            <div>
              <SvgIcon><QueryBuilder /></SvgIcon>
              {`Ends in ${getDateDiff(auctions.EndTime)} (${format(
                new Date(auctions.EndTime * 1000),
                "PPpp"
              )})`}
            </div>
          </div>

          <Divider />
          <div className={styles.offers}>
            <p className={styles.offerTitle}>
              <span role="img" aria-label="total offers">
                👋{" "}
              </span>
              {`Total offers: ${bidHistory.length}`}
            </p>
            <OfferTable offers={bidHistory} />
          </div>
        </div>
      </TabPanel>

      <TabPanel value={tabsValue} index={1}>
        <Plot graphDiv="graph" className="plot" style={{}} />
      </TabPanel>

      <TabPanel value={tabsValue} index={2}>
        Ownership History
      </TabPanel>

      <TabPanel value={tabsValue} index={3}>
        Proof of authenticity
      </TabPanel>

      <div className={styles.actions}>
        <SecondaryButton size="medium" onClick={onClose}>
          Cancel
        </SecondaryButton>
        <div>
          {isFromMainPage ?
            <SecondaryButton size="medium" onClick={gotoAuctionPage}>
              Auction Page
            </SecondaryButton> : null
          }
          {!isOwner && <PrimaryButton size="medium" onClick={makeOffer}>
            Make Offer
          </PrimaryButton>}
        </div>
      </div>
    </Modal>
  );
};

const ModalHeader = styled(Header3)`
  margin-bottom: ${grid(3)};
`;
