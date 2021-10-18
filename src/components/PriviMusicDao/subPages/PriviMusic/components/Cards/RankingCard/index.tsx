import React, { useContext, useRef, useState } from "react";
import { Box, Popper, ClickAwayListener, Grow, Paper, MenuList, MenuItem } from "@material-ui/core";
import { CopyAddressIcon, DownloadQRIcon, FaceBookShareIcon, InstagramShareIcon, SongShareIcon, TwitterShareIcon } from "components/PriviMusicDao/components/Icons/SvgIcons";

import MusicContext from "shared/contexts/MusicContext";
import { rankingCardStyles } from './index.styles'

const RANDOM_MOCK_PLAYLISTS_LENGTH = 19;

export default function RankingCard({ item }) {
  const classes = rankingCardStyles();
  const { setOpenTab, history, setHistory } = useContext(MusicContext);

  const [shareOpenMenu, setShareOpenMenu] = useState<boolean>(false);
  const anchorShareMenuRef = useRef<HTMLImageElement>(null);

  const handleShareOpenMenu = (event: React.MouseEvent<EventTarget>) => {
    event.stopPropagation();
    setShareOpenMenu(true);
  };

  const handleShareCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setShareOpenMenu(false);
  };

  const handleListKeyDownShareMenu = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setShareOpenMenu(false);
    }
  };

  const [playlistOpenMenu, setPlaylistOpenMenu] = useState<boolean>(false);
  const anchorPlaylistMenuRef = useRef<HTMLImageElement>(null);

  const handlePlaylistOpenMenu = (event: React.MouseEvent<EventTarget>) => {
    event.stopPropagation();
    setPlaylistOpenMenu(true);
  };

  const handlePlaylistCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setPlaylistOpenMenu(false);
  };

  const handleListKeyDownPlaylistMenu = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setPlaylistOpenMenu(false);
    }
  };

  return (
    <div
      className={classes.card}
      onClick={() => {
        setOpenTab({ type: item.Type, id: item.id, index: history.length });
        setHistory([...history, { type: item.Type, id: item.id, index: history.length }]);
      }}
    >
      <div
        className={classes.album}
        style={{
          backgroundImage: item.album_image
            ? `url(${item.album_image})`
            : `url(${require(`assets/mediaIcons/mockup/playlist_mock_up_${Math.floor(Math.random() * RANDOM_MOCK_PLAYLISTS_LENGTH) + 1
              }.png`)})`,
        }}
      />
      <div className={classes.title}>{item.MediaName ?? "Song name"}</div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" px={3} mt={1} width={1}>
        <img src={require("assets/musicDAOImages/fruit.png")} alt="trending" />
        <img ref={anchorShareMenuRef} onClick={handleShareOpenMenu} src={require("assets/musicDAOImages/upload.png")} alt="upload" />
        <Popper
          open={shareOpenMenu}
          anchorEl={anchorShareMenuRef.current}
          transition
          disablePortal={false}
          placement="bottom"
          style={{ position: "inherit" }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={handleShareCloseMenu}>
                  <MenuList
                    autoFocusItem={shareOpenMenu}
                    id="share-menu-list-grow"
                    onKeyDown={handleListKeyDownShareMenu}
                  >
                    <MenuItem>
                      <TwitterShareIcon />
                      Share on Twitter
                    </MenuItem>
                    <MenuItem>
                      <FaceBookShareIcon />
                      Share on Facebook
                    </MenuItem>
                    <MenuItem>
                      <InstagramShareIcon />
                      Share on Instagram
                    </MenuItem>
                    <MenuItem>
                      <SongShareIcon />
                      Copy song link
                    </MenuItem>
                    <MenuItem>
                      <DownloadQRIcon />
                      Download QR code
                    </MenuItem>
                    <MenuItem>
                      <CopyAddressIcon />
                      Copy address
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <img ref={anchorPlaylistMenuRef} onClick={handlePlaylistOpenMenu} src={require("assets/musicDAOImages/add-list.png")} alt="addlist" />
        <Popper
          open={playlistOpenMenu}
          anchorEl={anchorPlaylistMenuRef.current}
          transition
          disablePortal={false}
          placement="bottom"
          style={{ position: "inherit" }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={handlePlaylistCloseMenu}>
                  <MenuList
                    autoFocusItem={shareOpenMenu}
                    id="playlist-menu-list-grow"
                    onKeyDown={handleListKeyDownPlaylistMenu}
                  >
                    <MenuItem>
                      Playlist1
                    </MenuItem>
                    <MenuItem>
                      Playlist2
                    </MenuItem>
                    <MenuItem>
                      Playlist3
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </div>
  );
}
