import React, { useState, useEffect } from 'react';
import './LeaderboardList.css';
import URL from 'shared/functions/getURL';
import LeaderboardModal from './modals/LeaderboardModal';

export default function LeaderboardList(props) {
  const [filteredList, setFilteredList] = useState<any[]>([]);

  const [openLeaderboardModal, setOpenLeaderboardModal] = useState<boolean>(
    false
  );

  const handleOpenLeaderboardModal = () => {
    setOpenLeaderboardModal(true);
  };

  const handleCloseLeaderboardModal = () => {
    setOpenLeaderboardModal(false);
  };

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
        if (props.options[props.selected] === 'Most Popular') {
          list.sort((a, b) => b.Followers - a.Followers);
        } else if (props.options[props.selected] === 'Cred') {
          list.sort((a, b) => b.Cred - a.Cred);
        } else if (props.options[props.selected] === 'Badges') {
          list.sort((a, b) => b.Badges - a.Badges);
        }
      } else if (props.type === 'Pods') {
        if (props.options[props.selected] === 'FT') {
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
        } else if (props.options[props.selected] === 'Physical NFT') {
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
        } else if (props.options[props.selected] === 'Digital NFT') {
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
              props.options[props.selected] === 'Most Popular'
                ? element.Followers
                : //value === number of members (communnity)
                props.options[props.selected] === 'People'
                ? element.Members
                : //value === number of tokens (community)
                props.options[props.selected] === 'Tokens'
                ? element.Tokens
                : //value === number of insured pools (insurance pools)
                props.options[props.selected] === 'Volume' &&
                  props.type === 'Insurance Pools'
                ? element.Insured
                : //value === deposited (credit pools)
                props.options[props.selected] === 'Volume' &&
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selected]);

  if (filteredList && filteredList.length > 0)
    return (
      <div className="leaderboard">
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
            <p>{props.type !== 'Top profiles to follow' ? 'VALUE' : 'CRED'}</p>
            <p>
              {props.type === 'Top movers'
                ? '%'
                : props.type !== 'Top profiles to follow'
                ? 'APY'
                : 'BADGES'}
            </p>
          </div>
          <div className="body">
            {filteredList.map((row, index) =>
              index < 5 ? (
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
              ) : null
            )}
          </div>
          {filteredList.length > 5 ? (
            <div
              className="expand clickable"
              onClick={handleOpenLeaderboardModal}
            >
              {'Expand'}
            </div>
          ) : null}
        </div>
        <LeaderboardModal
          open={openLeaderboardModal}
          handleClose={handleCloseLeaderboardModal}
          list={filteredList}
          weeklyRewards={props.weeklyRewards ? props.weeklyRewards : undefined}
          monthlyRewards={
            props.monthlyRewards ? props.monthlyRewards : undefined
          }
          type={props.type}
          options={props.options}
        />
      </div>
    );
  else return null;
}

export const ListElement = (props) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (props.row.HasPhoto) {
      if (props.type === 'Communities') {
        //TODO: get community image
      } else if (props.podType) {
        setImageUrl(`${props.row.Url}?${Date.now()}`);
      } else if (props.type === 'Insurance Pools') {
        //TODO: get insurance pool picture
      } else if (props.type === 'Credit Pools') {
        //TODO: get credit pool picture
      }
    }
    if (
      props.type === 'Top profiles to follow' ||
      props.type === 'Top movers'
    ) {
      setImageUrl(props.row.ImageURL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (props.row) {
    return (
      <div className="row">
        <div className="item">
          <p>{props.index + 1}</p>
          <div
            className="item-image"
            style={{
              backgroundImage:
                imageUrl && imageUrl.length > 0 ? `url(${imageUrl})` : 'none',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <p>{props.row.Name}</p>
        </div>
        <p>{`${
          props.row.Value
            ? props.row.Value.toLocaleString()
            : props.row.Cred
            ? props.row.Cred.toLocaleString()
            : 0
        }`}</p>
        <p className={props.green ? 'green' : undefined}>
          {props.row.Badges
            ? props.row.Badges
            : props.row.APY
            ? `${(props.row.APY * 100).toFixed(0)}%`
            : '0%'}
        </p>
      </div>
    );
  } else return null;
};
