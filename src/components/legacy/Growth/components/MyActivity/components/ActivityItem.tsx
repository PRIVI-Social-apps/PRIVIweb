import React, { useEffect, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import "./ActivityItem.css";

export default function ActivityItem(props) {
  const user = useTypedSelector((state) => state.user);
  const [bid, setBid] = useState(0);

  useEffect(() => {
    if (props.item.auction && props.item.Bids && props.item.Bids.length > 0) {
      props.item.Bids.forEach((bid) => {
        if (bid.User === user.id) {
          setBid(bid.Amount);
          return;
        }
      });
    }
  }, []);
  console.log(props.item);
  if (props.item)
    return (
      <div className="activity-item">
        <div className="user">
          <div
            className="image"
            style={{
              backgroundImage:
                props.item.auction &&
                props.item.AuctionImageURL &&
                props.item.AuctionImageURL.length > 0
                  ? `url(${props.item.AuctionImageURL})`
                  : props.item.user &&
                    props.item.user.imageURL &&
                    props.item.user.imageURL.length > 0
                  ? `url(${props.item.user.imageURL})`
                  : props.item.exchange && props.item.Token
                  ? `url(${require(`assets/tokenImages/${props.item.Token}.png`)})`
                  : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {props.item.borrow
            ? `${props.item.user.name} borrowed ${props.item.Amount} PRIVI from you`
            : props.item.lend
            ? `You've borrowed ${props.item.Amount} PRIVI from ${props.item.user.name}`
            : props.item.auction
            ? `You have won in an auction for ${props.item.Item}, paid ${bid} PRIVI`
            : props.item.exchange
            ? `You have ${
                props.item.Proposals ? props.item.Proposals.length : ""
              } offers for exchange of ${props.item.Quantity} ${
                props.item.Token
              }`
            : ""}
        </div>
        {props.item.borrow === undefined ? (
          <button>
            {props.item.lend
              ? `Pay ${props.item.Amount}PRIVI`
              : props.item.auction
              ? "View item"
              : props.item.exchange
              ? props.item.Proposals.length > 0
                ? "View Offers"
                : "View Offer"
              : ""}
          </button>
        ) : null}
      </div>
    );
  else return null;
}
