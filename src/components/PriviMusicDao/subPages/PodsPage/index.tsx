import React, { useEffect, useState, useRef } from "react";
import { ShortArrowIcon } from "../../components/Icons/SvgIcons";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { podsPageStyles } from "./index.styles";
import PodCard from "components/PriviMusicDao/components/Cards/PodCard";
import { Grid } from "@material-ui/core";
import styled from "styled-components";
import CreatePodModal from "components/PriviMusicDao/modals/CreatePodModal/CreatePodModal";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularLoadingIndicator } from "shared/ui-kit";
import { musicDaoGetTrendingPods, musicDaoGetPods } from "shared/services/API"

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

export default function PodsPage() {
  const classes = podsPageStyles();
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);

  const [trendingPods, setTrendingPods] = useState<any[]>([]);
  const [pods, setPods] = useState<any[]>([]);

  // pagination
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const lastIdRef = useRef<string>("");

  // load trending pods
  useEffect(() => {
    musicDaoGetTrendingPods().then(resp => {
      if (resp?.success) setTrendingPods(resp.data);
    })
  }, []);

  // load pods for next page
  const loadMore = () => {
    setIsLoading(true);
    musicDaoGetPods(lastIdRef.current).then(resp => {
      setIsLoading(false);
      if (resp?.success) {
        const data = resp.data;
        const nextPagePods = data.pods;
        setHasMore(data.hasMore ?? false);
        setPods([...pods, ...nextPagePods]);
        lastIdRef.current = nextPagePods.length ? nextPagePods[nextPagePods.length - 1].PodAddress : "";
      }
    })
  }

  return (
    <Box className={classes.content} id={"scrollContainer"}>
      <img src={require("assets/musicDAOImages/background.png")} className={classes.gradient} />
      <img src={require("assets/musicDAOImages/music-green1.png")} className={classes.green1} />
      <img src={require("assets/musicDAOImages/music-green2.png")} className={classes.green2} />
      <Box
        className={classes.flexBox}
        width={1}
        justifyContent="center"
        flexDirection="column"
        mt={2}
        zIndex={1}
      >
        <Box className={classes.headerTitle}>
          <b>Music</b> Pods
        </Box>
        <Box className={classes.header2} mb={2} color="white">
          <b>Stake privi</b>, get songs to upload and earn a share
          <br /> of the funds when the song is claimed by artist.
        </Box>
        <PrimaryButton size="medium" onClick={() => setOpenCreateModal(true)} isRounded style={{ background: "#2D3047" }}>
          Create new Pod
        </PrimaryButton>
      </Box>
      <Box mt={6} zIndex={1}>
        <Box className={classes.flexBox} justifyContent="space-between" mb={2}>
          <Box className={classes.header1} color="#404658">
            Trending
          </Box>
          <Box className={classes.flexBox} justifyContent="center">
            <Box className={classes.secondButtonBox} onClick={() => { }}>
              <Box className={classes.header3} color="#2D3047">
                Show All
              </Box>
              <Box style={{ transform: `rotate(90deg)` }} className={classes.flexBox} ml={3}>
                <ShortArrowIcon color="#2D3047" />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box mt={4}>
          <Grid container spacing={2} wrap="wrap">
            {trendingPods.map((pod, index) => (
              <Grid key={`trending-pods-${index}`} item sm={12} md={6} lg={3}>
                <PodCard pod={pod} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box className={classes.flexBox} justifyContent="space-between" mt={6} mb={2}>
          <Box className={classes.header1} color="#404658">
            All
          </Box>
          <Box className={classes.flexBox} justifyContent="center">
            <Box className={classes.secondButtonBox} onClick={() => { }}>
              <Box className={classes.header3} color="#2D3047">
                Show All
              </Box>
              <Box style={{ transform: `rotate(90deg)` }} className={classes.flexBox} ml={3}>
                <ShortArrowIcon color="#2D3047" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <InfiniteScroll
        hasChildren={pods.length > 0}
        dataLength={pods.length}
        scrollableTarget={"scrollContainer"}
        next={loadMore}
        hasMore={hasMore}
        loader={
          isLoading && (
            <LoadingIndicatorWrapper>
              <CircularLoadingIndicator />
            </LoadingIndicatorWrapper>
          )
        }
      >
        <Box mt={4}>
          <Grid container spacing={2} wrap="wrap">
            {pods.map((pod, index) => (
              <Grid key={`trending-pods-${index}`} item sm={12} md={6} lg={3}>
                <PodCard pod={pod} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </InfiniteScroll>

      {openCreateModal && (
        <CreatePodModal
          onClose={() => setOpenCreateModal(false)}
          type={"Digital NFT"}
          handleRefresh={() => { }}
          open={openCreateModal}
        />
      )}
    </Box>
  );
}
