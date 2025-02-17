import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  nationallity: "string";
};

declare module "next-auth" {
  interface Session {
    user: ExdtendedUser;
  }
}
