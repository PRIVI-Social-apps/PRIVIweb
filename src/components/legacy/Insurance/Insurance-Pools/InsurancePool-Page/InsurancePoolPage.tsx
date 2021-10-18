import React, { useEffect, useState } from "react";
//import { useHistory } from 'react-router-dom';
//import axios from 'axios';
//import URL from 'shared/functions/getURL';
//import { useTypedSelector } from 'store/reducers/Reducer';
//import { useDispatch } from 'react-redux';
import Buttons from "shared/ui-kit/Buttons/Buttons";
import BackButton from "shared/ui-kit/Buttons/BackButton";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import Graph from "shared/ui-kit/Page-components/Graph";
import WallItem from "shared/ui-kit/Page-components/WallItem";
import Claims from "shared/ui-kit/Page-components/Claims";
import ClaimsHistory from "shared/ui-kit/Page-components/ClaimsHistory";
import TradingHistory from "shared/ui-kit/Page-components/TradingHistory";
import { TwitterShareButton, TwitterIcon } from "react-share";

import "./InsurancePoolPage.css";

import {
  sampleInsurancePoolsData,
  sampleGraphData,
  sampleWall,
  sampleClaims,
  sampleHistory,
} from "../../sampleData.js";
import InvestModal from "../components/InvestModal";
import CreatePostModal from "../../../Communities/CommunityPage/modals/Create-Post/CreatePostModal";
import { Dialog } from "@material-ui/core";
import SeeAllPosts from "shared/ui-kit/Page-components/SeeAllPosts";
//import URL from "shared/functions/getURL";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";

//NOTES:
/*

Right now the model for pool is considered like an object containing
the info in the array sampleInsurancePoolsData from sampleData.js. There
you can find the info needed for the UI and other fields that were suggested
before for the insurance elements (left them tehre because don't know if it
will be useful).

Right now all the data is obtained from that file, considering that the data
in firebase will have the same names. Beware it might not work if changing
these names in the db, should all be named the same

Also the data for the components featured in this page (Graphics, wall, Claims
and history) are also imported from sampleData.js. You can check all the fields there.

*search TODO in this document for missing tasks*/

export default function InsurancePoolPage() {
  //const user = useTypedSelector((state) => state.user);
  let userSelector = useSelector((state: RootState) => state.user);

  const [pool, setPool] = useState<any>({});

  const [status, setStatus] = useState<any>("");

  const [followed, setFollowed] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(false); // use to trigger useEffect to query data from backend each time some operation is done

  /* Invest modal*/
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openModalNewInsurancePoolPost, setOpenModalInsuranceNewPoolPost] = useState<boolean>(false);
  const handleOpenModalNewInsurancePoolPost = () => {
    setOpenModalInsuranceNewPoolPost(true);
  };
  const handleCloseModalNewInsurancePoolPost = () => {
    setOpenModalInsuranceNewPoolPost(false);
  };

  const [openModalViewAllPost, setOpenModalViewAllPost] = useState<boolean>(false);
  const handleOpenModalViewAllPost = () => {
    setOpenModalViewAllPost(true);
  };
  const handleCloseModalViewAllPost = () => {
    setOpenModalViewAllPost(false);
  };

  // used to query from backend the needed data for this page
  useEffect(() => {
    let pathName = window.location.href; // If routing changes, change to pathname
    let idUrl = pathName.split("/")[6];
    // get pool complete data -> TODO: get from backend

    setPool(sampleInsurancePoolsData.filter(value => value.Id === idUrl)[0]);
  }, [trigger]);

  const handleFollow = () => {
    // follow
    if (!followed) {
      //TODO: FOLLOW
    }
    // unfollow
    else {
      //TODO: UNFOLLOW
    }
  };

  const handleChat = () => {
    //TODO: open chat
  };

  return pool ? (
    <div className="insurance-pool-page">
      <BackButton />
      <div className={`header`}>
        <h2>{pool.InsurerName ? pool.InsurerName : "Unnamed Insurer"}</h2>
        <div className="connections">
          <p>
            Followers
            <span>{pool.Followers && pool.Followers.length ? `${pool.Followers.length}` : ` 0`}</span>
          </p>
          <p>
            Investors
            <span>{pool.Investors && pool.Investors.length ? `${pool.Investors.length}` : `0`}</span>
          </p>
        </div>
        <div className="buttons">
          <TwitterShareButton
            title={
              "Check out this PRIVI Insurance Pool!: " + pool.PodName + "\n\n" + pool.Description + "\n\n"
            }
            url={window.location.href}
            hashtags={["PRIVI"]}
          >
            <TwitterIcon size={32} style={{ marginRight: 3 }} round />
          </TwitterShareButton>

          <button className="chat" onClick={handleChat}>
            <img src={require("assets/icons/round_message_white.png")} alt={"message bubble"} />
            <span>Chat with lead guarantor</span>
          </button>
          <Buttons />
          {/* <SearchButton />
          <SettingsButton /> */}
        </div>
      </div>
      <div className="pool-data">
        <div className="main-info">
          <div
            className="pool-image"
            style={{
              backgroundImage:
                pool.InsurerImageURL && pool.InsurerImageURL.length > 0
                  ? `url(${pool.InsurerImageURL})`
                  : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="pool-info">
            <div className="top">
              <div className="perc">
                <div className="pool-detail">
                  <p>Premium</p>
                  <h3>{`${pool.Premium ? `${pool.Premium * 100}%` : "0%"}`}</h3>
                </div>
                <div className="pool-detail">
                  <p>Initial insured value</p>
                  <h3>{`${pool.InsuredAmount ? pool.InsuredAmount : "0"} ${
                    pool.Token ? pool.Token : ""
                  }`}</h3>
                </div>
              </div>
              <div className="scores">
                <div className="pod-detail">
                  <p>Trust Score</p>
                  <span>
                    <img src={require("assets/icons/rings_green.png")} alt={`rings`} />
                    <h3>{pool.PodTrustScore ? `${pool.PodTrustScore * 100}%` : "0%"}</h3>
                  </span>
                </div>
                <div className="pod-detail">
                  <p>Endorsement Score</p>
                  <span>
                    <img src={require("assets/icons/maze_green.png")} alt={`maze`} />
                    <h3>{pool.PodEndorsementScore ? `${pool.PodEndorsementScore * 100}%` : "0%"}</h3>
                  </span>
                </div>
              </div>
              <div className="buttons">
                <button onClick={handleFollow}>{followed ? "Unfollow" : "Follow"}</button>
                <button className="invest" onClick={handleOpen}>
                  Invest
                </button>
                <InvestModal
                  open={open}
                  handleClose={handleClose}
                  refreshPool={() => setTrigger(!trigger)}
                  pool={pool}
                />
              </div>
            </div>
            <div className="bottom">
              <div className="description">
                <p>{pool.Description ? pool.Description : "No pod description"}</p>
              </div>
              <div className="right">
                <div className="insured-pod">
                  {pool.PodAddress ? (
                    <div className="pod-container">
                      <div className="left">
                        <div
                          className="pod-image"
                          style={{
                            backgroundImage:
                              pool.PodImageURL.length > 0 ? `url(${pool.PodImageURL})` : "none",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                        <div className="pod-title">
                          <p>Insured Pod</p>
                          <h3>{pool.PodName ? pool.PodName : "Unnamed Pod"}</h3>
                        </div>
                      </div>
                      <div className="pod-score">
                        <p>{`${pool.PodCoverageRate ? `${pool.PodCoverageRate * 100}%` : "0%"}`}</p>
                      </div>
                    </div>
                  ) : (
                    <p>No insured Pod</p>
                  )}
                </div>
                <div className="premium">
                  <p>Premium Received</p>
                  <div>
                    <h3>
                      {pool.PremiumWeekly ? `${(pool.PremiumWeekly * 100).toFixed(0)}% Weekly` : "0% Weekly"}
                    </h3>
                    <h3>
                      {pool.PremiumMonthly
                        ? `${(pool.PremiumMonthly * 100).toFixed(0)}% Monthly`
                        : "0% Monthly"}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="charts">
          <div className="charts-container">
            <div className="chart">
              <p>Insurance Pool Members</p>
              <span>{`Members ${pool.Members && pool.Members.length ? pool.Members.length : "0"}`}</span>
              <Graph data={sampleGraphData} />
            </div>
            <div className="chart">
              <p>Liquidity</p>
              <span>{`Total Liquidity ${pool.Liquidity ? pool.Liquidity : "0"} ${
                pool.Token ? pool.Token : ""
              }`}</span>
              <Graph data={sampleGraphData} />
            </div>
          </div>
          <div className="ad-container">
            <p>Ad placement</p>
          </div>
        </div>
        <div className="wall">
          <div className="title">
            <h3>Pool Wall</h3>
            <button onClick={handleOpenModalViewAllPost} style={{ cursor: "pointer" }} className="disabled">
              View all
            </button>
            {pool.Creator === userSelector.id ? (
              <button onClick={handleOpenModalNewInsurancePoolPost}>+ Create</button>
            ) : null}
          </div>
          <div className="wall-content">
            {sampleWall.map((item, index) => {
              return (
                <WallItem
                  item={item}
                  imageUrl={pool.InsurerImageURL}
                  key={`wall-item-${index}`}
                  type={"InsurancePost"}
                  itemTypeId={pool.id}
                  admin={pool.Creator === userSelector.id}
                  handleRefresh={() => {}}
                  index={index}
                />
              );
            })}
          </div>
        </div>
        <div className="lower-section">
          <div className="active-claims">
            <div className="title">
              <img src={require("assets/icons/done_blue.png")} alt={"check"} />
              <h3>Active Claims</h3>
            </div>
            <div className="content less-padding">
              {sampleClaims.map((item, index) => {
                return <Claims item={item} key={`voting-item-${index}`} />;
              })}
            </div>
          </div>
          <div className="claims-history">
            <div className="title">
              <img src={require("assets/icons/stats_blue.png")} alt={"stats"} />
              <h3>Claims History</h3>
            </div>
            <div className="content less-padding">
              {sampleClaims.map((item, index) => {
                return <ClaimsHistory item={item} key={`voting-history-item-${index}`} />;
              })}
            </div>
          </div>
          <div className="buying-history">
            <div className="title">
              <img src={require("assets/icons/stats_blue.png")} alt={"stats"} />
              <h3>Buying History</h3>
            </div>
            <div className="content">
              <TradingHistory history={sampleHistory} />
            </div>
          </div>
        </div>
        <CreatePostModal
          open={openModalNewInsurancePoolPost}
          handleClose={handleCloseModalNewInsurancePoolPost}
          creditPoolId={pool.id}
          type={"InsurancePoolPost"}
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
            title={"Pool Wall"}
            posts={[]}
            creator={pool.Created}
            itemTypeId={pool.id}
            handleRefresh={() => {}}
            type={"InsurancePost"}
          />
        </Dialog>
      </div>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  ) : (
    <div className="container">
      <h3>Insurance pool not found</h3>
    </div>
  );
}
