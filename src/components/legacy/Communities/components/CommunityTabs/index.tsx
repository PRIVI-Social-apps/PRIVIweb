import React from "react";
import cls from "classnames";
import styles from "./index.module.scss";

const CommunityTabs = () => {
  return (
    <div className={styles.tabs}>
      <div className={cls(styles.tab, styles.active)}>General</div>
      <div className={styles.tab}>Discussion</div>
      <div className={styles.tab}>Dashboard</div>
      <div className={styles.tab}>Payments</div>
      <div className={styles.tab}>Projects</div>
      <div className={styles.tab}>Treasury</div>
      <div className={styles.tab}>Members</div>
      <div className={styles.tab}>Jarr</div>
      <div className={styles.tab}>Vesting and Taxation</div>
    </div>
  );
};

export default CommunityTabs;
