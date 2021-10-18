import React, { useEffect, useState } from 'react';
import { getStyledTime } from 'shared/functions/getStyledTime';
import { useTypedSelector } from 'store/reducers/Reducer';
//import BidAuctionModal from '../modals/BidAuctionModal';
import './AuctionCard.css';

export default function AuctionCard(props) {
  const user = useTypedSelector((state) => state.user);

  const [bid, setBid] = useState<any>({ Amount: '' });

  const [time, setTime] = useState<string>('');
  const [width, setWidth] = useState<number>(0);

  const [openBid, setOpenBid] = useState<boolean>(false);

  const handleOpenBid = () => {
    setOpenBid(true);
  };

  const handleCloseBid = () => {
    setOpenBid(false);
  };

  useEffect(() => {
    //get date
    if (props.auction.DateDue) {
      setTime(
        getStyledTime(
          new Date().getTime(),
          new Date(props.auction.DateDue).getTime(),
          false
        )
      );
      //and bar width
      if (props.auction.CreationDate) {
        setWidth(
          new Date(props.auction.DateDue).getTime() -
            new Date().getTime() / new Date(props.auction.DateDue).getTime() -
            new Date(props.auction.CreationDate).getTime()
        );
      }
    }

    //get bids
    if (props.auction.Bids && props.auction.Bids.length > 0) {
      props.auction.Bids.forEach((b) => {
        if (b.User === user.id) {
          setBid(b);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="acution-card">
      <div
        className="image"
        style={{
          backgroundImage:
            props.auction.AuctionImageURL.length > 0
              ? `url(${props.auction.AuctionImageURL})`
              : 'none',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="card-content">
        <div className="row">
          <p>{props.auction.Item}</p>
          <button onClick={handleOpenBid}>Bid Again</button>
          {/*<BidAuctionModal
            auction={props.auction}
            open={openBid}
            handleClose={handleCloseBid}
          />*/}
        </div>
        <div className="bottom">
          <div className="row">
            <div className="column">
              <span>Price</span>
              <p>{`${props.auction.MinimumPrice} PRIVI`}</p>
            </div>
            <div className="column">
              <span>Your Bid</span>
              <p>{bid.Amount}</p>
            </div>
            <div className="column">
              <span>Time left</span>
              <p>{time}</p>
            </div>
          </div>
          <div className="bar-container">
            <div className="color-bar" style={{ width: `${width}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
