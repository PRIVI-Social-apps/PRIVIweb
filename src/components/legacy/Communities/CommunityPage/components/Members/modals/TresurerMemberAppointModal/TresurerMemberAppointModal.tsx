import React, { useState } from "react";

import { Grid } from "@material-ui/core";

import { tresurerMemberAppointModalStyles } from "./TresurerMemberAppointModal.styles";
import SubmitProposalModal from "../SubmitProposalModal/SubmitProposalModal";
import { Modal, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

const TresurerMemberAppointModal = (props: any) => {
  const classes = tresurerMemberAppointModalStyles();

  const [openSubmitProposalModal, setOpenSubmitProposalModal] = useState<boolean>(false);

  const handleOpenSubmitProposalModal = () => {
    setOpenSubmitProposalModal(true);
  };

  const handleCloseSubmitProposalModal = () => {
    setOpenSubmitProposalModal(false);
  };

  return (
    <Modal size="small" isOpen={props.open} onClose={props.onClose} showCloseIcon>
      <Grid container item
            xs={12} md={12}
            justify="center"
            className={classes.content}>
        <Box fontSize={35}>🖋</Box>
        <Box fontSize={18} fontWeight={400} color="#181818" mt={2} mb={2} textAlign="center">
          To appoint a new Community Treasurer it is required to create an appointment proposal
        </Box>
        <Box fontSize={14} fontWeight={400} color="#707582" mb={2} textAlign="center">
          Cofunders will vote to the appointment proposal.
        </Box>
        <PrimaryButton size="medium" onClick={handleOpenSubmitProposalModal}>
          Create Proposal
        </PrimaryButton>
      </Grid>
      <SubmitProposalModal
        open={openSubmitProposalModal}
        onClose={handleCloseSubmitProposalModal}
        type="appointment"
      />
    </Modal>
  );
};

export default TresurerMemberAppointModal;
