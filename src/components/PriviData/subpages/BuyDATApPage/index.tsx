import React, { useState } from "react";
import classnames from 'classnames';

import Box from 'shared/ui-kit/Box';
import { Dropdown } from 'shared/ui-kit/Dropdown';
import DATApChartConfig from "components/PriviData/components/DATApGraph/configs/DATApChartConfig";
import PrintDATApChart from "components/PriviData/components/DATApGraph/DATApChart";
import { Transaction } from "./components/Transactions";

import imageDATApBig from "assets/priviDataImages/dataDATApBig.png";
import imageDATApSmall from "assets/priviDataImages/dataDATApSmall.png";
import imageDao from "assets/priviDataImages/dataDao.png";
import testAdImage from "assets/backgrounds/digital.jpeg";
import { ReactComponent as DropUpIcon } from "assets/icons/arrow-left.svg";

import { buyDATApPageStyles } from './index.styles';

const DATApGraphOptions = ['1D', '7D', '1M', '3M', '1D', 'YTD'];

export default function BuyDATApPage() {
  const classes = buyDATApPageStyles();
  const [datapChartConfig, setDatapChartConfig] = useState<any>(DATApChartConfig);

  return (
    <div className={classes.root}>
      <div className={classes.mainContainer}>
        <div className={classes.header}>
          <div className={classes.headerTitle}>
            <span className="data-logo">Buy</span>
            {` `}DATAp
          </div>
          <div className="gradient-effect">
            <div className={classnames(classes.gradientImage, "secondary")} />
          </div>
          <img className="first-header-image" src={imageDATApSmall} alt="" />
          <img className="second-header-image" src={imageDao} alt="" />
        </div>
        <Box className={classes.tradeContainer} display="flex" alignItems="center" justifyContent="space-between">
          <img src={imageDATApBig} alt="" />
          <Box display="flex" flexDirection="column" justifyContent="center" gridRowGap={12}>
            <span className="trade-title">I have</span>
            <Box display="flex" alignItems="center" gridColumnGap={4}>
              <input className="trade-value" placeholder="0.00" />
              <Dropdown className={classes.currencyUnit}>
                <div key="closed" className={classes.dropdownItem}>
                  <img src={testAdImage} alt="" />
                  <span>Privi</span>
                </div>
                <div
                  key="opened"
                  className={classes.dropdownContent}
                >
                  <div className={classes.dropdownItem}>
                    <img src={testAdImage} alt="" />
                    <span>Privi</span>
                  </div>
                  <div className={classes.dropdownItem}>
                    <img src={testAdImage} alt="" />
                    <span>DATAp</span>
                  </div>
                </div>
              </Dropdown>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <span className="user-own-value">Available: 4544 Privi</span>
              <span className="user-own-value use-max">Use Max</span>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="center" gridRowGap={12}>
            <Box height={26} />
            <div className={classes.exchangeButton}>
              <DropUpIcon />
              <DropUpIcon className="ex-arrwo-right" />
            </div>
            <Box height={16} />
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="center" gridRowGap={12}>
            <span className="trade-title">I’ll Get</span>
            <Box display="flex" alignItems="center" gridColumnGap={4}>
              <input className="trade-value" placeholder="0.00" />
              <Dropdown className={classes.currencyUnit}>
                <div key="closed" className={classes.dropdownItem}>
                  <img src={testAdImage} alt="" />
                  <span>DATAp</span>
                </div>
                <div
                  key="opened"
                  className={classes.dropdownContent}
                >
                  <div className={classes.dropdownItem}>
                    <img src={testAdImage} alt="" />
                    <span>Privi</span>
                  </div>
                  <div className={classes.dropdownItem}>
                    <img src={testAdImage} alt="" />
                    <span>DATAp</span>
                  </div>
                </div>
              </Dropdown>
              <div className={classes.tradeButton}>Trade</div>
            </Box>
            <Box height={16} />
          </Box>
        </Box>
        <Box
          mt={6}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gridColumnGap={40}
        >
          <div className={classes.dataInfo}>
            <div className="data-title">Privi - USD</div>
            <div className="data-content">
              <Box display="flex" flexDirection="column" gridRowGap={10}>
                <span className="data-field">Price</span>
                <span className="data-value">$34</span>
                <span className="data-field positive">+3 (+11.5%)</span>
              </Box>
              <Box display="flex" flexDirection="column" gridRowGap={10}>
                <span className="data-field">Total Supply</span>
                <span className="data-value">$1,897,007</span>
                <span className="data-field positive">$1,897,007</span>
              </Box>
            </div>
          </div>
          <div className={classes.dataInfo}>
            <div className="data-title">DATAp - USD</div>
            <div className="data-content">
              <Box display="flex" flexDirection="column" gridRowGap={10}>
                <span className="data-field">Price</span>
                <span className="data-value">$0.6</span>
                <span className="data-field negetive">-0.1 (-0.01%)</span>
              </Box>
              <Box display="flex" flexDirection="column" gridRowGap={10}>
                <span className="data-field">Total Supply</span>
                <span className="data-value">$812,587</span>
                <span className="data-field negetive">-3787 (-1.5%)</span>
              </Box>
            </div>
          </div>
        </Box>
        <div className={classes.dataGraphContainer}>
          <Box
            display="flex"
            alignItems="center"
            width="100%"
            justifyContent="space-between"
            mb={2}
          >
            <span className="graph-title">
              DATAp - USD
            </span>
            <div className={classes.graphControlButtons}>
              {DATApGraphOptions.map((item, index) => (
                <div key={`datap-graph-${index}`} className={index === 0 ? 'selected' : ''}>
                  {item}
                </div>
              ))}
            </div>
          </Box>
          {PrintDATApChart(datapChartConfig)}
        </div>
        <Box mt={10}>
          <Transaction />
        </Box>
      </div>
    </div>
  );
}
