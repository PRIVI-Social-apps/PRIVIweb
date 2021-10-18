import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";

import ProjectCard from "./components/ProjectCard";
import AcceptedCard from "./components/AcceptedCard";
import NegotiateCard from "./components/NegotiateCard";
import PostProject from "./modals/Post-Project/Post-project";
import { Card, TitleGrandLight, useStyles } from "../../index.styles";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import Box from "shared/ui-kit/Box";
import Chat from "shared/ui-kit/Chat";

const COLUMNS_COUNT_BREAK_POINTS = {
  767: 1,
  900: 2,
  1200: 3,
};
const GUTTER = "16px";

export default function Projects({ community, communityId, handleRefresh, trigger }) {
  const userSelector = useSelector((state: RootState) => state.user);
  const usersInfo = useSelector((state: RootState) => state.usersInfoList);

  const classes = useStyles();

  const [projects, setProjects] = useState([]);
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState<boolean>(false);

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [mediaOnCommunity, setMediaOnCommunity] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const filteredMedias = useMemo(() => {
    return [
      ...(mediaOnCommunity ? mediaOnCommunity.filter(item => item.currentOffer?.status === "pending") : []),
      ...(mediaOnCommunity ? mediaOnCommunity.filter(item => item.currentOffer?.status === "Accepted") : []),
      ...(projects || []),
    ];
  }, [mediaOnCommunity, projects]);

  const getMediaOnCommunity = () => {
    if (communityId) {
      setIsDataLoading(true);
      axios
        .get(`${URL()}/mediaOnCommunity/getByCommunity/${communityId}`)
        .then(async response => {
          if (response.data.success) {
            let data = response.data.data;
            let dataSorted = data.sort((a, b) => {
              if (!a.chat) {
                a.chat = {};
                a.chat.lastMessageDate = 0;
              } else if (a.chat && !a.chat.lastMessageDate) {
                a.chat.lastMessageDate = 0;
              }
              if (!b.chat) {
                b.chat = {};
                b.chat.lastMessageDate = 0;
              } else if (b.chat && !b.chat.lastMessageDate) {
                b.chat.lastMessageDate = 0;
              }
              return b.chat.lastMessageDate - a.chat.lastMessageDate;
            });
            setMediaOnCommunity(dataSorted);
          }
          setIsDataLoading(false);
        })
        .catch(error => {
          console.log(error);
          setIsDataLoading(false);
        });
    }
  };

  useEffect(() => {
    getProjects();
    // getMediaOnCommunity();
  }, [communityId]);

  useEffect(() => {
    if (selectedTab === 1) {
      getMediaOnCommunity();
    }
  }, [selectedTab]);

  useEffect(() => {
    getProjects();
  }, [trigger]);

  const getProjects = () => {
    setIsDataLoading(true);

    axios
      .post(`${URL()}/community/projects/getProjects/${communityId}`)
      .then(response => {
        if (response.data.success) {
          let projects = response.data.data;
          setProjects(projects);
        }
        setIsDataLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsDataLoading(false);
      });
  };

  const acceptOffer = (project: any) => {
    axios
      .get(`${URL()}/mediaOnCommunity/accept/${project.id}/${userSelector.id}`)
      .then(response => {
        if (response.data.success) {
          const newProject = response.data.data;
          setMediaOnCommunity(prev =>
            prev.map(item => {
              if (item.id !== newProject.id) {
                return item;
              }
              return { ...newProject, podMediaData: item.podMediaData };
            })
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const declineOffer = (project: any) => {
    axios
      .get(`${URL()}/mediaOnCommunity/decline/${project.id}/${userSelector.id}`)
      .then(response => {
        if (response.data.success) {
          const newProject = response.data.data;
          setMediaOnCommunity(prev =>
            prev.map(item => {
              if (item.id !== newProject.id) {
                return item;
              }
              return { ...newProject, podMediaData: item.podMediaData };
            })
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleCloseCreateProjectModal = () => {
    setOpenCreateProjectModal(false);
  };

  const handleOpenCreateProjectModal = () => {
    setOpenCreateProjectModal(true);
  };

  return (
    <Box color="white">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={7}>
        <TitleGrandLight disableUppercase bold fontSize="30px">
          Projects
        </TitleGrandLight>
        <DAOButton onClick={handleOpenCreateProjectModal}>Create new project</DAOButton>
      </Box>

      <Box display="flex" alignItems="center" mb={5} fontSize="22px">
        <Box
          className={selectedTab === 0 ? classes.selectedTab : classes.unselectedTab}
          onClick={() => setSelectedTab(0)}
          mr={5}
        >
          POSTED PROJECTS
        </Box>
        <Box
          className={selectedTab === 1 ? classes.selectedTab : classes.unselectedTab}
          onClick={() => setSelectedTab(1)}
        >
          CHAT
        </Box>
      </Box>

      {selectedTab === 0 ? (
        <LoadingWrapper loading={isDataLoading} theme="dark">
          <>
            <MasonryGrid
              data={filteredMedias}
              renderItem={(item, index) =>
                item.currentOffer?.status === "pending" ? (
                  <Card>
                    <NegotiateCard
                      project={item}
                      user={usersInfo.find(userItem => userItem.id === item.podMediaData?.Creator)}
                      key={index}
                      acceptOffer={acceptOffer}
                      declineOffer={declineOffer}
                    />
                  </Card>
                ) : item.currentOffer?.status === "Accepted" ? (
                  <Card>
                    <AcceptedCard
                      project={item}
                      user={usersInfo.find(userItem => userItem.id === item.podMediaData?.Creator)}
                      key={index}
                    />
                  </Card>
                ) : (
                  <Card>
                    <ProjectCard project={item} key={`project-${index}`} />
                  </Card>
                )
              }
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
              gutter={GUTTER}
            />
            {projects.length === 0 ? (
              <TitleGrandLight fontSize="14px">No active projects</TitleGrandLight>
            ) : null}
          </>
        </LoadingWrapper>
      ) : (
        <Chat
          typeChat={"Community"}
          mediasOnCommunity={mediaOnCommunity}
          refreshMediasOnCommunity={() => getMediaOnCommunity()}
          medias={mediaOnCommunity}
          loader={isDataLoading}
          theme="dark"
        />
      )}
      <PostProject
        open={openCreateProjectModal}
        onClose={handleCloseCreateProjectModal}
        handleRefresh={handleRefresh}
        community={community}
      />
    </Box>
  );
}
