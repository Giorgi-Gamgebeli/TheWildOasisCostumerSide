import DateSelector from "@/app/cabins/[cabinId]/DateSelector";
import ReservationForm from "@/app/cabins/[cabinId]/ReservationForm";
import {
  getReservedDatesByCabinId,
  getSettings,
} from "../../_lib/data-service";
import { z } from "zod";
import { CabinsSchemaDatabase } from "../../_schemas/databaseSchemas";

type ReservationProps = {
  cabin: z.infer<typeof CabinsSchemaDatabase>;
};

async function Reservation({ cabin }: ReservationProps) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getReservedDatesByCabinId(cabin.id),
  ]);

  return (
    <div className="flex min-h-[400px] justify-between">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />

      <ReservationForm cabin={cabin} />
    </div>
  );
}

export default Reservation;
