import React from "react";

import VotingHistoryDetail from "../components/VotingHistoryDetail";
import { TitleGrandLight, Card, useStyles } from "../../../index.styles";
import { Modal } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';

const VotingHistoryModal = props => {
  const classes = useStyles();

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      theme="dark"
      className={classes.rootAuto}
    >
      <Box width="900px">
        <Box mb={5}>
          <TitleGrandLight fontSize="30px" disableUppercase>
            Voting History
          </TitleGrandLight>
        </Box>
        <Box display="flex" flexDirection="row">
          <Box width={0.5} pr={1}>
            <Card dark>
              <VotingHistoryDetail />
            </Card>
          </Box>
          <Box width={0.5} pl={1}>
            <Card dark>
              <VotingHistoryDetail multi />
            </Card>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default VotingHistoryModal;
