import { useStreaming } from "shared/contexts/StreamingContext";
import { useEffect, useState } from "react";

export const useLiveWatcherSpendings = () => {
  const { currentStreaming, dailyCall } = useStreaming();

  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (dailyCall) {
      setDuration(0);

      const intervalId = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1_000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [dailyCall]);

  const pricePerSeconds = currentStreaming?.price ?? 0;
  const amount = pricePerSeconds * duration;
  const unit = currentStreaming?.priceUnit ?? "";

  return {
    duration,
    amount,
    unit,
  };
};
