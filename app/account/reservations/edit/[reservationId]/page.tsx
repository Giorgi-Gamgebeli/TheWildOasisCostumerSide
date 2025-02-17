import { getReservation } from "@/app/_lib/data-service";
import ReservationEditForm from "./ReservationEditForm";

type PageProps = {
  params: Promise<{
    reservationId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { reservationId } = await params;
  const reservation = await getReservation(+reservationId);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{reservationId}
      </h2>

      <ReservationEditForm
        reservationId={+reservationId}
        reservation={reservation}
      />
    </div>
  );
}
