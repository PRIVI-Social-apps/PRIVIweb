import React, { useEffect, useState } from "react";
import axios from "axios";

import { useTypedSelector } from "store/reducers/Reducer";
import PaymentItem from "./components/PaymentItem";

import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import "./Payments.css";

export default function Payments(props) {
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const [paymentsHistory, setPaymentsHistory] = useState<any[]>([]);
  const [userCommunityBalanceData, setUserCommunityBalanceData] = useState<any>({
    Balance: 0,
    PaymentsReceived: 0,
    PaymentesMade: 0,
  });
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const loadData = () => {
    const config = {
      params: {
        communityAddress: props.community.CommunityAddress,
        communityToken: props.community.TokenSymbol,
        userId: user.id,
        userAddress: user.address,
      },
    };

    setIsDataLoading(true);

    axios
      .get(`${URL()}/community/getUserPaymentData`, config)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          const data = resp.data;
          const newUserCommunityBalanceData = data.UserCommunityBalanceData;
          setUserCommunityBalanceData(newUserCommunityBalanceData);

          let payments = [...data.PaymentHistory];

          payments.forEach((paymentInfo, index) => {
            if (
              users &&
              users.length > 0 &&
              users.some(u => u.id === paymentInfo.Receiver && u.id !== user.id)
            ) {
              payments[index].receiverData = {
                name: users[users.findIndex(u => u.id === paymentInfo.Receiver && u.id !== user.id)].name,
                imageURL:
                  users[users.findIndex(u => u.id === paymentInfo.Receiver && u.id !== user.id)].imageURL,
              };
            } else {
              payments[index].receiverData = {
                name: "",
                imageURL: "",
              };
            }
            if (
              users &&
              users.length > 0 &&
              users.some(u => u.id === paymentInfo.Sender && u.id !== user.id)
            ) {
              payments[index].senderData = {
                name: users[users.findIndex(u => u.id === paymentInfo.Sender && u.id !== user.id)].name,
                imageURL:
                  users[users.findIndex(u => u.id === paymentInfo.Sender && u.id !== user.id)].imageURL,
                levels: users[users.findIndex(u => u.id === paymentInfo.Sender && u.id !== user.id)].level,
                verified:
                  users[users.findIndex(u => u.id === paymentInfo.Sender && u.id !== user.id)].verified,
              };
            } else {
              payments[index].senderData = {
                name: "",
                imageURL: "",
              };
            }
            if (
              users &&
              users.length > 0 &&
              users.some(u => u.id === paymentInfo.Buyer && u.id !== user.id)
            ) {
              payments[index].buyerData = {
                name: users[users.findIndex(u => u.id === paymentInfo.Buyer && u.id !== user.id)].name,
                imageURL:
                  users[users.findIndex(u => u.id === paymentInfo.Buyer && u.id !== user.id)].imageURL,
                levels: users[users.findIndex(u => u.id === paymentInfo.Buyer && u.id !== user.id)].level,
                verified:
                  users[users.findIndex(u => u.id === paymentInfo.Buyer && u.id !== user.id)].verified,
              };
            } else {
              payments[index].buyerData = {
                name: "",
              };
            }
          });

          setPaymentsHistory(payments);
        }

        setIsDataLoading(false);
      })
      .catch(e => {
        setIsDataLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [users, props.community]);

  return (
    <div className="payments flex gap-24" style={{ display: "block" }}>
      <LoadingWrapper loading={isDataLoading}>
        <>
          <div
            className="balance"
            style={{ display: "flex", alignItems: "flex-start", width: "100%", border: "none" }}
          >
            <div className="flex heading-balance">
              <div
                className="token-image"
                style={{
                  backgroundImage:
                    props.community.TokenSymbol !== ""
                      ? `url(${URL()}/wallet/getTokenPhoto/${props.community.TokenSymbol})`
                      : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="balance-text">
                <span className="font1470 grey">Balance</span>
                <p className="font2240 margin-top-12">
                  {`$${userCommunityBalanceData.Balance.toFixed(6)} ${props.community.TokenSymbol}`}
                </p>
              </div>
            </div>
            {props.community.TokenSymbol && (
              <div className="card">
                <span className="font1470 grey">Payments made</span>
                <p className="font2240 margin-top-12">{`${userCommunityBalanceData.PaymentsMade}`}</p>
              </div>
            )}
            {props.community.TokenSymbol && (
              <div className="card">
                <span className="font1470 grey">Payments received</span>
                <p className="font2240 margin-top-12">{`${userCommunityBalanceData.PaymentsReceived}`}</p>
              </div>
            )}
          </div>

          <div className="history">
            <h3 className="font2240">Payments history</h3>
            <div className="historyBox">
              {paymentsHistory.length > 0 && (
                <div style={{ display: "flex", justifyContent: "space-around", fontSize: "1.5rem" }}>
                  <div className="font1840" style={{ border: "none" }}>
                    User
                  </div>
                  <div className="font1840" style={{ border: "none" }}>
                    Amount
                  </div>
                  <div className="font1840" style={{ border: "none" }}>
                    Date
                  </div>
                  <div className="font1840" style={{ border: "none" }}>
                    Concept
                  </div>
                </div>
              )}
              {paymentsHistory.length > 0 ? (
                paymentsHistory.map((payment, index) => {
                  return (
                    <PaymentItem
                      key={`${index}-paymentitem`}
                      payment={payment}
                      token={props.community.FundingToken}
                    />
                  );
                })
              ) : (
                <p>No history</p>
              )}
            </div>
          </div>
        </>
      </LoadingWrapper>
    </div>
  );
}
