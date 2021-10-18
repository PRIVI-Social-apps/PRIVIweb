import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";

import { RootState } from "store/reducers/Reducer";

import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { signTransaction } from "shared/functions/signTransaction";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import "./Dao-proposal.css";
import "../Communities-modals.css";
import { PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import {Box} from "@material-ui/core";

const DaoProposal = (props: any) => {
  const userSelector = useSelector((state: RootState) => state.user);

  const [graphVotes, setGraphVotes] = useState<any>({
    yes: 0,
    no: 0,
  });
  const [valueVote, setValueVote] = useState<any>(1.5);
  const [vote, setVote] = useState<string>("Yes");
  const [voteOptions, setVoteOptions] = useState<string[]>(["Yes", "No"]);
  const [voters, setVoters] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [status, setStatus] = useState<any>("");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  useEffect(() => {
    getAllVotingDaoProposal(props.proposal.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllVotingDaoProposal = proposalId => {
    setIsDataLoading(true);
    axios
      .get(`${URL()}/voting/getDaoProposal/${proposalId}`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          let votersData = resp.data.voters;
          setVoters(votersData);
          console.log(votersData, props.proposal);

          let yesVoters: any[] = votersData.filter(vot => vot.VotingType === "YES");
          let noVoters: any[] = votersData.filter(vot => vot.VotingType === "NO");

          let yesVotes: number = 0;
          let noVotes: number = 0;

          yesVoters.forEach(voter => {
            yesVotes = yesVotes + voter.StakedAmount;
          });
          noVoters.forEach(voter => {
            noVotes = noVotes + voter.StakedAmount;
          });

          setGraphVotes({
            yes: (yesVotes / (yesVotes + noVotes)) * 100,
            no: (noVotes / (yesVotes + noVotes)) * 100,
          });
        } else {
          console.log("error getting all communities");
        }
        setIsDataLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsDataLoading(false);
      });
  };

  const handleChangeVote = event => {
    const value = event.target.value;
    if (value === "Yes") {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(1);
    }
    setVote(value);
  };

  const voteAction = async () => {
    console.log('props', props);
    let data: any = {
      VoterAddress: userSelector.id,
      VotationId: props.proposal.ProposalId,
      StakedAmount: valueVote,
      VotingType: vote.toUpperCase()
    };

    const [hash, signature] = await signTransaction(userSelector.mnemonic, data);

    data.userId = userSelector.id;
    data.voteIndex = selectedIndex;
    data.type = "staking";
    data.itemType = props.itemType;
    data.itemId = props.itemId;
    data.hash = hash;
    data.signature = signature;
    data.voterAddress = userSelector.id;
    data.votationId = props.proposal.ProposalId;
    data.stakedAmount = valueVote;

    axios
      .post(`${URL()}/voting/vote`, data)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "Vote made",
            key: Math.random(),
            variant: "success",
          });
          setTimeout(() => {
            props.onRefreshInfo();
            setStatus("");
          }, 1000);
        } else {
          console.log(resp.error);
          setStatus({
            msg: resp.error,
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(err => {
        console.log("Error voting:", err);
        setStatus({
          msg: "Error voting",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  return (
    <div className="modalDaoProposal modal-content">
      <div className="firstPartDaoProposal">
        <div className="exit" onClick={props.onCloseModal}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <Grid container spacing={2} direction="row" alignItems="center" justify="flex-start">
          {
            props.proposal.ProposalType === 'CommunityTransfer' ?
              <Grid item xs={12} md={9} className="nameDaoProposal">
                <b>Community Transfer</b>
              </Grid> :
              <Grid item xs={12} md={9} className="nameDaoProposal">
                {props.proposal.Question ? props.proposal.Question : "Untitled Proposal"}
              </Grid>
          }
          <Grid item xs={12} md={3}>
            <div className="balanceDaoProposal">
              {`Balance ${props.Balance ? props.Balance : "N/A"} PRIVI`}
            </div>
          </Grid>
        </Grid>
        {
          props.proposal.ProposalType === 'CommunityTransfer' ?
            <>
              {
                props.proposal && props.proposal.Proposal && props.proposal?.Proposal?.Amount && props.proposal?.Proposal?.Token ?
                  <p style={{
                    fontWeight: 'normal',
                    marginBottom: '10px'
                  }}>Amount: {props.proposal?.Proposal?.Amount} {props.proposal?.Proposal?.Token}</p> :
                  null
              }
              {
                props.proposal && props.proposal.Proposal && props.proposal?.Proposal?.To ?
                  <p style={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    fontWeight: 'normal',
                    marginTop: '10px'
                  }}>To: {props.proposal?.Proposal?.To}</p> :
                  null
              }
            </> :
            <div className="descriptionDaoProposal">
              {props.proposal.Description ? props.proposal.Description : "No description"}
            </div>
        }

        <div
          className="flexRowInputsCommunitiesModal"
          style={{
            alignItems: "center",
          }}
        >
          <div
            className="authorPhotoDaoProposal"
            style={{
              backgroundImage:
                props.creatorImageURL && props.creatorImageURL.length > 0
                  ? `url(${props.creatorImageURL})`
                  : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
            }}
          ></div>
          <div className="authorNameDaoProposal" style={{ cursor: "pointer" }}>
            {props.creatorName}
          </div>
        </div>
      </div>
      <LoadingWrapper loading={isDataLoading}>
        <div className="secondPartDaoProposal">
          <div className="squareWhiteDaoProposal">
            <Grid container spacing={2} direction="row" alignItems="center" justify="flex-start">
              <Grid item xs={12} md={4}>
                <div className="headerSquareWhiteDaoProposal">Votes</div>
                <div className="valueSquareWhiteDaoProposal">
                  {voters && voters.length > 0 ? voters.length : "0"}
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <div className="headerSquareWhiteDaoProposal">Votes Required</div>
                <div className="valueSquareWhiteDaoProposal">
                  {props.proposal.TotalVotes ? `${props.proposal.TotalVotes}` : "0"}
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <div className="headerSquareWhiteDaoProposal">Quorum required</div>
                <div className="valueSquareWhiteDaoProposal">
                  {props.proposal.QuorumRequired ? `${props.proposal.QuorumRequired * 100}%` : "0"}
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              className="graphBarDaoProposalGrid"
              spacing={2}
              direction="row"
              alignItems="flex-start"
              justify="flex-start"
            >
              <Grid item xs={9} md={10}>
                <div className="graphBarDaoProposal">
                  <div
                    className="graphBarDaoProposalIn green-area"
                    style={{
                      width: `${graphVotes.yes}%`,
                    }}
                  ></div>
                </div>
                <div className="graphBarDaoProposal">
                  <div
                    className="graphBarDaoProposalIn  red-area"
                    style={{
                      width: `${graphVotes.no}%`,
                    }}
                  ></div>
                </div>
              </Grid>
              <Grid item xs={3} md={2}>
                <div className="valueGraphBarDaoProposal">{graphVotes.yes.toFixed(2)} %</div>
                <div className="valueGraphBarDaoProposal">{graphVotes.no.toFixed(2)} %</div>
              </Grid>
            </Grid>
            <Grid container
                  spacing={2}
                  direction="row"
                  alignItems="center"
                  justify="flex-start">
              <Grid item xs={4} md={3}>
                <InputWithLabelAndTooltip
                  type="number"
                  inputValue={valueVote}
                  placeHolder="Value..."
                  onInputValueChange={e => {
                    setValueVote(e.target.value);
                  }}
                  style={{
                    width: "calc(100% - 24px)",
                    margin: 0
                  }} />
              </Grid>
              <Grid item xs={4} md={3}>
                <FormControl className="selectorFormControlDaoProposal">
                  <StyledSelect
                    disableUnderline
                    value={vote}
                    style={{
                      width: "100%",
                      margin: 0
                    }}
                    className="selectDaoProposal"
                    onChange={handleChangeVote}
                  >
                    {voteOptions.map((item, i) => {
                      return (
                        <StyledMenuItem key={i} value={item}>
                          {item}
                        </StyledMenuItem>
                      );
                    })}
                  </StyledSelect>
                </FormControl>
              </Grid>
              <Grid item xs={4} md={3}>
                <PrimaryButton
                  size="medium"
                  onClick={voteAction}
                >
                  Vote
                </PrimaryButton>
              </Grid>
            </Grid>
          </div>

          <div></div>
        </div>
      </LoadingWrapper>

      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
};

export default DaoProposal;
