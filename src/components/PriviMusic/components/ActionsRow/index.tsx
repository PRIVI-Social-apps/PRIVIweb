import React, { useContext, useEffect, useRef, useState } from "react";
import { Popper, ClickAwayListener, Grow, Paper, MenuList, MenuItem } from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";

import { actionsRowStyles } from './index.styles';
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import MusicContext from "shared/contexts/MusicContext";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import Box from 'shared/ui-kit/Box';
import { CopyAddressIcon, DownloadQRIcon, FaceBookShareIcon, InstagramShareIcon, SongShareIcon, TwitterShareIcon } from "components/PriviMusicDao/components/Icons/SvgIcons";

enum OpenType {
  Home = "HOME",
  Playlist = "PLAYLIST",
  MyPlaylist = "MYPLAYLIST",
  Album = "ALBUM",
  Artist = "ARTIST",
  Liked = "LIKED",
  Library = "LIBRARY",
  Search = "SEARCH",
  Queue = "QUEUE",
}

export default function ActionsRow({ item, setItem }) {
  const classes = actionsRowStyles();
  const { openTab, selectedSong, setSelectedSong } = useContext(MusicContext);

  const [liked, setLiked] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);

  const [fruitOpenMenu, setFruitOpenMenu] = useState<boolean>(false);
  const anchorFruitMenuRef = useRef<any>(null);

  const [shareOpenMenu, setShareOpenMenu] = useState<boolean>(false);
  const anchorShareMenuRef = useRef<any>(null);

  const userSelector = useSelector((state: RootState) => state.user);
  const [following, setFollowing] = useState<boolean>(
    !userSelector || !item.followers ? false : item.followers.includes(userSelector.id)
  );

  useEffect(() => {
    setFollowing(!userSelector || !item.followers ? false : item.followers.includes(userSelector.id));
  }, [item]);

  const handleFruitCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorFruitMenuRef.current && anchorFruitMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setFruitOpenMenu(false);
  };

  const handleListKeyDownFruitMenu = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setFruitOpenMenu(false);
    }
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

  const handleFollow = e => {
    e.stopPropagation();
    e.preventDefault();
    axios
      .post(`${URL()}/claimableSongs/followArtist`, {
        artist_name: item.artist_name,
        user_id: userSelector?.id,
      })
      .then(response => {
        if (response.data.success) {
          setFollowing(!following);
        } else {
          console.log(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handlePlay = () => {
    if (!playing) {
      if (item.songs && item.songs[0] && item.songs[0].url) {
        setSelectedSong({ ...item.songs[0], playing: true, Imageurl: item.Imageurl });
      } else if (item[0] && item[0].url) {
        setSelectedSong({ ...item[0], playing: true });
      }
      setPlaying(true);
    } else {
      if (item.songs && item.songs[0] && item.songs[0].url) {
        setSelectedSong({ ...item.songs[0], playing: false, Imageurl: item.Imageurl });
      } else if (item[0] && item[0].url) {
        setSelectedSong({ ...item[0], playing: false });
      }
      setPlaying(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  useEffect(() => {
    if (selectedSong) {
      let playingSong;

      if (item.songs) {
        playingSong = item.songs.find(s => s.url && selectedSong.url === s.url);
      } else if (item.length > 0) {
        playingSong = item.find(s => s.url && selectedSong.url === s.url);
      }

      if (
        playingSong &&
        selectedSong &&
        selectedSong.url &&
        playingSong.url &&
        selectedSong.url === playingSong.url
      ) {
        if (selectedSong.playing) {
          setPlaying(true);
        } else {
          setPlaying(false);
        }
      }
    }
  }, [selectedSong]);

  if (openTab)
    return (
      <div className={classes.actions}>
        {(openTab.type !== OpenType.Queue) ? (
          <Box display="flex" alignItems="center">
            <button className={classes.play} onClick={handlePlay}>
              <img
                src={require(`assets/icons/${playing ? "pause_white" : "play_white_filled"}.png`)}
                alt="play"
              />
            </button>
            {(openTab.type === OpenType.Album || openTab.type === OpenType.Playlist || openTab.type === OpenType.Artist) && (
              <>
                <button className={classes.likeIcon} ref={anchorFruitMenuRef} onClick={() => setFruitOpenMenu(true)}>
                  <img
                    src={require("assets/musicDAOImages/trending.png")}
                    alt="trending"
                  />
                </button>
                <Popper
                  open={fruitOpenMenu}
                  anchorEl={anchorFruitMenuRef.current}
                  transition
                  disablePortal={false}
                  placement="bottom"
                  style={{ position: "inherit" }}
                >
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                      <Paper className={classes.paper}>
                        <ClickAwayListener onClickAway={handleFruitCloseMenu}>
                          <MenuList
                            autoFocusItem={fruitOpenMenu}
                            id="fruit-menu-list-grow"
                            onKeyDown={handleListKeyDownFruitMenu}
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
              </>
            )}
            {(openTab.type === OpenType.Album || openTab.type === OpenType.Artist) && (
              <>
                <button className={classes.likeIcon} ref={anchorShareMenuRef} onClick={() => setShareOpenMenu(true)}>
                  <img
                    src={require("assets/musicDAOImages/upload.png")}
                    alt="trending"
                  />
                </button>
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
              </>
            )}
            {openTab.type === OpenType.Artist && (
              <>
                {following ? (
                  <SecondaryButton size="medium" onClick={handleFollow}>
                    Unfollow
                  </SecondaryButton>
                ) : (
                  <PrimaryButton size="medium" onClick={handleFollow}>
                    Follow
                  </PrimaryButton>
                )}
              </>
            )}
          </Box>
        ) : (
          <div />
        )}
        {/* <RightItemsActions hours={5} /> */}
      </div>
    );
  else return null;
}

export const RightItemsActions = ({ hours }) => {
  return (
    <Box display="flex" alignItems="center" color="#181818" fontSize="14px">
      <img src={require("assets/icons/flash.png")} alt="flash" />
      <b>Privi Free Zone</b>
      {hours} hours left
      <PrimaryButton size="medium" onClick={() => { }}>
        Add Funds
      </PrimaryButton>
    </Box>
  );
};
