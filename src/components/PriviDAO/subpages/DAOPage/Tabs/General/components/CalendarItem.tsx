import React from "react";
import { Color, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { TitleGrandLight } from "../../../index.styles";

export default function CalendarItem(props) {
  const styledDate = date => {
    let day = new Date(date).getDate();
    let month = new Date(date).getMonth() + 1;
    let hour = new Date(date).getHours();
    let minutes = new Date(date).getMinutes();

    return `${day < 10 ? `0${day}` : day}.${month < 10 ? `0${month}` : month}.${new Date(
      date
    ).getFullYear()}. @ ${hour < 10 ? `0${hour}` : hour}:${minutes < 10 ? `0${minutes}` : minutes}`;
  };

  if (props.item) {
    return (
      <>
        <TitleGrandLight fontSize="20px" mb={2} disableUppercase>
          {props.item.Title}
        </TitleGrandLight>
        <Box component="p" color="white" fontSize="18px" mb={2}>
          {props.item.Description}
        </Box>
        <Box color="#A306BA">
          {props.item.Date ||
            (props.item.StartDate &&
            props.item.EndDate &&
            new Date(props.item.EndDate).getTime() === new Date(props.item.StartDate).getTime()
              ? styledDate(props.item.Date ?? props.item.StartDate)
              : `from ${styledDate(props.item.StartDate)} to ${styledDate(props.item.EndDate)}`)}
        </Box>
        <StyledDivider mt={2} mb={2} type="solid" color={Color.White} />
      </>
    );
  } else return null;
}
