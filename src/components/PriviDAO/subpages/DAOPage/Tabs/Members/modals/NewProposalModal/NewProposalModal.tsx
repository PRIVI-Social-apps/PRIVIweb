import React from "react";

import { Grid } from "@material-ui/core";

import { newProposalModalStyles } from "./NewProposalModal.styles";
import { Modal, StyledDivider, Color } from "shared/ui-kit";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import Box from 'shared/ui-kit/Box';

const checkRoundIcon = require("assets/icons/check_green_round.svg");
const clockGrayIcon = require("assets/icons/clock_gray.png");

const NewProposalModal = (props: any) => {
  const classes = newProposalModalStyles();

  return (
    <Modal
      size="medium"
      theme="dark"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      className={classes.root}
    >
      <Box textAlign="center" fontSize={30} fontWeight={400} fontFamily="Agrandir GrandLight" color="white">
        New Proposal
      </Box>
      <StyledDivider type="solid" color={Color.White} />
      <Box fontSize={18} fontWeight={800} color="white" mt={2} mb={2}>
        Proposal Details
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
        <div
          style={{
            backgroundImage: `url('assets/anonAvatars/ToyFaces_Colored_BG_111.jpg')`,
            width: 32,
            height: 32,
            borderRadius: 25,
            backgroundColor: "#656e7e",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
            border: "2px solid #ffffff",
            boxShadow: "0px 2px 8px rgb(0 0 0 / 20%)",
          }}
        />
        <Box ml={1} fontSize={14} fontWeight={400} color="#707582">
          @User name
        </Box>
      </Box>
      <Box fontSize={18} fontWeight={800} color="white" mt={2} mb={2}>
        Has been proposed for
      </Box>
      <Box color="#D810D6" fontSize="18px">
        be removed as Community Treasurer.
      </Box>
      <StyledDivider type="solid" color={Color.White} />
      <Box fontSize={18} fontWeight={800} color="white" mt={2} mb={2}>
        Proposal Acceptation
      </Box>
      <Grid container>
        <Grid container item xs={12} md={12} justify="space-between">
          <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
            <div
              style={{
                backgroundImage: `url('assets/anonAvatars/ToyFaces_Colored_BG_111.jpg')`,
                width: 40,
                height: 40,
                borderRadius: 25,
                backgroundColor: "#656e7e",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
                boxShadow: "0px 2px 8px rgb(0 0 0 / 20%)",
              }}
            />
            <Box display="flex" flexDirection="column">
              <Box ml={1} fontSize={14} fontWeight={700} color="white">
                User Name
              </Box>
              <Box ml={1} fontSize={14} fontWeight={400} color="white">
                (Proposer)
              </Box>
            </Box>
          </Box>
          <Box>
            <img src={checkRoundIcon} alt={"check"} />
          </Box>
        </Grid>

        <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
          <div
            style={{
              backgroundImage: `url('assets/anonAvatars/ToyFaces_Colored_BG_111.jpg')`,
              width: 40,
              height: 40,
              borderRadius: 25,
              backgroundColor: "#656e7e",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
              boxShadow: "0px 2px 8px rgb(0 0 0 / 20%)",
            }}
          />
          <Box display="flex" flexDirection="column">
            <Box ml={1} fontSize={14} fontWeight={700} color="white">
              User Name
            </Box>
            <Box ml={1} fontSize={14} fontWeight={400} color="white">
              (Proposer)
            </Box>
          </Box>
        </Box>
        <Box>
          <img src={clockGrayIcon} alt={"clock"} />
        </Box>
      </Grid>
      <StyledDivider type="solid" color={Color.White} />
      <Box display="flex" flexDirection="row" mt={2} mb={2}>
        <Grid container>
          <Grid item xs={6}>
            <Box display="flex" flexDirection="column" ml={2}>
              <Box fontSize={18} fontWeight={800} color="white">
                Voting Time
              </Box>
              <Box fontSize={18} fontWeight={400} color="white">
                5 Days(1 left)
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box fontSize={18} fontWeight={800} color="white">
              Consensus
            </Box>
            <Box fontSize={18} fontWeight={400} color="white">
              50%
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box mt={3}>
        <Grid container item xs={12} md={12} justify="space-between" className={classes.buttonGroup}>
          <DAOButton onClick={() => {}}>DECLINE</DAOButton>
          <DAOButton onClick={() => {}}>{`ACCEPT & SIGN`}</DAOButton>
        </Grid>
      </Box>
    </Modal>
  );
};

export default NewProposalModal;
