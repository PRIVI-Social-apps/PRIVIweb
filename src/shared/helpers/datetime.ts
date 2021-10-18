import { intervalToDuration } from "date-fns";

export const formatDateTime = (date: Date) => date.toLocaleString();

export const formatDateTimeWithNA = (date: Date | undefined) => (date ? formatDateTime(date) : "N/A");

export const formatSecondsDuration = (seconds: number) => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  return [duration.hours, duration.minutes, duration.seconds]
    .map(value => (value || 0).toString().padStart(2, "0"))
    .join(":");
};

export const formatDDMMYY = dateNum => {
  const date = new Date(dateNum);
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
