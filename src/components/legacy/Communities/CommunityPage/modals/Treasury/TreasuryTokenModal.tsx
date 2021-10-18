import React, { useEffect, useState } from "react";

import Grid from "@material-ui/core/Grid";

import { treasuryTokenModalStyles } from './TreasuryTokenModal.styles';
import URL from "shared/functions/getURL";
import { Modal } from 'shared/ui-kit';

const TreasuryTokenModal = (props: any) => {
  const classes = treasuryTokenModalStyles();
  const [sortedTransactions, setSortedTransactions] = useState<any[]>([]);
  useEffect(() => {
    if (props.transactions && props.transactions.length > 0) {
      const eventsList = [...props.transactions];
      eventsList.sort((a, b) => a.Date - b.Date);
      setSortedTransactions(eventsList);
    }
  }, [props.transactions]);

  const styledDate = (date) => {
    const d = new Date(date * 1000); // because blockchain store Date field in seconds instead of ms
    return `${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}.${d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
      }.${d.getFullYear()}`;
  };

  return (
    <Modal size="medium" isOpen={props.open} onClose={props.onClose} showCloseIcon className={classes.root}>
      <div className={classes.modalContent}>
        <div className={classes.firstPartTreasury}>
          <div
            className={classes.photoTreasury}
            style={{
              backgroundImage:
                props.balanceObj.Token
                  ? props.balanceObj.Type === "CRYPTO"
                    ? `url(${require(`assets/tokenImages/${props.balanceObj.Token}.png`)})`
                    : `url(${URL()}/wallet/getTokenPhoto/${props.balanceObj.Token})`
                  : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className={classes.infoTreasury}>
            <div className={classes.tokenNameTreasury}>{`${props.balanceObj.Token} TOKEN`}</div>
            <div className={classes.headerTreasury}>Quantity</div>
            <div className={classes.valueTreasury}>{`${props.balanceObj.Amount}`}</div>
          </div>
        </div>
        <div className={classes.secondPartTreasury}>
          <Grid
            container
            spacing={2}
            direction="row"
            alignItems="flex-start"
            justify="flex-start"
          >
            <Grid item xs={3} className={classes.headerTableTreasury}>
              EVENT
            </Grid>
            <Grid item xs={2} className={classes.headerTableTreasury}>
              QUANTITY
            </Grid>
            <Grid item xs={4} className={classes.headerTableTreasury}>
              TRANSACTION
            </Grid>
            <Grid item xs={3} className={classes.headerTableTreasury}>
              DATE
            </Grid>
          </Grid>
          {sortedTransactions.length > 0
            ? sortedTransactions.map((txnObj) => {
              return (
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  alignItems="flex-start"
                  justify="flex-start"
                >
                  <Grid item xs={3} className={classes.valueTableTreasury}>
                    {txnObj.EventType ?? 'unkwnown'}
                  </Grid>
                  <Grid item xs={2} className={classes.valueTableTreasury}>
                    {txnObj.Amount}
                  </Grid>
                  <Grid item xs={4} className={classes.valueTableTreasury}>
                    {txnObj.Id}
                  </Grid>
                  <Grid item xs={3} className={classes.valueTableTreasury}>
                    {styledDate(txnObj.Date)}
                  </Grid>
                </Grid>
              );
            })
            : null}
        </div>
      </div>
    </Modal>
  );
};

export default TreasuryTokenModal;
