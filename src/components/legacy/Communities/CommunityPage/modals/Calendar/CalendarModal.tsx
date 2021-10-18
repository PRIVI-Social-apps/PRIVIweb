import React, { useState, useEffect } from "react";
import { Dialog } from "@material-ui/core";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import Moment from "react-moment";

import "./CalendarModal.css";
import { HeartIcon, MarkIcon, ShareIcon } from "shared/ui-kit/Icons";

const CalendarModal = props => {
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);
  const [thisWeekCalendar, setThisWeekCalendar] = useState<any[]>([]);
  const [nextWeekCalendar, setNextWeekCalendar] = useState<any[]>([]);
  const [pastCalendar, setpastCalendar] = useState<any[]>([]);

  const [openAddEventModal, setOpenAddEventModal] = useState<boolean>(false);
  const [addEventVisible, showAddEventVisible] = useState(false);

  useEffect(() => {
    if (props.calendar && props.calendar.length > 0) {
      filterWeeks(props.calendar);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.calendar]);

  useEffect(() => {
    if (props.community && props.community.Creator) {
      if (user.id === props.community.Creator) {
        showAddEventVisible(true);
      }
      if (props.community && props.community.Admins && props.community.Admins.length > 0) {
        props.community.Admins.forEach(function (admin) {
          if (user.id === admin.userId) {
            showAddEventVisible(true);
          }
        });
      }
    }
  }, [props.community]);

  const getRandomAvatarNumber = () => {
    const random = Math.floor(Math.random() * 100);
    if (random < 10) {
      return `00${random}`;
    }

    return `0${random}`;
  };

  const filterWeeks = calendar => {
    if (calendar.length > 0) {
      const thisWeek = getNumberOfWeek(new Date());
      const thisWeekEvents = [] as any;
      const nextWeekEvents = [] as any;
      const pastEvents = [] as any;

      calendar.forEach(item => {
        if (getNumberOfWeek(new Date(item.Date)) === thisWeek) {
          thisWeekEvents.push(item);
        } else if (getNumberOfWeek(new Date(item.Date)) === thisWeek + 1) {
          nextWeekEvents.push(item);
        } else {
          pastEvents.push(item);
        }

        setThisWeekCalendar(thisWeekEvents);
        setNextWeekCalendar(nextWeekEvents);
        setpastCalendar(pastEvents);
      });
    }
  };

  const getNumberOfWeek = (date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const handleOpenAddEventModal = () => {
    setOpenAddEventModal(true);
  };

  const handleCloseAddEventModal = () => {
    setOpenAddEventModal(false);
  };

  const getEventItem = (event, index) => {
    const [eventCreator] = users.filter((oneUser) => oneUser.id === event.Creator);
    console.log('event.Creator', eventCreator);
    return (
      <div
        key={index}
        style={{
          boxShadow: "0px 0px 3px 0px rgba(148,148,148,0.66)",
          padding: 10,
          borderRadius: 20,
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
          <div
            style={{ display: "flex", flexDirection: "row", width: 250, padding: 5, alignItems: "center" }}
          >
            <img
              src={
                eventCreator && eventCreator.imageURL
                  ? `${eventCreator.imageURL}`
                  : `${URL()}/assets/anonAvatars/ToyFaces_Colored_BG_${getRandomAvatarNumber()}`
              }
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "2px solid #fff",
                boxShadow: "0px 2px 8px rgb(0 0 0 / 20%)",
              }}
            />
            <div style={{ marginLeft: 10 }}>
              <div style={{ fontSize: 16 }}>{eventCreator?.name || "Unknown"}</div>
              {/* <div style={{ color: "#FF79D1" }}>{event.Creator}</div> */}
            </div>
          </div>
          <div style={{ padding: "5px 5px 5px 15px", borderLeft: "1px solid #ccc" }}>
            <div
              style={{ fontSize: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              {event.Title || "No Event Title"}
              <button className="btn-notify">
                🛎 notify me
              </button>
            </div>
            <div style={{ fontWeight: "bold", fontSize: 14 }}>
              <Moment format={"DD MMM YYYY"}>{event.date}</Moment>
            </div>
            <p style={{ minWidth: "400px", fontSize: 14, color: "#333" }}>{event.Description || "No description"}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
              <button style={{ height: 30, paddingTop: 0, paddingBottom: 0 }}>I will attend</button>
              <div className="buttonContainer">
                <MarkIcon className="buttonBox" />
                <ShareIcon className="buttonBox" />
                <HeartIcon className="buttonBox" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
      maxWidth="md"
      fullWidth={false}
    >
      <div className="modal-content calendar-modal">
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <h2>Event calendar</h2>
        <h4 style={{ fontWeight: "bold" }}>This week</h4>
        {thisWeekCalendar.length > 0 ? (
          thisWeekCalendar.map((item, index) => getEventItem(item, index))
        ) : (
          <span>No event for this week</span>
        )}
        <h4 style={{ fontWeight: "bold" }}>Next week</h4>
        {nextWeekCalendar.length > 0 ? (
          nextWeekCalendar.map((item, index) => getEventItem(item, index))
        ) : (
          <span>No event for next week</span>
        )}
        <h4 style={{ fontWeight: "bold" }}>Past week</h4>
        {pastCalendar.length > 0 ? (
          pastCalendar.map((item, index) => getEventItem(item, index))
        ) : (
          <span>No event for past week</span>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 30, marginBottom: 20, marginLeft: "auto" }}>
          <button onClick={props.showAll}>See All Events</button>
        </div>
      </div>
    </Dialog>
  );
};

export default CalendarModal;
