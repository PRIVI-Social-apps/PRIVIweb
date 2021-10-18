import React, { useState, useEffect } from 'react';
import './AuctionsList.css';
import { useTypedSelector } from 'store/reducers/Reducer';

//import AuctionModal from '../modals/AuctionModal';
//import BidAuctionModal from '../modals/BidAuctionModal';
import { getStyledTime } from 'shared/functions/getStyledTime';

export default function AuctionsList(props) {
  const user = useTypedSelector((state) => state.user);
  const [sortedList, setSortedList] = useState<any[]>([]);

  useEffect(() => {
    if (props.auctions && props.auctions.length > 0) {
      const allAuctions = [...props.auctions];

      const auctionsAuctioneer = [] as any[];
      const auctionsToBid = [] as any[];

      allAuctions.forEach((auction) => {
        if (auction.Auctioneer === user.id) {
          auctionsAuctioneer.push(auction);
        } else {
          auctionsToBid.push(auction);
        }
      });

      auctionsAuctioneer.sort((a, b) => b.EndDate - a.EndDate);
      auctionsToBid.sort((a, b) => b.EndDate - a.EndDate);

      const auctionsSorted = [...auctionsAuctioneer, ...auctionsToBid];

      setSortedList(auctionsSorted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.auctions]);

  if (sortedList.length > 0)
    return (
      <div className="list">
        <div className="header">
          <p className="name">TOKEN</p>
          <p>AMOUNT (PRIVI)</p>
          <p>BIDS</p>
          <p className="address">ADDRESS</p>
          <p>TIME REMAINING</p>
          <p></p>
        </div>
        <div className="body">
          {sortedList.map((row, index) => (
            <AuctionRow row={row} key={`${index}-exchange`} />
          ))}
        </div>
      </div>
    );
  else
    return (
      <div className="centered-info">
        <p>No auctions to show</p>
      </div>
    );
}

//index row as a separate component to open modals as individuals
const AuctionRow = (props) => {
  const user = useTypedSelector((state) => state.user);

  const [highestBid, setHighestBid] = useState<number>(0);

  const [time, setTime] = useState<string>('');

  const [openAuction, setOpenAuction] = useState<boolean>(false);
  const [openBid, setOpenBid] = useState<boolean>(false);

  const handleOpenAuction = () => {
    setOpenAuction(true);
  };

  const handleOpenBid = () => {
    setOpenBid(true);
  };

  const handleCloseAuction = () => {
    setOpenAuction(false);
  };

  const handleCloseBid = () => {
    setOpenBid(false);
  };

  useEffect(() => {
    //get date
    if (props.row.DateDue) {
      setTime(
        getStyledTime(
          new Date().getTime(),
          new Date(props.row.DateDue).getTime(),
          true
        )
      );
    }

    //set highest bid amount
    if (
      props.row.Auctioneer === user.id &&
      props.row.Bids &&
      props.row.Bids.length > 0
    ) {
      let highest = 0;
      props.row.Bids.forEach((bid) => {
        if (bid.Amount > highest) {
          highest = bid.Amount;
        }

        setHighestBid(highest);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className={props.row.Auctioneer === user.id ? 'auctioneer row' : 'row'}
      >
        <div className="name">
          <div
            className="image"
            style={{
              backgroundImage:
                props.row.AuctionImageURL.length > 0
                  ? `url(${props.row.AuctionImageURL})`
                  : 'none',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <p>{props.row.Item}</p>
        </div>

        <p>{props.row.Amount}</p>
        <p>{props.row.Bids ? props.row.Bids.length : 0}</p>
        <p className="address">{props.row.Address}</p>
        <p>{time}</p>
        <button
          onClick={
            props.row.Auctioneer === user.id ? handleOpenAuction : handleOpenBid
          }
        >
          {props.row.Auctioneer === user.id ? `${highestBid} PRIVI` : 'Bid'}
        </button>
        {/*<AuctionModal
          auction={props.row}
          open={openAuction}
          handleClose={handleCloseAuction}
        />
        <BidAuctionModal
          auction={props.row}
          open={openBid}
          handleClose={handleCloseBid}
        />*/}
      </div>
    </>
  );
};
