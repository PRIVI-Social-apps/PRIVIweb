import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect, useSelector } from "react-redux";

import { Grid } from "@material-ui/core";

import { generalStyles } from "./General.styles";
import CalendarItem from "./components/CalendarItem";
import PollItem from "./components/PollItem";
import ProposalItem from "./components/ProposalItem";
import CalendarModal from "./modals/Calendar/CalendarModal";

import CreateVotingModal from "./modals/Voting/CreateVotingModal";
import ContributionCard from "./components/ContributionCard";
import { Card } from "../../index.styles";
import { BackIcon, HistoryIcon, PlusIcon, TitleGrandLight } from "../../index.styles";

import MemberItem from "./components/MemberItem";
import AddEventModal from "./modals/Calendar/AddEvent";
import URL from "shared/functions/getURL";
import { RootState } from "store/reducers/Reducer";
import { DAOButtonDark, DAOButtonFilled } from "components/PriviDAO/components/DAOButton";
import { StyledSelectComponent } from "shared/ui-kit/Select/TokenSelect";
import Cards from "components/PriviDAO/components/Cards";
import Box from "shared/ui-kit/Box";
import { getMemberMediaAcquisitionProposals } from "shared/services/API";

const equal = require("deep-equal");

const arePropsEqual = (prevProps, currProps) => {
  return (
    JSON.stringify(prevProps.community) === JSON.stringify(currProps.community) &&
    equal(prevProps.user, currProps.user) &&
    JSON.stringify(prevProps.users) === JSON.stringify(currProps.users)
  );
};

type OpenDetailView = "proposal" | "poll" | "message" | "acquisition";

const ProposalFilters = ["All", "Ended", "Ongoing", "Voted", "Didn’t vote", "Following"];
const PollFilters = ["All", "Ended", "Ongoing", "Voted", "Didn’t vote"];

const General = React.memo((props: any) => {
  let userSelector = useSelector((state: RootState) => state.user);

  const classes = generalStyles();

  const [calendar, setCalendar] = useState<any[]>([]);
  const [community, setCommunity] = useState<any>(props.community || {});
  const [proposals, setProposals] = useState<any[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [votingsPoll, setVotingsPoll] = useState<any[]>([]);
  const [filteredVotingsPoll, setFilteredVotingsPoll] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [voters, setVoters] = useState<any[]>([]);
  const [ongoingAcquisitionProposals, setOngingAcquisitionProposals] = useState<any[]>([]);

  const [openViewAll, setOpenViewAll] = useState<OpenDetailView | null>(null);
  const [filter, setFilter] = useState<string>(PollFilters[0]);

  const [openCalendarModal, setOpenCalendarModal] = useState<boolean>(false);
  const handleOpenCalendarModal = () => {
    setOpenCalendarModal(true);
  };
  const handleCloseCalendarModal = () => {
    setOpenCalendarModal(false);
  };

  const [addEventModal, setAddEventModal] = useState<boolean>(false);
  const handleOpenAddEventModal = () => {
    setAddEventModal(true);
  };
  const handleCloseAddEventModal = () => {
    setAddEventModal(false);
  };

  const [createPollModal, setCreatePollModal] = useState<boolean>(false);
  const handleOpenCreatePollModal = () => {
    setCreatePollModal(true);
  };
  const handleCloseCreatePollModal = () => {
    setCreatePollModal(false);
  };

  const handleViewAllProposals = () => {
    setOpenViewAll("proposal");
  };

  const handleViewAllPolls = () => {
    setOpenViewAll("poll");
  };

  const handleViewAllMessages = () => {
    setOpenViewAll("message");
  };

  const handleViewAllAdquisitions = () => {
    setOpenViewAll("acquisition");
  };

  const handleCloseViewAll = () => {
    setOpenViewAll(null);
  };

  useEffect(() => {
    if (props.user) {
      axios.get(`${URL()}/voting/getVotersByUserAddress/${props.user.id}`).then(res => {
        if (res.data.success) {
          setVoters(res.data.data.voters || []);
        }
      });
    }

    let membersTreasurersFoundersArray: any[] = [];
    let members = Object.keys(community.MembersMap || {}) || [];
    let treasurers = Object.keys(community.TreasurersMap || {}) || [];
    let founders = Object.keys(community.FoundersMap || {}) || [];

    if (members.length > 0) {
      for (let member of members) {
        membersTreasurersFoundersArray.push(community.MembersMap[member]);
      }
    }
    if (treasurers.length > 0) {
      for (let treasurer of treasurers) {
        if (
          !membersTreasurersFoundersArray.includes(
            m => m.Address == community.TreasurersMap[treasurer]?.Address
          )
        )
          membersTreasurersFoundersArray.push(community.TreasurersMap[treasurer]);
      }
    }
    if (founders.length > 0) {
      for (let founder of founders) {
        if (
          !membersTreasurersFoundersArray.includes(
            m => m.Address == community.TreasurersMap[founder]?.Address
          )
        )
          membersTreasurersFoundersArray.push(community.FoundersMap[founder]);
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

    setContributions([...(community.Contributions || [])]);
  }, [community]);

  useEffect(() => {
    if (community) {
      const p = [...(community.PostsArray || "")];

      //set all images
      if (props.users && props.users.length > 0) {
        props.users.forEach(user => {
          p.forEach((post, index) => {
            if (user.id === post.createdBy) {
              p[index].userImageURL = user.imageURL;
              p[index].userName = user.name;
            }
          });
        });
      }

      let votings: any[] = [];
      if (community.Votings && community.Votings.length > 0) {
        votings = community.Votings.filter(voting => voting.Type === "regular");
      }

      /*setCommunityWall(wallPosts);
      setStories(stories);*/
      setProposals(community.Proposals);
      setFilteredProposals(community.Proposals);
      setVotingsPoll(votings);
      setFilteredVotingsPoll(votings);
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
    if (userSelector?.id) {
      if (proposals?.length && openViewAll === "proposal") {
        // ['All', 'Ended', 'Ongoing', 'Voted', 'Didn’t vote', 'Following']
        const curDate = new Date().getTime();
        setFilteredProposals(
          proposals.reduce((prev, cur) => {
            let isInclude = false;
            if (filter === "All") {
              isInclude = true;
            } else if (filter === "Ended" && curDate > cur.ProposalEndingTime) {
              isInclude = true;
            } else if (filter === "Ongoing" && curDate < cur.ProposalEndingTime) {
              isInclude = true;
            } else if (filter === "Voted" && cur.Approvals && cur.Approvals[userSelector.address]?.isVoted) {
              isInclude = true;
            } else if (
              filter === "Didn’t vote" &&
              cur.Approvals &&
              !cur.Approvals[userSelector.address]?.isVoted
            ) {
              isInclude = true;
            } else if (filter === "Following" && props.user.followingProposals.includes(cur.id)) {
              isInclude = true;
            }

            if (isInclude) {
              return [...prev, cur];
            } else {
              return prev;
            }
          }, [])
        );
      }
      if (votingsPoll?.length && openViewAll === "poll") {
        // ['All', 'Ended', 'Ongoing', 'Voted', 'Didn’t vote']
        const curDate = new Date().getTime();
        setFilteredVotingsPoll(
          votingsPoll.reduce((prev, cur) => {
            let isInclude = false;
            if (filter === "All") {
              isInclude = true;
            } else if (filter === "Ended" && curDate > cur.EndingDate) {
              isInclude = true;
            } else if (filter === "Ongoing" && curDate < cur.EndingDate) {
              isInclude = true;
            } else if (
              filter === "Voted" &&
              cur.Answers &&
              cur.Answers.findIndex(answer => answer.UserId === userSelector.id) > -1
            ) {
              isInclude = true;
            } else if (
              filter === "Didn’t vote" &&
              cur.Answers &&
              cur.Answers.findIndex(answer => answer.UserId === userSelector.id) < 0
            ) {
              isInclude = true;
            }

            if (isInclude) {
              return [...prev, cur];
            } else {
              return prev;
            }
          }, [])
        );
      }
    }
  }, [filter, openViewAll, proposals?.length, votingsPoll?.length, userSelector?.id]);

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

  return (
    <div className={classes.general}>
      {openViewAll ? (
        <>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            onClick={handleCloseViewAll}
            mb={4}
            style={{ cursor: "pointer" }}
          >
            <BackIcon />
            <Box fontSize="22px" ml={2}>
              Back
            </Box>
          </Box>
          {openViewAll === "proposal" && (
            <>
              <Box display="flex" alignItems="center" mb={5}>
                <TitleGrandLight fontSize="30px" disableUppercase bold>
                  DAO Proposals
                </TitleGrandLight>
                <Box ml={3} width='115px'>
                  <StyledSelectComponent
                    placeholder="Filter by"
                    options={ProposalFilters}
                    value={filter}
                    onChange={e => {
                      setFilter(e.target.value as string);
                    }}
                    theme="dark"
                  />
                </Box>
              </Box>
              <Grid container spacing={3} wrap="wrap">
                {filteredProposals.map((item, index) => (
                  <Grid key={`${index}-proposal`} item md={4}>
                    <Card>
                      <ProposalItem
                        item={item}
                        onRefreshInfo={() => props.handleRefresh()}
                        itemId={community.id}
                        itemType="Community"
                        voters={voters}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
          {openViewAll === "poll" && (
            <>
              <Box display="flex" alignItems="center" mb={5}>
                <TitleGrandLight fontSize="30px" disableUppercase bold>
                  Polls
                </TitleGrandLight>
                <Box ml={3}>
                  <StyledSelectComponent
                    placeholder="Filter by"
                    options={PollFilters}
                    value={filter}
                    onChange={e => {
                      setFilter(e.target.value as string);
                    }}
                    theme="dark"
                  />
                </Box>
              </Box>
              <Grid container spacing={3} wrap="wrap">
                {filteredVotingsPoll.map((item, index) => (
                  <Grid key={`${index}-poll`} item md={4}>
                    <Card>
                      <PollItem
                        version={3}
                        item={item}
                        itemType={"Community"}
                        itemId={community.id}
                        onRefreshInfo={() => props.handleRefresh()}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
          {openViewAll === "message" && (
            <>
              <TitleGrandLight fontSize="30px" mb={5} disableUppercase bold>
                Messages
              </TitleGrandLight>
              <Grid container spacing={3} wrap="wrap">
                {contributions.map((card, index) => (
                  <Grid item xs={12} sm={6} key={`message-${index}`}>
                    <ContributionCard
                      item={card}
                      community={community}
                      updateCommunity={newCommunity => setCommunity(newCommunity)}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
          {openViewAll === "acquisition" && (
            <>
              <TitleGrandLight fontSize="30px" mb={5} disableUppercase bold>
                New Acquisitions
              </TitleGrandLight>
              <Cards cardType="Acquisition" cards={ongoingAcquisitionProposals} />
            </>
          )}
        </>
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mb={5}>
                <TitleGrandLight>DAO Proposals</TitleGrandLight>
                <Box display="flex">
                  {proposals && proposals.length > 0 && (
                    <DAOButtonDark icon onClick={handleViewAllProposals}>
                      <HistoryIcon />
                    </DAOButtonDark>
                  )}
                </Box>
              </Box>
              <Box width="100%">
                {proposals && proposals.length > 0 ? (
                  proposals.slice(0, 2).map((item, index) => (
                    <Card key={`proposal-item-${index}`}>
                      <ProposalItem
                        version={2}
                        item={item}
                        onRefreshInfo={() => props.handleRefresh()}
                        itemId={community.id}
                        itemType="Community"
                        key={`${index}-proposal`}
                        voters={voters}
                      />
                    </Card>
                  ))
                ) : (
                  <TitleGrandLight fontSize={"14px"}>No active proposals</TitleGrandLight>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mb={5}>
                <TitleGrandLight>DAO Votations</TitleGrandLight>
                <Box display="flex">
                  {votingsPoll && votingsPoll.length > 0 && (
                    <DAOButtonDark icon onClick={handleViewAllPolls}>
                      <HistoryIcon />
                    </DAOButtonDark>
                  )}
                  {props.isFounder && (
                    <DAOButtonFilled icon onClick={handleOpenCreatePollModal}>
                      <PlusIcon />
                    </DAOButtonFilled>
                  )}
                </Box>
              </Box>
              <Box width="100%">
                {votingsPoll && votingsPoll.filter(i => i.OpenVotation).length > 0 ? (
                  votingsPoll
                    .filter(i => i.OpenVotation)
                    .slice(0, 2)
                    .map((item, index) => (
                      <Card key={`poll-item-${index}`}>
                        <PollItem
                          version={3}
                          item={item}
                          itemType={"Community"}
                          itemId={community.id}
                          onRefreshInfo={() => props.handleRefresh()}
                          key={`${index}-poll`}
                        />
                      </Card>
                    ))
                ) : (
                  <TitleGrandLight fontSize={"14px"}>No data to display</TitleGrandLight>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box height="40px" display="flex" alignItems="center" mb={5}>
                <TitleGrandLight>New Members!</TitleGrandLight>
              </Box>

              <Card>
                {members && members.length > 0 ? (
                  <Box width="100%" maxHeight="344px" minHeight="100px" overflow="auto" mt={"-25px"}>
                    {members
                      .filter((member, index) => index < 4)
                      .map((item, i) => (
                        <MemberItem member={item} key={`member-${i}`} />
                      ))}
                  </Box>
                ) : (
                  <TitleGrandLight fontSize={"14px"}>No new members</TitleGrandLight>
                )}
              </Card>

              <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                alignItems="center"
                mb={5}
                mt={"21px"}
              >
                <TitleGrandLight>Event calendar</TitleGrandLight>
                <Box display="flex">
                  {votingsPoll && votingsPoll.length > 0 && (
                    <DAOButtonDark icon onClick={handleOpenCalendarModal}>
                      <HistoryIcon />
                    </DAOButtonDark>
                  )}
                  {community && community.Creator === props.user.id && (
                    <DAOButtonFilled icon onClick={handleOpenAddEventModal}>
                      <PlusIcon />
                    </DAOButtonFilled>
                  )}
                </Box>
              </Box>

              <Card>
                {calendar && calendar.length > 0 ? (
                  [...calendar]
                    .slice(0, 2)
                    .map((item, index) => <CalendarItem item={item} key={`${index}-event`} />)
                ) : (
                  <TitleGrandLight fontSize={"14px"}>No data to display</TitleGrandLight>
                )}
              </Card>
            </Grid>
          </Grid>
          {contributions && contributions.length > 0 ? (
            <Box width="100%" mt={10}>
              <Box display="flex" justifyContent="space-between" width="100%" mb={5}>
                <TitleGrandLight disableUppercase bold fontSize={30}>
                  Latest Messages
                </TitleGrandLight>
                <span className={classes.viewAll} onClick={handleViewAllMessages}>
                  View All
                </span>
              </Box>

              <Grid container spacing={3} wrap={"wrap"}>
                {contributions
                  .filter((it, ind) => ind < 4)
                  .map((card, index) => (
                    <Grid item xs={12} sm={6} key={`card-${index}`}>
                      <ContributionCard
                        item={card}
                        community={community}
                        updateCommunity={newCommunity => setCommunity(newCommunity)}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          ) : (
            <Box mt={10}>
              <TitleGrandLight fontSize={"14px"}>No contribution posts available</TitleGrandLight>
            </Box>
          )}
          {ongoingAcquisitionProposals && ongoingAcquisitionProposals.length > 0 ? (
            <Box mt={10}>
              <Box display="flex" justifyContent="space-between" width="100%" mb={5}>
                <TitleGrandLight disableUppercase bold fontSize={30}>
                  New Acquisitions
                </TitleGrandLight>
                <span className={classes.viewAll} onClick={handleViewAllAdquisitions}>
                  View All
                </span>
              </Box>
              <Cards cardType="Acquisition" cards={ongoingAcquisitionProposals} heightFixed />
            </Box>
          ) : (
            <Box mt={10}>
              <TitleGrandLight fontSize={"14px"}>No acquisition posts available</TitleGrandLight>
            </Box>
          )}
        </>
      )}

      {openCalendarModal && (
        <CalendarModal
          community={community}
          calendar={calendar}
          open={openCalendarModal}
          handleClose={handleCloseCalendarModal}
          handleRefresh={() => props.handleRefresh()}
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

      {createPollModal && (
        <CreateVotingModal
          open={createPollModal}
          onClose={handleCloseCreatePollModal}
          onRefreshInfo={() => props.handleRefresh()}
          id={community.id}
          type={"Community"}
          item={community}
          titleGrandLight={"Create new poll"}
          theme="dark"
        />
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
