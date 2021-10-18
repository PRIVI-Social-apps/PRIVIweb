import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Moment from "react-moment";

import { Dialog, Box, Grid } from "@material-ui/core";

import DaoProposal from "../../../modals/Dao-Proposal/Dao-proposal";
import URL from "shared/functions/getURL";
import { setSelectedUser } from "store/actions/SelectedUser";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { getUser } from "store/selectors/user";
import { setUser } from "store/actions/User";
import axios from "axios";
import {RootState} from "../../../../../../../store/reducers/Reducer";

export default function ProposalItem(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const user = useSelector(getUser);
  const userSelector = useSelector((state: RootState) => state.user);

  const [finished, setFinished] = useState<boolean>(false);

  const [status, setStatus] = useState<any>("");

  const [openDaoProposalModal, setOpenDaoProposalModal] = useState<boolean>(false);
  const handleOpenOpenDaoProposalModal = () => {
    setOpenDaoProposalModal(true);
  };
  const handleCloseOpenDaoProposalModal = () => {
    setOpenDaoProposalModal(false);
  };

  const handleFollowDaoProposal = () => {
    if (user) {
      if (props.item && props.item.Followers && props.item.Followers.findIndex(follower => follower.id === userSelector.id) !== -1) {
        axios
          .post(`${URL()}/voting/unfollow`, {
            collection: 'CommunityProposal',
            votingAddress: props.item.id,
            userAddress: user.id
          }).then(res => {
            let resp = res.data;
            if(resp.success) {
              props.onRefreshInfo();
              dispatch(
                setUser({
                  ...user,
                  followingProposals: user.followingProposals.filter(item => item !== props.item.VotationId),
                })
              );
            } else {
              setStatus({
                msg: resp.error || 'Error making the request',
                key: Math.random(),
                variant: "error",
              });
            }
          });
      } else {
        axios
          .post(`${URL()}/voting/follow`, {
            collection: 'CommunityProposal',
            votingAddress: props.item.id,
            userAddress: user.id
          })
          .then(res => {
            let resp = res.data;
            if(resp.success) {
              props.onRefreshInfo();
              dispatch(
                setUser({
                  ...user,
                  followingProposals: [...user.followingProposals, props.item.VotationId],
                })
              );
            } else {
              setStatus({
                msg: resp.error || 'Error making the request',
                key: Math.random(),
                variant: "error",
              });
            }
          });
      }
    }
  };

  useEffect(() => {
    if (new Date(props.item.EndingDate * 1000).getTime() < new Date().getTime()) {
      setFinished(true);
    }
  }, [props.item]);

  if (props.item)
    return (
      <div className={props.version && props.version === 2 ? "proposal v2" : "proposal"}>
        {props.item.cofoundersOnly && <div className="tag">🔒 Co-Founders Only</div>}

        {
          props.item.ProposalType === 'CommunityTransfer' ?
            <Box
              fontWeight={props.version && props.version === 2 ? 800 : 400}
              fontSize={18}
              mt={props.version && props.version === 2 ? 0 : 2}
            >
              <b>Community Transfer</b>
              {
                props.item && props.item.Proposal && props.item?.Proposal?.Amount && props.item?.Proposal?.Token ?
                  <p style={{
                    fontWeight: 'normal',
                    marginBottom: '10px',
                    marginTop: '20px'
                  }}>Amount: {props.item?.Proposal?.Amount} {props.item?.Proposal?.Token}</p> :
                  null
              }
              {
                props.item && props.item.Proposal && props.item?.Proposal?.To ?
                  <p style={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    fontWeight: 'normal',
                    marginBottom: '20px',
                    marginTop: '10px'
                  }}>To: {props.item?.Proposal?.To}</p> :
                  null
              }
            </Box> :
            <Box
              fontWeight={props.version && props.version === 2 ? 800 : 400}
              fontSize={18}
              mt={props.version && props.version === 2 ? 0 : 2}
            >
              {props.item.Question}
            </Box>
        }
        <Box
          fontWeight={props.version && props.version === 2 ? 800 : 400}
          fontSize={18}
          mt={props.version && props.version === 2 ? 0 : 2}
        >
          {props.item.Question}
        </Box>
        {!props.version && (
          <div className="creator">
            <div
              className="user-image cursor-pointer"
              onClick={() => {
                history.push(`/profile/${props.item.CreatorId}`);
                dispatch(setSelectedUser(props.item.CreatorId));
              }}
              style={{
                backgroundImage: `${URL()}/user/getPhoto/${props.item.CreatorId}`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "30px",
                cursor: "pointer",
              }}
            />
            <p
              style={{ cursor: "pointer", fontSize: 14, color: "#000000" }}
              onClick={() => {
                history.push(`/profile/${props.item.CreatorId}`);
                dispatch(setSelectedUser(props.item.CreatorId));
              }}
            >
              {props.item.CreatorName ? props.item.CreatorName : "unknown user"}
            </p>
          </div>
        )}
        {props.version && props.version === 2 && (
          <div className="votes-info">
            <Grid container direction="row" spacing={1}>
              <Grid item sm={12} md={6}>
                <img src={require("assets/icons/clock_gray.png")} alt="clock" />
                {finished ? (
                  <p>Ended</p>
                ) : (
                  <p>
                    Ends <Moment fromNow>{props.item.ProposalEndingTime}</Moment>
                  </p>
                )}
              </Grid>
              <Grid item sm={12} md={6}>
                <img src={require("assets/icons/flag.png")} alt="flag" />
                <p>{props.item.NumVotes ? `${props.item.NumVotes} votes` : "no votes"}</p>
              </Grid>
            </Grid>
          </div>
        )}
        {finished && (
          <div className="bar-container">
            <div
              className="bar"
              style={{ width: `${((props.item.NumVotes / props.item.TotalVotes) * 100).toFixed(0)}%` }}
            />
          </div>
        )}
        {!props.version && (
          <div className="creator">
            <div
              className="user-image cursor-pointer"
              onClick={() => {
                history.push(`/profile/${props.item.CreatorId}`);
                dispatch(setSelectedUser(props.item.CreatorId));
              }}
              style={{
                backgroundImage:
                  props.item && props.item.url ? `url(${props.item.url}?${Date.now()})` : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "30px",
                cursor: "pointer",
              }}
            />
            <p
              style={{ cursor: "pointer", fontSize: 14, color: "#000000" }}
              onClick={() => {
                history.push(`/profile/${props.item.CreatorId}`);
                dispatch(setSelectedUser(props.item.CreatorId));
              }}
            >
              {props.item.CreatorName ? props.item.CreatorName : "unknown user"}
            </p>
          </div>
        )}
        <div className="bottom">
          {!finished && !props.voters.find(voter => voter.VotationId === props.item.id) && (
            <PrimaryButton onClick={handleOpenOpenDaoProposalModal} size="medium">{`Vote ${!props.version ? "on this proposal" : ""
              }`}</PrimaryButton>
          )}
          <SecondaryButton
            onClick={handleFollowDaoProposal}
            size="medium"
            style={{ marginTop: !props.version ? 10 : 0 }}
          >
            {props.item && props.item.Followers && props.item.Followers.findIndex(follower => follower.id === userSelector.id) !== -1 ? (
              <span>
                <img src={require("assets/icons/tick.png")} alt="tick" /> Following
              </span>
            ) : (
              "Follow"
            )}
          </SecondaryButton>
        </div>
        <Dialog
          className="modalCreateModal"
          open={openDaoProposalModal}
          onClose={handleCloseOpenDaoProposalModal}
          fullWidth={true}
          maxWidth={"md"}
        >
          <DaoProposal
            onCloseModal={handleCloseOpenDaoProposalModal}
            proposal={props.item}
            onRefreshInfo={() => props.onRefreshInfo()}
            creatorImageurl={props.item && props.item.url ? `${props.item.url}?${Date.now()}` : "none"}
            creatorName={props.item.CreatorName || ""}
            itemId={props.itemId}
            itemType={props.itemType}
          />
        </Dialog>
      </div>
    );
  else return null;
}
