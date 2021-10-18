import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { PriviSocialSecondaryButton, PriviSocialButton } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import { useSocialTokenStyles } from "../..";
import PrintSocialTokenChart from "./components/Chart/SocialTokenChart";
import SocialTokenChartConfig from "./components/Chart/SocialTokenChartConfig";
import HoldersTable from "./components/HoldersTable";
import { PriviCreator } from "components/legacy/Media/components/Displays/elements";
import BuySellModal from "../../modals/BuySellModal";
import Box from "shared/ui-kit/Box";
import TransactionHistoryTable from "./components/TransactionHistoryTable";
import TransactionUserHistoryTable from "./components/TransactionUserHistoryTable";
import { getSocialTokenTransactionHistory, getSocialTokenPriceHistory } from "shared/services/API";

export default function DetailsTab({ socialToken, isCreator, handleRefresh }) {
  const users = useTypedSelector(state => state.usersInfoList);

  const classes = useSocialTokenStyles();

  const [creator, setCreator] = useState<any>({});
  const [creationDate, setCreattionDate] = useState<string>("");
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [priceChart, setPriceChart] = useState<any>(SocialTokenChartConfig);

  const [isBuy, setIsBuy] = useState<boolean>(true);
  const [openBuySellModal, setOpenBuySellModal] = useState<boolean>(false);

  const handleOpenBuySellModal = (newIsBuy: boolean) => {
    setOpenBuySellModal(true);
    setIsBuy(newIsBuy);
  };
  const handleCloseBuySellModal = () => {
    setOpenBuySellModal(false);
  };

  const loadData = () => {
    // get txn history
    getSocialTokenTransactionHistory(socialToken.PoolAddress).then(resp => {
      if (resp?.success) setTransactionHistory(resp.data);
    });
    // get price history
    getSocialTokenPriceHistory(socialToken.PoolAddress).then(resp => {
      if (resp?.success) {
        const data = resp.data;
        const graphData: any[] = [];
        data.forEach(point => {
          graphData.push({
            x: point.date,
            y: point.price,
          });
        });
        const formattedGraphData = graphData.slice(-30);
        const labels = formattedGraphData.map(point =>
          new Date(point.x).toLocaleString("eu", {
            day: "numeric",
            month: "numeric",
          })
        );
        const newPriceChart = { ...priceChart };
        newPriceChart.config.data.labels = labels;
        newPriceChart.config.data.datasets[0].data = formattedGraphData;
        setPriceChart(newPriceChart);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, [socialToken.PoolAddress]);

  useEffect(() => {
    if (socialToken && users && users.length > 0) {
      setCreator(
        users.find(
          u => (socialToken.Creator && socialToken.Creator === u.id) || socialToken.Creator === u.address
        )
      );
      if (socialToken.Date) {
        let date = socialToken.Date < 16148612430 ? Number(`${socialToken.Date}000`) : socialToken.Date;
        setCreattionDate(`${new Date(date).getDate() < 10 ? `0${new Date(date).getDate()}` : new Date(date).getDate()
          }.
      ${new Date(date).getMonth() + 1 < 10
            ? `0${new Date(date).getMonth() + 1}`
            : new Date(date).getMonth() + 1
          }.
      ${new Date(date).getFullYear()}`);
      }
    }
  }, [users, socialToken]);

  return (
    <Box width="100%">
      <div className={classes.infoRow} style={{ marginBottom: 24 }}>
        <div>
          <span>🏦 Total Supply</span>
          <h2>{socialToken.SupplyReleased ?? 0}</h2>
        </div>
        <div>
          <span>⚖️ 24hr Volume</span>
          <h2>{socialToken?.DailyTradeVolume ?? 0}</h2>
        </div>
        <div>
          <span>✋ Token Owners</span>
          <h2>{Object.keys(socialToken?.Holders ?? {}).length}</h2>
        </div>
        <div>
          <span>✈ Total Airdroped</span>
          <h2>{socialToken?.TotalAirdropped ?? 0}</h2>
        </div>
      </div>
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        {!isCreator && (
          <PriviSocialSecondaryButton
            size="medium"
            onClick={() => {
              handleOpenBuySellModal(false);
            }}
          >
            Sell
          </PriviSocialSecondaryButton>
        )}
        {!isCreator && (
          <PriviSocialButton
            size="medium"
            onClick={() => {
              handleOpenBuySellModal(true);
            }}
          >
            Buy
          </PriviSocialButton>
        )}
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <div className={classes.label}>
            About
          </div>
          <Box display="flex" flexDirection="column" width="100%" className={classes.about}>
            <h5>Creator</h5>
            {creator && <PriviCreator creator={creator} theme="green" />}
            <h5>Description</h5>
            <p style={{ marginBottom: 16 }}>{socialToken.Description ?? "No description"}</p>
            <b>Date Created</b>
            <p style={{ marginBottom: 16 }}>{creationDate}</p>
            <b>Network</b>
            <div className={classes.network}>{socialToken.tokenChain ?? socialToken.chain ?? "PRIVI"}</div>
          </Box>
          {/* <SecondaryButton size="medium" onClick={handleShare}>
            <img src={require("assets/icons/share_dark.png")} alt="share" />
            Share
          </SecondaryButton> */}
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className={classes.label}>
            Top 5 Token Holders
          </div>
          <HoldersTable socialToken={socialToken} />
        </Grid>
      </Grid>
      <div
        className={classes.infoRow}
        style={{ margin: "64px 0px", flexDirection: "column", padding: "24px 48px 60px 48px" }}
      >
        <div className={classes.label} style={{ marginTop: 0, color: "#727F9A" }}>
          Price History
        </div>
        {PrintSocialTokenChart(priceChart, socialToken.FundingToken)}
      </div>
      <div className={classes.label}>Transaction history</div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <TransactionHistoryTable socialToken={socialToken} transactionHistory={transactionHistory} />
        </Grid>
        <Grid item xs={12} md={5}>
          <TransactionUserHistoryTable socialToken={socialToken} transactionHistory={transactionHistory} />
        </Grid>
      </Grid>
      <BuySellModal
        open={openBuySellModal}
        handleClose={handleCloseBuySellModal}
        handleRefresh={handleRefresh}
        isBuy={isBuy}
        socialToken={socialToken}
      />
    </Box>
  );
}
