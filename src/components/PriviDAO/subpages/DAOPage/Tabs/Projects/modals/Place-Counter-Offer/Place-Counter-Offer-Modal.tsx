import React, { useState } from "react";

import { Grid } from "@material-ui/core";

import { Modal } from "shared/ui-kit";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

export default function PlaceCounterOfferModal({ open, handleClose, currentOffer }) {
  const [offerValue, setOfferValue] = useState<string>("");

  const handleSubmitOffer = () => {};

  return (
    <Modal isOpen={open} onClose={handleClose} showCloseIcon size="small" theme="dark">
      <Box fontSize="30px" mb={3}>
        Place Counter Offer
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box mb={3}>Original Offer</Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>{currentOffer}%</Box>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box>Counter Offer</Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithLabelAndTooltip
            inputValue={offerValue}
            onInputValueChange={e => setOfferValue(e.target.value)}
            placeHolder="10%"
            type={"number"}
            minValue={currentOffer}
            maxValue={100}
            theme="dark"
          />
        </Grid>
      </Grid>

      <Box mt={6} display="flex" justifyContent="space-between">
        <DAOButton insideCard onClick={handleClose}>
          Cancel
        </DAOButton>
        <DAOButton insideCard onClick={handleSubmitOffer}>
          Submit Counter Offer
        </DAOButton>
      </Box>
    </Modal>
  );
}
