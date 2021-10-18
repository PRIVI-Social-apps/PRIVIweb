import React, { useState } from "react";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Grid, makeStyles } from "@material-ui/core";
import { ChevronIconLeft } from "shared/ui-kit/Icons";
import ProposalItem from "../components/ProposalItem";
import ContributionCard from "components/legacy/Communities/CommunityPage/components/General/components/ContributionCard";
import { useHistory } from "react-router-dom";

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

const COLUMNS_COUNT_BREAK_POINTS = {
  375: 1,
  900: 2,
  1200: 3,
};

const GUTTER = "16px";

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(5),
    height: `calc(100vh - 80px)`,
    paddingBottom: "40px",
  },
  subContainer: {
    width: "100%",
    overflowY: "auto",
    scrollbarWidth: "none",
    height: "calc(100vh - 80px)",
    paddingBottom: "40px",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  flexBoxHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  borderBottomContainer: {
    borderBottom: "1px solid grey",
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: "24px",
    color: "rgb(8, 24, 49)",
    lineHeight: "33.44px",
    marginTop: "20px",
    marginBottom: "20px",
    marginRight: "20px",
  },
  categoryTab: {
    color: "#707582",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: `10px 24px 11px`,
    border: "1px solid #707582",
    boxSizing: "border-box",
    borderRadius: "57px",
    marginRight: "12px",
    cursor: "pointer",
    textAlign: "center",
  },
  selected: {
    backgroundColor: "black",
    borderColor: "black",
    color: "white",
  },
  cardsGrid: {
    display: "grid",
    gridColumnGap: "20px",
    gridRowGap: "20px",
    padding: "30px 0",
    width: "100%",
  },
}));

const FullContents = props => {
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        <div
          className={classes.flexBox}
          style={{ color: "#23D0C6", cursor: "pointer " }}
          onClick={() => {
            history.goBack();
          }}
        >
          <ChevronIconLeft />
          <div style={{ marginLeft: "10px" }}>Back to Governance</div>
        </div>
        <div className={`${classes.flexBoxHeader} ${classes.borderBottomContainer}`}>
          <div className={classes.headerTitle}>{props.isProposal ? "Proposals" : "Discussion"}</div>
          <div>
            <button onClick={() => {}}>
              {props.isProposal ? "Create New Proposal" : "Start New Discussion"}
            </button>
          </div>
        </div>
        {props.isProposal && (
          <div className={classes.flexBox} style={{ marginTop: "10px" }}>
            {tabs.map((option, index) => (
              <div
                className={
                  index === selectedTab ? `${classes.selected} ${classes.categoryTab}` : classes.categoryTab
                }
                onClick={() => {
                  setSelectedTab(index);
                }}
                key={`${index}-tab`}
              >
                {option}
              </div>
            ))}
          </div>
        )}
        <div className={classes.flexBox} style={{ marginTop: "10px" }}>
          <Grid className={classes.cardsGrid}>
            <ResponsiveMasonry columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}>
              <Masonry gutter={GUTTER}>
                {[1, 2, 3, 4, 5].map((item, index) =>
                  props.isProposal ? (
                    <ProposalItem
                      version={2}
                      item={sampleObject}
                      onRefreshInfo={() => {}}
                      itemId={sampleObject.id}
                      itemType="Community"
                      key={`${index}-proposal`}
                      voters={[]}
                    />
                  ) : (
                    <ContributionCard
                      item={sampleMessageObject}
                      community={{}}
                      key={`contribution-card-${index}`}
                      updateCommunity={newCommunity => {}}
                    />
                  )
                )}
              </Masonry>
            </ResponsiveMasonry>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default FullContents;
