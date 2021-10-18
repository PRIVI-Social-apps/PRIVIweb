import React from 'react';
import { StyledDivider } from 'shared/ui-kit';

export default function CalendarItem(props) {
  const styledDate = (date) => {
    let day = new Date(date).getDate();
    let month = new Date(date).getMonth() + 1;
    let hour = new Date(date).getHours();
    let minutes = new Date(date).getMinutes();

    return `${day < 10 ? `0${day}` : day}.${month < 10 ? `0${month}` : month
      }.${new Date(date).getFullYear()}. @ ${hour < 10 ? `0${hour}` : hour}:${minutes < 10 ? `0${minutes}` : minutes
      }`;
  };

  if (props.item) {
    return (
      <div className="calendar">
        <div className={'calendar-item'}>
          <h4>{props.item.Title}</h4>
          {props.item.Description &&
            <span style={{color: "#707582", display: "block", borderBottom: "1px dashed #707582", marginBottom: 10}}>{props.item.Description}</span>
          }
          <p>{styledDate(props.item.Date)}</p>
        </div>
      </div>

    );
  } else return null;
}
