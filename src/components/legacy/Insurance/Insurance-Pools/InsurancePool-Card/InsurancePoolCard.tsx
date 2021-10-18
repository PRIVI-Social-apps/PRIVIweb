import React, { useState } from 'react';
import InvestModal from '../components/InvestModal';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './InsurancePoolCard.css';

export default function InsurancePoolCard(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  /* Invest modal*/
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      className={
        props.trending
          ? 'insurance-pool-card insurance-trending-pool-card'
          : 'insurance-pool-card'
      }
    >
      <div
        className="clickable"
        onClick={() => {
          history.push(`/insurance/pools/${props.pool.Id}`);
        }}
      >
        <div className="top-row">
          <div
            className="insurer-image"
            style={{
              backgroundImage:
                props.pool.InsurerImageURL &&
                props.pool.InsurerImageURL.length > 0
                  ? `url(${props.pool.InsurerImageURL})`
                  : 'none',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="column">
            <p className="name">{props.pool.InsurerName}</p>
            <div className="row">
              <div className="column">
                <p>{`${(props.pool.APR * 100).toFixed(2)}%`}</p>
                <span>APR</span>
              </div>
              <div className="column">
                <p>{`${(props.pool.SubscriptionFee * 100).toFixed(0)}%`}</p>
                <span>SUBSCR.</span>
              </div>
            </div>
          </div>
        </div>
        <div className="middle-row">
          <div className="row">
            <div className="column">
              <p>{props.pool.Returns}</p>
              <span>RETURNS TO DATE</span>
            </div>
            <div className="column">
              <p>{`${(props.pool.ClaimingPercentage * 100).toFixed(0)}%`}</p>
              <span>CLAIMING POOL</span>
            </div>
          </div>
        </div>
        <div className="pod-row">
          <div
            className="pod-image"
            style={{
              backgroundImage:
                props.pool.PodImageURL && props.pool.PodImageURL.length > 0
                  ? `url(${props.pool.PodImageURL})`
                  : 'none',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="column">
            <span>INSURED POD</span>
            <p>{props.pool.PodName}</p>
          </div>
        </div>
      </div>
      <div className="bottom">
        <button onClick={handleOpen} disabled={props.disableClick}>
          Invest
        </button>
        <InvestModal open={open} handleClose={handleClose} pool={props.pool} />
        <div className="investors">
          <img
            src={
              props.trending
                ? require('assets/icons/profile_round_white.png')
                : require('assets/icons/profile_round_darkblue.png')
            }
            alt={'profile'}
          />
          {`${props.pool.Investors.length} investors`}
        </div>
      </div>
    </div>
  );
}
