import React, { useState, useEffect } from 'react';
import InsurerRow from './InsurerRow/InsurerRow';
import { insurerRows, InsurerData } from '../sample';

import ActionBar from './ActionBar/ActionBar';

export default function Insurers() {
  const trendingInsurers: InsurerData[] = [];
  const insurersCopy = [...insurerRows];
  insurersCopy.sort(function (a, b) {
    return b.followers - a.followers;
  });
  insurersCopy.forEach((insurer: InsurerData, index) => {
    if (index < 3) {
      trendingInsurers.push(insurer);
    }
  });

  const [filteredPriviList, setFilteredPriviList] = useState<InsurerData[]>([]);
  const [insurerSearchValue, setInsurerSearchValue] = useState<string>('');
  const [popularityFilter, setPopularityFilter] = useState<number[]>([0, 100]);
  const [insurersFilter, setinsurersFilter] = useState<number[]>([0, 100]);

  useEffect(() => {
    let priviPools: InsurerData[] = [];
    insurerRows.forEach((value: InsurerData) => {
      if (
        Number(((value.followers / followers_max()) * 100).toFixed(0)) >=
          popularityFilter[0] &&
        Number(((value.followers / followers_max()) * 100).toFixed(0)) <=
          popularityFilter[1] &&
        value.investors >= insurersFilter[0] &&
        value.investors <= insurersFilter[1]
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
  }, [popularityFilter, insurersFilter, insurerSearchValue]);

  const followers_max = () => {
    let limit = insurerRows[0].followers;
    insurerRows.forEach((insurer: InsurerData, index: number) => {
      if (insurer.followers > limit) limit = insurer.followers;
    });
    return limit;
  };

  const investors_max = () => {
    let limit = insurerRows[0].investors;
    insurerRows.forEach((insurer: InsurerData, index: number) => {
      if (insurer.investors > limit) limit = insurer.investors;
    });
    return limit;
  };

  const handlePopularityChange = (event: any, newValue: number | number[]) => {
    setPopularityFilter(newValue as number[]);
  };

  const handleInsurersChange = (event: any, newValue: number | number[]) => {
    setinsurersFilter(newValue as number[]);
  };

  const handleInsurerChange = (event: any) => {
    setInsurerSearchValue(event.target.value);
  };

  return (
    <div>
      <h3 style={{ textAlign: 'center' }}>INSURERS</h3>
      <div className="trending">
        <h4 className="insurance-subtitle">TRENDING INSURERS</h4>
        {trendingInsurers.map((insurer: InsurerData) => {
          return <InsurerRow insurer={insurer} key={`${insurer.id}`} />;
        })}
      </div>
      <ActionBar
        insurer={{ value: insurerSearchValue, handle: handleInsurerChange }}
        popularity={{
          value: popularityFilter,
          handle: handlePopularityChange,
        }}
        investors={{ value: insurersFilter, handle: handleInsurersChange }}
        investors_max={investors_max()}
      />
      <h4 className="insurance-subtitle">INSURERS</h4>
      {filteredPriviList.map((insurer: InsurerData) => {
        return <InsurerRow insurer={insurer} key={`${insurer.id}`} />;
      })}
    </div>
  );
}
