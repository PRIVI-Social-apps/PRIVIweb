import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";

import { ReactComponent as DiscussionIcon } from "assets/icons/discussion.svg";
import { ReactComponent as TopRigthArrowIcon } from "assets/icons/top_right_arrow.svg";
import { ReactComponent as HotIcon } from "assets/icons/whh_hot.svg";
import { ReactComponent as CircleCheckedIcon } from "assets/icons/circle_checked.svg";
import { ReactComponent as ClockIcon } from "assets/icons/clock.svg";

import { discussionsPageStyles } from "./index.styles";
import DiscussionCard from "../../components/Cards/DiscussionCard";
import { ArrowIcon } from "../../components/Icons/SvgIcons";
import Pagination from "@material-ui/lab/Pagination";
import CustomPopup from "components/PriviData/components/CustomPopup";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import CreateNewDiscussionModal from "components/PriviData/modals/CreateNewDiscussionModal";

const sortByOptions = ["New", "Top", "Hot", "Closed"];
const sortByCurrencyOptions = ["Crypto", "Currency"];

const PAGE_SIZE = 6;

export default function DiscussionsPage() {
  const classes = discussionsPageStyles();
  const history = useHistory();

  const [openCreateNewDiscussion, setOpenCreateNewDiscussion] = useState<boolean>(false);
  const [sortByOptionsSelection, setSortByOptionsSelection] = useState<string>(sortByOptions[0]);
  const [sortByCurrencyOptionsSelection, setSortByCurrencyOptionsSelection] = useState<string>(
    sortByCurrencyOptions[0]
  );
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    const body = {
      sortBy: sortByOptionsSelection === sortByOptions[0] ? "asc" : "desc",
      postType: sortByCurrencyOptionsSelection,
    };
    axios.post(`${URL()}/privi-data/getDiscussions/`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        setDiscussions(resp.data);
      }
      setLoading(false);
    }).catch(e => setLoading(false));
  }, [sortByOptionsSelection, sortByCurrencyOptionsSelection]);

  return (
    <Box className={classes.content}>
      <Box className={classes.subContent}>
        <Box className={classes.gradient}></Box>
        <Box className={classes.flexBox} mt={3} justifyContent="space-between">
          <Box
            className={classes.flexBox}
            style={{ color: "white", cursor: "pointer " }}
            onClick={() => {
              history.goBack();
            }}
          >
            <Box color="#AFACD7">
              <ArrowIcon />
            </Box>
            <Box color="#AFACD7" fontSize={14} fontWeight={700} fontFamily="Agrandir" ml="5px" mb="4px">
              BACK
            </Box>
          </Box>
          <Box className={classes.title}>Discussion</Box>
          <Box className={classes.selectedButtonBox} ml={4} onClick={() => setOpenCreateNewDiscussion(true)}>
            <Box className={classes.header2} mr={1}>
              New discussion
            </Box>
            <DiscussionIcon />
          </Box>
        </Box>
        <Box className={classes.flexBox} mt={3} justifyContent="space-between">
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
          <Box className={classes.header2} ml={4} mr={2}>
            <CustomPopup
              items={sortByCurrencyOptions}
              label={"Post type"}
              onSelect={setSortByCurrencyOptionsSelection}
              value={sortByCurrencyOptionsSelection}
            />
          </Box>
        </Box>
        <LoadingWrapper loading={loading}>
          <>
            {discussions.map(
              (item, index) =>
                index >= (currentPage - 1) * PAGE_SIZE &&
                index < currentPage * PAGE_SIZE && (
                  <Box key={index} my={2}>
                    <DiscussionCard item={item} />
                  </Box>
                )
            )}
            <Box className={classes.pagination}>
              <Pagination
                count={
                  (discussions.length - (discussions.length % PAGE_SIZE)) / PAGE_SIZE +
                  (discussions.length % PAGE_SIZE > 0 ? 1 : 0)
                }
                onChange={(_, pageNumber) => setCurrentPage(pageNumber)}
              />
            </Box>
          </>
        </LoadingWrapper>
      </Box>
      {openCreateNewDiscussion && (
        <CreateNewDiscussionModal
          open={openCreateNewDiscussion}
          handleClose={() => setOpenCreateNewDiscussion(false)}
        />
      )}
    </Box>
  );
}
