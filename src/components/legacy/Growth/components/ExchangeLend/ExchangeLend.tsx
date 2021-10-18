import React, { useEffect, useState } from 'react';
import SearchSidebar from '../../SearchSidebar/SearchSidebar';
import './ExchangeLend.css';
import LendTab from './components/Lend/LendTab';
import AuctionTab from './components/Auction/AuctionTab';
import ExchangeTab from './components/Exchange/ExchangeTab';

export default function ExchangeLend(props) {
  return (
    <div className="exchange-lend">
      <div className="content-wrapper">
        <div className="title">
          <h3>{props.exchangeOption}</h3>
          <div className="option-buttons">
            <button
              className={
                props.exchangeOption === 'Exchange' ? 'selected' : undefined
              }
              onClick={() => {
                props.setExchangeOption('Exchange');
              }}
            >
              Exchange
            </button>
            <button
              className={
                props.exchangeOption === 'Lend' ? 'selected' : undefined
              }
              onClick={() => {
                props.setExchangeOption('Lend');
              }}
            >
              Lend
            </button>
            <button
              className={
                props.exchangeOption === 'Auction' ? 'selected' : undefined
              }
              onClick={() => {
                props.setExchangeOption('Auction');
              }}
            >
              Auction
            </button>
          </div>
        </div>
        {props.exchangeOption === 'Exchange' ? (
          <ExchangeTab />
        ) : props.exchangeOption === 'Lend' ? (
          <LendTab />
        ) : (
          <AuctionTab />
        )}
      </div>
      <SearchSidebar />
    </div>
  );
}
