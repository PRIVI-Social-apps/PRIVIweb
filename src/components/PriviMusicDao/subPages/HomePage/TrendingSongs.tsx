import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { BackIcon } from "../GovernancePage/styles";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { Avatar, Color, FontSize, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";
import SongCard from "components/PriviMusicDao/components/SongCard";
import { useHistory } from "react-router-dom";
import { DetailIcon, UnionIcon } from "components/PriviMusicDao/components/Icons/SvgIcons";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import CustomPopup from "components/PriviMusicDao/components/CustomPopup";

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
  avatar: {
    marginLeft: -12,
  },
  listRight: {
    "& img": {
      marginRight: 16,
    },
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
  controlBox: {
    borderRadius: theme.spacing(4),
    background: "rgba(45, 48, 71, 0.2)",
  },
}));

const SortType = ["Recently Added", "Newest Post"];

const PostType = ["Pop Music", "Pop Music"];

const SampleTrendings = [
  {
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
    title: "Black Hole (Dan D’Lion Remix",
    description: "1,234,589 times uploaded",
  },
  {
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
    title: "Black Hole (Dan D’Lion Remix",
    description: "1,234,589 times uploaded",
  },
  {
    image: "https://cdn.pixabay.com/photo/2018/01/18/09/42/park-3089907_960_720.jpg",
    title: "Black Hole (Dan D’Lion Remix",
    description: "1,234,589 times uploaded",
  },
];

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  800: 2,
  1200: 3,
  1440: 4,
};

export default function TrendingSongs() {
  const classes = useStyles();
  const commonClasses = priviMusicDaoPageStyles();

  const history = useHistory();

  const [sortType, setSortType] = React.useState(SortType[0]);
  const [postType, setPostType] = React.useState(PostType[0]);

  const [songs, setSongs] = React.useState(SampleTrendings);
  const [isListView, setIsListView] = React.useState<boolean>(false);

  const handleSortTypeChange = value => {
    setSortType(value);
  };

  const handlePostTypeChange = value => {
    setPostType(value);
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
            Trending Songs
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
            songs.map((song, index) => (
              <Box
                key={`song-list-${index}`}
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
                    <img src={song.image} width="100%" alt="trending" />
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
              data={songs}
              renderItem={(item, _) => <SongCard data={item} />}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
