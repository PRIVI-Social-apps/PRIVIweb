import './Index.css';
import React, { useState, useEffect } from 'react';
import { useTypedSelector } from "store/reducers/Reducer";
import { useHistory } from "react-router-dom";
import { AppBar, Tab, Tabs, Dialog } from '@material-ui/core';
import Buttons from 'shared/ui-kit/Buttons/Buttons';
import IndexesList from './components/IndexesList';
import CreateTokenModal from './components/CreateTokenModal';
import { sampleIndexData, sampleUserData, sampleIndexesData } from './sampleData.js';
import { UserAvatar } from "shared/ui-kit/UserAvatar/UserAvatar";
import ComingSoonModal from 'shared/ui-kit/Modal/Modals/ComingSoonModal';

const indexTabCategories = ['All indexes', 'Index type', 'Index type 2'];

export default function Index() {
  const user = useTypedSelector((state) => state.user);
  // HOOKS
  const [tabsIndexValue, setTabsIndexValue] = React.useState(0);
  const [disableClick, setDisableClick] = useState<boolean>(false);
  const [openCreateToken, setOpenCreateToken] = useState<boolean>(false);

  const [openModalComingSoon, setOpenModalComingSoon] = useState<boolean>(true);

  const history = useHistory();
  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  const handleCloseModalComingSoon = () => {
    //setOpenModalComingSoon(false);
  };

  // FUNCTIONS
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenCreateToken = () => {
    setOpenCreateToken(true);
  };

  const handleCloseCreateToken = () => {
    setOpenCreateToken(false);
  };

  const handleChangeTabsIndex = (event, newValue) => {
    setTabsIndexValue(newValue);
  };

  const getIndexData = () => {
    //TODO: get the the necessary data to show in the index details
    //atm considering format a list of objects with
    //indexCap: number,
    //globalGrowth: number,
    //funds: number,
    //investments: number,
    //check sampleIndexData in sampleData.js to see an example
  };

  const getUserData = () => {
    //TODO: get the the necessary data to show in the index details
    //atm considering format a list of objects with
    //myInvestment: number,
    //dailyReturns: number,
    //weeklyReturns: number,
    //monthlyReturns: number,
    /*balances: [
        {
            tokenName: string,
            balance: number
            ... etc
        }*/
    //check sampleUserData in sampleData.js to see an example
  };

  const getIndexesData = () => {
    //TODO: get indexes data to show in the list
    //atm considering format a list of objects with
    //name: string,
    //shares: number,
    //returnType: string,
    //assets: tokens[] <- should include id or something to locate the image, for now is a list with
    //the token names to locate the image in assets,
    //performanceAllTime: number,
    //performanceMonth: number,
    //sharePrice: number
    //check sampleIndexesData in sampleData.js to see an example
  };

  const loadData = () => {
    getIndexData();
    getUserData();
    getIndexesData();
  };

  const refreshIndex = () => {
    // function also that a child (Withdraw, Deposit or Transfer) can call to refresh Wallet // https://stackoverflow.com/questions/55726886/react-hook-send-data-from-child-to-parent-component
    loadData();
    // @ts-ignore: Object is possibly 'null'.
  };

  return (
    <div className="index-page">
      <div className={`header`}>
        <h2>Index</h2>
        <div className="buttons">
          {isSignedIn() ? (
            <UserAvatar
              user={user}
              onClick={() => {
                history.push(`/profile/${user.id}`);
              }}
            />
          ) : (
            <Buttons />
          )}
        </div>
      </div>
      <div className="index-data">
        <div className="user-info">
          <div className="left">
            <div className="detail">
              <p>My investment</p>
              <h3>{`${sampleUserData.myInvestment.toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })} PRIVI`}</h3>
            </div>
            <div className="detail">
              <p>Daily returns</p>
              <h4>{`${sampleUserData.dailyReturns.toFixed(2)} PRIVI`}</h4>
            </div>
            <div className="detail">
              <p>Weekly returns</p>
              <h4>{`${sampleUserData.weeklyReturns.toFixed(2)} PRIVI`}</h4>
            </div>
            <div className="detail">
              <p>Monthly returns</p>
              <h4>{`${sampleUserData.monthlyReturns.toFixed(2)} PRIVI`}</h4>
            </div>
          </div>
          <button onClick={handleOpenCreateToken}>
            <img
              src={require('assets/icons/plus_white.png')}
              alt="plus"
            />
            Create token
          </button>
          <Dialog
            className="modal"
            open={openCreateToken}
            onClose={handleCloseCreateToken}
            fullWidth={true}
            maxWidth={'md'}
          >
            <CreateTokenModal
              disabled={disableClick}
              open={openCreateToken}
              handleClose={handleCloseCreateToken}
              refreshIndex={refreshIndex}
            />
          </Dialog>
        </div>
        <div className="index-info">
          <div className="white-box">
            <p>Index cap</p>
            <h3>{`${sampleIndexData.indexCap.toLocaleString('en-US', {
              maximumFractionDigits: 3,
            })}`}</h3>
          </div>
          <div className="white-box">
            <p>Global growth</p>
            <h3>{`${(sampleIndexData.globalGrowth * 100).toFixed(0)}%`}</h3>
          </div>
          <div className="white-box">
            <p>Funds</p>
            <h3>{`${sampleIndexData.funds}`}</h3>
          </div>
          <div className="white-box">
            <p>Investments</p>
            <h3>{`${sampleIndexData.investments}`}</h3>
          </div>
        </div>

        <div className="indexes">
          <h3>Indexes</h3>
          <AppBar position="static" className="appBarTabsToken">
            <Tabs
              TabIndicatorProps={{
                style: { background: '#64c89e', height: '3px' },
              }}
              value={tabsIndexValue}
              className="tabsToken"
              onChange={handleChangeTabsIndex}
            >
              {indexTabCategories.map((name) => {
                return <Tab label={name} key={name} />;
              })}
            </Tabs>
          </AppBar>
          <IndexesList indexes={sampleIndexesData} />
        </div>
      </div>
      {openModalComingSoon && <ComingSoonModal
        open={openModalComingSoon}
        handleClose={handleCloseModalComingSoon}
      />}
    </div>
  );
}
