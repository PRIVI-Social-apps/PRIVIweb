import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import axios from "axios";

import {
  Dialog,
  Popper,
  ClickAwayListener,
  Grow,
  Paper,
  MenuList,
  MenuItem,
  InputBase,
  Hidden,
  Box,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { setSelectedUser } from "store/actions/SelectedUser";
import { socket } from "components/Login/Auth";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import SignInModal from "components/Login/SignInModal";
import MediaSellingOfferModal from "shared/ui-kit/Modal/Modals/MediaSellingOfferModal";
import { useNotifications } from "shared/contexts/NotificationsContext";
import URL from "shared/functions/getURL";
import { getUser, getUsersInfoList } from "store/selectors/user";
import { signOut } from "store/actions/User";
import CreateMediaModal from "components/legacy/Media/modals/CreateMediaModal";
import PodCreateNFTMediaModal from "components/legacy/Pods/Pod-Create-NFTMedia-Modal/PodCreateNFTMediaModal";
import CreateCommunityModal from "components/legacy/Communities/modals/CreateCommunity";
import CreateImportSocialTokenModal from "components/legacy/Profile/modals/Create-social-token/CreateImportSocialTokenModal";
import { CreatePriviWalletModal } from "shared/ui-kit/Modal/Modals";
import { WALLETS } from "shared/constants/constants";
import { capitalize } from "shared/helpers/string";
import { getRandomAvatar, getUserAvatar } from "shared/services/user/getUserAvatar";
import { createUserInfo, setUsersInfoList } from "store/actions/UsersInfo";
import CommunityContributionModal from "components/legacy/Communities/CommunityPage/modals/Community-Contribution";
import ShareContributionModal from "components/legacy/Communities/CommunityPage/modals/Share-Contribution";
import { useAuth } from "shared/contexts/AuthContext";
import { useMessages } from "shared/contexts/MessagesContext";
import { _signPayload } from "shared/services/WalletSign";

import { IconContacts } from "./components/Toolbar/IconContacts";
import { IconMessages } from "./components/Toolbar/IconMessages";
import { IconNotifications } from "./components/Toolbar/IconNotifications";
import { IconContactsWhite } from "./components/Toolbar/IconContactsWhite";
import { IconMessagesWhite } from "./components/Toolbar/IconMessagesWhite";
import { IconNotificationsWhite } from "./components/Toolbar/IconNotificationsWhite";
import { ToolbarButtonWithPopper } from "./components/Toolbar/ToolbarButtonWithPopper";
import { MessageNotifications } from "./components/Message/MessageNotifications";
import { NotificationsPopperContent } from "./components/Notifications/NotificationsPopperContent";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import PriviAppIcon from "./components/PriviAppIcon";
import { headerStyles } from "./Header.styles";

import { ReactComponent as NavigationIcon } from "assets/icons/navigation.svg";
import { ReactComponent as SubStratIcon } from "assets/icons/substrat_card.svg";
import { ReactComponent as PriviIcon } from "assets/icons/privi_wallet_card.svg";
import { ReactComponent as GovernanceIcon } from "assets/icons/governance_card.svg";
import { ReactComponent as DefiIcon } from "assets/icons/defi_card.svg";
import { ReactComponent as SearchIcon } from "assets/icons/search_gray.svg";
import PriviNavigation from "./components/PriviNavigation";
import PriviMusicAppNavigation from "./components/PriviMusicAppNavigation";
import useWindowDimensions from "../../hooks/useWindowDimensions";

enum OpenType {
  Home = "HOME",
  Playlist = "PLAYLIST",
  Album = "ALBUM",
  Artist = "ARTIST",
  Liked = "LIKED",
  Library = "LIBRARY",
  Search = "SEARCH",
  Queue = "QUEUE",
}

const Header = props => {
  const classes = headerStyles();

  const [searchValue, setSearchValue] = useState<string>("");
  const pathName = window.location.href;
  const idUrl = pathName.split("/")[5] ? pathName.split("/")[5] : "" + sessionStorage.getItem("userId");

  const { setSignedin } = useAuth();
  const history = useHistory();
  const dispatch = useDispatch();
  const userSelector = useSelector(getUser);
  const usersInfoList = useSelector(getUsersInfoList);

  const width = useWindowDimensions().width;

  const {
    unreadNotifications,
    notifications,
    dismissNotification,
    markAllNotificationsAsRead,
    removeNotification,
  } = useNotifications();

  const { unreadMessages } = useMessages();
  const { activate, account } = useWeb3React();

  const [userId, setUserId] = useState<string>("");
  const [ownUser, setOwnUser] = useState<boolean>(idUrl === sessionStorage.getItem("userId"));
  const [userProfile, setUserProfile] = useState<any>({});
  const [status, setStatus] = useState<any>("");
  const [openSignInModal, setOpenSignInModal] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [openMediaModal, setOpenMediaModal] = useState<boolean>(false);
  const [openPodCreateModal, setOpenPodCreateModal] = useState<boolean>(false);
  const [openCreateCommunityModal, setOpenCreateCommunityModal] = useState<boolean>(false);
  const [openCreateSocialTokenModal, setOpenCreateSocialTokenModal] = useState<boolean>(false);
  const [openNotificationModal, setOpenNotificationModal] = useState<boolean>(false);
  const [openMessagesModal, showMessagesModal] = useState<boolean>(false);
  const [openContributionModal, setOpenContributionModal] = useState(false);
  const [openModalShareContribution, setOpenModalShareContribution] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [communityAddress, setCommunityAddress] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<any>();
  const [openPriviWalletDialog, setOpenPriviWalletDialog] = useState<boolean>(false);
  const [walletsList, setWalletsList] = useState([]);
  const [numberMessages, setNumberMessages] = useState<number>(0);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [arrowEl, setArrowEl] = React.useState<null | HTMLElement>(null);

  const [appAnchorEl, setAppAnchorEl] = React.useState<null | HTMLElement>(null);

  const [hideNotificationsModal, setHideNotificationsModal] = useState<boolean>(false);

  const popperOpen = Boolean(anchorEl);
  const popperId = popperOpen ? "spring-popper" : undefined;

  const appPopperOpen = Boolean(appAnchorEl);

  const [openMobileMenu, setOpenMobileMenu] = React.useState<boolean>(false);
  const anchorMobileMenuRef = React.useRef<HTMLDivElement>(null);

  const handleOpenMobileMenu = (event: React.MouseEvent<EventTarget>) => {
    event.stopPropagation();
    setOpenMobileMenu(true);
  };

  const handleCloseMobileMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorMobileMenuRef.current && anchorMobileMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpenMobileMenu(false);
  };

  const handleListKeyDownMobileMenu = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenMobileMenu(false);
    }
  };

  const handleOpenWalletDialog = () => {
    setOpenPriviWalletDialog(true);
  };
  const handleCloseWalletDialog = () => {
    setOpenPriviWalletDialog(false);
  };
  const handleCreatePopup = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMediaModal = () => {
    setOpenMediaModal(false);
  };

  const handleClosePodCreateModal = () => {
    setOpenPodCreateModal(false);
  };

  const handleCloseCreateCommunityModal = () => {
    setOpenCreateCommunityModal(false);
  };

  const handleCloseSocialTokenModal = () => {
    setOpenCreateSocialTokenModal(false);
  };

  const handleLogout = () => {
    setSignedin(false);
    dispatch(signOut());
    localStorage.clear();
    sessionStorage.clear();
    history.push("/");
    window.location.reload();
  };

  const [openModalMediaSellingOffer, setOpenModalMediaSellingOffer] = useState<boolean>(false);

  const handleOpenModalMediaSellingOffer = () => {
    setOpenModalMediaSellingOffer(true);
  };

  const handleCloseModalMediaSellingOffer = () => {
    setOpenModalMediaSellingOffer(false);
  };

  const handleOpenContributionModal = () => {
    setOpenNotificationModal(false);
    setOpenContributionModal(true);
  };

  const handleCloseContributionModal = () => {
    setOpenContributionModal(false);
  };

  const handleOpenModalShareContribution = () => {
    setOpenModalShareContribution(true);
  };

  const handleCloseModalShareContribution = () => {
    setOpenModalShareContribution(false);
  };

  const handleShareCommunity = () => {
    handleCloseContributionModal();
    handleOpenModalShareContribution();
  };

  const viewMore = notification => {
    setOpenNotificationModal(false);
    switch (notification.type) {
      case 113:
        handleOpenModalMediaSellingOffer();
        break;
      case 115:
        history.push(`/communities/${notification.otherItemId}`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setUserId(userSelector.id);
    setOwnUser(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idUrl, userSelector]);

  useEffect(() => {
    if (userId && userId.length > 0) {
      if (socket) {
        socket.on("user_connect_status", connectStatus => {
          if (connectStatus.userId === userId) {
            let setterUser: any = { ...userProfile };
            setterUser.connected = connectStatus.connected;
            setUserProfile(setterUser);
          }
        });
      }
    }
  }, [userId, userProfile]);

  useEffect(() => {
    setNumberMessages(unreadMessages);
  }, [unreadMessages]);

  useEffect(() => {
    if (!usersInfoList || usersInfoList.length === 0) {
      axios
        .post(`${URL()}/chat/getUsers`)
        .then(response => {
          if (response.data.success) {
            //should be remove user's id from the list ?? so they don't message themselves
            // const allUsers = [...response.data.data].filter(user => user.id !== userSelector.id) ?? [];
            const allUsers = response.data.data;
            const u = [] as any[];
            allUsers.forEach(user => {
              let image = "";
              if (
                user.anon != undefined &&
                user.anon === true &&
                user.anonAvatar &&
                user.anonAvatar.length > 0
              ) {
                image = `${require(`assets/anonAvatars/${user.anonAvatar}`)}`;
              } else {
                if (user.hasPhoto && user.url) {
                  image = `${user.url}?${Date.now()}`;
                }
              }
              user.imageUrl = image;
              user.assistances = user.assistances ?? 0;
              user.rate = user.rate ?? 0;

              u.push(
                createUserInfo(
                  user.id,
                  `${user.firstName ? user.firstName : ""} ${user.lastName ? user.lastName : ""}`,
                  user.address ?? "",
                  user.mnemonic ?? "",
                  image,
                  user.level ?? 1,
                  user.numFollowers || 0,
                  user.numFollowings || 0,
                  user.creds.length ?? 0,
                  user.badges ?? [],
                  user.urlSlug ??
                    `${user.firstName ? user.firstName : ""}${user.lastName ? user.lastName : ""}`,
                  user.twitter ?? "",
                  user.anon ?? false,
                  user.verified ?? false,
                  user.MediaLikes?.length ?? 0,
                  user.profileViews ?? 0,
                  user.awards?.length ?? 0,
                  user.trustScore ?? 0,
                  user.endorsementScore ?? 0,
                  user.bio ?? "",
                  user.isExternalUser ?? false,
                  user.connected ?? false,
                  user.rate ?? 0,
                  user.imageUrl ?? "",
                  user.assistances ?? 0,
                  user.anonAvatar ?? "",
                  user.backgroundURL ?? "",
                  user.hasPhoto ?? false,
                  user.myMediasCount ?? 0,
                  user.url ?? "",
                  user.wallets ?? [],
                  user.email ?? ""
                )
              );
            });
            allUsers.sort((user1, user2) => {
              const name1 = user1.firstName || user1.urlSlug;
              const name2 = user2.firstName || user2.urlSlug;
              if (name1.startsWith("0x") && name2.startsWith("0x")) return name1.localeCompare(name2);
              if (name1.startsWith("0x")) return 1;
              if (name2.startsWith("0x")) return -1;
              return capitalize(name1).localeCompare(capitalize(name2));
            });
            setUsers(allUsers);
            setFilteredUsers(allUsers);
            const dispatchUsers = async () => {
              await dispatch(setUsersInfoList(u));
            };

            dispatchUsers();
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      const allUsers = usersInfoList.filter(user => user.id !== userSelector.id) ?? [];
      allUsers.forEach(user => {
        let image = "";
        if (user.anon != undefined && user.anon === true && user.anonAvatar && user.anonAvatar.length > 0) {
          image = `${require(`assets/anonAvatars/${user.anonAvatar}`)}`;
        } else {
          if (user.hasPhoto && user.url) {
            image = `${user.url}?${Date.now()}`;
          }
        }
        user.imageUrl = image;
        user.assistances = user.assistances ?? 0;
        user.rate = user.rate ?? 0;
      });
      setFilteredUsers(allUsers);
    }
  }, [usersInfoList, userSelector.id]);

  useEffect(() => {
    console.log(
      '--pathName.toLowerCase().includes("privi-home")--',
      pathName.toLowerCase().includes("privi-home")
    );
    if (
      pathName.toLowerCase().includes("privi-music") ||
      pathName.toLowerCase().includes("new-privi-pods") ||
      pathName.toLowerCase().includes("privi-digital-art") ||
      pathName.toLowerCase().includes("privi-data-new") ||
      pathName.toLowerCase().includes("privi-wallet") ||
      pathName.toLowerCase().includes("privi-dao") ||
      pathName.toLowerCase().includes("privi-social") ||
      pathName.toLowerCase().includes("privi-collab") ||
      pathName.toLowerCase().includes("privi-music-dao") ||
      pathName.toLowerCase().includes("privi-zoo") ||
      pathName.toLowerCase().includes("privi-home")
    ) {
      setIsHideHeader(true);
    } else {
      setIsHideHeader(false);
    }

    if (pathName.toLowerCase().includes("privi-dao") || pathName.toLowerCase().includes("privi-data-new")) {
      setIsTransparent(true);
    } else {
      setIsTransparent(false);
    }

    if (pathName.toLowerCase().includes("privi-data-new")) {
      setIsPriviData(true);
    } else {
      setIsPriviData(false);
    }
    if (pathName.toLowerCase().includes("privi-music-dao")) {
      setIsPriviMusicDao(true);
    } else {
      setIsPriviMusicDao(false);
    }

    if (pathName.toLowerCase().includes("privi-wallet")) {
      setIsWallet(true);
    } else {
      setIsWallet(false);
    }

    let className = "privi-app-header";
    if (pathName.toLowerCase().includes("privi-dao")) {
      className += " privi-dao";
    } else if (pathName.toLowerCase().includes("privi-data-new")) {
      className += " privi-data";
    } else if (pathName.toLowerCase().includes("privi-digital-art")) {
      className += " privi-digital-art";
    } else if (pathName.toLowerCase().includes("privi-music-dao")) {
      className += " privi-music-dao";
    }

    setAppHeaderBackgroundColor(className);
  }, [pathName, width]);

  useEffect(() => {
    if (account) handleWallet(account);
  }, [account]);

  const goToProfile = (event, selectedUser) => {
    setAutocompleteKey(new Date().getTime());
    setSearchValue("");
    // if (selectedUser.urlSlug && selectedUser.urlSlug.length > 0) {
    //   dispatch(setSelectedUser(selectedUser.urlSlug));
    //   history.push(`/privi-social/${selectedUser.urlSlug}`);
    // }
    // else {
    dispatch(setSelectedUser(selectedUser.id));
    history.push(`/privi-social/${selectedUser.id}`);
    // }
  };

  const handleUserSelect = (event, newValue) => {
    if (newValue) {
      setSearchValue(newValue);
      // reset search query
      setAutocompleteKey(new Date().getTime());
      goToProfile(null, newValue);
    }
  };

  const handleWallet = async (address: string) => {
    const userId = sessionStorage.getItem("userId");

    if (address) {
      axios
        .post(`${URL()}/wallet/registerUserEthAccount`, {
          walletType: "Metamask",
          walletName: "Metamask",
          userId,
          address,
          walletStatus: true,
        })
        .then(res => {
          //console.log("RES - ", res);
          if (res.data.success) {
            //console.log("===========success");
          }
        })
        .catch(err => {
          console.error("handleConnect getUserRegisteredEthAccount failed", err);
        });
    }
  };

  const handleConnectMetamask = () => {
    const metaMaskWalletInfo = WALLETS[1]; // Meta mask connector
    const { connector } = metaMaskWalletInfo;
    if (connector) {
      activate(connector, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector);
        } else {
          console.info("Connection Error - ", error);
        }
      });
    }
  };

  const [isHideHeader, setIsHideHeader] = useState<boolean>(false);
  const [isTransparent, setIsTransparent] = useState<boolean>(false);
  const [isPriviData, setIsPriviData] = useState<boolean>(false);
  const [isPriviMusicDao, setIsPriviMusicDao] = useState<boolean>(false);
  const [isWallet, setIsWallet] = useState<boolean>(false);
  const [appHeaderBackgroundColor, setAppHeaderBackgroundColor] = useState<string>("privi-app-header");

  const getAppsPopover = () => {
    return (
      <Popper
        open={appPopperOpen}
        anchorEl={appAnchorEl}
        placement="bottom-end"
        style={{ zIndex: 1000 }}
        modifiers={{
          offset: {
            enabled: true,
            offset: "20, 0",
          },
        }}
      >
        <ClickAwayListener
          onClickAway={() => {
            setAppAnchorEl(null);
          }}
        >
          <div className={classes.appPopover}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #18181822",
                paddingBottom: "20px",
              }}
            >
              <div>My apps</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <PrimaryButton size="small" onClick={() => {}}>
                  See All
                </PrimaryButton>
                <SecondaryButton size="small" onClick={() => {}}>
                  Edit
                </SecondaryButton>
              </div>
            </div>
            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  className="itemBox"
                  onClick={() => {
                    setAppAnchorEl(null);
                    history.push(`/privi-zoo/music`);
                  }}
                >
                  <div style={{ marginRight: "16px" }}>
                    <SubStratIcon style={{ color: "red", fill: "red" }} />
                  </div>
                  <div>
                    <div>Community DAO</div>
                    <div>Few words of app description. an optional content. </div>
                  </div>
                </div>
                <div
                  className="itemBox"
                  onClick={() => {
                    setAppAnchorEl(null);
                    history.push(`/privi-zoo/music`);
                  }}
                >
                  <div style={{ marginRight: "16px" }}>
                    <PriviIcon style={{ color: "red", fill: "red" }} />
                  </div>
                  <div>
                    <div>Privi Wallet</div>
                    <div>Few words of app description. an optional content. </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  className="itemBox"
                  onClick={() => {
                    setAppAnchorEl(null);
                    history.push(`/privi-zoo/music`);
                  }}
                >
                  <div style={{ marginRight: "16px" }}>
                    <GovernanceIcon style={{ color: "red", fill: "red" }} />
                  </div>
                  <div>
                    <div>Governance</div>
                    <div>Few words of app description. an optional content. </div>
                  </div>
                </div>
                <div
                  className="itemBox"
                  onClick={() => {
                    setAppAnchorEl(null);
                    history.push(`/privi-zoo/music`);
                  }}
                >
                  <div style={{ marginRight: "16px" }}>
                    <DefiIcon style={{ color: "red", fill: "red" }} />
                  </div>
                  <div>
                    <div>Community</div>
                    <div>Few words of app description. an optional content. </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SecondaryButton size="medium" onClick={() => {}} style={{ marginTop: "16px" }}>
                Discover More Apps
              </SecondaryButton>
            </div>
          </div>
        </ClickAwayListener>
      </Popper>
    );
  };

  const getPriviMusicDaoSelected = () => {
    if (pathName.toLowerCase().includes("privi-music-dao")) {
      if (pathName.toLocaleLowerCase().includes("staking")) {
        return "Staking";
      } else if (pathName.toLocaleLowerCase().includes("/liquidity")) {
        return "Add Liquidity";
      } else if (pathName.toLocaleLowerCase().includes("/governance")) {
        return "Governance";
      } else if (pathName.toLocaleLowerCase().includes("/high_yield")) {
        return "High Yield";
      } else if (pathName.toLocaleLowerCase().includes("/claimable-music")) {
        return "Claimable Music";
      } else if (pathName.toLocaleLowerCase().includes("/music")) {
        return "Music";
      } else if (pathName.toLocaleLowerCase().includes("/pods")) {
        return "Pods";
      }
    }
    return "Home";
  };

  const getPriviDataSelected = () => {
    if (pathName.toLowerCase().includes("privi-data-new")) {
      if (pathName.toLocaleLowerCase().includes("home")) {
        return "Home";
      } else if (pathName.toLocaleLowerCase().includes("advertise")) {
        return "Advertise";
      } else if (pathName.toLocaleLowerCase().includes("buydatap")) {
        return "Buy DATAp";
      } else if (pathName.toLocaleLowerCase().includes("governance")) {
        return "Governance";
      }
    }
    return "Home";
  };

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  return (

    <div className={classes.header}>
      <div className={isTransparent ? "transparent" : isHideHeader ? appHeaderBackgroundColor : ""}>
        <div className="header-left">
          {isWallet ? (
            <img src={require("assets/logos/privi_wallet_2.png")} alt="privi wallet" />
          ) : !isHideHeader ? (
            <>
              <div className="header-title">PRIVI</div>
              <img className="header-logo" src={require(`assets/logos/PRIVILOGO.png`)} alt="privi logo" />
            </>
          ) : (
            <PriviAppIcon openTab={props.openTab} isTransparent={isTransparent} />
          )}
          <Hidden mdDown>
            {!isPriviMusicDao &&
              (!props.openTab || (props.openTab && props.openTab.type !== OpenType.Search)) &&
              !isPriviData && (
                <div
                  className={"header-input"}
                  onClick={
                    pathName.toLowerCase().includes("privi-music") ||
                    (pathName.toLowerCase().includes("privi-digital-art") &&
                      props.handleOpenSearcher !== undefined)
                      ? props.handleOpenSearcher
                      : undefined
                  }
                >
                  <Autocomplete
                    id="autocomplete-0"
                    className="autocomplete"
                    style={{ width: "calc(100% - 17px)" }}
                    freeSolo
                    clearOnBlur
                    value={searchValue}
                    key={autocompleteKey}
                    onChange={(event: any, newValue: any | null) => {
                      handleUserSelect(event, newValue);
                    }}
                    options={["", ...filteredUsers]}
                    renderOption={(option, { selected }) => {
                      if (option)
                        return (
                          <React.Fragment>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                borderBottom: "1px solid #EFF2F8",
                                width: "100%",
                                paddingBottom: "10px",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {option !== "" ? (
                                  <div
                                    style={{
                                      backgroundImage:
                                        typeof option !== "string" && option.imageUrl
                                          ? `url(${option.imageUrl})`
                                          : `url(${getRandomAvatar()})`,
                                      backgroundRepeat: "no-repeat",
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                      cursor: "pointer",
                                      border: "1.5px solid #FFFFFF",
                                      marginRight: 14,
                                      width: 30,
                                      minWidth: 30,
                                      height: 30,
                                      backgroundColor: "#F7F9FE",
                                      borderRadius: "50%",
                                    }}
                                  />
                                ) : null}
                                <div
                                  style={{
                                    color: "black",
                                    fontSize: 14,
                                    fontFamily: "Agrandir",
                                  }}
                                >
                                  {typeof option !== "string" ? (
                                    <span>{capitalize(option.firstName) || option.urlSlug}</span>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                              <div
                                style={{
                                  color: "#29E8DC",
                                  fontSize: 14,
                                  display: "flex",
                                  alignItems: "center",
                                  fontFamily: "Agrandir",
                                }}
                              >
                                <img
                                  src={require("assets/navbarIcons/profile.png")}
                                  alt={""}
                                  style={{ marginLeft: 10, width: 30, height: 30 }}
                                />
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      else return null;
                    }}
                    getOptionLabel={option =>
                      option && option !== undefined && option !== "" && typeof option !== "string"
                        ? capitalize(option.firstName) || option.urlSlug
                        : ""
                    }
                    renderInput={params => (
                      <InputBase
                        ref={params.InputProps.ref}
                        inputProps={params.inputProps}
                        autoFocus
                        placeholder={`Search Privi ${
                          pathName.toLowerCase().includes("privi-music")
                            ? "Music"
                            : pathName.toLowerCase().includes("privi-digital-art")
                            ? "Digital Art"
                            : pathName.toLowerCase().includes("privi-wallet")
                            ? "Wallet"
                            : pathName.includes("new-privi-pods")
                            ? "Pods"
                            : pathName.includes("privi-zoo")
                            ? "Apps"
                            : ""
                        }`}
                        style={{ fontFamily: "Agrandir", width: "100%" }}
                      />
                    )}
                  />
                  <img
                    src={require(`assets/icons/${
                      !props.openTab ||
                      !pathName.toLowerCase().includes("privi-music") ||
                      !pathName.toLowerCase().includes("new-privi-pods") ||
                      (props.openTab &&
                        (props.openTab.type === OpenType.Search || props.openTab.type === OpenType.Home))
                        ? "search"
                        : "search_white"
                    }.png`)}
                    alt={""}
                    style={{ width: 17, height: 17 }}
                  />
                </div>
              )}
            {isPriviData && (
              <PriviNavigation
                navigations={["Home", "Advertise", "Buy DATAp", "Governance"]}
                selected={getPriviDataSelected()}
                onNavSelect={nav => {
                  nav === "Home"
                    ? history.push("/privi-data-new/")
                    : nav === "Advertise"
                    ? history.push("/privi-data-new/advertise/")
                    : nav === "Buy DATAp"
                    ? history.push("/privi-data-new/buydatap/")
                    : nav === "Governance"
                    ? history.push("/privi-data-new/governance/")
                    : history.push("/privi-data-new/");
                }}
              />
            )}
          </Hidden>
          {isPriviMusicDao && (
            <Hidden mdDown={width < 750}>
              <PriviMusicAppNavigation />
            </Hidden>
          )}
        </div>
        <div className="header-right">
          <CreatePriviWalletModal
            open={openPriviWalletDialog}
            handleClose={handleCloseWalletDialog}
            handleOk={() => {
              setOpenPriviWalletDialog(false);
              history.push("/create-privi-wallet");
            }}
          />
          {isSignedIn() ? (
            <>
              <Hidden mdDown={pathName.toLocaleLowerCase().includes("privi-music-dao")}>
                <div className="header-icons">
                  {!isPriviMusicDao && (
                    <div
                      id="header-popup-contact"
                      aria-describedby={popperId}
                      onClick={handleCreatePopup}
                      style={{ display: "flex" }}
                    >
                      <ToolbarButtonWithPopper
                        theme={isTransparent ? "dark" : "light"}
                        tooltip="Contact"
                        icon={
                          !props.openTab ||
                          !pathName.toLowerCase().includes("privi-music") ||
                          !pathName.toLowerCase().includes("new-privi-pods") ||
                          (props.openTab &&
                            (props.openTab.type === OpenType.Search || props.openTab.type === OpenType.Home))
                            ? IconContacts
                            : IconContactsWhite
                        }
                        noPopup
                      />
                    </div>
                  )}
                  {isPriviMusicDao && (
                    <div
                      id="header-popup-contact"
                      aria-describedby={popperId}
                      onClick={handleCreatePopup}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "16px",
                        cursor: "pointer",
                      }}
                    >
                      <SearchIcon style={{ width: "24px", height: "24px" }} />
                    </div>
                  )}
                  <ToolbarButtonWithPopper
                    theme={isTransparent ? "dark" : "light"}
                    tooltip="Messages"
                    icon={
                      !props.openTab ||
                      !pathName.toLowerCase().includes("privi-music") ||
                      !pathName.toLowerCase().includes("new-privi-pods") ||
                      (props.openTab &&
                        (props.openTab.type === OpenType.Search || props.openTab.type === OpenType.Home))
                        ? IconMessages
                        : IconMessagesWhite
                    }
                    badge={numberMessages > 0 ? numberMessages.toString() : undefined}
                    openToolbar={openMessagesModal}
                    handleOpenToolbar={showMessagesModal}
                  >
                    <MessageNotifications handleClosePopper={() => showMessagesModal(false)} />
                  </ToolbarButtonWithPopper>
                  <ToolbarButtonWithPopper
                    theme={isTransparent ? "dark" : "light"}
                    tooltip="Notifications"
                    icon={
                      !props.openTab ||
                      !pathName.toLowerCase().includes("privi-music") ||
                      !pathName.toLowerCase().includes("new-privi-pods") ||
                      (props.openTab &&
                        (props.openTab.type === OpenType.Search || props.openTab.type === OpenType.Home))
                        ? IconNotifications
                        : IconNotificationsWhite
                    }
                    badge={unreadNotifications > 0 ? unreadNotifications.toString() : undefined}
                    onIconClick={markAllNotificationsAsRead}
                    openToolbar={openNotificationModal}
                    handleOpenToolbar={setOpenNotificationModal}
                    hidden={hideNotificationsModal}
                  >
                    <NotificationsPopperContent
                      theme={isTransparent ? "dark" : "light"}
                      notifications={notifications}
                      onDismissNotification={dismissNotification}
                      removeNotification={removeNotification}
                      onRefreshAllProfile={() => null}
                      viewMore={value => viewMore(value)}
                      setSelectedNotification={setSelectedNotification}
                      handleShowContributionModal={handleOpenContributionModal}
                      handleClosePopper={() => {
                        setOpenNotificationModal(false);
                        setHideNotificationsModal(false);
                      }}
                      handleHidePopper={() => {
                        setHideNotificationsModal(true);
                      }}
                    />
                  </ToolbarButtonWithPopper>
                </div>
                <Hidden mdDown>
                  {userSelector.address ? (
                    <div className="header-buttons">
                      {!isPriviMusicDao && !isPriviData && (
                        <PrimaryButton
                          size="medium"
                          id="header-popup-create"
                          aria-describedby={popperId}
                          onClick={handleCreatePopup}
                        >
                          Create
                        </PrimaryButton>
                      )}
                      {(isPriviMusicDao || isPriviData) && (
                        <SecondaryButton
                          size="medium"
                          id="header-popup-create"
                          aria-describedby={popperId}
                          onClick={handleConnectMetamask}
                          isRounded
                        >
                          My Wallet
                        </SecondaryButton>
                      )}
                      {isPriviMusicDao && (
                        <PrimaryButton
                          className={classes.musicApp}
                          size="medium"
                          isRounded
                          onClick={() => history.push("/privi-music-dao/music")}
                        >
                          Music App
                          <img src={require("assets/musicDAOImages/music-icon.png")} alt="icon" />
                        </PrimaryButton>
                      )}
                      {(pathName.toLowerCase().includes("privi-zoo") || isPriviData || isWallet) && (
                        <SecondaryButton
                          size="medium"
                          onClick={e => setAppAnchorEl(e.currentTarget)}
                          style={{ background: "#4218B5", color: "white" }}
                          isRounded={isPriviMusicDao}
                        >
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ marginRight: "8px" }}>Apps</div>
                            <NavigationIcon />
                          </div>
                        </SecondaryButton>
                      )}
                      {(pathName.toLowerCase().includes("privi-zoo") || isPriviData || isWallet) &&
                        getAppsPopover()}
                      {!isPriviMusicDao && !isPriviData && !isWallet && (
                        <PrimaryButton size="medium" onClick={handleConnectMetamask}>
                          My Wallet
                        </PrimaryButton>
                      )}
                    </div>
                  ) : (
                    <div className="header-buttons">
                      <button className={classes.header_secondary_button} onClick={handleOpenWalletDialog}>
                        Get Privi Wallet
                      </button>
                    </div>
                  )}
                </Hidden>
                <div className="avatar-container">
                  <div
                    id="header-popup-wallet"
                    aria-describedby={popperId}
                    onClick={handleCreatePopup}
                    className="avatar"
                    style={{
                      backgroundImage: userSelector.id
                        ? `url(${getUserAvatar({
                            id: userSelector.id,
                            anon: userSelector.anon,
                            hasPhoto: userSelector.hasPhoto,
                            anonAvatar: userSelector.anonAvatar,
                            url: userSelector.url,
                          })})`
                        : "none",
                      cursor: ownUser ? "pointer" : "auto",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
              </Hidden>
              {isPriviMusicDao && (
                <Hidden lgUp>
                  <div ref={anchorMobileMenuRef} onClick={handleOpenMobileMenu}>
                    <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                      <path
                        d="M1 1H17M1 6H17M1 11H17"
                        stroke="#727F9A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <Popper
                    open={openMobileMenu}
                    anchorEl={anchorMobileMenuRef.current}
                    transition
                    disablePortal={false}
                    placement="bottom"
                    style={{ position: "inherit", zIndex: 9999 }}
                  >
                    {({ TransitionProps }) => (
                      <Grow {...TransitionProps}>
                        <Paper className={classes.mobilePopup}>
                          <ClickAwayListener onClickAway={handleCloseMobileMenu}>
                            <MenuList
                              autoFocusItem={openMobileMenu}
                              id="header-right-menu-list-grow"
                              onKeyDown={handleListKeyDownMobileMenu}
                            >
                              <MenuItem>
                                <div className="avatar-container">
                                  <div
                                    onClick={handleCreatePopup}
                                    className="avatar"
                                    style={{
                                      backgroundImage: userSelector.id
                                        ? `url(${getUserAvatar({
                                            id: userSelector.id,
                                            anon: userSelector.anon,
                                            hasPhoto: userSelector.hasPhoto,
                                            anonAvatar: userSelector.anonAvatar,
                                            url: userSelector.url,
                                          })})`
                                        : "none",
                                      cursor: ownUser ? "pointer" : "auto",
                                      backgroundRepeat: "no-repeat",
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                    }}
                                  />
                                </div>
                                My Profile
                              </MenuItem>
                              <PrimaryButton
                                className={classes.musicApp}
                                size="medium"
                                isRounded
                                onClick={() => history.push("/privi-music-dao/music")}
                              >
                                Music App
                                <img src={require("assets/musicDAOImages/music-icon.png")} alt="icon" />
                              </PrimaryButton>
                              <MenuItem>
                                <svg
                                  width="20"
                                  height="14"
                                  viewBox="0 0 20 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12 7.00002V7.01001M3 13H17C18.1046 13 19 12.1046 19 11V3C19 1.89543 18.1046 1 17 1H3C1.89543 1 1 1.89543 1 3V11C1 12.1046 1.89543 13 3 13ZM19 4H12C10.3431 4 9 5.34315 9 7C9 8.65685 10.3431 10 12 10H19V4Z"
                                    stroke="#767676"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                My Wallets
                              </MenuItem>
                              <MenuItem>
                                <svg
                                  width="19"
                                  height="19"
                                  viewBox="0 0 19 19"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M17.6464 18.3536C17.8417 18.5488 18.1583 18.5488 18.3536 18.3536C18.5488 18.1583 18.5488 17.8417 18.3536 17.6464L17.6464 18.3536ZM15.5 8.5C15.5 12.366 12.366 15.5 8.5 15.5V16.5C12.9183 16.5 16.5 12.9183 16.5 8.5H15.5ZM8.5 15.5C4.63401 15.5 1.5 12.366 1.5 8.5H0.5C0.5 12.9183 4.08172 16.5 8.5 16.5V15.5ZM1.5 8.5C1.5 4.63401 4.63401 1.5 8.5 1.5V0.5C4.08172 0.5 0.5 4.08172 0.5 8.5H1.5ZM8.5 1.5C12.366 1.5 15.5 4.63401 15.5 8.5H16.5C16.5 4.08172 12.9183 0.5 8.5 0.5V1.5ZM18.3536 17.6464L14.166 13.4589L13.4589 14.166L17.6464 18.3536L18.3536 17.6464Z"
                                    fill="#767676"
                                  />
                                </svg>
                                Search
                              </MenuItem>
                              <MenuItem>
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M1.00003 9.50003C0.996587 10.8199 1.30496 12.1219 1.90003 13.3C2.6056 14.7118 3.69028 15.8992 5.03258 16.7293C6.37488 17.5594 7.92179 17.9994 9.50003 18C10.8199 18.0035 12.1219 17.6951 13.3 17.1L19 19L17.1 13.3C17.6951 12.1219 18.0035 10.8199 18 9.50003C17.9994 7.92179 17.5594 6.37488 16.7293 5.03258C15.8992 3.69028 14.7118 2.6056 13.3 1.90003C12.1219 1.30496 10.8199 0.996587 9.50003 1.00003H9.00003C6.91568 1.11502 4.94699 1.99479 3.47089 3.47089C1.99479 4.94699 1.11502 6.91568 1.00003 9.00003V9.50003Z"
                                    stroke="#767676"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                Messages
                              </MenuItem>
                              <MenuItem>
                                <svg
                                  width="18"
                                  height="20"
                                  viewBox="0 0 18 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M1 15L0.552786 14.7764C0.475289 14.9314 0.483571 15.1155 0.574675 15.2629C0.665778 15.4103 0.826711 15.5 1 15.5V15ZM17 15V15.5C17.1733 15.5 17.3342 15.4103 17.4253 15.2629C17.5164 15.1155 17.5247 14.9314 17.4472 14.7764L17 15ZM3.5 7C3.5 3.96243 5.96243 1.5 9 1.5V0.5C5.41015 0.5 2.5 3.41015 2.5 7H3.5ZM9 1.5C12.0376 1.5 14.5 3.96243 14.5 7H15.5C15.5 3.41015 12.5899 0.5 9 0.5V1.5ZM2.5 7C2.5 8.92437 2.01734 10.8668 1.52566 12.3419C1.28082 13.0764 1.03603 13.6883 0.852927 14.1155C0.761431 14.329 0.685487 14.4961 0.632846 14.6089C0.60653 14.6653 0.586052 14.7081 0.572381 14.7363C0.565547 14.7504 0.560415 14.7609 0.557109 14.7676C0.555455 14.771 0.554258 14.7734 0.553533 14.7749C0.55317 14.7756 0.552925 14.7761 0.5528 14.7764C0.552738 14.7765 0.552705 14.7766 0.552703 14.7766C0.552702 14.7766 0.552722 14.7765 0.552722 14.7765C0.55275 14.7765 0.552786 14.7764 1 15C1.44721 15.2236 1.44726 15.2235 1.44732 15.2234C1.44735 15.2233 1.44742 15.2232 1.44748 15.2231C1.4476 15.2228 1.44775 15.2225 1.44793 15.2222C1.44829 15.2215 1.44877 15.2205 1.44937 15.2193C1.45056 15.2169 1.45224 15.2135 1.45437 15.2092C1.45863 15.2005 1.46473 15.188 1.47254 15.1719C1.48817 15.1396 1.51066 15.0926 1.53903 15.0318C1.59576 14.9102 1.67607 14.7335 1.77207 14.5095C1.96397 14.0617 2.21918 13.4236 2.47434 12.6581C2.98266 11.1332 3.5 9.07563 3.5 7H2.5ZM1 15.5H17V14.5H1V15.5ZM17 15C17.4472 14.7764 17.4473 14.7765 17.4473 14.7765C17.4473 14.7765 17.4473 14.7766 17.4473 14.7766C17.4473 14.7766 17.4473 14.7765 17.4472 14.7764C17.4471 14.7761 17.4468 14.7756 17.4465 14.7749C17.4457 14.7734 17.4445 14.771 17.4429 14.7676C17.4396 14.7609 17.4345 14.7504 17.4276 14.7363C17.4139 14.7081 17.3935 14.6653 17.3672 14.6089C17.3145 14.4961 17.2386 14.329 17.1471 14.1155C16.964 13.6883 16.7192 13.0764 16.4743 12.3419C15.9827 10.8668 15.5 8.92437 15.5 7H14.5C14.5 9.07563 15.0173 11.1332 15.5257 12.6581C15.7808 13.4236 16.036 14.0617 16.2279 14.5095C16.3239 14.7335 16.4042 14.9102 16.461 15.0318C16.4893 15.0926 16.5118 15.1396 16.5275 15.1719C16.5353 15.188 16.5414 15.2005 16.5456 15.2092C16.5478 15.2135 16.5494 15.2169 16.5506 15.2193C16.5512 15.2205 16.5517 15.2215 16.5521 15.2222C16.5523 15.2225 16.5524 15.2228 16.5525 15.2231C16.5526 15.2232 16.5526 15.2233 16.5527 15.2234C16.5527 15.2235 16.5528 15.2236 17 15ZM11.5 16C11.5 17.3807 10.3807 18.5 9 18.5V19.5C10.933 19.5 12.5 17.933 12.5 16H11.5ZM9 18.5C7.61929 18.5 6.5 17.3807 6.5 16H5.5C5.5 17.933 7.067 19.5 9 19.5V18.5ZM6.5 16V15H5.5V16H6.5ZM12.5 16V15H11.5V16H12.5Z"
                                    fill="#767676"
                                  />
                                </svg>
                                Notifications
                              </MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </Hidden>
              )}
            </>
          ) : (
            <div className="header-buttons">
              <button className={classes.header_secondary_button} onClick={handleOpenWalletDialog}>
                Get Privi Wallet
              </button>
              <button onClick={() => setOpenSignInModal(true)}>Sign In</button>
            </div>
          )}
        </div>
        <SignInModal open={openSignInModal} handleClose={() => setOpenSignInModal(false)} />
        <Popper
          id={popperId}
          open={popperOpen}
          anchorEl={anchorEl}
          transition
          modifiers={{
            arrow: {
              enabled: true,
              element: arrowEl,
            },
            offset: {
              enabled: true,
              offset: "20, 0",
            },
          }}
          placement="bottom-end"
          style={{ zIndex: 1000 }}
        >
          <span className={classes.header_popup_arrow} ref={setArrowEl} />
          <ClickAwayListener
            onClickAway={() => {
              setAnchorEl(null);
            }}
          >
            <div className={classes.header_popup_back}>
              {anchorEl?.id === "header-popup-create" ? (
                <>
                  <div className={classes.header_popup_back_item}>Light Content</div>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      setOpenMediaModal(true);
                      setAnchorEl(null);
                    }}
                  >
                    Media
                  </div>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      setOpenPodCreateModal(true);
                      setAnchorEl(null);
                    }}
                  >
                    Pod
                  </div>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      setOpenCreateCommunityModal(true);
                      setAnchorEl(null);
                    }}
                  >
                    Community
                  </div>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      setOpenCreateSocialTokenModal(true);
                      setAnchorEl(null);
                    }}
                  >
                    Token
                  </div>
                </>
              ) : anchorEl?.id === "header-popup-wallet" ? (
                <>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      history.push(`/privi-social/${userSelector.id}`);
                      setAnchorEl(null);
                    }}
                  >
                    Profile
                  </div>
                  <div className={classes.header_popup_back_item}>Settings</div>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      history.push("/wallet");
                      setAnchorEl(null);
                    }}
                  >
                    My Wallets Section
                  </div>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      handleLogout();
                      setAnchorEl(null);
                    }}
                  >
                    Log Out
                  </div>
                </>
              ) : anchorEl?.id === "header-popup-contact" ? (
                <>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      history.push("/communities");
                      setAnchorEl(null);
                    }}
                  >
                    Communities
                  </div>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      history.push("/collab");
                      setAnchorEl(null);
                    }}
                  >
                    Collabs
                  </div>
                </>
              ) : null}
            </div>
          </ClickAwayListener>
        </Popper>
        {status && <AlertMessage key={status.key} message={status.msg} variant={status.variant} />}
        {isSignedIn() && openMediaModal && (
          <CreateMediaModal open={openMediaModal} handleClose={handleCloseMediaModal} />
        )}
        {isSignedIn() && (
          <PodCreateNFTMediaModal
            onClose={handleClosePodCreateModal}
            type={"Digital NFT"}
            open={openPodCreateModal}
          />
        )}
        {isSignedIn() && openCreateCommunityModal && (
          <CreateCommunityModal
            open={openCreateCommunityModal}
            handleClose={handleCloseCreateCommunityModal}
          />
        )}
        {isSignedIn() && openCreateSocialTokenModal && (
          <CreateImportSocialTokenModal
            user={userSelector}
            handleClose={handleCloseSocialTokenModal}
            type={"FT"}
            handleRefresh={() => {}}
            open={openCreateSocialTokenModal}
          />
        )}
        {isSignedIn() && openContributionModal && (
          <>
            <Dialog
              className="modalCommunityContribution"
              open={openContributionModal}
              onClose={handleCloseContributionModal}
              fullWidth={true}
              maxWidth={"md"}
            >
              <CommunityContributionModal
                handleClose={handleCloseContributionModal}
                communityId={selectedNotification?.otherItemId}
                communityName={selectedNotification?.pod}
                token={selectedNotification?.token}
                amount={selectedNotification?.amount}
                shareOnCommunity={handleShareCommunity}
                userId={selectedNotification?.itemId}
              />
            </Dialog>
            <Dialog
              className="modalShareContribution"
              open={openModalShareContribution}
              onClose={handleOpenModalShareContribution}
              fullWidth={true}
              maxWidth={"md"}
            >
              <ShareContributionModal
                handleClose={handleCloseModalShareContribution}
                communityId={communityAddress}
                communityName={communityName}
              />
            </Dialog>
          </>
        )}
        <MediaSellingOfferModal
          open={openModalMediaSellingOffer}
          handleClose={handleCloseModalMediaSellingOffer}
          selectedNotification={selectedNotification}
        />
      </div>
      {isPriviMusicDao && (
        <Hidden smUp={width > 750}>
          <Box width={1}>
            <Box
              className={classes.navContainer}
              display="flex"
              flexDirection="row"
              flexWrap="nowrap"
              overflow="scroll"
            >
              {MusicDaoNavigator.map((nav, index) => (
                <button
                  key={`nav-button-${index}`}
                  className={classes.navButton}
                  onClick={() => history.push(nav.link)}
                >
                  {nav.name}
                </button>
              ))}
            </Box>
          </Box>
        </Hidden>
      )}
    </div>
  );
};

export default Header;

const MusicDaoNavigator = [
  { name: "Home", link: "/privi-music-dao/" },
  { name: "Free Music", link: "" },
  { name: "Liquidity", link: "/privi-music-dao/liquidity" },
  { name: "High Yield", link: "/privi-music-dao/high-yield" },
  { name: "Trade TRAX", link: "" },
  { name: "Claimable Music", link: "/privi-music-dao/claimable-music" },
  { name: "Staking", link: "/privi-music-dao/staking" },
  { name: "Governance", link: "/privi-music-dao/governance" },
  { name: "Pods", link: "/privi-music-dao/pods" },
];
