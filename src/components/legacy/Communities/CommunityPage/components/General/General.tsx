import React, { useState, useEffect } from "react";
import axios from "axios";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { connect, useSelector } from "react-redux";
import "./General.css";
import CalendarItem from "./components/CalendarItem";
import PollItem from "./components/PollItem";
import ProposalItem from "./components/ProposalItem";
import CalendarModal from "../../modals/Calendar/CalendarModal";
import { Dialog, Grid } from "@material-ui/core";
import CreateDaoProposal from "../../modals/Create-Dao-Proposal/Create-dao-proposal";
import CreateVotingModal from "shared/ui-kit/Page-components/CreateVotingModal";
import ViewAllVotingModal from "shared/ui-kit/Page-components/ViewAllVotingModal";
import URL from "shared/functions/getURL";
import ContributionCard from "./components/ContributionCard";
import { Header4, HeaderBold3, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

import AcquisitionCard from "../Acquisitions/components/AcquisitionCard";
import MemberItem from "./components/MemberItem";
import { RootState } from "../../../../../../store/reducers/Reducer";
import AddEventModal from "../../modals/Calendar/AddEvent";
import FilterButtonGroup from "./components/FilterButtonGroup";
import AirdropProposal from "../VestingTaxation/components/AirdropProposal";
import AllocationProposal from "../VestingTaxation/components/AllocationProposal";
import TransferProposal from "../Treasury/components/TransferProposal";
import MembersProposal from "../Members/components/MembersProposal";

import styled from "styled-components";
import { VirtualizedMasnory } from "shared/ui-kit/VirtualizedMasnory";
import { getMemberMediaAcquisitionProposals } from "shared/services/API";

const equal = require("deep-equal");

const arePropsEqual = (prevProps, currProps) => {
  return (
    JSON.stringify(prevProps.community) === JSON.stringify(currProps.community) &&
    equal(prevProps.user, currProps.user) &&
    JSON.stringify(prevProps.users) === JSON.stringify(currProps.users)
  );
};

const COLUMNS_COUNT_BREAK_POINTS = {
  375: 1,
  767: 2,
  900: 3,
  1200: 4,
  1510: 5,
};
const GUTTER = "16px";

const CommunityProposalType = {
  communityCreation: "CommunityCreation",
  communityTokenCreation: "CommunityTokenCreation",
  communityAirdrop: "CommunityAirdrop",
  communityAllocation: "CommunityAllocation",
  communityTransfer: "CommunityTransfer",
  communityBid: "CommunityBid",
  communityBuyOrder: "CommunityBuyOrder",
  communityBuying: "CommunityBuying",
  communityExchange: "CommunityExchange",
  communityTreasurer: "CommunityTreasurer",
  communityEjectTreasurer: "CommunityEjectTreasurer",
  communityJoiningRequest: "CommunityJoiningRequest",
  communityEjectMember: "CommunityEjectMember",
  proposal: "Proposal",
};

type OpenDetailView = "proposal" | "poll" | "calendar" | "message";

const ProposalFilters = ["All", "Ended", "Ongoing", "Voted", "Didn’t vote", "Following"];
const PollFilters = ["All", "Ended", "Ongoing", "Voted", "Didn’t vote"];

const General = React.memo((props: any) => {
  let userSelector = useSelector((state: RootState) => state.user);

  const [calendar, setCalendar] = useState<any[]>([]);
  const [weeklyCalendar, setWeeklyCalendar] = useState<any[]>([]);
  const [communityWall, setCommunityWall] = useState<any[]>([]);
  const [community, setCommunity] = useState<any>({});
  const [stories, setStories] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [votingsPoll, setVotingsPoll] = useState<any[]>([]);
  const [filteredVotingsPoll, setFilteredVotingsPoll] = useState<any[]>([]);
  const [selectedVotings, setSelectedVotings] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [viewIndex, setViewIndex] = useState<number>(5);
  const [voters, setVoters] = useState<any[]>([]);
  const [ongoingAcquisitionProposals, setOngingAcquisitionProposals] = useState<any[]>([]);

  const [openViewAll, setOpenViewAll] = useState<OpenDetailView | null>(null);
  const [filter, setFilter] = useState<string>(PollFilters[0]);

  const [openCalendarModal, setOpenCalendarModal] = useState<boolean>(false);
  const [addEventModal, setAddEventModal] = useState<boolean>(false);
  const [createDaoProposalModal, setCreateDaoProposalModal] = useState<boolean>(false);
  const [createPollModal, setCreatePollModal] = useState<boolean>(false);
  const [viewAllVotingModal, setViewAllVotingModal] = useState<boolean>(false);

  const [hasMore, setHasMore] = useState<boolean>(false);
  const [lastId, setLastId] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [hasMoreVote, setHasMoreVote] = useState<boolean>(false);
  const [voteLastId, setVoteLastId] = useState<any>();
  const [isVoteLoading, setIsVoteLoading] = useState<boolean>(false);

  useEffect(() => {
    setCommunity(props.community);
    if (props.user) {
      axios.get(`${URL()}/voting/getVotersByUserAddress/${props.user.id}`).then(res => {
        if (res.data.success) {
          setVoters(res.data.data.voters || []);
        }
      });
    }

    let membersTreasurersFoundersArray: any[] = [];
    let members = Object.keys(props.community.MembersMap || {}) || [];
    let treasurers = Object.keys(props.community.TreasurersMap || {}) || [];
    let founders = Object.keys(props.community.FoundersMap || {}) || [];

    if (members.length > 0) {
      for (let member of members) {
        membersTreasurersFoundersArray.push(props.community.MembersMap[member]);
      }
    }
    if (treasurers.length > 0) {
      for (let treasurer of treasurers) {
        membersTreasurersFoundersArray.push(props.community.TreasurersMap[treasurer]);
      }
    }
    if (founders.length > 0) {
      for (let founder of founders) {
        membersTreasurersFoundersArray.push(props.community.FoundersMap[founder]);
      }
    }
    membersTreasurersFoundersArray = membersTreasurersFoundersArray
      .filter(user => user.Address !== userSelector.address)
      .sort((a, b) =>
        a.Timestamp && b.Timestamp && a.Timestamp > b.Timestamp
          ? 1
          : a.Timestamp && b.Timestamp && b.Timestamp > a.Timestamp
          ? -1
          : 0
      );

    setMembers(membersTreasurersFoundersArray);
  }, [props.community]);

  useEffect(() => {
    setContributions([...(community.Contributions || []).filter(contribution => contribution.fromUserId)]);
  }, [community]);

  useEffect(() => {
    if (community) {
      const p = [...(community.PostsArray || "")];

      let wallPosts = p.filter(post => post.selectedFormat === 1);
      let stories = p.filter(post => post.selectedFormat === 0);

      let timeStamp = Math.round(new Date().getTime() / 1000);
      let timeStampYesterday = timeStamp - 24 * 3600;
      for (const { index, value } of stories.map((value, index) => ({
        index,
        value,
      }))) {
        let is24 = value.createdAt >= new Date(timeStampYesterday * 1000).getTime();
        if (!is24) {
          stories.splice(index, 1);
        }
      }

      //set all images
      if (props.users && props.users.length > 0) {
        props.users.forEach(user => {
          p.forEach((post, index) => {
            if (user.id === post.createdBy) {
              p[index].userImageURL = user.imageURL;
              p[index].userName = user.name;
            }
          });
          /*pr.forEach((proposal, index) => {
            if (user.id === proposal.Creator) {
              pr[index].userImageURL = user.imageURL;
              pr[index].userName = user.name;
            }
          });*/
          stories.forEach((story, index) => {
            if (user.id === story.Creator) {
              stories[index].userImageURL = user.imageURL;
              stories[index].userName = user.name;
            }
          });
        });
      }

      let votings: any[] = [];
      if (community.Votings && community.Votings.length > 0) {
        votings = community.Votings.filter(voting => voting.Type === "regular");
      }

      setCommunityWall(wallPosts);
      setStories(stories);
      setProposals(community.Proposals);
      setFilteredProposals(community.Proposals);
      setVotingsPoll(votings);
      setFilteredVotingsPoll(votings);
      setViewIndex(5);
      loadAcquisitions();
    }
  }, [community, props.users, props.user]);

  //sort calendar
  useEffect(() => {
    let sortedCalendar = [] as any[];

    if (community.Events) {
      sortedCalendar = [...community.Events];
    }

    if (props.users && props.users.length > 0) {
      sortedCalendar.forEach((event, index) => {
        if (props.users.some(user => user.id === event.Creator)) {
          const thisUser = props.users[props.users.findIndex(user => user.id === event.Creator)];
          sortedCalendar[index].creatorInfo = {
            name: thisUser.name,
            imageURL: thisUser.imageURL,
          };
        }
      });
    }

    sortedCalendar.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

    setCalendar(sortedCalendar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community.Events, props.users, community.Creator]);

  useEffect(() => {
    if (openViewAll === "proposal") {
      setLastId(undefined);
      setHasMore(true);
      setFilteredProposals([]);
      loadDaoProposals(true);
    } else {
      setFilteredProposals(proposals);
    }
    if (openViewAll === "poll") {
      setVoteLastId(undefined);
      setHasMoreVote(true);
      setFilteredVotingsPoll([]);
      loadVotings(true);
    } else {
      setFilteredVotingsPoll(votingsPoll);
    }
  }, [filter, openViewAll]);

  const loadDaoProposals = (reset = false) => {
    if (!isLoading) {
      setIsLoading(true);
      const config = {
        params: {
          communityId: community.CommunityAddress,
          userAddress: userSelector?.address,
          filter: filter,
          lastId: lastId,
        },
      };
      axios
        .get(`${URL()}/community/getProposals/v2`, config)
        .then(res => {
          if (res.data.success) {
            setFilteredProposals(prev => [...prev, ...res.data.data.data]);
            setHasMore(res.data.data.hasMore);
            setLastId(res.data.data.lastId);
          } else {
            setHasMore(false);
            setLastId(undefined);
          }
          setIsLoading(false);
        })
        .catch(e => {
          setHasMore(false);
          setLastId(undefined);
          setIsLoading(false);
        });
    }
  };

  const loadVotings = (reset = false) => {
    if (!isVoteLoading) {
      setIsVoteLoading(true);
      const config = {
        params: {
          communityId: community.CommunityAddress,
          userAddress: userSelector?.id,
          filter: filter,
          lastId: reset ? undefined : voteLastId,
        },
      };
      axios
        .get(`${URL()}/community/getVotings`, config)
        .then(res => {
          if (res.data.success) {
            setFilteredVotingsPoll(prev => [...prev, ...res.data.data.data]);
            setHasMoreVote(res.data.data.hasMore);
            setVoteLastId(res.data.data.lastId);
          } else {
            setHasMoreVote(false);
            setVoteLastId(undefined);
          }
          setIsVoteLoading(false);
        })
        .catch(e => {
          setHasMoreVote(false);
          setVoteLastId(undefined);
          setIsVoteLoading(false);
        });
    }
  };

  const loadAcquisitions = async () => {
    if (community.CommunityAddress) {
      // load member media acquisition proposals
      const newOngingProposals: any = [];
      const resp1 = await getMemberMediaAcquisitionProposals(community.CommunityAddress);
      if (resp1?.success) {
        const data = resp1.data;
        data.forEach(datum => {
          switch (datum?.Result) {
            case "pending":
              newOngingProposals.push(datum);
              break;
            case "declined":
              break;
          }
        });
      }
      setOngingAcquisitionProposals(newOngingProposals);
    }
  };

  const handleOpenCalendarModal = () => {
    setOpenCalendarModal(true);
  };

  const handleCloseCalendarModal = () => {
    setOpenCalendarModal(false);
  };

  const handleOpenAddEventModal = () => {
    setAddEventModal(true);
  };

  const handleCloseAddEventModal = () => {
    setAddEventModal(false);
  };

  const handleOpenCreateDaoProposalModal = () => {
    setCreateDaoProposalModal(true);
  };

  const handleCloseCreateDaoProposalModal = () => {
    setCreateDaoProposalModal(false);
  };

  const handleOpenCreatePollModal = () => {
    setCreatePollModal(true);
  };

  const handleCloseCreatePollModal = () => {
    setCreatePollModal(false);
  };

  const handleOpenViewAllVotingModal = () => {
    setViewAllVotingModal(true);
  };

  const handleCloseViewAllVotingModal = () => {
    setViewAllVotingModal(false);
  };

  const handleMoreView = () => {
    setViewIndex(prev => prev + 5);
  };

  const handleViewAllProposals = () => {
    setOpenViewAll("proposal");
  };

  const handleViewAllPolls = () => {
    setOpenViewAll("poll");
  };

  const handleViewAllCalendars = () => {
    setOpenCalendarModal(false);
    setOpenViewAll("calendar");
  };

  const handleViewAllMessages = () => {
    setOpenViewAll("message");
  };

  const handleCloseViewAll = () => {
    setOpenViewAll(null);
  };

  const getProperProposalItem = (item, index) => {
    switch (item.ProposalType) {
      case CommunityProposalType.communityAirdrop:
        return (
          <Card key={index}>
            <AirdropProposal proposal={item} />
          </Card>
        );
      case CommunityProposalType.communityAllocation:
        return (
          <Card key={index}>
            <AllocationProposal proposal={item} />
          </Card>
        );
      case CommunityProposalType.communityTransfer:
        return (
          <Card key={index}>
            <TransferProposal proposal={item} handleRefresh={() => props.handleRefresh()} />
          </Card>
        );
      case CommunityProposalType.communityTreasurer:
      case CommunityProposalType.communityEjectTreasurer:
      case CommunityProposalType.communityEjectMember:
        return (
          <Card key={index}>
            <MembersProposal proposal={item} handleRefresh={() => props.handleRefresh()} />
          </Card>
        );

      default:
        return (
          <ProposalItem
            key={index}
            version={2}
            item={item}
            onRefreshInfo={() => props.handleRefresh()}
            itemId={community.id}
            itemType="Community"
            voters={voters}
          />
        );
    }
  };

  return (
    <div className="general founders">
      {openViewAll ? (
        <>
          <Box
            className="back-button"
            display="flex"
            flexDirection="row"
            alignItems="center"
            onClick={handleCloseViewAll}
            mt={7}
            mb={3}
          >
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path
                d="M6 1L1 6L6 11"
                stroke="#181818"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Header4 noMargin>Back</Header4>
          </Box>
          {openViewAll === "proposal" && (
            <>
              <HeaderBold3>DAO Proposals</HeaderBold3>
              <FilterButtonGroup
                marginTop={3}
                marginBottom={8}
                categories={ProposalFilters}
                selected={filter}
                onSelectCategory={setFilter}
              />
              {(filteredProposals && filteredProposals.length) || isLoading ? (
                <VirtualizedMasnory
                  list={filteredProposals}
                  loadMore={loadDaoProposals}
                  hasMore={hasMore}
                  scrollElement={document.getElementsByClassName("content-wrapper")[0]}
                  itemRender={getProperProposalItem}
                />
              ) : (
                <div>No Results</div>
              )}
            </>
          )}
          {openViewAll === "poll" && (
            <>
              <HeaderBold3>Polls</HeaderBold3>
              <FilterButtonGroup
                marginTop={3}
                marginBottom={8}
                categories={PollFilters}
                selected={filter}
                onSelectCategory={setFilter}
              />
              {(filteredVotingsPoll && filteredVotingsPoll.length) || isVoteLoading ? (
                <VirtualizedMasnory
                  list={filteredVotingsPoll}
                  loadMore={loadVotings}
                  hasMore={hasMoreVote}
                  scrollElement={document.getElementsByClassName("content-wrapper")[0]}
                  itemRender={(item, index) => (
                    <PollItem
                      version={3}
                      item={item}
                      key={`${index}-poll`}
                      itemType={"Community"}
                      itemId={community.id}
                      onRefreshInfo={() => props.handleRefresh()}
                    />
                  )}
                />
              ) : (
                <div>No Results</div>
              )}
            </>
          )}
          {openViewAll === "calendar" && (
            <>
              <HeaderBold3>Calendar</HeaderBold3>
              <Grid container spacing={3} wrap="wrap">
                {calendar.map((item, index) => (
                  <Grid key={`${index}-event`} item md={4}>
                    <div className="container">
                      <CalendarItem item={item} />
                    </div>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
          {openViewAll === "message" && (
            <>
              <HeaderBold3>Messages</HeaderBold3>
              <Grid container spacing={3} wrap="wrap">
                {contributions.map((item, index) => (
                  <Grid key={`contribution-card-${index}`} item md={4}>
                    <ContributionCard
                      item={item}
                      community={community}
                      updateCommunity={newCommunity => setCommunity(newCommunity)}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </>
      ) : (
        <>
          <div className="third-row">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <div className="generalHeaderBox">
                  <b>New DAO Proposal</b>
                  {/*props.isFounder && (
                <PrimaryButton
                  size="small"
                  onClick={handleOpenCreateDaoProposalModal}
                  className={"create_button"}
                >
                  Create
                </PrimaryButton>
              )*/}
                </div>
                <div className="headerCommunityPageCards">
                  {createDaoProposalModal && (
                    <Dialog
                      className="modalCreateModal"
                      open={createDaoProposalModal}
                      onClose={handleCloseCreateDaoProposalModal}
                      fullWidth={true}
                      maxWidth={"md"}
                    >
                      <CreateDaoProposal
                        onCloseModal={handleCloseCreateDaoProposalModal}
                        onRefreshInfo={() => props.handleRefresh()}
                        item={community}
                        itemId={community.id}
                        itemType="Community"
                      />
                    </Dialog>
                  )}
                </div>
                <div className="container-content">
                  {proposals && proposals.length > 0 ? (
                    proposals
                      .slice(0, 3)
                      .map((item, index) => (
                        <Box key={`${index}-proposal`}>{getProperProposalItem(item, index)}</Box>
                      ))
                  ) : (
                    <div className="container-content">No active proposals</div>
                  )}
                  {/* {(proposals && proposals.filter(item => item.OpenVotation).length > 0) && ( */}
                  {proposals && proposals.length > 0 && (
                    <SecondaryButton size="medium" onClick={handleViewAllProposals} block>
                      View All Proposals
                    </SecondaryButton>
                  )}
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <div className="generalHeaderBox">
                  <b>New polls</b>
                  {props.isFounder && community && community.Creator === props.user.id && (
                    <PrimaryButton
                      size="small"
                      onClick={handleOpenCreatePollModal}
                      className={"create_button"}
                    >
                      Create
                    </PrimaryButton>
                  )}
                </div>
                {viewAllVotingModal && (
                  <Dialog
                    className="modalCreateModal"
                    open={viewAllVotingModal}
                    onClose={handleCloseViewAllVotingModal}
                    fullWidth={true}
                    maxWidth={"md"}
                  >
                    <ViewAllVotingModal
                      onCloseModal={handleCloseViewAllVotingModal}
                      onRefreshInfo={() => props.handleRefresh()}
                      id={community.id}
                      type={"Community"}
                      votings={selectedVotings}
                      title={"Polls"}
                      openVotingsLabel={"Active Polls"}
                      closeVotingsLabel={"Old Polls"}
                    />
                  </Dialog>
                )}
                <CreateVotingModal
                  open={createPollModal}
                  onClose={handleCloseCreatePollModal}
                  onRefreshInfo={() => props.handleRefresh()}
                  id={community.id}
                  type={"Community"}
                  item={community}
                  title={"Create new poll"}
                />
                <div className="container-content">
                  {votingsPoll && votingsPoll.filter(i => i.OpenVotation).length > 0 ? (
                    votingsPoll
                      .filter(i => i.OpenVotation)
                      .slice(0, 3)
                      .map((item, index) => (
                        <PollItem
                          version={3}
                          item={item}
                          itemType={"Community"}
                          itemId={community.id}
                          onRefreshInfo={() => props.handleRefresh()}
                          key={`${index}-poll`}
                        />
                      ))
                  ) : (
                    <div>No data to display</div>
                  )}
                </div>
                {/* {votingsPoll && votingsPoll.filter(i => i.OpenVotation).length > 2 && ( */}
                {votingsPoll && votingsPoll.length > 0 && (
                  <div className="bottom">
                    <SecondaryButton onClick={handleViewAllPolls} size="medium" block>
                      View All Polls
                    </SecondaryButton>
                  </div>
                )}
              </Grid>
              <Grid item xs={12} md={4}>
                <div className="generalHeaderBox">
                  <b>Welcome New Members!</b>
                  <div className="bottom">
                    <PrimaryButton size="small" onClick={() => {}} className={"create_button"}>
                      View All
                    </PrimaryButton>
                  </div>
                </div>
                {members
                  .filter((member, index) => index < 3)
                  .map(item => (
                    <MemberItem member={item} key={item} />
                  ))}
                <div className="generalHeaderBox" style={{ marginTop: "30px" }}>
                  <b>Event Calendar</b>
                  {/* {community && community.Creator === props.user.id && ( */}
                  <PrimaryButton
                    size="small"
                    onClick={() => handleOpenAddEventModal()}
                    className={"create_button"}
                  >
                    Create
                  </PrimaryButton>
                  {/* )} */}
                </div>
                <div>
                  {calendar && calendar.length ? (
                    <Box
                      mb={2}
                      style={{
                        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
                        borderRadius: 14,
                        padding: "20px 25px",
                      }}
                    >
                      {[...calendar].slice(0, 2).map((item, index) => (
                        <>
                          <CalendarItem item={item} key={`${index}-event`} />
                          {index < calendar.length - 1 && <hr />}
                        </>
                      ))}
                    </Box>
                  ) : (
                    <div className="container-content">No data to display</div>
                  )}
                </div>
                <div className="bottom">
                  <SecondaryButton onClick={handleOpenCalendarModal} size="medium" block>
                    Open Calendar
                  </SecondaryButton>
                </div>
                {openCalendarModal && (
                  <CalendarModal
                    community={community}
                    calendar={calendar}
                    open={openCalendarModal}
                    handleClose={handleCloseCalendarModal}
                    handleRefresh={() => props.handleRefresh()}
                    showAll={handleViewAllCalendars}
                  />
                )}
                {addEventModal && (
                  <AddEventModal
                    community={community}
                    open={addEventModal}
                    handleClose={handleCloseAddEventModal}
                    handleRefresh={() => props.handleRefresh()}
                  />
                )}
              </Grid>
            </Grid>
          </div>
          {contributions && contributions.length > 0 ? (
            <Box>
              <div className="generalHeaderBox">
                <b>Latest Messages</b>
                {community && community.Creator === props.user.id && (
                  <PrimaryButton size="small" onClick={handleViewAllMessages} className={"create_button"}>
                    View All
                  </PrimaryButton>
                )}
              </div>
              <Grid className={"contribution-cards"}>
                <div className="column generalColumnContainer">
                  <ResponsiveMasonry columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}>
                    <Masonry gutter={GUTTER}>
                      {contributions.slice(0, viewIndex).map((item, index) => (
                        <ContributionCard
                          item={item}
                          community={community}
                          key={`contribution-card-${index}`}
                          updateCommunity={newCommunity => setCommunity(newCommunity)}
                        />
                      ))}
                    </Masonry>
                  </ResponsiveMasonry>
                </div>
              </Grid>
            </Box>
          ) : (
            <div className="second-row">
              <div className="wall">
                <div>No Posts available</div>
              </div>
            </div>
          )}
          {contributions && contributions.length > 0 ? (
            <Box>
              <div className="generalHeaderBox">
                <b>New Acquisitions</b>
                {community && community.Creator === props.user.id && (
                  <PrimaryButton size="small" onClick={() => {}} className={"create_button"}>
                    View All
                  </PrimaryButton>
                )}
              </div>
              <div className="generalColumnContainer">
                {ongoingAcquisitionProposals.slice(0, viewIndex).map((item, index) => (
                  <div className="generalColumnItem">
                    <AcquisitionCard data={item} key={`${index}-acquisition`} />
                  </div>
                ))}
              </div>
            </Box>
          ) : (
            <div className="second-row">
              <div className="wall">
                <div>No Posts available</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}, arePropsEqual);

const mapStateToProps = state => {
  return {
    user: state.user,
    users: state.users,
  };
};

export default connect(mapStateToProps)(General);

const Card = styled.div`
  background: #ffffff;
  box-shadow: 3.79621px 3.79621px 22.7773px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;
