import React, { useEffect, useState } from 'react';
import { getStyledTime } from 'shared/functions/getStyledTime';
import './LendingCard.css';

export default function LendingCard(props) {
  const [time, setTime] = useState<string>('');
  const [width, setWidth] = useState<number>(0);

  const handlePay = () => {
    //TODO: pay
  };

  useEffect(() => {
    //get date
    if (props.lending.DateDue) {
      setTime(
        getStyledTime(
          new Date().getTime(),
          new Date(props.lending.DateDue).getTime(),
          false
        )
      );
      //and bar width
      if (props.lending.CreationDate) {
        setWidth(
          new Date(props.lending.DateDue).getTime() -
            new Date().getTime() / new Date(props.lending.DateDue).getTime() -
            new Date(props.lending.CreationDate).getTime()
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="lending-card">
      <div className="row">
        <div className="column">
          <span>{props.lending.Payed ? 'Lent' : 'Lend'}</span>
          <p>{props.lending.Amount}PRIVI</p>
        </div>
        <button
          onClick={handlePay}
          className={props.lending.Payed ? 'payed' : undefined}
        >
          {props.lending.Payed
            ? `Reward ${props.lending.Reward}PRIVI`
            : `Pay ${props.lending.Amount}PRIVI`}
        </button>
      </div>
      <div className="bottom">
        <div className="row">
          <div className="column">
            <span>Payment due</span>
            <p>{time}</p>
          </div>
          <div className="column">
            <span>Collateral</span>
            <p>
              {props.lending.Collateral.Quantity}
              {props.lending.Collateral.Token}
            </p>
          </div>
          <div className="column">
            <span>Interest</span>
            <p>
              {props.lending.Interest
                ? `${(props.lending.Interest * 100).toFixed(0)}%`
                : ''}
            </p>
          </div>
        </div>
        <div className="bar-container">
          <div className="color-bar" style={{ width: `${width}%` }} />
        </div>
      </div>
    </div>
  );
}
