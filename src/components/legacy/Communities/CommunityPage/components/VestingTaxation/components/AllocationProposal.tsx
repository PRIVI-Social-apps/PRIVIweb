
import React, {useState, useEffect} from "react";

import {
  Avatar,
  FontSize,
  HeaderBold5,
  StyledDivider
} from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import {
  useStyles,
  ProgressAcceptIcon,
  ProgressDeclineIcon,
  ProgressPendingIcon,
  Text
} from "../VestingTaxationStyle";
import TimeTrack from "../../Treasury/components/TimeTrack";
import { useTypedSelector } from "store/reducers/Reducer";

function formatTime(timestamp) {
  const date = new Date(timestamp);
  if (date) {
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }
  return '';
}


const AllocationProposal = ({proposal}) => {
  const classes = useStyles();

  const users = useTypedSelector(state => state.usersInfoList);
  const [foundUser, setFoundUser] = useState<any>(null);

  useEffect(() => {
    if (proposal.To) {
      const user = users.find(user => user.address == proposal.To);
      if (user) setFoundUser(user);
    }
  }, [proposal.To])

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <HeaderBold5 noMargin>Details</HeaderBold5>
        <Text size={FontSize.M} bold>{proposal.Result == 'Waiting' ? formatTime(proposal.ProposalCreationTime ?? Date.now()): formatTime(proposal.ProposalEndedTime ?? Date.now())}</Text>
      </Box>
      <StyledDivider type="dashed" margin={1.5} />
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Text size={FontSize.M}>User</Text>
        <Text size={FontSize.M}>Quantity</Text>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Box display="flex" flexDirection="row" alignItems="center">
          <Avatar size="small" url={foundUser?.imageUrl ?? require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")} />
          <Box ml={2}><Text size={FontSize.M} bold className={classes.darkColor}>@{foundUser?.name}</Text></Box>
        </Box>
        <Text className={classes.receiver} bold>{proposal.Amount} {proposal.Token}</Text>
      </Box>
      <StyledDivider type="dashed" margin={1.5} />
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Text size={FontSize.M}>Immediate allocation</Text>
        <Text size={FontSize.M}>Vesting allocation</Text>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text className={classes.receiver} bold>0.2 ETH</Text>
        <Text className={classes.receiver} bold>0.1 ETH</Text>
      </Box>
      <StyledDivider type="dashed" margin={1.5} />
      <Box display="flex" flexDirection="column">
        <Text size={FontSize.M} mb={2}>Address:</Text>
        <Text size={FontSize.M} bold className={classes.darkColor}>{proposal.To}</Text>
      </Box>
      <StyledDivider type="dashed" margin={1.5} />
      <Box display="flex" flexDirection="column">
        <Text size={FontSize.M} mb={2}>Proposal ID:</Text>
        <Text size={FontSize.M} bold className={classes.darkColor}>{proposal.ProposalId}</Text>
      </Box>
      <StyledDivider type="dashed" margin={1.5} />
      <Box display="flex" flexDirection="column" mb={2}>
        <Text size={FontSize.M} mb={2}>Status</Text>
        <Box display="flex" flexDirection="row" alignItems="center">
        {proposal.Result === "accepted" && (
          <>
            <ProgressAcceptIcon />
            <Text size={FontSize.M} ml={1}>Success</Text>
          </>
        )}
        {proposal.Result === "pending" && (
          <>
            <ProgressPendingIcon />
            <Text size={FontSize.M} ml={1}>Waiting</Text>
          </>
        )}
        {proposal.Result === "declined" && (
          <>
            <ProgressDeclineIcon />
            <Text size={FontSize.M} ml={1}>Failure</Text>
          </>
        )}
        </Box>
      </Box>
      {proposal.Result == 'pending' && <TimeTrack endTime={proposal.ProposalEndingTime ? new Date(proposal.ProposalEndingTime): new Date()}/>}
    </>
  )
};

export default AllocationProposal;
