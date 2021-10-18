import React, { useState } from "react";
import axios from "axios";

import { addEventModalStyles } from "./AddEvent.styles";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { DAOButton } from "components/PriviDAO/components/DAOButton";

const infoIcon = require("assets/icons/info_white.png");

export default function AddEventModal(props) {
  const classes = addEventModalStyles();

  //hooks
  const user = useTypedSelector(state => state.user);

  const [status, setStatus] = useState<any>("");
  const [creationProgress, setCreationProgress] = useState(false);

  const [event, setEvent] = useState<any>({
    Creator: user.id,
    Title: "",
    Description: "",
    StartDate: new Date(),
    EndDate: new Date(),
  });

  const addEvent = async () => {
    let validation = validateProjectInfo();

    if (validation === true) {
      const body: any = {
        ...event,
        CommunityId: props.community.CommunityAddress,
      };

      setCreationProgress(true);
      setStatus(undefined);
      axios
        .post(`${URL()}/community/events/createEvent`, body)
        .then(async res => {
          const resp = res.data;
          if (resp.success) {
            setStatus({
              msg: "Event Created!",
              key: Math.random(),
              variant: "success",
            });
            setTimeout(() => {
              props.handleClose();
              props.handleRefresh();
              setCreationProgress(false);
            }, 3000);
          } else {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
            setCreationProgress(false);
          }
        })
        .catch(error => {
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
          setCreationProgress(false);
        });
    }
  };

  const validateProjectInfo = () => {
    if (!(event.Title.length >= 5)) {
      setStatus({
        msg: "Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!event.StartDate) {
      setStatus({
        msg: "Date field invalid.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!event.EndDate || event.StartDate > event.EndDate) {
      setStatus({
        msg: "Date field invalid.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  };

  const handleStartDateChange = (date: Date | null) => {
    setEvent({ ...event, StartDate: date });
  };

  const handleEndDateChange = (date: Date | null) => {
    setEvent({ ...event, EndDate: date });
  };

  return (
    <Modal
      size="small"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
      theme={"dark"}
    >
      <Box mb={3} fontSize={"30px"}>
        New Event
      </Box>
      <Box width="100%" display="flex" alignItems="flex-end" mb={3}>
        <Box width={0.5}>
          <InputWithLabelAndTooltip
            labelName={`Event Title`}
            inputValue={event.Title}
            type={"text"}
            onInputValueChange={e => {
              let eventCopy = { ...event };
              eventCopy.Title = e.target.value;
              setEvent(eventCopy);
            }}
            placeHolder={"Write your title"}
            theme="dark"
          />
        </Box>
        <Box width={0.5} style={{ paddingLeft: 10 }}>
          <Box display="flex" alignItems="center" mb={1}>
            <Box mr={"4px"}>Start Date</Box>
            <img src={infoIcon} style={{ width: "12px", height: "12px" }} alt={"info"} />
          </Box>
          <DateInput
            id="date-picker-start-date1"
            minDate={new Date()}
            format="MM.dd.yyyy"
            placeholder="Select date..."
            value={event.StartDate}
            onChange={handleStartDateChange}
            theme="dark"
          />
        </Box>
      </Box>
      <Box width="100%" display="flex" alignItems="flex-end">
        <Box width={0.5}>
          <InputWithLabelAndTooltip
            labelName={`Event Description`}
            inputValue={event.Description}
            type={"text"}
            onInputValueChange={e => {
              let eventCopy = { ...event };
              eventCopy.Description = e.target.value;
              setEvent(eventCopy);
            }}
            placeHolder={"Write your description"}
            theme="dark"
          />
        </Box>
        <Box width={0.5} style={{ paddingLeft: 10 }}>
          <Box display="flex" alignItems="center" mb={1}>
            <Box mr={"4px"}>End Date</Box>
            <img src={infoIcon} style={{ width: "12px", height: "12px" }} alt={"info"} />
          </Box>
          <DateInput
            id="date-picker-end-date1"
            minDate={new Date()}
            format="MM.dd.yyyy"
            placeholder="Select date..."
            value={event.EndDate}
            onChange={handleEndDateChange}
            theme="dark"
          />
        </Box>
      </Box>

      <Box width="100%" mt={6} display="flex" justifyContent="flex-end">
        <LoadingWrapper theme="dark" loading={creationProgress}>
          <DAOButton insideCard onClick={addEvent}>
            Post event
          </DAOButton>
        </LoadingWrapper>
      </Box>
      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus(undefined)}
        />
      )}
    </Modal>
  );
}
