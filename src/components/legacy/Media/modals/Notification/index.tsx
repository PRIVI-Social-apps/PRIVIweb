import React from "react";
import Moment from "react-moment";
import styles from "./index.module.scss";

const Notification = props => {
  return (
    <div className={styles.wrapper} style={props.style}>
      <div className={styles.emoji}>{props.emoji}</div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span>{props.title}</span>
          <span>
            <Moment format={"kk:mm"}>{new Date()}</Moment>
          </span>
        </div>
        <div className={styles.body} dangerouslySetInnerHTML={{ __html: props.content }} />
      </div>
    </div>
  );
};

export default Notification;
