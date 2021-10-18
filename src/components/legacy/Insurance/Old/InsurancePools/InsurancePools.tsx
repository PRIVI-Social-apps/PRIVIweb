import React, { useEffect, useState } from 'react';
import { PoolData, poolRows } from '../sample';
import InsuranceCard from './InsuranceCard/InsuranceCard';
import './InsurancePools.css';
import axios from 'axios';
import URL from 'shared/functions/getURL';
import ActionBar from './ActionBar/ActionBar';
import { Tooltip } from '@material-ui/core';
import Fade from '@material-ui/core/Fade';
import { trackPromise } from 'react-promise-tracker';
import { useTypedSelector } from 'store/reducers/Reducer';
import { setAvailableTokens } from 'store/actions/User';
import { useDispatch } from 'react-redux';
import { InfoIcon } from 'shared/ui-kit/Icons';

export default function InsurancePools() {
  const user = useTypedSelector((state) => state.user);
  const dispatch = useDispatch();

  const trendingPools: PoolData[] = [];
  const poolsCopy = [...poolRows]; //taking the data from the main insurance object, not the filtered list !
  poolsCopy.sort(function (a, b) {
    return b.followers - a.followers;
  });
  poolsCopy.forEach((insurer: PoolData, index) => {
    if (index < 3) {
      trendingPools.push(insurer);
    }
  });

  //TODO: connect with firebase and get the insurance pools and insurers

  const [filteredPriviList, setFilteredPriviList] = useState<PoolData[]>([]);
  const [insurerSearchValue, setInsurerSearchValue] = useState<string>('');
  const [popularityFilter, setPopularityFilter] = useState<number[]>([0, 100]);
  const [aprFilter, setAprFilter] = useState<number[]>([0, 100]);
  const [endorsmentFilter, setEndorsmentFilter] = useState<number[]>([0, 100]);
  const [trustFilter, setTrustFilter] = useState<number[]>([0, 100]);

  useEffect(() => {
    // update token list from backend
    getTokensData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTokensData = () => {
    trackPromise(
      axios
        .get(`${URL()}/wallet/getTokenBalances_v2/${user.address}`)
        .then((res) => {
          // console.log("getTokenBalances");
          // console.log(res);

          const newTokens = [] as any; // we need something like { token: "BAL", value: 0, name: "Balancer", valueUSD: 0 },

          res.data.data.forEach((tokenBalance) => {
            if (tokenBalance.value > 0) {
              newTokens.push(tokenBalance.token);
            }
          });

          dispatch(setAvailableTokens(newTokens));
        })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    let priviPools: PoolData[] = [];
    poolRows.forEach((value: PoolData) => {
      if (
        Number(((value.followers / followers_max()) * 100).toFixed(0)) >=
        popularityFilter[0] &&
        Number(((value.followers / followers_max()) * 100).toFixed(0)) <=
        popularityFilter[1] &&
        value.apr * 100 >= aprFilter[0] &&
        value.apr * 100 <= aprFilter[1] &&
        value.pod_trust_score * 100 >= trustFilter[0] &&
        value.pod_trust_score * 100 <= trustFilter[1] &&
        value.pod_endorsement_score * 100 >= endorsmentFilter[0] &&
        value.pod_endorsement_score * 100 <= endorsmentFilter[1]
      ) {
        if (
          value.insurer_name
            .toUpperCase()
            .includes(insurerSearchValue.toUpperCase())
        )
          priviPools.push(value);
        else if (insurerSearchValue === '') priviPools.push(value);
      }
    });
    setFilteredPriviList(priviPools);
  }, [
    trustFilter,
    endorsmentFilter,
    popularityFilter,
    aprFilter,
    insurerSearchValue,
  ]);

  const followers_max = () => {
    let limit = poolRows[0].followers;
    poolRows.forEach((pool: PoolData, index: number) => {
      if (pool.followers > limit) limit = pool.followers;
    });
    return limit;
  };

  const handlePopularityChange = (event: any, newValue: number | number[]) => {
    setPopularityFilter(newValue as number[]);
  };

  const handleAPRChange = (event: any, newValue: number | number[]) => {
    setAprFilter(newValue as number[]);
  };

  const handleTrustChange = (event: any, newValue: number | number[]) => {
    setTrustFilter(newValue as number[]);
  };

  const handleEndorsmentChange = (event: any, newValue: number | number[]) => {
    setEndorsmentFilter(newValue as number[]);
  };

  const handleInsurerChange = (event: any) => {
    setInsurerSearchValue(event.target.value);
  };

  return (
    <div>
      <h3 style={{ textAlign: 'center' }}>
        INSURANCE POOLS
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          leaveDelay={500}
          arrow
          className="tooltipProfileInfo"
          title="Invest into decentralized insurance pools that underwrite Pods to earn regular interest. These pools apply to Pods or Pod owners can apply to Insurance Pools. A consensus-based claim system initiates if a claim is filed by a Pod."
        >
          <button className="buttonInfoTooltip">
            <InfoIcon />
          </button>
        </Tooltip>
      </h3>
      <div className="trending">
        <h4 className="insurance-subtitle">TRENDING INSURANCE POOLS</h4>
        <div className="insurance-pools">
          {trendingPools.map((pool: PoolData) => {
            return (
              <InsuranceCard
                pool={pool}
                followers_max={followers_max()}
                key={pool.id}
              />
            );
          })}
        </div>
      </div>
      <ActionBar
        insurer={{ value: insurerSearchValue, handle: handleInsurerChange }}
        popularity={{
          value: popularityFilter,
          handle: handlePopularityChange,
        }}
        apr={{ value: aprFilter, handle: handleAPRChange }}
        trust={{ value: trustFilter, handle: handleTrustChange }}
        endors={{ value: endorsmentFilter, handle: handleEndorsmentChange }}
      />
      <h4 className="insurance-subtitle">INSURANCE POOLS</h4>
      <div className="insurance-pools">
        {filteredPriviList.map((pool: PoolData) => {
          return (
            <InsuranceCard
              pool={pool}
              followers_max={followers_max()}
              key={pool.id}
            />
          );
        })}
      </div>
    </div>
  );
}
