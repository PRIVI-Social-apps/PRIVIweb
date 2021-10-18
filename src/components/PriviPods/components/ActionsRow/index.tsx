import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { actionsRowStyles } from './index.styles';
import MusicContext from "shared/contexts/MusicContext";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import Box from 'shared/ui-kit/Box';

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

export default function ActionsRow({ item, setItem }) {
  const classes = actionsRowStyles();
  const { openTab, selectedSong, setSelectedSong } = useContext(MusicContext);

  const [liked, setLiked] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);

  const userSelector = useSelector((state: RootState) => state.user);
  const [following, setFollowing] = useState<boolean>(
    !userSelector || !item.followers ? false : item.followers.includes(userSelector.id)
  );
  useEffect(() => {
    setFollowing(!userSelector || !item.followers ? false : item.followers.includes(userSelector.id));
  }, [item]);

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

  const handleShare = () => {};

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
        {openTab.type !== OpenType.Queue ? (
          <Box display="flex" alignItems="center">
            <button className={classes.play} onClick={handlePlay}>
              <img
                src={require(`assets/icons/${playing ? "pause_white" : "play_white_filled"}.png`)}
                alt="play"
              />
            </button>
            {(openTab.type === OpenType.Album || openTab.type === OpenType.Playlist) && (
              <button onClick={handleLike} className={classes.likeIcon}>
                <img
                  src={require(`assets/icons/${liked ? "heart_big" : "heart_outline_big"}.png`)}
                  alt="like"
                />
              </button>
            )}
            <button onClick={handleShare} className={classes.shareIcon}>
              <img src={require(`assets/icons/share_thin.png`)} alt="share" />
            </button>
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
        <RightItemsActions hours={5} />
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
      <PrimaryButton size="medium" onClick={() => {}}>
        Add Founds
      </PrimaryButton>
    </Box>
  );
};
