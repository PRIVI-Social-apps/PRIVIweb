import React, { useState } from "react";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import AuctionStartModal from "../AuctionStartModal";
import Notification from "../Notification";
import styles from "./index.module.scss";

const AuctionDetailModal = props => {
  const [openStartAuctionModal, setOpenStartAuctionModal] = useState(false);
  const [notifications, setNotificaitons] = useState<any[]>([]);

  if (openStartAuctionModal) {
    return <AuctionStartModal open={true} handleClose={() => setOpenStartAuctionModal(false)} />;
  }

  const handleDecline = () => {
    const newNotification = {
      emoji: "😔",
      title: "Auction Ended",
      content: "We’re sorry! <b>User Name</b> declined your offer on <b>Road Trip Anomaly.</b>",
    };
    setNotificaitons([...notifications, newNotification]);
  };

  const handleAccept = () => {
    const newNotification = {
      emoji: "🤑",
      title: "Auction Ended",
      content: "Congratulations! <b>User Name</b> accepted your offer on <b>Road Trip Anomaly.</b>",
    };
    setNotificaitons([...notifications, newNotification]);
  };

  return (
    <Modal size="medium" isOpen={props.open} onClose={props.handleClose} className={styles.modal} showCloseIcon={true}>
      <div className={styles.modalContent}>
        <div className={styles.content}>
          <h2>Auction Details</h2>
          <div className={styles.auctionMainInfo}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHGGhx7CWKSlXRyinSN2bbiwKjTpg331KnCeiWBHex7cIUcw9ELnj_meQgYKdiiSROe3k&usqp=CAU" />
            <div className={styles.flexCol}>
              <span>Road Trip Anomaly</span>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunta. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunta incididunta.
              </p>
            </div>
          </div>
          <div className={styles.auctionInfo}>
            <div className={styles.flexCol}>
              <h5>🔥 Top bid</h5>
              <h3>ETH 1.256</h3>
              <span>$3,200</span>
            </div>
            <div className={styles.flexCol}>
              <h5>Offered By</h5>
              <div className={styles.flexRow}>
                <img src="https://www.liveabout.com/thmb/7LQKAPcHZ1oWoZuxEn1rsBYryMc=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/Avatar_12_HR_01-56a00ca93df78cafda9fd17c.jpg" />
                <div className={styles.flexCol}>
                  <h6>User Name</h6>
                  <span className={styles.userName}>@User_name</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.actionButtons}>
            <SecondaryButton size="medium" onClick={() => handleDecline()}>
              Decline
            </SecondaryButton>
            <SecondaryButton size="medium" onClick={() => setOpenStartAuctionModal(true)}>
              Decline and Restart Auction
            </SecondaryButton>
            <PrimaryButton size="medium" onClick={() => handleAccept()}>
              Accept offer
            </PrimaryButton>
          </div>
        </div>
      </div>
      {notifications.map((notification, index) => (
        <Notification
          {...notification}
          key={index}
          style={{ position: "fixed", top: `${100 + index * 150}px`, right: "40px" }}
        />
      ))}
    </Modal>
  );
};

export default AuctionDetailModal;
