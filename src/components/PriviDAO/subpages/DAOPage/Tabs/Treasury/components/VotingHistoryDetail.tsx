import React from "react";
import { Box } from "@material-ui/core";

import { Avatar, Color, StyledDivider } from "shared/ui-kit";
import TimeTrack from "shared/ui-kit/TimeTrack";
import { TitleGrandLight, useStyles, SmileIcon, FlagIcon, ProgressBar, Text } from "../../../index.styles";

export default function VotingHistoryDetail(props) {
  const classes = useStyles();

  return (
    <Box color="white" fontSize="18px">
      <TitleGrandLight disableUppercase mb={2}>
        Voting Title
      </TitleGrandLight>
      <StyledDivider type="solid" color={Color.White} />
      <Box display="flex" flexDirection="column" mt={2} mb={2}>
        <Text bold>User</Text>
        <Box display="flex" flexDirection="row" alignItems="center" mt={2} mb={2}>
          <Avatar noBorder size="small" url={require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")} />
          <Box ml={1} fontFamily="Agrandir GrandLight">
            User name
          </Box>
        </Box>
        <Text bold mb={2}>
          Has has asked for a vote for
        </Text>
        <Text className={classes.receiver}>Question and description of the votation created.</Text>
      </Box>
      <StyledDivider type="solid" color={Color.White} />
      {props.multi ? (
        <Box mt={2} mb={2}>
          <Box display="flex" flexDirection="row" alignItems="center" mb={1} mt={2}>
            <Box mr={2} minWidth="90px">
              A lot!
            </Box>
            <Box flex={1} position="relative">
              <ProgressBar theme="dark" value={75} />
            </Box>
            <Box ml={2}>75%</Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
            <Box mr={2} minWidth="90px">
              Not Much
            </Box>
            <Box flex={1} position="relative">
              <ProgressBar theme="dark" value={25} />
            </Box>
            <Box ml={2}>25%</Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box mr={2} minWidth="90px">
              Noting
            </Box>
            <Box flex={1} position="relative">
              <ProgressBar theme="dark" value={25} />
            </Box>
            <Box ml={2}>25%</Box>
          </Box>
        </Box>
      ) : (
        <Box mt={2} mb={2}>
          <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
            <Box mr={2} minWidth="90px">
              Yes
            </Box>
            <Box flex={1} position="relative">
              <ProgressBar theme="dark" value={75} />
            </Box>
            <Box ml={2}>75%</Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" position="relative">
            <Box mr={2} minWidth="90px">
              No
            </Box>
            <Box flex={1} position="relative">
              <ProgressBar theme="dark" value={25} />
            </Box>
            <Box ml={2}>25%</Box>
          </Box>
        </Box>
      )}
      <StyledDivider type="solid" color={Color.White} />
      <Box display="flex" flexDirection="row" alignItems="center" mt={2} mb={2}>
        <FlagIcon />
        <Box ml={"16px"}>
          <Box>
            <b>4</b> votes of <b>100</b> required.
          </Box>
        </Box>
      </Box>
      <TimeTrack mb={2} theme="dark" />
      <Box display="flex" flexDirection="row" alignItems="center">
        <SmileIcon />
        <Box ml={2}>
          <Box>You’ve already sent your answer</Box>
        </Box>
      </Box>
    </Box>
  );
}
