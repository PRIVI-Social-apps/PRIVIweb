import React from 'react';
import DigitalChart from '../DigitalChart/DigitalChart';
import styles from './DigitalChartGrid.module.scss';


const DigitalChartGrid = (props) => {
  return (
    <div className={styles.digital_charts}>
      {DigitalChart("Fraction Price (1%)", props.priceChart)}
      {DigitalChart("Shared Ownership History", props.ownershipChart)}
    </div>
  );
};

export default DigitalChartGrid;
