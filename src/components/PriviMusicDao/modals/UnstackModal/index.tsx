import React, { useState } from "react";

import { Color, Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { BlockchainNets } from "shared/constants/constants";
import { BlockchainTokenSelect } from "shared/ui-kit/Select/BlockchainTokenSelect";

import { unstackModalStyles } from "./index.styles";

const UnstackModal = (props: any) => {
  const classes = unstackModalStyles();

  const [blockChain, setBlockChain] = useState<any>(BlockchainNets[0].name);

  return (
    <Modal size="small" isOpen={props.open} onClose={props.handleClose} showCloseIcon>
      <Box className={classes.contentBox}>
        <Box className={classes.flexBox} justifyContent="center">
          <Box className={classes.header1}>Unstake</Box>
        </Box>
        <Box className={classes.header2} mt={2}>
          {props.isStaking
            ? "In order to unstake your funds input the amount you wuld like to unstake in the input below. "
            : "In order to unstake your funds of 2245 USDp You will need to pay back the loan of 225 USDp or wait till loan gets paid automatically to receive your funds."}
        </Box>
        <Box className={classes.controlBox} mt={4}>
          {!props.isStaking && (
            <>
              <Box className={classes.header3}>AMOUNT LEFT TO REPAY</Box>
              <Box className={classes.header4} borderBottom="1px solid #00000022" pb={1}>
                2425 <span style={{ color: "#2D304770", marginLeft: "8px" }}>USDp</span>
              </Box>
            </>
          )}
          <Box className={classes.header3} mt={2} style={{ color: Color.MusicDAOGreen }}>
            AMOUNT TO BE PAID OUT
          </Box>
          <Box className={classes.header4}>
            2425 <span style={{ color: "#2D304770", marginLeft: "8px" }}>USDp</span>
          </Box>
        </Box>
        <Box className={classes.header2} color="#2D3047 !important" mt={4} mb={1}>
          Select Chain
        </Box>
        <Box className={classes.noBorderBox}>
          <BlockchainTokenSelect
            network={blockChain}
            setNetwork={setBlockChain}
            BlockchainNets={BlockchainNets}
            isReverse
          />
        </Box>
        <Box className={classes.header2} color="#2D3047 !important" mt={4} mb={1}>
          Amount
        </Box>
        <Box className={classes.borderBox}>
          <img src={require("assets/tokenImages/BNB.png")} width="48px" />
          <Box className={classes.header2}>225 Privi</Box>
        </Box>
        <Box mt={4} className={classes.buttonGroup} justifyContent="space-around">
          <SecondaryButton
            size="medium"
            onClick={props.handleClose}
            isRounded
            style={{ paddingLeft: "48px", paddingRight: "48px" }}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            onClick={() => {
              props.handleClose();
              props.unStack();
            }}
            isRounded
            style={{ paddingLeft: "48px", paddingRight: "48px" }}
          >
            Unstake
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default UnstackModal;
