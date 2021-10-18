import React, { useState } from "react";
import axios from "axios";
import DateFnsUtils from "@date-io/date-fns";

import { Grid } from "@material-ui/core";
import { KeyboardTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import { addEventModalStyles } from "./AddEvent.styles";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { Modal, PrimaryButton } from "shared/ui-kit";

const timerIcon = require("assets/icons/timer_icon.png");

export default function AddEventModal(props) {
  const classes = addEventModalStyles();

  //hooks
  const user = useTypedSelector(state => state.user);

  const [status, setStatus] = useState<any>("");
  const [creationProgress, setCreationProgress] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());

  const [event, setEvent] = useState<any>({
    Creator: user.id,
    Date: new Date(),
    Title: "",
    Description: "",
  });

  const addEvent = async () => {
    let validation = validateProjectInfo();

    if (validation === true) {
      const body: any = {
        Title: event.Title,
        Date: selectedDate,
        Creator: user.id,
        CommunityId: props.community.CommunityAddress,
        Description: event.Description,
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
    } else if (!event.Date) {
      setStatus({
        msg: "Date field invalid.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <Modal
      size="small"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
    >
      <div className={classes.modalContent}>
        <h4>New Event</h4>
        <Grid item xs={12}>
          <div style={{marginBottom: 10}}>
            <InputWithLabelAndTooltip
              labelName={`Event Title`}
              inputValue={event.Title}
              type={"text"}
              onInputValueChange={e => {
                let eventCopy = { ...event };
                eventCopy.Title = e.target.value;
                setEvent(eventCopy);
              }}
              placeHolder={"Enter event title.."}
            />
          </div>

          <InputWithLabelAndTooltip
            labelName={`Event Description`}
            inputValue={event.Description}
            onInputValueChange={e => {
              let eventCopy = { ...event };
              eventCopy.Description = e.target.value;
              setEvent(eventCopy);
            }}
            placeHolder={"Enter event description..."}
          />

          <div
            style={{
              display: "inline-flex",
              marginTop: 20,
            }}
          >
            <div
              style={{
                marginRight: 5,
              }}
            >
              <div className={classes.infoHeaderCreatePod}>Event Date</div>
              <DateInput
                id="date-picker-start-date1"
                minDate={new Date()}
                format="MM.dd.yyyy"
                placeholder="Select date..."
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            <div
              style={{
                marginLeft: 5,
              }}
            >
              <div className={classes.infoHeaderCreatePod}>Event Time</div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker
                  id="date-picker-start-date2"
                  style={{ marginTop: 16 }}
                  // minDate={new Date()}
                  // format="MM.dd.yyyy"
                  placeholder="Select time..."
                  value={selectedDate}
                  onChange={handleDateChange}
                  keyboardIcon={<img src={timerIcon} alt={"timer"} />}
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>
        </Grid>
        <LoadingWrapper loading={creationProgress}>
          <div className={classes.addBtn}>
            <PrimaryButton size="medium" onClick={addEvent}>
              Add
            </PrimaryButton>
          </div>
        </LoadingWrapper>
        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </Modal>
  );
}
