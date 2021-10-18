import { DailyEvent } from "@daily-co/daily-js";
import { Grid } from "@material-ui/core";
import {
  MediaComments,
  MediaContentWrapper,
  MediaDisplayHeader,
  RateMedia,
} from "components/legacy/Media/components/Displays/elements";
import { useStreaming } from "shared/contexts/StreamingContext";
import React, { useEffect, useState } from "react";
import { DangerButton, PrimaryButton } from "shared/ui-kit";
import { Sidebar } from "./Sidebar";
import { STREAM_STATE } from "./StreamingView/consts";
import { StreamCall } from "./StreamingView/StreamingView";

type LiveScreenProps = {
  onClose?: () => void;
};

export const LiveScreen: React.FunctionComponent<LiveScreenProps> = ({ onClose }) => {
  const [streamState, setStreamState] = useState(STREAM_STATE.IDLE);
  const { dailyCall, participants, leaveStream, endStream, isUserAuthorizedToEndStream } = useStreaming();

  useEffect(() => {
    if (!dailyCall) return;

    const events: DailyEvent[] = ["joined-meeting", "left-meeting", "error"];

    const handleNewMeetingState = event => {
      event && console.log("[daily.co event]", event.action);
      if (!dailyCall) return;

      switch (dailyCall.meetingState()) {
        case "joined-meeting":
          setStreamState(STREAM_STATE.JOINED);
          break;
        case "left-meeting":
          dailyCall.destroy().then(() => {
            setStreamState(STREAM_STATE.IDLE);
          });
          break;
        case "error":
          setStreamState(STREAM_STATE.ERROR);
          break;
        default:
          break;
      }
    };

    for (const event of events) {
      dailyCall.on(event, handleNewMeetingState);
    }

    return () => {
      for (const event of events) {
        dailyCall.off(event, handleNewMeetingState);
      }
      leaveStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyCall]);

  const onLeaveStream = async () => {
    await leaveStream();
    onClose?.();
    setStreamState(streamState === STREAM_STATE.ERROR ? STREAM_STATE.IDLE : STREAM_STATE.LEAVING);
  };

  const onEndSteam = async () => {
    await endStream();
    onClose?.();
    setStreamState(streamState === STREAM_STATE.ERROR ? STREAM_STATE.IDLE : STREAM_STATE.LEAVING);
  };

  useEffect(() => {
    setStreamState(STREAM_STATE.JOINING);

    return () => {
      setStreamState(STREAM_STATE.IDLE);
    };
  }, []);

  return (
    <>
      {dailyCall && (
        <MediaContentWrapper>
          <MediaDisplayHeader />
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12} md={8}>
              <StreamCall dailyCall={dailyCall} participants={participants} />
              <RateMedia />
              <MediaComments />
            </Grid>
            <Grid item xs={12} md={4}>
              <Sidebar />

              <PrimaryButton onClick={onLeaveStream} size="medium" block>
                Leave Room
              </PrimaryButton>

              {isUserAuthorizedToEndStream && (
                <DangerButton style={{ marginLeft: "0px" }} onClick={onEndSteam} size="medium" block>
                  End Stream
                </DangerButton>
              )}
            </Grid>
          </Grid>
        </MediaContentWrapper>
      )}
    </>
  );
};
