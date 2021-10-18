import { ParticipantType, useStreaming } from "shared/contexts/StreamingContext";
import React from "react";
import { PriceInfo } from "./PriceInfo";
import { PricingLiveStreamerEarnings } from "./PricingLiveStreamerEarnings";
import { StreamingPricingMethod } from "shared/services/API/StreamingAPI";
import { PricingLiveWatcherSpendings } from "./PricingLiveWatcherSpendings";

export const Pricing: React.FunctionComponent = () => {
  const { currentStreaming, participantType } = useStreaming();

  return (
    <>
      <PriceInfo />

      {(participantType === ParticipantType.MainStreamer ||
        participantType === ParticipantType.SecondaryStreamer) && <PricingLiveStreamerEarnings />}

      {participantType === ParticipantType.Watcher &&
        currentStreaming?.pricingMethod === StreamingPricingMethod.Streaming && (
          <PricingLiveWatcherSpendings />
        )}
    </>
  );
};
