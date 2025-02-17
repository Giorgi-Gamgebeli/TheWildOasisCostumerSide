"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { UpdateUserSchema } from "../_schemas/userSchemas";
import prisma from "./db";
import {
  CreateReservationBindedData,
  CreateReservationSchema,
  UpdateReservationSchema,
} from "../_schemas/reservationSchemas";
import { z } from "zod";
import { ReservationsSchemaDatabase } from "../_schemas/databaseSchemas";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function updateUser(values: z.infer<typeof UpdateUserSchema>) {
  const result = UpdateUserSchema.safeParse(values);

  if (!result.success) throw new Error("Validation failed on server");

  const { nationalityAndCountryFlag, nationalID } = result.data;
  const [nationality, countryFlag] = nationalityAndCountryFlag?.split("%") || [
    null,
    null,
  ];

  try {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        nationality,
        countryFlag,
        nationalID,
      },
    });

    revalidatePath("/account/profile");
  } catch (error) {
    console.log(error);
    return { error: "User could not be updated" };
  }
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function createReservation(
  reservationData: z.infer<typeof CreateReservationBindedData>,
  formData: FormData
) {
  const dataObj = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations"),
    ...reservationData,
  };

  const result = CreateReservationSchema.safeParse(dataObj);

  if (!result.success)
    return {
      zodErrors: result.error.flatten().fieldErrors,
    };

  const { numGuests, observations, cabinPrice } = result.data;

  try {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    const newReservation = {
      ...reservationData,
      numGuests,
      observations: observations?.slice(0, 1000) || "",
      extrasPrice: 0,
      totalPrice: cabinPrice,
      isPaid: false,
      hasBreakfast: false,
      status: "unconfirmed" as const,
    };

    await prisma.reservations.create({
      data: { ...newReservation, userId: session.user.id },
    });

    revalidatePath(`/cabins/${reservationData.cabinId}`);

    redirect("/cabins/thankyou");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.log(error);
    throw new Error("Reservation could not be created");
  }
}

export async function deleteReservation(
  id: z.infer<typeof ReservationsSchemaDatabase.shape.id>
) {
  const result = ReservationsSchemaDatabase.shape.id.safeParse(id);

  if (!result.success)
    return {
      zodErrors: result.error.flatten().fieldErrors,
    };

  const reservationId = result.data;

  try {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    const guestReservations = await prisma.reservations.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    const guestBookingIds = guestReservations.map(
      (reservation) => reservation.id
    );

    if (!guestBookingIds.includes(reservationId))
      throw new Error("Your are not allowed to delete this booking");

    await prisma.reservations.delete({
      where: {
        id,
      },
    });

    revalidatePath("/account/reservations");
  } catch (error) {
    console.log(error);
    throw new Error("Booking could not be deleted");
  }
}

export async function updateReservation(
  data: z.infer<typeof UpdateReservationSchema>
) {
  const result = UpdateReservationSchema.safeParse(data);

  if (!result.success) throw new Error("Validation failed on server!");

  const { numGuests, observations, id } = result.data;

  try {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    const guestReservations = await prisma.reservations.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    const guestBookingIds = guestReservations.map(
      (reservation) => reservation.id
    );

    if (!guestBookingIds.includes(id))
      throw new Error("Your are not allowed to update this reservation");

    await prisma.reservations.update({
      where: {
        id,
      },
      data: {
        numGuests,
        observations,
      },
    });

    revalidatePath("/account/reservations");
    revalidatePath(`/account/reservations/edit/${id}`);

    redirect("/account/reservations");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.log(error);
    return { error: "Reservation could not be updated" };
  }
}
