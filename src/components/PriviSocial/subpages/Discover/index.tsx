import { GreenTitle } from "components/PriviSocial/index.styles";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Grid } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Cards from "../../components/Cards";
import { discoverStyles } from "./index.styles";

export default function Discover() {
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const classes = discoverStyles();

  const [searchValue, setSearchValue] = useState<string>("");
  const [closenessDegree, setClosenessDegree] = useState<number[]>([1.6, 2.6]);

  const [loadingSuggestedArtists, setLoadingSuggestedArtists] = useState<boolean>(false);
  const [loadingSocialTokens, setLoadingSocialTokens] = useState<boolean>(false);
  const [loadingPerks, setLoadingPerks] = useState<boolean>(false);
  const [loadingSuggestedDAOs, setLoadingSuggestedDAOs] = useState<boolean>(false);

  const [suggestedArtists, setSuggestedArtists] = useState<any[]>(users.filter(u => u.imageURL !== ""));
  const [socialTokens, setSocialTokens] = useState<any[]>([]);
  const [perks, setPerks] = useState<any[]>([]);
  const [suggestedDAOs, setSuggestedDAOs] = useState<any[]>([]);

  const [filteredSuggestedArtists, setFilteredSuggestedArtists] = useState<any[]>(
    users.filter(u => u.imageURL !== "")
  );
  const [filteredSocialTokens, setFilteredSocialTokens] = useState<any[]>([]);
  const [filteredPerks, setFilteredPerks] = useState<any[]>([]);
  const [filteredSuggestedDAOs, setFilteredSuggestedDAOs] = useState<any[]>([]);

  const [viewMoreSuggestedArtists, setViewMoreSuggestedArtists] = useState<boolean>(false);
  const [viewMoreSocialTokens, setViewMoreSocialTokens] = useState<boolean>(false);
  const [viewMorePerks, setViewMorePerks] = useState<boolean>(false);
  const [viewMoreSuggestedDAOs, setViewMoreSuggestedDAOs] = useState<boolean>(false);

  useEffect(() => {
    if (user && user.id && user.address) {
      loadSuggestedArtists();
      loadSocialTokens();
      loadPerks();
      loadSuggestedDAOs();
    }
  }, [user]);

  useEffect(() => {
    //TODO: filter (by value and closeness degree)
    if (searchValue !== "" && searchValue.length > 0) {
      setFilteredSuggestedArtists(
        suggestedArtists.filter(
          a =>
            a.name?.toUpperCase().includes(searchValue.toUpperCase()) ||
            a.firstName?.toUpperCase().includes(searchValue.toUpperCase()) ||
            a.urlSlug?.toUpperCase().includes(searchValue.toUpperCase())
        )
      );
      setFilteredSocialTokens(
        socialTokens.filter(
          a =>
            a.TokenName?.toUpperCase().includes(searchValue.toUpperCase()) ||
            a.TokenSymbol?.toUpperCase().includes(searchValue.toUpperCase())
        )
      );
      setFilteredPerks(perks.filter(a => a.Description?.toUpperCase().includes(searchValue.toUpperCase())));
      setFilteredSuggestedDAOs(
        suggestedDAOs.filter(
          a =>
            a.Hashtags?.some(h => h.toUpperCase().includes(searchValue.toUpperCase())) ||
            a.Name?.toUpperCase().includes(searchValue.toUpperCase()) ||
            a.urlSlug?.toUpperCase().includes(searchValue.toUpperCase())
        )
      );
    } else {
      setFilteredSuggestedArtists(suggestedArtists);
      setFilteredSocialTokens(socialTokens);
      setFilteredPerks(perks);
      setFilteredSuggestedDAOs(suggestedDAOs);
    }
  }, [searchValue, closenessDegree]);

  const loadSuggestedArtists = async () => {
    //TODO: load suggested artists, current function is from Privi artwork
    setLoadingSuggestedArtists(true);
    axios
      .get(`${URL()}/artwork/getSuggestedArtists`)
      .then(res => {
        if (res.data.success) {
          setSuggestedArtists(res.data.data);
          setFilteredSuggestedArtists(res.data.data);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoadingSuggestedArtists(false));
  };

  const loadSocialTokens = async () => {
    setLoadingSocialTokens(true);
    // axios
    //   .get(`${URL()}/social/getSocialTokens?address=${user.address}&searchValue=${user.id}`)
    //   .then(res => {
    //     if (res.data.success) {
    //       setSocialTokens(res.data.data);
    //       setFilteredSocialTokens(res.data.data);
    //     }
    //   })
    //   .catch(err => console.log(err))
    //   .finally(() => setLoadingSocialTokens(false));
    setLoadingSocialTokens(false);
  };

  const loadPerks = async () => {
    //TODO: load perks, currently loading from a social token
    setLoadingPerks(true);
    // axios
    //   .get(`${URL()}/social/getPerks/0x3632303239383335337D31363230323938333533`)
    //   .then(res => {
    //     const resp = res.data;
    //     if (resp.success) {
    //       const newPerks = resp.data;

    //       setPerks(newPerks);
    //       setFilteredPerks(newPerks);
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
    //   .finally(() => setLoadingPerks(false));
    setLoadingPerks(false);
  };

  const loadSuggestedDAOs = async () => {
    setLoadingSuggestedDAOs(true);
    axios
      .get(`${URL()}/community/getTrendingCommunityBasicInfos`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          const data = resp.data;

          const trendingCommunities = data.trending ?? [];
          setSuggestedDAOs(trendingCommunities);
          setFilteredSuggestedDAOs(trendingCommunities);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setLoadingSuggestedDAOs(false));
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={12} md={8}>
          <GreenTitle className={classes.headerTitle}>DISCOVER</GreenTitle>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Box display="flex" alignItems="center" width={1} height={1}>
            <div className={classes.inputSearch}>
              <input
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                type="text"
                placeholder="Search"
              />
              <img src={require("assets/icons/search_gray.png")} />
            </div>
          </Box>
        </Grid>
      </Grid>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb="22px"
        className={classes.title}
        mt={6}
      >
        <h4>Suggested Artists</h4>
        {filteredSuggestedArtists?.length > 4 && (
          <span onClick={() => setViewMoreSuggestedArtists(!viewMoreSuggestedArtists)}>
            {viewMoreSuggestedArtists ? "HIDE" : "VIEW MORE"}
          </span>
        )}
      </Box>
      <LoadingWrapper theme="green" loading={loadingSuggestedArtists}>
        {filteredSuggestedArtists?.length > 0 ? (
          <Cards
            cards={filteredSuggestedArtists}
            cardType="Suggested Artist"
            heightFixed={!viewMoreSuggestedArtists}
          />
        ) : (
          <div>No items found</div>
        )}
      </LoadingWrapper>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb="22px"
        mt="80px"
        className={classes.title}
      >
        <h4 style={{ flexShrink: 0 }}>Suggested DAOs</h4>
        <span onClick={() => setViewMoreSuggestedDAOs(!viewMoreSuggestedDAOs)}>
          {viewMoreSuggestedDAOs ? "HIDE" : "VIEW MORE"}
        </span>
      </Box>
      <LoadingWrapper theme="green" loading={loadingSuggestedDAOs}>
        {filteredSuggestedDAOs?.length > 0 ? (
          <Cards cards={filteredSuggestedDAOs} cardType="Profile" heightFixed={!viewMoreSuggestedDAOs} />
        ) : (
          <div>No items found</div>
        )}
      </LoadingWrapper>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb="22px"
        mt="80px"
        className={classes.title}
      >
        <h4>Social Tokens</h4>
        {filteredSocialTokens?.length > 4 && (
          <span onClick={() => setViewMoreSocialTokens(!viewMoreSocialTokens)}>
            {viewMoreSocialTokens ? "HIDE" : "VIEW MORE"}
          </span>
        )}
      </Box>
      <LoadingWrapper theme="green" loading={loadingSocialTokens}>
        {filteredSocialTokens?.length > 0 ? (
          <Cards cards={filteredSocialTokens} cardType="Social Token" heightFixed={!viewMoreSocialTokens} />
        ) : (
          <div>No items found</div>
        )}
      </LoadingWrapper>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb="22px"
        mt="80px"
        className={classes.title}
      >
        <h4>Perks</h4>
        {filteredPerks?.length > 3 && (
          <span onClick={() => setViewMorePerks(!viewMorePerks)}>{viewMorePerks ? "HIDE" : "VIEW MORE"}</span>
        )}
      </Box>
      <LoadingWrapper theme="green" loading={loadingPerks}>
        {filteredPerks?.length > 0 ? (
          <Cards cards={filteredPerks} cardType="Perk" heightFixed={!viewMorePerks} />
        ) : (
          <div>No items found</div>
        )}
      </LoadingWrapper>
    </>
  );
}
