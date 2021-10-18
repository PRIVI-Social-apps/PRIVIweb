import './Sidebar.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import URL from 'shared/functions/getURL';
import { sampleDailyVolumeData, samplePopularTokens } from '../sampleData';
import SidebarGraph from './components/SidebarGraph';

export default function Sidebar() {
  const [dailyVolume, setDailyVolume] = useState<number>(0);
  const [dailyVolumeData, setDailyVolumeData] = useState<any[]>([]);

  const [users, setUsers] = useState<number>(0);
  const [usersThisWeek, setUsersThisWeek] = useState<number>(0);
  const [usersData, setUsersData] = useState<any[]>([]);

  const [badges, setBadges] = useState<number>(0);
  const [badgesAwarded, setBadgesAwarded] = useState<number>(0);

  const [popularTokens, setPopularTokens] = useState<any[]>([]);

  const [tokensDistributed, setTokensDistributed] = useState<number>(0);
  const [tokensDistributedToday, setTokensDistributedToday] = useState<number>(
    0
  );

  useEffect(() => {
    getDailyVolume();
    getUsers();
    getBadges();
    getTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDailyVolume = () => {
    //TODO: get daily volume
    setDailyVolume(580828.02);
    setDailyVolumeData(sampleDailyVolumeData);
  };

  const getUsers = () => {
    let week = [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 0 },
      { x: 7, y: 0 },
    ];

    axios
      .post(`${URL()}/chat/getUsers`)
      .then((response) => {
        if (response.data.success) {
          //should be remove user's id from the list ?? so they don't message themselves
          const allUsers = response.data.data;
          let uWeek = 0;
          allUsers.forEach((user) => {
            if (
              user.lastUpdate &&
              new Date().getTime() - new Date(user.lastUpdate).getTime() <
                604800000
            ) {
              uWeek++;
              week.forEach((day, index) => {
                if (
                  day.x ===
                  Math.round(
                    (new Date().getTime() -
                      new Date(user.lastUpdate).getTime()) /
                      86400000
                  )
                ) {
                  const newDay = { ...day };
                  newDay.y = day.y + 1;

                  week[index] = newDay;
                }
              });
            }
          });

          week.forEach((day, index) => {
            if (index > 0) day.y = week[index - 1].y + day.y;
          });

          setUsers(allUsers.length);
          setUsersThisWeek(uWeek);
          setUsersData(week);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getBadges = () => {
    //TODO: get badges length and abdges awarded length
    setBadges(382);
    setBadgesAwarded(8293);
  };

  const getTokens = () => {
    //TODO: get most popular tokens list
    const tokens = [...samplePopularTokens];
    tokens.sort((a, b) => b.Popularity - a.Popularity);

    setPopularTokens(tokens);

    setTokensDistributed(2429102);
    setTokensDistributedToday(392020);
  };

  return (
    <div className="sidebar-content">
      <div className="box">
        <div className="title">
          <p>Daily volume</p>
        </div>
        <div className="token">
          <div
            className="image"
            style={{
              backgroundImage: `url(${require(`assets/tokenImages/PRIVI.png`)})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {`${dailyVolume.toLocaleString()} PRIVI`}
        </div>
        <SidebarGraph data={dailyVolumeData} />
      </div>
      <div className="box">
        <div className="title">
          <p>Users</p>
        </div>
        <div className="row">
          <div className="column">
            <p>{users}</p>
            <span>Total users</span>
          </div>
          <div className="column">
            <p>{usersThisWeek}</p>
            <span>This week</span>
          </div>
        </div>
        <SidebarGraph data={usersData} />
      </div>
      <div className="box">
        <div className="title">
          <p>Badges</p>
        </div>
        <div className="row">
          <div className="column">
            <p>{badges}</p>
            <span>Badges generated</span>
          </div>
          <div className="column">
            <p>{badgesAwarded}</p>
            <span>Badges awarded</span>
          </div>
        </div>
      </div>
      <div className="box">
        <div className="title">
          <p>Most popular tokens</p>
        </div>
        <div className="tokens">
          {popularTokens.length > 0
            ? popularTokens.map((token, index) => {
                if (index < 5)
                  return (
                    <div className="row" key={`row-${index}`}>
                      <div className="token">
                        <div
                          className="image"
                          style={{
                            backgroundImage: `url(${require(`assets/tokenImages/${token.Token}.png`)})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                        {token.Token}
                      </div>
                      <p>{`${
                        token.Popularity
                          ? (token.Popularity * 100).toFixed()
                          : ''
                      }%`}</p>
                    </div>
                  );
                else return null;
              })
            : null}
        </div>
      </div>
      <div className="box">
        <div className="title">
          <p>Tokens distributed</p>
        </div>
        <div className="row">
          <div className="column">
            <p>{tokensDistributed}</p>
            <span>This week</span>
          </div>
          <div className="column">
            <p>{tokensDistributedToday}</p>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
