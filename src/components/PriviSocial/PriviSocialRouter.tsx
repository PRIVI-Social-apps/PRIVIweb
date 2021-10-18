import React from "react";
import { Switch, Route } from "react-router-dom";
import Messenger from "./subpages/Messenger";
import ClaimableProfiles from "./subpages/ClaimableProfiles";
import Discover from "./subpages/Discover";
import Feed from "./subpages/Feed";
import HomePage from "./subpages/Home";
import SocialToken from "./subpages/SocialToken";

export default function PriviSocialRouter({
  userId,
  userProfile,
  ownUser,
  getBasicInfo,
  toggleAnonymousMode,
  scrollRef,
}) {
  return (
    <Switch>
      <Route
        exact
        path="/privi-social/:id"
        render={() => (
          <HomePage
            toggleAnonymousMode={toggleAnonymousMode}
            userId={userId}
            userProfile={userProfile}
            ownUser={ownUser}
            getBasicInfo={getBasicInfo}
          />
        )}
      />
      <Route
        exact
        path="/privi-social/:id/feed"
        render={() => <Feed userProfile={userProfile} userId={userId} scrollRef={scrollRef} />}
      />
      <Route exact path="/privi-social/:id/discover" render={() => <Discover />} />
      <Route exact path="/privi-social/:id/claimable-profiles" render={() => <ClaimableProfiles />} />
      {/* <Route exact path="/privi-social/:id/social-token" render={() => <SocialToken />} /> */}
      <Route exact path="/privi-social/:id/messages" render={() => <Messenger />} />
    </Switch>
  );
}
