import React, { useEffect, useState } from 'react';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { sampleExchanges } from '../../../../sampleData.js';
import ExchangesList from './components/ExchangesList';

export default function ExchangeTab() {
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [filteredExchanges, setFilteredExchanges] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState<number>(0);
  const tabOptions = ['All', 'FT', 'NFT PHYSICAL', 'NFT DIGITAL', 'CRYPTO'];

  useEffect(() => {
    //TODO: get real exchanges
    setExchanges(sampleExchanges);
    setFilteredExchanges(exchanges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //sort exchanges
    let filtered = [] as any[];

    exchanges.forEach((exchange) => {
      if (exchange.ExchangeMode.toUpperCase() === tabOptions[tabValue]) {
        filtered.push(exchange);
      }
    });

    setFilteredExchanges(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  return (
    <div className="exchange-tab">
      <AppBar position="static" className="appBarTabsToken">
        <Tabs
          TabIndicatorProps={{
            style: { background: '#64c89e', height: '3px' },
          }}
          value={tabValue}
          className="tabsToken"
          onChange={(event, newValue) => {
            setTabValue(newValue);
          }}
        >
          {tabOptions.map((name) => {
            return <Tab label={name} key={name} />;
          })}
        </Tabs>
      </AppBar>
      {tabValue === 0 ? (
        <ExchangesList exchanges={exchanges} />
      ) : filteredExchanges.length > 0 ? (
        <ExchangesList exchanges={filteredExchanges} />
      ) : null}
    </div>
  );
}
