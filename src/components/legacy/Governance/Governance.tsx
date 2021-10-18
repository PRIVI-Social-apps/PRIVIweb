import React, { useState } from "react";
import { PrimaryButton } from "shared/ui-kit";
import ContributionCard from "components/legacy/Communities/CommunityPage/components/General/components/ContributionCard";
import ProposalItem from "./components/ProposalItem";
import { useHistory } from "react-router-dom";

import "./Governance.css";
import { ChevronIconLeft } from "shared/ui-kit/Icons";
import { HeaderTitle } from "shared/ui-kit/Header/components/HeaderTitle";

const tabs = ["All", "Ended", "Ongoing", "Voted", "Haven’t Voted", "Followings"];

const sampleObject = {
  Followers: [
    {
      date: 1622479061500,
      id: "Px24ddc552-dfa0-4ee3-81f2-6ad9f8eacc87",
    },
  ],
  hasPhoto: false,
  Hash: "2fb9ff09337ef340238d8be3301934748ecaea724d1bdebcb1786c7172bb7ca4",
  Description:
    "We want to decide if new joining rules are need to join Sublime Yoga. As usually, we submit the decision to votation.",
  url: "https://uploadsdev.ams3.digitaloceanspaces.com/votation/Px5271da7a-31ec-4982-aa57-5f0a60b3a5a9.png",
  Answers: [],
  VotingToken: "PRIVI",
  CreatorId: "Pxaff46ed9-9c8e-44a2-a956-4d5f03c4750c",
  CreatorAddress: "Pxaff46ed9-9c8e-44a2-a956-4d5f03c4750c",
  VotationAddress: "0x3835323533353162227D31363132393038383832",
  NumVotes: 4,
  Caller: "PRIVI",
  TotalVotes: "1000",
  PossibleAnswers: ["Yes", "No"],
  Question: "Should Sublime Yoga require  new joining rules?",
  ItemId: "0x3835323533353162227D31363132393038383739",
  Type: "staking",
  VotationId: "Px5271da7a-31ec-4982-aa57-5f0a60b3a5a9",
  ItemType: "Community",
  QuorumRequired: 0.6,
  EndingDate: 1680231960,
  Signature:
    "0xdef8f7f600e10c33d8e025adc41b10065cacadbde4dc301fe3827cab1ed9742853010aceecd4e533a681bd15e647d65ac1ab2f9f82e987d22bd72e1398a20ac01c",
  OpenVotation: true,
  StartingDate: 1612929962,
  id: "Px5271da7a-31ec-4982-aa57-5f0a60b3a5a9",
  CreatorName: "Zach",
};

const sampleMessageObject = {
  comments: [
    {
      userId: "Px24ddc552-dfa0-4ee3-81f2-6ad9f8eacc87",
      userName: "AngelSatorres",
      message: "This is test comment.",
      date: 1620395157474,
    },
    {
      message: "Thanks",
      userName: "AngelSatorres",
      date: 1620396077651,
      userId: "Px24ddc552-dfa0-4ee3-81f2-6ad9f8eacc87",
    },
    {
      message: "Thanks for your payment.\nI am happy.",
      userName: "AngelSatorres",
      date: 1620396258795,
      userId: "Px24ddc552-dfa0-4ee3-81f2-6ad9f8eacc87",
    },
    {
      userId: "Px24ddc552-dfa0-4ee3-81f2-6ad9f8eacc87",
      userName: "AngelSatorres",
      message: "This is test scroll.",
      date: 1620399339199,
    },
  ],
  amount: 1,
  token: "BNB",
  fromUserId: "Px7195bab4-e23b-4cd3-b3fa-5ef2cbfefb25",
  date: 1619723358191,
};

const Governance = () => {
  // HOOKS
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <div className="governancePage">
      <HeaderTitle title="<b>Governance</b>" subtitle="Be Part of <b>Privi’s Future.</b>" marginBottom={38} />

      <div className="headerGovernanceBox">
        <div className="headerFirstBox">
          <img src={require("assets/icons/governance.png")} />
          <div>
            <div className="headerLabel1">{`Stake & Get Content`}</div>
            <div className="headerLabel2">Enjoy endless hours of content by staking PRIVI coins.</div>
            <button>Stake PRIVI Coins Now</button>
          </div>
        </div>
        <div className="headerSecondBox">
          <div className="headerLabel3">Calculate your stake</div>
          <div className="stackBox">
            <div>
              <div>I want to stake</div>
              <div className="stackSubBox">
                <div>987</div>
                <img src={require("assets/logos/PRIVILOGO.png")} className="subImg" />
              </div>
            </div>
            <div style={{ marginLeft: "16px" }}>
              <div>I will get</div>
              <div>
                <div className="headerLabel1" style={{ marginBottom: "0px" }}>
                  89 hrs.
                </div>
                <div>Of content to enjoy</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "8px" }}>The current minimum staking period is 30 days.</div>
        </div>
      </div>

      <div className="headerDaoPriviGovernance">Media DAOs</div>
      <div className="daoContainer">
        <div
          className="daoBox"
          onClick={() => {
            history.push("/governance/musicdao");
          }}
        >
          <img src={require("assets/mediaIcons/mockup/playlist_mock_up_3.png")} />
          <div className="headerLabel1">Music</div>
        </div>
        <div className="daoBox">
          <img src={require("assets/mediaIcons/mockup/playlist_mock_up_2.png")} />
          <div className="headerLabel1">Video</div>
        </div>
        <div className="daoBox">
          <img src={require("assets/mediaIcons/mockup/playlist_mock_up_1.png")} />
          <div>
            <div className="headerLabel1">Art</div>
            <div className="artBox">
              🔥
              <div>
                <div>Staked</div>
                <div>USDp 123558.002</div>
              </div>
            </div>
            <div className="artBox">
              🏆
              <div>
                <div>Accumulated Rewards </div>
                <div>USDp 558.777</div>
              </div>
            </div>
            <div className="governaceFlexBox artCircle">
              <div style={{ transform: "rotate(180deg)" }}>
                <ChevronIconLeft />
              </div>
            </div>
          </div>
        </div>
        <div className="commingBox">
          <img src={require("assets/icons/comming_clock.png")} />
          <div>New Media DAOs Coming soon</div>
        </div>
      </div>
      <div className="headerDaoPriviGovernance">
        Global Numbers
        <PrimaryButton
          size="small"
          onClick={() => {
            history.push("/governance/graph");
          }}
          className="viewAllButton"
        >
          View All
        </PrimaryButton>
      </div>
      <div className="governaceFlexBox globalNumberContainer">
        <div className="globalNumberBox">
          <div className="headerLabel4">🔥 Staked</div>
          <div className="headerLabel5">USDp 8.777</div>
        </div>
        <div className="globalNumberBox">
          <div className="headerLabel4">📈 Max. Staked</div>
          <div className="headerLabel5">USDp 568.702</div>
        </div>
        <div className="globalNumberBox">
          <div className="headerLabel4">⏱️ Available Time</div>
          <div className="headerLabel5">216 hrs.</div>
        </div>
        <div className="globalNumberBox">
          <div className="headerLabel4">🏆 Accumulated Rewards</div>
          <div className="headerLabel5">USDp 1.233</div>
        </div>
      </div>

      <div className="governaceFlexBox borderBottomContainer">
        <div className="headerSmallDaoPriviGovernance">
          Proposals
          <PrimaryButton
            size="small"
            onClick={() => {
              history.push("/governance/proposals");
            }}
            className="viewAllButton"
          >
            View All
          </PrimaryButton>
        </div>
      </div>
      <div className="governaceFlexBox" style={{ marginBottom: "28px" }}>
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
      </div>
      <div className="governaceFlexBox">
        {[1, 2, 3].map((item, index) => (
          <ProposalItem
            version={2}
            item={sampleObject}
            onRefreshInfo={() => {}}
            itemId={sampleObject.id}
            itemType="Community"
            key={`${index}-proposal`}
            voters={[]}
          />
        ))}
      </div>

      <div className="governaceFlexBox borderBottomContainer">
        <div className="headerSmallDaoPriviGovernance">
          Discussion
          <PrimaryButton
            size="small"
            onClick={() => {
              history.push("/governance/messages");
            }}
            className="viewAllButton"
          >
            View All
          </PrimaryButton>
        </div>
      </div>
      <div className="governaceFlexBox">
        {[1, 2, 3].map((item, index) => (
          <div style={{ margin: "8px", width: "400px" }}>
            <ContributionCard
              item={sampleMessageObject}
              community={{}}
              key={`contribution-card-${index}`}
              updateCommunity={newCommunity => {}}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Governance;
