import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { FormControl } from "@material-ui/core";

import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import SignInModal from "components/Login/SignInModal";
import { CreatePriviWalletModal } from "shared/ui-kit/Modal/Modals";
import Box from 'shared/ui-kit/Box';
import { headerStyles } from './index.styles';

const OPTIONS = ["choose options"];

const Header = () => {
  const classes = headerStyles();
  const history = useHistory();

  const [option, setOption] = useState<any>();

  const [openSignInModal, setOpenSignInModal] = useState<boolean>(false);
  const [openPriviWalletDialog, setOpenPriviWalletDialog] = useState<boolean>(false);

  return (
    <Box width={1}>
      <Box className={classes.headerBox} zIndex={1}>
        <img src={require("assets/logos/privi_color_log.png")} />
        <Box className={classes.flexBox}>
          {/* <SecondaryButton
            size="small"
            onClick={() => {
              setOpenPriviWalletDialog(true);
            }}
          >
            Get privi wallet
          </SecondaryButton>
          <PrimaryButton
            size="small"
            onClick={() => {
              setOpenSignInModal(true);
            }}
          >
            Sign In
          </PrimaryButton>*/}
        </Box>
      </Box>
      {openSignInModal && (
        <SignInModal open={openSignInModal} handleClose={() => setOpenSignInModal(false)} />
      )}
      {openPriviWalletDialog && (
        <CreatePriviWalletModal
          open={openPriviWalletDialog}
          handleClose={() => setOpenPriviWalletDialog(false)}
          handleOk={() => {
            setOpenPriviWalletDialog(false);
            history.push("/create-privi-wallet");
          }}
        />
      )}
    </Box>
  );
};

export default Header;
