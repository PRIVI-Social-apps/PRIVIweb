import React, { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { artistCardStyles } from "./index.styles";
import MusicContext from "shared/contexts/MusicContext";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";

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

export default function ArtistCard({ item }) {
  const classes = artistCardStyles();

  const { setOpenTab, history, setHistory } = useContext(MusicContext);
  const userSelector = useSelector((state: RootState) => state.user);
  const [following, setFollowing] = useState<boolean>(
    !userSelector || !item.followers ? false : item.followers.includes(userSelector.id)
  );
  useEffect(() => {
    setFollowing(!userSelector || !item.followers ? false : item.followers.includes(userSelector.id));
    setFollowingCount(item.followers ? item.followers.length : 0);
  }, [item]);

  const [followingCount, setFollowingCount] = useState(item.followers ? item.followers.length : 0);

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
          if (following) {
            setFollowingCount(followingCount - 1);
          } else {
            setFollowingCount(followingCount + 1);
          }
          setFollowing(!following);
        } else {
          console.log(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div
      className={classes.card}
      onClick={() => {
        setOpenTab({ type: OpenType.Artist, id: item.id, index: history.length });
        setHistory([...history, { type: OpenType.Artist, id: item.id, index: history.length }]);
      }}
    >
      <div
        className={classes.avatar}
        style={{
          backgroundImage: item.artist_image ? `url(${item.artist_image})` : "none",
        }}
      />
      <div className={classes.name}>{item.artist_name ?? "Artist Name"}</div>
      <div className={classes.followers}>{`${
        followingCount > 1000000
          ? (followingCount / 1000000).toFixed(1)
          : followingCount > 1000
          ? (followingCount / 1000).toFixed(1)
          : followingCount
      }${followingCount > 1000000 ? "M" : followingCount > 1000 ? "K" : ""}
      Followers`}</div>
      {following ? (
        <SecondaryButton size="medium" onClick={handleFollow}>
          Unfollow
        </SecondaryButton>
      ) : (
        <PrimaryButton size="medium" onClick={handleFollow}>
          Follow
        </PrimaryButton>
      )}
    </div>
  );
}
