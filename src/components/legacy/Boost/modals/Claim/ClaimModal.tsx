import { Modal } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
// import { Wheel } from 'react-custom-roulette';
import { TwitterShareButton, FacebookShareButton } from "react-share";
import './ClaimModal.css';

export default function ClaimModal(props) {
  //hooks
  const [claim, setClaim] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);
  const [tPrivi, setTPrivi] = useState<number>(0);
  const [tPriviInsurance, setTPriviInsurance] = useState<number>(0);
  const [rewardNumber, setRewardNumber] = useState<number>(-1);
  const [mustSpin, setMustSpin] = useState<boolean>(false);
  const [spinFinished, setSpinFinished] = useState<boolean>(false);

  const rewards = [
    {
      option: '10000 TPRIVI',
      style: {
        backgroundColor: !spinFinished
          ? '#EB356A'
          : spinFinished && rewardNumber === 0
          ? '#EB356A'
          : '#656e7e41',
      },
    },
    {
      option: '3% bonus',
      style: {
        backgroundColor: !spinFinished
          ? '#662195'
          : spinFinished && rewardNumber === 1
          ? '#662195'
          : '#656e7e41',
      },
    },
    {
      option: '5% bonus',
      style: {
        backgroundColor: !spinFinished
          ? '#F4BC43'
          : spinFinished && rewardNumber === 2
          ? '#F4BC43'
          : '#656e7e41',
      },
    },
    {
      option: '2% bonus',
      style: {
        backgroundColor: !spinFinished
          ? '#EC6847'
          : spinFinished && rewardNumber === 3
          ? '#EC6847'
          : '#656e7e41',
      },
    },
    {
      option: 'Badge of luck',
      style: {
        backgroundColor: !spinFinished
          ? '#59C3C1'
          : spinFinished && rewardNumber === 4
          ? '#59C3C1'
          : '#656e7e41',
      },
    },
    {
      option: '2000 TPRIVI',
      style: {
        backgroundColor: !spinFinished
          ? '#57BC9C'
          : spinFinished && rewardNumber === 5
          ? '#57BC9C'
          : '#656e7e41',
      },
    },
  ];

  //useEffect
  useEffect(() => {
    //set user data
    //TODO: get real data
    setPoints(350);
    setTPrivi(300);
    setTPriviInsurance(50);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //functions
  const handleSpin = () => {
    const newPrizeNumber = Math.floor(Math.random() * rewards.length);
    setRewardNumber(newPrizeNumber);
    //console.log(newPrizeNumber);
    setMustSpin(true);
    setClaim(false);
  };

  const handleClaimReward = () => {
    //TODO: claim reward
    setClaim(true);
  };

  const handleClose = () => {
    setClaim(false);
    setRewardNumber(-1);
    setSpinFinished(false);
    props.handleClose();
  };

  //page components
  const ClaimSpin = () => {
    return (
      <div className="claim-spin">
        <h3>Claim</h3>
        <div className="row">
          <div className="column">
            <span>Total points</span>
            <p>{points}</p>
          </div>
          <div className="column">
            <span>TPRIVI</span>
            <p>{tPrivi}</p>
          </div>
          <div className="column">
            <span>TPRIVI insurance</span>
            <p>{tPriviInsurance}</p>
          </div>
        </div>
        <div
          className={
            spinFinished && rewardNumber === 0
              ? 'roulette prize0'
              : spinFinished && rewardNumber === 1
              ? 'roulette prize1'
              : spinFinished && rewardNumber === 2
              ? 'roulette prize2'
              : spinFinished && rewardNumber === 3
              ? 'roulette prize3'
              : spinFinished && rewardNumber === 4
              ? 'roulette prize4'
              : spinFinished && rewardNumber === 5
              ? 'roulette prize5'
              : 'roulette'
          }
        >
          {/* <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={3}
            data={rewards}
            textColors={['#ffffff']}
            onStopSpinning={() => {
              setMustSpin(false);
              setSpinFinished(true);
            }}
            outerBorderColor={'#ffffff'}
            outerBorderWidth={20}
            innerBorderColor={'#ffffff'}
            innerBorderWidth={60}
            radiusLineColor={'#ffffff'}
            radiusLineWidth={10}
            fontSize={18}
          /> */}
        </div>

        <button
          disabled={mustSpin && rewardNumber === -1}
          onClick={!spinFinished ? handleSpin : handleClaimReward}
        >
          {!spinFinished ? 'Spin' : 'Claim reward'}
        </button>
      </div>
    );
  };

  const ClaimReward = () => {
    return (
      <div className="claim-reward">
        <div className="hex-result">
          <span>{rewards[rewardNumber].option.split(' ')[0]}</span>
          <span>
            {rewards[rewardNumber].option.split(' ').splice(1, 1).join(' ')}
          </span>
        </div>
        <h2>Congratulations</h2>
        <span>{`You've claimed ${rewards[rewardNumber].option} reward`}</span>
        <button onClick={handleClose}>Proceed</button>
        <div className="row">
          <div className="share-box">
          <FacebookShareButton
              quote={"Check out my new claimed PRIVI reward " + rewards[rewardNumber].option + "\n\n"}
              url={window.location.href}
              hashtag="PRIVI"
            >
              <img
                src={require('assets/snsIcons/facebook_hexagon.png')}
                alt={'facebook hexagon'}
              />
            </FacebookShareButton>
              Share on Facebook
          </div>
          <div className="share-box">
          <TwitterShareButton
              title={"Check out my new claimed PRIVI reward " + rewards[rewardNumber].option + "\n\n"}
              url={window.location.href}
              hashtags={["PRIVI"]}
            >
              <img
                src={require('assets/snsIcons/twitter_hexagon.png')}
                alt={'twitter hexagon'}
              />
            </TwitterShareButton>
              Share on Twitter
          </div>
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
      className="modal"
    >
      <div
        className={
          claim
            ? 'modal-content claim-modal reward w50'
            : 'modal-content white-inputs claim-modal'
        }
      >
        <div className="exit" onClick={props.handleClose}>
          <img
            src={require('assets/icons/x_darkblue.png')}
            alt={'x'}
          />
        </div>
        {claim === false ? <ClaimSpin /> : <ClaimReward />}
      </div>
    </Modal>
  );
}
