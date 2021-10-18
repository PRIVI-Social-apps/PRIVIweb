import React, { useState, useEffect } from 'react';
import './LendingsList.css';

import OfferLendModal from '../modals/OfferLendModal';
import { getStyledTime } from 'shared/functions/getStyledTime';

export default function LendingsList(props) {
  const [sortedList, setSortedList] = useState<any[]>([]);

  useEffect(() => {
    if (props.lendings && props.lendings.length > 0) {
      const lendingsSorted = [...props.lendings];
      lendingsSorted.sort((a, b) => b.EndDate - a.EndDate);

      setSortedList(lendingsSorted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.lendings]);

  if (sortedList.length > 0)
    return (
      <div className="list">
        <div className="header">
          <p className="name">TOKEN</p>
          <p>AMOUNT</p>
          <p>DURATION</p>
          <p>COLALTERAL</p>
          <p>INTEREST</p>
          <p>{''}</p>
        </div>
        <div className="body">
          {sortedList.map((row, index) => (
            <LendRow row={row} key={`${index}-lending`} />
          ))}
        </div>
      </div>
    );
  else
    return (
      <div className="centered-info">
        <p>No lendings to show</p>
      </div>
    );
}

//index row as a separate component to open modals as individuals
const LendRow = (props) => {
  const [time, setTime] = useState<string>('');

  const [openOffer, setOpenOffer] = useState<boolean>(false);

  const handleOpenOffer = () => {
    setOpenOffer(true);
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
      <div className="row">
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

        <p>{props.row.Amount}</p>
        <p>{time}</p>
        <p>{`${props.row.Collateral.Quantity} ${props.row.Collateral.Token}`}</p>
        <p>{`${
          props.row.Interest ? (props.row.Interest * 100).toFixed(0) : ''
        }%`}</p>
        <button onClick={handleOpenOffer}>Lend</button>
        <OfferLendModal
          lending={props.row}
          open={openOffer}
          handleClose={handleCloseOffer}
        />
      </div>
    </>
  );
};
