import React, { useState, useRef, useEffect } from 'react';
import './Leaderboard.css';
import URL from 'shared/functions/getURL';
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { useTypedSelector } from 'store/reducers/Reducer';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import LeaderboardList from './components/LeaderboardList';

import { sampleInsurancePoolsData } from '../../../Insurance/sampleData';

export default function Leaderboard() {
  const user = useTypedSelector((state) => state.user);

  const [communitites, setCommunities] = useState<any[]>([]);
  const [pods, setPods] = useState<any[]>([]);
  const [insurancePools, setInsurancePools] = useState<any[]>([]);
  const [creditPools, setCreditPools] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    getCommunities();
    getPods();
    getInsurancePools();
    getCreditPools();
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCommunities = () => {
    trackPromise(
      axios.get(`${URL()}/community/getCommunities`).then((res) => {
        const resp = res.data;
        if (resp.success) {
          const data = resp.data;
          const allCommunities = data.all ?? [];

          const c = [] as any[];
          allCommunities.forEach((community) => {
            c.push({
              Id: community.id || '',
              Name: community.Name || '',
              HasPhoto: community.HasPhoto || false,
              Followers:
                community.Followers && community.Followers.length
                  ? community.Followers.length
                  : 0,
              Members:
                community.Members && community.Members.length
                  ? community.Members.length
                  : 0,
              Tokens: community.SupplyReleased || 0,
              APY: community.APY || 0,
            });
          });
          setCommunities(c);
        } else {
          console.log('error getting all communities');
        }
      })
    );
  };

  const getPods = async () => {
    let allPods = [] as any[];
    //get ft pods
    await axios
      .get(`${URL()}/pod/FT/getAllPodsInfo/${user.id}`)
      .then((response) => {
        if (response.data.success) {
          let data = response.data.data;
          const otherFTPods = [...data.otherFTPods];
          const ft = [] as any[];

          otherFTPods.forEach((pod) => {
            ft.push({
              Id: pod.PodAddress || '',
              Name: pod.Name || '',
              HasPhoto: pod.HasPhoto || false,
              Followers:
                pod.Followers && pod.Followers.length
                  ? pod.Followers.length
                  : 0,
              Type: 'FT',
              APY: pod.APY || 0,
            });
          });
          ft.forEach((pod) => {
            allPods.push(pod);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    //get nft pods
    await axios
      .get(`${URL()}/pod/NFT/getAllPodsInfo/${user.id}`)
      .then((response) => {
        if (response.data.success) {
          let data = response.data.data;

          const otherNFTPods = [...data.otherNFTPods];
          const nft = [] as any[];

          otherNFTPods.forEach((pod) => {
            nft.push({
              Id: pod.PodAddress || '',
              Name: pod.Name || '',
              HasPhoto: pod.HasPhoto || false,
              Followers:
                pod.Followers && pod.Followers.length
                  ? pod.Followers.length
                  : 0,
              Type: pod.IsDigital ? 'NFTDigital' : 'NFTPhysical',
              APY: pod.APY || 0,
            });
          });
          nft.forEach((pod) => {
            allPods.push(pod);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setPods(allPods);
  };

  const getInsurancePools = () => {
    //TODO: get insurance pools
    const i = [] as any[];

    sampleInsurancePoolsData.forEach((pool) => {
      i.push({
        Id: pool.Id || '',
        Name: pool.InsurerName || '',
        HasPhoto: pool.HasPhoto || false,
        Followers:
          pool.Followers && pool.Followers.length ? pool.Followers.length : 0,
        Insured: pool.InsuredAmount || 0,
        APY: pool.APY || 0,
      });
    });
    setInsurancePools(i);
  };

  const getCreditPools = () => {
    trackPromise(
      axios.get(`${URL()}/priviCredit/getPriviCredits`).then((res) => {
        const resp = res.data;
        if (resp.success) {
          const allCredits = resp.data.allCredits;

          const c = [] as any[];
          allCredits.forEach((credit) => {
            c.push({
              Id: credit.CreditAddress || '',
              Name: credit.CreditName || '',
              HasPhoto: credit.HasImage || false,
              Followers:
                credit.Followers && credit.Followers.length
                  ? credit.Followers.length
                  : 0,
              Deposited: credit.Deposited || 0,
              APY: credit.APY || 0,
            });
          });
          setCreditPools(c); // all
        }
      })
    );
  };
  const getUsers = () => {
    axios
      .post(`${URL()}/chat/getUsers`)
      .then((response) => {
        if (response.data.success) {
          //should be remove user's id from the list ?? so they don't message themselves
          const allUsers = response.data.data;
          const u = [] as any[];
          allUsers.forEach((user) => {
            let image = '';
            if (
              user.anon != undefined &&
              user.anon === true &&
              user.anonAvatar &&
              user.anonAvatar.length > 0
            ) {
              image = `${require(`assets/anonAvatars/${user.anonAvatar}`)}`;
            } else {

              if (user.hasPhoto && user.url) {
                image = `${user.url}?${Date.now()}`;
              }
            }
            u.push({
              Id: user.id,
              Name: `${user.firstName ? user.firstName : ''} ${
                user.lastName ? user.lastName : ''
              }`,
              HasPhoto: user.hasImage || false,
              Followers: user.numFollowers || 0,
              Cred: user.creds ? user.creds : 0,
              Badges:
                user.badges && user.badges.length ? user.badges.length : 0,
              ImageURL: image,
            });
          });
          setUsers(u);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const LeaderBoardSet = (props) => {
    const [menuSelection, setMenuSelection] = useState(0);

    return (
      <div className="leaderboard-set-container">
        <h3>{props.title}</h3>
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
        <LeaderboardList
          weeklyRewards={props.weeklyRewards ? props.weeklyRewards : undefined}
          monthlyRewards={
            props.monthlyRewards ? props.monthlyRewards : undefined
          }
          list={props.list}
          type={props.title}
          options={props.options}
          selected={menuSelection}
        />
      </div>
    );
  };

  return (
    <div className="leaderboard-tab">
      <LeaderBoardSet
        options={['Most Popular', 'People', 'Tokens']}
        title={'Communities'}
        list={communitites}
        weeklyRewards={178}
        monthlyRewards={761}
      />
      <LeaderBoardSet
        options={['Most Popular', 'FT', 'Physical NFT', 'Digital NFT']}
        title={'Pods'}
        list={pods}
        weeklyRewards={178}
        monthlyRewards={761}
      />
      <LeaderBoardSet
        options={['Most Popular', 'Volume']}
        title={'Insurance Pools'}
        list={insurancePools}
        weeklyRewards={178}
        monthlyRewards={761}
      />
      <LeaderBoardSet
        options={['Most Popular', 'Volume']}
        title={'Credit Pools'}
        list={creditPools}
        weeklyRewards={178}
        monthlyRewards={761}
      />
      <LeaderBoardSet
        title={'Top movers'}
        options={['Gainers', 'Losers']}
        list={users}
      />
      <LeaderBoardSet
        title={'Top profiles to follow'}
        options={['Most Popular', 'Cred', 'Badges']}
        list={users}
      />
    </div>
  );
}
