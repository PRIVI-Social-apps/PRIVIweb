import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import Pagination from "@material-ui/lab/Pagination";
import { Hidden } from "@material-ui/core";

import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import VoteCard from "../../components/Cards/VoteCard";
import { ArrowIcon, DiscussionIcon } from "../../components/Icons/SvgIcons";
import { voteSubPageStyles } from "./index.styles";
import CustomPopup from "../../components/CustomPopup";

import { ReactComponent as TopRigthArrowIcon } from "assets/icons/top_right_arrow.svg";
import { ReactComponent as HotIcon } from "assets/icons/whh_hot.svg";
import { ReactComponent as CircleCheckedIcon } from "assets/icons/circle_checked.svg";
import { ReactComponent as ClockIcon } from "assets/icons/clock.svg";

const sortByOptions = ["New", "Top", "Hot", "Closed"];
const sortByCurrencyOptions = ["Cryptocurrency", "Currency"];

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  800: 2,
  1200: 3,
  1440: 4,
};

const PAGE_SZIE = 10;

export default function VotePage() {
  const classes = voteSubPageStyles();
  const history = useHistory();

  const [votes, setVotes] = useState<any[]>([]);
  const [loadingVotes, setLoadingVotings] = useState<boolean>(false);

  const [filter, setFilter] = useState<string>("newest");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [sortByOptionsSelection, setSortByOptionsSelection] = useState<string>(sortByOptions[0]);
  const [sortByCurrencyOptionsSelection, setSortByCurrencyOptionsSelection] = useState<string>(
    sortByCurrencyOptions[0]
  );

  useEffect(() => {
    setLoadingVotings(true);
    const body = {
      pagination: pageNumber,
      filter: filter,
    };
    Axios.post(`${URL()}/musicDao/governance/getPolls`, body)
      .then(res => {
        const data = res.data;
        if (data.success) {
          setVotes(prev => [...prev, ...data.data.polls]);
          if (totalCount === 0) {
            setTotalCount(data.data.totalCount);
          }
        }
      })
      .catch(e => console.log(e))
      .finally(() => setLoadingVotings(false));
  }, [pageNumber, filter]);

  const filteredVotes = React.useMemo(() => {
    let filteredData = [...votes];
    // set filter options on vote list
    return filteredData;
  }, [votes]);

  return (
    <div className={classes.content}>
      <img
        src={require("assets/musicDAOImages/background.png")}
        width="100%"
        height="100%"
        className={classes.gradient}
      />
      <div className={classes.headerTitle}>
        <div className={classes.headerBack} onClick={() => history.goBack()}>
          <Box color="#FFFFFF">
            <ArrowIcon />
          </Box>
          <Box color="#FFFFFF" fontSize={14} fontWeight={700} fontFamily="Agrandir" ml="5px" mb="4px">
            BACK
          </Box>
        </div>
        <div className={classes.headerMainTitle}>All Polls</div>
        <div className={classes.headerButtonSection}>
          <button
            style={{
              backgroundColor: "#2D3047",
              borderRadius: 46,
              fontFamily: "Agrandir",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <span style={{ marginRight: 10 }}>New discussion</span>
            <DiscussionIcon />
          </button>
        </div>
      </div>
      <div className={classes.filterSection}>
        <Box className={classes.flexBox}>
          {sortByOptions.map((item, index) => (
            <Box
              key={index}
              className={item === sortByOptionsSelection ? classes.selectedButtonBox : classes.buttonBox}
              mr={1}
              onClick={() => setSortByOptionsSelection(item)}
            >
              <Box className={classes.flexBox}>
                {index === 0 ? (
                  <ClockIcon style={{ width: "13px" }} />
                ) : index === 1 ? (
                  <TopRigthArrowIcon />
                ) : index === 2 ? (
                  <HotIcon />
                ) : (
                  <CircleCheckedIcon />
                )}
              </Box>
              <Box className={classes.header2} ml={1}>
                {item}
              </Box>
            </Box>
          ))}
        </Box>
        <div className={classes.filterPopMenu}>
          <CustomPopup
            items={sortByCurrencyOptions}
            label={"Post type"}
            onSelect={setSortByCurrencyOptionsSelection}
            value={sortByCurrencyOptionsSelection}
          />
        </div>
      </div>
      <LoadingWrapper loading={loadingVotes}>
        <div className={classes.voteCards}>
          <MasonryGrid
            gutter={"24px"}
            data={filteredVotes.filter(
              (_, index) => index >= (pageNumber - 1) * PAGE_SZIE && index < pageNumber * PAGE_SZIE
            )}
            renderItem={(item, index) => <VoteCard item={item} key={`item-${index}`} />}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
          />
        </div>
      </LoadingWrapper>
      <div className={classes.pagination}>
        <Pagination
          count={(totalCount - (totalCount % PAGE_SZIE)) / PAGE_SZIE + (totalCount % PAGE_SZIE > 0 ? 1 : 0)}
          onChange={(_, page) => setPageNumber(page)}
        />
      </div>
    </div>
  );
}
