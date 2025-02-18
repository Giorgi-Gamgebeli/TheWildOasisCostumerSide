"use client";

import {
  addDays,
  addMonths,
  differenceInDays,
  isPast,
  isSameDay,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservation } from "../../_context/ReservationContext";
import { z } from "zod";
import { CabinsSchemaDatabase } from "../../_schemas/databaseSchemas";
import toast from "react-hot-toast";
import { isDateBooked } from "@/app/_utils/helpers";

type DateSelectorProps = {
  cabin: z.infer<typeof CabinsSchemaDatabase>;
  settings: {
    id: number;
    createdAt: Date;
    minimumReservationLength: number;
    maxReservationLength: number;
    maxGuestsPerReservation: number;
    breakFastPrice: number;
  };
  bookedDates: Date[];
};

function DateSelector({
  settings: { minimumReservationLength, maxReservationLength },
  bookedDates,
  cabin: { regularPrice, discount },
}: DateSelectorProps) {
  const { range, setRange, resetRange } = useReservation();

  const numNights =
    range.from && range.to ? differenceInDays(range.to, range.from) : 0;

  const cabinPrice = numNights * (regularPrice - discount);

  return (
    <div className="flex min-w-[40rem] flex-col justify-between border border-primary-800">
      <DayPicker
        classNames={{
          root: "bg-transparent text-primary-100 text-[1rem] inline-flex items-center rounded-lg shadow-lg w-full h-full",
          nav: "w-full col-start-1 col-end-3 flex justify-between text-white fill-primary-200",
          button_previous:
            "flex items-center justify-center h-9 w-9 hover:outline-accent-500 hover:outline-1 hover:outline hover:rounded-full disabled:fill-gray-600 disabled:hover:outline-none",
          button_next:
            "flex items-center justify-center h-9 w-9 hover:outline-accent-500 hover:outline-1 hover:outline hover:rounded-full disabled:fill-gray-600 disabled:hover:outline-none",
          months: "grid grid-cols-[1fr_1fr] w-full h-full p-4",
          month: "flex items-center flex-col gap-5",
          month_caption: "flex justify-center text-[1.4rem]",
          disabled: "text-gray-600 pointer-events-none",
          today: "cursor-pointer",
          day_button:
            "w-full inline-flex justify-center items-center min-w-10 max-w-10 min-h-10 max-h-10 text-center hover:outline-accent-500 hover:outline-1 hover:outline hover:rounded-full",
          selected: "bg-accent-500 text-white rounded-full",
          range_start: "bg-accent-500 text-white",
          range_end: "bg-accent-500 text-white",
          range_middle: "bg-accent-500 text-white",
          weekday: "mx-auto",
          week_number: "text-red-500",
          month_grid: "flex flex-col gap-3",
          weekdays: "flex justify-center",
        }}
        mode="range"
        onSelect={(selected) => {
          setRange({ from: selected?.from, to: undefined });

          if (selected?.from !== selected?.to) {
            setRange({ from: selected?.from, to: selected?.to });
          }

          if (!selected?.from || !selected?.to) return;

          if (isDateBooked(bookedDates, selected?.from, selected?.to)) {
            resetRange();
            toast.error(
              "Selected range includes booked dates. Try reserving separately",
            );
          }

          if (!range?.from && !range.to) return;

          const rangeLength = differenceInDays(selected?.to, selected?.from);

          if (rangeLength < minimumReservationLength) {
            resetRange();
            toast.error(
              `Minimum reservation length is: ${minimumReservationLength} (day)`,
            );
          }
        }}
        selected={range}
        numberOfMonths={2}
        startMonth={new Date()}
        hidden={{ before: addDays(new Date(), 1) }}
        endMonth={addMonths(new Date(), maxReservationLength / 30)}
        disabled={(curDate) =>
          isPast(addDays(curDate, 1)) ||
          bookedDates.some((date) => isSameDay(date, curDate)) ||
          curDate > addDays(new Date(), maxReservationLength)
        }
      />

      <div className="flex h-[72px] items-center justify-between bg-accent-500 px-8 text-primary-800">
        <div className="flex items-baseline gap-6">
          <p className="flex items-baseline gap-2">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="font-semibold text-primary-700 line-through">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range.from || range.to ? (
          <button
            className="border border-primary-800 px-4 py-2 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
