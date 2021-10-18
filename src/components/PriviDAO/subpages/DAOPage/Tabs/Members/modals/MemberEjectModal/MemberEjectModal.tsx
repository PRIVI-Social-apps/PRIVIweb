import React from "react";

import { Grid } from "@material-ui/core";

import { memberEjectModalStyles } from "./MemberEjectModal.styles";
import { Modal } from "shared/ui-kit";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import Box from 'shared/ui-kit/Box';

const MemberEjectModal = (props: any) => {
  const classes = memberEjectModalStyles();

  return (
    <Modal size="small" theme="dark" isOpen={props.open} onClose={props.onClose} showCloseIcon>
      <Grid container item xs={12} md={12} justify="center" className={classes.content}>
        <Box fontSize={35}>🖋</Box>
        <Box fontSize={18} fontWeight={400} mt={2} mb={2} textAlign="center">
          To expel a Member of the Community, a digital signature is required.
        </Box>
        <Box mt={3}>
          <DAOButton onClick={() => {}}>SIGN IN</DAOButton>
        </Box>
      </Grid>
    </Modal>
  );
};

export default MemberEjectModal;
