"use client";

import Spinner from "@/app/_components/Spinner";
import SubmitButton from "@/app/_components/SubmitButton";
import { updateReservation } from "@/app/_lib/actions";
import { UpdateReservationSchema } from "@/app/_schemas/reservationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type ReservationEditForm = {
  reservation: {
    numGuests: number;
    observations: string | null;
    cabin: {
      maxCapacity: number;
    };
  } | null;
  reservationId: number;
};

function ReservationEditForm({
  reservation,
  reservationId,
}: ReservationEditForm) {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<z.infer<typeof UpdateReservationSchema>>({
    resolver: zodResolver(UpdateReservationSchema),
    defaultValues: {
      id: reservationId,
    },
  });

  const [isPending, startTransition] = useTransition();

  if (!reservation) return <Spinner />;

  const {
    numGuests,
    observations,
    cabin: { maxCapacity },
  } = reservation;

  async function onSubmit(values: z.infer<typeof UpdateReservationSchema>) {
    startTransition(async () => {
      const res = await updateReservation(values);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Reservation updated sucessfully!");
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 bg-primary-900 px-12 py-8 text-lg"
    >
      <input
        name="reservationId"
        type="hidden"
        readOnly
        value={reservationId}
      />
      <div className="space-y-2">
        <label htmlFor="numGuests">How many guests?</label>
        <select
          {...register("numGuests", { valueAsNumber: true })}
          defaultValue={numGuests}
          className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
          required
          disabled={isPending}
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
          {...register("observations")}
          defaultValue={observations || ""}
          className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
        <span className="mt-4 block font-medium text-red-600">
          {errors["observations"] && (errors["observations"].message as string)}
        </span>
      </div>

      <input hidden {...register("id")} />

      <div className="flex items-center justify-end gap-6">
        <SubmitButton disabled={isPending} pendingLabel="Updating...">
          Update reservation
        </SubmitButton>
      </div>
    </form>
  );
}

export default ReservationEditForm;
