import { DailyTrackState } from "@daily-co/daily-js";
import React, { useEffect, useMemo, useRef } from "react";
import { Avatar, Color, grid, HeaderBold4, HeaderBold5 } from "shared/ui-kit";
import { UserInfo } from "store/actions/UsersInfo";
import styled from "styled-components";

type StreamerTileProps = {
  user: UserInfo | undefined;
  videoTrackState: DailyTrackState | null;
  audioTrackState: DailyTrackState | null;
  isLocalPerson: boolean;
  onClick?: () => void;
  isActiveSpeaker: boolean;
};

export const StreamerTile: React.FunctionComponent<StreamerTileProps> = ({
  user: userInfo,
  videoTrackState,
  audioTrackState,
  isLocalPerson,
  isActiveSpeaker,
  onClick,
}) => {
  const videoEl = useRef<HTMLVideoElement>(null);
  const audioEl = useRef<HTMLAudioElement>(null);

  const videoTrack = useMemo(
    () =>
      videoTrackState && videoTrackState.track && videoTrackState.state === "playable"
        ? new MediaStream([videoTrackState.track])
        : null,
    [videoTrackState]
  );

  const audioTrack = useMemo(
    () =>
      audioTrackState && audioTrackState.track && audioTrackState.state === "playable"
        ? new MediaStream([audioTrackState.track])
        : null,
    [audioTrackState]
  );

  useEffect(() => {
    if (videoEl.current && videoTrack) {
      videoEl.current.srcObject = videoTrack;
    }
  }, [videoTrack]);

  useEffect(() => {
    if (audioEl.current && audioTrack) {
      audioEl.current.srcObject = audioTrack;
    }
  }, [audioTrack]);

  function renderAudio() {
    return !isLocalPerson && audioTrackState && <audio autoPlay playsInline ref={audioEl} />;
  }

  return (
    <Container onClick={onClick}>
      {videoTrack ? (
        <>
          <StreamerMetaWrapper>
            {userInfo && <Avatar key={userInfo.id} url={userInfo.imageURL} size="small" />}
            <StreamerNameSmall isActiveSpeaker={isActiveSpeaker}>
              {userInfo?.name ?? "Loading..."}
            </StreamerNameSmall>
          </StreamerMetaWrapper>
          <VideoWrapper>
            <Video autoPlay muted playsInline ref={videoEl} />
          </VideoWrapper>
        </>
      ) : (
        <AvatarWrapper>
          {userInfo && <Avatar key={userInfo.id} url={userInfo.imageURL} size="xlarge" />}
          <StreamerNameLarge isActiveSpeaker={isActiveSpeaker}>
            {userInfo?.name ?? "Loading..."}
          </StreamerNameLarge>
        </AvatarWrapper>
      )}
      {renderAudio()}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const VideoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Video = styled.video`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const AvatarWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StreamerNameSmall = styled(HeaderBold5)<{ isActiveSpeaker: boolean }>`
  margin-left: ${grid(1)};
  transition: color 0.2s ease;
  color: ${p => (p.isActiveSpeaker ? Color.Yellow : Color.White)};
`;

const StreamerNameLarge = styled(HeaderBold4)<{ isActiveSpeaker: boolean }>`
  margin-top: ${grid(2)};
  transition: color 0.2s ease;
  border: ${p => (p.isActiveSpeaker ? `1px solid ${Color.Yellow}` : "none")};
  color: ${p => (p.isActiveSpeaker ? Color.Yellow : Color.White)};
`;

const StreamerMetaWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;

  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
  padding: ${grid(3)};

  display: flex;
  align-items: center;

  ${StreamerNameSmall} {
    margin-bottom: 0;
  }
`;
