import React from "react";

import { Grid } from "@material-ui/core";

import { memberEjectModalStyles } from "./MemberEjectModal.styles";
import { Modal, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

const MemberEjectModal = (props: any) => {
  const classes = memberEjectModalStyles();

  return (
    <Modal size="small" isOpen={props.open} onClose={props.onClose} showCloseIcon>
      <Grid container item
            xs={12} md={12}
            justify="center"
            className={classes.content}>
        <Box fontSize={35}>🖋</Box>
        <Box fontSize={18} fontWeight={400} color="#181818" mt={2} mb={2} textAlign="center">
          To expel a Member of the Community, a digital signature is required.
        </Box>
        <PrimaryButton size="medium" onClick={() => {}}>
          Sign In
        </PrimaryButton>
      </Grid>
    </Modal>
  );
};

export default MemberEjectModal;
