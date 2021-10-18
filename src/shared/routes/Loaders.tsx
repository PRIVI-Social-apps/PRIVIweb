import loadable from "@loadable/component";

// APPS
export const PriviHome = loadable(() => import("components/PriviHome"));
export const PriviZoo = loadable(() => import("components/PriviZoo"));
export const PriviDAO = loadable(() => import("components/PriviDAO"));
export const PriviPods = loadable(() => import("components/PriviPods"));
export const PriviMusic = loadable(() => import("components/PriviMusic"));
export const NewPriviData = loadable(() => import("components/PriviData"));
export const PriviWallet = loadable(() => import("components/PriviWallet"));
export const PriviSocial = loadable(() => import("components/PriviSocial"));
export const PriviCollab = loadable(() => import("components/PriviCollab"));
export const PriviMusicDao = loadable(() => import("components/PriviMusicDao"));
export const PriviDigitalArt = loadable(() => import("components/PriviDigitalArt"));
export const PriviDAOPage = loadable(() => import("components/PriviDAO/subpages/DAOPage"));
export const PriviDigitalArtMediaPage = loadable(() => import("components/PriviDigitalArt/subpages/MediaPage"));

// SHARED
export const SignIn = loadable(() => import("components/Login/SignIn"));
export const SignUp = loadable(() => import("components/Login/SignUp"));
export const Bridge = loadable(() => import("shared/connectors/bridge/Bridge"));
export const ForgotPassword = loadable(() => import("components/Login/ForgotPassword"));
export const ResendEmailValidation = loadable(() => import("components/Login/ResendEmailValidation"));


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// LEGACY //////////////////////////////////////////////////////////
/*
export const Pods = loadable(() => import("components/legacy/Pods/Pods"));
export const Boost = loadable(() => import("components/legacy/Boost/Boost"));
export const Index = loadable(() => import("components/legacy/Index/Index"));
export const PriviData = loadable(() => import("components/legacy/Data/Data"));
export const Collab = loadable(() => import("components/legacy/Collab/Collab"));
export const Growth = loadable(() => import("components/legacy/Growth/Growth"));
export const Wallet = loadable(() => import("components/legacy/Wallet/Wallet"));
export const Media = loadable(() => import("components/legacy/Media/MediaPage"));
export const Profile = loadable(() => import("components/legacy/Profile/Profile"));
export const SwapMain = loadable(() => import("components/legacy/Swap/Swap-Main"));
export const Lendings = loadable(() => import("components/legacy/Lendings/Lendings"));
export const MusicDao = loadable(() => import("components/legacy/Governance/MusicDao"));
export const PodPage = loadable(() => import("components/legacy/Pods/Pod-Page/PodPage"));
export const Insurance = loadable(() => import("components/legacy/Insurance/Insurance"));
export const TradeArea = loadable(() => import("components/legacy/Governance/TradeArea"));
export const Governance = loadable(() => import("components/legacy/Governance/Governance"));
export const CommunitiesMock = loadable(() => import("components/legacy/Communities/pages"));
export const SalePage = loadable(() => import("components/legacy/Media/Marketplace/SalePage"));
export const NFTPodPage = loadable(() => import("components/legacy/Pods/Pod-Page/NFTPodPage"));
export const Communities = loadable(() => import("components/legacy/Communities/Communities"));
export const FullContents = loadable(() => import("components/legacy/Governance/FullContents"));
export const IndexPage = loadable(() => import("components/legacy/Index/Index-Page/IndexPage"));
export const CreatorPage = loadable(() => import("components/legacy/Media/Creator/CreatorPage"));
export const MediaPodPage = loadable(() => import("components/legacy/Pods/Pod-Page/MediaPodPage"));
export const VotingPage = loadable(() => import("components/legacy/Media/Marketplace/VotingPage"));
export const GlobalNumbers = loadable(() => import("components/legacy/Governance/GovernanceGraph"));
export const PlaylistPage = loadable(() => import("components/legacy/Media/Playlists/PlaylistPage"));
export const MediaProfile = loadable(() => import("components/legacy/Media/MediaProfile/MediaProfile"));
export const AuctionPage = loadable(() => import("components/legacy/Media/Marketplace/AuctionPage/index"));
export const ClaimablePodPage = loadable(() => import("components/legacy/Pods/Pod-Page/ClaimablePodPage"));
export const MyTokensPage = loadable(() => import("components/legacy/Wallet/components/MyTokens/MyTokens"));
export const ArtistPage = loadable(() => import("components/legacy/Wallet/components/MyEarnings/MyEarnings"));
export const CommunityPage = loadable(() => import("components/legacy/Communities/CommunityPage/CommunityPage"));
export const MyEarningsPage = loadable(() => import("components/legacy/Wallet/components/MyEarnings/MyEarnings"));
export const CreditPoolPage = loadable(() => import("components/legacy/Lendings/Credit-Pool-Page/CreditPoolPage"));
export const ArticlePage = loadable(
  () => import("components/legacy/Growth/components/News/ArticlePage/ArticlePage")
);
export const FractionalisedMediaPage = loadable(
  () => import("components/legacy/Media/DigitalArt/FractionalisedMedia")
);
export const SwapIndividualToken = loadable(
  () => import("components/legacy/Swap/Swap-Individual-Token/Swap-Individual-Token")
);
export const InsurancePoolPage = loadable(
  () => import("components/legacy/Insurance/Insurance-Pools/InsurancePool-Page/InsurancePoolPage")
);
export const SocialToken = loadable(() => import("components/legacy/Profile/pages/SocialToken"));
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////