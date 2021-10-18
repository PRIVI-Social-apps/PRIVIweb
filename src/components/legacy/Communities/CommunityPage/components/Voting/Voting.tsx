import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";

import "./Voting.css";
import PollItem from "../General/components/PollItem";
import ProposalItem from "../General/components/ProposalItem";
import CreateDaoProposalModal from "../../modals/Create-Dao-Proposal/Create-dao-proposal";
import CreateVotingModal from "shared/ui-kit/Page-components/CreateVotingModal";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";

const equal = require("deep-equal");
const tabs = ["All 🔮", "🤚 Polls", "🗳 DAO Proposals", "Voted", "Haven’t Voted", "Followings"];
const arrow = require("assets/icons/arrow.png");

const arePropsEqual = (prevProps, currProps) => {
  return (
    JSON.stringify(prevProps.community) === JSON.stringify(currProps.community) &&
    equal(prevProps.user, currProps.user) &&
    JSON.stringify(prevProps.users) === JSON.stringify(currProps.users)
  );
};

const Voting = React.memo((props: any) => {
  const [community, setCommunity] = useState<any>({});
  const [proposals, setProposals] = useState<any[]>([]);
  const [votingsPoll, setVotingsPoll] = useState<any[]>([]);

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [filteredProposals, setFilteredProposals] = useState<any[]>([]);
  const [filteredPolls, setFilteredPolls] = useState<any[]>([]);
  const [voters, setVoters] = useState<any[]>([]);

  useEffect(() => {
    setCommunity(props.community);
    if (props.user) {
      axios.get(`${URL()}/voting/getVotersByUserAddress/${props.user.id}`).then(res => {
        if (res.data.success) {
          setVoters(res.data.data.voters || []);
        }
      });
    }
  }, [props.community]);

  const [createDaoProposalModal, setCreateDaoProposalModal] = useState<boolean>(false);
  const handleOpenCreateDaoProposalModal = () => {
    setCreateDaoProposalModal(true);
  };
  const handleCloseCreateDaoProposalModal = () => {
    setCreateDaoProposalModal(false);
  };

  const [createPollModal, setCreatePollModal] = useState<boolean>(false);
  const handleOpenCreatePollModal = () => {
    setCreatePollModal(true);
  };
  const handleCloseCreatePollModal = () => {
    setCreatePollModal(false);
  };

  useEffect(() => {
    if (community) {
      let pr: any[] = [];
      let votings: any[] = [];
      if (community.VotingsArray && community.VotingsArray.length > 0) {
        pr = community.VotingsArray.filter(voting => voting.Type === "staking");
        votings = community.VotingsArray.filter(voting => voting.Type === "regular");
      }

      setProposals(pr);
      setVotingsPoll(votings);
      setFilteredProposals(pr);
      setFilteredPolls(votings);
    }
  }, [community]);

  useEffect(() => {
    //TODO -> FILTER VOTINGS AND PROPOSALS
    if (selectedTab === 3) {
      setFilteredProposals(proposals.filter(item => voters.find(voter => voter.VotationId === item.id)));
      setFilteredPolls(votingsPoll.filter(item => voters.find(voter => voter.VotationId === item.id)));
    } else if (selectedTab === 4) {
      setFilteredProposals(proposals.filter(item => !voters.find(voter => voter.VotationId === item.id)));
      setFilteredPolls(votingsPoll.filter(item => !voters.find(voter => voter.VotationId === item.id)));
    } else if (selectedTab === 5) {
      setFilteredProposals(proposals.filter(item => props.user?.followingProposals.includes(item.id)));
      setFilteredPolls(votingsPoll.filter(item => props.user?.followingProposals.includes(item.id)));
    } else {
      setFilteredProposals(proposals);
      setFilteredPolls(votingsPoll);
    }
  }, [selectedTab]);

  if (community) {
    return (
      <div className="voting-tab">
        <Box display="flex" alignItems="center">
          {tabs.map((option, index) => (
            <div
              className={index === selectedTab ? "selected category-tab" : "category-tab"}
              onClick={() => {
                setSelectedTab(index);
              }}
              key={`${index}-tab`}
            >
              {option}
            </div>
          ))}
        </Box>

        {selectedTab !== 1 && (
          <section>
            <div className="section-header">
              <Box display="flex" alignItems="center">
                <h4>DAO Proposals</h4>{" "}
                <button onClick={handleOpenCreateDaoProposalModal} className="create_new">
                  <img src={require("assets/icons/add.png")} alt="add" />
                  <span>Create New</span>
                </button>
              </Box>
              <Box display="flex" alignItems="center">
                <button
                  onClick={() => {
                    document.getElementsByClassName("proposals-list")[0]!.scrollLeft -= 370;
                  }}
                >
                  <img src={arrow} alt="" />
                </button>
                <button
                  onClick={() => {
                    document.getElementsByClassName("proposals-list")[0]!.scrollLeft += 370;
                  }}
                >
                  <img src={arrow} alt="" />
                </button>
              </Box>
            </div>
            <div className="proposals-list">
              {filteredProposals.map((item, index) => (
                <ProposalItem
                  version={2}
                  item={item}
                  onRefreshInfo={() => props.handleRefresh()}
                  itemId={community.id}
                  itemType="Community"
                  key={`${index}-proposal`}
                  voters={voters}
                />
              ))}
            </div>
          </section>
        )}

        {selectedTab !== 2 && (
          <section>
            <div className="section-header">
              <Box display="flex" alignItems="center">
                <h4>Polls</h4>
                <button className="create_new" onClick={handleOpenCreatePollModal}>
                  <img src={require("assets/icons/add.png")} alt="add" />
                  <span>Create New</span>
                </button>
              </Box>
              <Box display="flex" alignItems="center">
                <button
                  onClick={() => {
                    document.getElementsByClassName("votings-list")[0]!.scrollLeft -= 370;
                  }}
                >
                  <img src={arrow} alt="" />
                </button>
                <button
                  onClick={() => {
                    document.getElementsByClassName("votings-list")[0]!.scrollLeft += 370;
                  }}
                >
                  <img src={arrow} alt="" />
                </button>
              </Box>
            </div>
            <div className="votings-list">
              {filteredPolls.map((item, index) => (
                <PollItem
                  version={3}
                  item={item}
                  itemType={"Community"}
                  itemId={community.id}
                  onRefreshInfo={() => props.handleRefresh()}
                  key={`${index}-poll`}
                  voters={voters}
                />
              ))}
            </div>
          </section>
        )}

        {createDaoProposalModal && (
          <CreateDaoProposalModal
            open={createDaoProposalModal}
            onClose={handleCloseCreateDaoProposalModal}
            onRefreshInfo={() => props.handleRefresh()}
            item={community}
            itemId={community.id}
            itemType="Community"
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
            title={"Create new poll"}
          />
        )}
      </div>
    );
  } else return null;
}, arePropsEqual);

const mapStateToProps = state => {
  return {
    user: state.user,
    users: state.users,
  };
};

export default connect(mapStateToProps)(Voting);
