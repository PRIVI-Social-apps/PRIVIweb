import React from "react";
import { HighlightedValue } from "./HighlightedValue";
import { useLiveWatcherSpendings } from "./useLiveWatcherSpendings";

export const PricingLiveWatcherSpendings: React.FunctionComponent = () => {
  const { duration, amount, unit } = useLiveWatcherSpendings();

  return <HighlightedValue label="Spent" value={`${duration} sec = ${unit} ${amount}`} />;
};
