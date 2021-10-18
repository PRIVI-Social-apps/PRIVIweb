import React, { useState } from "react";

import { Grid } from "@material-ui/core";

import { tresurerMemberEjectModalStyles } from "./TresurerMemberEjectModal.styles";
import SubmitProposalModal from "../SubmitProposalModal/SubmitProposalModal";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import Box from 'shared/ui-kit/Box';

const TresurerMemberEjectModal = (props: any) => {
  const classes = tresurerMemberEjectModalStyles();

  const [openSubmitProposalModal, setOpenSubmitProposalModal] = useState<boolean>(false);

  const handleOpenSubmitProposalModal = () => {
    setOpenSubmitProposalModal(true);
  };

  const handleCloseSubmitProposalModal = () => {
    setOpenSubmitProposalModal(false);
  };

  return (
    <Modal size="small" theme="dark" isOpen={props.open} onClose={props.onClose} showCloseIcon>
      <Grid container item xs={12} md={12} justify="center" className={classes.content}>
        <Box fontSize={35}>🖋</Box>
        <Box fontSize={18} fontWeight={400} mt={2} mb={2} textAlign="center">
          To expel a Treasurer of the Community, a rejection proposal is required.
        </Box>
        <Box fontSize={14} fontWeight={400} color="#707582" mb={5} textAlign="center">
          Cofunders will vote to the eject proposal.
        </Box>
        <DAOButton onClick={handleOpenSubmitProposalModal}>CREATE PROPOSAL</DAOButton>
      </Grid>
      <SubmitProposalModal
        open={openSubmitProposalModal}
        onClose={handleCloseSubmitProposalModal}
        type="rejection"
      />
    </Modal>
  );
};

export default TresurerMemberEjectModal;
