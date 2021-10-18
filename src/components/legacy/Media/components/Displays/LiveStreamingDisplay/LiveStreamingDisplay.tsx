import React from "react";
import { LiveScreen } from "./LiveScreen";

type LiveStreamingDisplayProps = {
  onClose?: () => void;
};

export const LiveStreamingDisplay: React.FunctionComponent<LiveStreamingDisplayProps> = ({ onClose }) => (
  <LiveScreen onClose={onClose} />
);
