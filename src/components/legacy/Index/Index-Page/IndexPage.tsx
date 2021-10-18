import React, { useEffect, useState } from "react";
//import { useTypedSelector } from 'store/reducers/Reducer';
import "./IndexPage.css";
//import axios from 'axios';
//import URL from 'shared/functions/getURL';
// import SettingsButton from 'shared/Buttons/SettingsButton';
// import SearchButton from 'shared/Buttons/SearchButton';
import Buttons from "shared/ui-kit/Buttons/Buttons";
import BackButton from "shared/ui-kit/Buttons/BackButton";
import Graph from "shared/ui-kit/Page-components/Graph";
import {
  sampleHoldings,
  sampleGraphData,
  sampleGraphData2,
  sampleUserData,
  sampleIndexesData,
} from "../sampleData.js";
import InvestModal from "../components/InvestModal";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import PortfolioHoldings from "./components/PortfolioHoldings";

//NOTES:
/*right now the model for index is considered like an object containing: {
  id: string,
  name: string,
  shares: number,
  returnType: string,
  assets: string[], <- a string of token names to search image file in assets folder
  performanceAllTime: number,
  performanceMonth: number,
  sharePrice: number,
  dailyReturns: number,
  weeklyReturns: number,
  monthlyReturns: number,
  members: number,
  totalReturns: number

  data for share price graphic -> {x: date, y: price}[]
  data for returns graphic -> {x: date, y: returns}[]
}

  *search TODO in this document for missing tasks*/

export default function IndexPage() {
  //const user = useTypedSelector((state) => state.user);

  const [status, setStatus] = React.useState<any>("");
  const [index, setIndex] = useState<any>({});

  const [trigger, setTrigger] = useState<boolean>(false); // use to trigger useEffect to query data from backend each time some operation is done

  //modal controller
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let pathName = window.location.href; // If routing changes, change to pathname
    let idUrl = pathName.split("/")[5];
    // get index complete data

    console.log(idUrl);

    sampleIndexesData.forEach(index => {
      if (index.id === idUrl) {
        setIndex(index);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <div className="index-page">
      <BackButton />
      <div className={`header`}>
        <div className="main-info">
          <h2>{index.name ? index.name : "Unnamed Index"}</h2>
        </div>
        <div className="buttons">
          {/* <SearchButton />
          <SettingsButton /> */}
          <Buttons />
        </div>
      </div>
      <div className="index-data">
        <div className="main-info">
          <div className="index-info">
            <div className="index-detail">
              <p>Share price</p>
              <h2>{`${index.sharePrice ? index.sharePrice.toFixed(0) : "N/A"} PRIVI`}</h2>
            </div>
            <div className="index-detail">
              <p>Daily returns</p>
              <h3>{index.dailyReturns ? `${index.dailyReturns.toFixed(2)} PRIVI` : "N/A"}</h3>
            </div>
            <div className="index-detail">
              <p>Weekly returns</p>
              <h3>{index.weeklyReturns ? `${index.weeklyReturns.toFixed(2)} PRIVI` : "N/A"}</h3>
            </div>
            <div className="index-detail">
              <p>Monthly returns</p>
              <h3>{index.monthlyReturns ? `${index.monthlyReturns.toFixed(2)} PRIVI` : "N/A"}</h3>
            </div>
            <div className="index-detail">
              <p>Fund assets</p>
              <div className="assets">
                {index.assets
                  ? index.assets.map((asset, i) => {
                      if (i < 3) {
                        return (
                          <div
                            key={asset}
                            className="asset-image"
                            style={{
                              backgroundImage: `url(${require(`assets/tokenImages/${asset}.png`)})`,
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                        );
                      } else return null;
                    })
                  : null}

                {index.assets && index.assets.length > 3 ? (
                  <div className="asset-image">{`+${index.assets.length - 3}`}</div>
                ) : null}
              </div>
            </div>
            <button onClick={handleOpen}>{"Invest"}</button>
            <InvestModal open={open} handleClose={handleClose} userData={sampleUserData} index={index} />
          </div>
        </div>
        <div className="charts">
          <div className="charts-container">
            <div className="chart">
              <p>Share price</p>
              <span>{`Members ${index.members ? index.members : "N/A"}`}</span>
              <Graph data={sampleGraphData} />
            </div>
            <div className="chart">
              <p>Returns</p>
              <span>{`Total Returns ${index.totalReturns ? index.totalReturns : "N/A"} ${"PRIVI"}`}</span>
              <Graph data={sampleGraphData2} />
            </div>
          </div>
          <div className="right-content">
            <div>
              <p>Return Type</p>
              <h3>{index.type ? index.type : "N/A"}</h3>
            </div>
            <div>
              <p>Return</p>
              <h3>{index.return ? `${(index.return * 100).toFixed(0)}%` : "N/A%"}</h3>
            </div>
          </div>
        </div>
        <div className="lower-section">
          <h3>Portfolio Holdings</h3>
          <PortfolioHoldings holdings={sampleHoldings} />
        </div>
      </div>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
}
