import React from "react";
import AvatarImage from "assets/anonAvatars/ToyFaces_Colored_BG_111.jpg";
import Avatar from "shared/ui-kit/Avatar";

import styles from "./index.module.scss";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const CommunityPageHeader = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.founder}>
          <Avatar
            image={AvatarImage}
            rounded
            variant={styles.foundAvatar}
            size={120}
          />
          <div className={styles.title}>
            <b>
              Privi Founders<small>(culture)</small>
            </b>
            <span>@privifounders</span>
          </div>
          <div className={styles.badge}>
            156
            <div>Members</div>
          </div>
        </div>

        <div className={styles.creators}>
          Creators
          <Avatar
            image={AvatarImage}
            rounded
            variant={styles.createAvatar}
            size={60}
          />
          <Avatar
            image={AvatarImage}
            rounded
            variant={styles.createAvatar}
            size={60}
          />
          <Avatar
            image={AvatarImage}
            rounded
            variant={styles.createAvatar}
            size={60}
          />
        </div>
      </div>
      <div className={styles.sidebar}>
        <div className={styles.joining}>
          <div className={styles.joinTitle}>Joining rules</div>
          <div className={styles.joinBody}>{`👛 Buy 1000 Privi Tokens`}</div>
          <div className={styles.joinBody}>{`2️⃣ Joining rules`}</div>
          <div className={styles.joinBody}>{`Twitter`}</div>
        </div>
        <div className={styles.email}>
          Email
          <div className={styles.actions}>
            <InputWithLabelAndTooltip
              overriedClasses={styles.input}
              type="text" />
            <button type="button" className={styles.button}>
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPageHeader;
