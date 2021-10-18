import React from "react";

import { Color, StyledDivider } from "shared/ui-kit";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import TimeTrack from "shared/ui-kit/TimeTrack";
import Box from 'shared/ui-kit/Box';
import {
  useStyles,
  ProgressAcceptIcon,
  ProgressDeclineIcon,
  ProgressPendingIcon,
  SmileIcon,
} from "../../../index.styles";

const MembersProposal = (props: any) => {
  const classes = useStyles();

  return (
    <>
      <Box fontFamily="Agrandir GrandLight" mb="16px" fontSize="20px">
        Details
      </Box>
      <StyledDivider type="solid" margin={2} color={Color.White} />
      <Box mt="16px" mb="16px" fontWeight="800">
        User
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" mb={2} color="white">
        <div
          style={{
            backgroundImage: `url('assets/anonAvatars/ToyFaces_Colored_BG_111.jpg')`,
            width: 32,
            height: 32,
            borderRadius: 25,
            backgroundColor: "#656e7e",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
            border: "2px solid #ffffff",
            boxShadow: "0px 2px 8px rgb(0 0 0 / 20%)",
          }}
        />
        <Box ml={1} fontSize={14} fontWeight={400} color="white" fontFamily="Agrandir GrandLight">
          @User name
        </Box>
      </Box>
      <Box mt="16px" mb="16px" fontWeight="800">
        Has been proposed for
      </Box>
      <Box mb="16px" color="#D810D6">
        be removed as Community Treasurer.
      </Box>
      <StyledDivider type="solid" margin={2} color={Color.White} />
      <Box mt="16px" mb="16px" fontWeight="800">
        Acceptance Progress (3 of 4)
      </Box>
      <Box className={classes.progress} display="flex" flexDirection="row" alignItems="center" color="white">
        <Box>3</Box>
        <ProgressAcceptIcon />
        <Box>1</Box>
        <ProgressDeclineIcon />
        <Box>2</Box>
        <ProgressPendingIcon />
      </Box>
      <StyledDivider type="solid" margin={2} color={Color.White} />
      <Box mt="16px" mb="16px" fontWeight="800">
        Concept
      </Box>
      <Box mt="16px" mb="16px">
        Treasurer removement
      </Box>
      <TimeTrack theme="dark" />
      {props.data.voted ? (
        <Box display="flex" flexDirection="row" alignItems="center" color="white">
          <SmileIcon />
          <Box ml={2}>You’ve already sent your answer</Box>
        </Box>
      ) : (
        <Box display="flex" flexDirection="row" justifyContent="space-between" mt={3}>
          <DAOButton>DECLINE</DAOButton>
          <DAOButton>{`ACCEPT & SIGN`}</DAOButton>
        </Box>
      )}
    </>
  );
};

export default MembersProposal;
