import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";

import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Box from 'shared/ui-kit/Box';
import CustomPopup from "components/PriviData/components/CustomPopup";
import ProposalCard from '../../components/Cards/ProposalCard'
import { ArrowIcon, DiscussionIcon } from '../../components/Icons/SvgIcons';
import { proposalSubPageStyles } from './index.styles';

const sortByOptions = ["Newest", "Most Voted", "Popular"];
const sortByPageOptions = ["9 per page", "18 per page"];

// mock data
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
      nothing: 35
    }
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
      nothing: 35
    }
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

export default function ProposalPage() {
  const classes = proposalSubPageStyles();
  const [votes, setProposals] = useState<any[]>(mockProposalData);
  const [loadingProposals, setLoadingProposals] = useState<boolean>(false);

  const [sortByOptionsSelection, setSortByOptionsSelection] = useState<string>(sortByOptions[0]);
  const [sortByPageOptionsSelection, setSortByPageOptionsSelection] = useState<string>(
    sortByPageOptions[0]
  );

  const history = useHistory();

  useEffect(() => {
    setLoadingProposals(true);
    // call api for getting vote list
    setLoadingProposals(false);
  }, []);

  const filteredProposals = React.useMemo(() => {
    let filteredData = [...votes];
    // set filter options on vote list
    return filteredData;
  }, [votes]);

  return (
    <div className={classes.content}>
      <div className={classes.gradient}></div>
      <div className={classes.headerTitle}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          style={{ cursor: "pointer" }}
          onClick={() => history.push("/privi-data-new/governance/")}
        >
          <Box color="#AFACD7">
            <ArrowIcon />
          </Box>
          <Box color="#AFACD7" fontSize={14} fontWeight={700} fontFamily="Agrandir" ml="5px" mb="4px">
            BACK
          </Box>
        </Box>
        <Box fontFamily="Agrandir" fontStyle='normal' fontWeight={800} fontSize={52} color="#EA89F3" lineHeight="120%">
          All Dao Proposals
        </Box>
        <div>
          <button
            className={classes.discussionBtn}
            onClick={() => {}}
          >
            <span>New discussion</span>
            &nbsp;&nbsp;
            <DiscussionIcon />
          </button>
        </div>
      </div>
      <div className={classes.sortSection}>
          <CustomPopup
            items={sortByOptions}
            label={"Post type"}
            onSelect={setSortByOptionsSelection}
            value={sortByOptionsSelection}
          />
        <div style={{marginLeft: 80}}>
          <CustomPopup
            items={sortByPageOptions}
            label={"Post type"}
            onSelect={setSortByPageOptionsSelection}
            value={sortByPageOptionsSelection}
          />
        </div>
      </div>
      <LoadingWrapper loading={loadingProposals}>
        <div className={classes.voteCards}>
          <MasonryGrid
            gutter={"24px"}
            data={filteredProposals}
            renderItem={(item, index) => <ProposalCard item={item} key={`item-${index}`} />}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
          />
        </div>
      </LoadingWrapper>
      <div className={classes.pagination}>
        <Pagination count={10} onChange={() => { }} />
      </div>
    </div>
  );
}
