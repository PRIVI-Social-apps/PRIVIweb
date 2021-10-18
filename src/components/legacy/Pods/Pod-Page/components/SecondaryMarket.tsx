import React, { useState, useRef, useEffect } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import "./SecondaryMarket.css";

const sampleData = [
  {
    Address: "0x5865a6s5d64f65",
    User: "Px04ef761d-2857-4b00-a6db-f6a8c47244af",
    Action: "Sold",
    Quantity: 23,
    Price: 10,
    Date: 1609170267040,
  },
  {
    Address: "0x5865a6s5d64f65",
    User: "Px2724ac32-c0eb-43f0-b2ea-49e84480d670",
    Action: "Auctioned",
    Quantity: 1,
    Price: 11.3,
    Date: 1609160267040,
  },
  {
    Address: "0x5865a6s5d64f65",
    User: "Px397a7c3e-76c5-453e-b27e-134642e3fd5c",
    Action: "Auctioned",
    Quantity: 1,
    Price: 7,
    Date: 1609150267040,
  },
  {
    Address: "0x5865a6s5d64f65",
    User: "Px81c9b56b-262f-437d-9ada-37fdcb5ea154",
    Action: "Auctioned",
    Quantity: 1,
    Price: 13,
    Date: 1609140267040,
  },
  {
    Address: "0x5865a6s5d64f65",
    User: "bubcg8rjfrvln6ve44s0bubcg8rjfrvln6ve44sg",
    Action: "Auctioned",
    Quantity: 1,
    Price: 12,
    Date: 1609010267040,
  },
  {
    Address: "0x5865a6s5d64f65",
    User: "budse1bjfrvln6ve4600budse1bjfrvln6ve460g",
    Action: "Sold",
    Quantity: 13,
    Price: 1,
    Date: 1608010267040,
  },
];

export default function SecondaryMarket(props) {
  const users = useTypedSelector((state) => state.usersInfoList);

  const [sortedList, setSortedList] = useState<any[]>([]);

  useEffect(() => {
    if (sampleData) {
      const marketSorted = [...sampleData] as any;

      if (users && users.length > 0) {
        marketSorted.forEach((item, index) => {
          if (users.some((user) => user.id === item.User)) {
            marketSorted[index].userInfo =
              users[users.findIndex((user) => user.id === item.User)];
          }
        });
      }

      marketSorted.sort((a, b) => b.Date - a.Date);

      setSortedList(marketSorted);
    }
    //to be changed by:
    /*if (props.pod && props.pod.Market.length > 0) {
      const marketSorted = [...props.pod.Market];
      marketSorted.sort((a, b) => b.Date - a.Date);

      setSortedList(marketSorted);
    }*/
  }, [props.pod]);

  if (sortedList && sortedList.length > 0)
    return (
      <div className="secondary-market">
        <h3>Pod tokens</h3>
        <div className="market-list">
          <div className="header">
            <p></p>
            <p>ACTION</p>
            <p>QUANTITY</p>
            <p>PRICE</p>
            <p>ADDRESS</p>
            <p>TIME</p>
          </div>
          <div className="body">
            {sortedList.map((row, index) => (
              <ListElement row={row} key={`${index}-market`} />
            ))}
          </div>
        </div>
      </div>
    );
  else return null;
}

const ListElement = (props) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    if (props.row) {
      getTime(props.row.Date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTime = (date) => {
    const difference = new Date().getTime() - date;
    if (difference / 1000 / 3600 > 24) {
      setTime(`${Math.ceil(difference / (1000 * 60 * 60 * 24))} days`);
    } else {
      setTime(`${(difference / 1000 / 3600).toFixed(0)} hours`);
    }
  };

  if (props.row) {
    return (
      <div className="row">
        <div className="user">
          <div
            className="user-image"
            style={{
              backgroundImage:
                props.row.userInfo &&
                props.row.userInfo.imageURL &&
                props.row.userInfo.imageURL.length > 0
                  ? `url(${props.row.userInfo.imageURL})`
                  : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <p>{(props.row.userInfo && props.row.userInfo.name) || ""}</p>
        </div>
        <p>{`${props.row.Action}`}</p>
        <p>{`${props.row.Quantity.toFixed(1)}`}</p>
        <p>{`${props.row.Price} PRIVI`}</p>
        <p>{`${props.row.Address}`}</p>
        <p>{`${time}`}</p>
      </div>
    );
  } else return null;
};
