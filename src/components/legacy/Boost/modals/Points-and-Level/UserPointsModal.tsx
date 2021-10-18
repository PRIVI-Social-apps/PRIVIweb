import { Modal } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './UserPointsModal.css';
import { RootState } from 'store/reducers/Reducer';
import { useSelector } from 'react-redux';
import { getStyledTime } from 'shared/functions/getStyledTime';

const historySample: {
  desc: string;
  reward: number;
  rewardType: string;
  date: number;
}[] = [
  {
    desc: 'Swap any tokens on Matcha',
    reward: 20,
    rewardType: 'points',
    date: new Date().getTime() - 100000,
  },
  {
    desc: 'Swap any tokens on Matcha',
    reward: 20,
    rewardType: 'points',
    date: new Date().getTime() - 200000,
  },
  {
    desc: 'Swap any tokens on Matcha',
    reward: 20,
    rewardType: 'points',
    date: new Date().getTime() - 300000,
  },
  {
    desc: 'Swap any tokens on Matcha',
    reward: 20,
    rewardType: 'points',
    date: new Date().getTime() - 400000,
  },
  {
    desc: 'Swap any tokens on Matcha',
    reward: 20,
    rewardType: 'points',
    date: new Date().getTime() - 500000,
  },
];

export default function UserPointsModal(props) {
  //store
  const user = useSelector((state: RootState) => state.user);

  //hooks
  const [history, setHistory] = useState<any[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [monthlyPoints, setMonthlyPoints] = useState<number>(0);
  const [todayPoints, setTodayPoints] = useState<number>(0);

  //use effect
  useEffect(() => {
    //TODO: load history
    //history elements should be an object with at least:
    //desc: string (description of the task done, e.g: 'Swap any tokens on Matcha')
    //reward: number (quantity reward, e.g: 100 )
    //rewardType: string (reward type, e.g: 'points');
    //date: number/string (date of the moment the user was rewarded: e.g: 1611232701353
    const h = [...historySample];
    h.sort((a, b) => b.date - a.date);
    setHistory(h);

    //set points numbers
    let total = 0;
    let monthy = 0;
    let today = 0;
    h.forEach((event) => {
      if ((event.rewardType = 'points')) {
        if (
          new Date(event.date).getMonth() === new Date().getMonth() &&
          new Date(event.date).getFullYear() === new Date().getFullYear()
        )
          if (new Date(event.date).getDate() === new Date().getDate()) {
            today = today + event.reward;
          }
        monthy = monthy + event.reward;
      }
      total = total + event.reward;
    });

    setTotalPoints(total);
    setMonthlyPoints(monthy);
    setTodayPoints(today);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal userPointsModal"
    >
      <div className="modal-content w50 user-points-modal">
        <div className="exit" onClick={props.handleClose}>
          <img
            src={require('assets/icons/x_darkblue.png')}
            alt={'x'}
          />
        </div>
        <div className="row">
          <div className="column">
            <span>Your points</span>
            <h2>{totalPoints}</h2>
          </div>
          <div className="column">
            <span>Today</span>
            <h5>{todayPoints}</h5>
          </div>
          <div className="column">
            <span>Month</span>
            <h5>{monthlyPoints}</h5>
          </div>
        </div>
        <div className="view-history">View history</div>
        <div className="user-points-list">
          {history.length > 0
            ? history.map((event, index) => {
                return (
                  <div
                    className="user-points-row"
                    key={`user-points-row-${index}`}
                  >
                    <div className="left">
                      <p>{event.desc}</p>
                      <span>{`Received ${event.reward} ${event.rewardType}`}</span>
                    </div>
                    <div className="right">
                      <span>{`Level ${user.level}`}</span>
                      <span>
                        {`${getStyledTime(event.date, new Date(), true)} ago`}
                      </span>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </Modal>
  );
}
