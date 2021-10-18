import React from "react";
import {
  Box,
  makeStyles,
  Popper,
  ClickAwayListener,
  Grow,
  Paper,
  MenuList,
  MenuItem,
} from "@material-ui/core";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { FontSize, Color } from "shared/constants/const";
import { useHistory, useLocation } from "react-router-dom";

interface NavItemProps {
  name: string;
  value: string;
  subNavs?: NavItemProps[];
  link?: string;
}

const Navigations = [
  { name: "Home", value: "home", link: "/privi-music-dao/" },
  { name: "Free Music", value: "music", link: "/privi-music-dao/free-music" },
  {
    name: "Finance",
    value: "finance",
    subNavs: [
      { name: "Liquidity", value: "liquidity", link: "/privi-music-dao/liquidity" },
      { name: "High Yield", value: "yield", link: "/privi-music-dao/high-yield" },
      { name: "Trade TRAX", value: "ftrade", link: "/privi-music-dao/trade-trax" },
    ],
  },
  { name: "Claimable Music", value: "claimable", link: "/privi-music-dao/claimable-music" },
  {
    name: "DAO",
    value: "dao",
    subNavs: [
      { name: "Staking", value: "staking", link: "/privi-music-dao/staking" },
      { name: "Governance", value: "governance", link: "/privi-music-dao/governance" },
    ],
  },
  { name: "Pods", value: "pods", link: "/privi-music-dao/pods" },
];

const useStyles = makeStyles({
  nav: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    cursor: "pointer",
  },
  paper: {
    background: Color.White,
    boxShadow: "0px 8px 24px -5px rgba(71, 78, 104, 0.19), 0px 41px 65px -11px rgba(36, 46, 60, 0.1)",
    borderRadius: 12,
    "& .MuiList-root": {
      padding: "14px 16px",
      "& .MuiListItem-root.MuiMenuItem-root": {
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "inherit",
        transition: "none",
        "&:hover": {
          color: Color.MusicDAOGreen,
          borderRadius: 12,
          background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
        },
      },
    },
  },
});

const PriviMusicAppNavigation = () => {
  const classes = useStyles();

  const history = useHistory();
  const location = useLocation();

  const [selected, setSelected] = React.useState<NavItemProps>(Navigations[0]);

  const [openSubMenu, setOpenSubMenu] = React.useState<string | null>(null);

  const anchorNavMenuRef = React.useRef<(HTMLDivElement | null)[]>(Array(Navigations.length).fill(null));

  React.useEffect(() => {
    const selectedNav = Navigations.find(nav => {
      if (nav.subNavs) {
        const tmp = nav.subNavs.find(subNav => subNav.link === location.pathname);
        if (tmp) {
          return true;
        } else {
          return false;
        }
      } else {
        return nav.link === location.pathname;
      }
    });

    if (selectedNav) {
      setSelected(selectedNav);
    }

    setOpenSubMenu(null);
  }, [location.pathname]);

  const handleOpenSubMenu = (nav: NavItemProps) => (event: React.MouseEvent<EventTarget>) => {
    event.stopPropagation();

    if (nav.subNavs) {
      setOpenSubMenu(nav.value);
    } else {
      if (nav.link) history.push(nav.link);
    }
  };

  const handleCloseSubMenu = (index: number) => (event: React.MouseEvent<EventTarget>) => {
    const ref = anchorNavMenuRef.current[index];
    if (ref && ref.contains(event.target as HTMLElement)) {
      return;
    }
    setOpenSubMenu(null);
  };

  const handleListKeyDownSubMenu = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenSubMenu(null);
    }
  };

  const handleClickSubMenu = (nav: NavItemProps) => (event: React.MouseEvent<EventTarget>) => {
    event.preventDefault();

    if (nav.link) history.push(nav.link);
  };

  return (
    <Box display="flex" flexDirection="row">
      {Navigations.map((nav, index) => (
        <Box key={`privi-nav-${index}`} onClick={handleOpenSubMenu(nav)} ml={2}>
          <div className={classes.nav} ref={ref => (anchorNavMenuRef.current[index] = ref)}>
            <Text
              size={FontSize.M}
              color={nav.value === selected.value ? Color.MusicDAOGreen : Color.MusicDAODark}
              mr={1}
            >
              {nav.name}
            </Text>
            {nav.subNavs && (
              <>
                <NavArrowDown
                  color={nav.value === selected.value ? Color.MusicDAOGreen : Color.MusicDAODark}
                />
                <Popper
                  open={openSubMenu === nav.value}
                  anchorEl={anchorNavMenuRef.current[index]}
                  transition
                  disablePortal={false}
                  placement="bottom"
                >
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                      <Paper className={classes.paper}>
                        <ClickAwayListener onClickAway={handleCloseSubMenu(index)}>
                          <MenuList
                            autoFocusItem={openSubMenu === nav.value}
                            onKeyDown={handleListKeyDownSubMenu}
                          >
                            {nav.subNavs.map((subNav, subIndex) => (
                              <MenuItem
                                key={`sub-menu-item-${subNav.value}-${subIndex}`}
                                value={subNav.value}
                                onClick={handleClickSubMenu(subNav)}
                              >
                                {subNav.name}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </>
            )}
          </div>
        </Box>
      ))}
    </Box>
  );
};

export default PriviMusicAppNavigation;

const NavArrowDown = ({ color }) => (
  <svg width="8" height="5" viewBox="0 0 8 5" stroke={color} fill="none">
    <path d="M1 1L4 4L7 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
