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
import { useTransition } from "react";

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
  const [isPending, startTransition] = useTransition();

  // const createReservationWithData = createReservation.bind(
  //   null,
  //   reservationData
  // );

  async function createReservationWithData(formData: FormData) {
    startTransition(async () => {
      await createReservation(reservationData, formData);
    });
  }

  if (!data?.user) return <LoginMessage />;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between bg-primary-800 px-16 py-2 text-primary-300">
        <p>Logged in as</p>

        <div className="flex items-center gap-4">
          <div className="relative h-8 w-8">
            {data?.user && (
              <Image
                fill
                className="rounded-full"
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
          resetRange();
          await createReservationWithData(formData);
        }}
        className="flex h-full flex-col gap-5 bg-primary-900 px-16 py-10 text-lg"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            disabled={isPending}
            className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
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
            disabled={isPending}
            name="observations"
            className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex items-center justify-end gap-6">
          {!(startDate && endDate) ? (
            <p className="text-base text-primary-300">
              Start by selecting dates
            </p>
          ) : (
            <SubmitButton disabled={isPending} pendingLabel="Reserving...">
              Reserve now
            </SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
