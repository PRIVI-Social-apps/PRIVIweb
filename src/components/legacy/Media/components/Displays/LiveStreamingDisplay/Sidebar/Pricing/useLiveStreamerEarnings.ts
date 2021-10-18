import { useStreaming } from "shared/contexts/StreamingContext";
import { useState } from "react";
import { useInterval } from "shared/hooks/useInterval";
import { getEarnings, StreamingEarnings } from "shared/services/API/StreamingAPI";
import { useTypedSelector } from "store/reducers/Reducer";

const LIVE_UPDATE_INTERVAL = 10_000;

export const useLiveStreamerEarnings = () => {
  const [earnings, setEarnings] = useState<StreamingEarnings | null>(null);

  const currentUser = useTypedSelector(state => state.user);
  const { currentStreaming } = useStreaming();

  useInterval(async () => {
    if (currentStreaming) {
      const newEarnings = await getEarnings({ streamingId: currentStreaming.id, type: currentStreaming.type });
      setEarnings(newEarnings);
    }
  }, LIVE_UPDATE_INTERVAL);

  const amount = earnings?.streamers?.[currentUser.id] ?? 0;
  const unit = currentStreaming?.priceUnit ?? "";

  return {
    amount,
    unit,
  };
};
