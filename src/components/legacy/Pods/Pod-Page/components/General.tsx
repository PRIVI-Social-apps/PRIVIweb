import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import URL from "shared/functions/getURL";
import Graph from "shared/ui-kit/Page-components/Graph";
import WallItem from "shared/ui-kit/Page-components/WallItem";
import Voting from "shared/ui-kit/Page-components/Voting";
import TradingHistory from "shared/ui-kit/Page-components/TradingHistory";
import { sampleGraphData } from "../sampleData.js";
import "shared/ui-kit/Modal/Modals/Modal.css";
import "./General.css";

import PageDiscussion from "shared/ui-kit/Forum/PageDiscussion";
import ModalNewTopic from "shared/ui-kit/Forum/ModalNewTopic";
import { Dialog, Modal } from "@material-ui/core";
import CreatePostModal from "../../../Communities/CommunityPage/modals/Create-Post/CreatePostModal";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import SeeAllPosts from "shared/ui-kit/Page-components/SeeAllPosts";
import ViewAllVotingModal from "shared/ui-kit/Page-components/ViewAllVotingModal";
import CreateVotingModal from "shared/ui-kit/Page-components/CreateVotingModal";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";
import { PrimaryButton } from "shared/ui-kit";

//NOTES:
/*right now the model for pod is considered like an object containing: {
    //// MISSING ELEMENTS IN FIREBASE: ///
    Data for Pod wall: [
      {
        favourite: boolean (just one should be true)
        imageURL: string, -> would be the pod image (optional)
        title: string,
        subtitle: string (optional),
        responses: string[],}]
    check sampleWall in sampleData.js for an example

    Data for discussions: [
      {
        title: string,
        subtitle: string,
        responses: string[],
        userId: stirng,
      }
    ]
    check sampleDiscussions in sampleData.js for an example

    Data for voting: {
      title: string,
      answers: string[],
      votes: [
         id: string,
         answer: number] <- answer shouldn't be higher than asnwers.lenght, it represents the user choice from the answers list}
    check sampleVoting in sampleData.js for an example

    Data for Pod Wall: [
      {
        type: string,
        token: string,
        amount: number,
        time: number
      }
    ]
    check sampleHistory in sampleData.js for an example

  *search TODO in this document for missing tasks*/

export default function General(props) {
  const userSelector = useSelector((state: RootState) => state.user);
  const [podId, setPodId] = useState<string>("");

  const [lastPrice, setLastPrice] = useState<number>(0);
  // used for graphs and displaying data
  const [priceHistoryData, setPriceHistoryData] = useState<any[]>([]);
  const [supplyHistoryData, setSupplyHistoryData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [isMarketPriceLoading, setIsMarketPriceLoading] = useState<boolean>(false);
  const [isSupplyDataLoading, setIsSupplyDataLoading] = useState<boolean>(false);
  const [isTradingLoading, setIsTradingLoading] = useState<boolean>(false);

  const pageDiscussionRef = useRef();

  //modal controller
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
    props.refreshPod();
    setOpenModalNewPodPost(false);
  };

  const [openModalViewAllPost, setOpenModalViewAllPost] = useState<boolean>(false);
  const handleOpenModalViewAllPost = () => {
    setOpenModalViewAllPost(true);
  };
  const handleCloseModalViewAllPost = () => {
    setOpenModalViewAllPost(false);
  };

  const [createPollModal, setCreatePollModal] = useState<boolean>(false);
  const handleOpenCreatePollModal = () => {
    setCreatePollModal(true);
  };
  const handleCloseCreatePollModal = () => {
    setCreatePollModal(false);
  };

  const [viewAllVotingModal, setViewAllVotingModal] = useState<boolean>(false);
  const handleOpenViewAllVotingModal = () => {
    setViewAllVotingModal(true);
  };
  const handleCloseViewAllVotingModal = () => {
    setViewAllVotingModal(false);
  };

  useEffect(() => {
    console.log("propspod", props.pod, props.pod.PodAddress);
    if (props.pod.PodAddress) {
      setPodId(props.pod.PodAddress);
      getPodHistory(props.pod.PodAddress);
      getPodSupplyHistory(props.pod.PodAddress);
      getPodTransactions(props.pod.PodAddress);
    }
  }, [props.pod, props.trigger]);

  const getPodHistory = podId => {
    // get pod price history for graph
    setIsMarketPriceLoading(true);
    axios
      .get(`${URL()}/pod/FT/getPriceHistory/${podId}`)
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          const data = resp.data;
          const newPriceHistory: any[] = [];
          data.forEach(element => {
            newPriceHistory.push({
              x: new Date(element.date).toString(),
              y: element.price,
            });
          });
          setPriceHistoryData(newPriceHistory);
          // set last price
          const length = newPriceHistory.length;
          if (length > 0) setLastPrice(newPriceHistory[length - 1].y);
        }
        setIsMarketPriceLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsMarketPriceLoading(false);
      });
  };

  const getPodSupplyHistory = podId => {
    // get pod supply history for graph
    setIsSupplyDataLoading(true);
    axios
      .get(`${URL()}/pod/FT/getSupplyHistory/${podId}`)
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          const data = resp.data;
          const newSupplyHistory: any[] = [];
          data.forEach(element => {
            newSupplyHistory.push({
              x: new Date(element.date).toString(),
              y: element.supply,
            });
          });
          setSupplyHistoryData(newSupplyHistory);
        }
        setIsSupplyDataLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsSupplyDataLoading(false);
      });
  };

  const getPodTransactions = podId => {
    // // get pod transactions
    console.log("getPodTransactions called");
    setIsTradingLoading(true);
    axios
      .get(`${URL()}/pod/FT/getPodTransactions/${podId}`)
      .then(response => {
        const resp = response.data;
        // console.log('getPodTransactions got response', resp)
        if (resp.success) {
          const data = resp.data;
          const filterStreamed = data.filter(e => !e.Type.includes("stream"));
          console.log("getPodTransactions", filterStreamed);
          setTransactions(filterStreamed);
        }
        setIsTradingLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsTradingLoading(false);
      });
  };

  if (props.pod && props.pod.PodAddress)
    return (
      <div className="general">
        <div className="charts">
          <div className="charts-container">
            <div className="chart">
              <p>Market Price</p>
              <LoadingWrapper loading={isMarketPriceLoading}>
                <>
                  <span>{`Last Price ${lastPrice.toFixed(4)} ${
                    props.pod.FundingToken ? props.pod.FundingToken : ""
                  }`}</span>
                  <Graph data={priceHistoryData.length > 0 ? priceHistoryData : sampleGraphData} />
                </>
              </LoadingWrapper>
            </div>
            <div className="chart">
              <p>Liquidity</p>
              <span>{`Total Liquidity ${
                props.pod.SupplyReleased ? props.pod.SupplyReleased.toFixed(4) : "0"
              } ${props.pod.TokenSymbol ? props.pod.TokenSymbol : "Pod Token"}`}</span>
              <LoadingWrapper loading={isSupplyDataLoading}>
                <>
                  <Graph data={supplyHistoryData.length > 0 ? supplyHistoryData : sampleGraphData} />
                </>
              </LoadingWrapper>
            </div>
          </div>
          <div className="ad-container">
            <p>Ad placement</p>
          </div>
        </div>
        <div className="wall">
          <div className="title">
            <h3>Pod Wall</h3>
            {/*<button
              onClick={handleOpenModalViewAllPost}
              style={{ cursor: "pointer" }}
              className="disabled">
              View all
            </button>*/}
            {props.pod.Creator === userSelector.id ? (
              <PrimaryButton size="medium" onClick={handleOpenModalNewPodPost}>
                + Create
              </PrimaryButton>
            ) : null}
          </div>
          <div className="wall-content">
            {props.pod && props.pod.PostsArray && props.pod.PostsArray.length > 0 ? (
              props.pod.PostsArray.map((item, index) => {
                return (
                  <WallItem
                    item={item}
                    imageUrl={`${URL()}/pod/wall/getPostPhoto/${item.id}`}
                    Creator={item.createdBy}
                    key={`wall-item-${index}`}
                    type={"PodPost"}
                    itemTypeId={props.pod.id}
                    admin={props.pod.Creator === userSelector.id}
                    handleRefresh={() => props.refreshPod()}
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
                <PrimaryButton size="medium" onClick={handleOpenNewTopic}>
                  + Create
                </PrimaryButton>
                <ModalNewTopic
                  open={openNewTopic}
                  handleClose={handleCloseNewTopic}
                  postType="ft"
                  linkId={podId}
                  pageDiscussionRef={pageDiscussionRef}
                />
              </div>
            </div>

            <div className="content">
              <PageDiscussion
                postType="ft"
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
              {props.pod && props.pod.VotingsArray && props.pod.VotingsArray.length > 0 ? (
                <PrimaryButton onClick={handleOpenViewAllVotingModal} size="medium">
                  View all
                </PrimaryButton>
              ) : null}
              <Modal
                className="modalCreateModal"
                open={viewAllVotingModal}
                onClose={handleCloseViewAllVotingModal}
              >
                <ViewAllVotingModal
                  onCloseModal={handleCloseViewAllVotingModal}
                  onRefreshInfo={() => props.refreshPod()}
                  id={props.pod.id}
                  type={"Pod"}
                  votings={props.pod.VotingsArray}
                  title={"Voting"}
                  openVotingsLabel={"Active Voting"}
                  closeVotingsLabel={"Old Voting"}
                />
              </Modal>
              {props.pod && props.pod.Creator === userSelector.id ? (
                <PrimaryButton size="medium" onClick={handleOpenCreatePollModal}>
                  New
                </PrimaryButton>
              ) : null}
              <CreateVotingModal
                open={createPollModal}
                onClose={handleCloseCreatePollModal}
                onRefreshInfo={() => props.refreshPod()}
                id={props.pod.id}
                type={"Pod"}
                item={props.pod}
                title={"Create Voting"}
              />
            </div>
            <div className="content-voting">
              {props.pod.VotingsArray && props.pod.VotingsArray.length > 0 ? (
                props.pod.VotingsArray.map((item, index) => {
                  if (item.OpenVotation) {
                    if (props.pod.VotingsArray.length > index + 1) {
                      return (
                        <div key={`${index}-poll`} style={{ borderBottom: "1px solid #8080803d" }}>
                          <Voting
                            item={item}
                            itemType={"Pod"}
                            itemId={props.pod.id}
                            onRefreshInfo={() => props.refreshPod()}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={`${index}-poll`}>
                          <Voting
                            item={item}
                            itemType={"Pod"}
                            itemId={props.pod.id}
                            onRefreshInfo={() => props.refreshPod()}
                            key={`${index}-poll`}
                          />
                        </div>
                      );
                    }
                  }
                })
              ) : (
                <div className="centered-info">
                  <p>No active voting</p>
                </div>
              )}
            </div>
          </div>
          <div className="trading-history">
            <div className="title">
              <img src={require("assets/icons/stats_blue.png")} alt={"stats"} />
              <h3>Pod History</h3>
            </div>
            <div className="content">
              <LoadingWrapper loading={isTradingLoading}>
                <TradingHistory history={transactions} address={podId} />
              </LoadingWrapper>
            </div>
          </div>
        </div>

        <CreatePostModal
          open={openModalNewPodPost}
          handleClose={handleCloseModalNewPodPost}
          podId={podId}
          type={"PodPost"}
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
            type={"PodPost"}
            handleRefresh={() => props.refreshPod()}
            itemTypeId={podId}
          />
        </Dialog>
      </div>
    );
  else return <p>Error displaying pod data</p>;
}
