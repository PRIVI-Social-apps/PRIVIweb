import { DailyCall, DailyEvent, DailyEventObjectActiveSpeakerChange } from "@daily-co/daily-js";
import { StreamParticipants } from "shared/contexts/StreamingContext";
import React, { useEffect, useReducer } from "react";
import { StreamerTilesLayout } from "./StreamerTilesLayout";
import {
  ACTIVE_SPEAKER_CHANGE,
  callReducer,
  CAM_OR_MIC_ERROR,
  CLICK_ALLOW_TIMEOUT,
  FATAL_ERROR,
  initialCallState,
  PARTICIPANTS_CHANGE,
} from "./StreamingView.state";

type StreamCallProps = {
  dailyCall: DailyCall;
  participants: StreamParticipants;
};

export const StreamCall: React.FunctionComponent<StreamCallProps> = ({ dailyCall, participants }) => {
  const [callState, dispatch] = useReducer(callReducer, initialCallState);

  useEffect(() => {
    dispatch({
      type: PARTICIPANTS_CHANGE,
      participants: dailyCall.participants(),
    });

    const events = ["participant-joined", "participant-updated", "participant-left"];

    const handleNewParticipantsState = event => {
      event && console.log("[daily.co event]", event.action);

      dispatch({
        type: PARTICIPANTS_CHANGE,
        participants: dailyCall.participants(),
      });
    };

    for (const event of events) {
      dailyCall.on(event as DailyEvent, handleNewParticipantsState);
    }

    return () => {
      for (const event of events) {
        dailyCall.off(event as DailyEvent, handleNewParticipantsState);
      }
    };
  }, [dailyCall]);

  useEffect(() => {
    const handleErrorEvent = e => {
      console.log("[daily.co event]", e.action);
      dispatch({
        type: FATAL_ERROR,
        message: (e && e.errorMsg) || "Unknown",
      });
    };

    // We're making an assumption here: there is no error when callObject is
    // first assigned.
    dailyCall.on("error", handleErrorEvent);

    return () => {
      dailyCall.off("error", handleErrorEvent);
    };
  }, [dailyCall]);

  useEffect(() => {
    const handleActiveSpeakerState = (event?: DailyEventObjectActiveSpeakerChange) => {
      dispatch({
        type: ACTIVE_SPEAKER_CHANGE,
        id: (event && event.activeSpeaker && event.activeSpeaker.peerId) || null,
      });
    };

    dailyCall.on("active-speaker-change", handleActiveSpeakerState);

    return () => {
      dailyCall.off("active-speaker-change", handleActiveSpeakerState);
    };
  }, [dailyCall]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch({ type: CLICK_ALLOW_TIMEOUT });
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const handleCameraErrorEvent = event => {
      console.log("[daily.co event]", event.action);
      dispatch({
        type: CAM_OR_MIC_ERROR,
        message: (event && event.errorMsg && event.errorMsg.errorMsg) || "Unknown",
      });
    };

    dailyCall.on("camera-error", handleCameraErrorEvent);

    return () => {
      dailyCall.off("camera-error", handleCameraErrorEvent);
    };
  }, [dailyCall]);

  return (
    <StreamerTilesLayout
      callItems={callState.callItems}
      participants={participants}
      activeSpeakerId={callState.activeSpeakerId}
    />
  );
};