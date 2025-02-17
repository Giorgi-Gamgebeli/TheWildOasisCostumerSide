"use client";

import { differenceInDays } from "date-fns";
import { createReservation } from "../../_lib/actions";
import { useReservation } from "../../_context/ReservationContext";
import SubmitButton from "../../_components/SubmitButton";
import { z } from "zod";
import { CabinsSchemaDatabase } from "../../_schemas/databaseSchemas";
import LoginMessage from "./LoginMessage";
import { useSession } from "next-auth/react";
import Image from "next/image";
import defaultAvatar from "@/public/default-user.jpg";

type ReservationFormProps = {
  cabin: z.infer<typeof CabinsSchemaDatabase>;
};

function ReservationForm({ cabin }: ReservationFormProps) {
  const { range, resetRange } = useReservation();
  const { data } = useSession();
  const { maxCapacity, regularPrice, discount, id } = cabin;
  const startDate = range.from;
  const endDate = range.to;

  const numNights = differenceInDays(endDate!, startDate!);
  const cabinPrice = numNights * (regularPrice - discount);

  const reservationData = {
    startDate: new Date(startDate!),
    endDate: new Date(endDate!),
    numNights,
    cabinPrice,
    cabinId: id,
  };

  const createReservationWithData = createReservation.bind(
    null,
    reservationData
  );

  if (!data?.user) return <LoginMessage />;

  return (
    <div className="flex flex-col">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-4 items-center">
          <div className="relative h-8 w-8">
            {data?.user && (
              <Image
                fill
                className=" rounded-full "
                src={data?.user?.image || defaultAvatar}
                alt={data?.user?.name || "User image"}
                referrerPolicy="no-referrer"
              />
            )}
          </div>
          <p>{data.user.name}</p>
        </div>
      </div>

      <form
        action={async (formData) => {
          await createReservationWithData(formData);
          resetRange();
        }}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col h-full"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          {!(startDate && endDate) ? (
            <p className="text-primary-300 text-base">
              Start by selecting dates
            </p>
          ) : (
            <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
