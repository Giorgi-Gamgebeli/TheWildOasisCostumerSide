"use client";

import ReservationCard from "./ReservationCard";
import { useOptimistic } from "react";
import { deleteReservation } from "../../_lib/actions";
import { z } from "zod";
import { ReservationsSchemaDatabase } from "@/app/_schemas/databaseSchemas";

type ReservationListProps = {
  reservations: {
    id: number;
    createdAt: Date;
    startDate: Date;
    endDate: Date;
    numNights: number | null;
    numGuests: number;
    totalPrice: number | null;
    cabinId: number;
    userId: string;
    cabin: {
      name: string;
      image: string;
    };
  }[];
};

function ReservationList({ reservations }: ReservationListProps) {
  const [optimisticReservations, optimisticDelete] = useOptimistic(
    reservations,
    (curReservations, reservationId) => {
      return curReservations.filter(
        (reservation) => reservation.id !== reservationId
      );
    }
  );

  async function handleDelete(
    reservationId: z.infer<typeof ReservationsSchemaDatabase.shape.id>
  ) {
    optimisticDelete(reservationId);
    await deleteReservation(reservationId);
  }

  return (
    <ul className="space-y-6">
      {optimisticReservations.map((reservation) => (
        <ReservationCard
          reservation={reservation}
          onDelete={handleDelete}
          key={reservation.id}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
