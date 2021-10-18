import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Moment from "react-moment";
import axios from "axios";

import { Dialog, makeStyles } from "@material-ui/core";

import DaoProposal from "../modals/Dao-Proposal/Dao-proposal";
import { FlagIcon, HistoryIcon } from "../../../index.styles";
import URL from "shared/functions/getURL";
import { getUser } from "store/selectors/user";
import { setUser } from "store/actions/User";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import { Color, StyledDivider } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';

const useStyles = makeStyles(theme => ({
  content: {
    color: Color.White,
    fontSize: "18px",
    "& button": {
      margin: "0px !important",
    },
  },
  tag: {
    fontSize: "14px",
    marginBottom: "16px",
    padding: "8px 16px",
    background: "rgba(255, 255, 255, 0.16)",
    borderRadius: "16px",
    width: "fit-content",
  },
}));

export default function ProposalItem(props) {
  const dispatch = useDispatch();

  const user = useSelector(getUser);
  const classes = useStyles();

  const [finished, setFinished] = useState<boolean>(false);

  const [openDaoProposalModal, setOpenDaoProposalModal] = useState<boolean>(false);
  const handleOpenOpenDaoProposalModal = () => {
    setOpenDaoProposalModal(true);
  };
  const handleCloseOpenDaoProposalModal = () => {
    setOpenDaoProposalModal(false);
  };

  const handleFollowDaoProposal = () => {
    if (user) {
      if (user.followingProposals?.includes(props.item.id)) {
        axios
          .post(`${URL()}/voting/unfollow`, { collection: 'CommunityProposal', votingAddress: props.item.id, userAddress: user.id })
          .then(res => {
            dispatch(
              setUser({
                ...user,
                followingProposals: user.followingProposals.filter(item => item !== props.item.id),
              })
            );
          });
      } else {
        axios
          .post(`${URL()}/voting/follow`, { collection: 'CommunityProposal', votingAddress: props.item.id, userAddress: user.id })
          .then(res => {
            dispatch(
              setUser({
                ...user,
                followingProposals: [...user.followingProposals, props.item.id],
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
      <div className={classes.content}>
        {props.item.cofoundersOnly && <div className={classes.tag}>🔒 Co-Founders Only</div>}
        <Box fontWeight={800} mb={2}>
          {props.item.ProposalTitle ?? "No data to display"}
        </Box>
        <StyledDivider type="solid" color={Color.White} />
        <Box mb={2} display="flex" alignItems="center" mt={2}>
          <FlagIcon />
          <Box ml={"12px"}>
            {props.item.Approvals ? (
              <>
                <b>{Object.keys(props.item.Approvals).length}</b> votes
              </>
            ) : (
              "no votes"
            )}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <HistoryIcon />
          {finished ? (
            <Box ml={"12px"}>Ended</Box>
          ) : (
            <Box ml={"12px"}>
              Ends{" "}
              <b>
                <Moment fromNow>{props.item.ProposalEndingTime}</Moment>
              </b>
            </Box>
          )}
        </Box>

        <StyledDivider type="solid" color={Color.White} />

        <Box display="flex" width="100%" justifyContent="space-between" mt={2}>
          {!finished && !(props.item.Approvals && props.item.Approvals[user.address].isVoted === true) && (
            <DAOButton insideCard onClick={handleOpenOpenDaoProposalModal}>{`Vote`}</DAOButton>
          )}
          <DAOButton insideCard onClick={handleFollowDaoProposal}>
            {user && user.followingProposals.includes(props.item.id) ? "Following" : "Follow"}
          </DAOButton>
        </Box>
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
