import React, { useState, useEffect } from "react";
import Moment from "react-moment";

import { addEventModalStyles } from "./AddEvent.styles";
import { Color, Modal, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { TitleGrandLight } from "components/PriviDAO/subpages/DAOPage/index.styles";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import { getUsersInfoList } from "store/selectors";
import { useSelector } from "react-redux";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";

const CalendarModal = props => {
  const classes = addEventModalStyles();

  const [thisWeekCalendar, setThisWeekCalendar] = useState<any[]>([]);
  const [nextWeekCalendar, setNextWeekCalendar] = useState<any[]>([]);

  useEffect(() => {
    if (props.calendar && props.calendar.length > 0) {
      filterWeeks(props.calendar);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.calendar]);

  const filterWeeks = calendar => {
    if (calendar.length > 0) {
      const thisWeek = getNumberOfWeek(new Date());
      const thisWeekEvents = [] as any;
      const nextWeekEvents = [] as any;

      calendar.forEach(item => {
        if (
          getNumberOfWeek(new Date(item.Date)) === thisWeek ||
          getNumberOfWeek(new Date(item.StartDate)) === thisWeek
        ) {
          thisWeekEvents.push(item);
        } else if (
          getNumberOfWeek(new Date(item.StartDate)) === thisWeek + 1 ||
          getNumberOfWeek(new Date(item.Date)) === thisWeek + 1
        ) {
          nextWeekEvents.push(item);
        }

        setThisWeekCalendar(thisWeekEvents);
        setNextWeekCalendar(nextWeekEvents);
      });
    }
  };

  const getNumberOfWeek = (date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  return (
    <Modal
      isOpen={props.open}
      theme="dark"
      size={"medium"}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
    >
      <Box display="flex" alignItems="center" flexDirection="column" fontSize={"18px"}>
        <TitleGrandLight disableUppercase mb={2}>
          Event Calendar
        </TitleGrandLight>
        <Box width="100%">
          <StyledDivider color={Color.White} type="solid" />
        </Box>
        <Box mt={1} mb={1} fontWeight={800}>
          THIS WEEK
        </Box>
        <Box width="100%">
          <StyledDivider color={Color.White} type="solid" />
        </Box>
        {thisWeekCalendar.length > 0 ? (
          thisWeekCalendar.map((item, index) => <EventItem item={item} index={index} />)
        ) : (
          <Box mt="5px" mb="5px">
            No events for this week
          </Box>
        )}
        <Box width="100%">
          <StyledDivider color={Color.White} type="solid" />
        </Box>
        <Box mt={1} mb={1} fontWeight={800}>
          NEXT WEEK
        </Box>
        <Box width="100%">
          <StyledDivider color={Color.White} type="solid" />
        </Box>
        {nextWeekCalendar.length > 0 ? (
          nextWeekCalendar.map((item, index) => <EventItem item={item} index={index} />)
        ) : (
          <Box mt="5px" mb="5px">
            No events for next week
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default CalendarModal;

const EventItem = (event, index) => {
  const users = useSelector(getUsersInfoList);

  const [creator, setCreator] = useState<any>({});

  useEffect(() => {
    if (users) {
      setCreator(users.find(u => u.id === event?.item?.Creator));
    }
  }, [event, users]);

  const handleNotify = () => {};

  const handleAttend = () => {};

  return (
    <Box display="flex" flexDirection="column" width="100%" key={index} mb={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
        <Box display="flex" alignItems="center">
          <img
            src={creator && creator?.url ? `${creator.url}?${Date.now()}` : getRandomAvatar()}
            style={{
              minWidth: "48px",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <Box ml={2} fontFamily="Agrandir GrandLight">
            {creator?.urlSlug ?? creator?.name ?? "Username"}
          </Box>
        </Box>
        <Box fontSize="14px" style={{ cursor: "pointer" }} onClick={handleNotify}>
          🛎🟢 notify me
        </Box>
      </Box>

      <Box mt={2} mb={2} fontWeight={800}>
        {event?.item?.Title ?? "Event Name"}
      </Box>

      <Box color="#D810D6" mt={2} mb={2}>
        <Moment format={"DD MMM YYYY"}>{event?.item?.date}</Moment>
      </Box>

      {event?.item?.Description && <Box component={"p"}>{event?.item?.Description}</Box>}

      <Box mt={2} mb={2} display="flex" justifyContent="flex-end" width="100%">
        <DAOButton onClick={handleAttend}>I will attend</DAOButton>
      </Box>
      <Box width="100%">
        <StyledDivider color={Color.White} type="solid" />
      </Box>
    </Box>
  );
};
