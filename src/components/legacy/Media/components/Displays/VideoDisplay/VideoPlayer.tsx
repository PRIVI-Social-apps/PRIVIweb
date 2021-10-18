import React, { useState } from "react";
import styles from "./VideoPlayer.module.scss";
import ReactPlayer from "react-player";
import {useLogin} from "shared/hooks/useLogin";

export const VideoPlayer = ({ selectedMedia, vidRef, playing, setIsPaying, startAudio, endAudio, setPlaying }) => {
  const isLogin = useLogin();
  const [playedSeconds, setPlayedSeconds] = useState<number>(0);

  return (
    <div className={styles.video}>
      {/*<i className={styles.iconWrapper}>
        <PlayIcon className={styles.icon} />
      </i>*/}
      {selectedMedia && selectedMedia.VideoURL && selectedMedia.VideoURL !== "" ? (
        <ReactPlayer
          url={selectedMedia.VideoURL}
          className={styles.player}
          ref={vidRef}
          width="100%"
          progressInterval={100}
          playing={isLogin ? playing : false}
          onPlay={() => {
            setIsPaying(true);
            startAudio();
          }}
          onPause={() => {
            setIsPaying(false);
            endAudio();
            setPlaying(false);
          }}
          onProgress={prog => {
            // funcion que se ejecuta cada progressInterval
            setPlayedSeconds(+prog.playedSeconds.toFixed(2));
          }}
          config={{ file: { 
            attributes: {
              controlsList: 'nodownload'
            }
          }}}
          controls
        />
      ) : null}
    </div>
  );
};
