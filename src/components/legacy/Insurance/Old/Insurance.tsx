import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';

import InsurancePools from './InsurancePools/InsurancePools';
import Insurers from './Insurers/Insurers';

import './Insurance.css';

const StyledTabList = withStyles({
  root: {
    backgroundColor: '#000000',
    boxShadow: 'none',
  },
  indicator: {
    backgroundColor: 'white',
  },
})(TabList);

const StyledTab = withStyles({
  root: {
    '&:hover': {
      backgroundColor: '#ddd',
      color: '#000000',
    },
    fontFamily: 'Neutra',
  },
  selected: {
    color: '#000000',
    backgroundColor: 'white',
    fontFamily: 'Neutra Bold',
  },
})(Tab);

export default function Insurances() {
  const [tabValue, setTabValue] = useState<string>('1');
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="insurance">
      <TabContext value={tabValue}>
        <AppBar position="static">
          <StyledTabList
            onChange={handleChange}
            aria-label="PRIVI INSURANCE"
            centered
            variant="fullWidth"
          >
            <StyledTab label="INSURANCE POOLS" value="1" />
            <StyledTab label="INSURERS" value="2" />
          </StyledTabList>
        </AppBar>
        <TabPanel value="1">
          <InsurancePools />
        </TabPanel>
        <TabPanel value="2">
          <Insurers />
        </TabPanel>
      </TabContext>
    </div>
  );
}
