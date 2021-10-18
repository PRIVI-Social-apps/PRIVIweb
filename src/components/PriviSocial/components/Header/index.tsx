import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import cls from "classnames";
import { useDispatch, useSelector } from "react-redux";

import { ClickAwayListener, Popper, Hidden } from "@material-ui/core";

import { ToolbarButtonWithPopper } from "shared/ui-kit/Header/components/Toolbar/ToolbarButtonWithPopper";
import { getUser } from "store/selectors";
import { useNotifications } from "shared/contexts/NotificationsContext";
import { signOut } from "store/actions/User";
import { useAuth } from "shared/contexts/AuthContext";
import { MessageNotifications } from "shared/ui-kit/Header/components/Message/MessageNotifications";
import { NotificationsPopperContent } from "shared/ui-kit/Header/components/Notifications/NotificationsPopperContent";
import { getUserAvatar } from "shared/services/user/getUserAvatar";
import PriviAppIcon from "shared/ui-kit/Header/components/PriviAppIcon";
import { headerStyles } from "./index.styles";
import { IconSearch } from "./components/IconSearch";
import { IconCreate } from "./components/IconCreate";
import { IconNotifications } from "./components/IconNotifications";
import { IconMessages } from "./components/IconMessages";
import { IconWallet } from "./components/IconWallet";
import { StyledSelectComponent, TokenSelect } from "shared/ui-kit/Select/TokenSelect";

const routes = {
  Home: "",
  Feed: "feed",
  Discover: "discover",
  // "Social Token": "social-token",
  "Claimable Profiles": "claimable-profiles",
  Messenger: "messages",
};

const isSignedIn = () => {
  return !!sessionStorage.getItem("token");
};

export default function Header({ id }) {
  const classes = headerStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  let pathName = window.location.href; // If routing changes, change to pathname
  let idUrl = pathName.split("/")[5];
  const userSelector = useSelector(getUser);
  const {
    unreadNotifications,
    notifications,
    dismissNotification,
    markAllNotificationsAsRead,
    removeNotification,
  } = useNotifications();

  const { setSignedin } = useAuth();

  const [openNotificationModal, setOpenNotificationModal] = useState<boolean>(false);
  const [openMessagesModal, showMessagesModal] = useState<boolean>(false);
  const [openContributionModal, setOpenContributionModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>();
  const [numberMessages, setNumberMessages] = useState<number>(0);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [arrowEl, setArrowEl] = React.useState<null | HTMLElement>(null);

  const [appAnchorEl, setAppAnchorEl] = React.useState<null | HTMLElement>(null);

  const [hideNotificationsModal, setHideNotificationsModal] = useState<boolean>(false);

  const popperOpen = Boolean(anchorEl);
  const popperId = popperOpen ? "spring-popper" : undefined;

  const appPopperOpen = Boolean(appAnchorEl);

  const [openModalMediaSellingOffer, setOpenModalMediaSellingOffer] = useState<boolean>(false);

  const handleOpenModalMediaSellingOffer = () => {
    setOpenModalMediaSellingOffer(true);
  };

  const handleCloseModalMediaSellingOffer = () => {
    setOpenModalMediaSellingOffer(false);
  };

  const handleCreatePopup = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenContributionModal = () => {
    setOpenNotificationModal(false);
    setOpenContributionModal(true);
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

  const handleLogout = () => {
    setSignedin(false);
    dispatch(signOut());
    localStorage.clear();
    sessionStorage.clear();
    history.push("/");
    window.location.reload();
  };

  return (
    <div className={classes.header}>
      <PriviAppIcon id={id} />
      <Hidden mdDown>
        <div className={classes.navigation}>
          {Object.entries(routes).map((route, index) => (
            <div
              key={`route-${index}`}
              className={cls(
                {
                  [classes.routeSelected]:
                    (pathName.split("/")[6] === "" && index === 0) ||
                    (pathName.split("/")[6] && pathName.split("/")[6].includes(route[1]) && route[1]),
                },
                classes.route
              )}
              onClick={() => history.push(`/privi-social/${idUrl}/${route[1]}`)}
            >
              {route[0]}
            </div>
          ))}
        </div>
      </Hidden>
      <Hidden lgUp>
        <div className={classes.navigation}>
          <StyledSelectComponent
            options={Object.keys(routes)}
            value={
              pathName.split("/")[6] === ""
                ? Object.keys(routes)?.[0]
                : Object.entries(routes).find(route => route[1] === pathName.split("/")[6])?.[0] ?? ""
            }
            onChange={e => history.push(`/privi-social/${idUrl}/${routes[e.target.value]}`)}
          />
        </div>
        {/* <div className={classes.navigation}>
          {Object.entries(routes).map((route, index) => (
            <div
              key={`route-${index}`}
              className={cls(
                {
                  [classes.routeSelected]:
                    (pathName.split("/")[6] === "" && index === 0) ||
                    (pathName.split("/")[6] && pathName.split("/")[6].includes(route[1]) && route[1]),
                },
                classes.route
              )}
              onClick={() => history.push(`/privi-social/${idUrl}/${route[1]}`)}
            >
              {route[0]}
            </div>
          ))}
        </div> */}
      </Hidden>
      <div className={classes.rightWrapper}>
        <div className={classes.icons}>
          {isSignedIn() && (
            <>
              <Hidden smDown>
                <ToolbarButtonWithPopper theme="green" tooltip="Search" icon={IconSearch} noPopup />
                <ToolbarButtonWithPopper theme="green" tooltip="Create" icon={IconCreate} noPopup />
              </Hidden>
              <ToolbarButtonWithPopper
                theme="green"
                tooltip="Messages"
                icon={IconMessages}
                badge={numberMessages > 0 ? numberMessages.toString() : undefined}
                openToolbar={openMessagesModal}
                handleOpenToolbar={showMessagesModal}
              >
                <MessageNotifications handleClosePopper={() => showMessagesModal(false)} />
              </ToolbarButtonWithPopper>
              <ToolbarButtonWithPopper
                theme="green"
                tooltip="Notifications"
                icon={IconNotifications}
                badge={unreadNotifications > 0 ? unreadNotifications.toString() : undefined}
                onIconClick={markAllNotificationsAsRead}
                openToolbar={openNotificationModal}
                handleOpenToolbar={setOpenNotificationModal}
                hidden={hideNotificationsModal}
              >
                <NotificationsPopperContent
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
              <ToolbarButtonWithPopper theme="green" tooltip="Wallet" icon={IconWallet} noPopup />
            </>
          )}
        </div>

        <div
          className={classes.avatar}
          id="header-popup-wallet"
          aria-describedby={popperId}
          onClick={handleCreatePopup}
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
            cursor: "pointer",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Popper
          id={popperId}
          open={popperOpen}
          anchorEl={anchorEl}
          transition
          modifiers={{
            arrow: {
              enabled: false,
            },
            offset: {
              enabled: true,
              offset: "20, 0",
            },
          }}
          placement="bottom-end"
          style={{ zIndex: 1000 }}
        >
          <ClickAwayListener
            onClickAway={() => {
              setAnchorEl(null);
            }}
          >
            <div className={classes.menuContent}>
              <div
                className={cls(
                  { [classes.itemSelected]: !pathName.split("/")[6] || pathName.split("/")[6] === "" },
                  classes.menuItem
                )}
                onClick={() => {
                  history.push(`/privi-social/${userSelector.id}`);
                  setAnchorEl(null);
                }}
              >
                My Profile
              </div>
              {/* <div
                className={cls(
                  {
                    [classes.itemSelected]:
                      pathName.split("/")[6] && pathName.split("/")[6].includes("/social-token"),
                  },
                  classes.menuItem
                )}
                onClick={() => {
                  history.push(`/privi-social/${userSelector.id}/social-token`);
                  setAnchorEl(null);
                }}
              >
                My Social Token
              </div> */}
              <div
                className={cls(
                  {
                    [classes.itemSelected]:
                      pathName.split("/")[6] && pathName.split("/")[6].includes("/wips"),
                  },
                  classes.menuItem
                )}
                onClick={() => {
                  history.push(`/privi-social/${userSelector.id}/wips`);
                  setAnchorEl(null);
                }}
              >
                My Work in Progress
              </div>
              <div
                className={classes.menuItem}
                onClick={() => {
                  handleLogout();
                  setAnchorEl(null);
                }}
              >
                Log Out
              </div>
            </div>
          </ClickAwayListener>
        </Popper>
      </div>
    </div>
  );
}
