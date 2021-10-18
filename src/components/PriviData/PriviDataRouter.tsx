import React from "react";
import { Switch, Route } from "react-router-dom";

import HomePage from "./subpages/HomePage";
import AdvertisePage from "./subpages/AdvertisePage";
import AdvertiseDetailPage from "./subpages/AdvertiseDetailPage";
import BuyDatapPage from "./subpages/BuyDATApPage";
import GovernancePage from "./subpages/GovernancePage";
import DiscussionsPage from "./subpages/DiscussionsPage";
import VotePage from "./subpages/VotePage";
import ProposalPage from './subpages/ProposalPage';
import VoteDetailPage from './subpages/VoteDetailPage';
import FullDiscussionPage from "./subpages/FullDiscussionPage";
import ProposalDetailPage from "./subpages/ProposalDetailPage";

export default function PriviDataRouter(props) {
  return (
    <Switch>
      <Route exact path="/privi-data-new/" component={HomePage} />
      <Route exact path="/privi-data-new/advertise/" component={AdvertisePage} />
      <Route exact path="/privi-data-new/advertise/:id" component={AdvertiseDetailPage} />
      <Route exact path="/privi-data-new/buydatap/" component={BuyDatapPage} />
      <Route exact path="/privi-data-new/governance/" component={GovernancePage} />
      <Route exact path="/privi-data-new/governance/discussions/" component={DiscussionsPage} />
      <Route exact path="/privi-data-new/governance/discussions/:id" component={FullDiscussionPage} />
      <Route exact path="/privi-data-new/governance/votes/" component={VotePage} />
      <Route exact path="/privi-data-new/governance/proposals/" component={ProposalPage} />
      <Route exact path="/privi-data-new/governance/votes/:id/" component={VoteDetailPage} />
      <Route exact path="/privi-data-new/governance/proposals/:id/" component={ProposalDetailPage} />
    </Switch>
  );
}
