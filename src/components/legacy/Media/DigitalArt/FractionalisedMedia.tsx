import React, { useEffect, useState } from "react";
import axios from "axios";

import DigitalArtInfo from "./components/DigitalArtInfo/DigitalArtInfo";
import DigitalButtons from "./components/DigitalButtons/DigitalButtons";
import DigitalChartGrid from "./components/DigitalChartGrid/DigitalChartGrid";
import DigitalChartTable from "./components/DigitalTable/DigitalTable";
import DigitalTradingTable from "./components/DigitalTradingTable/DigitalTradingTable";
import BuyFraction from "./components/Fractionalise/BuyFraction";
import CreateOffer from "./components/Fractionalise/CreateOffer";
import chartConfig from "./components/DigitalChart/configs/FractionaliseChartConfig";

import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import styles from "./index.module.scss";
import { SecondaryButton } from "shared/ui-kit";

const FractionalisedMediaPage: React.FunctionComponent = () => {
  const [openBuyFractionModal, setOpenBuyFractionModal] = useState<boolean>(false);
  const [openCreateOfferModal, setOpenCreateOfferModal] = useState<boolean>(false);
  const [isCreateOfferBuy, setIsCreateOfferBuy] = useState<boolean>(true);

  const [media, setMedia] = useState<any>({});
  const [buyingOffers, setBuyingOffers] = useState<any[]>([]);
  const [sellingOffers, setSellingOffers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [priceChart, setPriceChart] = useState<any>(chartConfig("$"));
  const [ownershipChart, setOwnershipChart] = useState<any>(chartConfig("%"));
  const [isMediaLoading, setIsMediaLoading] = useState<boolean>(false);
  const [isOfferLoading, setIsOfferLoading] = useState<boolean>(false);
  const [isTransactionLoading, setIsTransactionLoading] = useState<boolean>(false);
  const [isPriceLoading, setIsPriceLoading] = useState<boolean>(false);
  const [isOwnershipLoading, setIsOwnershipLoading] = useState<boolean>(false);

  const handleOpenBuy = () => {
    setOpenBuyFractionModal(true);
  };
  const handleCloseBuy = () => {
    setOpenBuyFractionModal(false);
  };

  const handleOpenCreateBuy = () => {
    setOpenCreateOfferModal(true);
    setIsCreateOfferBuy(true);
  };
  const handleCloseCreateBuy = () => {
    setOpenCreateOfferModal(false);
  };
  const handleOpenCreateSell = () => {
    setOpenCreateOfferModal(true);
    setIsCreateOfferBuy(false);
  };
  const handleCloseCreateSellOffer = () => {
    setOpenCreateOfferModal(false);
  };

  // load media data
  const loadMedia = () => {
    const pathName = window.location.href;
    const idUrl = pathName.split("/")[5];
    if (idUrl) {
      // get media
      setIsMediaLoading(true);
      axios
        .get(`${URL()}/media/getMedia/${idUrl}/privi`)
        .then(async response => {
          const resp: any = response.data;
          if (resp.success) {
            setMedia(resp.data);
          }
          setIsMediaLoading(false);
        })
        .catch(err => {
          console.log(err);
          setIsMediaLoading(false);
        });
      // get offers
      setIsOfferLoading(true);
      axios
        .get(`${URL()}/media/getFractionalisedMediaOffers/${idUrl}`)
        .then(async response => {
          const resp: any = response.data;
          if (resp.success) {
            const data = resp.data;
            setSellingOffers(data.sellingOffers);
            setBuyingOffers(data.buyingOffers);
          }
          setIsOfferLoading(false);
        })
        .catch(err => {
          setIsOfferLoading(false);
          console.log(err);
        });
      // get transactions
      setIsTransactionLoading(true);
      axios
        .get(`${URL()}/media/getFractionalisedMediaTransactions/${idUrl}`)
        .then(async response => {
          const resp: any = response.data;
          if (resp.success) {
            setTransactions(resp.data);
          }
          setIsTransactionLoading(false);
        })
        .catch(err => {
          console.log(err);
          setIsTransactionLoading(false);
        });
      // get price history
      setIsPriceLoading(true);
      axios
        .get(`${URL()}/media/getFractionalisedMediaPriceHistory/${idUrl}`)
        .then(async response => {
          const resp: any = response.data;
          if (resp.success) {
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
          setIsPriceLoading(false);
        })
        .catch(err => {
          console.log(err);
          setIsPriceLoading(false);
        });
      // get ownership history
      setIsOwnershipLoading(true);
      axios
        .get(`${URL()}/media/getFractionalisedMediaSharedOwnershipHistory/${idUrl}`)
        .then(async response => {
          const resp: any = response.data;
          if (resp.success) {
            const data = resp.data;
            const graphData: any[] = [];
            data.forEach(point => {
              graphData.push({
                x: point.date,
                y: point.ownership,
              });
            });
            const formattedGraphData = graphData.slice(-30);
            const labels = formattedGraphData.map(point =>
              new Date(point.x).toLocaleString("eu", {
                day: "numeric",
                month: "numeric",
              })
            );
            const newOwnershipChart = { ...ownershipChart };
            newOwnershipChart.config.data.labels = labels;
            newOwnershipChart.config.data.datasets[0].data = formattedGraphData;
            setOwnershipChart(newOwnershipChart);
          }
          setIsOwnershipLoading(false);
        })
        .catch(err => {
          console.log(err);
          setIsOwnershipLoading(false);
        });
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  return (
    <LoadingWrapper
      loading={
        isMediaLoading || isOfferLoading || isTransactionLoading || isPriceLoading || isOwnershipLoading
      }
    >
      <div>
        <div className={styles.container}>
          <div className={styles.mainContainer}>
            <DigitalArtInfo media={media} />
            <DigitalButtons
              handleOpenBuy={handleOpenBuy}
              handleOpenCreateBuy={handleOpenCreateBuy}
              handleOpenCreateSell={handleOpenCreateSell}
            />
            <DigitalChartGrid priceChart={priceChart} ownershipChart={ownershipChart} />
            <div className={styles.chartTables}>
              <DigitalChartTable
                media={media}
                handleRefresh={loadMedia}
                isBuy={true}
                offers={buyingOffers}
                viewAll={true}
              />
              <DigitalChartTable
                media={media}
                handleRefresh={loadMedia}
                isBuy={false}
                offers={sellingOffers}
                viewAll={true}
              />
            </div>
            <DigitalTradingTable transactions={transactions} viewAll={false} />
            <SecondaryButton size="medium">View More</SecondaryButton>
          </div>
        </div>
        <BuyFraction open={openBuyFractionModal} handleClose={handleCloseBuy} />
        <CreateOffer
          media={media}
          isBuy={isCreateOfferBuy}
          handleRefresh={loadMedia}
          open={openCreateOfferModal}
          handleClose={handleCloseCreateSellOffer}
        />
      </div>
    </LoadingWrapper>
  );
};

export default FractionalisedMediaPage;
