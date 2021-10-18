import React, { useState, useEffect } from 'react';
import { ListElement } from '../LeaderboardList';
import { AppBar, Tabs, Tab, Modal } from '@material-ui/core';

export default function LeaderboardModal(props) {
  const [menuSelection, setMenuSelection] = useState(0);
  const [filteredList, setFilteredList] = useState<any[]>([]);

  useEffect(() => {
    if (props.list && props.list.length && props.list.length > 0) {
      const list = [] as any[];
      if (props.type === 'Top profiles to follow') {
        //value === number of followers (profile)
        props.list.forEach((element) => {
          list.push({
            Followers: element.Followers,
            Name: element.Name,
            Id: element.Id,
            Badges: element.Badges,
            Cred: element.Cred,
            ImageURL: element.ImageURL || '',
          });
        });
        if (props.options[menuSelection] === 'Most Popular') {
          list.sort((a, b) => b.Followers - a.Followers);
        } else if (props.options[menuSelection] === 'Cred') {
          list.sort((a, b) => b.Cred - a.Cred);
        } else if (props.options[menuSelection] === 'Badges') {
          list.sort((a, b) => b.Badges - a.Badges);
        }
      } else if (props.type === 'Pods') {
        if (props.options[menuSelection] === 'FT') {
          //value === followers (FT pods)
          props.list.forEach((element) => {
            if (element.Type === 'FT') {
              list.push({
                Value: element.Followers,
                Name: element.Name,
                APY: element.APY,
                Id: element.Id,
              });
            }
          });
        } else if (props.options[menuSelection] === 'Physical NFT') {
          //value === followers (physical NFT pods)
          props.list.forEach((element) => {
            if (element.Type === 'NFTPhysical') {
              list.push({
                Value: element.Followers,
                Name: element.Name,
                APY: element.APY,
                Id: element.Id,
              });
            }
          });
        } else if (props.options[menuSelection] === 'Digital NFT') {
          //value === followers (digital NFT pods)
          props.list.forEach((element) => {
            if (element.Type === 'NFTDigital') {
              list.push({
                Value: element.Followers,
                Name: element.Name,
                APY: element.APY,
                Id: element.Id,
              });
            }
          });
        } else {
          //value === number of followers (pods)
          props.list.forEach((element) => {
            list.push({
              Value: element.Followers,
              Name: element.Name,
              Id: element.Id,
              APY: element.APY,
            });
          });
        }

        list.sort((a, b) => b.Value - a.Value);
      } else {
        props.list.forEach((element) => {
          list.push({
            Value:
              //value === number of followers (communnity)
              props.options[menuSelection] === 'Most Popular'
                ? element.Followers
                : //value === number of members (communnity)
                props.options[menuSelection] === 'People'
                ? element.Members
                : //value === number of tokens (community)
                props.options[menuSelection] === 'Tokens'
                ? element.Tokens
                : //value === number of insured pools (insurance pools)
                props.options[menuSelection] === 'Volume' &&
                  props.type === 'Insurance Pools'
                ? element.Insured
                : //value === deposited (credit pools)
                props.options[menuSelection] === 'Volume' &&
                  props.type === 'Credit Pools'
                ? element.Deposited
                : 0,
            Name: element.Name,
            APY: element.APY,
            Id: element.Id,
          });
        });

        list.sort((a, b) => b.Value - a.Value);
      }

      setFilteredList(list);
    }
  }, [menuSelection]);

  if (filteredList && filteredList.length > 0)
    return (
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className="modal modalCreateModal"
      >
        <div className="modal-content leaderboard-modal">
          <div className="exit" onClick={props.handleClose}>
            <img
              src={require('assets/icons/x_darkblue.png')}
              alt={'x'}
            />
          </div>
          <div className="leaderboard">
            <h3>{props.type}</h3>
            <AppBar position="static" className="appBarTabsToken">
              <Tabs
                TabIndicatorProps={{
                  style: { background: '#64c89e', height: '3px' },
                }}
                value={menuSelection}
                className="tabsToken"
                onChange={(e, value) => setMenuSelection(value)}
              >
                {props.options.map((option) => {
                  return <Tab label={option} key={option} />;
                })}
              </Tabs>
            </AppBar>
            {props.weeklyRewards && props.monthlyRewards ? (
              <div className="rewards">
                <div className="column">
                  <span>Weekly rewards</span>
                  <p>{`${props.weeklyRewards} PRIVI`}</p>
                </div>
                <div className="column">
                  <span>Monthly rewards</span>
                  <p>{`${props.monthlyRewards} PRIVI`}</p>
                </div>
              </div>
            ) : null}
            <div className="leaderboard-list">
              <div className="header">
                <p className="title">{''}</p>
                <p>
                  {props.type !== 'Top profiles to follow' ? 'VALUE' : 'CRED'}
                </p>
                <p>
                  {props.type === 'Top movers'
                    ? '%'
                    : props.type !== 'Top profiles to follow'
                    ? 'APY'
                    : 'BADGES'}
                </p>
              </div>
              <div className="body">
                {filteredList.map((row, index) => (
                  <ListElement
                    row={row}
                    podType={
                      props.type === 'Pods'
                        ? row.Type === 'FT'
                          ? 'FT'
                          : 'NFT'
                        : undefined
                    }
                    green={props.type === 'Top movers' ? true : false}
                    index={index}
                    key={`${index}-leaderboard`}
                    type={props.type}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  else return null;
}
