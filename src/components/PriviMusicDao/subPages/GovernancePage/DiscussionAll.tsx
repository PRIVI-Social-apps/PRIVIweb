import React, { useState, useEffect } from "react";
import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { useHistory } from "react-router-dom";

import { makeStyles, Select, MenuItem, Hidden } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

import { Text } from "components/PriviMusicDao/components/ui-kit";
import { Color, FontSize, HeaderBold2, PrimaryButton } from "shared/ui-kit";
import DiscussionCard from "components/PriviMusicDao/components/DiscussionCard";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";
import Box from "shared/ui-kit/Box";
import {
  BackIcon,
  CloseIcon,
  DiscussionIcon,
  DropDownIcon,
  HistoryIcon,
  HotIcon,
  JumpIcon,
  useGovernanceStyles,
} from "./styles";

const useStyles = makeStyles(theme => ({
  filterButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `rgba(240, 245, 248, 0.7) !important`,
    color: `${Color.MusicDAOLightBlue} !important`,
    fontSize: "12px !important",
    borderRadius: "100px !important",
    "& svg": {
      marginRight: 8,
    },
  },
  selected: {
    backgroundColor: `${Color.MusicDAODark} !important`,
    color: "white !important",
  },
  filterSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 56,
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      marginTop: 24,
      alignItems: "flex-end",
    },
  },
  filterItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
}));

const Filters = [
  { name: "New", Icon: HistoryIcon },
  { name: "Top", Icon: JumpIcon },
  { name: "Hot", Icon: HotIcon },
  { name: "Closed", Icon: CloseIcon },
];

const PostType = [
  { value: "crypto", name: "Cryptocurrencyt" },
  { value: "crypto1", name: "Cryptocurrencyt1" },
];

export default function DiscussionAll() {
  const commonClasses = useGovernanceStyles();
  const classes = useStyles();

  const history = useHistory();

  const users = useTypedSelector(state => state.usersInfoList);
  const [selectedFilter, setSelectedFilter] = useState("New");
  const [postType, setPostType] = useState(PostType[0].value);

  const [discussions, setDiscussions] = useState<any[]>([]);

  const [pagination, setPagination] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    trackPromise(
      axios
        .post(`${URL()}/musicDao/governance/getDiscussions`, {
          pagination,
          filter: "asc",
        })
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            setTotal(resp.data.totalCount);
            setDiscussions(
              resp.data.discussions.map(discussion => {
                const creator = users.find(user => user.id === discussion.creatorAddress);
                return {
                  ...discussion,
                  imageURL: creator?.imageURL || getRandomAvatar(),
                };
              })
            );
          }
        })
        .catch(err => {
          console.log("===========", err);
        })
    );
  }, [pagination]);

  const handlePostTypeChange = e => {
    setPostType(e.target.value);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPagination(value);
  };

  return (
    <Box position="relative">
      <div className={commonClasses.headerImage}>
        <img src={require("assets/musicDAOImages/background.png")} width="100%" height="100%" />
      </div>
      <div className={commonClasses.content}>
        <Hidden only="xs">
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box
              display="flex"
              flexDirection="row"
              className={commonClasses.back}
              onClick={() => history.goBack()}
            >
              <BackIcon />
              <Text ml={1} color={Color.White} bold>
                BACK
              </Text>
            </Box>
            <div className={commonClasses.headerTitle}>Discussions</div>
            <PrimaryButton size="medium" className={commonClasses.iconButton}>
              New discussion
              <DiscussionIcon />
            </PrimaryButton>
          </Box>
        </Hidden>
        <Hidden smUp>
          <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              flexDirection="row"
              className={commonClasses.back}
              onClick={() => history.goBack()}
            >
              <BackIcon />
              <Text ml={1} color={Color.White} bold>
                BACK
              </Text>
            </Box>
            <Box display="flex" justifyContent="center" mt={2}>
              <div className={commonClasses.headerTitle}>Discussions</div>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <PrimaryButton size="medium" className={commonClasses.iconButton}>
                New discussion
                <DiscussionIcon />
              </PrimaryButton>
            </Box>
          </Box>
        </Hidden>
        <div className={classes.filterSection}>
          <div className={classes.filterItem}>
            {Filters.map((filter, index) => (
              <PrimaryButton
                key={`discussion-filter-${index}`}
                size="small"
                className={`${classes.filterButton} ${filter.name === selectedFilter && classes.selected}`}
                onClick={() => setSelectedFilter(filter.name)}
              >
                <filter.Icon color={filter.name === selectedFilter ? "white" : Color.MusicDAOLightBlue} />
                {filter.name}
              </PrimaryButton>
            ))}
          </div>
          <div className={classes.filterItem}>
            <Text color={Color.White} mr={1}>
              Post type
            </Text>
            <Select
              className={commonClasses.select}
              IconComponent={DropDownIcon}
              value={postType}
              onChange={handlePostTypeChange}
            >
              {PostType.map((post, index) => (
                <MenuItem key={`discussion-post-${index}`} value={post.value}>
                  <Text size={FontSize.S} color={Color.Black}>
                    {post.name}
                  </Text>
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
        <Box display="flex" flexDirection="column" mt={5}>
          {discussions.map((discussion, index) => (
            <DiscussionCard key={`discussion-card-${index}`} discussion={discussion} />
          ))}
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="center" mt={5}>
          <Pagination count={Math.floor((total - 1) / 10) + 1} page={pagination} onChange={handleChange} />
        </Box>
      </div>
    </Box>
  );
}
