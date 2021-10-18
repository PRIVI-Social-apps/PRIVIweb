import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import URL from "shared/functions/getURL";
import Graph from "shared/ui-kit/Page-components/Graph";
import WallItem from "shared/ui-kit/Page-components/WallItem";
import Voting from "shared/ui-kit/Page-components/Voting";
import TradingHistory from "shared/ui-kit/Page-components/TradingHistory";
import { sampleVoting } from "../sampleData.js";
import "shared/ui-kit/Modal/Modals/Modal.css";
import "./NFTGeneral.css";

import PageDiscussion from "shared/ui-kit/Forum/PageDiscussion";
import ModalNewTopic from "shared/ui-kit/Forum/ModalNewTopic";
import Offers from "../nft-components/Offers";
import CreateOfferModal from "../nft-components/CreateOfferModal";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { Dialog, Modal } from "@material-ui/core";
import CreatePostModal from "../../../Communities/CommunityPage/modals/Create-Post/CreatePostModal";
import SeeAllPosts from "shared/ui-kit/Page-components/SeeAllPosts";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";

export default function NFTGeneral(props) {
  const userSelector = useSelector((state: RootState) => state.user);

  const [podId, setPodId] = useState<string>("");

  const [transactions, setTransactions] = useState<any[]>([]);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [supplyHistory, setSupplyHistory] = useState<any[]>([]);

  const [offerType, setOfferType] = useState<string>("");
  const [openCreateOffer, setOpenCreateOffer] = useState<boolean>(false);

  const [isPriceDataLoading, setIsPriceDataLoading] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const handleOpenCreateOffer = () => {
    setOpenCreateOffer(true);
  };

  const handleCloseCreateOffer = () => {
    setOpenCreateOffer(false);
  };

  const pageDiscussionRef = useRef();

  const [openNewTopic, setOpenNewTopic] = useState<boolean>(false);

  const handleOpenNewTopic = () => {
    setOpenNewTopic(true);
  };

  const handleCloseNewTopic = () => {
    setOpenNewTopic(false);
  };

  const [openModalNewPodPost, setOpenModalNewPodPost] = useState<boolean>(false);
  const handleOpenModalNewPodPost = () => {
    setOpenModalNewPodPost(true);
  };
  const handleCloseModalNewPodPost = () => {
    props.handleRefresh();
    setOpenModalNewPodPost(false);
  };

  const [openModalViewAllPost, setOpenModalViewAllPost] = useState<boolean>(false);
  const handleOpenModalViewAllPost = () => {
    setOpenModalViewAllPost(true);
  };
  const handleCloseModalViewAllPost = () => {
    setOpenModalViewAllPost(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.pod]);

  const loadData = async () => {
    if (props.pod.PodAddress) {
      setPodId(props.pod.PodAddress);
      getPodTransactions(props.pod.PodAddress);
      getPodHistory(props.pod.PodAddress);
    }
  };

  const getPodTransactions = podId => {
    // get pod transactions and parse it
    console.log("NFT getPodTransactions called");
    setIsDataLoading(true);
    axios
      .get(`${URL()}/pod/NFT/getPodTransactions/${podId}`)
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          const data = resp.data;
          const filterStreamed = data.filter(e => !e.Type.includes("stream"));
          console.log("NFT getPodTransactions", filterStreamed);
          setTransactions(filterStreamed);
        }
        setIsDataLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsDataLoading(false);
      });
  };

  const getPodHistory = podId => {
    // get data for graphs
    setIsPriceDataLoading(true);
    axios
      .get(`${URL()}/pod/NFT/getHistories/${podId}`)
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          const data = resp.data;
          // new price history
          const newPriceHistory: any[] = [];
          const priceHistory = data.priceHistory ?? [];
          priceHistory.forEach(obj => {
            newPriceHistory.push({
              x: new Date(obj.date).toString(),
              y: obj.price,
            });
          });
          setPriceHistory(newPriceHistory);
          // new supply history
          const newSupplyHistory: any[] = [];
          const supplyHistory = data.supplyHistory ?? [];
          supplyHistory.forEach(obj => {
            newSupplyHistory.push({
              x: new Date(obj.date).toString(),
              y: obj.supply,
            });
          });
          setSupplyHistory(newSupplyHistory);
        }
        setIsPriceDataLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsPriceDataLoading(false);
      });
  };

  if (props.pod)
    return (
      <div className="general nftGeneral">
        <div className="charts">
          <div className="charts-container">
            <div className="chart">
              <p>Market Price</p>
              <span>{`Actual Price ${props.marketPrice} ${props.pod.Token ? props.pod.Token : ""}`}</span>
              <LoadingWrapper loading={isPriceDataLoading}>
                <Graph data={priceHistory} />
              </LoadingWrapper>
            </div>
            <div className="chart">
              <p>Supply</p>
              <span>{`Actual Supply Available ${props.pod.Supply ? props.pod.Supply : "N/A"} ${
                props.pod.Token ? props.pod.Token : ""
              }`}</span>
              <LoadingWrapper loading={isPriceDataLoading}>
                <Graph data={supplyHistory} />
              </LoadingWrapper>
            </div>
          </div>
          <div className="ad-container">
            <p>Ad placement</p>
          </div>
        </div>

        <div className="offers">
          <div className="offers-container">
            <div className="title">
              <h3>Buying Offers</h3>
              <button
                onClick={() => {
                  handleOpenCreateOffer();
                  setOfferType("Buy");
                }}
              >
                Create Buy Offer
              </button>
            </div>
            <div className="offers-content">
              <Offers
                offers={props.buyingOffers}
                type="Sell"
                podToken={props.pod.TokenSymbol}
                handleRefresh={props.handleRefresh}
              />
            </div>
          </div>
          <div className="offers-container selling-offers">
            <div className="title">
              <h3>Selling Offers</h3>
              <button
                onClick={() => {
                  handleOpenCreateOffer();
                  setOfferType("Sell");
                }}
              >
                Create Sell Offer
              </button>
            </div>
            <div className="offers-content">
              <Offers
                offers={props.sellingOffers}
                type="Buy"
                podToken={props.pod.TokenSymbol}
                handleRefresh={props.handleRefresh}
              />
            </div>
            <CreateOfferModal
              type={offerType}
              open={openCreateOffer}
              handleClose={handleCloseCreateOffer}
              handleRefresh={props.handleRefresh}
              pod={props.pod}
            />
          </div>
        </div>
        <div className="wall">
          <div className="title">
            <h3>Pod Wall</h3>
            {/*<button onClick={handleOpenModalViewAllPost}
                    style={{ cursor: "pointer" }}
                    className="disabled">
              View all
            </button>*/}
            {props.pod.Creator === userSelector.id ? (
              <button onClick={handleOpenModalNewPodPost}>+ Create</button>
            ) : null}
          </div>
          <div className="wall-content">
            {props.pod && props.pod.PostsArray && props.pod.PostsArray.length > 0 ? (
              props.pod.PostsArray.map((item, index) => {
                return (
                  <WallItem
                    item={item}
                    imageUrl={`${URL()}/pod/NFT/wall/getPostPhoto/${item.id}`}
                    Creator={item.createdBy}
                    key={`wall-item-${index}`}
                    type={"PodNFTPost"}
                    itemTypeId={props.pod.id}
                    admin={props.pod.Creator === userSelector.id}
                    handleRefresh={() => props.handleRefresh()}
                    index={index}
                  />
                );
              })
            ) : (
              <div>No Posts available</div>
            )}
          </div>
        </div>
        <div className="lower-section">
          <div className="discussions">
            <div className="bodyHeaderPriviEcosystem">
              <div className="labelBodyPriviEcosystem">
                <img
                  src={require("assets/icons/message_blue.png")}
                  alt={"message bubble"}
                  className="iconLabelBodyPriviEcosystem"
                />
                Discussions
              </div>
              <div className="buttonBodyPriviEcosystem">
                <button onClick={handleOpenNewTopic} className="createButtonIssuesProposals">
                  + Create
                </button>
                <ModalNewTopic
                  open={openNewTopic}
                  handleClose={handleCloseNewTopic}
                  postType="pnft"
                  linkId={podId}
                  pageDiscussionRef={pageDiscussionRef}
                />
              </div>
            </div>

            <div className="content">
              <PageDiscussion
                postType="pnft"
                linkId={podId}
                key={podId}
                pageDiscussionRef={pageDiscussionRef}
              />
            </div>
          </div>

          <div className="voting">
            <div className="title">
              <img src={require("assets/icons/done_blue.png")} alt={"check"} />
              <h3>Voting</h3>
              <button disabled className="disabled">
                View voting history
              </button>
            </div>
            <div className="content">
              <Voting votingData={sampleVoting} />
            </div>
          </div>
          <div className="trading-history">
            <div className="title">
              <img src={require("assets/icons/stats_blue.png")} alt={"stats"} />
              <h3>Pod History</h3>
            </div>
            <div className="content">
              <LoadingWrapper loading={isDataLoading}>
                <TradingHistory history={transactions} address={podId} />
              </LoadingWrapper>
            </div>
          </div>
        </div>
        <CreatePostModal
          open={openModalNewPodPost}
          handleClose={handleCloseModalNewPodPost}
          podId={podId}
          type={"PodNFTPost"}
        />
        <Dialog
          className="modalCreateModal"
          open={openModalViewAllPost}
          onClose={handleCloseModalViewAllPost}
          fullWidth={true}
          maxWidth={"md"}
        >
          <SeeAllPosts
            handleClose={handleCloseModalViewAllPost}
            title={"Pod Wall"}
            posts={props.pod.PostsArray}
            creator={props.pod.Creator}
            type={"PodNFTPost"}
            handleRefresh={() => props.handleRefresh()}
            itemTypeId={podId}
          />
        </Dialog>
      </div>
    );
  else return <p>Pod not fond</p>;
}
