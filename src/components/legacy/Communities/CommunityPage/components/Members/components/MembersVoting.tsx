import React from "react";

import { Header6, HeaderBold5, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { useStyles, SmileIcon, FlagIcon, ProgressBar } from "../../Treasury/TreasuryStyle";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import TimeTrack from "../../Treasury/components/TimeTrack";

export default function MembersVoting(props) {
  const classes = useStyles();

  const { status, title } = props.data; // 1: voted, 2: ended voting, 3: start voting

  return (
    <>
      <HeaderBold5>{title}</HeaderBold5>
      <Header6 className={classes.darkColor}>
        This function is called when some of the cofounders makes a proposal to add an address as treasurer of
        the treasury of the community?
      </Header6>
      {status === 1 && (
        <>
          <Box className={classes.votedStatus} mb={2}>
            <Box display="flex" flexDirection="row" mb={2}>
              <StyledCheckbox checked onClick={() => {}} />
              <Box ml={2}>
                <span>Yes</span>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row">
              <StyledCheckbox checked={false} onClick={() => {}} />
              <Box ml={2}>
                <span>No</span>
              </Box>
            </Box>
          </Box>
          <StyledDivider type="dashed" margin={1.5} />
          <Box display="flex" flexDirection="row" alignItems="center">
            <SmileIcon />
            <Box ml={2}>
              <Header6 noMargin className={classes.darkColor}>
                You’ve already voted
              </Header6>
            </Box>
          </Box>
          <StyledDivider type="dashed" margin={1.5} />
        </>
      )}
      {status === 2 && (
        <>
          <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
            <Box className={classes.progressTitle} mr={0.5}>
              Yes
            </Box>
            <Box flex={1} position="relative">
              <ProgressBar value={75} />
            </Box>
            <Box className={classes.progressPercentage} ml={0.5}>
              75%
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" position="relative">
            <Box className={classes.progressTitle} mr={0.5}>
              No
            </Box>
            <Box flex={1} position="relative">
              <ProgressBar value={25} />
            </Box>
            <Box className={classes.progressPercentage} ml={0.5}>
              25%
            </Box>
          </Box>
          <StyledDivider type="dashed" margin={1.5} />
        </>
      )}
      {status === 3 && (
        <>
          <Box mb={2}>
            <Box display="flex" flexDirection="row" mb={2}>
              <StyledCheckbox onClick={() => {}} />
              <Box ml={2}>
                <span>Yes</span>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row">
              <StyledCheckbox onClick={() => {}} />
              <Box ml={2}>
                <span>No</span>
              </Box>
            </Box>
          </Box>
          <TimeTrack />
        </>
      )}
      <Box display="flex" flexDirection="row" alignItems="center">
        <FlagIcon />
        <Box ml={2}>
          <Header6 noMargin className={classes.darkColor}>
            4 votes of 100 required.
          </Header6>
        </Box>
      </Box>
    </>
  );
}
