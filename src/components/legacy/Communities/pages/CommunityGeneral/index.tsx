import React from "react";
import CommunityPageHeader from "components/legacy/Communities/components/CommunityPageHeader";

import styles from "./index.module.scss";
import CommunityTabs from "components/legacy/Communities/components/CommunityTabs";

const CommunityGeneralPage = () => {
  return (
    <div className={styles.container}>
      <CommunityPageHeader />
      <CommunityTabs />
      <span className={styles.comment}>No Post available</span>
      <div className={styles.modals}>
        <div className={styles.modal}>
          <h3>Current Poll</h3>
          <h5>No data to display</h5>
          <span>How much do you love Privi Founders?</span>
          <button type="button" className={styles.button}>
            View have already vote
          </button>
        </div>
        <div className={styles.modal}>
          <h3>
            DAO proposal
            <span className={styles.badge}>New</span>
          </h3>
          <h5>No data to display</h5>
          <span>Should Privi foundrs are require new joing rules?</span>
          <button type="button" className={styles.button}>
            Vote on this proposal
          </button>
        </div>
        <div className={styles.modal}>
          <h3>Event Calendar</h3>
          <h5>No data to display</h5>
        </div>
      </div>
    </div>
  );
};

export default CommunityGeneralPage;
