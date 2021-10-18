import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";

import { Slider, withStyles } from "@material-ui/core";

import { playerStyles } from './index.styles';
import MusicContext from "shared/contexts/MusicContext";
import { RootState } from "store/reducers/Reducer";
import * as API from "shared/services/API/MediaAPI";
import { openMediaForSubstrate, closeMediaForSubstrate } from "shared/services/API";
import { useSubstrate } from "shared/connectors/substrate";
import { signPayload } from "shared/services/WalletSign";
import { IAPIRequestProps } from "shared/types/Media";
import { getWalletInfo } from "shared/helpers";
import { signTransaction } from "shared/functions/signTransaction";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
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

export default function Player() {
  const classes = playerStyles();
  const { selectedSong, setSelectedSong, songsList, setSongsList, setOpenTab } = useContext(MusicContext);

  const [liked, setLiked] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openError, setOpenError] = useState(false);

  const handleLike = () => {
    //TODO: like song
    setLiked(!liked);
  };

  let playerAudio: any = useRef();

  const [playerState, setPlayerState] = useState({
    url: null,
    pip: false,
    playing: false,
    validated: false,
    controls: false,
    light: false,
    volume: 100,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    volumeOpen: false,
    dropdownOpen: false,
    fullscreen: false,
    seeking: false,
    playedSeconds: 0,
  });

  const [finishTrigger, setFinishTrigger] = useState<any>(new Date().getTime());
  const [shuffled, setShuffled] = useState<boolean>(false);
  const [repeated, setRepeated] = useState<boolean>(false);
  const [newSongsList, setNewSongsList] = useState<string[]>([]);

  //TODO: CALCULATE TIME SPENT + TOTAL
  const [token, setToken] = useState<string>("ETH");
  const userSelector = useSelector((state: RootState) => state.user);

  const { api, apiState, keyring, keyringState } = useSubstrate();

  useEffect(() => {
    if (songsList) {
      let songs = [] as any[];
      songsList.forEach(s => {
        songs.push(s.url);
      });
      setNewSongsList(songs);
    }
  }, [songsList]);

  useEffect(() => {
    if (selectedSong && selectedSong.playing && !playerState.playing) {
      setPlayerState({ ...playerState, playing: true, validated: false });
    } else if (selectedSong && !selectedSong.playing && playerState.playing) {
      setPlayerState({ ...playerState, playing: false, validated: false });
    }
    if (selectedSong) {
      setToken(selectedSong.priceToken ?? "ETH");
    }
  }, [selectedSong]);

  useEffect(() => {
    if (selectedSong && !selectedSong.playing && playerState.playing) {
      setSelectedSong({ ...selectedSong, playing: true });
    } else if (selectedSong && selectedSong.playing && !playerState.playing) {
      setSelectedSong({ ...selectedSong, playing: false });
    }
  }, [playerState]);

  useEffect(() => {
    if (selectedSong && selectedSong.url) {
      const thisSongIndex = newSongsList.findIndex(m => m === selectedSong.url);
      let nextUrlIndex = thisSongIndex + 1;
      let nextSong = songsList.find(m => m.url === newSongsList[nextUrlIndex]);
      if (nextUrlIndex <= newSongsList.length - 1 || repeated) {
        if (repeated && nextUrlIndex > newSongsList.length - 1) {
          nextSong = songsList.find(m => m.url === newSongsList[0]);
        }
        setSelectedSong(nextSong);
        setPlayerState({ ...playerState, playing: true });
      } else setPlayerState({ ...playerState, playing: false });
    }
  }, [finishTrigger]);

  useEffect(() => {
    if (!selectedSong) {
      return;
    }
    if (!selectedSong.playing) {
      handleCloseNFT();
      return;
    }
    if (!playerState.validated) {
      handleConfirmSign();
    }
  }, [selectedSong]);

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const handleShuffle = shuffledValue => {
    let urls = [...songsList];
    if (!shuffledValue) {
      urls = shuffle(urls);
    }

    setShuffled(!shuffledValue);

    setNewSongsList(urls);
  };

  const handleSkip = () => {
    if (selectedSong && selectedSong.url) {
      const thisMediaIndex = newSongsList.findIndex(m => m === selectedSong.url);
      let nextUrlIndex = thisMediaIndex + 1;
      if (nextUrlIndex <= newSongsList.length - 1) {
        let nextMedia = songsList.find(m => m.url === newSongsList[nextUrlIndex]);
        setSelectedSong(nextMedia);
      } else if (repeated) {
        let nextMedia = songsList.find(m => m.url === newSongsList[0]);
        setSelectedSong(nextMedia);
      }
    }
  };
  const handlePlay = () => {
    if (selectedSong && selectedSong.url) {
      setPlayerState({ ...playerState, playing: !playerState.playing });
    }
  };
  const handlePrev = () => {
    if (selectedSong) {
      const thisMediaIndex = newSongsList.findIndex(m => m === selectedSong.url);
      let prevUrlIndex = thisMediaIndex - 1;
      if (prevUrlIndex >= 0) {
        let prevMedia = songsList.find(m => m.url === newSongsList[prevUrlIndex]);
        setSelectedSong(prevMedia);
      } else if (repeated) {
        let nextMedia = songsList.find(m => m.url === newSongsList[newSongsList.length - 1]);
        setSelectedSong(nextMedia);
      }
    }
  };

  const handleRepeat = () => {
    setRepeated(!repeated);
  };

  const handleSeekChange = (e, v) => {
    setPlayerState({ ...playerState, seeking: true, played: Number(v) });
  };

  const handleSeekMouseUp = (e, v) => {
    setPlayerState({ ...playerState, seeking: false });

    if (playerAudio?.current) {
      playerAudio.current.seekTo(parseFloat(v));
    }
  };

  const handleProgress = stateIn => {
    if (!playerState.seeking) {
      setPlayerState({ ...playerState, ...stateIn });
    }
  };

  const handleAddToPlaylist = () => {
    if (!selectedSong) {
      return;
    }
    setSongsList([selectedSong, ...songsList]);
    setOpenTab({ type: OpenType.Queue, id: selectedSong.id, index: history.length });
  };

  const handleConfirmSign = async () => {
    try {
      if (!selectedSong.BlockchainNetwork || selectedSong.BlockchainNetwork === "Privi Chain") {
        let txData: any = {
          MediaSymbol: selectedSong.song_name,
          Address: userSelector.address,
        };
        const { privateKey } = await getWalletInfo(userSelector.mnemonic);
        const { signature: nftSignature } = await signPayload(
          "openNFT",
          userSelector.address,
          txData,
          privateKey
        );
        const openNftRequest: IAPIRequestProps = {
          Function: "openNFT",
          Address: userSelector.address,
          Signature: nftSignature,
          Payload: txData,
        };
        const response = await API.openNFT({ chain: "privi", data: openNftRequest });
        if (!response.success) {
          throw new Error(response.error);
        }
      }
      if (selectedSong.BlockchainNetwork === "Substrate Chain") {
        if (!api) return;

        const keyringOptions = (keyring as any).getPairs().map(account => ({
          key: account.address,
          value: account.address,
          text: account.meta.name ? account.meta.name.toUpperCase() : "",
          icon: "user",
        }));

        const accountAddress = keyringOptions.length > 0 ? keyringOptions[0].value : "";

        const accountPair =
          accountAddress && keyringState === "READY" && (keyring as any).getPair(accountAddress);

        const payload = {
          media_id: selectedSong.BlockchainId,
        };

        openMediaForSubstrate(payload, api, accountPair).then(res => {
          if (!res.success) {
            setErrorMsg("Error while opening media");
          }
        });
      }
      setPlayerState({ ...playerState, playing: true, validated: true });
    } catch (e) {
      console.log(e);
      setErrorMsg(e.message);
      handleClickError();
    }
  };

  const handleCloseNFT = async () => {
    try {
      if (!selectedSong.BlockchainNetwork || selectedSong.BlockchainNetwork === "Privi Chain") {
        let data = {
          MediaSymbol: selectedSong.song_name,
          // MediaType: "",
          Address: userSelector.address,
          SharingId: "",
        };
        const [hash, signature] = await signTransaction(userSelector.mnemonic, data);
        let body = {
          Payload: data,
          Hash: hash,
          Signature: signature,
        };
        const response = await API.closeNFT({ chain: "privi", data: body });
        if (!response.success) {
          throw new Error(response.error);
        }
      }
      if (selectedSong.BlockchainNetwork === "Substrate Chain") {
        if (!api) return;

        const keyringOptions = (keyring as any).getPairs().map(account => ({
          key: account.address,
          value: account.address,
          text: account.meta.name ? account.meta.name.toUpperCase() : "",
          icon: "user",
        }));

        const accountAddress = keyringOptions.length > 0 ? keyringOptions[0].value : "";

        const accountPair =
          accountAddress && keyringState === "READY" && (keyring as any).getPair(accountAddress);

        const payload = {
          mediaId: selectedSong.BlockchainId,
        };

        closeMediaForSubstrate(payload, api, accountPair).then(res => {
          if (!res.success) {
            setErrorMsg("Error while closing media");
          }
        });
      }
      setPlayerState({ ...playerState, playing: false, validated: false });
    } catch (e) {
      console.log(e);
      setErrorMsg(e.message);
      handleClickError();
    }
  };

  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 4000);
  };

  return (
    <div className={classes.player}>
      <div className={classes.songInfo}>
        <div
          className={classes.albumImage}
          style={{
            backgroundImage: selectedSong?.album_image ? `url(${selectedSong.album_image})` : "none",
          }}
        />
        <Box display="flex" flexDirection="column" color="white">
          <div className={classes.title}>{selectedSong?.song_name ?? ""}</div>
          <div className={classes.artist}>{selectedSong?.artist_name ?? ""}</div>
        </Box>
        <img src={require(`assets/priviIcons/${liked ? "like-filled" : "like"}.svg`)} onClick={handleLike} />
      </div>

      <div className={classes.controls}>
        <Box display="flex">
          <button
            onClick={() => {
              handleShuffle(shuffled);
            }}
          >
            <img
              src={require(shuffled ? "assets/icons/shuffle_mint.png" : "assets/icons/shuffle_white.png")}
              alt="shuffle"
            />
          </button>
          <button onClick={handlePrev}>
            <img src={require("assets/icons/next_white.png")} alt="next" />
          </button>
          <button onClick={handlePlay}>
            <img
              src={require(playerState.playing
                ? "assets/icons/pause_white.png"
                : "assets/icons/play_white_round.png")}
              alt="play"
            />
          </button>
          <button onClick={handleSkip}>
            <img src={require("assets/icons/next_white.png")} alt="previous" />
          </button>
          <button onClick={handleRepeat}>
            <img
              src={
                repeated ? require("assets/icons/repeat_mint.png") : require("assets/icons/repeat_white.png")
              }
              alt="repeat"
            />
          </button>
          <div className={classes.spent}>{`${
            selectedSong ? Math.floor(playerState.played * selectedSong.duration) : 0
          } sec = ${token} ${
            selectedSong
              ? Math.floor(playerState.played * selectedSong.duration * selectedSong.price * 10) / 10
              : 0
          }`}</div>
        </Box>

        <Box display="flex" flexDirection="row" alignItems="center" className={classes.tracking}>
          <Box fontSize={11} color={"white"} marginRight="8px">
            {playerState.playedSeconds
              ? `${Math.floor((playerState.playedSeconds % 3600) / 60)}:${
                  Math.floor(playerState.playedSeconds % 60) < 10 ? "0" : ""
                }${Math.floor(playerState.playedSeconds % 60).toFixed(0)}`
              : "0:00"}
          </Box>

          {selectedSong && (
            <ReactPlayer
              height={0}
              width={0}
              config={{ file: { forceAudio: true, attributes: { controlsList: "nodownload" } } }}
              onContextMenu={e => e.preventDefault()}
              url={selectedSong.url}
              className="react-player"
              ref={playerAudio}
              playing={playerState.playing && playerState.validated}
              onEnded={() => {
                setFinishTrigger(new Date().getTime());
              }}
              onPause={() => setPlayerState({ ...playerState, playing: false })}
              onPlay={() => setPlayerState({ ...playerState, playing: true })}
              onProgress={handleProgress}
            />
          )}

          <PlayerSlider
            className={classes.track}
            defaultValue={0}
            min={0}
            max={0.999999}
            step={0.0000001}
            value={playerState.played}
            onChange={handleSeekChange}
            onChangeCommitted={handleSeekMouseUp}
          />
          <Box fontSize={11} color={"white"} marginLeft="8px">
            {selectedSong && selectedSong.duration
              ? `${Math.floor((selectedSong.duration % 3600) / 60)}:${
                  Math.floor(selectedSong.duration % 60) < 10 ? "0" : ""
                }${Math.floor(selectedSong.duration % 60).toFixed(0)}`
              : "0:00"}
          </Box>
        </Box>
      </div>

      <div className={classes.controlsRight}>
        <img
          src={require("assets/icons/add_playlist.png")}
          alt="add to playlist"
          onClick={handleAddToPlaylist}
        />
        <img src={require("assets/icons/volume.png")} alt="volume" />
      </div>
      {openError && <AlertMessage key={Math.random()} message={errorMsg} variant={"error"} />}
    </div>
  );
}

const PlayerSlider = withStyles({
  root: {
    color: "#707582",
    height: 4,
    borderRadius: 2,
    padding: 0,
  },
  thumb: {
    height: 4,
    width: 4,
    background: "#FFFFFF",
    border: "none",
    margin: 0,
  },
  track: {
    background: "#FFFFFF",
    height: 4,
    borderRadius: 3,
  },
  rail: {
    background: "#707582",
    height: 4,
    borderRadius: 3,
  },
})(Slider);
