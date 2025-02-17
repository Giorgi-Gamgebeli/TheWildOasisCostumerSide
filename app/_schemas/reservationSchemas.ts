import { ReservationsSchemaDatabase } from "./databaseSchemas";

export const CreateReservationSchema = ReservationsSchemaDatabase.pick({
  startDate: true,
  endDate: true,
  numNights: true,
  cabinPrice: true,
  cabinId: true,
  numGuests: true,
  observations: true,
});

export const CreateReservationBindedData = CreateReservationSchema.omit({
  numGuests: true,
  observations: true,
});

export const UpdateReservationSchema = ReservationsSchemaDatabase.pick({
  id: true,
  numGuests: true,
  observations: true,
});
