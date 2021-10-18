import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Ticker from "react-ticker";
import styled from "styled-components";

import { CollabPageWrapper, Title, TitleWrapper, TooltipWrapper, TikerWrapper } from "./styled";
import ProjectCard from "./components/ProjectCard";
import { RootState, useTypedSelector } from "store/reducers/Reducer";
import { Filters } from "./components/filters";

import URL from "shared/functions/getURL";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import { GenericGrid } from "shared/ui-kit/GenericGrid/GenericGrid";
import { HeaderTitle } from "shared/ui-kit/Header/components/HeaderTitle";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { SearchIcon } from "shared/ui-kit/Icons/searchIcon";
import CreateCollabModal from "./modals/CreateCollabModal";

import "./Collab.css";

import placeholderAvatarTwitter from "assets/snsIcons/twitter_round.png";

const displayOptions = ["All Collabs", "My Collabs"];
const sortByOptions = ["Most Liked", "Recent"];

const columnsCountBreakPoints = { 1400: 4, 1000: 3, 650: 2 };
export default function Collab() {
  //store
  const users = useSelector((state: RootState) => state.usersInfoList);
  const user = useTypedSelector(state => state.user);

  //hooks
  const [allCollabs, setAllCollabs] = useState<any[]>([]);
  const [trendingCollabs, setTrendingCollabs] = useState<any[]>([]);
  const [trendingCollabsLoading, setTrendingCollabsLoading] = useState<boolean>(true);
  const [filterCollabsLoading, setFilterCollabsLoading] = useState<boolean>(true);
  const [tickerMove, setTickerMove] = useState<boolean>(true);

  // filter/sort options
  const [displaySelection, setDisplaySelection] = useState<string>(displayOptions[0]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortBySelection, setSortBySelection] = useState<string>(sortByOptions[0]);

  const [createCollabModal, setOpenCreateCollabModal] = useState<boolean>(false);

  useEffect(() => {
    if (users.length > 0) {
      loadTrendingCollabsData();
    }
  }, [users]);

  useEffect(() => {
    loadFilterCollabsData();
  }, [displaySelection, searchValue, sortBySelection, user, users]);

  //functions
  const loadTrendingCollabsData = () => {
    setTrendingCollabsLoading(true);
    const config = {
      params: {
        userId: user.id,
        searchValue: searchValue,
        displaySelection: displaySelection,
        sortSelection: sortBySelection,
      },
    };
    axios
      .get(`${URL()}/collab/getTrendingCollabs`, config)
      .then(res => {
        setTrendingCollabsLoading(false);
        const resp = res.data;
        if (resp.success) {
          const data = resp.data;
          const newTrendingCollabs = data.trendingCollabs;

          // TRENDING COLLABS
          newTrendingCollabs.forEach((collab, index) => {
            if (users.some(user => collab.Creator === user.id)) {
              const thisUser = users[users.findIndex(user => collab.Creator === user.id)];
              newTrendingCollabs[index]["userName"] = thisUser.name;
              newTrendingCollabs[index]["userImageURL"] = thisUser.imageURL;
              newTrendingCollabs[index]["userSlug"] =
                thisUser.urlSlug !== "" ? thisUser.urlSlug : thisUser.name;
            }
            //add images and name to collaborators
            newTrendingCollabs[index].CollaboratorsData = [];
            collab.Collaborators.forEach((collaboratorObj: any) => {
              // privi user
              if (!collaboratorObj.fromTwitter) {
                const collabUser = users.find(user => collaboratorObj.id === user.id);
                if (collabUser) {
                  newTrendingCollabs[index].CollaboratorsData.push({
                    userId: collaboratorObj.id,
                    userName: collabUser.name,
                    userImageURL: collabUser.imageURL,
                    userSlug: collabUser.urlSlug !== "" ? collabUser.urlSlug : collabUser.name,
                  });
                }
              }
              // add image and name for external twitter collaborators
              else {
                newTrendingCollabs[index].CollaboratorsData.push({
                  userId: collaboratorObj.id,
                  userName: collaboratorObj.id,
                  userImageURL: placeholderAvatarTwitter,
                  userSlug: collaboratorObj.id,
                  isTwitterUser: true,
                });
              }
            });
          });
          setTrendingCollabs(
            newTrendingCollabs.filter(item => item.CollaboratorsData && item.CollaboratorsData.length > 0)
          );
        }
      })
      .catch(error => {
        setTrendingCollabsLoading(true);
        console.error(error);
      });
  };

  const loadFilterCollabsData = () => {
    setFilterCollabsLoading(true);
    const config = {
      params: {
        userId: user.id,
        searchValue: searchValue,
        displaySelection: displaySelection,
        sortSelection: sortBySelection,
      },
    };
    axios
      .get(`${URL()}/collab/getAllCollabs`, config)
      .then(res => {
        setFilterCollabsLoading(false);
        const resp = res.data;
        if (resp.success) {
          const data = resp.data;
          const newAllCollabs = data.allCollabs;

          // ALL COLLABS
          newAllCollabs.forEach((collab, index) => {
            if (users.some(user => collab.Creator === user.id)) {
              const thisUser = users[users.findIndex(user => collab.Creator === user.id)];
              newAllCollabs[index]["userName"] = thisUser.name;
              newAllCollabs[index]["userImageURL"] = thisUser.imageURL;
              newAllCollabs[index]["userSlug"] = thisUser.urlSlug !== "" ? thisUser.urlSlug : thisUser.name;
            }
            //add images and name to collaborators
            newAllCollabs[index].CollaboratorsData = [];
            collab.Collaborators.forEach(collaboratorObj => {
              // privi user
              if (!collaboratorObj.fromTwitter) {
                const collabUser = users.find(user => collaboratorObj.id === user.id);
                if (collabUser) {
                  newAllCollabs[index].CollaboratorsData.push({
                    userId: collaboratorObj.id,
                    userName: collabUser.name,
                    userImageURL: collabUser.imageURL,
                    userSlug: collabUser.urlSlug !== "" ? collabUser.urlSlug : collabUser.name,
                  });
                }
              }
              // add image and name for external twitter collaborators
              else {
                newAllCollabs[index].CollaboratorsData.push({
                  userId: collaboratorObj.id,
                  userName: collaboratorObj.id,
                  userImageURL: placeholderAvatarTwitter,
                  userSlug: collaboratorObj.id,
                  isTwitterUser: true,
                });
              }
            });
            // add random color to collab
            newAllCollabs[index].mine =
              newAllCollabs[index].Collaborators &&
              newAllCollabs[index].Collaborators.find(collabObj => collabObj.id == user.id);
          });

          setAllCollabs(
            newAllCollabs.filter(item => item.CollaboratorsData && item.CollaboratorsData.length > 0)
          );
        }
      })
      .catch(error => {
        setFilterCollabsLoading(true);
        console.error(error);
      });
  };

  const handleSearchValue = e => {
    setSearchValue(e.target.value);
  };

  const handleOpenShareCollabModal = () => {
    setOpenCreateCollabModal(true);
  };
  const handleCloseShareCollabModal = () => {
    setOpenCreateCollabModal(false);
  };

  return (
    <CollabPageWrapper className="collab-page">
      <div className="content" id="scrollableDivCommunities">
        <HeaderTitle title="Collabs" subtitle={`The place where you can create and monetize your content!`} />
        <CreateContainer>
          <InputWrapper>
            <Input
              type={"text"}
              placeholder={"Search by Artist, name, tag"}
              onChange={handleSearchValue}
              defaultValue={""}
            />
            <StyledSearchIcon />
          </InputWrapper>
          <Flex>
            <CreateButton onClick={handleOpenShareCollabModal}>
              <span>+Create</span>
            </CreateButton>
          </Flex>
        </CreateContainer>
        <div className="trending">
          <TitleWrapper>
            <Title>
              <span>
                🔥 Trending Collabs
                <TooltipWrapper>
                  <InfoTooltip tooltip="Suggest collabs between your <b>favourite</b> creators" />
                </TooltipWrapper>
              </span>
            </Title>
          </TitleWrapper>
          <TikerWrapper>
            <LoadingWrapper loading={trendingCollabsLoading}>
              {trendingCollabs.length > 0 ? (
                <Ticker direction="toLeft" move={tickerMove}>
                  {({ index }) => (
                    <div
                      onMouseOver={() => {
                        setTickerMove(false);
                      }}
                      onMouseLeave={() => {
                        setTickerMove(true);
                      }}
                      className={"collab-cards"}
                    >
                      {trendingCollabs.map((item, index) => {
                        return (
                          <ProjectCard
                            trending={true}
                            project={item}
                            key={`${index}-trending-project-card`}
                          />
                        );
                      })}
                    </div>
                  )}
                </Ticker>
              ) : (
                <div className="no-pods">No allCollabs to show</div>
              )}
            </LoadingWrapper>
          </TikerWrapper>
        </div>

        <Filters
          displaySelection={displaySelection}
          setDisplaySelection={setDisplaySelection}
          displayOptions={displayOptions}
          setSortBySelection={setSortBySelection}
          sortBySelection={sortBySelection}
          sortByOptions={sortByOptions}
        />

        {/* ALL COLLABS */}
        <div className="collab-cards">
          <LoadingWrapper loading={filterCollabsLoading}>
            {allCollabs.length > 0 && (
              <GenericGrid columnsCountBreakPoints={columnsCountBreakPoints}>
                {allCollabs.map((item, index) => (
                  <ProjectCard project={item} key={`${index}-project-card`} isMine={item.mine} />
                ))}
              </GenericGrid>
            )}
          </LoadingWrapper>
        </div>
      </div>
      <CreateCollabModal
        open={createCollabModal}
        handleRefresh={loadFilterCollabsData}
        handleClose={handleCloseShareCollabModal}
      />
    </CollabPageWrapper>
  );
}

const CreateContainer = styled.div`
  margin-top: 48px;
  margin-bottom: 72px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const CreateButton = styled.button`
  background: #000;
  height: auto;
  padding: 8px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
  color: #fff;
  display: flex;
  align-items: center;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const InputWrapper = styled.div`
  color: #99a1b3;
  position: relative;
  max-width: 470px;
  width: 100%;
  height: 36px;
  margin-right: 12px;
  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
  }
`;

const Input = styled.input`
  height: 100%;
  border: 1px solid #707582;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 0 20px;
  width: 100%;
  font-size: 14px;
  color: currentColor;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #99a1b3;
    font-size: 14px;
  }
`;

const StyledSearchIcon = styled(SearchIcon)`
  width: 17px;
  height: 17px;
  & > path {
    fill: #181818;
  }
`;