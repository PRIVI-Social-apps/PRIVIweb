import React from "react";

export default function PaymentItem(props) {
  if (props.payment)
    return (
      <div className="row payment-item">
        <div style={{ display: "flex", alignItems: "center", border: "none" }} className="payment-cell">
          <div
            className="payment-image"
            style={{
              backgroundImage:
                props.payment.senderData &&
                props.payment.senderData.imageURL &&
                props.payment.senderData.imageURL.length > 0
                  ? `url(${props.payment.senderData.imageURL})` // case sender
                  : props.payment.receiverData &&
                    props.payment.receiverData.imageURL &&
                    props.payment.receiverData.imageURL.lenght > 0
                  ? `url(${props.payment.receiverData.imageURL})` // case receiver
                  : props.token && props.token.length > 0
                  ? `url(${require(`assets/tokenImages/${props.token}.png`)})`
                  : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div style={{ textAlign: "start" }}>
            <div className="font1440">{props.payment.senderData.name}</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  background: "linear-gradient(90deg, #ff79d1 0%, #db00ff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "14px",
                  fontWeight: 400,
                }}
              >
                {props.payment.senderData.name}
              </div>
              {props.payment.senderData.verified && props.payment.senderData.verified === true ? (
                <img
                  src={require("assets/icons/verified_mint.png")}
                  alt={`tick`}
                  style={{ width: "16px", height: "16px", marginLeft: "8px" }}
                />
              ) : null}
              <div
                style={{
                  border: "1px solid #707582",
                  borderRadius: "16px",
                  marginLeft: "8px",
                  fontSize: "11px",
                  fontWeight: 400,
                  color: "#707582",
                  padding: "2px 3px",
                }}
              >
                {`level ${props.payment.senderData.levels ?? 1}`}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ color: "#707582" }}
          className="payment-cell"
        >{`${props.payment.Quantity} ${props.payment.Token}`}</div>
        <div style={{ color: "#707582" }} className="payment-cell">
          {new Date(props.payment.Date * 1000).toDateString()}
        </div>
        <div style={{ color: "#707582" }} className="payment-cell">
          Transfer
        </div>
      </div>
    );
  else return null;
}
