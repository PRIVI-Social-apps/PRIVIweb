import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { sampleUserData } from "../sampleData";
import "./IndexesList.css";

import InvestModal from "./InvestModal";

export default function IndexesList(props) {
  const [sortedList, setSortedList] = useState<any[]>([]);

  useEffect(() => {
    if (props.indexes && props.indexes.length > 0) {
      const indexesSorted = [...props.indexes];
      indexesSorted.sort((a, b) => b.shares - a.shares);

      setSortedList(indexesSorted);
    }
  }, [props.indexes]);

  if (props.indexes.length > 0 && props.indexes)
    return (
      <div className="indexes-list">
        <div className="header">
          <p className="name">NAME</p>
          <p className="shares">SHARES</p>
          <p className="return-type">RETURN TYPE</p>
          <p className="assets">ASSETS</p>
          <p className="performance-all">PERFORMANCE ALL TIME</p>
          <p className="performance-month">PERFORMANCE MONTH</p>
          <p className="share-price">SHARE PRICE (PRIVI)</p>
        </div>
        <div className="body">
          {sortedList.map((row) => (
            <IndexRow row={row} key={row.id} />
          ))}
        </div>
      </div>
    );
  else
    return (
      <div className="centered-info">
        <p>No indexes to show</p>
      </div>
    );
}

//index row as a separate component to open modals as individuals
const IndexRow = (props) => {
  const history = useHistory();

  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="row">
      <div
        className="main"
        onClick={() => {
          history.push(`/index/${props.row.id}`);
        }}
      >
        <p className="name">{props.row.name}</p>
        <p className="shares">{props.row.shares}</p>
        <p className="return-type">{props.row.returnType}</p>
        <div className="assets">
          {props.row.assets.map((asset, index) => {
            if (index < 3) {
              return (
                <div
                  key={asset}
                  className="asset-image"
                  style={{
                    backgroundImage: `url(${require(`assets/tokenImages/${
                      asset === "LINK" ? "LNK" : asset
                    }.png`)})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              );
            } else return null;
          })}

          {props.row.assets.length > 3 ? (
            <div className="asset-image">{`+${
              props.row.assets.length - 3
            }`}</div>
          ) : null}
        </div>
        <p className="performance-all">{props.row.performanceAllTime}</p>
        <p className="performance-month">{props.row.performanceMonth}</p>
        <p className="share-price">{props.row.sharePrice}</p>
      </div>
      <div className="button">
        <button className="invest" onClick={handleOpen}>
          {"Invest"}
        </button>
        <InvestModal
          index={props.row}
          open={open}
          handleClose={handleClose}
          userData={sampleUserData}
        />
      </div>
    </div>
  );
};
