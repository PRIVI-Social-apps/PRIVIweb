import React from "react";
import CommunityPageHeader from "components/legacy/Communities/components/CommunityPageHeader";
import AvatarImage from "assets/anonAvatars/ToyFaces_Colored_BG_111.jpg";
import Avatar from "shared/ui-kit/Avatar";
import styles from "./index.module.scss";
import CommunityTabs from "components/legacy/Communities/components/CommunityTabs";

const CommunityPayment = () => {
  return (
    <div className={styles.container}>
      <CommunityPageHeader />
      <CommunityTabs />
      <div className={styles.modals}>
        <div className={styles.founders}>
          <Avatar
            image={AvatarImage}
            rounded
            variant={styles.founder}
            size={80}
          />
          <div className={styles.title}>
            Balance
            <b>$400 Privi Founders</b>
          </div>
        </div>
        <div className={styles.history}>Paymet history</div>
        <div className={styles.modal}>
          <span>Payment made</span>
          14
        </div>
        <div className={styles.modal}>
          <span>Payments received</span>
          67
        </div>
        <div className={styles.modal}>
          <div className={styles.item}>
            <Avatar
              image={AvatarImage}
              rounded
              variant={styles.avatar}
              size={30}
            />
            Zach sent 40 USDT
          </div>
          <div className={styles.item}>
            <Avatar
              image={AvatarImage}
              rounded
              variant={styles.avatar}
              size={30}
            />
            Zach sent 40 USDT
          </div>
          <div className={styles.item}>
            <Avatar
              image={AvatarImage}
              rounded
              variant={styles.avatar}
              size={30}
            />
            Zach sent 40 USDT
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPayment;
