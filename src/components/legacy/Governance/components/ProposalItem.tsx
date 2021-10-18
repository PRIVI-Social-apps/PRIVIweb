import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Moment from "react-moment";

import { Box, Dialog, Grid, makeStyles } from "@material-ui/core";

import URL from "shared/functions/getURL";
import { setSelectedUser } from "store/actions/SelectedUser";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { getUser } from "store/selectors/user";
import { setUser } from "store/actions/User";
import axios from "axios";
import DaoProposal from "components/legacy/Communities/CommunityPage/modals/Dao-Proposal/Dao-proposal";

const useStyles = makeStyles(theme => ({
  proposal: {
    padding: theme.spacing(2),
    marginRight: theme.spacing(1),
    borderRadius: theme.spacing(2),
    marginLeft: theme.spacing(1),
    boxShadow: "-2px -2px 20px -5px rgb(148 148 148 / 66%)",
    width: theme.spacing(50),
  },
  questionBox: {
    paddingBottom: theme.spacing(1),
    borderBottom: "1px solid #18181822",
  },
  votesBox: {
    paddingTop: theme.spacing(1),
    borderBottom: "1px solid #18181822",
  },
  voteSubBox: {
    display: "flex",
    alignItems: "center",

    "& p": {
      marginLeft: theme.spacing(1),
    },
  },
  bottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
  },
}));

export default function ProposalItem(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const user = useSelector(getUser);

  const [finished, setFinished] = useState<boolean>(false);
  const classes = useStyles();

  const [openDaoProposalModal, setOpenDaoProposalModal] = useState<boolean>(false);
  const handleOpenOpenDaoProposalModal = () => {
    setOpenDaoProposalModal(true);
  };
  const handleCloseOpenDaoProposalModal = () => {
    setOpenDaoProposalModal(false);
  };

  const handleFollowDaoProposal = () => {
    if (user) {
      if (user.followingProposals?.includes(props.item.VotationId)) {
        axios
          .post(`${URL()}/voting/unfollow`, { votingAddress: props.item.VotationId, userAddress: user.id })
          .then(res => {
            dispatch(
              setUser({
                ...user,
                followingProposals: user.followingProposals.filter(item => item !== props.item.VotationId),
              })
            );
          });
      } else {
        axios
          .post(`${URL()}/voting/follow`, { votingAddress: props.item.VotationId, userAddress: user.id })
          .then(res => {
            dispatch(
              setUser({
                ...user,
                followingProposals: [...user.followingProposals, props.item.VotationId],
              })
            );
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
      <div className={classes.proposal}>
        {props.item.cofoundersOnly && <div className="tag">🔒 Co-Founders Only</div>}
        <Box
          fontWeight={props.version && props.version === 2 ? 800 : 400}
          fontSize={18}
          mt={props.version && props.version === 2 ? 0 : 2}
          className={classes.questionBox}
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
          <div className={classes.votesBox}>
            <Grid container direction="row" spacing={1}>
              <Grid item sm={12} md={6} direction="row" alignItems="center">
                <div className={classes.voteSubBox}>
                  <img src={require("assets/icons/clock_gray.png")} alt="clock" />
                  <p>{props.item.NumVotes ? `${props.item.NumVotes} votes` : "no votes"}</p>
                </div>
              </Grid>
              <Grid item sm={12} md={6} direction="row" alignItems="center">
                <div className={classes.voteSubBox}>
                  <img src={require("assets/icons/flag.png")} alt="flag" />
                  {finished ? (
                    <p>Ended</p>
                  ) : (
                    <p>
                      Ends <Moment fromNow>{props.item.EndingDate * 1000}</Moment>
                    </p>
                  )}
                </div>
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
        <div className={classes.bottom}>
          {!finished && !props.voters.find(voter => voter.VotationId === props.item.id) && (
            <PrimaryButton onClick={handleOpenOpenDaoProposalModal} size="medium">{`Vote ${
              !props.version ? "on this proposal" : ""
            }`}</PrimaryButton>
          )}
          <SecondaryButton
            onClick={handleFollowDaoProposal}
            size="medium"
            style={{ marginTop: !props.version ? 10 : 0 }}
          >
            {user && user.followingProposals.includes(props.item.VotationId) ? (
              <span>
                <img src={require("assets/icons/tick.png")} alt="tick" /> Following
              </span>
            ) : (
              "Follow"
            )}
          </SecondaryButton>
        </div>
        {openDaoProposalModal && (
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
        )}
      </div>
    );
  else return null;
}
