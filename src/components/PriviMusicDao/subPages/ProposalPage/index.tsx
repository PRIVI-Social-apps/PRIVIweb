import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import Pagination from "@material-ui/lab/Pagination";

import URL from "shared/functions/getURL";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Box from "shared/ui-kit/Box";
import CustomPopup from "../../components/CustomPopup";
import ProposalCard from "../../components/Cards/ProposalCard";
import { ArrowIcon, DiscussionIcon } from "../../components/Icons/SvgIcons";
import { proposalSubPageStyles } from "./index.styles";

import { ReactComponent as TopRigthArrowIcon } from "assets/icons/top_right_arrow.svg";
import { ReactComponent as HotIcon } from "assets/icons/whh_hot.svg";
import { ReactComponent as CircleCheckedIcon } from "assets/icons/circle_checked.svg";
import { ReactComponent as ClockIcon } from "assets/icons/clock.svg";

const filterOptions = ["New", "Top", "Hot", "Closed"];
const sortByOptions = ["Newest", "Most Voted", "Popular"];
const sortByPageOptions = ["9 per page", "18 per page"];

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  800: 2,
  1200: 3,
  1440: 4,
};

const PAGE_SZIE = 10;

export default function ProposalPage() {
  const classes = proposalSubPageStyles();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loadingProposals, setLoadingProposals] = useState<boolean>(false);

  const [filterOptionsSelection, setFilterOptionsSelection] = useState<string>(filterOptions[0]);
  const [sortByOptionsSelection, setSortByOptionsSelection] = useState<string>(sortByOptions[0]);
  const [sortByPageOptionsSelection, setSortByPageOptionsSelection] = useState<string>(sortByPageOptions[0]);

  const [filter, setFilter] = useState<string>("newest");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const history = useHistory();

  useEffect(() => {
    setLoadingProposals(true);
    const body = {
      pagination: pageNumber,
      filter: filter,
    };
    Axios.post(`${URL()}/musicDao/governance/getDaoProposals`, body)
      .then(res => {
        const data = res.data;
        if (data.success) {
          setProposals(data.data.proposals);
          if (totalCount === 0) {
            setTotalCount(data.data.totalCount);
          }
        }
      })
      .catch(e => console.log(e))
      .finally(() => setLoadingProposals(false));
  }, [pageNumber, filter]);

  const filteredProposals = React.useMemo(() => {
    let filteredData = [...proposals];
    // set filter options on vote list
    return filteredData;
  }, [proposals]);

  return (
    <div className={classes.content}>
      <div className={classes.headerImage}>
        <img src={require("assets/musicDAOImages/background.png")} width='100%' height='100%' className={classes.gradient} />
      </div>
      <div className={classes.headerTitle}>
        <div
          className={classes.headerBack}
          onClick={() => history.goBack()}
        >
          <Box color="#FFFFFF">
            <ArrowIcon />
          </Box>
          <Box color="#FFFFFF" fontSize={14} fontWeight={700} fontFamily="Agrandir" ml="5px" mb="4px">
            BACK
          </Box>
        </div>
        <div className={classes.headerMainTitle}>
          All Dao Proposals
        </div>
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
      <Box className={classes.filterSection}>
        <Box className={classes.flexBox}>
          {filterOptions.map((item, index) => (
            <Box
              key={index}
              className={item === filterOptionsSelection ? classes.selectedButtonBox : classes.buttonBox}
              mr={1}
              onClick={() => setFilterOptionsSelection(item)}
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
            items={sortByOptions}
            label={"Post type"}
            onSelect={setSortByOptionsSelection}
            value={sortByOptionsSelection}
          />
          {/* <div style={{ marginLeft: 80 }}>
            <CustomPopup
              items={sortByPageOptions}
              label={"Post type"}
              onSelect={setSortByPageOptionsSelection}
              value={sortByPageOptionsSelection}
            />
          </div> */}
        </div>
      </Box>
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
        <Pagination
          count={(totalCount - (totalCount % PAGE_SZIE)) / PAGE_SZIE + (totalCount % PAGE_SZIE > 0 ? 1 : 0)}
          onChange={(_, page) => setPageNumber(page)}
        />
      </div>
    </div>
  );
}
