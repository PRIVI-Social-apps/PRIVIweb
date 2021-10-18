import React from "react";
import { Box, Grid, makeStyles, Select, MenuItem, useTheme, useMediaQuery  } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";

import {
  Color,
  FontSize,
  HeaderBold1,
  HeaderBold3,
  PrimaryButton,
  SecondaryButton,
  StyledDivider,
} from "shared/ui-kit";
import { VirtualizedMasnory } from "shared/ui-kit/VirtualizedMasnory";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";
import { DropDownIcon } from "../GovernancePage/styles";
import PodCard from "components/PriviPods/components/Cards/PodCard";
import URL from "shared/functions/getURL";
import { Variant } from "shared/constants/const";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import { useTypedSelector } from "store/reducers/Reducer";
import HowItWorksModal from "components/PriviMusicDao/modals/HowItWorks";
import CreateClaimablePodModal from "../../../PriviPods/modals/claimable/CreateClaimablePodModal";

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    "& > img": {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: "1500px"
    },
  },
  body: {
    width: "100%",
    position: 'relative',
    maxWidth: 1440,
    paddingLeft: 50,
    paddingRight: 50,
    margin: 'auto',
    marginTop: 100,
    display: "flex",
    flexDirection: "column",
    paddingBottom: 40,
    zIndex: 2,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 28,
      paddingRight: 28,
      marginTop: 150,
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 16,
      paddingRight: 16,
      marginTop: 150,
    },
    "& .left-logo": {
      position: 'absolute',
      top: 150,
      left: 50,
      [theme.breakpoints.down("sm")]: {
        left: -10,
      },
      [theme.breakpoints.down("xs")]: {
        left: -50,
      },
    },
    "& .right-logo": {
      position: 'absolute',
      top: -150,
      right: 0,
      [theme.breakpoints.down("sm")]: {
        top: -210,
      },
      [theme.breakpoints.down("xs")]: {
        top: -250,
      },
    }
  },
  header: {
    fontSize: 58,
    fontWeight: 400,
    marginBlock: 0,
    marginBottom: 26,
    color: Color.White,
    lineHeight: '60px',
    "& span": {
      fontWeight: 800,
    },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 10,
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'column',
    },
  },
  headerTitle: {
    fontSize: 26,
    color: Color.White,
    width: "70%",
    textAlign: "center",
    marginBlock: 0,
    "& span": {
      fontWeight: 800,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  buttons: {
    flexDirection: 'row',
    columnGap: 24,
    rowGap: 10,
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'column',
    },
    "& button": {
      borderRadius: 48,
      width: 200,
      color: Color.MusicDAODark,
      backgroundColor: Color.White,
      border: "none",
      fontSize: 18,
      height: 52,
    },
    "& button:last-child": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      color: Color.White,
      backgroundColor: Color.MusicDAODark,
      marginLeft: 0,
      "& svg": {
        marginLeft: 16,
      },
    },
  },
  searchInput: {
    padding: "13px 19px 10px",
    fontSize: "14px",
    background: "transparent",
    width: "100%",
    border: `1px solid ${Color.MusicDAOGreen}`,
    color: Color.MusicDAOLightBlue,
    boxSizing: "border-box",
    borderRadius: 48,
    "&:focus-visible": {
      outline: "none",
    },
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
    marginBottom: 30,
    [theme.breakpoints.down("xs")]: {
      marginTop: 20,
      marginBottom: 20,
      flexDirection: 'column',
      rowGap: 35,
      alignItems: 'flex-end',
    },
  },
  searchInputBox: {
    position: "relative",
    width: 400,
    [theme.breakpoints.down("xs")]: {
      width: '100%'
    },
  },
  searchImg: {
    position: "absolute",
    top: "50%",
    right: "17px",
    transform: "translate(0, -50%)",
    cursor: "pointer",
  },
  select: {
    "& .MuiSelect-root": {
      paddingRight: 12,
    },
    "& svg path": {
      stroke: '#2D3047'
    }
  },
}));

const PostType = [
  { value: "crypto", name: "Cryptocurrencyt" },
  { value: "crypto1", name: "Cryptocurrencyt1" },
];

export default function ClaimableMusicPage() {
  const commonClasses = priviMusicDaoPageStyles();
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));


  const users = useTypedSelector(state => state.usersInfoList);

  const [postType, setPostType] = React.useState(PostType[0].value);
  const [searchValue, setSearchValue] = React.useState<string>("");

  const [openHowItWorksModal, setOpenHowItWorksModal] = React.useState<boolean>(false);

  const [songs, setSongs] = React.useState<any[]>([]);
  const [pagination, setPagination] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const [songsLoader, setSongsLoader] = React.useState<boolean>(false);

  const [openCreateClaimableSongModal, setOpenCreateClaimableSongModal] = React.useState<boolean>(false);

  const scrollRef = React.useRef<any>();

  const handleSearchChange = e => {
    setSearchValue(e.target.value);
  };

  const handlePostTypeChange = e => {
    setPostType(e.target.value);
  };

  React.useEffect(() => {
    getClaimablePods();
  }, [pagination]);

  const getClaimablePods = async () => {
    const config = {
      searchValue,
      pagination,
    };
    setSongsLoader(true);
    try {
      const response = await axios.post(`${URL()}/musicDao/claimable/getClaimableSongs`, config);
      const resp = response.data;
      if (resp.success) {
        setTotal(resp.data.totalCount);
        setSongs(resp.data.songs);
      }
      setSongsLoader(false);
    } catch (e) {
      setSongsLoader(false);
    }
  };

  const getPodWithUserData = React.useCallback(
    pod => {
      //load creator data
      if (users.some(user => pod.Creator === user.id)) {
        const trendingUser = users[users.findIndex(user => pod.Creator === user.id)];
        pod.CreatorImageURL = trendingUser.imageURL;
        pod.CreatorName = trendingUser.name;
      }

      if (pod.Followers && pod.Followers[0] && users.some(user => pod.Followers[0] === user.id)) {
        const trendingFollowUser = users[users.findIndex(user => pod.Followers[0] === user.id)];
        pod.FirstFollower = {
          imageURL: trendingFollowUser.imageURL,
          name: trendingFollowUser.name,
        };
      }

      return pod;
    },
    [users]
  );

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPagination(value);
  };

  const onSearch = () => {
    setPagination(1);
    getClaimablePods();
  };

  return (
    <Box className={classes.container}>
      <img src={require("assets/musicDAOImages/background.png")} />
      <div className={classes.body} ref={scrollRef}>
        <img className="left-logo" src={require("assets/musicDAOImages/leftMusicDaoLogo.png")} />
        <img className="right-logo" src={require("assets/musicDAOImages/rightMusicDaoLogo.png")} />
        <Box display="flex" flexDirection="column" alignItems="center" zIndex="1">
          <h1 className={classes.header}>
            <span>Claimable</span> Music
          </h1>
          <span className={classes.headerTitle}>
            <span>Stake privi,</span>
            get songs to upload and earn a share of the funds when the song is claimed by artist
          </span>
          <Box className={classes.buttons} display="flex" mt={4} mb={4}>
            <SecondaryButton size="medium">Stake Privi</SecondaryButton>
            <PrimaryButton size="medium" onClick={() => setOpenCreateClaimableSongModal(true)}>
              Upload Song
              <UploadIcon />
            </PrimaryButton>
          </Box>
          <Text size={FontSize.XL} onClick={() => setOpenHowItWorksModal(true)}>
            How it works ?
          </Text>
        </Box>
        <Box className={classes.filterContainer}>
          <div className={classes.searchInputBox}>
            <input
              className={classes.searchInput}
              autoFocus
              placeholder={"Search artist, song, album or more"}
              value={searchValue}
              onChange={handleSearchChange}
            />
            <img className={classes.searchImg} src={require(`assets/icons/search.svg`)} onClick={onSearch} />
          </div>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Text mr={1}>Post type</Text>
            <Select
              className={classes.select}
              IconComponent={DropDownIcon}
              value={postType}
              onChange={handlePostTypeChange}
            >
              {PostType.map((post, index) => (
                <MenuItem key={`discussion-post-${index}`} value={post.value}>
                  <Text size={FontSize.S} color={Color.Black} bold>
                    {post.name}
                  </Text>
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        <LoadingWrapper theme="dark" loading={songsLoader}>
          <Grid container spacing={3}>
            {songs.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={`${item.PodAddress}-${index}-DNFTtrending-card`}>
                <PodCard pod={getPodWithUserData(item)} type={"claim-music-dao"} variant={Variant.Secondary} />
              </Grid>
            ))}
          </Grid>
        </LoadingWrapper>
        <Box display="flex" flexDirection="row" justifyContent="center" mt={5}>
          <Pagination count={Math.ceil(total / 12)} page={pagination} onChange={handleChange} />
        </Box>
      </div>
      <HowItWorksModal open={openHowItWorksModal} handleClose={() => setOpenHowItWorksModal(false)} />
      {openCreateClaimableSongModal && (
        <CreateClaimablePodModal
          open={openCreateClaimableSongModal}
          handleClose={() => setOpenCreateClaimableSongModal(false)}
        />
      )}
    </Box>
  );
}

const UploadIcon = () => (
  <svg width="12" height="17" viewBox="0 0 12 17" fill="none">
    <path
      d="M5.80091 0.306983L11.341 5.84707H7.03859V11.2108C6.68479 11.447 6.21338 11.5646 5.80078 11.5646C5.32937 11.5646 4.91677 11.447 4.56298 11.2108V5.84707L0.260563 5.8481L5.80091 0.306983Z"
      fill="url(#paint0_linear)"
    />
    <path
      d="M0.91262 13.3885C1.40258 12.8985 2.18644 12.9022 2.77172 13.2731C3.64675 13.8277 4.6635 14.159 5.80091 14.159C6.89032 14.159 7.94953 13.8313 8.83113 13.2821C9.41711 12.9171 10.205 12.9042 10.6932 13.3924C11.1815 13.8808 11.186 14.6814 10.6299 15.0909C9.27464 16.0888 7.5943 16.6934 5.80099 16.6934C4.00433 16.6934 2.32105 16.1244 0.964479 15.1077C0.40626 14.6893 0.419373 13.8818 0.91262 13.3885Z"
      fill="url(#paint1_linear)"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="-4.79855"
        y1="6.00056"
        x2="8.6191"
        y2="18.7337"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.179206" stopColor="#A0D800" />
        <stop offset="0.852705" stopColor="#53DBBA" />
      </linearGradient>
      <linearGradient
        id="paint1_linear"
        x1="-4.79855"
        y1="6.00056"
        x2="8.6191"
        y2="18.7337"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.179206" stopColor="#A0D800" />
        <stop offset="0.852705" stopColor="#53DBBA" />
      </linearGradient>
    </defs>
  </svg>
);
