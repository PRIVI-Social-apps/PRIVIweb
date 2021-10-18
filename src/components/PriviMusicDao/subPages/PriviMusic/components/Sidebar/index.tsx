import React, { useContext, useEffect, useState } from "react";
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
  MyPlaylist: "Playlist",
  Fruit: "My Fruits",
  Search: "Search",
};

enum OpenType {
  Home = "HOME",
  Playlist = "PLAYLIST",
  Fruit = "FRUIT",
  MyPlaylist = "MYPLAYLIST",
  Album = "ALBUM",
  Artist = "ARTIST",
  Liked = "LIKED",
  Library = "LIBRARY",
  Search = "SEARCH",
  Queue = "QUEUE",
}

export default function Sidebar(props: any) {
  return <AppSidebar child={<SidebarContent seconds={props.seconds || 0} />} theme="dao-music" />;
}

const useStyles = makeStyles(() => ({
  moreButton: {
    fontSize: "12px !important",
    lineHeight: "12px !important"
  },
  paper: {
    background: Color.White,
    boxShadow: "0px 47px 65px -11px rgba(36, 46, 60, 0.21)",
    borderRadius: 12,
  }
}));

const SidebarContent = (props: any) => {
  const classes = useStyles();
  const commonClasses = priviMusicDaoPageStyles();

  const { openTab, setOpenTab, history, setHistory } = useContext(MusicContext);

  const [openCreatePlaylistModal, setOpenCreatePlaylistModal] = useState<boolean>(false);

  const [hoursFreeMusicTime, setHoursFreeMusicTime] = useState<number>(0);
  const [minutesFreeMusicTime, setMinutesFreeMusicTime] = useState<number>(0);
  const [secondsFreeMusicTime, setSecondsFreeMusicTime] = useState<number>(0);

  useEffect(() => {
    console.log('seconds', props.seconds)
    let hour: any = Math.floor(props.seconds / 3600);
    hour = (hour < 10) ? '0' + hour : hour;
    setHoursFreeMusicTime(hour)

    let minute: any = Math.floor((props.seconds / 60) % 60);
    minute = (minute < 10) ? '0' + minute : minute;
    setMinutesFreeMusicTime(minute)

    let second: any = props.seconds % 60;
    second = (second < 10) ? '0' + second : second;
    setSecondsFreeMusicTime(second)

  }, [props.seconds]);

  const handleOpenCreatePlaylistModal = () => {
    setOpenCreatePlaylistModal(true);
  };
  const handleCloseCreatePlaylistModal = () => {
    setOpenCreatePlaylistModal(false);
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
        </ul>
      </div>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" className={commonClasses.sidebarFooter}>
        <Box display="flex" flexDirection="row" alignItems="center">
          <img src={require("assets/icons/flash.png")} alt="flash" />
          <Text bold color={Color.White} ml={1}>Privi Free Zone</Text>
        </Box>
        <Text size={FontSize.L} bold mt={2} mb={2} color={Color.White}>
          {hoursFreeMusicTime} : {minutesFreeMusicTime} : {secondsFreeMusicTime}
        </Text>
        <PrimaryButton size="medium" className={`${commonClasses.primaryButton} ${classes.moreButton}`}>
          Get more free music
        </PrimaryButton>
      </Box>
      <CreatePlaylistModal open={openCreatePlaylistModal} handleClose={handleCloseCreatePlaylistModal} />
    </div>
  );
};
