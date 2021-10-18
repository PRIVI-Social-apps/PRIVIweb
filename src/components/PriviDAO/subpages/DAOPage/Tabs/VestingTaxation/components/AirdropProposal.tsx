import React, { useState, useEffect } from "react";

import { Avatar, Color, StyledDivider } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import TimeTrack from "shared/ui-kit/TimeTrack";
import Box from 'shared/ui-kit/Box';
import {
  ProgressAcceptIcon,
  ProgressDeclineIcon,
  ProgressPendingIcon,
  Text,
  TitleGrandLight,
  useStyles,
} from "../../../index.styles";

function formatTime(timestamp) {
  const date = new Date(timestamp);
  if (date) {
    return `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
  return "";
}

const AirdropProposal = ({ proposal }) => {
  const classes = useStyles();
  const users = useTypedSelector(state => state.usersInfoList);
  const [foundUser, setFoundUser] = useState<any>(null);

  useEffect(() => {
    if (proposal.To) {
      const user = users.find(user => user.address == proposal.To);
      if (user) setFoundUser(user);
    }
  }, [proposal.To]);

  return (
    <Box color="white" fontSize="18px">
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <TitleGrandLight fontSize="20px" disableUppercase>
          Details
        </TitleGrandLight>
        <TitleGrandLight fontSize="14px" disableUppercase>
          {proposal.Result == "Waiting"
            ? formatTime(proposal.ProposalCreationTime ?? Date.now())
            : formatTime(proposal.ProposalEndedTime ?? Date.now())}
        </TitleGrandLight>
      </Box>
      <StyledDivider type="solid" margin={2} color={Color.White} />
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Text bold>User</Text>
        <Text bold>Quantity</Text>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Box display="flex" flexDirection="row" alignItems="center">
          <Avatar
            noBorder
            size="medium"
            url={foundUser?.imageUrl ?? require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")}
          />
          <Box ml={1}>
            <Box fontFamily="Agrandir GrandLight">{foundUser?.name}</Box>
          </Box>
        </Box>
        <Box color="#D810D6" textAlign="right">
          {proposal.Amount} {proposal.Token}
        </Box>
      </Box>
      <StyledDivider type="solid" margin={2} color={Color.White} />
      <Box display="flex" flexDirection="column">
        <Text bold mb={2}>
          Address:
        </Text>
        <Box color="#D810D6">{proposal.To}</Box>
      </Box>
      <StyledDivider type="solid" margin={2} color={Color.White} />
      <Box display="flex" flexDirection="column">
        <Text bold mb={2}>
          Proposal ID:
        </Text>
        <Box color="#D810D6">{proposal.ProposalId}</Box>
      </Box>
      <StyledDivider type="solid" margin={2} color={Color.White} />
      <Box display="flex" flexDirection="column" mb={2}>
        <Text bold mb={2}>
          Status
        </Text>
        <Box display="flex" flexDirection="row" alignItems="center">
          {proposal.Result === "accepted" && (
            <>
              <ProgressAcceptIcon />
              <Text ml={1}>Success</Text>
            </>
          )}
          {proposal.Result === "pending" && (
            <>
              <ProgressPendingIcon />
              <Text ml={1}>Waiting</Text>
            </>
          )}
          {proposal.Result === "declined" && (
            <>
              <ProgressDeclineIcon />
              <Text ml={1}>Failure</Text>
            </>
          )}
        </Box>
      </Box>
      {proposal.Result == "pending" && (
        <TimeTrack
          theme="dark"
          endTime={proposal.ProposalEndingTime ? new Date(proposal.ProposalEndingTime) : new Date()}
        />
      )}
    </Box>
  );
};

export default AirdropProposal;
