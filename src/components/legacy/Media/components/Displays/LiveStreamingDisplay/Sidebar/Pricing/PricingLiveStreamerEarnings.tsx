import React from "react";
import { useLiveStreamerEarnings } from "./useLiveStreamerEarnings";
import { HighlightedValue } from "./HighlightedValue";

export const PricingLiveStreamerEarnings: React.FunctionComponent = () => {
  const { amount, unit } = useLiveStreamerEarnings();

  return <HighlightedValue label="Raised" value={`${unit} ${amount}`} />;
};
