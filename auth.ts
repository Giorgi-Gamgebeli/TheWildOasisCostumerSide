import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { createUser } from "@/app/_lib/data-service";
import prisma from "./app/_lib/db";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async signIn({ user }) {
      try {
        const existingGuest = await prisma.user.findUnique({
          where: {
            email: user.email as string,
          },
          select: {
            id: true,
          },
        });

        if (!existingGuest)
          await createUser({
            email: user.email as string,
            name: user.name as string,
          });

        return true;
      } catch {
        return false;
      }
    },

    async session({ session }) {
      const guest = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        select: {
          id: true,
          nationalID: true,
          nationality: true,
          countryFlag: true,
        },
      });

      session.user.id = guest?.id;
      session.user.nationality = guest?.nationality;
      session.user.nationalID = guest?.nationalID;
      session.user.countryFlag = guest?.countryFlag;

      return session;
    },
  },
  ...authConfig,
});
