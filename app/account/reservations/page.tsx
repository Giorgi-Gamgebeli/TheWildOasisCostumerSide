import ReservationList from "@/app/account/reservations/ReservationList";
import { auth } from "@/auth";
import { getReservations } from "@/app/_lib/data-service";
import Link from "next/link";

export default async function Page() {
  const session = await auth();
  const reservations = await getReservations(session?.user?.id);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      {reservations.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <Link className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </Link>
        </p>
      ) : (
        <ReservationList reservations={reservations} />
      )}
    </div>
  );
}
