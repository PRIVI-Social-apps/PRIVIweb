import { StreamParticipants } from "shared/contexts/StreamingContext";
import React, { useMemo } from "react";
import { BorderRadius, Color, Header3 } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import styled from "styled-components";
import { StreamerTile } from "./StreamerTile";
import { CallItems, isLocal } from "./StreamingView.state";

type StreamerTilesLayoutProps = {
  callItems: CallItems;
  activeSpeakerId: string | null;
  participants: StreamParticipants;
};

export const StreamerTilesLayout: React.FunctionComponent<StreamerTilesLayoutProps> = ({
  callItems,
  participants,
  activeSpeakerId,
}) => {
  const currentUser = useTypedSelector(state => state.user);

  const { tiles, widthPercent, heightPercent } = useMemo(() => {
    const tiles = Object.entries(callItems).map(([sessionId, callItem]) => {
      const user = isLocal(sessionId)
        ? participants.allStreamers.find(user => user.id === currentUser.id)
        : participants.allStreamers.find(user => user.id === sessionId);

      return {
        sessionId,
        callItem,
        user,
        isLocal: isLocal(sessionId),
      };
    });

    return {
      tiles,
      ...getTileLayoutConfig(tiles.length),
    };
  }, [callItems, currentUser.id, participants.allStreamers]);

  return (
    <TileLayoutContainer>
      {tiles.length > 0 ? (
        tiles.map(({ sessionId, callItem, user, isLocal }) => {
          return (
            <TileWrapper key={sessionId} widthPercent={widthPercent} heightPercent={heightPercent}>
              <StreamerTile
                user={user}
                videoTrackState={callItem.videoTrackState}
                audioTrackState={callItem.audioTrackState}
                isLocalPerson={isLocal}
                isActiveSpeaker={activeSpeakerId === sessionId}
              />
            </TileWrapper>
          );
        })
      ) : (
        <EmptyStateText>Please wait for creators to join</EmptyStateText>
      )}
    </TileLayoutContainer>
  );
};

const getTileLayoutConfig = (numberOfTiles: number) => {
  if (numberOfTiles <= 2) {
    return {
      widthPercent: 100 / numberOfTiles,
      heightPercent: 100,
    };
  }

  return {
    widthPercent: 100 / Math.ceil(numberOfTiles / 2),
    heightPercent: 50,
  };
};

const TileWrapper = styled.div<{ widthPercent: number; heightPercent: number }>`
  width: ${p => p.widthPercent}%;
  height: ${p => p.heightPercent}%;

  position: relative;
`;

const TileLayoutContainer = styled.div`
  background-color: ${Color.Black};
  border-radius: ${BorderRadius.XL};

  width: 100%;
  height: 65vh;
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;


const EmptyStateText = styled(Header3)`
  color: ${Color.White};
`;