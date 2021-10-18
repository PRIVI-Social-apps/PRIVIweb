import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { SecondaryButton, PrimaryButton } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import { useSocialTokenStyles } from "../..";
import PrintSocialTokenChart from "./components/Chart/SocialTokenChart";
import SocialTokenChartConfig from "./components/Chart/SocialTokenChartConfig";
import HoldersTable from "./components/HoldersTable";
import { PriviCreator } from "components/legacy/Media/components/Displays/elements";
import BuySellModal from "../../modals/BuySellModal";
import Box from 'shared/ui-kit/Box';

const transactionsMock = [
  {
    Date: new Date().getTime() - 10000,
    From: "0x0ea6451b47fdb705dc52316b40e99b8a871b165d",
    Amount: 1.23,
    Token: "DAI",
    Id: "",
    Status: "Pending",
    Type: "Buy",
  },
  {
    Date: new Date().getTime(),
    From: "0x964DE4135F6D8079D4e23048b887317547C7deBF",
    Amount: 1.23,
    Token: "DAI",
    Id: "",
    Status: "Denied",
    Type: "Buy",
  },
  {
    Date: new Date().getTime() - 52000000,
    From: "0x9eba16f9c9e6f98246968ac575e3837c00a596c2",
    Amount: 1.23,
    Token: "DAI",
    Id: "",
    Status: "Confirmed",
    Type: "Sell",
  },
  {
    Date: new Date().getTime() - 20000000,
    From: "0x04f32a8eb65d2559c631eb964adc6fa23a13778a",
    Amount: 1.23,
    Token: "DAI",
    Id: "",
    Status: "Confirmed",
    Type: "Buy",
  },
];

export default function DetailsTab({ socialToken, isCreator }) {
  const users = useTypedSelector(state => state.usersInfoList);

  const classes = useSocialTokenStyles();

  const [creator, setCreator] = useState<any>({});
  const [creationDate, setCreattionDate] = useState<string>("");
  const [totalAirDropped, setTotalAirDropped] = useState<number>(0);
  const [volume24h, setVolume24h] = useState<number>(0);
  const [historyData, setHistoryData] = useState<any>(SocialTokenChartConfig);

  const [buyOrSell, setBuyOrSell] = useState<boolean>(true);
  const [openBuySellModal, setOpenBuySellModal] = useState<boolean>(false);
  const handleOpenBuySellModal = (buyorSell: boolean) => {
    setOpenBuySellModal(true);
    setBuyOrSell(buyorSell);
  };
  const handleCloseBuySellModal = (buyorSell: boolean) => {
    setOpenBuySellModal(false);
  };

  useEffect(() => {
    if (socialToken && users && users.length > 0) {
      setCreator(
        users.find(
          u => (socialToken.Creator && socialToken.Creator === u.id) || socialToken.Creator === u.address
        )
      );
      if (socialToken.Date) {
        let date = socialToken.Date < 16148612430 ? Number(`${socialToken.Date}000`) : socialToken.Date;
        setCreattionDate(`${
          new Date(date).getDate() < 10 ? `0${new Date(date).getDate()}` : new Date(date).getDate()
        }.
      ${
        new Date(date).getMonth() + 1 < 10
          ? `0${new Date(date).getMonth() + 1}`
          : new Date(date).getMonth() + 1
      }.
      ${new Date(date).getFullYear()}`);
      }
    }
  }, [users, socialToken]);

  const handleShare = () => {};

  return (
    <Box width="100%">
      <div className={classes.infoRow} style={{ marginBottom: 0 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" marginRight="0px">
          <div>
            <span>🏦 Total Supply</span>
            <h2>{socialToken.TotalSupply ?? 0}</h2>
          </div>
          <div>
            <span>⚖️ 24hr Volume</span>
            <h2>{volume24h}</h2>
          </div>
          <div>
            <span>✋ Token Owners</span>
            <h2>{socialToken && socialToken.HoldersInfo ? socialToken.HoldersInfo.length : 0}</h2>
          </div>
          <div>
            <span>✈ Total Airdroped</span>
            <h2>{totalAirDropped}</h2>
          </div>
        </Box>

        <Box display="flex" alignItems="center" marginRight="0px">
          {!isCreator && (
            <SecondaryButton
              size="medium"
              onClick={() => {
                handleOpenBuySellModal(false);
              }}
            >
              Sell
            </SecondaryButton>
          )}
          {!isCreator && (
            <PrimaryButton
              size="medium"
              onClick={() => {
                handleOpenBuySellModal(true);
              }}
            >
              Buy
            </PrimaryButton>
          )}
        </Box>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <div className={classes.label}>About</div>
          <Box display="flex" flexDirection="column" width="100%" className={classes.about}>
            <h5>Creator</h5>
            {creator && <PriviCreator creator={creator} theme="default" />}
            <h5>Description</h5>
            <p>{socialToken.Description ?? "No description"}</p>
            <b>Date Created</b>
            <p>{creationDate}</p>
            <b>Network</b>
            <div className={classes.network}>{socialToken.tokenChain ?? socialToken.chain ?? "PRIVI"}</div>
          </Box>
          <SecondaryButton size="medium" onClick={handleShare}>
            <img src={require("assets/icons/share_dark.png")} alt="share" />
            Share
          </SecondaryButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className={classes.label}>Top 5 Token Holders</div>
          <HoldersTable holders={socialToken && socialToken.HoldersInfo ? socialToken.HoldersInfo : []} />
        </Grid>
      </Grid>
      <div className={classes.label}>Price history</div>
      {PrintSocialTokenChart(historyData, socialToken.FundingToken)}
      <BuySellModal
        open={openBuySellModal}
        handleClose={handleCloseBuySellModal}
        buyOrSell={buyOrSell}
        socialToken={socialToken}
      />
    </Box>
  );
}
