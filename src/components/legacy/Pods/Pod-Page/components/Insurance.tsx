import React, { useState, useEffect } from 'react';
import './Insurance.css';

/*NOTES:
I am guessing that each pod firebase doc contains a Claim document or something like this with at least:

-Title
-Description
-Votes (as a list)
-Quorum
-EndDate
-Accepted (as a boolean)

So if any of this fields is changed or stored differently consider it may not work.
Let me know if you need any help with the UI (marta)
*/

const sampleData = {
  Title: 'What is the difference between eg. ETH-USD vs USD-ETH?',
  Description:
    'Does the order affect the liquidity profitability in any way? I have noticed some tokens are in different order in the positions.',
  Votes: [
    { id: 'buhank3jfrvln6ve48j0buhank3jfrvln6ve48jg', answer: 1 },
    { id: 'bubcfs3jfrvln6ve44p0bubcfs3jfrvln6ve44pg', answer: 1 },
    { id: 'bubcg8rjfrvln6ve44s0bubcg8rjfrvln6ve44sg', answer: 1 },
    { id: 'budse1bjfrvln6ve4600budse1bjfrvln6ve460g', answer: 1 },
    { id: 'budsjvbjfrvln6ve4630budsjvbjfrvln6ve463g', answer: 1 },
    { id: 'budtldbjfrvln6ve4660budtldbjfrvln6ve466g', answer: 0 },
    { id: 'buiimfrjfrvln6ve48v0buiimfrjfrvln6ve48vg', answer: 1 },
    { id: 'buhpntjjfrvln6ve48p0buhpntjjfrvln6ve48pg', answer: 1 },
    { id: 'buhb7ibjfrvln6ve48m0buhb7ibjfrvln6ve48mg', answer: 0 },
  ],
  Quorum: 100,
  EndDate: 1611269259150,
  Accepted: false,
};

export default function Insuance(props) {
  const [claim, setClaim] = useState<any>({});

  const [firstOptionWidth, setFirstOptionWidth] = useState<number>(0);
  const [secondOptionWidth, setSecondOptionWidth] = useState<number>(0);

  const [timeLeft, setTimeLeft] = useState<string>('');

  //check and set % of votes

  useEffect(() => {
    //TODO: LOAD TRUE CLAIM DATA
    setClaim(sampleData);
    getVotingData(sampleData.Votes);
    getTimeLeft(sampleData.EndDate);
  }, [props.pod, props.trigger]);

  const getVotingData = (votes) => {
    let votes_option_1 = 0;
    let votes_option_2 = 0;

    if (votes && votes.length > 0) {
      votes.forEach((vote) => {
        if (vote.answer === 0) {
          votes_option_1++;
        } else if (vote.answer === 1) {
          votes_option_2++;
        }
      });
    }

    let total_votes = votes_option_1 + votes_option_2;

    setFirstOptionWidth((votes_option_1 / total_votes) * 100);
    setSecondOptionWidth((votes_option_2 / total_votes) * 100);
  };

  const getTimeLeft = (endDate) => {
    const difference = endDate - new Date().getTime();
    if (difference / 1000 / 3600 > 24) {
      setTimeLeft(`${Math.ceil(difference / (1000 * 60 * 60 * 24))} days`);
    } else {
      setTimeLeft(`${(difference / 1000 / 3600).toFixed(0)} hours`);
    }
  };

  const handleViewInsurance = () => {
    //TODO: view insurance pool
  };

  const handleRequestVoting = () => {
    //TODO: request claim voting
  };

  const CreateClaimBox = (props) => {
    return (
      <div className="create-claim">
        <div>
          <div className="header">
            <div className="symbol">C</div>
            <p>Create claim for insurance</p>
          </div>
          <h4>{props.claim.Title}</h4>
          <p>{props.claim.Description}</p>
        </div>
        {props.claim.Votes && props.claim.Votes.length > 0 ? (
          <div className="results">
            <div className="claims-history-area">
              <div className="area-container">
                <div
                  className="green-area"
                  style={{ width: `calc(${firstOptionWidth}% - 1px)` }}
                />
              </div>
              <div className="answers">
                <p>{`${firstOptionWidth.toFixed(2)}%`}</p>
                <p>Yes</p>
              </div>
              <div className="area-container">
                <div
                  className="red-area"
                  style={{ width: `calc(${secondOptionWidth}% - 1px)` }}
                />
              </div>
              <div className="answers">
                <p>{`${secondOptionWidth.toFixed(2)}%`}</p>
                <p>No</p>
              </div>
            </div>
          </div>
        ) : (
          <p>No votes</p>
        )}
      </div>
    );
  };

  const InsurerVotingBox = (props) => {
    return (
      <div className="voting">
        <div>
          <div className="header">
            <div className="symbol">P</div>
            <p>Voting on insurance pool</p>
          </div>
          <div className="subheader">
            <img
              className="symbol"
              src={require(`assets/icons/green_check.png`)}
              alt={'check'}
            />
            <p>Claim passed</p>
          </div>
          <div className="subheader">
            <div className="symbol">P</div>
            <p>Voting on insurance pool started</p>
          </div>
        </div>
        {props.claim.Votes && props.claim.Votes.length > 0 ? (
          <div className="results">
            <div className="claims-history-area">
              <div className="area-container">
                <div
                  className="green-area"
                  style={{ width: `calc(${firstOptionWidth}% - 1px)` }}
                />
              </div>
              <div className="answers">
                <p>{`${firstOptionWidth.toFixed(2)}%`}</p>
                <p>Yes</p>
              </div>
              <div className="area-container">
                <div
                  className="red-area"
                  style={{ width: `calc(${secondOptionWidth}% - 1px)` }}
                />
              </div>
              <div className="answers">
                <p>{`${secondOptionWidth.toFixed(2)}%`}</p>
                <p>No</p>
              </div>
            </div>
          </div>
        ) : (
          <p>No votes</p>
        )}
      </div>
    );
  };

  const InsuredVotingBox = (props) => {
    return (
      <div className="voting">
        <div>
          <div className="header">
            <div className="symbol">P</div>
            <p>Voting on insurance pool</p>
          </div>
          <div className="subheader">
            <img
              className="symbol"
              src={require(`assets/icons/green_check.png`)}
              alt={'check'}
            />
            <p>Claim passed</p>
          </div>
          <div className="subheader">
            <div className="symbol">P</div>
            <p>Voting on insurance pool started</p>
          </div>
          <div className="info-row">
            <div>
              <p>Total Votes</p>
              <h4>
                {props.claim.Votes && props.claim.Votes.length
                  ? props.claim.Votes.length
                  : 0}
              </h4>
            </div>
            <div>
              <p>Quorum required</p>
              <h4>{props.claim.Quorum ? props.claim.Quorum : 0}</h4>
            </div>
            <div>
              <p>Time left</p>
              <h4>{timeLeft}</h4>
            </div>
          </div>
        </div>
        <button onClick={handleViewInsurance}>View on Insurance Pool</button>
      </div>
    );
  };

  const InsurerResultsBox = (props) => {
    return (
      <div className="claim-results">
        <div>
          <div className="header">
            <div className="symbol">R</div>
            <p>Claim results</p>
          </div>
          {!props.claim.Accepted ? (
            <div>
              <div className="subheader">
                <img
                  className="symbol"
                  src={require(`assets/icons/red_cross.png`)}
                  alt={'check'}
                />
                <p>Claim denied</p>
              </div>
              <p className="message">
                Claim has been denied, if there is enough votes, it will be
                passed on to digital court.
              </p>
            </div>
          ) : null}
        </div>
        {!props.claim.Accepted ? (
          <div>
            <button onClick={handleRequestVoting}>
              Request voting on Digital Court
            </button>
            <div className="info-row">
              <div>
                <p>Total Votes</p>
                <h4>
                  {props.claim.Votes && props.claim.Votes.length
                    ? props.claim.Votes.length
                    : 0}
                </h4>
              </div>
              <div>
                <p>Quorum required</p>
                <h4>{props.claim.Quorum ? props.claim.Quorum : 0}</h4>
              </div>
              <div>
                <p>Time left</p>
                <h4>{timeLeft}</h4>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const InsuredResultsBox = (props) => {
    return (
      <div className="claim-results">
        {!props.claim.Results ? (
          <div className="header pending">
            <div className="symbol">R</div>
            <p>Claim results pending</p>
          </div>
        ) : null}
      </div>
    );
  };

  const InsurerRow = (props) => {
    return (
      <div className="row">
        <CreateClaimBox claim={props.claim} />
        <InsurerVotingBox claim={props.claim} />
        <InsurerResultsBox claim={props.claim} />
      </div>
    );
  };

  const InsuredRow = (props) => {
    return (
      <div className="row">
        <CreateClaimBox claim={props.claim} />
        <InsuredVotingBox claim={props.claim} />
        <InsuredResultsBox claim={props.claim} />
      </div>
    );
  };

  if (claim)
    return (
      <div className="pod-insurance">
        <h3>Claims</h3>
        <div className="claims">
          {
            //TODO: filter if user is an insurer or insured user and display its corresponding row
            //should be something like:
            //user insurer  ? <InsurerRow claim={claim} /> : <InsuredRow claim={claim}/>
            //atm showing both rows to display the UI design
          }
          <InsuredRow claim={claim} />
          <InsurerRow claim={claim} />
        </div>
      </div>
    );
  else return null;
}
