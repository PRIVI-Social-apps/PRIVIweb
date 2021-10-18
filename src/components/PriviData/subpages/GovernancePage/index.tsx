import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import DiscussionCard from "components/PriviData/components/Cards/DiscussionCard";
import VoteCard from "components/PriviData/components/Cards/VoteCard";
import ProposalCard from "../../components/Cards/ProposalCard";

import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import URL from "shared/functions/getURL";

import { ReactComponent as DiscussionIcon } from "assets/icons/discussion.svg";
import { ReactComponent as DiscussionCheckedIcon } from "assets/icons/discussion_checked.svg";

import { governancePageStyles } from "./index.styles";
import CustomPopup from "components/PriviData/components/CustomPopup";
import CreateNewDiscussionModal from "components/PriviData/modals/CreateNewDiscussionModal";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const sortByOptions = ["Ascending", "Descending"];
const sortByCurrencyOptions = ["Crypto", "Currency"];

const mockVoteData = [
  {
    title: "One of the obvious benefits of buying art is it lets you financially support",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
    isVoted: true,
    startTime: 1625084309,
    endTime: 1625170627,
    currentNumberOfVotes: 20,
    voteRequired: 100,
  },
  {
    title: "One of the obvious benefits of buying art is it lets you financially support",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
    isVoted: true,
    startTime: 0,
    endTime: 0,
    currentNumberOfVotes: 20,
    voteRequired: 100,
  },
  {
    title: "One of the obvious benefits of buying art is it lets you financially support",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
    isVoted: false,
    currentNumberOfVotes: 20,
    voteRequired: 100,
  },
  {
    title: "One of the obvious benefits of buying art is it lets you financially support",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
    isVoted: false,
    currentNumberOfVotes: 20,
    voteRequired: 100,
  },
  {
    title: "One of the obvious benefits of buying art is it lets you financially support",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
    isVoted: false,
    currentNumberOfVotes: 20,
    voteRequired: 100,
  },
  {
    title: "One of the obvious benefits of buying art is it lets you financially support",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
    isVoted: false,
    currentNumberOfVotes: 20,
    voteRequired: 100,
  },
];

const mockProposalData = [
  {
    name: "Julia Sariy",
    title: "One of the obvious benefits of buying art is it lets you financially support",
    subTitle: "She has  asked а or a vote for",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
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
  },
  {
    name: "Julia Sariy",
    title: "One of the obvious benefits of buying art is it lets you financially support",
    subTitle: "She has  asked а or a vote for",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
    isVoted: true,
    startTime: 0,
    endTime: 0,
    currentNumberOfVotes: 20,
    voteRequired: 100,
    votingQuestion: {
      lot: 50,
      notMuch: 15,
      nothing: 35,
    },
  },
  {
    name: "Julia Sariy",
    title: "One of the obvious benefits of buying art is it lets you financially support",
    subTitle: "She has  asked а or a vote for",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
    isVoted: false,
    currentNumberOfVotes: 20,
    voteRequired: 100,
  },
  {
    name: "Julia Sariy",
    title: "One of the obvious benefits of buying art is it lets you financially support",
    subTitle: "She has  asked а or a vote for",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
    isVoted: false,
    currentNumberOfVotes: 20,
    voteRequired: 100,
  },
  {
    name: "Julia Sariy",
    title: "One of the obvious benefits of buying art is it lets you financially support",
    subTitle: "She has  asked а or a vote for",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
    isVoted: false,
    currentNumberOfVotes: 20,
    voteRequired: 100,
  },
  {
    name: "Julia Sariy",
    title: "One of the obvious benefits of buying art is it lets you financially support",
    subTitle: "She has  asked а or a vote for",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
    isVoted: false,
    currentNumberOfVotes: 20,
    voteRequired: 100,
  },
];

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  800: 2,
  1200: 3,
  1440: 4,
};

export default function GovernancePage() {
  const classes = governancePageStyles();
  const history = useHistory();

  const [loadingDiscussion, setLoadingDiscussion] = useState<boolean>(false);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [sortByOptionsSelection, setSortByOptionsSelection] = useState<string>(sortByOptions[0]);
  const [sortByCurrencyOptionsSelection, setSortByCurrencyOptionsSelection] = useState<string>(
    sortByCurrencyOptions[0]
  );
  const [openCreateNewDiscussionModal, setOpenCreateNewDiscussionModal] = useState<boolean>(false);

  React.useEffect(() => {
    setLoadingDiscussion(true);
    const body = {
      sortBy: sortByOptionsSelection === sortByOptions[0] ? "asc" : "desc",
      postType: sortByCurrencyOptionsSelection,
    };
    axios
      .post(`${URL()}/privi-data/getDiscussions/`, body)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setDiscussions(resp.data);
        }
        setLoadingDiscussion(false);
      })
      .catch(e => setLoadingDiscussion(false));
  }, [sortByOptionsSelection, sortByCurrencyOptionsSelection]);

  return (
    <Box className={classes.content}>
      <Box className={classes.subContent}>
        <div className={classes.gradient}></div>
        <div className={classes.title}>Governance</div>
        <Box className={classes.flexBox} mt={3} justifyContent="space-between">
          <Box className={classes.header1}>Discussion</Box>
          <Box className={classes.flexBox}>
            <CustomPopup
              items={sortByOptions}
              label={"Sort by"}
              onSelect={setSortByOptionsSelection}
              value={sortByOptionsSelection}
            />
            <Box ml={4}>
              <CustomPopup
                items={sortByCurrencyOptions}
                label={"Post type"}
                onSelect={setSortByCurrencyOptionsSelection}
                value={sortByCurrencyOptionsSelection}
              />
            </Box>
            <Box className={classes.buttonBox} ml={4} onClick={() => setOpenCreateNewDiscussionModal(true)}>
              <Box className={classes.header2} mr={1}>
                New discussion
              </Box>
              <DiscussionIcon />
            </Box>
          </Box>
        </Box>
        <LoadingWrapper loading={loadingDiscussion}>
          <>
            {discussions
              .filter((_, index) => index < 4)
              .map((item, index) => (
                <Box key={index} my={2}>
                  <DiscussionCard item={item} />
                </Box>
              ))}
            {discussions.length > 4 && (
              <Box className={classes.flexBox} justifyContent="center">
                <Box
                  className={classes.secondButtonBox}
                  onClick={() => history.push("/privi-data-new/governance/discussions/")}
                >
                  <Box className={classes.header2}>Show All</Box>
                  <img src={require("assets/icons/arrow_right_white.png")} />
                </Box>
              </Box>
            )}
          </>
        </LoadingWrapper>
        <Box className={classes.flexBox} mt={3} justifyContent="space-between">
          <Box className={classes.header1}>Voting</Box>
          <Box className={classes.buttonBox} ml={4}>
            <Box className={classes.header2} mr={1}>
              New vote
            </Box>
            <DiscussionCheckedIcon />
          </Box>
        </Box>
        <Box className={classes.voteCards} my={2}>
          <MasonryGrid
            gutter={"24px"}
            data={mockVoteData.filter((_, index) => index < 4)}
            renderItem={(item, index) => <VoteCard item={item} key={`item-${index}`} />}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
          />
        </Box>
        {mockVoteData.length > 4 && (
          <Box className={classes.flexBox} justifyContent="center">
            <Box
              className={classes.secondButtonBox}
              onClick={() => history.push("/privi-data-new/governance/votes/")}
            >
              <Box className={classes.header2}>Show All</Box>
              <img src={require("assets/icons/arrow_right_white.png")} />
            </Box>
          </Box>
        )}
        <Box className={classes.flexBox} mt={3} justifyContent="space-between">
          <Box className={classes.header1}>DAO proposals</Box>
          <Box className={classes.buttonBox} ml={4}>
            <Box className={classes.header2} mr={1}>
              New proposal
            </Box>
            <DiscussionCheckedIcon />
          </Box>
        </Box>
        <Box className={classes.voteCards} my={2}>
          <MasonryGrid
            gutter={"24px"}
            data={mockProposalData.filter((_, index) => index < 4)}
            renderItem={(item, index) => <ProposalCard item={item} key={`item-${index}`} />}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
          />
        </Box>
        {mockProposalData.length > 4 && (
          <Box className={classes.flexBox} justifyContent="center">
            <Box
              className={classes.secondButtonBox}
              onClick={() => history.push("/privi-data-new/governance/proposals/")}
            >
              <Box className={classes.header2}>Show All</Box>
              <img src={require("assets/icons/arrow_right_white.png")} />
            </Box>
          </Box>
        )}
      </Box>
      {openCreateNewDiscussionModal && (
        <CreateNewDiscussionModal
          open={openCreateNewDiscussionModal}
          handleClose={() => setOpenCreateNewDiscussionModal(false)}
        />
      )}
    </Box>
  );
}
