import React from "react";
import CommunityPageHeader from "components/legacy/Communities/components/CommunityPageHeader";

import styles from "./index.module.scss";
import CommunityTabs from "components/legacy/Communities/components/CommunityTabs";

const CommunityProjects = () => {
  return (
    <div className={styles.container}>
      <CommunityPageHeader />
      <CommunityTabs />
      <span className={styles.comment}>Posted Projects</span>
      <div className={styles.modals}>
        <div className={styles.modal}>
          <div className={styles.budget}>Total budget 10 BAL</div>
          <h3>Name of the project</h3>
          <span>Description of the project and all the information</span>
          <div className={styles.other}>
            <span>32 positions</span>
            <span>20 applications</span>
            <div className={styles.track}>
              <i className={styles.seekbar} style={{ width: "50%" }} />
            </div>
          </div>
        </div>
        <div className={styles.modal}>
          <div className={styles.budget}>Total budget 10 BAL</div>
          <h3>Name of the project</h3>
          <span>Description of the project and all the information</span>
          <div className={styles.other}>
            <span>32 positions</span>
            <span>20 applications</span>
            <div className={styles.track}>
              <i className={styles.seekbar} style={{ width: "50%" }} />
            </div>
          </div>
        </div>
        <div className={styles.modal}>
          <div className={styles.budget}>Total budget 10 BAL</div>
          <h3>Name of the project</h3>
          <span>Description of the project and all the information</span>
          <div className={styles.other}>
            <span>32 positions</span>
            <span>20 applications</span>
            <div className={styles.track}>
              <i className={styles.seekbar} style={{ width: "50%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityProjects;
