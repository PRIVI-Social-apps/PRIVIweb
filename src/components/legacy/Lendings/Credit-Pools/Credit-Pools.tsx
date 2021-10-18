import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { trackPromise } from 'react-promise-tracker';

import { withStyles } from '@material-ui/core/styles';
import { Slider, Dialog } from '@material-ui/core';
import { useTypedSelector } from 'store/reducers/Reducer';
import PoolCard from '../components/Pool-Card/Pool-Card';
import TrendingPools from '../components/Trending-Pools/Trending-Pools';

import URL from 'shared/functions/getURL';
import CreateCreditModal from './CreateCreditPoolModal/CreateCreditModal';
import TutorialModal from 'shared/ui-kit/Page-components/Tutorials/TutorialModal';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';

import './Credit-Pools.css';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';

const CreditPools = (props: any) => {
  const user = useTypedSelector((state) => state.user);
  // HOOKS
  const [userBalances, setUserBalances] = useState<any>({});
  const [popularity, setPopularity] = useState<number>(100);
  const [trustScore, setTrustScore] = useState<number>(100);
  const [searchValue, setSearchValue] = useState<string>('');
  const [creditCapMax, setCreditCapMax] = useState<number>(0);
  const [creditPoolSize, setCreditPoolSize] = useState<number>(0);
  const [creditPoolsList, setCreditPoolsList] = useState<any[]>([]);
  const [endorsementScore, setEndorsementScore] = useState<number>(100);
  const [filteredCreditPoolsList, setFilteredCreditPoolsList] = useState<any[]>(
    []
  );
  const [trendingCreditPoolsList, setTrendingCreditPoolsList] = useState<any[]>(
    []
  );
  const [openModalCreateCredit, setOpenModalCreateCredit] = useState<boolean>(
    false
  );

  const [pagination, setPagination] = useState<number>(0);
  const [hasMoreInfiniteLoader, setHasMoreInfiniteLoader] = useState<boolean>(
    false
  );

  const [openTutorialModal, setOpenTutorialModal] = useState<boolean>(true);
  const handleOpenTutorialModal = () => {
    setOpenTutorialModal(true);
  };
  const handleCloseTutorialModal = () => {
    setOpenTutorialModal(false);
  };

  // FUNCTIONS
  useEffect(() => {
    if (
      user &&
      user.tutorialsSeen &&
      user.tutorialsSeen.creditPools === false
    ) {
      handleOpenTutorialModal();
    }
    if (user && user.id && user.id.length > 0) loadData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    creditPoolsFilterFunction();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popularity, creditPoolSize, trustScore, endorsementScore, searchValue]);

  const handleOpenModalCreateCredit = () => {
    setOpenModalCreateCredit(true);
  };

  const handleCloseModalCreateCredit = () => {
    setOpenModalCreateCredit(false);
  };

  const loadData = async () => {
    trackPromise(
      axios
        .get(`${URL()}/priviCredit/getPriviCredits/${0}/${null}`)
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            const allCredits = resp.data.allCredits || [];
            let maxFund = 0;

            // find max fund and set filter range
            allCredits.forEach((priviObj) => {
              if (priviObj.MaxFunds > maxFund) maxFund = priviObj.MaxFunds;
            });
            setCreditCapMax(maxFund);
            setCreditPoolSize(maxFund);

            setFilteredCreditPoolsList(allCredits); // filtered
            setCreditPoolsList(allCredits); // all
            if (allCredits && allCredits.length < 6) {
              setHasMoreInfiniteLoader(false);
            } else {
              setHasMoreInfiniteLoader(true);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        })
    );
    trackPromise(
      axios
        .get(`${URL()}/priviCredit/getTrendingPriviCredits`)
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            const t = resp.data.trending;
            const trendingCredits: any[] = [];
            t.forEach((obj) => {
              if (obj) trendingCredits.push(obj); // it could be null
            });
            setTrendingCreditPoolsList(trendingCredits);
          }
        })
        .catch((error) => {
          console.log(error);
        })
    );
  };

  const loaderGetData = () => {
    let page: number = pagination + 1;
    setPagination(page);
    fetchDataCredit(page);
  };

  const fetchDataCredit = (page) => {
    let lastId = filteredCreditPoolsList[filteredCreditPoolsList.length - 1].id;
    axios
      .get(`${URL()}/priviCredit/getPriviCredits/${page}/${lastId}`)
      .then((res) => {
        const resp = res.data;
        if (resp.success) {
          const credits = resp.data || [];
          if (credits && credits.length === 0) {
            setHasMoreInfiniteLoader(false);
          } else {
            const allCredits = filteredCreditPoolsList.concat(credits);

            let maxFund = 0;
            // find max fund and set filter range
            allCredits.forEach((priviObj) => {
              if (priviObj.MaxFunds > maxFund) maxFund = priviObj.MaxFunds;
            });
            setCreditCapMax(maxFund);
            setCreditPoolSize(maxFund);

            setFilteredCreditPoolsList(allCredits); // filtered
            setCreditPoolsList(allCredits); // all
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const creditPoolsFilterFunction = () => {
    let creditPools: any[] = [];

    creditPoolsList.forEach((value, i) => {
      if (
        value.popularity <= popularity / 100 &&
        value.endorsement_score <= endorsementScore / 100 &&
        value.trust_score <= trustScore / 100 &&
        value.credit_cap <= creditPoolSize
      ) {
        creditPools.push(value);
      }

      if (creditPoolsList.length === i + 1) {
        setFilteredCreditPoolsList(creditPools);
      }
    });
  };

  const handlePopularityChange = (event, newValue) => {
    setPopularity(newValue);
  };

  const handleCreditPoolSizeChange = (event, newValue) => {
    setCreditPoolSize(newValue);
  };

  const handleTrustScoreChange = (event, newValue) => {
    setTrustScore(newValue);
  };

  const handleEndorsementScoreChange = (event, newValue) => {
    setEndorsementScore(newValue);
  };

  const StyledSlider = withStyles({
    root: {
      color: '#45CFEA',
    },
    thumb: {
      color: 'white',
      border: '2px #45CFEA solid',
    },
    valueLabel: {
      color: '#45CFEA',
      fontFamily: 'Agrandir',
    },
  })(Slider);

  return (
    <div id="scrollableDiv" className="creditPools">
      {/* {!user.tutorialsSeen.creditPools ? (
        <TutorialModal
          open={openTutorialModal}
          handleClose={handleCloseTutorialModal}
          tutorial={'creditPools'}
        />
      ) : null} */}
      <TrendingPools
        tabsPriviCredit={props.tabsPriviCredit}
        trendingCreditPoolsList={trendingCreditPoolsList}
      />
      <InfiniteScroll
        dataLength={filteredCreditPoolsList.length}
        scrollableTarget="scrollableDiv"
        next={loaderGetData}
        hasMore={hasMoreInfiniteLoader}
        loader={
          <LoadingWrapper loading />
        }
      >
        <div className="insurancePools">
          <div className="title">
            <h3>Credit Pools</h3>
            <button onClick={handleOpenModalCreateCredit}>Create new</button>
            <Dialog
              className="modal"
              open={openModalCreateCredit}
              onClose={handleCloseModalCreateCredit}
              fullWidth={true}
              maxWidth={'md'}
            >
              <CreateCreditModal
                open={openModalCreateCredit}
                handleClose={handleCloseModalCreateCredit}
                handleRefresh={loadData}
              />
            </Dialog>
          </div>
          <div className="insurancePoolsBody">
            <div className="poolsCards">
              {filteredCreditPoolsList.length > 0
                ? filteredCreditPoolsList.map((item, i) => {
                  return (
                    <PoolCard
                      key={i}
                      trending={false}
                      pool={item}
                      userBalances={userBalances}
                      handleRefresh={loadData}
                    />
                  );
                })
                : null}
            </div>
            <div className="filters">
              <h4>Filter Credit Pools</h4>
              <label>
                <img
                  src={require('assets/icons/search_right_blue.png')}
                  alt={'search'}
                />
                <InputWithLabelAndTooltip
                  placeHolder="Search by name"
                  type='text'
                  inputValue={searchValue}
                  onInputValueChange={(e) => setSearchValue(e.target.value)}
                />
              </label>
              <div className="slider">
                <div className="labels">
                  <p>Popularity</p>
                  <p>{popularity}%</p>
                </div>
                <StyledSlider
                  defaultValue={popularity}
                  valueLabelDisplay="auto"
                  step={1}
                  max={100}
                  aria-labelledby="continuous-slider"
                  onChangeCommitted={handlePopularityChange}
                />
              </div>
              <div className="slider">
                <div className="labels">
                  <p>Credit Pool size</p>
                  <p>{creditPoolSize} Tokens</p>
                </div>
                <StyledSlider
                  defaultValue={creditPoolSize}
                  valueLabelDisplay="auto"
                  step={1}
                  max={creditCapMax}
                  aria-labelledby="continuous-slider"
                  onChangeCommitted={handleCreditPoolSizeChange}
                />
              </div>
              <div className="slider">
                <div className="labels">
                  <p>Trust Score</p>
                  <p>{trustScore}%</p>
                </div>
                <StyledSlider
                  defaultValue={trustScore}
                  valueLabelDisplay="auto"
                  step={1}
                  max={100}
                  aria-labelledby="continuous-slider"
                  onChangeCommitted={handleTrustScoreChange}
                />
              </div>
              <div className="slider">
                <div className="labels">
                  <p>Endorsement Score</p>
                  <p>{endorsementScore}%</p>
                </div>
                <StyledSlider
                  defaultValue={endorsementScore}
                  valueLabelDisplay="auto"
                  step={1}
                  max={100}
                  aria-labelledby="continuous-slider"
                  onChangeCommitted={handleEndorsementScoreChange}
                />
              </div>
            </div>
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default CreditPools;
