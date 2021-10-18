import React, { useEffect, useState } from "react";
import "./MyActivity.css";
import ActivityItem from "./components/ActivityItem";
import {
  sampleExchanges,
  sampleLendings,
  sampleAuctions,
} from "../../sampleData";
import SearchSidebar from "../../SearchSidebar/SearchSidebar";
import { useTypedSelector } from "store/reducers/Reducer";

export default function MyActivity() {
  const user = useTypedSelector((state) => state.user);
  const users = useTypedSelector((state) => state.usersInfoList);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    //TODO: load real data
    const exchanges = [...sampleExchanges];
    const lendings = [...sampleLendings];
    const auctions = [...sampleAuctions];

    const allActivity = [] as any[];

    exchanges.forEach((exchange) => {
      if (exchange.Creator === user.id) {
        let e: any = { ...exchange };
        e.exchange = true;
        allActivity.push(e);
      }
    });

    lendings.forEach((lending) => {
      if (
        lending.Creator === user.id &&
        lending.Offers &&
        lending.Offers.length > 0
      ) {
        let l: any = { ...lending };
        l.borrow = true;
        lending.Offers.forEach((offer) => {
          if (offer.Accepted === true) {
            users.forEach((u) => {
              if (u.id === offer.User) {
                l.user = u;
                return;
              }
            });
            return;
          }
        });

        allActivity.push(l);
      } else {
        lending.Offers.forEach((offer) => {
          if (offer.User === user.id && offer.Accepted === true) {
            let l: any = { ...lending };
            l.lend = true;
            users.forEach((u) => {
              if (u.id === lending.Creator) {
                l.user = u;
                return;
              }
            });
            allActivity.push(l);
            return;
          }
        });
      }
    });

    auctions.forEach((auction) => {
      if (auction.DateDue < new Date().getTime()) {
        let highestBid = 0;
        auction.Bids.forEach((bid) => {
          if (bid.Amount > highestBid) {
            highestBid = bid.Amount;
          }
        });
        auction.Bids.forEach((bid) => {
          if (bid.Amount === highestBid && bid.User === user.id) {
            let a: any = { ...auction };
            a.auction = true;
            allActivity.push(a);
            return;
          }
        });
      }
    });

    allActivity.sort((a, b) => b.EndDate - a.EndDate);

    setActivity(allActivity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="growth-activity">
      <div className="content-wrapper">
        <h3>My activity</h3>
        <div className="activity-items">
          {activity.length > 0 ? (
            activity.map((item) => {
              return <ActivityItem item={item} />;
            })
          ) : (
            <p>No activity</p>
          )}
        </div>
      </div>
      <SearchSidebar />
    </div>
  );
}
