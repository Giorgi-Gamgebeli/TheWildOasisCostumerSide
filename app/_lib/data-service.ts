import { eachDayOfInterval, subDays } from "date-fns";
import prisma from "./db";
import { z } from "zod";
import {
  CabinsSchemaDatabase,
  ReservationsSchemaDatabase,
  UserSchemaDatabase,
} from "../_schemas/databaseSchemas";
import { CreateUserSchema } from "../_schemas/userSchemas";

/////////////
// GET

export async function getCabin(
  id: z.infer<typeof CabinsSchemaDatabase.shape.id>
) {
  const result = CabinsSchemaDatabase.shape.id.safeParse(id);

  if (!result.success) throw new Error("Validation failed on server!");

  const parsedID = result.data;

  try {
    const cabin = await prisma.cabins.findUnique({
      where: {
        id: parsedID,
      },
    });

    if (!cabin) throw new Error("Could't get cabin");

    return cabin;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't get cabin");
  }
}

export async function getCabinPrice(
  id: z.infer<typeof CabinsSchemaDatabase.shape.id>
) {
  const result = CabinsSchemaDatabase.shape.id.safeParse(id);

  if (!result.success)
    return {
      zodErrors: result.error.flatten().fieldErrors,
    };

  const parsedID = result.data;

  try {
    const cabinPrice = await prisma.cabins.findUnique({
      where: {
        id: parsedID,
      },
      select: {
        regularPrice: true,
        discount: true,
      },
    });

    return cabinPrice;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't get cabin price");
  }
}

export async function getCabins() {
  try {
    const cabins = await prisma.cabins.findMany({
      select: {
        id: true,
        name: true,
        maxCapacity: true,
        regularPrice: true,
        discount: true,
        image: true,
      },
    });

    return cabins;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't get cabins");
  }
}

export async function getCabinsLength() {
  try {
    const cabinsLength = await prisma.cabins.count();

    return cabinsLength;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't get cabins length");
  }
}

export async function getUser(
  email: z.infer<typeof UserSchemaDatabase.shape.email>
) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      nationalID: true,
      nationality: true,
    },
  });

  // No error here! We handle the possibility of no guest in the sign in callback
  return user;
}

export async function getReservation(
  id: z.infer<typeof ReservationsSchemaDatabase.shape.id>
) {
  try {
    const reservation = await prisma.reservations.findUnique({
      where: {
        id,
      },
      select: {
        numGuests: true,
        observations: true,
        cabin: {
          select: {
            maxCapacity: true,
          },
        },
      },
    });

    return reservation;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't get reservation");
  }
}

export async function getReservations(
  userId: z.infer<typeof UserSchemaDatabase.shape.id>
) {
  try {
    const reservations = await prisma.reservations.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        createdAt: true,
        startDate: true,
        endDate: true,
        numNights: true,
        numGuests: true,
        totalPrice: true,
        userId: true,
        cabinId: true,
        cabin: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return reservations;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't get reservations");
  }
}

export async function getReservedDatesByCabinId(
  cabinId: z.infer<typeof CabinsSchemaDatabase.shape.id>
) {
  const today = subDays(new Date(), 1);
  today.setUTCHours(0, 0, 0, 0);

  try {
    const dates = await prisma.reservations.findMany({
      where: {
        cabinId,
        OR: [
          {
            startDate: { gte: today },
          },
          {
            status: "checked_in",
          },
        ],
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });

    const reservedDates = dates
      .map((reservation) => {
        return eachDayOfInterval({
          start: new Date(reservation.startDate),
          end: new Date(reservation.endDate),
        });
      })
      .flat();

    return reservedDates;
  } catch (error) {
    console.error(error);
    throw new Error("Error happend while trying to search for reservedDates");
  }
}

export async function getSettings() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 1 },
    });

    if (!settings) throw new Error("No settings found");

    return settings;
  } catch (error) {
    console.error(error);
    throw new Error("No settings found");
  }
}

export async function getCountries(): Promise<
  {
    name: string;
    flag: string;
    independent: boolean;
  }[]
> {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag"
    );

    const countries = await res.json();

    return countries;
  } catch (error) {
    console.error(error);
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createUser(user: z.infer<typeof CreateUserSchema>) {
  try {
    await prisma.user.create({
      data: user,
    });
  } catch (error) {
    console.error(error);
    throw new Error("User could not be created");
  }
}

// export async function createReservation(
//   reservation: z.infer<typeof ReservationsSchemaDatabase>
// ) {
//   try {
//     const newReservation = await prisma.reservations.create({
//       data: reservation,
//     });

//     return newReservation;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Reservation could not be created");
//   }
// }

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
// export async function updateUser(data: z.infer<typeof UserSchemaDatabase>) {
//   try {
//     const updatedUser = await prisma.user.update({
//       where: {
//         id: data.id,
//       },
//       data,
//     });

//     return updatedUser;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Guest could not be updated");
//   }
// }

// export async function updateReservation(
//   data: z.infer<typeof ReservationsSchemaDatabase>
// ) {
//   try {
//     const newReservation = await prisma.reservations.update({
//       where: {
//         id: data.id,
//       },
//       data,
//     });

//     return newReservation;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Reservation could not be updated");
//   }
// }

/////////////
// DELETE

// export async function deleteReservation(
//   id: z.infer<typeof ReservationsSchemaDatabase.shape.id>
// ) {
//   try {
//     await prisma.reservations.delete({
//       where: {
//         id,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     throw new Error("Reservation could not be deleted");
//   }
// }
