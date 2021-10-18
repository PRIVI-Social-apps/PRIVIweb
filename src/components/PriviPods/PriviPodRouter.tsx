import React from "react";
import { Switch, Route } from "react-router-dom";
import ClaimMusic from "./subpages/ClaimMusic";
import ClaimMusicPod from "./subpages/ClaimMusic/ClaimMusicPod";
import ClaimVideo from "./subpages/ClaimVideo";
import { FractionalizePodPage } from "./subpages/FractionalizePodPage";
import Fractions from "./subpages/Fractions";
import HomePage from "./subpages/HomePage";
import FollowingPage from "./subpages/Following";
import MediaPod from "./subpages/MediaPod";
import MyPodPage from "./subpages/MyPodPage";
import { PodPage } from "./subpages/PodPage";

export default function PriviPodRouter(props) {
  return (
    <Switch>
      <Route exact path="/new-privi-pods/" component={HomePage} />
      <Route exact path="/new-privi-pods/following" component={FollowingPage} />
      <Route exact path="/new-privi-pods/MediaNFT/:podAddress/" component={PodPage} />
      <Route exact path="/new-privi-pods/FT/:podAddress/" component={PodPage} />
      <Route exact path="/new-privi-pods/claim-music/" component={ClaimMusic} />
      <Route exact path="/new-privi-pods/claim-music/:podAddress/" component={ClaimMusicPod} />
      <Route exact path="/new-privi-pods/claim-video/" component={ClaimVideo} />
      <Route exact path="/new-privi-pods/media-pods/" component={MediaPod} />
      <Route exact path="/new-privi-pods/my-pods/" component={MyPodPage} />
      <Route exact path="/new-privi-pods/fractions/" component={Fractions} />
      <Route exact path="/new-privi-pods/fractions/:podAddress" component={FractionalizePodPage} />
    </Switch>
  );
}
