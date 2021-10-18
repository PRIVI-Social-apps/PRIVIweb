import React from "react";
import CommunityPageHeader from "components/legacy/Communities/components/CommunityPageHeader";

import styles from "./index.module.scss";
import CommunityTabs from "components/legacy/Communities/components/CommunityTabs";

const CommunityDashboard = () => {
  return (
    <div className={styles.container}>
      <CommunityPageHeader />
      <CommunityTabs />
      <div className={styles.modals}>
        <div className={styles.modal}>
          <span>Conversations this month</span>
          14
        </div>
        <div className={styles.modal}>
          <span>Comments this month</span>
          67
        </div>
        <div className={styles.modal}>
          <span>Total volume this month</span>
          N/A
        </div>
        <div className={styles.modal}>
          <span>Comments</span>
          768
        </div>
        <div className={styles.wideModal}>
          <div className={styles.heading}>Weekly reward progress</div>
          <div className={styles.info}>
            <div className={styles.item}>
              Rewards
              <b>14</b>
            </div>
            <div className={styles.item}>
              APY
              <b>N/A %</b>
            </div>
          </div>
          <div className={styles.progress}>
            Distributed in 11d 23h 33min
            <div className={styles.track}>
              <i className={styles.seekbar} style={{ width: "50%" }} />
            </div>
          </div>
          <div className={styles.other}>
            <div className={styles.otherItem}>
              <b>N/A</b>Average balance this week
            </div>
            <div className={styles.otherItem}>
              <b>N/A</b>Average balance last four week
            </div>
          </div>
        </div>
        <div className={styles.wideModal}>
          <div className={styles.heading}>
            <div>
              Salutes <small>Last Cred</small>
            </div>
            <span>View all</span>
          </div>
          <div className={styles.award}>
            <div className={styles.awardItem}>
              Awards this week<b>N/A</b>
            </div>
            <div className={styles.awardItem}>
              Creds this week<b>N/A</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDashboard;
