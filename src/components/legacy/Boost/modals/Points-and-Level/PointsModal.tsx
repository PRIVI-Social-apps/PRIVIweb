import { AppBar, Modal, Tabs, Tab } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './PointsModal.css';
// import { sampleTotalInfo } from '../../sampleData';
import { RootState } from 'store/reducers/Reducer';
import { useSelector } from 'react-redux';
import { useUserConnections } from "shared/contexts/UserConnectionsContext";

export default function PointsModal(props) {
  //store
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);
  const { isUserFollowed, isUserFollower } = useUserConnections();

  //hooks
  const [globalLlist, setGlobalList] = useState<any>([]);
  const [levelList, setLevelList] = useState<any[]>([]);
  const [friendsList, setFriendsList] = useState<any[]>([]);

  const [filteredList, setFilteredList] = useState<any[]>([]);

  const [pointsSelection, setPointsSelection] = useState<number>(0);
  const pointsOptions = ['Global', 'Level', 'Friends'];
  const [periodSelection, setPeriodSelection] = useState<number>(0);

  //use effect
  useEffect(() => {
    const global = [] as any;
    const level = [] as any;
    const friends = [] as any;

    // props.ranking.forEach((rankingUser) => {
    if (globalLlist.length === 0 && friendsList.length === 0 && levelList.length === 0) {
      for (const rankingUser of props.ranking) {
        users.forEach((u) => {
          if (u.id === rankingUser.user) {
            global.push({
              id: u.id,
              name: u.name,
              imageURL: u.imageURL,
              points: rankingUser.points,
            }); //add to global list

            if (rankingUser.level === user.level) {
              //case 1: level
              level.push({
                id: u.id,
                name: u.name,
                imageURL: u.imageURL,
                points: rankingUser.points,
              });
            }
            if (isUserFollowed(rankingUser.user) && isUserFollower(rankingUser.user)) {
              //case 2: friends (followed and following)
              friends.push({
                id: u.id,
                name: u.name,
                imageURL: u.imageURL,
                points: rankingUser.points,
              });
            }

          }
        });
      };

      setLevelList(level);
      setFriendsList(friends);
      setGlobalList(global);

      const copyGlobal = [...global]

      setFilteredList(copyGlobal); //filtered list is global list by default
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, []);

  useEffect(() => {
    let newFiltered = [] as any;
    if (pointsSelection === 0) {
      if (globalLlist.length === 0) {
        //in case this is useEffect executed before loading the global list
        newFiltered = [] as any;

        // props.ranking.forEach((rankingUser) => {
        for (const rankingUser of props.ranking) {
          users.forEach((u) => {
            if (u.id === rankingUser.user) {
              newFiltered.push({
                id: u.id,
                name: u.name,
                imageURL: u.imageURL,
                points: rankingUser.points,
              });
            }

          });
        };
      } else newFiltered = [...globalLlist];
    } else if (pointsSelection === 1) {
      newFiltered = [...levelList];
    } else {
      newFiltered = [...friendsList];
    }

    //TODO: filter by weekly and monthly

    newFiltered.sort((a, b) => b.level - a.level);

    setFilteredList(newFiltered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointsSelection, periodSelection]);

  //page components
  const UserRow = (props) => {
    return (
      <div className="user-row">
        <div className="left">
          <div className="number">{props.ranking}</div>
          <div
            className="user-image"
            style={{
              backgroundImage:
                props.user.imageURL.length > 0
                  ? `url(${props.user.imageURL})`
                  : 'none',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <span>{props.user.name}</span>
        </div>
        <div className="right">
          <span>{props.user.points}</span>
          {user.id !== props.user.id ? <button>Compare</button> : null}
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal pointsModal"
    >
      <div className="modal-content w50 points-modal">
        <div className="exit" onClick={props.handleClose}>
          <img
            src={require('assets/icons/x_darkblue.png')}
            alt={'x'}
          />
        </div>
        <div className="row">
          <div className="column">
            <span>Level</span>
            <h2>{user.level}</h2>
          </div>
          <div className="column">
            <span>{`Level ${user.level}`}</span>
            <h5>{`${levelList.length} people`}</h5>
          </div>
          <div className="column">
            <span>Total</span>
            <h5>{`${globalLlist.length} people`}</h5>
          </div>
        </div>
        <AppBar position="static" className="appbar">
          <Tabs
            TabIndicatorProps={{
              style: { background: '#64c89e', height: '3px' },
            }}
            value={pointsSelection}
            onChange={(e, value) => setPointsSelection(value)}
          >
            {pointsOptions.map((name) => {
              return <Tab label={name} key={name} />;
            })}
          </Tabs>
        </AppBar>
        <div className="user-points-list">
          <div className="buttons">
            <button
              className={periodSelection === 0 ? 'selected' : undefined}
              onClick={() => {
                setPeriodSelection(0);
              }}
            >
              MONTHLY
            </button>
            <button
              className={periodSelection === 1 ? 'selected' : undefined}
              onClick={() => {
                setPeriodSelection(1);
              }}
            >
              WEEKLY
            </button>
          </div>
          <div className="users-list">
            {filteredList.length > 0
              ? filteredList.map((rankingUser, index) => {
                if (index < 3)
                  return (
                    <div className="top-user" key={`top-${index + 1}-user`}>
                      <div className="bubble">
                        <div
                          className="image"
                          style={{
                            backgroundImage:
                              rankingUser.imageURL.length > 0
                                ? `url(${rankingUser.imageURL})`
                                : 'none',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                        <div className="number">{index + 1}</div>
                      </div>
                      <div className="column">
                        <p>
                          {rankingUser.name.length ? rankingUser.name : ''}
                        </p>
                        <span>{rankingUser.points}</span>
                        {user.id !== rankingUser.id ? (
                          <button>Compare</button>
                        ) : null}
                      </div>
                    </div>
                  );
                else return null;
              })
              : null}
            {filteredList.length > 0 ? (
              filteredList.map((user, index) => {
                if (index >= 3)
                  return (
                    <UserRow
                      user={user}
                      key={`rest-user-points-${index}`}
                      ranking={index + 1}
                    />
                  );
                else return null;
              })
            ) : (
              <div>No users to show</div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
