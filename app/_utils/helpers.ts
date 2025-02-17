import { isWithinInterval } from "date-fns";

export const isDateBooked = (bookedDates: Date[], start: Date, end: Date) =>
  bookedDates.some((bookedDate) =>
    isWithinInterval(bookedDate, {
      start,
      end,
    })
  );
