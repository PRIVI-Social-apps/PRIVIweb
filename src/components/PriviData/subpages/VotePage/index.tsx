import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Pagination from "@material-ui/lab/Pagination";

import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Box from 'shared/ui-kit/Box';
import CustomPopup from "components/PriviData/components/CustomPopup";
import VoteCard from '../../components/Cards/VoteCard'
import { ArrowIcon, DiscussionIcon } from '../../components/Icons/SvgIcons';
import { voteSubPageStyles } from './index.styles';

const sortByOptions = ["Newest", "Most Voted", "Popular"];
const sortByPageOptions = ["9 per page", "18 per page"];

// mock data
const mockVoteData = [
  {
    id: '1',
    title: "One of the obvious benefits of buying art is it lets you financially support",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
    isVoted: true,
    startTime: 1625084309,
    endTime: 1635170627,
    currentNumberOfVotes: 20,
    voteRequired: 100,
  },
  {
    id: '2',
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
    id: '3',
    title: "One of the obvious benefits of buying art is it lets you financially support",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
    isVoted: false,
    currentNumberOfVotes: 20,
    voteRequired: 100,
  },
  {
    id: '4',
    title: "One of the obvious benefits of buying art is it lets you financially support",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
    isVoted: false,
    currentNumberOfVotes: 20,
    voteRequired: 100,
  },
  {
    id: '5',
    title: "One of the obvious benefits of buying art is it lets you financially support",
    content:
      "At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency, like bitcoin or dogecoin, but its blockchain also?",
    isVoted: false,
    currentNumberOfVotes: 20,
    voteRequired: 100,
  },
  {
    id: '6',
    title: "One of the obvious benefits of buying art is it lets you financially support",
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

export default function VotePage() {
  const classes = voteSubPageStyles();
  const [votes, setVotes] = useState<any[]>(mockVoteData);
  const [loadingVotes, setLoadingVotings] = useState<boolean>(false);

  const [sortByOptionsSelection, setSortByOptionsSelection] = useState<string>(sortByOptions[0]);
  const [sortByPageOptionsSelection, setSortByPageOptionsSelection] = useState<string>(
    sortByPageOptions[0]
  );

  const history = useHistory();

  useEffect(() => {
    setLoadingVotings(true);
    // call api for getting vote list
    setLoadingVotings(false);
  }, []);

  const filteredVotes = React.useMemo(() => {
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
          All Votes
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
        <div style={{ marginLeft: 80 }}>
          <CustomPopup
            items={sortByPageOptions}
            label={"Post type"}
            onSelect={setSortByPageOptionsSelection}
            value={sortByPageOptionsSelection}
          />
        </div>
      </div>
      <LoadingWrapper loading={loadingVotes}>
        <div className={classes.voteCards}>
          <MasonryGrid
            gutter={"24px"}
            data={filteredVotes}
            renderItem={(item, index) => <VoteCard item={item} key={`item-${index}`} />}
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
