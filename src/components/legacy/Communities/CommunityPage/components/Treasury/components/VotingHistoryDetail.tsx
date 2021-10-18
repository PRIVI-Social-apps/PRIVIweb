import React from "react";

import { Avatar, FontSize, Header6, HeaderBold5, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { useStyles, SmileIcon, FlagIcon, ProgressBar, Text } from "../TreasuryStyle";
import TimeTrack from "./TimeTrack";

export default function VotingHistoryDetail(props) {
  const classes = useStyles();

  return (
    <>
      <HeaderBold5>Voting Title</HeaderBold5>
      <StyledDivider type="dashed" margin={1.5} />
      <Box display="flex" flexDirection="column">
        <Text size={FontSize.M} bold className={classes.darkColor}>User</Text>
        <Box display="flex" flexDirection="row" alignItems="center" mt={1} mb={2}>
          <Avatar size="small" url={require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")} />
          <Text size={FontSize.M}>@User name</Text>
        </Box>
        <Text size={FontSize.M} bold className={classes.darkColor} mb={1}>Has has asked for a vote for</Text>
        <Text size={FontSize.M}>Question and description of the votation created.</Text>
      </Box>
      <StyledDivider type="dashed" margin={1.5} />
      {props.multi ?
        <>
          <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
            <Box className={classes.progressTitleLarge} mr={0.5}>A lot!</Box>
            <Box flex={1} position="relative">
              <ProgressBar value={75} />
            </Box>
            <Box className={classes.progressPercentage} ml={0.5}>75%</Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
            <Box className={classes.progressTitleLarge} mr={0.5}>Not Much</Box>
            <Box flex={1} position="relative">
              <ProgressBar value={25} />
            </Box>
            <Box className={classes.progressPercentage} ml={0.5}>25%</Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box className={classes.progressTitleLarge} mr={0.5}>Noting</Box>
            <Box flex={1} position="relative">
              <ProgressBar value={25} />
            </Box>
            <Box className={classes.progressPercentage} ml={0.5}>25%</Box>
          </Box>
        </>
        :
        <>
          <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
            <Box className={classes.progressTitle} mr={0.5}>Yes</Box>
            <Box flex={1} position="relative">
              <ProgressBar value={75} />
            </Box>
            <Box className={classes.progressPercentage} ml={0.5}>75%</Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" position="relative">
            <Box className={classes.progressTitle} mr={0.5}>No</Box>
            <Box flex={1} position="relative">
              <ProgressBar value={25} />
            </Box>
            <Box className={classes.progressPercentage} ml={0.5}>25%</Box>
          </Box>
        </>
      }
      <StyledDivider type="dashed" margin={1.5} />
      <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
        <FlagIcon />
        <Box ml={2}>
          <Header6 noMargin className={classes.darkColor}>4 votes of 100 required.</Header6>
        </Box>
      </Box>
      <TimeTrack mb={2}/>
      <Box display="flex" flexDirection="row" alignItems="center">
        <SmileIcon />
        <Box ml={2}>
          <Header6 noMargin className={classes.darkColor}>You’ve already sent your answer</Header6>
        </Box>
      </Box>
    </>
  )
}
