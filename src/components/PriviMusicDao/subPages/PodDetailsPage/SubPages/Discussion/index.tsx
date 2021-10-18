import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import useWindowDimensions from "shared/hooks/useWindowDimensions";
import WallItem from "shared/ui-kit/Page-components/WallItem";
import Voting from "shared/ui-kit/Page-components/Voting";
import { RootState } from "store/reducers/Reducer";

import axios from "axios";
import { default as ServerURL } from "shared/functions/getURL";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Color, SecondaryButton } from "shared/ui-kit";
import DiscussionPage from "./components/DiscussionPage";
import { Grid, makeStyles } from "@material-ui/core";
import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { ArrowLeftIcon } from "components/PriviMusicDao/subPages/GovernancePage/styles";
import CreateNewVoteModal from "components/PriviMusicDao/modals/CreateNewVoteModal";
import CreateNewTopicModal from "components/PriviMusicDao/modals/CreateNewTopicModal";
import CreateNewWallPostModal from "components/PriviMusicDao/modals/CreateNewWallPostModal";

const useStyles = makeStyles(theme => ({
  fractionBox: {
    color: "white",
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    fontSize: "12px",
    background: "#7F6FFF",
  },
  title: {
    fontSize: "26px",
    fontWeight: 800,
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  header1: {
    fontSize: "12px",
    color: "grey",
  },
  header2: {
    fontSize: "16px",
    fontWeight: 400,
  },
  contentBox: {
    borderRadius: theme.spacing(1),
    background: "white",
    height: theme.spacing(70),
    textAlign: "center",
    padding: theme.spacing(2),
  },
  showAll: {
    width: "170px !important",
    border: `1px solid #65CB63 !important`,
    backgroundColor: "transparent !important",
    fontSize: "14px !important",
    color: `${Color.MusicDAODark} !important`,
    position: "relative",
  },
}));

const COLUMNS_COUNT_BREAK_POINTS = {
  767: 2,
  900: 3,
  1200: 4,
  1510: 5,
};

export default function Discussion(props) {
  const classes = useStyles();

  const users = useTypedSelector(state => state.usersInfoList);
  const userSelector = useSelector((state: RootState) => state.user);

  const pageDiscussionRef = useRef();

  const width = useWindowDimensions().width;

  const [displayPollsSelection, setDisplayPollsSelection] = useState<number>(0);

  const [seeAll, setSeeAll] = useState<boolean>(false);

  //modal controller
  const [openNewTopic, setOpenNewTopic] = useState<boolean>(false);
  const [discussions, setDiscussions] = useState<any>();

  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [openModalNewPodPost, setOpenModalNewPodPost] = useState<boolean>(false);

  const [createPollModal, setCreatePollModal] = useState<boolean>(false);

  useEffect(() => {
    if (props.podId) {
      setIsDataLoading(true);
      axios
        .get(`${URL()}/podDiscussion/getDiscussions/${props.podId}`)
        .then(res => {
          const discussionData = [...res.data.topics];
          let len = discussionData.length;
          for (let i = 0; i < len; i++) {
            let curData = discussionData[i];
            if (users && users.length > 0) {
              curData["createdByImage"] =
                users[users.findIndex(user => user.id === curData.createdBy)].imageURL;
              curData["createdByName"] = users[users.findIndex(user => user.id === curData.createdBy)].name;
            }
          }
          setDiscussions(discussionData);
          setIsDataLoading(false);
        })
        .catch(error => {
          setIsDataLoading(false);
        });
    }
  }, [props.podId, users]);

  const createNewTopic = (title, description) => {
    axios
      .post(`${ServerURL()}/podDiscussion/newChat`, {
        title,
        description,
        podId: props.podId,
        createdBy: userSelector.id,
      })
      .then(response => {
        const resp = response.data.data;
        const newDiscussionData = [{ id: resp.topicId, ...resp.topicData }, ...discussions];
        setDiscussions(newDiscussionData);
      });
  };

  if (props.pod && props.pod.PodAddress)
    return (
      <Box>
        <Box>
          <Box className={classes.flexBox} justifyContent="space-between">
            {((props.pod.PostsArray && props.pod.PostsArray.length > 0) ||
              props.pod.Creator === userSelector.id) && <h3>Wall</h3>}
            <Box className={classes.flexBox}>
              {props.pod.Creator === userSelector.id && (
                <SecondaryButton
                  size="medium"
                  onClick={() => setOpenModalNewPodPost(true)}
                  isRounded
                  style={{ border: "none", background: "#65CB63", color: "white" }}
                >
                  Create New
                </SecondaryButton>
              )}
              {props.pod.PostsArray && props.pod.PostsArray.length > 5 && (
                <SecondaryButton className={classes.showAll} size="medium" radius={29}>
                  Show All
                  <Box position="absolute" flexDirection="row" top={0} right={0} pr={2}>
                    <ArrowLeftIcon />
                  </Box>
                </SecondaryButton>
              )}
            </Box>
          </Box>
          <Box mt={2} width={1}>
            {props.pod.PostsArray && props.pod.PostsArray.length > 0 ? (
              <MasonryGrid
                data={props.pod.PostsArray.filter(
                  (_, index) =>
                    seeAll ||
                    (!seeAll &&
                      ((width >= 1440 && index < 5) ||
                        (width < 1440 && width >= 1200 && index < 4) ||
                        (width < 1200 && width >= 900 && index < 3) ||
                        (width < 900 && width >= 600 && index < 2) ||
                        (width <= 600 && index < 1)))
                )}
                renderItem={(item, index) => (
                  <Box mx={1} width={1}>
                    <WallItem
                      item={item}
                      imageUrl={
                        require("assets/backgrounds/social.jpeg")
                        //`${URL()}/mediaPod/wall/getPostPhoto/${item.id}`
                      }
                      Creator={(item as any).createdBy}
                      key={`wall-item-${index}`}
                      type={"MediaPodPost"}
                      itemTypeId={props.pod.id}
                      admin={props.pod.Creator === userSelector.id}
                      handleRefresh={() => props.refreshPod()}
                      index={index}
                    />
                  </Box>
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                gutter={"36px"}
              />
            ) : (
              props.pod.Creator === userSelector.id && (
                <Box className={"no-content-container"}>
                  <Box mt={2}>No posts yet</Box>
                </Box>
              )
            )}
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7} md={8}>
            <Box>
              <Box className={classes.flexBox} justifyContent="space-between">
                <h4>Threads</h4>
                <SecondaryButton
                  size="medium"
                  onClick={() => setOpenNewTopic(true)}
                  isRounded
                  style={{ border: "none", background: "#2D3047", color: "white" }}
                >
                  Start Discussion
                </SecondaryButton>
              </Box>
              <Box className={classes.contentBox}>
                <LoadingWrapper loading={isDataLoading}>
                  <DiscussionPage
                    discussions={discussions}
                    postType="mediaPod"
                    podId={props.podId}
                    key={props.podId}
                    pageDiscussionRef={pageDiscussionRef}
                    createNewTopic={createNewTopic}
                  />
                </LoadingWrapper>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={5} md={4}>
            <Box className={classes.flexBox} justifyContent="space-between">
              <h3>Polls</h3>
              <SecondaryButton
                size="medium"
                onClick={() => setCreatePollModal(true)}
                isRounded
                style={{ border: "none", background: "#7F6FFF", color: "white" }}
              >
                Create New
              </SecondaryButton>
            </Box>
            <Box className={classes.contentBox}>
              {props.pod.Votings && props.pod.Votings.length > 0 ? (
                <Box>
                  <Box className="buttons">
                    <Box>
                      {["Ongoing", "Ended", "All"].map((option, index) => (
                        <button
                          className={index === displayPollsSelection ? "selected" : undefined}
                          onClick={() => setDisplayPollsSelection(index)}
                        >
                          {option}
                        </button>
                      ))}
                    </Box>
                  </Box>
                  <Box className="polls">
                    {props.pod.Votings.filter(poll =>
                      displayPollsSelection === 0
                        ? new Date().getTime() < new Date(poll.EndingDate).getTime()
                        : displayPollsSelection === 1
                        ? new Date().getTime() >= new Date(poll.EndingDate).getTime()
                        : poll !== undefined
                    ).map((item, index) => {
                      if (item.OpenVotation) {
                        return (
                          <Voting
                            item={item}
                            itemType={"MediaPod"}
                            itemId={props.pod.PodAddress}
                            onRefreshInfo={() => props.refreshPod()}
                            key={`${index}-poll`}
                          />
                        );
                      } else return null;
                    })}
                  </Box>
                </Box>
              ) : (
                <Box className={classes.flexBox} justifyContent="center" height={1}>
                  <Box mt={2}>No polls yet</Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
        {openNewTopic && (
          <CreateNewTopicModal
            open={openNewTopic}
            onClose={() => setOpenNewTopic(false)}
            createNewTopic={createNewTopic}
          />
        )}
        {createPollModal && (
          <CreateNewVoteModal
            handleClose={() => setCreatePollModal(false)}
            open={createPollModal}
            isVotation
          />
        )}
        {openModalNewPodPost && (
          <CreateNewWallPostModal
            handleClose={() => setOpenModalNewPodPost(false)}
            open={openModalNewPodPost}
          />
        )}
      </Box>
    );
  else return <p>Error displaying pod data</p>;
}
