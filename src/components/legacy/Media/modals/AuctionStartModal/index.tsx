import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { TextField } from "@material-ui/core";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { TimeInput } from "shared/ui-kit/TimeInput";
import { PrimaryButton, SecondaryButton, Modal } from "shared/ui-kit";
import axios from "axios";
import URL from "shared/functions/getURL";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import DateFnsUtils from "@date-io/date-fns";
import styles from "./index.module.scss";

interface IAuctionInfo {
  startDate: Date | null;
  endDate: Date | null;
  token: string;
  price: number;
}

const AuctionStartModal = props => {
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const tokenList = resp.data.map(obj => ({ token: obj.token, name: obj.token }));
        setTokens(tokenList);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [auctionInfo, setAuctionInfo] = useState<IAuctionInfo>({
    startDate: new Date(),
    endDate: new Date(),
    token: "",
    price: 0,
  });
  const handleStartDateChange = (date: Date | null) => {
    setAuctionInfo({
      ...auctionInfo,
      startDate: date,
    });
  };
  const handleEndDateChange = (date: Date | null) => {
    setAuctionInfo({
      ...auctionInfo,
      endDate: date,
    });
  };
  const handleTokenChanged = event => {
    setAuctionInfo({
      ...auctionInfo,
      token: event.target.value,
    });
  };
  const handleAuctionPriceChange = event => {
    setAuctionInfo({
      ...auctionInfo,
      price: event.target.value,
    });
  };

  return (
    <Modal size="medium" isOpen={props.open} onClose={props.handleClose} className={styles.modal} showCloseIcon={true}>
      <div className={styles.modalContent}>
        <div className={styles.content}>
          <h2>Start Auction</h2>
          <div className={styles.auctionMainInfo}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHGGhx7CWKSlXRyinSN2bbiwKjTpg331KnCeiWBHex7cIUcw9ELnj_meQgYKdiiSROe3k&usqp=CAU" />
            <div className={styles.flexCol}>
              <span>Road Trip Anomaly</span>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunta. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunta incididunta.
              </p>
            </div>
          </div>
          <Grid container spacing={3}>
            <Grid item md={6} xs={6} className={styles.auctionInfoItem}>
              <h5>Start Date</h5>
              <DateInput
                id="auction-start-date"
                minDate={new Date()}
                format="MM.dd.yyyy"
                placeholder="Select date..."
                value={auctionInfo.startDate}
                onChange={handleStartDateChange}
              />
            </Grid>
            <Grid item md={6} xs={6} className={styles.auctionInfoItem}>
              <h5>Start time</h5>
              <TimeInput
                id="auction-start-time"
                minDate={new Date()}
                format="hh:mm"
                placeholder="Select time..."
                value={auctionInfo.startDate}
                onChange={handleStartDateChange}
              />
            </Grid>
            <Grid item md={6} xs={6} className={styles.auctionInfoItem}>
              <h5>End Date</h5>
              <DateInput
                id="auction-start-date"
                minDate={new Date()}
                format="MM.dd.yyyy"
                placeholder="Select date..."
                value={auctionInfo.endDate}
                onChange={handleEndDateChange}
              />
            </Grid>
            <Grid item md={6} xs={6} className={styles.auctionInfoItem}>
              <h5>End time</h5>
              <TimeInput
                id="auction-start-time"
                minDate={new Date()}
                format="hh:mm"
                placeholder="Select time..."
                value={auctionInfo.endDate}
                onChange={handleEndDateChange}
              />
            </Grid>
            <Grid item md={6} xs={6} className={styles.auctionInfoItem}>
              <h5>Initial price</h5>
              <TextField
                variant="outlined"
                size="small"
                value={auctionInfo.price}
                type="number"
                onChange={handleAuctionPriceChange}
                className={styles.priceInput}
              />
            </Grid>
            <Grid item md={6} xs={6} className={styles.auctionInfoItem}>
              <h5>Bidding token</h5>
              <TokenSelect tokens={tokens} value={auctionInfo.token} onChange={handleTokenChanged} />
            </Grid>
          </Grid>
          <div className={styles.actionButtons}>
            <SecondaryButton size="medium">Cancel</SecondaryButton>
            <PrimaryButton size="medium" style={{ padding: '0 26px' }}>
              Schedule Auction
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AuctionStartModal;
