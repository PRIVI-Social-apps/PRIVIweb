import React, { useState, useEffect } from 'react';
import './ExchangesList.css';
import { useTypedSelector } from 'store/reducers/Reducer';

import AcceptExchangeModal from '../modals/AcceptExchangeModal';
import OfferExchangeModal from '../modals/OfferExchangeModal';
import { getStyledTime } from 'shared/functions/getStyledTime';

export default function ExchangesList(props) {
  const [sortedList, setSortedList] = useState<any[]>([]);

  useEffect(() => {
    if (props.exchanges && props.exchanges.length > 0) {
      const exchangesSorted = [...props.exchanges];
      exchangesSorted.sort((a, b) => b.DateDue - a.DateDue);

      setSortedList(exchangesSorted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.exchanges]);

  if (sortedList.length > 0)
    return (
      <div className="list">
        <div className="header">
          <p className="name">TOKEN</p>
          <p>QUANTITY</p>
          <p className="address">ADDRESS</p>
          <p>EXCHANGE MODE</p>
          <p>TIME REMAINING</p>
        </div>
        <div className="body">
          {sortedList.map((row, index) => (
            <ExchangeRow row={row} key={`${index}-exchange`} />
          ))}
        </div>
      </div>
    );
  else
    return (
      <div className="centered-info">
        <p>No exchanges to show</p>
      </div>
    );
}

//index row as a separate component to open modals as individuals
const ExchangeRow = (props) => {
  const user = useTypedSelector((state) => state.user);

  const [time, setTime] = useState<string>('');

  const [openAccept, setOpenAccept] = useState<boolean>(false);
  const [openOffer, setOpenOffer] = useState<boolean>(false);

  const handleOpenAccept = () => {
    setOpenAccept(true);
  };

  const handleOpenOffer = () => {
    setOpenOffer(true);
  };

  const handleCloseAccept = () => {
    setOpenAccept(false);
  };

  const handleCloseOffer = () => {
    setOpenOffer(false);
  };

  useEffect(() => {
    //get date
    if (props.row.DateDue) {
      setTime(
        getStyledTime(
          new Date().getTime(),
          new Date(props.row.DateDue).getTime(),
          true
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className="row"
        onClick={
          props.row.Creator === user.id ? handleOpenAccept : handleOpenOffer
        }
      >
        <div className="name">
          <div
            className="image"
            style={{
              backgroundImage: `url(${require(`assets/tokenImages/${props.row.Token}.png`)})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <p>{props.row.Token}</p>
        </div>

        <p>{props.row.Quantity}</p>
        <p className="address">{props.row.Address}</p>
        <p>{props.row.ExchangeMode}</p>
        <p>{time}</p>
      </div>
      <AcceptExchangeModal
        exchange={props.row}
        open={openAccept}
        handleClose={handleCloseAccept}
      />
      <OfferExchangeModal
        exchange={props.row}
        open={openOffer}
        handleClose={handleCloseOffer}
      />
    </>
  );
};
