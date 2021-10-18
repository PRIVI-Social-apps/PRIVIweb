import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Invest from './Invest/Invest';
import './InsuranceCard.css';

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as PlusSolid } from "assets/icons/plus-solid.svg";
import { ReactComponent as UserSolid } from "assets/icons/user-solid.svg";
import { ReactComponent as UndoSolid } from "assets/icons/undo-solid.svg";
import { ReactComponent as UserVerifiedIcon } from "assets/icons/user-verified.svg";
import { ReactComponent as AssistantIcon } from "assets/icons/assistance-verified.svg";

export default function InsuranceCard(props: any) {
  const history = useHistory();

  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [cardFlip, setCardFlip] = useState<boolean>(false);

  const toggleCardFlip = () => {
    setCardFlip(!cardFlip);
  };

  const followInsurance = () => {
    //TODO: backend function
  };

  const followPod = () => {
    //TODO: backend function
  };

  return (
    <div className="card">
      <div className={cardFlip ? 'content flip' : 'content'}>
        <div className="front container v">
          {
            //insurer side
          }
          <button className="flip-button" onClick={toggleCardFlip}>
            <SvgIcon><UndoSolid /></SvgIcon>
          </button>
          <div
            onClick={() => {
              history.push(`/insurance/pools/${props.pool.id}`);
            }}
            className="cursor-pointer"
          >
            <div className="items-container">
              <div
                className="card-image"
                style={{
                  backgroundImage: `url("${props.pool.insurer_imageurl}")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="container v scores">
                <p>{`${props.pool.apr.toFixed(2)}% APR`}</p>
                <p>{` ${(
                  (props.pool.followers / props.followers_max) *
                  100
                ).toFixed(0)}% SUBSCR.`}</p>
              </div>
            </div>
            <div className="items-container middle">
              <h4>{props.pool.insurer_name}</h4>
              <div className="followers">
                <span>{`${props.pool.followers} `}</span>
                <SvgIcon><UserSolid /></SvgIcon>
              </div>
            </div>
            <div className="items-container middle">
              <p>
                {props.pool.returns}
                <br /> Returns to date
              </p>
              <p>
                {(props.pool.claiming_percentage * 100).toFixed(0)}% <br />
                Claiming pool
              </p>
            </div>
          </div>
          <div className="items-container bottom">
            <button className="invest" onClick={handleOpen}>
              INVEST
            </button>
            <Invest open={open} handleClose={handleClose} pool={props.pool} />
            <button
              className="plus"
              onClick={followInsurance}
              title="Follow insurance"
            >
              <SvgIcon>
                <PlusSolid />
              </SvgIcon>
            </button>
          </div>
        </div>

        <div className="back container v">
          {
            //pod side
          }
          <button className="flip-button" onClick={toggleCardFlip}>
            <SvgIcon><UndoSolid /></SvgIcon>
          </button>
          <div
            onClick={() => {
              history.push(`/InsurancePool/${props.pool.id}`);
            }}
            className="cursor-pointer"
          >
            <div className="items-container">
              <div
                className="card-image"
                style={{
                  backgroundImage: `url("${props.pool.pod_imageurl}")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="container v scores">
                <span>
                  <UserVerifiedIcon />
                  <div className="scoresLabelPodCard">
                    {(props.pool.pod_trust_score * 100).toFixed(0)}% Trust
                  </div>
                </span>
                <span>
                  <AssistantIcon />
                  <div className="scoresLabelPodCard">
                    {(props.pool.pod_endorsement_score * 100).toFixed(0)}%
                    Endors.
                  </div>
                </span>
              </div>
            </div>
            <div className="items-container middle">
              <h4>{props.pool.pod_name}</h4>
              <div className="followers">
                <span>{`${props.pool.pod_followers} `}</span>
                <SvgIcon><UserSolid /></SvgIcon>
              </div>
            </div>
          </div>
          <div className="items-container bottom">
            <p>{`${props.pool.pod_coverage_rate.toFixed(0)}% COVER.`}</p>
            <div className="followers">
              <button className="plus" onClick={followPod} title="Follow Pod">
                <SvgIcon>
                  <PlusSolid />
                </SvgIcon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
