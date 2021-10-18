import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { placeBidModalStyles } from './index.styles';
import { PrimaryButton, SecondaryButton, Modal, grid, Divider, Header3 } from "shared/ui-kit";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";

type PlaceBidModalProps = {
  isOpen: boolean;
  onClose: () => void;
  placeBid: (price: number, topBidPrice: number | "N/A") => void;
  viewDetails: () => void;
  media?: any;
};

export const PlaceBidModal: React.FunctionComponent<PlaceBidModalProps> = ({
  isOpen,
  onClose,
  placeBid,
  viewDetails,
  media,
}) => {
  const classes = placeBidModalStyles();

  const [price, setPrice] = useState<number>(0);
  const [auctionEnded, setAuctionEnded] = useState<boolean>(false);
  const { convertTokenToUSD } = useTokenConversion();
  const [timeFrame, setTimeFrame] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  const handleChangePrice = event => {
    setPrice(event.target.value);
  };

  useEffect(() => {
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

  const topBidPrice = React.useMemo(() => {
    if (bidHistory.length === 0) return "N/A";
    return Math.max(...bidHistory.map((history: any) => parseInt(history.price)));
  }, [bidHistory]);

  return (
    <Modal size="small" isOpen={isOpen} onClose={onClose} showCloseIcon>
      <ModalHeader>
        <div className={classes.title}>Place a Bid</div>
      </ModalHeader>

      <p className={classes.priceLabel}>Price</p>
      <div className={classes.price}>
        <input value={price} onChange={handleChangePrice} className={classes.priceInput} type="number" />
        <img
          src={require(`assets/tokenImages/${auctions.TokenSymbol}.png`)}
          alt={auctions.TokenSymbol}
          width={24}
          height={24}
        />
        <span>{auctions.TokenSymbol}</span>
      </div>
      <p className={classes.hint}>${convertTokenToUSD(auctions.TokenSymbol, price)}</p>

      <hr className={classes.dividerDashed} />

      <div className={classes.bidStatus}>
        <div className={classes.topBid}>
          <div className={classes.auctionTitle}>
            <span role="img" aria-label="total offers">
              🔥{" "}
            </span>
            Top bid
          </div>
          <span>{`${auctions.TokenSymbol} ${topBidPrice}`}</span>
          {topBidPrice !== "N/A" && (
            <div className={classes.hint}>${convertTokenToUSD(auctions.TokenSymbol, topBidPrice)}</div>
          )}
        </div>
        <div className={classes.auctionEnding}>
          <div className={classes.auctionTitle}>
            <span role="img" aria-label="total offers">
              ⏳
            </span>{" "}
            {!auctionEnded ? "Auction Ending In" : "Auction Ended"}
          </div>
          {!auctionEnded && (
            <div className={classes.auctionDateCount}>
              <div>
                <span>{String(timeFrame.days).padStart(2, "0")}</span>
                <div className={classes.hint}>Days</div>
              </div>
              <div>
                <span>{String(timeFrame.hours).padStart(2, "0")}</span>
                <div className={classes.hint}>Hours</div>
              </div>
              <div>
                <span>{String(timeFrame.mins).padStart(2, "0")}</span>
                <div className={classes.hint}>Minutes</div>
              </div>
              <div>
                <span>{String(timeFrame.secs).padStart(2, "0")}</span>
                <div className={classes.hint}>Seconds</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Divider />
      <div className={classes.actions}>
        <SecondaryButton size="medium" className={classes.secondary} onClick={viewDetails}>
          View More Details
        </SecondaryButton>
        <PrimaryButton size="medium" className={classes.primary} onClick={() => placeBid(price, topBidPrice)}>
          Place A Bid
        </PrimaryButton>
      </div>
    </Modal>
  );
};

const ModalHeader = styled(Header3)`
  margin-bottom: ${grid(3)};
`;
