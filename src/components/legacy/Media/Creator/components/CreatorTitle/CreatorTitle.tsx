import React from 'react';
import styles from './index.module.scss';

export default function CreatorTitle() {
  return (
    <div className={styles.title}>
      <h1>
        DISCOVER CREATORS
      </h1>
      <img src={require('assets/creatorImages/creatorTitleImage.png')} alt=""/>
    </div>
  );
}
