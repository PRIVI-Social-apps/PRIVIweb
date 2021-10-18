import React from "react";
import Waveform from "shared/ui-kit/Page-components/Discord/DiscordAudioWavesurfer/Waveform";

export const AudioPlayer = ({ selectedMedia, setIsPaying, endAudio, startAudio }) => (
  <Waveform
    url={selectedMedia.AudioURL}
    mine={false}
    showTime={true}
    onReadyFunction={() => {}}
    onPlayFunction={() => {
      setIsPaying(true);
      startAudio();
    }}
    onPauseFunction={() => {
      setIsPaying(false);
      endAudio();
    }}
  />
);
