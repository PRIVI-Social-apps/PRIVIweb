import React, { useState } from "react";
import { Tooltip, Fade } from "@material-ui/core";

import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { saluteModalStyles } from "./index.styles";
import { Modal, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

import { ReactComponent as InfoIcon } from "assets/icons/info.svg";

const SaluteModal = (props: any) => {
  const classes = saluteModalStyles();

  const [status, setStatus] = useState<any>("");
  const [profile1, setProfile1] = useState<string>("");
  const [profile2, setProfile2] = useState<string>("");

  const [submited, setSubmited] = useState<boolean>(false);

  return (
    <Modal size="small" isOpen={props.open} onClose={props.handleClose} showCloseIcon>
      <Box className={classes.contentBox}>
        <Box className={classes.flexBox} justifyContent="center">
          <img src={require(submited ? "assets/icons/community.png" : "assets/emojiIcons/salute.png")} />
        </Box>
        <Box className={classes.header1} mt={3}>
          {submited
            ? "Our staff at Privi willl be reviewing your profile."
            : "Cool! It seems like you’re behind this amazing track."}
        </Box>
        <Box className={classes.header2} mt={1}>
          {submited
            ? "We’ll let you know once the validation process has ended."
            : "In order to validate your identity you need to provide us with two social media profiles of your ownership."}
        </Box>
        {!submited && (
          <Box mt={3}>
            <Box className={classes.flexBox} justifyContent="space-between">
              <Box className={classes.header1}>Profile 1</Box>
              <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                <InfoIcon style={{ color: "grey", width: "14px" }} />
              </Tooltip>
            </Box>
            <InputWithLabelAndTooltip
              placeHolder="www.facebook.com/urlofartistprofile"
              type="text"
              inputValue={profile1}
              onInputValueChange={e => setProfile1(e.target.value)}
            />
          </Box>
        )}
        {!submited && (
          <Box mt={1}>
            <Box className={classes.flexBox} justifyContent="space-between">
              <Box className={classes.header1}>Profile 2</Box>
              <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                <InfoIcon style={{ color: "grey", width: "14px" }} />
              </Tooltip>
            </Box>
            <InputWithLabelAndTooltip
              placeHolder="www.facebook.com/urlofartistprofile"
              type="text"
              inputValue={profile2}
              onInputValueChange={e => setProfile2(e.target.value)}
            />
          </Box>
        )}
        {!submited && (
          <Box className={classes.flexBox} width={1} mt={3} justifyContent="center">
            <PrimaryButton
              size="medium"
              onClick={() => setSubmited(true)}
              isRounded
              style={{ background: profile1 && profile2 ? "#65CB63" : "#2D304722" }}
            >
              Submit Claim Request
            </PrimaryButton>
          </Box>
        )}
      </Box>
      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus(undefined)}
        />
      )}
    </Modal>
  );
};

export default SaluteModal;
