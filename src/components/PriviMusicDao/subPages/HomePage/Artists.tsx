import React from "react";
import { Box, Grid, makeStyles, Select, MenuItem } from "@material-ui/core";
import { BackIcon, DropDownIcon } from "../GovernancePage/styles";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { Avatar, Color, FontSize, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";
import { useHistory } from "react-router-dom";
import ArtistCard from "components/PriviMusicDao/components/ArtistCard";
import { DetailIcon, UnionIcon } from "components/PriviMusicDao/components/Icons/SvgIcons";
import CustomPopup from "components/PriviMusicDao/components/CustomPopup";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";

const useStyles = makeStyles(theme => ({
  contentBox: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: `0 ${theme.spacing(21)}px`,
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    width: "100%",
    paddingBottom: theme.spacing(5),
    [theme.breakpoints.down("md")]: {
      padding: `0 ${theme.spacing(4)}px`,
      paddingBottom: theme.spacing(10),
    },
  },
  gradientBox: {
    width: "100%",
    height: 600,
    [theme.breakpoints.down("sm")]: {
      height: 800,
    },
  },
  controlBox: {
    borderRadius: theme.spacing(4),
    background: "rgba(45, 48, 71, 0.2)",
  },
  topBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      alignItems: "flex-end",
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-end",
    },
  },
  topControlBox: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      marginTop: theme.spacing(1),
      alignItems: "flex-end",
    },
  },
  filterBox: {
    borderRadius: theme.spacing(4),
    background: "rgba(45, 48, 71, 0.2)",
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
  },
  avatar: {
    marginLeft: -12,
  },
  listRight: {
    "& img": {
      marginRight: 16,
    },
  },
}));

const SortType = [
  { value: "recent", name: "Recently Added" },
  { value: "newest", name: "Newest post" },
];

const PostType = [
  { value: "pop1", name: "Pop Music" },
  { value: "pop2", name: "Pop Music" },
];

const SampleArtists = [
  {
    id: "drake",
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    id: "drake",
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    id: "drake",
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    id: "drake",
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
  {
    id: "drake",
    name: "Drake",
    following: "1,234,567",
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
  },
];

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  800: 2,
  1200: 3,
  1440: 4,
};

export default function Artists() {
  const classes = useStyles();
  const commonClasses = priviMusicDaoPageStyles();

  const history = useHistory();

  const [sortType, setSortType] = React.useState(SortType[0].value);
  const [postType, setPostType] = React.useState(PostType[0].value);

  const [artists, setArtists] = React.useState(SampleArtists);
  const [isListView, setIsListView] = React.useState<boolean>(false);

  const handleSortTypeChange = e => {
    setSortType(e.target.value);
  };

  const handlePostTypeChange = e => {
    setPostType(e.target.value);
  };

  return (
    <Box position="relative">
      <img src={require("assets/musicDAOImages/background.png")} className={classes.gradientBox} />
      <Box className={classes.contentBox}>
        <Box
          display="flex"
          flexDirection="row"
          className={commonClasses.backButton}
          onClick={() => history.goBack()}
        >
          <BackIcon />
          <Text ml={1} color={Color.White} bold>
            BACK
          </Text>
        </Box>
        <Box className={classes.topBox} mt={8} mb={3}>
          <Text color={Color.White} size={FontSize.H3} bold>
            All Artists
          </Text>
          <Box className={classes.topControlBox}>
            <Box className={classes.filterBox}>
              <CustomPopup
                items={SortType}
                label={"Sort by"}
                onSelect={handleSortTypeChange}
                value={sortType}
                theme="dark"
              />
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center" my={1}>
              <Box className={classes.filterBox} mx={2}>
                <CustomPopup
                  items={PostType}
                  label={"Genre"}
                  onSelect={handlePostTypeChange}
                  value={postType}
                  theme="dark"
                />
              </Box>
              <Box className={classes.controlBox} display="flex" flexDirection="row" alignItems="center">
                <SecondaryButton
                  className={`${commonClasses.showButton} ${
                    isListView ? commonClasses.showButtonSelected : ""
                  }`}
                  size="small"
                  onClick={() => setIsListView(true)}
                  isRounded
                >
                  <UnionIcon />
                </SecondaryButton>
                <PrimaryButton
                  className={`${commonClasses.showButton} ${
                    !isListView ? commonClasses.showButtonSelected : ""
                  }`}
                  size="small"
                  onClick={() => setIsListView(false)}
                  isRounded
                  style={{ marginLeft: 0 }}
                >
                  <DetailIcon />
                </PrimaryButton>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box>
          {isListView ? (
            artists.map((artist, index) => (
              <Box
                key={`artist-list-${index}`}
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                className={commonClasses.card}
                borderRadius={14}
                px={2}
                py={1.5}
                mb={1}
              >
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Box width={84} height={63}>
                    <img src={artist.image} width="100%" alt="trending" />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    borderRight="1px solid rgba(0, 0, 0, 0.1)"
                    width={220}
                    mr={3}
                    pr={2}
                  >
                    <Avatar size="small" url={getRandomAvatar()} className={classes.avatar} />
                    <Text size={FontSize.XL} bold ml={3}>
                      Song Name
                    </Text>
                  </Box>
                  <Text bold>Reproductions: 34,589</Text>
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center" className={classes.listRight}>
                  <img width="32" src={require("assets/musicDAOImages/trending.png")} alt="trending" />
                  <img width="40" src={require("assets/musicDAOImages/thumb.png")} alt="thumb" />
                  <PrimaryButton className={commonClasses.primaryButton} size="medium">
                    Claim
                  </PrimaryButton>
                </Box>
              </Box>
            ))
          ) : (
            <MasonryGrid
              gutter={"24px"}
              data={artists}
              renderItem={(item, _) => <ArtistCard data={item} customSize={{ height: 400 }} />}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
