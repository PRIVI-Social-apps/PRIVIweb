import React from 'react';

import { Card } from '../TreasuryStyle';
import VotingHistoryDetail from '../components/VotingHistoryDetail';
import { HeaderBold4, Modal } from 'shared/ui-kit';
import Box from "shared/ui-kit/Box";

const VotingHistoryModal = (props) => {
  return (
    <Modal size="medium" isOpen={props.open} onClose={props.onClose} showCloseIcon>
      <Box mb={3}>
        <HeaderBold4>Voting History</HeaderBold4>
      </Box>
      <Box display="flex" flexDirection="row">
        <Box width={0.5} pr={1}>
          <Card>
            <VotingHistoryDetail />
          </Card>
        </Box>
        <Box width={0.5} pl={1}>
          <Card>
            <VotingHistoryDetail multi/>
          </Card>
        </Box>
      </Box>
    </Modal>
  )
}

export default VotingHistoryModal;
