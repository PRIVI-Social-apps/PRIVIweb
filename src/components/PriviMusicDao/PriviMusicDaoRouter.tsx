import React from "react";
import { Switch, Route } from "react-router-dom";
import ClaimableMusicPage from "./subPages/ClaimableMusicPage";
import FullDaoProposal from "./subPages/FullDaoProposal";
import GovernancePage from "./subPages/GovernancePage";
import HighYieldPage from "./subPages/HighYieldPage";
import HomePage from "./subPages/HomePage";
import LiquidityPage from "./subPages/LiquidityPage";
import ProposalPage from "./subPages/ProposalPage";
import StakingPage from "./subPages/StakingPage";
import VotePage from "./subPages/VotePage";
import ClaimMusicPod from "components/PriviPods/subpages/ClaimMusic/ClaimMusicPod";
import FullVote from "./subPages/FullVote";
import SongsPage from "./subPages/HomePage/Songs";
import ArtistsPage from "./subPages/HomePage/Artists";
import TrendingSongsPage from "./subPages/HomePage/TrendingSongs";
import ArtistPage from "./subPages/ArtistPage";
import LiquidityPoolDetailPage from "./subPages/LiquidityPage/LiquidityPoolDetail";
import LiquidityPoolManagementPage from "./subPages/LiquidityPage/LiquidityPoolManagement";
import LiquidityPositionPage from "./subPages/LiquidityPage/LiquidityPosition";
import CalculatorPage from "./subPages/CalculatorPage";
import DiscussionAllPage from "./subPages/GovernancePage/DiscussionAll";
import DiscussionDetailPage from "./subPages/GovernancePage/DiscussionDetail";
import PriviMusicPage from "./subPages/PriviMusic";
import PodsPage from "./subPages/PodsPage";
import { PodDetailsPage } from "./subPages/PodDetailsPage";
import FullWallPost from "./subPages/FullWallPost";
import TradeTraxPage from "./subPages/TradeTraxPage";
import FreeMusicPage from "./subPages/FreeMusicPage";
import MusicStackPage from "./subPages/MusicStackPage";

export default function PriviMusicDaoRouter(props) {
  return (
    <Switch>
      <Route exact path="/privi-music-dao/" component={HomePage} />
      <Route exact path="/privi-music-dao/songs" component={SongsPage} />
      <Route exact path="/privi-music-dao/artists" component={ArtistsPage} />
      <Route exact path="/privi-music-dao/trending_songs" component={TrendingSongsPage} />
      <Route exact path="/privi-music-dao/staking/" component={StakingPage} />
      <Route exact path="/privi-music-dao/liquidity/" component={LiquidityPage} />
      <Route exact path="/privi-music-dao/liquidity/pool_detail/:id" component={LiquidityPoolDetailPage} />
      <Route
        exact
        path="/privi-music-dao/liquidity/pool_management/:id"
        component={LiquidityPoolManagementPage}
      />
      <Route exact path="/privi-music-dao/liquidity/position/:id" component={LiquidityPositionPage} />
      <Route exact path="/privi-music-dao/governance/" component={GovernancePage} />
      <Route exact path="/privi-music-dao/governance/all_discussions" component={DiscussionAllPage} />
      <Route
        exact
        path="/privi-music-dao/governance/discussion_detail/:id"
        component={DiscussionDetailPage}
      />
      <Route exact path="/privi-music-dao/high-yield/" component={HighYieldPage} />
      <Route exact path="/privi-music-dao/governance/votes/" component={VotePage} />
      <Route exact path="/privi-music-dao/governance/votes/:id" component={FullVote} />
      <Route exact path="/privi-music-dao/governance/proposals/" component={ProposalPage} />
      <Route exact path="/privi-music-dao/governance/proposals/:id" component={FullDaoProposal} />
      <Route exact path="/privi-music-dao/claimable-music/" component={ClaimableMusicPage} />
      <Route exact path="/privi-music-dao/claimable-music/:podAddress" component={ClaimMusicPod} />
      <Route exact path="/privi-music-dao/artists/:id" component={ArtistPage} />
      <Route exact path="/privi-music-dao/music" component={PriviMusicPage} />
      <Route exact path="/privi-music-dao/free-music" component={FreeMusicPage} />
      <Route exact path="/privi-music-dao/staking/calculator" component={CalculatorPage} />
      <Route exact path="/privi-music-dao/music" component={FreeMusicPage} />
      <Route exact path="/privi-music-dao/music/stack/:id" component={MusicStackPage} />
      <Route exact path="/privi-music-dao/pods" component={PodsPage} />
      <Route exact path="/privi-music-dao/pods/:podAddress" component={PodDetailsPage} />
      <Route exact path="/privi-music-dao/pods/:podAddress/:wallPostId" component={FullWallPost} />
      <Route exact path="/privi-music-dao/trade-trax/" component={TradeTraxPage} />
    </Switch>
  );
}
