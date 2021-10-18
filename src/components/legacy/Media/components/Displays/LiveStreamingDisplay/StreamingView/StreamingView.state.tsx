import { DailyParticipantsObject, DailyTrackState } from "@daily-co/daily-js";

export type CallItem = {
  videoTrackState: DailyTrackState | null;
  audioTrackState: DailyTrackState | null;
};

export type CallItems = {
  [key: string]: CallItem;
};

export type CallState = {
  callItems: CallItems;
  clickAllowTimeoutFired: boolean;
  camOrMicError: string | null;
  fatalError: string | null;
  activeSpeakerId: string | null;
};

const initialCallState: CallState = {
  callItems: {
    local: {
      videoTrackState: null,
      audioTrackState: null,
    },
  },
  clickAllowTimeoutFired: false,
  camOrMicError: null,
  fatalError: null,
  activeSpeakerId: null,
};

const CLICK_ALLOW_TIMEOUT = "CLICK_ALLOW_TIMEOUT";
const PARTICIPANTS_CHANGE = "PARTICIPANTS_CHANGE";
const ACTIVE_SPEAKER_CHANGE = "ACTIVE_SPEAKER_CHANGE";
const CAM_OR_MIC_ERROR = "CAM_OR_MIC_ERROR";
const FATAL_ERROR = "FATAL_ERROR";

export type Action =
  | {
      type: typeof CLICK_ALLOW_TIMEOUT;
    }
  | {
      type: typeof PARTICIPANTS_CHANGE;
      participants: DailyParticipantsObject;
    }
  | {
      type: typeof ACTIVE_SPEAKER_CHANGE;
      id: string | null;
    }
  | {
      type: typeof CAM_OR_MIC_ERROR;
      message: string;
    }
  | {
      type: typeof FATAL_ERROR;
      message: string;
    };

function callReducer(callState: CallState, action: Action) {
  switch (action.type) {
    case CLICK_ALLOW_TIMEOUT:
      return {
        ...callState,
        clickAllowTimeoutFired: true,
      };
    case PARTICIPANTS_CHANGE:
      const callItems = getCallItems(action.participants);
      return {
        ...callState,
        callItems,
      };
    case ACTIVE_SPEAKER_CHANGE:
      return {
        ...callState,
        activeSpeakerId: action.id,
      };
    case CAM_OR_MIC_ERROR:
      return { ...callState, camOrMicError: action.message };
    case FATAL_ERROR:
      return { ...callState, fatalError: action.message };
  }
}

function getLocalCallItem(callItems: CallItems) {
  return callItems["local"];
}

function getCallItems(participants: DailyParticipantsObject) {
  let callItems = {};

  for (const [id, participant] of Object.entries(participants).filter(
    ([_, participant]) => participant.owner
  )) {
    callItems[id] = {
      videoTrackState: participant.tracks.video,
      audioTrackState: participant.tracks.audio,
    };
  }
  return callItems;
}

function isLocal(id: string) {
  return id === "local";
}

function getMessage(callState: CallState) {
  function shouldShowClickAllow() {
    const localCallItem = getLocalCallItem(callState.callItems);
    const hasLoaded = localCallItem; // && !localCallItem.isLoading;
    return !hasLoaded && callState.clickAllowTimeoutFired;
  }

  let header: string | null = null;
  let detail: string | null = null;
  let isError = false;
  if (callState.fatalError) {
    header = `Fatal error: ${callState.fatalError}`;
    isError = true;
  } else if (callState.camOrMicError) {
    header = `Camera or mic access error: ${callState.camOrMicError}`;
    detail =
      "See https://help.daily.co/en/articles/2528184-unblock-camera-mic-access-on-a-computer to troubleshoot.";
    isError = true;
  } else if (shouldShowClickAllow()) {
    header = 'Click "Allow" to enable camera and mic access';
  } else if (Object.keys(callState.callItems).length === 1) {
    header = "Copy and share this page's URL to invite others";
    detail = window.location.href;
  }
  return header || detail ? { header, detail, isError } : null;
}

export {
  initialCallState,
  CLICK_ALLOW_TIMEOUT,
  PARTICIPANTS_CHANGE,
  ACTIVE_SPEAKER_CHANGE,
  CAM_OR_MIC_ERROR,
  FATAL_ERROR,
  callReducer,
  isLocal,
  getMessage,
};
