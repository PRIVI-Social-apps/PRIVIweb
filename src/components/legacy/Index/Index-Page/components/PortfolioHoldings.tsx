import React, { useState, useEffect } from 'react';
import './PortfolioHoldings.css';

export default function PortfolioHoldings(props) {
  const [sortedList, setSortedList] = useState<any[]>([]);

  useEffect(() => {
    if (props.holdings && props.holdings.length > 0) {
      const holdingsSorted = [...props.holdings];
      holdingsSorted.sort((a, b) => b.value - a.value);

      setSortedList(holdingsSorted);
    }
  }, [props.holdings]);

  if (props.holdings.length > 0 && props.holdings)
    return (
      <div className="holdings-list">
        <div className="header">
          <p>NAME</p>
          <p>BALANCE</p>
          <p>VALUE</p>
          <p>CHANGE</p>
          <p>ALLOCATION</p>
        </div>
        <div className="body">
          {sortedList.map((row) => (
            <div className="row" key={row.id}>
              <div className="main">
                <div className="name">
                  <img
                    src={require(`assets/tokenImages/${row.name}.png`)}
                    alt={row.name}
                  />
                  <p>{row.name}</p>
                </div>
                <p>{`${row.balance}`}</p>
                <p>{`${row.value} PRIVI`}</p>
                <p>{`${row.change > 0 ? '+' : '-'} ${(row.change * 100).toFixed(
                  2
                )}%`}</p>
                <p>{`${(row.allocation * 100).toFixed(0)}%`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  else
    return (
      <div className="centered-info">
        <p>No holdings to show</p>
      </div>
    );
}
