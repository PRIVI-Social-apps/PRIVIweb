import React, { useState } from "react";
import styled from "styled-components";

import { PrimaryButton, SecondaryButton, Modal, grid, Divider, Header3 } from "shared/ui-kit";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import MainPageContext from "components/legacy/Media/context";

import styles from "./index.module.scss";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

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
  media = null,
}) => {
  let { selectedMedia } = React.useContext(MainPageContext);
  if (!selectedMedia) selectedMedia = media;
  const [price, setPrice] = useState<number>(0);
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

  React.useEffect(() => {
    console.log({selectedMedia})
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
  }, [selectedMedia]);

  if (!selectedMedia || !selectedMedia.Auctions) return null;
  const auctions = selectedMedia.Auctions;
  const bidHistory = selectedMedia.BidHistory || [];

  const getTopBidPrice = () => {
    if (bidHistory.length === 0) return "N/A";
    return Math.max(...bidHistory.map(history => parseInt(history.price)));
  };

  const topBidPrice = getTopBidPrice();

  return (
    <Modal size="small" isOpen={isOpen} onClose={onClose} showCloseIcon>
      <ModalHeader>
        <div className={styles.title}>Details</div>
      </ModalHeader>

      <p className={styles.priceLabel}>Price</p>
      <div className={styles.price}>
        <InputWithLabelAndTooltip
          overriedClasses={styles.priceInput}
          type="number"
          inputValue={`${price}`}
          onInputValueChange={handleChangePrice}
        />
        <img
          src={require(`assets/tokenImages/${auctions.TokenSymbol}.png`)}
          alt={auctions.TokenSymbol}
          width={24}
          height={24}
        />
        <span>{auctions.TokenSymbol}</span>
      </div>
      <p className={styles.hint}>${convertTokenToUSD(auctions.TokenSymbol, price)}</p>

      <hr className={styles.dividerDashed} />

      <div className={styles.bidStatus}>
        <div className={styles.topBid}>
          <div className={styles.auctionTitle}>
            <span role="img" aria-label="total offers">
              🔥{" "}
            </span>
            Top bid
          </div>
          <span>{`${auctions.TokenSymbol} ${topBidPrice}`}</span>
          {topBidPrice !== "N/A" && (
            <div className={styles.hint}>${convertTokenToUSD(auctions.TokenSymbol, topBidPrice)}</div>
          )}
        </div>
        <div className={styles.auctionEnding}>
          <div className={styles.auctionTitle}>
            <span role="img" aria-label="total offers">
              ⏳
            </span>{" "}
            Auction Ending In
          </div>
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

      <Divider />
      <div className={styles.actions}>
        <SecondaryButton size="medium" onClick={viewDetails}>
          View More Details
        </SecondaryButton>
        <PrimaryButton size="medium" onClick={() => placeBid(Number(price), topBidPrice)}>
          Place A Bid
        </PrimaryButton>
      </div>
    </Modal>
  );
};

const ModalHeader = styled(Header3)`
  margin-bottom: ${grid(3)};
`;
