import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core";
import axios from "axios";

import NegotiateCard from "./components/NegotiateCard";
import AcceptedCard from "./components/AcceptedCard";
import ProjectCard from "./components/ProjectCard";

import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import Chat from "shared/ui-kit/Chat";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { Gradient } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { TabNavigation } from "shared/ui-kit";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const COLUMNS_COUNT_BREAK_POINTS = {
  767: 2,
  900: 3,
  1200: 4,
};
const GUTTER = "16px";

const useStyle = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(4),
  },
  projectBox: {},
  tabBox: {
    position: "static",
    backgroundColor: "white",
    boxShadow: "none",
    textTransform: "none",
  },
  tabItem: {
    fontSize: "1rem",
    fontWeight: theme.typography.fontWeightBold,
    boxShadow: "none !important",
    fontFamily: "Agrandir",
    textTransform: "none",
    color: "#828282",
    padding: "0px",
    marginRight: "10px",
    minWidth: "0px",
  },
  selectedTab: {
    color: "transparent",
    background: Gradient.Mint,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  dialog: {
    "& .MuiDialog-paperScrollPaper": {
      borderRadius: 16,
    },
  },
  loaderDiv: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
}));

const ProjectTabs = ["Posted Project", "Chat"];

export default function Projects(props) {
  const classes = useStyle();

  const userSelector = useSelector((state: RootState) => state.user);
  const usersInfo = useSelector((state: RootState) => state.usersInfoList);

  const [projects, setProjects] = useState([]);
  const [createProjectModal, setCreateProjectModal] = useState<boolean>(false);

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [chats, setChats] = useState<any[]>([]);
  const [chat, setChat] = useState<any>({});
  const [chatsUsers, setChatsUsers] = useState<any>({});
  const [messages, setMessages] = useState<any[]>([]);
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
    if (props.communityId) {
      setIsDataLoading(true);
      axios
        .get(`${URL()}/mediaOnCommunity/getByCommunity/${props.communityId}`)
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
  }, [props.communityId]);

  useEffect(() => {
    if (selectedTab === 1) {
      getMediaOnCommunity();
    }
  }, [selectedTab]);

  useEffect(() => {
    getProjects();
  }, [props.community]);

  const getProjects = () => {
    let communityId = props.communityId;
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
    setCreateProjectModal(false);
  };

  const handleOpenCreateProjectModal = () => {
    setCreateProjectModal(true);
  };

  const handleTabChange = value => {
    setSelectedTab(value);
  };

  return (
    <div className="projects-page">
      <TabNavigation
        tabs={ProjectTabs}
        currentTab={selectedTab}
        variant="primary"
        onTabChange={handleTabChange}
      />
      {selectedTab === 0 && (
        <Box mt={2}>
          {/* <button
            style={{
              marginBottom: 20,
            }}
            onClick={handleOpenCreateProjectModal}
          >
            Create New Project
          </button> */}
          {/* <Dialog
            className={classes.dialog}
            open={createProjectModal}
            onClose={handleCloseCreateProjectModal}
            maxWidth={"xl"}
          >
            <CreateProject
              onCloseModal={handleCloseCreateProjectModal}
              onRefreshInfo={() => props.handleRefresh()}
              item={props.community}
              itemId={props.community.id}
              itemType="Community"
              reset={createProjectModal}
            />
          </Dialog> */}
          <div className={classes.projectBox}>
            <LoadingWrapper loading={isDataLoading}>
              <>
                <MasonryGrid
                  data={filteredMedias}
                  renderItem={(item, index) =>
                    item.currentOffer?.status === "pending" ? (
                      <NegotiateCard
                        project={item}
                        user={usersInfo.find(userItem => userItem.id === item.podMediaData?.Creator)}
                        key={index}
                        acceptOffer={acceptOffer}
                        declineOffer={declineOffer}
                      />
                    ) : item.currentOffer?.status === "Accepted" ? (
                      <AcceptedCard
                        project={item}
                        user={usersInfo.find(userItem => userItem.id === item.podMediaData?.Creator)}
                        key={index}
                      />
                    ) : (
                      <ProjectCard project={item} key={`project-${index}`} />
                    )
                  }
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                  gutter={GUTTER}
                />
                {projects.length === 0 ? <p>No active projects</p> : null}
              </>
            </LoadingWrapper>
          </div>
        </Box>
      )}
      {selectedTab == 1 && (
        <Chat
          typeChat={"Community"}
          mediasOnCommunity={mediaOnCommunity}
          refreshMediasOnCommunity={() => getMediaOnCommunity()}
          medias={mediaOnCommunity}
          loader={isDataLoading}
        />
      )}
    </div>
  );
}
