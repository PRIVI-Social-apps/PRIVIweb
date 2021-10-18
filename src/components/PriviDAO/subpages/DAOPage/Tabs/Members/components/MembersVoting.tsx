import React from "react";

import { Color, StyledDivider } from "shared/ui-kit";
import { useStyles, SmileIcon, FlagIcon, ProgressBar } from "../../../index.styles";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import TimeTrack from "shared/ui-kit/TimeTrack";
import Box from 'shared/ui-kit/Box';

export default function MembersVoting(props) {
  const classes = useStyles();

  const { status, title } = props.data; // 1: voted, 2: ended voting, 3: start voting

  return (
    <>
      <Box fontFamily="Agrandir GrandLight" mb="16px" fontSize="20px">
        {title}
      </Box>
      <StyledDivider type="solid" margin={2} color={Color.White} />
      <Box component="p">
        This function is called when some of the cofounders makes a proposal to add an address as treasurer of
        the treasury of the community?
      </Box>
      {status === 1 && (
        <>
          <Box className={classes.votedStatus} mb={"16px"} mt={"20.5px"}>
            <Box display="flex" flexDirection="row" mb={"16px"}>
              <StyledCheckbox buttonColor={Color.Purple} checked onClick={() => {}} />
              <Box ml={2}>
                <span>Yes</span>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row">
              <StyledCheckbox buttonColor={Color.Purple} checked={false} onClick={() => {}} />
              <Box ml={2}>
                <span>No</span>
              </Box>
            </Box>
          </Box>
          <StyledDivider type="solid" margin={2} color={Color.White} />
          <Box display="flex" flexDirection="row" alignItems="center">
            <SmileIcon />
            <Box ml={2}>
              <Box>You’ve already voted</Box>
            </Box>
          </Box>
          <StyledDivider type="solid" margin={2} color={Color.White} />
        </>
      )}
      {status === 2 && (
        <>
          <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
            <Box mr={"16px"}>Yes</Box>
            <Box flex={1} position="relative">
              <ProgressBar theme="dark" value={75} />
            </Box>
            <Box ml={"16px"}>75%</Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" position="relative">
            <Box mr={"16px"}>No</Box>
            <Box flex={1} position="relative">
              <ProgressBar theme="dark" value={25} />
            </Box>
            <Box ml={"16px"}>25%</Box>
          </Box>
          <StyledDivider type="solid" margin={1.5} />
        </>
      )}
      {status === 3 && (
        <>
          <Box mb={2}>
            <Box display="flex" flexDirection="row" mb={2}>
              <StyledCheckbox buttonColor={Color.Purple} onClick={() => {}} />
              <Box ml={2}>
                <span>Yes</span>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row">
              <StyledCheckbox buttonColor={Color.Purple} onClick={() => {}} />
              <Box ml={2}>
                <span>No</span>
              </Box>
            </Box>
          </Box>
          <TimeTrack theme="dark" />
        </>
      )}
      <Box display="flex" flexDirection="row" alignItems="center">
        <FlagIcon />
        <Box ml={2}>
          <Box>
            <b>4</b> votes of <b>100</b> required.
          </Box>
        </Box>
      </Box>
    </>
  );
}
