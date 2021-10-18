import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Avatar, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import CustomPopup from "../../components/CustomPopup";
import { ArrowIcon, DatapIcon } from "../../components/Icons/SvgIcons";
import { proposalDetailPageStyles } from "./index.styles";
import { ReactComponent as UploadIcon } from "assets/icons/upload_arrow.svg";
import { GreenLinearProgress, RedLinearProgress } from "components/PriviMusicDao/components/LinearProgress";

const filterOptions = ["Yes", "No"];

// mock data
const mockProposalData = {
  name: "Julia Sariy",
  title: "One of the obvious benefits of buying art is it lets you financially support.",
  subTitle:
    "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency? At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency?",
  content:
    "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency? At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency?",
  isVoted: true,
  startTime: 1625084309,
  endTime: 1635170627,
  currentNumberOfVotes: 20,
  voteRequired: 100,
  votingQuestion: {
    lot: 50,
    notMuch: 15,
    nothing: 35,
  },
};

export default function ProposalDetailPage() {
  const classes = proposalDetailPageStyles();
  const [proposal, setProposal] = useState<any>(mockProposalData);
  const [loadingProposals, setLoadingProposals] = useState<boolean>(false);

  const [filterOptionsSelection, setFilterOptionsSelection] = useState<string>(filterOptions[0]);

  const history = useHistory();

  useEffect(() => {
    setLoadingProposals(true);
    // call api for getting vote list
    setLoadingProposals(false);
  }, []);

  return (
    <Box className={classes.content}>
      <div className={classes.gradient} />
      <div className={classes.headerTitle}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          style={{ cursor: "pointer" }}
          onClick={() => history.goBack()}
        >
          <Box color="#FFFFFF">
            <ArrowIcon />
          </Box>
          <Box color="#AFACD7" fontSize={14} fontWeight={700} fontFamily="Agrandir" ml="5px" mb="4px">
            BACK
          </Box>
        </Box>
        <Box className={classes.flexBox}>
          <div>
            <span style={{color: '#ffffff', fontSize: 16, fontWeight: 400}}>Balance:</span>
            &nbsp;&nbsp;
            <span style={{color: '#ffffff', fontSize: 16, fontWeight: 700}}>4544 DATAp</span>
          </div>
          &nbsp;
          <DatapIcon />
        </Box>
        <UploadIcon style={{ color: "white" }} />
      </div>
      <Box mt={5} className={classes.proposalDetailBox}>
        <div className={classes.detailHeaderBox}>
          <div className={classes.headerTitleContent}>{mockProposalData.title}</div>
          <Box className={classes.header2} mt={1}>
            {mockProposalData.content}
          </Box>
          <Box className={classes.flexBox} mt={2}>
            <Avatar size="small" url={require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")} />
            <Box className={classes.header3} ml={2}>
              {mockProposalData.name}
            </Box>
          </Box>
        </div>
        <Box p={5} borderBottom="1px solid #35385622">
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.flexBox} justifyContent="center" flexDirection="column">
              <Box className={classes.header2}>Total Votes</Box>
              <Box className={classes.header1}>196.99 PC</Box>
            </Box>
            <Box className={classes.flexBox} justifyContent="center" flexDirection="column">
              <Box className={classes.header2}>Quorum Required</Box>
              <Box className={classes.header1}>400.00 PC</Box>
            </Box>
            <Box className={classes.flexBox} justifyContent="center" flexDirection="column">
              <Box className={classes.header2}>Quorum Reached</Box>
              <Box className={classes.header1}>44%</Box>
            </Box>
          </Box>
          <Box mt={3} className={classes.flexBox} width={1}>
            <Box width={1}>
              <GreenLinearProgress variant="determinate" value={70} style={{ width: "100%", background: '#282754' }} />
            </Box>
            <Box className={classes.header2} ml={1}>
              70%
            </Box>
          </Box>
          <Box mt={3} className={classes.flexBox} width={1}>
            <Box width={1}>
              <RedLinearProgress variant="determinate" value={40} style={{ width: "100%", background: '#282754' }} />
            </Box>
            <Box className={classes.header2} ml={1}>
              40%
            </Box>
          </Box>
          <Box className={classes.flexBox} mt={6} height="45px">
            <Box className={`${classes.blackBox} ${classes.flexBox}`} width={1} height={1}>
              <DatapIcon />
              <Box className={classes.header3} ml={1}>
                1,5 DATAp
              </Box>
            </Box>
            <Box className={`${classes.greyBox} ${classes.flexBox}`} width={0.5} ml={2} height={1}>
              <CustomPopup
                items={filterOptions}
                value={filterOptionsSelection}
                onSelect={value => setFilterOptionsSelection(value)}
                label={""}
              />
            </Box>
            <Box ml={4} width={1} height={1}>
              <PrimaryButton
                isRounded
                size="small"
                onClick={() => {}}
                style={{ background: "#65CB63", width: "100%", height: "100%" }}
              >
                Vote
              </PrimaryButton>
            </Box>
          </Box>
        </Box>
        <Box p={5}>
          <Box className={classes.headerTitleContent}>Proposal Description</Box>
          <Box className={classes.header2} mt={2}>
            {mockProposalData.content}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
