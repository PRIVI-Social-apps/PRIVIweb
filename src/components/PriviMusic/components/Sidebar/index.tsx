import React, { useContext, useRef, useState } from "react";
import styles from "shared/ui-kit/PriviAppSidebar/index.module.css";
import MusicContext from "shared/contexts/MusicContext";
import { useTypedSelector } from "store/reducers/Reducer";
import AppSidebar from "shared/ui-kit/PriviAppSidebar";
import CreatePlaylistModal from "../../modals/CreatePlaylistModal";
import { Box, makeStyles, Popper, ClickAwayListener, Grow, Paper, MenuList, MenuItem } from "@material-ui/core";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { Color, FontSize, PrimaryButton } from "shared/ui-kit";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";

const TABS = {
  Home: "Home",
  Playlist: "Playlist",
  MyFruits: "My Fruits",
  Search: "Search",
};

enum OpenType {
  Home = "HOME",
  Playlist = "PLAYLIST",
  MyFruits = "MYFRUITS",
  MyPlaylist = "MYPLAYLIST",
  Album = "ALBUM",
  Artist = "ARTIST",
  Liked = "LIKED",
  Library = "LIBRARY",
  Search = "SEARCH",
  Queue = "QUEUE",
}

export default function Sidebar() {
  return <AppSidebar child={<SidebarContent />} theme="music" />;
}

const useStyles = makeStyles(() => ({
  moreButton: {
    fontSize: "12px !important",
  },
  paper: {
    background: Color.White,
    boxShadow: "0px 47px 65px -11px rgba(36, 46, 60, 0.21)",
    borderRadius: 12,
  }
}));

const SidebarContent = () => {
  const classes = useStyles();
  const commonClasses = priviMusicDaoPageStyles();

  const user = useTypedSelector(state => state.user);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const { openTab, setOpenTab, history, setHistory } = useContext(MusicContext);

  const [openCreatePlaylistModal, setOpenCreatePlaylistModal] = useState<boolean>(false);

  const handleOpenCreatePlaylistModal = () => {
    setOpenCreatePlaylistModal(true);
  };
  const handleCloseCreatePlaylistModal = () => {
    setOpenCreatePlaylistModal(false);
  };

  const anchorMenuRef = useRef<any>(null);

  const handleCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorMenuRef.current && anchorMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpenMenu(false);
  };

  const handleListKeyDownShareMenu = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenMenu(false);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.options}>
        <ul>
          {Object.keys(TABS).map((key, index) => (
            <li
              key={`option-${index}`}
              className={
                (index === 0 && openTab === null) || (openTab && OpenType[key] === openTab.type)
                  ? styles.selected
                  : undefined
              }
              onClick={() => {
                setOpenTab({
                  type: OpenType[key],
                  id: undefined,
                  index: history.length,
                });
                setHistory([
                  ...history,
                  {
                    type: OpenType[key],
                    id: undefined,
                    index: history.length,
                  },
                ]);
              }}
            >
              {TABS[key]}
            </li>
          ))}
        </ul>
        <ul>
          <li onClick={handleOpenCreatePlaylistModal}>
            <img src={require("assets/icons/create_playlist.png")} alt="create playlist" />
            Create Playlist
          </li>
          <li onClick={() => { }}>
            <img src={require("assets/icons/add_dark.png")} alt="create playlist" />
            Create Content
          </li>
        </ul>
      </div>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" className={styles.footer}>
        <Box display="flex" flexDirection="row" alignItems="center">
          <img src={require("assets/icons/flash.png")} alt="flash" />
          <Text bold color={Color.White} ml={1}>Privi Free Zone</Text>
        </Box>
        <Text size={FontSize.L} bold mt={2} mb={2} color={Color.White}>02 : 33 : 45</Text>
        <div ref={anchorMenuRef}>
          <PrimaryButton size="medium" className={`${commonClasses.primaryButton} ${classes.moreButton}`} onClick={() => setOpenMenu(true)}>
            Get more free music
          </PrimaryButton>
        </div>
        <Popper
          open={openMenu}
          anchorEl={anchorMenuRef.current}
          transition
          disablePortal={false}
          placement="right"
          style={{ position: "inherit" }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={handleCloseMenu}>
                  <MenuList
                    autoFocusItem={openMenu}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDownShareMenu}
                  >
                    <MenuItem>
                      🍉 02
                    </MenuItem>
                    <MenuItem>
                      🥑 30
                    </MenuItem>
                    <MenuItem>
                      🍊 137
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
      <CreatePlaylistModal open={openCreatePlaylistModal} handleClose={handleCloseCreatePlaylistModal} />
    </div>
  );
};
