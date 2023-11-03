import { Moment } from "moment";

/**
 * If the date is within 60 minutes, return the number of minutes ago.
 * If the date is within 24 hours, return the number of hours ago.
 * Otherwise, return the date in YYYY/MM/DD format.
 * @param date - moment object to format
 * @param now - moment object of current time
 * @returns formatted date
 */
export const formatDate = (date: Moment, now: Moment): string => {
  const diff = now.diff(date, "minutes");
  if (diff < 60) {
    return `${diff} mins ago`;
  } else if (60 <= diff && diff < 24 * 60) {
    return `${Math.floor(diff / 60)}h ago`;
  } else {
    return date.format("YYYY/MM/DD");
  }
};
