import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal } from "@material-ui/core";

import useWindowDimensions from "shared/hooks/useWindowDimensions";
import CreatePostModal from "../../../../Communities/CommunityPage/modals/Create-Post/CreatePostModal";
import WallItem from "shared/ui-kit/Page-components/WallItem";
import Voting from "shared/ui-kit/Page-components/Voting";
import "shared/ui-kit/Modal/Modals/Modal.css";
import "./Discussions.css";
import { RootState } from "store/reducers/Reducer";
import CreateVotingModal from "shared/ui-kit/Page-components/CreateVotingModal";
import CreateNewTopicModal from "./modals/CreateNewTopicModal";
import DiscussionPage from "./DiscussionPage/DiscussionPage";

import axios from "axios";
import { default as ServerURL } from "shared/functions/getURL";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";

export default function General(props) {
  const users = useTypedSelector(state => state.usersInfoList);
  const userSelector = useSelector((state: RootState) => state.user);

  const pageDiscussionRef = useRef();

  const width = useWindowDimensions().width;

  const [displayPollsSelection, setDisplayPollsSelection] = useState<number>(0);

  const [seeAll, setSeeAll] = useState<boolean>(false);

  //modal controller
  const [openNewTopic, setOpenNewTopic] = useState<boolean>(false);
  const [discussions, setDiscussions] = useState(props.pod.Discussions);

  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const handleOpenNewTopic = () => {
    setOpenNewTopic(true);
  };

  const handleCloseNewTopic = newOne => {
    // if (newOne) {
    //   setDiscussions([newOne, ...discussions]);
    // }
    setOpenNewTopic(false);
  };

  const [openModalNewPodPost, setOpenModalNewPodPost] = useState<boolean>(false);
  const handleOpenModalNewPodPost = () => {
    setOpenModalNewPodPost(true);
  };
  const handleCloseModalNewPodPost = () => {
    props.refreshPod();
    setOpenModalNewPodPost(false);
  };

  const [createPollModal, setCreatePollModal] = useState<boolean>(false);
  const handleOpenCreatePollModal = () => {
    setCreatePollModal(true);
  };
  const handleCloseCreatePollModal = () => {
    setCreatePollModal(false);
  };

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
      <div className="discussions-tab">
        <div className="wall">
          <div className="title">
            <h3>Pod Wall</h3>
            {props.pod.PostsArray && props.pod.PostsArray.length > 5 ? (
              <button onClick={() => setSeeAll(!seeAll)} className="view-all">
                {seeAll ? "See less" : "See all"}
              </button>
            ) : null}
            {props.pod.PostsArray &&
            props.pod.PostsArray.length > 0 &&
            props.pod.Creator === userSelector.id ? (
              <PrimaryButton size="medium" onClick={handleOpenModalNewPodPost}>
                Add a post
              </PrimaryButton>
            ) : null}
          </div>
          <div className="content">
            {props.pod.PostsArray && props.pod.PostsArray.length > 0 ? (
              props.pod.PostsArray.map((item, index) => {
                if (
                  seeAll ||
                  (!seeAll &&
                    ((width >= 1440 && index < 5) ||
                      (width < 1440 && width >= 1200 && index < 4) ||
                      (width < 1200 && width >= 900 && index < 3) ||
                      (width < 900 && width >= 600 && index < 2) ||
                      (width <= 600 && index < 1)))
                )
                  return (
                    <WallItem
                      item={item}
                      imageUrl={
                        require("assets/backgrounds/social.jpeg")
                        //`${URL()}/mediaPod/wall/getPostPhoto/${item.id}`
                      }
                      Creator={item.createdBy}
                      key={`wall-item-${index}`}
                      type={"MediaPodPost"}
                      itemTypeId={props.pod.id}
                      admin={props.pod.Creator === userSelector.id}
                      handleRefresh={() => props.refreshPod()}
                      index={index}
                    />
                  );
              })
            ) : props.pod.Creator === userSelector.id ? (
              <div className={"no-content-container"}>
                <span>🕳️</span>
                <h4>No posts yet</h4>
                <PrimaryButton size="medium" onClick={handleOpenModalNewPodPost}>
                  Add a Post
                </PrimaryButton>
              </div>
            ) : null}
          </div>
        </div>
        <div className="lower-section">
          <div className="discussions">
            <div className="title">
              <h3>Discussions</h3>
            </div>

            <div className="content">
              <div>
                <div className="buttons">
                  <h4>Topics</h4>
                  <SecondaryButton size="medium" onClick={handleOpenNewTopic}>
                    Start a discussion
                  </SecondaryButton>
                  <CreateNewTopicModal
                    open={openNewTopic}
                    onClose={handleCloseNewTopic}
                    type={"MediaPod"}
                    item={props.pod}
                    createNewTopic={createNewTopic}
                  />
                </div>
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
              </div>
            </div>
          </div>

          <div className="voting">
            <div className="title">
              <h3>Voting</h3>
              <CreateVotingModal
                open={createPollModal}
                onClose={handleCloseCreatePollModal}
                onRefreshInfo={() => props.refreshPod()}
                id={props.pod.PodAddress}
                type={"Pod"}
                item={props.pod}
                title={"Create Voting"}
              />
            </div>
            <div className="content">
              {props.pod.Votings && props.pod.Votings.length > 0 ? (
                <div>
                  <div className="buttons">
                    <div>
                      {["Ongoing", "Ended", "All"].map((option, index) => (
                        <button
                          className={index === displayPollsSelection ? "selected" : undefined}
                          onClick={() => setDisplayPollsSelection(index)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <PrimaryButton size="medium" onClick={handleOpenCreatePollModal}>
                      Create a poll
                    </PrimaryButton>
                  </div>
                  <div className="polls">
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
                  </div>
                </div>
              ) : (
                <div className={"no-content-container"}>
                  <span>🕳️</span>
                  <h4>No polls yet</h4>
                  <PrimaryButton size="medium" onClick={handleOpenCreatePollModal}>
                    Create a Poll
                  </PrimaryButton>
                </div>
              )}
            </div>
          </div>
        </div>
        <CreatePostModal
          open={openModalNewPodPost}
          handleClose={handleCloseModalNewPodPost}
          podId={props.podId}
          type={"MediaPodPost"}
        />
      </div>
    );
  else return <p>Error displaying pod data</p>;
}
