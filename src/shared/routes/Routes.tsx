import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { useLogin } from "shared/hooks/useLogin";
import { useSlug } from "shared/hooks/useSlug";
import { RootState } from "store/reducers/Reducer";
import PrivateRoute from "./PrivateRoute";
import * as LOADERS from "./Loaders";

const Routes = () => {
  const isLogin = useLogin();
  const [slugSelector, selectedUserId] = useSlug();
  const userSelector = useSelector((state: RootState) => state.user);

  const getProfileUrl = React.useCallback(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      return `/privi-social/${userId}`;
    }
    if (userSelector?.id?.length > 0) {
      return `/privi-social/${userSelector?.id}`;
    }
    return "/";
  }, [userSelector]);

  return (
    <Switch>
      {/*PUBLIC INITIAL ROUTE*/}
      <Route exact path="/" component={LOADERS.PriviHome}>
      </Route>

      {/*PUBLIC ZOO ROUTE*/}
      <Route exact path="/privi-zoo" component={LOADERS.PriviZoo}>
        {isLogin && <Redirect to="/privi-zoo" />}
      </Route>

      {/*PUBLIC ROUTES*/}
      <Route path="/signin" component={LOADERS.SignIn} />
      <Route path="/signup" component={LOADERS.SignUp} />
      <Route path="/forgot" component={LOADERS.ForgotPassword} />
      <Route path="/resend-email" component={LOADERS.ResendEmailValidation} />

      <Route path="/privi-DAO" exact component={LOADERS.PriviDAO} />
      <Route path="/privi-collab" component={LOADERS.PriviCollab} />
      <Route path="/privi-wallet" component={LOADERS.PriviWallet} />
      <Route path="/new-privi-pods" component={LOADERS.PriviPods} />
      <Route path="/privi-music-dao" component={LOADERS.PriviMusicDao} />
      <Route path="/privi-music" exact component={LOADERS.PriviMusic} />
      <Route path="/privi-digital-art" exact component={LOADERS.PriviDigitalArt} />
      <Route path="/privi-digital-art/:idMedia" exact component={LOADERS.PriviDigitalArt} />

      {/*PRIVATE ROUTES*/}
      <PrivateRoute path="/bridge" component={LOADERS.Bridge} />
      <PrivateRoute path="/privi-data-new" component={LOADERS.NewPriviData} />

      {/*PRIVATE REDIRECT ROUTES*/}
      <PrivateRoute
        path="/privi-DAO/:idCommunity"
        render={props => (
          <>
            {slugSelector !== "" && <Redirect to={"/privi-DAO/" + slugSelector} />}
            <LOADERS.PriviDAOPage {...props} />
          </>
        )}
      />
      <PrivateRoute
        path={"/privi-social/:id/social-token"}
        exact
        render={props =>
          window.location.href.includes(slugSelector) ? (
            <LOADERS.PriviSocial {...props} id={selectedUserId} />
          ) : (
            <Redirect to={"/privi-social/" + slugSelector + "/social-token"} />
          )
        }
      />
      <PrivateRoute
        path={"/privi-social/:id"}
        render={props =>
          window.location.href.includes(slugSelector) ? (
            <LOADERS.PriviSocial {...props} id={selectedUserId} />
          ) : (
            <Redirect to={"/privi-social/" + slugSelector} />
          )
        }
      />
      {/* DEFAULT ROUTE */}
      <Route component={LOADERS.PriviHome} />

      {/* LEGACY
      <Route path="/media" exact component={LOADERS.Media} />
      <Route path="/creator" component={LOADERS.CreatorPage} />
      <Route path="/media/:idMedia" exact component={LOADERS.Media} />
      <Route path="/media/artist/:idArtist" exact component={LOADERS.ArtistPage} />
      <Route path="/fractionalisedMedia" component={LOADERS.FractionalisedMediaPage} />
      <Route path="/media/playlist/:idPlaylist" exact component={LOADERS.PlaylistPage} />

      <PrivateRoute path="/boost" component={LOADERS.Boost} />
      <PrivateRoute path="/collab" component={LOADERS.Collab} />
      <PrivateRoute path="/index" exact component={LOADERS.Index} />
      <PrivateRoute path="/growth" exact component={LOADERS.Growth} />
      <PrivateRoute path="/wallet" exact component={LOADERS.Wallet} />
      <PrivateRoute path="/privi-data" component={LOADERS.PriviData} />
      <PrivateRoute exact path="/governance" component={LOADERS.Governance} />
      <PrivateRoute path="/privi-pods" exact component={LOADERS.Pods} />
      <PrivateRoute path="/lendings" exact component={LOADERS.Lendings} />
      <PrivateRoute path="/index/:idIndex" component={LOADERS.IndexPage} />
      <PrivateRoute path="/insurance" exact component={LOADERS.Insurance} />
      <PrivateRoute path="/privi-swap" exact component={LOADERS.SwapMain} />
      <PrivateRoute path="/media/voting" exact component={LOADERS.VotingPage} />
      <PrivateRoute path="/wallet/my-tokens" component={LOADERS.MyTokensPage} />
      <PrivateRoute path="/communities" exact component={LOADERS.Communities} />
      <PrivateRoute path="/media/sale/:slug" exact component={LOADERS.SalePage} />
      <PrivateRoute path="/wallet/my-earnings" component={LOADERS.MyEarningsPage} />
      <PrivateRoute path="/communities/mock" exact component={LOADERS.CommunitiesMock} />
      <PrivateRoute path="/media/auctions/:slug" exact component={LOADERS.AuctionPage} />
      <PrivateRoute path="/growth/articles/:idArticle" component={LOADERS.ArticlePage} />
      <PrivateRoute path="/insurance/pools/:idPool" component={LOADERS.InsurancePoolPage} />
      <PrivateRoute path="/privi-swap/token/:idToken" component={LOADERS.SwapIndividualToken} />
      <PrivateRoute path="/profile/:userId/socialToken/:idSocialToken" component={LOADERS.SocialToken} />

      <PrivateRoute
        path={"/profile/:id"}
        render={props =>
          slugSelector !== "" && selectedUserId ? (
            window.location.href.includes(slugSelector) ? (
              <LOADERS.Profile {...props} id={selectedUserId} />
            ) : (
              <Redirect to={"/profile/" + slugSelector} />
            )
          ) : window.location.href.includes("Px") ? (
            <LOADERS.Profile {...props} />
          ) : (
            <LOADERS.MediaProfile {...props} />
          )
        }
      />
      <PrivateRoute
        path="/communities/:idCommunity"
        render={props => (
          <>
            {slugSelector !== "" && <Redirect to={"/communities/" + slugSelector} />}
            <LOADERS.CommunityPage {...props} />
          </>
        )}
      />
      <PrivateRoute
        path="/privi-pods/FT/:idPod"
        render={props => (
          <>
            {slugSelector !== "" && <Redirect to={"/privi-pods/FT/" + slugSelector} />}
            <LOADERS.PodPage {...props} />
          </>
        )}
      />
      <PrivateRoute
        path="/privi-pods/NFT/:idPod"
        render={props => (
          <>
            {slugSelector !== "" && <Redirect to={"/privi-pods/NFT/" + slugSelector} />}
            <LOADERS.NFTPodPage {...props} />
          </>
        )}
      />
      <PrivateRoute
        path="/privi-pods/MediaNFT/:idPod"
        render={props => (
          <>
            {slugSelector !== "" && <Redirect to={"/privi-pods/MediaNFT/" + slugSelector} />}
            <LOADERS.MediaPodPage {...props} />
          </>
        )}
      />
      <PrivateRoute
        path="/privi-pods/ClaimablePod/:idPod"
        render={props => (
          <>
            {slugSelector !== "" && <Redirect to={"/privi-pods/ClaimablePod/" + slugSelector} />}
            <LOADERS.ClaimablePodPage {...props} />
          </>
        )}
      />
      <PrivateRoute
        path="/lendings/credit-pools/:idPool"
        render={props => (
          <>
            {slugSelector !== "" && <Redirect to={"/lendings/credit-pools/" + slugSelector} />}
            <LOADERS.CreditPoolPage {...props} />
          </>
        )}
      />
      <PrivateRoute
        path="/governance/proposals"
        render={props => (
          <>
            <LOADERS.FullContents {...props} isProposal={true} />
          </>
        )}
      />
      <PrivateRoute
        path="/governance/messages"
        render={props => (
          <>
            <LOADERS.FullContents {...props} isProposal={false} />
          </>
        )}
      />
      <PrivateRoute
        path="/governance/musicdao"
        render={props => (
          <>
            <LOADERS.MusicDao {...props} />
          </>
        )}
      />
      <PrivateRoute
        path="/governance/graph"
        render={props => (
          <>
            <LOADERS.GlobalNumbers {...props} />
          </>
        )}
      />
      <PrivateRoute
        path="/governance/tradearea"
        render={props => (
          <>
            <LOADERS.TradeArea {...props} />
          </>
        )}
      /> */}

    </Switch>
  );
};

export default Routes;
